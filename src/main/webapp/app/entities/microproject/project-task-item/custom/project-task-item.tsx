import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles, Modal, Slide, TablePagination, Typography } from "@material-ui/core";
import { Add, Close, Delete, Edit, Error } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import { IProjectTaskItem } from "app/shared/model/microproject/project-task-item.model";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { IRootState } from "app/shared/reducers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import ProjectItemCheckJustification from "../../project-item-check-justification/custom/project-cheick-item-justification";
import TaskItemUpdate from "./project-task-item-update";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '37%',
        maxWidth: '70%',
        [theme.breakpoints.down("sm")]:{
            minWidth: '50%',
            maxWidth: '90%',
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
    },
    cardActions:{
     background: 'white',
      paddingTop:0,
      paddingBottom:0,
      borderRadius: '0 0 15px 15px', 
    },
    thead:{
      border:'none',
      color: 'white',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    truncate:{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }
}))

const ProjectTaskItemListItem = (props: {
        item?: IProjectTaskItem,editable?:boolean,cheickable?:boolean,
        handleShowJustification?: Function,
        onCheickchange?:Function, onUpdate?:Function, onDelete?: Function
    }) =>{
    const {editable, cheickable } = props;

    const [item, setItem] = useState(props.item);
    

    const classes = useStyles();

    useEffect(() =>{
        setItem(props.item)
    }, [props.item])

    const handleUpdate = () =>{
        if(props.onUpdate && editable)
            props.onUpdate(item);
    }

    const handleDelete = () => {
        if(props.onDelete && editable)
            props.onDelete(item);
    }

    const handleCheickChange = () =>{
        if(props.onCheickchange && cheickable){
            setItem({...item, checked: !item.checked})
            props.onCheickchange(item)
        }
    }

    const handleShowJustification = () =>{
        if(props.handleShowJustification)
            props.handleShowJustification(item);
    }

    return (
        <React.Fragment>
            {item && <>
                <ListItem className="w-100" button>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={item.checked}
                            disabled={!cheickable}
                            tabIndex={-1}
                            color="primary"
                            disableRipple
                            onChange={handleCheickChange}
                        />
                        <ListItemText 
                            primary={item.name}
                            secondary={<Box display="flex" alignItems="center">
                                {item.required ? 
                                <Typography
                                    color="primary"
                                    variant="caption"
                                    className="mr-3"
                                >
                                {translate("microgatewayApp.microprocessTaskItem.required")}
                                </Typography> : ''}
                                {item.checkerName && <Typography variant="caption">{item.checkerName}</Typography>}
                            </Box>}
                        />
                    </ListItemIcon>
                        <ListItemSecondaryAction>
                            <Box display="flex" alignItems="center" flexWrap="wrap">
                                {props.handleShowJustification && 
                                <IconButton color="default"
                                     title={translate("microgatewayApp.microprocessItemCheckJustification.detail.title")}
                                     onClick={handleShowJustification}>
                                    <Error />
                                </IconButton>
                                }
                                {editable && <>
                                    <IconButton color="primary"
                                        title={translate("entity.action.edit")}
                                        onClick={handleUpdate}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary"
                                        title={translate("entity.action.delete")}
                                        onClick={handleDelete}>
                                        <Delete />
                                    </IconButton>
                                </>}
                            </Box>
                        </ListItemSecondaryAction>
                </ListItem>
            </>}
        </React.Fragment>
    )
}

interface TaskItemProps extends StateProps, DispatchProps{
    task: IProjectTask,
    open?: boolean,
    onClose: Function,
    onCheckChange?:Function,
}

