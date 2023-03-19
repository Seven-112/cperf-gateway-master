import { Avatar, Backdrop, Box, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Modal, TablePagination, Typography } from "@material-ui/core";
import { IEmployee } from "app/shared/model/employee.model";
import { TaskUserRole } from "app/shared/model/enumerations/task-user-role.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src, getTotalPages } from "app/shared/util/helpers";
import React from "react";
import { Close, HowToReg, OpenWith, Person, TouchApp } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import clsx from "clsx";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IDepartment } from "app/shared/model/department.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import theme from "app/theme";

const useStyles = makeStyles({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        [theme.breakpoints.up('sm')]:{
            width: '50%',
        },
        boxShadow: 'none',
        background: 'transparent',
        marginTop: theme.spacing(3),
    },
    cardheader:{
        padding: theme.spacing(1),
        borderRadius: '15px 15px  0 0',
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
    },
    cardContent:{
        minHeight: '15%',
        maxHeight: '85%',
        overflow: 'auto',
        background: theme.palette.background.paper,
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 5px 5px',
    },
    pagination:{
     padding: 0,
     color: theme.palette.background.paper,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.background.paper,
       display: 'none',
   },
   employeItemBox:{
      padding: 1,
      border: `1px solid ${theme.palette.grey[500]}`,
      cursor: 'pointer',
      borderRadius: '5px',
   },
   list: {
       width: '100%',
       backgroundColor: theme.palette.background.paper,
       '&:hover':{
            backgroundColor: theme.palette.background.default,
       }
   },
   listeItemTextPrimary:{
       color: theme.palette.primary.dark,
       fontWeight: 'bold',
   },
   listeItemTextSecondary:{
        fontSize: '10px',
        color: theme.palette.info.light,
   },
})

interface IStartupTasksSelectorModalProps{
    open: boolean,
    onClose: Function,
    task: IProjectTask,
}

export const ProjectStartupTasksSelectorModal = (props: IStartupTasksSelectorModalProps) =>{

   const [activePage, setActivePage] = useState(0);

   const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

   const [totalItems, setTotalItems] = useState(0);
   
   const [tasks, setTasks] = useState<IProjectTask[]>([]);

   const [selected, setSelected] = useState<IProjectTask[]>([]);

   const [loading, setLoading] = useState(false);

   const [waiting, setWaiting] = useState(false);
   const [onSelectId, setOnSelectId] = useState(0);

   const getTasks = () =>{
       setLoading(true);
        axios.get<IProjectTask[]>(`${API_URIS.projectTaskApiUri}/startupassociatable/${props.task.id}/${props.task.processId}/?page=${activePage}&size=${itemsPerPage}`)
            .then(res =>{
                setTasks([...res.data]);
                setTotalItems(parseInt(res.headers['x-total-count'],10));
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
   }

   useEffect(() =>{
        getTasks();
   }, [props.task, activePage]);

   const selectTask = (task: IProjectTask) =>{
     if(task){
        setWaiting(true);
        setOnSelectId(task.id);
        const entity: IProjectTask = {
            ...task,
            startupTaskId: props.task ? props.task.id : null,
        }
        axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data)
                    setSelected([...selected, res.data])
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setWaiting(false);
            })
        }
    }

    const unSelect = (task: IProjectTask) =>{
        if(task){
            setWaiting(true);
            setOnSelectId(task.id);
            const entity: IProjectTask = {
                ...task,
                startupTaskId: null
            }
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data)
                        setSelected([...selected.filter(t => t.id !== task.id)])
                }).catch(e =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() =>{
                    setWaiting(false);
                })
        }
    }
  
   const handleClose = () =>{
       props.onClose(selected);
   }

   
   const handleToggle = (task: IProjectTask) =>{
     if(selected.some(st => st.id === task.id))
        unSelect(task);
     else
        selectTask(task);
   }

   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
   }

   const classes = useStyles();
   
   return (
       <React.Fragment>
           <Modal open={props.open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        classes={{
                            root: classes.cardheader
                        }}
                        action={
                            <IconButton onClick={handleClose} color="inherit">
                                <Close />
                            </IconButton>
                        }
                        title={
                            <Box display="flex" alignItems="center">
                                <FontAwesomeIcon icon={faArrowsAlt} />
                                <Typography variant="h4" className="ml-2">
                                    <Translate contentKey="_global.label.startupTasks">Startup tasks</Translate>
                                </Typography>
                            </Box>
                        }
                     />
                    <CardContent className={classes.cardContent}>
                        {loading && <Box width={1} textAlign="center">Loading...</Box>}
                        <List dense className={classes.list}>
                            {tasks.map((task) =>{
                                const labelId = `checkbox-list-secondary-label-${task.id}`;
                                return(
                                    <ListItem key={task.id} button>
                                        <ListItemText id={labelId} primary={task.name} 
                                            secondary={task.description ? task.description : ''}
                                            classes={{
                                                secondary: classes.listeItemTextSecondary,
                                                primary: classes.listeItemTextPrimary,
                                            }}/>
                                            <ListItemSecondaryAction>
                                                {waiting && onSelectId === task.id && <CircularProgress size={15}/>}
                                                <Checkbox
                                                    edge="end"
                                                    onChange={() =>handleToggle(task)}
                                                    checked={selected.some(st => st.id === task.id)}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                )
                            })}
                        </List>
                        {!loading && (!tasks || !tasks.length) && 
                                  <Typography color="primary" variant="h6" className="w-100 text-center">
                                    <Translate contentKey="microgatewayApp.microprocessTask.home.notFound">No Tasks found</Translate>
                                  </Typography>}
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Box display="flex" justifyContent="space-around" textAlign="center" width={1}>
                            <TablePagination className={tasks && tasks.length > 0 ? 'p-0 m-0' : 'd-none'}
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={() =>{}}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage=""
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                                }}/>
                            <Typography variant="caption" display="block" className="pt-3">{props.task.name}</Typography>
                        </Box>
                    </CardActions>
                </Card>
           </Modal>
       </React.Fragment>
   )
}

export default ProjectStartupTasksSelectorModal;