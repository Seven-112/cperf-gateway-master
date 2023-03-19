import { Box, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, downLoadFile, fileIsReadableOnBrowser } from "app/shared/util/helpers";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import EditFileModal from "app/shared/component/edit-file-modal";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { ProjectTaskFileType } from "app/shared/model/enumerations/project-task-file-type.model";
import { IProjectTaskFile } from "app/shared/model/microproject/project-task-file.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MshzFileUploadProgressPreviewer } from "app/shared/component/file-upload-progress-previewer";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            width: '90%',
        }
    },
}))

interface IProjectTaskFileModalProps{
    task: IProjectTask,
    open: boolean,
    type: ProjectTaskFileType,
    canDelete?: boolean,
    canAdd?: boolean,
    onClose: Function,
}

export const ProjectTaskFileModal = (props: IProjectTaskFileModalProps) =>{

   const [loading, setLoading] = useState(false);

   const [tFiles, setTFiles] = useState<IProjectTaskFile[]>([]);

   const [files, setFiles] = useState<IMshzFile[]>([]);

   const [openEditFileModal, setOpenEditFileModal] = useState(false);

   const getFiles = () =>{
       if(props.task && serviceIsOnline(SetupService.FILEMANAGER)){
        setLoading(true);
        axios.get<IProjectTaskFile[]>(`${API_URIS.projectTaskFileApiUri}/?taskId.equals=${props.task.id}&type.equals=${props.type}`)
             .then(res =>{
                 if(res.data && res.data.length !== 0){
                     setTFiles([...res.data]);
                     const fileIds = res.data.map(tf => tf.fileId);
                     setLoading(true);
                     axios.get<IMshzFile[]>(`${API_URIS.mshzFileApiUri}/?id.in=${fileIds}`)
                         .then(resp =>{
                             if(resp.data){
                                 setFiles([...resp.data]);
                             }
                         }).catch(e =>{
                             /* eslint-disable no-console */
                             console.log(e);
                         }).finally(()=>{
                             setLoading(false);
                         })
                 }
             }).catch(() =>{}).finally(() =>{
                 setLoading(false);
             })
       }
   }

   useEffect(() =>{
        getFiles();
   }, [props.task])

   const handleClose = () =>{
        props.onClose(files.length);
   }

   const handleSaveFiles = (savedFiles: IMshzFile[]) =>{
       console.log(savedFiles)
        if(savedFiles && savedFiles.length  !==0){
            setFiles([...savedFiles, ...files]);
            savedFiles.map(sf =>{
                const itf: IProjectTaskFile = {
                    fileId: sf.id, 
                    fileName:sf.name,
                    type: props.type,
                    taskId: props.task ? props.task.id : null,
                }
                axios.post<IProjectTaskFile>(`${API_URIS.projectTaskFileApiUri}`, cleanEntity(itf))
                    .then(res =>{
                        setTFiles([res.data,...tFiles]);
                    }).catch(e =>{
                        /* eslint-disable no-console */
                        console.log(e);
                    })
            });
        }
        setOpenEditFileModal(false);
   }

   const handleRemoveFile = (file: IMshzFile) =>{
       if(file && serviceIsOnline(SetupService.FILEMANAGER)){
           const fileId = file.id;
           axios.delete(`${API_URIS.mshzFileApiUri}/${file.id}`)
                .then(() =>{
                    setFiles([...files.filter(f => f.id !== fileId)]);
                    setTFiles([...tFiles.filter(tf => tf.fileId !== fileId)]);
                    // deleting task file id
                    axios.get<IProjectTaskFile[]>(`${API_URIS.projectTaskFileApiUri}/?fileId.equals=${fileId}`)
                        .then(resp =>{
                            resp.data.forEach(item =>{
                                axios.delete(`${API_URIS.projectTaskFileApiUri}/${item.id}`)
                                    .then(() =>{ }).catch(() =>{})
                            })
                        }).catch(() =>{})
                }).catch((e) =>{
                    /* eslint-disable no-console */
                    console.log(e);
                });
       }
   }

  const handleOpenFile = (file: IMshzFile) =>{
      if(fileIsReadableOnBrowser(file)){
          const win = window.open('/file-viewer/'+file.id, '_blank');
          if (win != null) {
            win.focus();
          }
      }else{
          downLoadFile(file);
      }
  }
   
   const classes = useStyles();

   const fileTag = props.type === ProjectTaskFileType.VALIDATION ? 
                    FileEntityTag.projectTaskFileValidation :
                        props.type === ProjectTaskFileType.SOUMISSION ? 
                            FileEntityTag.projectTaskFileSubmition :
                            FileEntityTag.projectTaskFileDescription;
    
    const fileTypeSrt = `${translate(`microgatewayApp.TaskFileType.${props.type.toString()}`)}`;

   return (
       <React.Fragment>
           {props.canAdd && props.task && <EditFileModal 
                open={openEditFileModal} selectMultiple
                entityId={props.task.id} entityTagName={fileTag}
                withClearPreviewerItem onSaved={handleSaveFiles}
                onCloseNoCancelSaving={() => setOpenEditFileModal(false)}
            />}
            <MyCustomModal 
                open={props.open}
                avatarIcon={<FontAwesomeIcon icon={faFile} size="1x" color="primary" />}
                title={`${translate("_global.label.files")} ${translate("_global.label.of")} ${fileTypeSrt.toLowerCase()}`} 
                customActionButtons={<>
                    {props.canAdd &&
                        <Tooltip title={translate("_global.label.add")}
                            onClick={() => setOpenEditFileModal(true)}>
                            <IconButton>
                                <Add />
                            </IconButton>
                        </Tooltip>
                    }
                </>}
                footer={
                    <Box display="flex" justifyContent="center" textAlign="center" width={1}>
                        <Typography variant="caption" 
                        style={{ fontSize: '10px'}}>
                            {props.task.name}
                        </Typography>
                    </Box>
                }
                rootCardClassName={classes.card}
                onClose={handleClose}
                >
                {loading && <Box width={1} textAlign="center">Loaging...</Box>}
                <Box width={1}>
                    {[...files].map((file, index) =>(
                        <MshzFileUploadProgressPreviewer 
                            key={index}
                            file={file}
                            preventOnRemove={!props.canDelete}
                            onRemove={handleRemoveFile}
                            boxProps={{
                                mb: 1,
                            }}
                        />
                    ))}
                </Box>
            </MyCustomModal>
       </React.Fragment>
   );
}

export default ProjectTaskFileModal;