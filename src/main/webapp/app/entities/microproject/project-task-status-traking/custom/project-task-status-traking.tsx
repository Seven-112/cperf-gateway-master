import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Box, CircularProgress, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import { Add, Delete, Https, Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect, useState } from "react"
import { TextFormat, translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { IProjectTaskStatusTraking } from "app/shared/model/microproject/project-task-status-traking.model";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import ProjectTaskStatusTrakingUpdate from "./project-task-status-traking-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";


const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        backgroundColor: theme.palette.common.white,
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
    pagination:{
     padding:0,
     color: theme.palette.primary.dark,
   },
   input:{
       width: theme.spacing(10),
       display: 'none',
   },
   selectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
   justificationCard:{
       width: '44%',
       [theme.breakpoints.down("sm")]:{
           width: '90%',
       },
   }
}))

const TrakItem = (props: {trak: IProjectTaskStatusTraking, account: any, handleDelete?: Function}) =>{
    const { trak, account } = props;
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [openJustification, setOpenJustification] = useState(false);
    const [openFiles, setOpenFiles] = useState(false);

    const canDelete = trak && account && trak.editable && trak.userId === account.id;

    const fileTag = FileEntityTag.projectTaskStatusTraking;

    const classes = useStyles();
    
    const getUser = () =>{
        if(props.trak && props.trak.userId){
            setLoadingUser(true)
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.trak.userId}`)
                .then(res =>{
                    if(res.data)
                        setUserExtra(res.data);
                }).catch(e =>{
                    console.log(e);
                }).finally(() => setLoadingUser(false))
        }
    }

    const getFiles = () =>{
        if(props.trak && props.trak.id){
            setLoadingFiles(true)
            getMshzFileByEntityIdAndEntityTag(props.trak.id, fileTag)
                .then(res =>{
                     setFiles(res.data);
                }).catch(e =>{
                    console.log(e);
                }).finally(() => setLoadingFiles(false))
        }
    }

    useEffect(() =>{
        getUser();
        getFiles();
    }, [props.trak])

    const handleDelete = () =>{
        if(canDelete && props.handleDelete)
            props.handleDelete(trak);
    }

    return (
        <React.Fragment>
            <ModalFileManager
                open={openFiles}
                files={[...files]}
                entityId={trak.id || props.trak.id}
                entityTagName={fileTag}
                onClose={() => setOpenFiles(false)}
                readonly
                title={`${translate("_global.label.files")} ${translate("_global.label.of")} ${translate("microgatewayApp.microprocessTaskStatusTraking.justification")}`}
            /> 
            {(trak && trak.justification) && 
                <MyCustomPureHtmlRenderModal 
                    open={openJustification}
                    title={translate("microgatewayApp.microprocessTaskStatusTraking.justification")}
                    body={trak.justification}
                    onClose={() => setOpenJustification(false)}
                    cardClassName={classes.justificationCard}
                />
            }
            {trak && <>
                <TableRow>
                    <TableCell>{trak.editable ?  translate(`_global.taskOperation.docsSharing`) : trak.status ? translate(`_global.taskOperation.${trak.status.toString()}`) : '...'}</TableCell>
                    <TableCell align="center">{trak.tracingAt ?
                             <TextFormat type="date" 
                                value={new Date(trak.tracingAt)} 
                                format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`}
                                blankOnInvalid={true} />
                                 : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {loadingUser ? <Typography variant="caption">loading...</Typography> : getUserExtraFullName(userExtra)}
                    </TableCell>
                    <TableCell align="center">
                        <Box display="flex" justifyContent="center" alignItems="center" overflow="auto" flexWrap="wrap">
                            {trak.justification ? <IconButton onClick={() => setOpenJustification(!openJustification)}>
                                {openJustification ? <VisibilityOff /> : <Visibility />}
                            </IconButton> : ''}
                            {loadingFiles && <Typography variant="caption" className="mr-2">loading...</Typography>}
                            {[...files].length !==0 && 
                                <IconButton color="primary" className="ml-2"
                                    onClick={() => setOpenFiles(true)}>
                                    <Badge badgeContent={[...files].length} 
                                        color="secondary"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        >
                                            <FontAwesomeIcon icon={faFile} />
                                    </Badge>
                                </IconButton>
                            }
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        {canDelete ? (
                        <Tooltip title={translate("entity.action.delete")}
                            onClick={handleDelete}>
                            <IconButton size="small" color="secondary" className="p-0">
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        ) : (
                            <Https color="disabled"/>
                        )}
                    </TableCell>
                </TableRow>
            </>}
        </React.Fragment>
    )
}


