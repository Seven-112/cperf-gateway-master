import { Box, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { TaskFileType } from "app/shared/model/enumerations/task-file-type.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import EditFileModal from "app/shared/component/edit-file-modal";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { MshzFileUploadProgressPreviewer } from "app/shared/component/file-upload-progress-previewer";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            width: '90%',
        }
    },
}))

interface ITaskFileModalProps{
    task: ITask,
    open: boolean,
    type: TaskFileType,
    canDelete?: boolean,
    canAdd?: boolean,
    onClose: Function,
}

export const TaskFileModal = (props: ITaskFileModalProps) =>{

   const [loading, setLoading] = useState(false);

   const [files, setFiles] = useState<IMshzFile[]>([]);

   const [openEditFileModal, setOpenEditFileModal] = useState(false);

   const fileTag = props.type === TaskFileType.VALIDATION ? 
                    FileEntityTag.processTaskFileValidation :
                        props.type === TaskFileType.SOUMISSION ? 
                            FileEntityTag.processTaskFileSubmition :
                            FileEntityTag.processTaskFileDescription;

   const getFiles = () =>{
       if(props.task){
        setLoading(true);
        getMshzFileByEntityIdAndEntityTag(props.task.id, fileTag)
            .then(resp =>{
                if(resp.data){
                    setFiles(resp.data);
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(()=>{
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
        if(savedFiles && savedFiles.length  !==0)
            setFiles([...savedFiles, ...files]);
        setOpenEditFileModal(false);
   }

   const handleRemoveFile = (deletedId) =>{
       if(deletedId){
          setFiles([...files.filter(f => f.id !== deletedId)]);
       }
   }
   
   const classes = useStyles();

   const fileTypeSrt = `${translate(`microgatewayApp.TaskFileType.${props.type.toString()}`)}`;

   return (
       <React.Fragment>
           {props.canAdd && props.task && <EditFileModal 
             open={openEditFileModal} selectMultiple
             entityId={props.task.id}
             entityTagName={fileTag}
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

export default TaskFileModal;