import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { cleanEntity } from "app/shared/util/entity-utils";
import { Box, Button, Card, CardActions, CardContent, Checkbox, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Typography } from "@material-ui/core";
import theme from "app/theme";
import { Visibility } from "@material-ui/icons";
import { translate, Translate } from "react-jhipster";
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

interface ProjectStartupTasksTabProps{
    task: IProjectTask,
    canEdit?: boolean,
}

export const ProjectStartupTasksTab = (props: ProjectStartupTasksTabProps) =>{

    const [activePage, setActivePage] = useState(0);

   const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

   const [totalItems, setTotalItems] = useState(0);
   
   const [startupTasks, setStartupTasks] = useState<IProjectTask[]>([]);

   const [loading, setLoading] = useState(false);

   const [waiting, setWaiting] = useState(false);
   
   const [tasks, setTasks] = useState<IProjectTask[]>([]);

   const [activeTask, setActiveTask] = useState<IProjectTask>(null);
   
   const [openDesc, setOpendesc] = useState(false);

   const classes = useStyles();

   const getTasks = (p?: number, rows?: number) =>{
    const page = p || p=== 0 ? p : activePage;
    const size = rows || itemsPerPage;
    if(props.task && props.canEdit){
        setLoading(true);
         axios.get<IProjectTask[]>(`${API_URIS.projectTaskApiUri}/?processId.equals=${props.task.processId}&page=${page}&size=${size}`)
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

   const getStartupTasks = () =>{
       if(props.task && props.task.id){
        setLoading(true);
        axios.get<IProjectTask[]>(`${API_URIS.projectTaskApiUri}/?startupTaskId.equals=${props.task.id}&page=${0}&size=${1000}`)
             .then(res =>{
                setStartupTasks([...res.data]);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
        }
   }

   useEffect(() =>{
        getStartupTasks();
        getTasks();
   }, [props.task, props.canEdit]);

    const dissociate = (taskToDissociate: IProjectTask) =>{
        if(taskToDissociate && props.task && props.task.id !== taskToDissociate.id
             && [...startupTasks].some(t => t.id === taskToDissociate.id)){
            setWaiting(true);
            setActiveTask(taskToDissociate);
            const entity: IProjectTask = {
                ...taskToDissociate,
                startupTaskId: null,
            }
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
                 .then(res =>{
                    if(res.data && res.data.id){
                        setStartupTasks([...startupTasks.filter(t => t.id !== res.data.id)]);
                    }
                 }).catch((e) =>{
                     /* eslint-disable no-console */
                     console.log(e);
                 }).finally(() =>{
                     setWaiting(false);
                 })
        }
    }

    const associate = (taskToAssociate: IProjectTask) =>{
        if(props.task && taskToAssociate && props.task.id !== taskToAssociate.id
             && ![...startupTasks].some(t => t.id === taskToAssociate.id)){
            setWaiting(true);
            setActiveTask(taskToAssociate);
            const entity: IProjectTask = {
                ...taskToAssociate,
                startupTaskId: props.task.id,
            }
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
                .then(res =>{
                if(res.data && res.data.id){
                    setStartupTasks([...startupTasks, res.data]);
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

   const getListItems = (tsks: IProjectTask[]) =>(
    [...tsks].filter(t => props.task && t.id !== props.task.id).map((task) =>{
        const labelId = `checkbox-list-secondary-label-${task.id}`;
        const isassociated = [...startupTasks].some(t => t.id === task.id);
        return(
            <ListItem key={task.id} button>
                <ListItemText id={labelId} primary={task.name} 
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
                <List dense className={classes.list}>
                    <>
                        { getListItems([...startupTasks]) }
                        {getListItems([...tasks].filter(t => ![...startupTasks].some(st => st.id === t.id)))}
                    </>
                </List>
                {!loading && ![...tasks].length && ![...startupTasks].length && 
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

export default ProjectStartupTasksTab;