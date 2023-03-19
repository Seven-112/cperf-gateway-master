import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Badge, Box, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, Slide, TextField, Typography } from "@material-ui/core";
import { Close, InsertDriveFile } from "@material-ui/icons";
import { SaveButton } from "app/shared/component/custom-button";
import ModalFileManager from "app/shared/component/modal-file-manager";
import MyToast from "app/shared/component/my-toast";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IProjectItemCheckJustification } from "app/shared/model/microproject/project-item-check-justification.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer'
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";

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
      }
}))

interface IProjectItemCheckJustificationUpdateProps extends StateProps, DispatchProps{
    entity: IProjectItemCheckJustification,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const ProjectItemCheckJustificationUpdate = (props: IProjectItemCheckJustificationUpdateProps) =>{
    const { open } = props;
    const [entity, setEntity] = useState<IProjectItemCheckJustification>(props.entity);
    const [isNew, setIsNew] = useState(!props.entity || !props.entity.id);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [openFileManager, setOpenFileManager] = useState(false);

    const classes = useStyles();

    const formIsValid = (entity && (entity.justification || [...files].length !== 0)) ? true: false;

    const fileTag = FileEntityTag.projectCheckItemJustification;

    const getFiles = () =>{
        if(props.entity && props.entity.id){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(props.entity.id,fileTag)
                .then(res => {
                    setFiles(res.data)
                })
                .catch(e => console.log(e))
                .finally(() => {
                    setLoading(false)
                });
        }else{
            setFiles([])
        }
    }

    const onLoadedFiles = (loaded?: IMshzFile[]) =>{
        if(loaded && loaded.length !== 0){
            setFiles([...files, ...loaded]);
        }
    }

    const onRemoveFile = (deletedId) =>{
        setFiles([...files].filter(f => f.id !== deletedId))
    }

    const savedUnSavedFiles = (saved: IProjectItemCheckJustification) =>{
        if(saved && saved.id){
            if(props.account && isNew){
                props.setFileUploadWillAssociateEntityId(saved.id);
                props.associateFilesToEntity(saved.id, fileTag.toString(), props.account.id);
            }

            setLoading(false)

            if(props.onSave)
                props.onSave(saved, isNew);
            else
                props.onClose();
        }
    }

    useEffect(() =>{
        setEntity(props.entity);
        setIsNew(!props.entity || !props.entity.id);
        getFiles();
    }, [props.entity])

    const handleClose = () => props.onClose();

    const handleSubmit = (event) =>{
        event.preventDefault();
        setError(false);
        if(formIsValid){
            setLoading(true);
            const req = isNew ? axios.post<IProjectItemCheckJustification>(API_URIS.projecttaskItemCheckJustificationApiUri, cleanEntity(entity))
                                : axios.put<IProjectItemCheckJustification>(API_URIS.projecttaskItemCheckJustificationApiUri, cleanEntity(entity));
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
            entityId={entity.id}
            entityTagName={fileTag}
            selectMultiple
            title={translate("_global.label.files")}
            onRemove={onRemoveFile}
            onSave={onLoadedFiles}
            onClose={() => setOpenFileManager(false)}
        />
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
                                        <TextField
                                            value={entity.justification}
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label={entity.justification ? '' : translate("microgatewayApp.microprocessItemCheckJustification.justification")}
                                            placeholder={translate("microgatewayApp.microprocessItemCheckJustification.justification")}
                                            onChange={(e) => setEntity({...entity, justification: e.target.value})}
                                         />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                                            <Typography className="mr-3">
                                                {translate("_global.label.files")}
                                            </Typography>
                                            <IconButton 
                                                title={translate("entity.action.view")}
                                                onClick={() => setOpenFileManager(true)}>
                                                <Badge badgeContent={[...files].length} color="primary">
                                                    <InsertDriveFile color="action" />
                                                </Badge>
                                            </IconButton>
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

const mapStateToProps = ({ authentication } : IRootState) => ({
    account : authentication.account,
}) 

const mapDispatchToProps = {
    associateFilesToEntity,
    setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationUpdate);
