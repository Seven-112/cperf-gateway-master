import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { ITenderAnswerExecution } from "app/shared/model/microprovider/tender-answer-execution.model";
import axios from 'axios'
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import React from "react";
import { translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import FileManager from "app/shared/component/file-manager";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    catBox:{
        borderColor: theme.palette.info.dark,
    },
    criteriaBox:{
        borderColor: theme.palette.success.dark,
    },
    ponderationBox:{
        borderColor: theme.palette.primary.dark,
    },
}))

interface TenderAnswerExecutionUpdateProps extends DispatchProps{
    answer: ITenderAnswer,
    userId:any,
    readonly?:boolean,
    open?:boolean,
    onExecute?: Function,
    onClose:Function,
}

export const TenderAnswerExecutionUpdate = (props: TenderAnswerExecutionUpdateProps) =>{
    const { open, answer, userId, readonly} = props;
    const [execution, setExecution] = useState<ITenderAnswerExecution>({});
    const [files, setFiles] = useState<IMshzFile[]>([])
    const [isNew, setIsNew] = useState(true)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openFileEditor, setOpenFileEditor] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const fileTag = FileEntityTag.tenderAnswerExecution;

    const classes = useStyles();

    const getFiles = (executionId: any) =>{
        if(executionId){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(executionId, fileTag)
                .then(res => setFiles(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const initializeExecution = () =>{
        if(answer){
            setLoading(true);
             axios.get<ITenderAnswerExecution[]>(`${API_URIS.tenderExecutionApiUri}/?answerId.equals=${answer.id}`)
                .then(res =>{
                if(res.data && res.data.length !== 0){
                    setExecution(res.data[res.data.length-1]);
                    getFiles(res.data[res.data.length-1].id);
                    setIsNew(false);
                }else{
                    setExecution({});
                    setIsNew(true);
                }
            }).catch(e =>{
                console.log(e)
            }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        initializeExecution();
    }, [props.answer])

    const handleClose = () => {
        props.onClose();
    }

    const handleSaveFile = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !==0){
            setFiles([...files, ...saved])
        }
    }

    const handleRemoveFile = (deletedId?:any) =>{
        if(deletedId){
            setFiles(files.filter(f => f.id !== deletedId));
        }
    }

    const saveFiles = (ex: ITenderAnswerExecution) =>{
        if(ex && ex.id && isNew){
            props.setFileUploadWillAssociateEntityId(ex.id)
            props.associateFilesToEntity(ex.id, fileTag.toString(), userId);
            setLoading(false);
        }
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        if(execution && answer && userId){
            setLoading(true)
            const entity: ITenderAnswerExecution={
                ...execution,
                answer,
                userId,
            }
            const request = isNew ? axios.post<ITenderAnswerExecution>(`${API_URIS.tenderExecutionApiUri}`, cleanEntity(entity))
                    : axios.put<ITenderAnswerExecution>(`${API_URIS.tenderExecutionApiUri}`, cleanEntity(entity))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    if(props.onExecute){
                        props.onExecute(res.data);
                    }
                    saveFiles(res.data);
                    if(!isNew)
                        setShowMessage(true)
                }else{
                    setSuccess(false);
                }
            }).catch(e =>{
                setSuccess(false);
                setShowMessage(true);
            }).finally(() => setLoading(false))
        }
    }

    return (
        <React.Fragment>  
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                            <Typography variant="h4" className="mr-5">{translate("_tender.finishExecution")}</Typography>
                        </Box>}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSave}>
                        {showMessage && <Grid item xs={12}>
                                <Alert severity={success? "success" : "error"} 
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setShowMessage(false);
                                        }}
                                        >
                                        <Close fontSize="inherit" />
                                        </IconButton>}
                                    >
                                        {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                </Alert>
                            </Grid>
                            }
                            <Grid container spacing={2}>
                                {loading && 
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                        boxShadow={1} className={classes.catBox} borderLeft={10} borderRadius={3} p={1}>
                                        <CircularProgress />
                                        <Typography className="ml-3">Loading</Typography>
                                    </Box>
                                </Grid>
                                }
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" flexDirection="column"
                                         justifyContent="center" alignItems="center"
                                         flexWrap="wrap" overflow="auto"
                                         >
                                            <Typography className="mb-3">{translate("_tender.files")}</Typography>
                                            <FileManager
                                                files={[...files]}
                                                onSave={handleSaveFile}
                                                onRemove={handleRemoveFile}
                                                withClearPreviewerItem={!readonly}
                                                selectMultiple
                                                readonly={readonly}
                                                entityId={execution ? execution.id : null}
                                                entityTagName={fileTag}
                                            />
                                         </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth
                                        multiline
                                        name="justification"
                                        margin="dense"
                                        variant="outlined"
                                        size="small"
                                        label={translate("microgatewayApp.microproviderTenderAnswerExecution.comment")}
                                        InputLabelProps={{ shrink: true}}
                                        value={execution.comment}
                                        onChange={(e) => {
                                            if(!readonly){
                                                setExecution({...execution, comment: e.target.value})
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                        <Button type="submit" variant="text" color="primary" className="text-capitalize"
                                            disabled={(!execution || !answer || !userId || readonly)}>
                                            {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } : IRootState) => ({
    account: authentication.account,
});

const mapDispatchToProps = {
    associateFilesToEntity, 
    setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(TenderAnswerExecutionUpdate);