interface TaskStatusTrakingProps{
    open?:boolean,
    task:IProjectTask,
    account: any,
    userTaskRoles: ProjectTaskUserRole[],
    onClose:Function,
}

export const ProjectTaskStatusTraking = (props: TaskStatusTrakingProps) =>{
    const { open, task, account, userTaskRoles } = props;
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<IProjectTaskStatusTraking[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [trackToUpdate, setTrackToUpdate] = useState<IProjectTaskStatusTraking>(null);
    const [openToEdit, setOpenToEdit] = useState(false);
    const [openToDel, setOpenToDel] = useState(false);

    const classes = useStyles();

    const userIsSubmitor = [...userTaskRoles].find(role => role === ProjectTaskUserRole.SUBMITOR) ? true : false;
    const userIsValidator = [...userTaskRoles].find(role => role === ProjectTaskUserRole.VALIDATOR) ? true : false;
    const userIsExecutor = [...userTaskRoles].find(role => role === ProjectTaskUserRole.EXCEUTOR) ? true : false;

    const hasAddPrivileges = account && hasPrivileges({ entities: ['ProjectTask', 'Project'], actions: [PrivilegeAction.CREATE, PrivilegeAction.ALL]}, account.authorities)
    const hasUpdatePrivileges = account && hasPrivileges({ entities: ['ProjectTask', 'Project'], actions: [PrivilegeAction.UPDATE, PrivilegeAction.ALL] }, account.authorities);
    const handDeletePrivilges = account && hasPrivileges({ entities: ['ProjectTask', 'Project'], actions: [PrivilegeAction.DELETE, PrivilegeAction.ALL] }, account.authorities);
    const handViewPrivilges = account && hasPrivileges({ entities: ['ProjectTask', 'Project'], actions: [PrivilegeAction.ALL] }, account.authorities);

    const canAdd = task && (hasAddPrivileges 
          || task.status === ProjectTaskStatus.STARTED && userIsExecutor 
          || task.status === ProjectTaskStatus.EXECUTED && userIsSubmitor 
          || task.status === ProjectTaskStatus.SUBMITTED && userIsValidator);

    const getTracks = (p?: number) =>{
        const page = p || p === 0 ? p : activePage;
        if(props.task && props.task.id){
            let requestUri = `${API_URIS.projectTaskStatusTrakingApiUri}/?taskId.equals=${props.task.id}`;
            requestUri = `${requestUri}&page=${page}&size=${itemsPerPage}&sort=id,desc`;
            setLoading(true)
            axios.get<IProjectTaskStatusTraking[]>(requestUri)
                .then(res =>{
                    if(res.data){
                        setTracks(res.data);
                        setTotalItems(parseInt(res.headers['x-total-count'], 10));
                    }
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        if(props.open)
            getTracks();
    }, [props.open])

    const handleClose = () => {
        props.onClose();
    }

    const handleDelete = (t: IProjectTaskStatusTraking) =>{
        if(t && t.id){
            setTrackToUpdate(t);
            setOpenToDel(true);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setTracks(tracks.filter(t => t.id !== deletedId));
            setOpenToDel(false);
        }
    }

    const items = [...tracks].map((track, index) => <TrakItem key={index} 
                trak={track} account={account} handleDelete={handleDelete} />);

    const handlePagination =( event, newPage) => {
        setActivePage(newPage);
        getTracks(newPage);
    }
  
    const handleChangeItemPerPage = (e) =>{
        setItemsPerPage(parseInt(e.target.value, 10));
    }

    const handleUpdate = (entity?: IProjectTaskStatusTraking) =>{
        setTrackToUpdate(entity);
        setOpenToEdit(true);
    }

    const onSave = (saved?: IProjectTaskStatusTraking, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setTracks([saved, ...tracks])
            else
                setTracks(tracks.map(t => t.id === saved.id ? saved : t));
            setOpenToEdit(false);
        }
    }


    return (
        <React.Fragment>
            {task && <>
                <ProjectTaskStatusTrakingUpdate
                    open={openToEdit}
                    newStatus={task.status}
                    task={task}
                    traking={trackToUpdate}
                    onClose={() =>{ setOpenToEdit(false)}}
                    onSavedTraking={onSave}
                />
                {trackToUpdate && trackToUpdate.id && <EntityDeleterModal 
                    open={openToDel}
                    entityId={trackToUpdate.id}
                    urlWithoutEntityId={API_URIS.projectTaskStatusTrakingApiUri}
                    onClose={() => setOpenToDel(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microprocessTaskStatusTraking.delete.question", {id: ""})}
                />}
            </>}
            <MyCustomModal
                open={open}
                onClose={handleClose}
                rootCardClassName={classes.card}
                customActionButtons={canAdd ? (
                    <Tooltip title={translate("_global.label.add")}>
                        <IconButton color="primary" onClick={() =>handleUpdate(null)}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                ) : (<></>)}
                title={translate("microgatewayApp.microprocessTaskStatusTraking.detail.title")}
                footer={ totalItems > 0 ? 
                        <TablePagination className={(tracks && tracks.length !== 0)? '' : 'd-none'}
                            component="div"
                            count={totalItems}
                            page={activePage}
                            onPageChange={handlePagination}
                            rowsPerPage={itemsPerPage}
                            onChangeRowsPerPage={handleChangeItemPerPage}
                            rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                            labelRowsPerPage=""
                            labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                            classes={{ 
                                root: classes.pagination,
                                input: classes.input,
                                selectIcon: classes.selectIcon,
                        }}/> : <></>
                 }
            >
            {task && <> 
                {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center"
                    flexWrap="wrap" overflow="auto" p={2}>
                        <CircularProgress style={{ width:50, height:50 }}/> <Typography className="ml-3">Loading...</Typography>
                </Box>}
                <Box width={1} textAlign="center" 
                    overflow="auto" flexWrap="wrap"
                    textOverflow="text-wrap" p={1}>
                        <Typography variant="h4">
                            {`${translate("microgatewayApp.microprocessTask.detail.title")} : ${task.name}`}
                        </Typography>
                </Box>
                <Box width={1} mt={2} mb={2} p={2} pt={1}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translate("_global.taskOperation.detail.title")}</TableCell>
                                <TableCell align="center">{translate("microgatewayApp.microprocessTaskStatusTraking.tracingAt")}</TableCell>
                                <TableCell align="center">{translate("microgatewayApp.microprocessTaskStatusTraking.userId")}</TableCell>
                                <TableCell align="center">{translate("microgatewayApp.microprocessTaskStatusTraking.justification")}</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                        flexWrap="wrap" overflow="auto" p={2}>
                                            <CircularProgress style={{ width:50, height:50 }}/> <Typography className="ml-3">Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>}
                            {items}
                            {(!loading && [...tracks].length === 0) &&
                                <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                            flexWrap="wrap" overflow="auto" p={2}>
                                            <Typography>
                                                {translate("microgatewayApp.microprocessTaskStatusTraking.home.notFound")}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </Box>
              </>}
            </MyCustomModal>  
        </React.Fragment>
    )
}

export default ProjectTaskStatusTraking;
