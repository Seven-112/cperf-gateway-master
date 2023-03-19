import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, Slide, TextField, Typography } from "@material-ui/core";
import { Close, Edit, InsertDriveFile } from "@material-ui/icons";
import { SaveButton } from "app/shared/component/custom-button";
import ModalFileManager from "app/shared/component/modal-file-manager";
import MyCustomRTEModal from "app/shared/component/my-custom-rte-modal";
import MyToast from "app/shared/component/my-toast";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IItemCheckJustification } from "app/shared/model/microprocess/item-check-justification.model";
import { IRootState } from "app/shared/reducers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { associateFilesToEntity } from 'app/shared/reducers/file-upload-reducer';
import { connect } from "react-redux";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { getSession } from "app/shared/reducers/authentication";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

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
            width: '85%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
      background: 'white',
      minHeight: '20vh',
      maxHeight: '70vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px', 
    },
    truncate:{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    descCard:{
        width: '43%',
        [theme.breakpoints.down("sm")]:{
            width: '85%',
        },
    },
}))

interface IItemCheckJustificationUpdateProps extends StateProps, DispathProps{
    entity: IItemCheckJustification,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const ItemCheckJustificationUpdate = (props: IItemCheckJustificationUpdateProps) =>{
    const { open } = props;
    const [entity, setEntity] = useState<IItemCheckJustification>(props.entity);
    const [isNew, setIsNew] = useState(!props.entity || !props.entity.id);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [openFileManager, setOpenFileManager] = useState(false);
    const [openJustif, setOpenJustif] = useState(false);

    const classes = useStyles();

    const fileTag = FileEntityTag.processCheckItemJustification;

    const formIsValid = (entity && (entity.justification || [...files].length !== 0)) ? true: false;

    const getFiles = () =>{
        if(props.entity && props.entity.id && serviceIsOnline(SetupService.FILEMANAGER)){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(props.entity.id, fileTag)
                .then(res => {
                    setFiles([...res.data])
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }else{
            setFiles([])
        }
    }

    const onLoadedFiles = (loaded?: IMshzFile[]) =>{
        if(loaded && loaded.length !== 0){
            const newFiles = loaded.filter(lf => ![...files].some(f => f.id === lf.id))
            setFiles([...files, ...newFiles]);
        }
    }

    const onRemoveFile = (deletedId) =>{
        if(deletedId){
            setFiles([...files].filter(f => f.id !== deletedId));
        }
    }

    const savedUnSavedFiles = (saved: IItemCheckJustification) =>{
        if(saved && saved.id){

            if(props.account)
                props.associateFilesToEntity(saved.id, fileTag.toString(), props.account.id);

            if(props.onSave)
                props.onSave(saved, isNew);

            props.onClose();
        }
    }

    useEffect(() =>{
        setEntity(props.entity);
        setIsNew(!props.entity || !props.entity.id);
        getFiles();
        if(!props.account)
            props.getSession();
    }, [props.entity])

    const handleClose = () => props.onClose();

    const handleSubmit = (event) =>{
        event.preventDefault();
        setError(false);
        if(formIsValid){
            setLoading(true);
            const req = isNew ? axios.post<IItemCheckJustification>(API_URIS.taskItemCheckJustificationApiUri, cleanEntity(entity))
                                : axios.put<IItemCheckJustification>(API_URIS.taskItemCheckJustificationApiUri, cleanEntity(entity));
            req.then(res =>{
                if(res.data){
                    setEntity(res.data)
                    savedUnSavedFiles(res.data);
                }else{
                    setError(true);
                }
            }).catch(e => console.log(e))
              .finally(() =>{
                  setLoading(false)
              })
        }
    }

    return (
        <React.Fragment>
        <MyToast 
            open={error}
            message={translate(`_global.flash.message.failed`)}
            snackBarProps={{
                autoHideDuration:200,
            }}
            alertProps={{
                color: 'error',
                onClose: () => setError(false),
            }}
        />
        <ModalFileManager 
            open={openFileManager}
            files={[...files]}
            entityId={entity && entity.id ? entity.id : null}
            entityTagName={fileTag}
            selectMultiple
            title={translate("_global.label.files")}
            onRemove={onRemoveFile}
            onSave={onLoadedFiles}
            onClose={() => setOpenFileManager(false)}
        />
        {entity && 
            <MyCustomRTEModal 
            open={openJustif}
            content={entity.justification}
            title={translate('microgatewayApp.microprocessItemCheckJustification.justification')}
            onClose={() => setOpenJustif(false)}
            onSave={value => {setEntity({...entity, justification: value}); setOpenJustif(false) }}
            cardClassName={classes.descCard}
            editorMinHeight={300}
        />}
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
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={faTasks} />
                                    <Typography variant="h4" className="ml-3">
                                        {translate("microgatewayApp.microprocessItemCheckJustification.home.createOrEditLabel")}
                                    </Typography>
                                </Box>
                            }
                            action={
                                <Box display="flex" alignItems="center">
                                <IconButton 
                                    color="inherit"
                                    onClick={handleClose}>
                                    <Close />
                                </IconButton>
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} mb={3} display="flex" 
                                    justifyContent="center" alignItems="center" flexWrap="wrap">
                                <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                <Typography className="ml-2" color="secondary">Loading...</Typography>    
                            </Box>}
                            {entity && <Box width={1}>
                                <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Box display={"flex"} width={1} justifyContent={"center"}
                                         alignItems={"center"} flexWrap={"wrap"} overflow={"auto"}>
                                         <TextField
                                             value={entity.justification}
                                             type="hidden"/>
                                          <Button 
                                            variant="text" 
                                            className="text-capitalize"
                                            color="primary" endIcon={<Edit />}
                                            onClick={() => setOpenJustif(true)}>
                                                {translate("microgatewayApp.microprocessItemCheckJustification.justification")}
                                          </Button>
                                          <Button 
                                            variant="text" 
                                            className="text-capitalize ml-3"
                                            color="default" 
                                            endIcon={<InsertDriveFile />}
                                            onClick={() => setOpenFileManager(true)}>
                                                {translate("_global.label.files")}
                                          </Button>
                                         </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap">
                                            <SaveButton type="submit" disabled={!formIsValid} />
                                        </Box>
                                    </Grid>
                                </Grid>
                                </form>
                            </Box>}
                        </CardContent>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
})

const mapDispatchToProps = {
    associateFilesToEntity,
    getSession 
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispathProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationUpdate);
