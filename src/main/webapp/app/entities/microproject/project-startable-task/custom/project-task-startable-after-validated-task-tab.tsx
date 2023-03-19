import { IProject } from "app/shared/model/microproject/project.model";
import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Checkbox, CircularProgress, FormControl, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Select, TablePagination, Typography } from "@material-ui/core";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import theme from "app/theme";
import axios from "axios";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { IProjectStartableTask } from "app/shared/model/microproject/project-startable-task.model";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ProjectStartableTaskCond } from "app/shared/model/enumerations/project-startable-task-cond.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Visibility } from "@material-ui/icons";
import { translate } from "react-jhipster";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";

const useStyles = makeStyles({
    card:{
        width: '100%',
        boxShadow: 'none',
        background: 'transparent',
        marginTop: theme.spacing(1),
    },
    cardheader:{
        padding: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: "10px 10px 0 0",
    },
    cardContent:{
        width: '100%',
        minHeight: '10%',
        maxHeight: '70%',
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
     color: theme.palette.primary.main,
   },
   paginationInput:{
       width: theme.spacing(10),
       // display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.primary.main,
       // display: 'none',
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
   fileIllustattionBox:{
       height: theme.spacing(7),
       width: theme.spacing(7),
       display: 'inline-block',
       borderRadius:theme.spacing(2),
   },
   fileIllustattionIconBtn:{
       position: 'absolute',
       zIndex:3,
       marginTop:theme.spacing(-4),
       marginLeft:theme.spacing(-3),
   },

   descriptionBox:{
       width: '25%',
       [theme.breakpoints.down('sm')]:{
        width: '70%',
       }
   }
})

interface ProjectTaskStartableAfterValidatedTaskTabProps{
    task: IProjectTask,
    canEdit?: boolean,
    account?: any,
}

export const ProjectTaskStartableAfterValidatedTaskTab = (props: ProjectTaskStartableAfterValidatedTaskTabProps) =>{
    const [project, setProject] = useState<IProject>(null);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [activePage, setActivePage] = useState(0);

   const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

   const [totalItems, setTotalItems] = useState(0);
   
   const [startableTasks, setStartableTasks] = useState<IProjectTask[]>([]);

   const [startables, setStartables] = useState<IProjectStartableTask[]>([]);

   const [loading, setLoading] = useState(false);

   const [waiting, setWaiting] = useState(false);
   
   const [tasks, setTasks] = useState<IProjectTask[]>([]);

   const [activeTask, setActiveTask] = useState<IProjectTask>(null);
   
   const [openDesc, setOpendesc] = useState(false);

   const classes = useStyles();

   const getStartableTasks = (ids: any []) =>{
    if(ids && ids.length !== 0){
     setLoading(true);
     const apiUri = `${API_URIS.projectTaskApiUri}/?id.in=${ids.join(',')}&page=${0}&size=${1000}`;
     axios.get<IProjectTask[]>(apiUri)
          .then(res =>{
             setStartableTasks([...res.data]);
         }).catch(e =>{
             /* eslint-disable no-console */
             console.log(e);
         }).finally(() =>{
             setLoading(false);
         })
     }
   }
   
   const getProjects = () =>{
      if(props.task && props.task.processId && props.canEdit){
        setLoading(true);
        const apiUri = `${API_URIS.projectApiUri}/getSimillarProjects/${props.task.processId}`;
        axios.get<IProject[]>(apiUri)
             .then(res =>{
                setProjects(res.data);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
      }
   }


   const getStartables = () =>{
    if(props.task && props.task.id){
     setLoading(true);
     let apiUri = `${API_URIS.projectStartableTasksApiUri}/?triggerTaskId.equals=${props.task.id}`;
     apiUri = `${apiUri}&startCond.equals=${ProjectStartableTaskCond.TRIGGER_VALIDATED.toString()}`;
     apiUri = `${apiUri}&page=0&size=1000`;
     axios.get<IProjectStartableTask[]>(apiUri)
          .then(res =>{
             setStartables([...res.data]);
             getStartableTasks([...res.data].map(item => item.startableTaskId))
         }).catch(e =>{
             /* eslint-disable no-console */
             console.log(e);
         }).finally(() =>{
             setLoading(false);
         })
     }
   }

   const getTasks = (p?: number, rows?: number) =>{
    const page = p || p=== 0 ? p : activePage;
    const size = rows || itemsPerPage;
    if(project && project.id){
        setLoading(true);
         axios.get<IProjectTask[]>(`${API_URIS.projectTaskApiUri}/?processId.equals=${project.id}&page=${page}&size=${size}`)
              .then(res =>{
                 setTasks(res.data);
                 setTotalItems(parseInt(res.headers['x-total-count'],10));
             }).catch(e =>{
                 /* eslint-disable no-console */
                 console.log(e);
             }).finally(() =>{
                 setLoading(false);
             })
    }
   }

   useEffect(() =>{
       getStartables();
       getProjects();
   }, [props.task, props.canEdit])

   useEffect(() =>{
        getTasks();
   }, [project])

   const dissociate = (task: IProjectTask) =>{
        if(task && props.task && props.task.id !== task.id){
            const entity = [...startables].find(item => item.startableTaskId === task.id)
            if(entity){
                setWaiting(true);
                setActiveTask(task);
                axios.delete(`${API_URIS.projectStartableTasksApiUri}/${entity.id}`)
                    .then(res =>{
                        setStartables([...startables.filter(item => item.id !== entity.id)]);
                        setStartableTasks([...startableTasks].filter(t => t.id !== task.id));
                        if(![...tasks].some(t => t.id === task.id))
                            setTasks([task, ...tasks])
                    }).catch((e) =>{
                        /* eslint-disable no-console */
                        console.log(e);
                    }).finally(() =>{
                        setWaiting(false);
                    })
            }
        }
    }

    const associate = (task: IProjectTask) =>{
        if(props.task && task && props.task.id !== task.id
             && ![...startables].some(t => t.startableTaskId === task.id)){
            setWaiting(true);
            setActiveTask(task);
            const taskproject = [...projects].find(p => p.id === task.processId);
            const triggerTaskProject = [...projects].find(p => p.id === props.task.processId);
            const entity: IProjectStartableTask = {
                startCond: ProjectStartableTaskCond.TRIGGER_VALIDATED,
                startableTaskId: task.id,
                triggerTaskId: props.task.id,
                startableTaskName: task.name,
                triggerTaskName: props.task.name,
                userId: props.account ? props.account.id : null,
                startableProjectName: taskproject ? taskproject.label : null,
                triggerProjectName: triggerTaskProject ? triggerTaskProject.label : null,
            }
            axios.post<IProjectStartableTask>(`${API_URIS.projectStartableTasksApiUri}`, cleanEntity(entity))
                .then(res =>{
                if(res.data && res.data.id){
                    setStartables([...startables, res.data])
                    setStartableTasks([...startableTasks, task]);
                }
                }).catch((e) =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(() =>{
                    setWaiting(false);
                })
        }
    }

    const toogleAssocitate = (task: IProjectTask, toAssociate: boolean) =>{
        if(props.task && task && task.id !== props.task.id && props.canEdit){
            if(toAssociate)
                associate(task);
            else
                dissociate(task);
        }
    }

   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getTasks(newPage)
   }


  const handleChangeItemsPerpage = (event) =>{
      setItemsPerPage(parseInt(event.target.value, 10))
      getTasks(0, parseInt(event.target.value, 10));
  }

   const handleOpendesc = (task: IProjectTask) =>{
       if(task){
           setActiveTask(task);
           setOpendesc(true);
       }
   }

  const handleSelectProject = (e) =>{
      setProject([...projects].find(p => p.id === e.target.value));
  }

   const getListItems = (tsks: IProjectTask[]) =>(
    [...tsks].filter(t => props.task && t.id !== props.task.id).map((task) =>{
        const labelId = `checkbox-list-secondary-label-${task.id}`;
        const isassociated = [...startables].some(item => item.startableTaskId === task.id);
        const taskproject = [...projects].find(p => p.id === task.processId);
        const taskName = taskproject ? `${task.name}#${taskproject.label}` : task.name;
        return(
            <ListItem key={task.id} button>
                <ListItemText id={labelId} primary={taskName} 
                    secondary={task.description ? <Button 
                        variant="text"
                        color="primary" size="small"
                        className="text-capitalize p-0"
                        endIcon={<Visibility />} onClick={() => handleOpendesc(task)}>
                        {translate("microgatewayApp.microprocessTask.description")}
                    </Button> : ''}
                    classes={{
                        secondary: classes.listeItemTextSecondary,
                        primary: classes.listeItemTextPrimary,
                    }}/>
                <ListItemSecondaryAction>
                    {props.canEdit && <>
                        {waiting && activeTask && activeTask.id === task.id && <CircularProgress size={15}/>}
                        <Checkbox
                            edge="end"
                            onChange={() =>toogleAssocitate(task, !isassociated)}
                            checked={isassociated}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </>}
                </ListItemSecondaryAction>
            </ListItem>
        )
    })
   )

    return (
        <React.Fragment>
         <MyCustomPureHtmlRenderModal
             open={openDesc}
             title={`${activeTask ? activeTask.name + ':' : ''} ${translate("microgatewayApp.microprocessTask.description")}`}
             body={activeTask ? activeTask.description : null}
             onClose={() => setOpendesc(false)}
             cardClassName={classes.descriptionBox}
         />
         <Card className={classes.card}>
             <CardContent className={classes.cardContent}>
                 {loading && <Box width={1} textAlign="center">Loading...</Box>}
                 {props.canEdit && <Box width={1}>
                    <FormControl fullWidth>
                        <InputLabel shrink>{translate("microgatewayApp.microprojectProject.detail.title")}</InputLabel>
                        <Select value={project ? project.id : ""} onChange={handleSelectProject}>
                            <MenuItem>---Select---</MenuItem>
                            {[...projects].filter(p => p.id !== props.task.processId).map((p, index) =>(
                                <MenuItem key={index} value={p.id}>{p.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                 </Box>}
                 <List dense className={classes.list}>
                     <>
                         { getListItems([...startableTasks])}
                         { getListItems([...tasks].filter(t => ![...startableTasks].some(item => item.id === t.id))) }
                     </>
                 </List>
                 {!loading && ![...tasks].length && ![...startableTasks].length && 
                             <Typography color="primary" variant="h6" className="w-100 text-center">
                                 {translate("microgatewayApp.microprocessTask.home.notFound")}
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
                         onChangeRowsPerPage={handleChangeItemsPerpage}
                         rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                         labelRowsPerPage={translate("_global.label.rowsPerPage")}
                         labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, itemsPerPage)}`}
                         classes={{ 
                             root: classes.pagination,
                             input: classes.paginationInput,
                             selectIcon: classes.paginationSelectIcon,
                         }}/>
                 </Box>
             </CardActions>
         </Card>
        </React.Fragment>
    )
}

export default ProjectTaskStartableAfterValidatedTaskTab;