export const ProjectTaskItem = (props: TaskItemProps) =>{
    const { open, account } = props;
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [task, setTask] = useState<IProjectTask>(props.task);
    const [taskItems, setTaskItems] = useState<IProjectTaskItem[]>([]);
    const [activeItem, setActiveItem] = useState<IProjectTaskItem>(null);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [openJustification, setOpenJustification] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const readonly = !task || !account || (task.status === ProjectTaskStatus.COMPLETED || task.status === ProjectTaskStatus.CANCELED)
                     || !hasPrivileges({entities: ['Project', 'ProjectTask'], actions: [PrivilegeAction.ALL]}, account.authorities);
    

    const getUserExtra = () =>{
        if(props.account){
            setLoading(true);
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.account.id}`)
                .then(res => setUserExtra(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    const getTaskItems = (p?: number, rows?:number) =>{
        if(task){
            setLoading(true);
            const page = (p || p===0) ? p : activePage;
            const size = rows || itemsPerPage;
            let apiUri = `${API_URIS.projectTaskItemApiUri}/?taskId.equals=${task.id}`;
            apiUri = `${apiUri}&page=${page}&size=${size}&sort=id,desc`;

            axios.get<IProjectTaskItem[]>(apiUri)
                .then(res => {
                    setTaskItems([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        getUserExtra();
    },[props.account])

    useEffect(() =>{
        setTask(props.task)
        getTaskItems();
    }, [props.task])


    const handleChangeItemsPerpage = (event) =>{
        setItemsPerPage(parseInt(event.target.value, 10));
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
    }

    const handleClose = () => props.onClose();

    const handleUpdate = (it?: IProjectTaskItem) =>{
        if(!readonly){
            if(it){
                setActiveItem(it);
            }else{
                setActiveItem({
                    taskId: task.id,
                    editorEmail: userExtra && userExtra.user  ? userExtra.user.email : null,
                    editorId: userExtra ? userExtra.id : null,
                    editorName: getUserExtraFullName(userExtra),
                    required: false,
                })
            }
    
            setOpenToUpdate(true);
        }
    }

    const handleDelete = (it?:IProjectTaskItem) =>{
        if(it && !readonly){
            setActiveItem(it);
            setOpenToDelete(true);
        }
    }

    const handleShowJustification = (it?:IProjectTaskItem) =>{
        if(it){
            setActiveItem(it);
            setOpenJustification(true);
        }
    }

    const onSave = (saved?: IProjectTaskItem, isNew?:boolean) =>{
        if(saved){
            if(isNew)
                setTaskItems([saved, ...taskItems])
            else
                setTaskItems(taskItems.map(ti => ti.id === saved.id ? saved : ti))
            setOpenToUpdate(false);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setTaskItems(taskItems.filter(ti => ti.id !== deletedId))
            setOpenToDelete(false)
            setActiveItem(null)
        }
    }

    const onCheickChange = (item: IProjectTaskItem) =>{
        if(item && item.id){
            const entity: IProjectTaskItem ={
                ...item,
                checked:!item.checked
            }
            setLoading(true);
            axios.put<IProjectTaskItem>(API_URIS.projectTaskItemApiUri, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    if(props.onCheckChange)
                        props.onCheckChange();
                    setTaskItems(taskItems.map(ti => ti.id === res.data.id ? res.data : ti))
                }
            }).catch(e => console.log(e))
              .finally(() =>{
                  setLoading(false)
              })
        }
    }

    const itemIsCheickable = (ti: IProjectTaskItem) =>{
        return (ti && userExtra && task && userExtra.id === ti.checkerId);
    }

    const items = [...taskItems].map((item, index) =>(
        <ProjectTaskItemListItem key={index} item={item} 
        editable={!readonly}  cheickable={itemIsCheickable(item)} 
        handleShowJustification={handleShowJustification}
        onCheickchange={onCheickChange} onUpdate={handleUpdate} onDelete={handleDelete}/>
    ))

    return (
        <React.Fragment>
        {activeItem && !readonly && <>
        <TaskItemUpdate 
            open={openToUpdate}
            taskItem={activeItem}
            onSave={onSave}
            onClose={() => setOpenToUpdate(false)}
        />
        <EntityDeleterModal 
            open={openToDelete}
            entityId={activeItem.id}
            urlWithoutEntityId={API_URIS.projectTaskItemApiUri}
            onDelete={onDelete}
            onClose={() => setOpenToDelete(false)}
            question={translate("microgatewayApp.microprocessTaskItem.delete.question", {id: ''})}
        />
        </>}
        {activeItem && <ProjectItemCheckJustification 
            open={openJustification}
            taskItem={activeItem}
            readonly={!itemIsCheickable(activeItem)}
            onClose={() => setOpenJustification(false)}
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
                                        {translate("microgatewayApp.microprocessTaskItem.home.title")}
                                    </Typography>
                                </Box>
                            }
                            action={
                                <Box display="flex" alignItems="center">
                                {!readonly &&
                                    <IconButton 
                                        color="inherit"
                                        className="mr-3"
                                        onClick={() => handleUpdate(null)}>
                                        <Add />
                                    </IconButton>
                                }
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

                            {(!loading && [...taskItems].length<=0) &&
                                <Box width={1} mt={1} mb={3} display="flex" 
                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                    <Typography variant="body1">
                                        {translate("microgatewayApp.microprocessTaskItem.home.notFound")}
                                    </Typography>
                                </Box>
                            }
                            {[...taskItems].length !== 0 &&
                                <List>
                                    {items}
                                </List>
                            }
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <TablePagination 
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={handleChangeItemsPerpage}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage={translate("_global.label.rowsPerPage")}
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                            }}/>
                        </CardActions>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}
const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
});
  
  const mapDispatchToProps = { };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskItem);
