import { IJustification } from "app/shared/model/microprocess/justification.model";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import { API_URIS, downLoadFile, fileIsReadableOnBrowser } from "app/shared/util/helpers";
import { useEffect, useState } from "react";
import axios from 'axios';
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import React from "react";
import { JustifcationReason } from "app/shared/model/enumerations/justifcation-reason.model";
import JusficationUpdateModal from "./justification-update-modal";
import { Backdrop, Box, CircularProgress, Collapse, Fab, IconButton, Switch, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Visibility, Add, VisibilityOff  } from "@material-ui/icons";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Translate } from "react-jhipster";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { FileIllustration } from "app/shared/component/file-previewer";
import CloseIcon from '@material-ui/icons/Close';
import { cleanEntity } from "app/shared/util/entity-utils";
import DeleteModal from "app/shared/modals/delete-modal";
import DeleteIcon from '@material-ui/icons/Delete';
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles((theme) =>({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        },
        fileIllustattionBox:{
            display: 'inline-block',
            borderRadius:theme.spacing(2),
        },
        fileIllustattion:{
            height: theme.spacing(4),
            width: theme.spacing(4),
            fontSize: theme.spacing(3),
            cursor:'pointer',
        },
        fileIllustattionIconBtn:{
            display: 'inline-block'
        },
        // switch styles
          
        shiwtchRoot: {
          width: 42,
          height: 26,
          padding: 0,
          margin: theme.spacing(1),
        },
        switchBase: {
          padding: 1,
          '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
              backgroundColor: '#52d869',
              opacity: 1,
              border: 'none',
            },
          },
          '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 26 / 2,
          border: `1px solid ${theme.palette.grey[400]}`,
          backgroundColor: theme.palette.error.main,
          opacity: 1,
          transition: theme.transitions.create(['background-color', 'border']),
        },
        checked: {},
        focusVisible: {},
        // end swhitch styles
}));

export interface JustificationContainerProps{
    task: ITask,
    process: IProcess,
    reason: JustifcationReason,
    openUpdateModal?: boolean,
    onCloseUpdateModal?: Function,
}

const IOSSwitch = (props) => {
    const classes = useStyles();
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.shiwtchRoot,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  };

const ItemRow = (props: {justification: IJustification, task: ITask, process: IProcess, file: IMshzFile,
                        onDeleteFile: Function, onDelete: Function}) =>{

    const [open, setOpen] = useState(false);

    const {justification,task, process, file} = props;

    const [editor, setEditor] = useState<IUserExtra>(null);

    const [accepted, setAccepted] = useState(props.justification.accepted);

    const classes = useStyles();

    const handleDelete = () =>{
        props.onDelete(props.justification);
    }

    const handleDeleteFile = () =>{
        props.onDeleteFile(props.justification);
    }

    const changeAcceptedValue = () =>{
        const entity: IJustification = {...props.justification, accepted: !accepted}
        axios.put<IJustification>(API_URIS.justificationsApiUrl, cleanEntity(entity))
        .then(() =>{ setAccepted(!accepted)}).catch(() =>{});
    }
    

    useEffect(() =>{
        if(props.justification && props.justification.editorId){
            axios.get<IUserExtra>(API_URIS.userExtraApiUri+'/'+props.justification.editorId).then(res =>{
                if(res.data)
                    setEditor(res.data);
            }).catch(() =>{})
        }
    }, [props.justification])

    const getEditorFullName = () =>{
        if(editor && editor.employee)
            return editor.employee.firstName + ' '+ editor.employee.lastName;
        if(editor && editor.user)
            return editor.user.firstName + ' '+ editor.user.lastName;
        return '...';
    }

    const handleOpenFile = () =>{
        if(fileIsReadableOnBrowser(file)){
            const win = window.open('/file-viewer/'+file.id, '_blank');
            if (win != null) {
              win.focus();
            }
        }else{
            downLoadFile(file);
        }
    }
    return (
        <React.Fragment>
          <TableRow hover>
            <TableCell align="left">
                {props.justification.content && 
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                  {open ? <VisibilityOff color="primary"/> : <Visibility color="primary" />}
                </IconButton>
                }
                {!props.justification.content && '...'}
            </TableCell>
            <TableCell align="left">{ getEditorFullName() }</TableCell>
            <TableCell align="center">
              {props.file && 
                <Box key={file.id} className={classes.fileIllustattionBox} p={0} boxShadow={3} margin={0}>
                    <FileIllustration file={file} className={classes.fileIllustattion} onClick={handleOpenFile}/>
                    <IconButton color="secondary" title="delete"
                        size="small" className={classes.fileIllustattionIconBtn}
                        onClick={handleDeleteFile}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                </Box>
              }
              {!props.file && '...'}
              </TableCell>
              <TableCell align="center">
                  <IOSSwitch checked={accepted} onChange={changeAcceptedValue}/>
                  {accepted && <React.Fragment>
                    <Translate contentKey="_global.label.yes">Yes</Translate>
                  </React.Fragment>}
                  {!accepted && <React.Fragment>
                    <Translate contentKey="_global.label.no">Non</Translate>
                  </React.Fragment>}
              </TableCell>
              <TableCell align="center">
                  <IconButton onClick={handleDelete} color="secondary" size="small" title="delete">
                      <DeleteIcon />
                  </IconButton>
              </TableCell>
          </TableRow>
          {justification.content && <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
              <Collapse unmountOnExit in={open} timeout="auto">
                  <Box margin={1}>
                      <Typography  variant='h5' style={{paddingBottom:5}}>
                        <Translate contentKey="microgatewayApp.microprocessJustification.content">Content</Translate>
                      </Typography>
                      <Typography  variant='body2' style={{marginLeft:3,}}>{justification.content}</Typography>
                  </Box>
              </Collapse>
              </TableCell>
          </TableRow>}
        </React.Fragment>
    )
}

export const JustificationContainer = (props: JustificationContainerProps) =>{
    
    const [justifications, setJustifications] = useState<IJustification[]>([]);
    
    const [files, setFiles] = useState<IMshzFile[]>([]);

    const [open, setOpen] = useState(props.openUpdateModal);

    const [openBackDrop, setOpenBackDrop] = useState(true);

    const [entityTodelete, setEntityToDelete] = useState<IJustification>(null);

    const [entityTodeleFile, setEntityTodeleFile] = useState<IJustification>(null);

    const [task, setTask] = useState(props.task);
    const [process, setProcess] = useState(props.process);
    const [reason, setReason] = useState(props.reason);

    const classes = useStyles();


    const getJustifications = () =>{ 
        const requestUri = props.task ? `${API_URIS.justificationsApiUrl}/?taskId.equals=${props.task.id}&reason.equals=${props.reason}`
                : props.process ? `${API_URIS.justificationsApiUrl}/?processId.equals=${props.process.id}
                                    &reason.equals=${props.reason.toString()}&taskId.specified=false`
                : null;
                    
        if(props.task || props.process){
            axios.get<IJustification[]>(requestUri).then(response =>{
                if(response.data){
                    setJustifications([...response.data]);
                    const fileIds = response.data.filter(j => j.fileId).map(j => j.fileId);
                    if(fileIds && fileIds.length && serviceIsOnline(SetupService.FILEMANAGER)){
                        // loading files
                        axios.get<IMshzFile[]>( `${API_URIS.mshzFileApiUri}/?id.in=${fileIds}`).then(res =>{
                            if(res.data)
                                setFiles([...files, ...res.data]);
                        }).catch(() =>{});
                    }
                }
            }).catch(() =>{}).finally(() => setOpenBackDrop(false));
        }
    }

    useEffect(() =>{
        setTask(props.task);
        getJustifications();
    }, [props.task]);

    useEffect(() =>{
        setProcess(props.process);
        getJustifications();
    }, [props.process])

    useEffect(() =>{
         setReason(props.reason);
    }, [props.reason])

    const handleSave = (justification?: IJustification, isUpdateOP?: boolean, file?: IMshzFile) =>{
        if(justification){
            if(isUpdateOP){
                const elements = justifications.map(el =>{
                    if(el.id === justification.id)
                        return justification;
                    return el;
                });
                setJustifications([...elements]);
            }else{
                const elements = [...justifications];
                elements.push(justification);
                setJustifications([...elements]);
            }
            if(file){
                setFiles(els => els.concat(file));
            }
        }
    }

    const confirmDeleteFile = () =>{
        if(entityTodeleFile){
            const entityWioutFile = {...entityTodeleFile, fileId: null};
            axios.put<IJustification>(API_URIS.justificationsApiUrl, cleanEntity(entityWioutFile))
                .then(res => {
                    if(res.data){
                        const jEls = justifications.map(jEl =>{
                            if(jEl.id === res.data.id)
                                return res.data;
                            return jEl;
                        })
                       setJustifications([...jEls]);
                    }
                    // deleting file
                    if(serviceIsOnline(SetupService.FILEMANAGER)){
                        axios.delete(API_URIS.mshzFileApiUri+'/'+entityTodeleFile.fileId).then(() =>{
                            setEntityTodeleFile(null);
                        }).catch(() =>{})
                    }else{
                        setEntityTodeleFile(null);
                    }
                }).catch((e) =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() =>{setEntityTodeleFile(null);})
        }
    }

    const confirmDeleteEntity = () =>{
        if(entityTodelete){
            axios.delete(API_URIS.justificationsApiUrl+'/'+entityTodelete.id).then(() =>{
                const jEls = [...justifications].filter(jEl => jEl.id !== entityTodelete.id);
                setJustifications([...jEls]);
                if(serviceIsOnline(SetupService.FILEMANAGER)){
                    // deleting file
                    axios.delete(API_URIS.mshzFileApiUri+'/'+entityTodelete.fileId)
                    .then(() =>{}).catch(() =>{})
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setEntityToDelete(null))
        }
    }

    const handleClose = () =>{
        setOpen(false);
        props.onCloseUpdateModal();
    }

    const onDelete = (entity: IJustification) =>{
        setEntityToDelete(entity);
    }

    const onDeleteFile = (entity: IJustification) =>{
        setEntityTodeleFile(entity);
    }

    const items = justifications.sort((a, b) => (b.id-a.id)).map(jstf =>{
        const file = jstf.fileId ? files.find(f => f.id === jstf.fileId) : null;
        return <ItemRow key={jstf.id} justification={jstf} process={props.process}
          task={props.task} file={file} onDelete={onDelete} onDeleteFile={onDeleteFile}/>
    })

    const entity: IJustification = {
         processId: process ? process.id : null, 
         taskId: task? task.id : null, 
         reason
     }

    return (
        <React.Fragment>
             {openBackDrop &&  <Box width={1} display="flex" justifyContent="center">
                <CircularProgress color="primary"/>
            </Box> }

            {/* prevent delete file dialog */ entityTodeleFile && 
            <DeleteModal confirmDelete={confirmDeleteFile}
                handleClose={() =>{setEntityTodeleFile(null); }}
                question={
                    <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.delete.question"
                       interpolate={{ id: entityTodeleFile.id }}> Are you sure you want to delete this MshzFile?
                     </Translate>} />
            }

            {/* prevent delete justification dialog */ entityTodelete && 
            <DeleteModal confirmDelete={confirmDeleteEntity}
                handleClose={() =>{setEntityToDelete(null); }}
                question={
                    <Translate contentKey="microgatewayApp.microprocessJustification.delete.question"
                         interpolate={{ id: entityTodelete.id }}>
                    Are you sure you want to delete this Justification?
                    </Translate>} />
            }

            <JusficationUpdateModal open={open} onSaved={handleSave} onClose={handleClose} entity={entity} />
              <Box width={1} display="flex" boxShadow={3} alignItems="center" alignContent="center">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Translate contentKey="microgatewayApp.microprocessJustification.content">Content</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microprocessJustification.editorId">Editor</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microprocessJustification.fileId">Fichier</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microprocessJustification.accepted">Accepted</Translate>
                            </TableCell>
                            <TableCell align="center">  Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!justifications || justifications.length <=0) &&
                            <TableRow>
                                <TableCell align="center" colSpan={6}>No Founded</TableCell>
                            </TableRow>
                        }
                        {(justifications && justifications.length >0) && items}
                    </TableBody>
                </Table>
              </Box>
        </React.Fragment>
    )
}
export default JustificationContainer;