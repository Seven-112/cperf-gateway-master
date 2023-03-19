import React, { useState, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProcess } from 'app/shared/model/microprocess/process.model';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, Collapse, Grid, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { faArrowAltCircleLeft, faSitemap } from '@fortawesome/free-solid-svg-icons';
import AddIcon from '@material-ui/icons/Add'
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { Visibility, Edit, Delete } from '@material-ui/icons';
import { ITask } from 'app/shared/model/microprocess/task.model';
import axios from 'axios';
import { ProcessTasksModal } from './process-tasks-modal';
import { Helmet } from 'react-helmet';
import { InstanceCreateModal } from './instance-create-modal';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import ProcessChrono from './process-chrono';
import { JustificationModalProps } from '../../justification/custom/justification-modal';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import ProcessDisable from './process-disable';
import ProcessUpdate from './process-update';
import TaskUpdate from '../../task/custom/task-update';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import QueryInstanceDetail from 'app/entities/qmanager/query-instance/custom/query-instance-detail';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import { IChronoUtil } from 'app/shared/util/chrono-util.model';
import { formateDate } from 'app/shared/util/date-utils';

const useStyles = makeStyles(theme =>({
  card:{
    border: '1px solid '+ theme.palette.primary.main,
    boxShadow: '0 0 7px '+theme.palette.grey[900],
  },
  cardHeader: {
    paddingTop:2,
    paddingBottom:2,
    background: theme.palette.common.white,
    color: theme.palette.primary.dark,
  },
  cardContent:{
    paddingTop: theme.spacing(-100),
  },
  thead:{
    backgroundColor: theme.palette.primary.dark,
    border:'none',
  },
  theadRow:{
    backgroundColor: theme.palette.primary.dark,
  },
  tHeadCell:{
    color: theme.palette.background.paper,
  },
  tasksFab:{
    boxShadow: 'none',
    background: 'transparent',
    color: theme.palette.success.dark,
    '& :disabled':{
      background: 'transparent',
    }
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
    boxShadow: 'none',
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
}))

const taskApiUrl = 'services/microprocess/api/tasks';
const apiUrl = 'services/microprocess/api/processes';

const ItemRow = (props: {process: IProcess, processes: IProcess[], 
  onOpenJustifications?:Function, onDelete:Function, 
  onUpdate?: Function, onTaskDelete?: Function}) =>{
  const process = props.process
  const listProcess = props.processes
  const [showDescription, setShowDescription] = useState(false)
  const [tasks, setTasks] = useState<ITask[]>([])
  const [instances, setInstances] =useState<IProcess[]>(listProcess.filter(p => p.modelId === process.id))
  const [pauseOrPlaying, setPauseOrPlaying] = useState(false);
  const [openTaskEditor, setOpenTaskEditor] = useState(false);

  const [queryInstance, setQueryInstance] = useState<IQueryInstance>(null);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [openQuery, setOpenQuery] = useState(false);
  const [realodChrono, setReloadChrono] = useState(false);
  const [processChronoUtil, setProcessChronoUtil] = useState<IChronoUtil>(null);
  const [loadingChrono, setLoadingChrono] = useState(false);

  const history = useHistory()

  const classes = useStyles()

  const [open, setOpen] = useState(false);

  const [openCreateInstanceModal, setOpenCreateInstanceModal] = useState(false);

  const getChronoUtil = () =>{
      if(props.process && props.process.id){
          setLoadingChrono(true)
          axios.get<IChronoUtil>(`${API_URIS.processApiUri}/getChronoUtil/${props.process.id}`)
              .then(res =>{
                  setProcessChronoUtil(res.data);
              }).catch(e => console.log(e))
              .finally(() => setLoadingChrono(false));
      }
  }

  const getQuery = () =>{
    if(process && process.queryId && serviceIsOnline(SetupService.QMANAGER)){
      setLoadingQuery(true);
      axios.get<IQueryInstance>(`${API_URIS.queryInstanceApiUri}/${process.queryId}`)
        .then(res => {
              setQueryInstance(res.data);
        }).catch((e) =>{
          console.log(e);
        }).finally(() => setLoadingQuery(false));
    }
  }

  const findTasks = () =>{
    axios.get<ITask[]>(`${taskApiUrl}/?processId.equals=${process.id}&valid.equals=${true}`).then(res =>{
       if(res.data){
        setTasks(res.data);
       }
    }).catch(e =>{
      /* eslint-disable no-console */
      console.log(e)
    })
  }

  useEffect(() =>{
    findTasks();
    // findRunnableProcess();
    getQuery();
    getChronoUtil();
  }, [props.process])

  const handleEdit = () =>{
    if(props.onUpdate)
      props.onUpdate(process);
  }

  const handlAddTask = () => setOpenTaskEditor(true);

  const handleSaveTask = (saved?: ITask, isNew?:boolean) =>{
      if(saved){
        if(isNew){
          setTasks([saved, ...tasks]);
          setOpenTaskEditor(false);
        }else{
          setTasks([...tasks].map(t => t.id === saved.id ? saved : t));
        }
        setReloadChrono(!realodChrono);
      }
  }

  const handleShowTasks = () =>{
    setOpen(true);
    // props.onShowTasks(tasks, process)
  }

  const handleCloseTaskModal = () =>{
    setOpen(false);
  }

  const handleCloseCeateInstanceModal = (instance?: IProcess) =>{
    setOpenCreateInstanceModal(false);
  }

  const handleInstanceCreated = (instance?: IProcess) =>{
    if(instance){
      setInstances([instance, ...instances]);
      setOpenCreateInstanceModal(false);
    }
  }

  const handleTaskUpdate = (tsk?: ITask) =>{
     if(tsk){
        setTasks(tasks.map(t => t.id === tsk.id ? tsk : t));
        setReloadChrono(!realodChrono);
     }
  }

  const handlePlayOrPause = () =>{
     if(process && process.modelId && processChronoUtil){
       const pausing = processChronoUtil.status === TaskStatus.ON_PAUSE ? false : true;
       const apiUri = `${API_URIS.processApiUri}/playOrPause/${process.id}/${pausing}`;
       setPauseOrPlaying(true);
       axios.get(apiUri).then(res =>{
          getChronoUtil();
       }).catch(e => console.log(e)).finally(() => setPauseOrPlaying(false))
     }
  }

  const navigateToLogingram = () =>{
     history.push('/process/'+process.id+'/logigram');
  }
  
  const handleDelete = () =>{
    if(props.onDelete)
      props.onDelete(process);
  }

  const handleDeleteTask = (deletedId) =>{
    if(deletedId){
       setTasks(tasks.filter(t => t.id !== deletedId));
       setReloadChrono(!realodChrono)
       if(props.onTaskDelete)
          props.onTaskDelete(deletedId);
    }
  }
  
  return (
    <React.Fragment>
      {queryInstance && <QueryInstanceDetail 
        open={openQuery}
        instance={queryInstance}
        instanceId={queryInstance.id}
        onClose={() => setOpenQuery(false)}
      />
      }
      {open && <ProcessTasksModal open={open} process={process}
        onClose={handleCloseTaskModal} closeUriOnEdit={'/instance/'+process.modelId}
        onUpdate={handleTaskUpdate} onTaskDelete={handleDeleteTask}/>}
        {openTaskEditor && <TaskUpdate open={openTaskEditor} task={null} tProcess={process}
            onClose={() => setOpenTaskEditor(false)} onSave={handleSaveTask}/>}
      {process && <InstanceCreateModal process={process}
         open={openCreateInstanceModal} onClose={handleCloseCeateInstanceModal}
         onCreated={handleInstanceCreated}/>}
      <TableRow hover>
        <TableCell align="left" style={{width: 10}}>
            <IconButton aria-label="expand row" size="small" onClick={() => setShowDescription(!showDescription)}>
              {showDescription ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        <TableCell align="left">{<MyCustomPureHtmlRender body={process.label} renderInSpan />}</TableCell>
        <TableCell align="center">{(process && process.createdAt) ? formateDate(new Date(process.createdAt), `DD/MM/yyyy ${translate("_global.label.to")} HH:mm`) : '...'}</TableCell>
        {/* <TableCell align="center">
            {<Translate contentKey={'microgatewayApp.ProcessPriority.'+process.priorityLevel.toString()}>Priority</Translate>}
        </TableCell> */}
        <TableCell align="center">
          <IconButton color="primary" aria-label="show" size="small"
           className={classes.tasksFab} onClick={handleShowTasks}>
           <Visibility fontSize="small"/>
          </IconButton>&nbsp;&nbsp;
          <Typography variant="caption" display="inline">{tasks.length}</Typography>&nbsp;&nbsp;
          {instances.length <= 0 && hasPrivileges({ entities: ['Process','Task'] , 
                        actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}) &&
           <IconButton color="primary" aria-label="add" size="small"
             className={classes.tasksFab} onClick={handlAddTask}>
              <AddIcon/>
          </IconButton>}
        </TableCell>
        <TableCell align="center">
            {process.canceledAt ? translate('microgatewayApp.TaskStatus.CANCELED') : 
              processChronoUtil ? translate('microgatewayApp.TaskStatus.'+processChronoUtil.status.toString())
 : '...'}
        </TableCell>
        <TableCell align="center">
            <Box display="flex" justifyContent="center" alignItems="center">
                <ProcessChrono 
                  process={process}
                  chronoUtil={processChronoUtil}
                  loading={realodChrono}
                  chronoLoadingOnOutMode
                  onPlayOrPause={handlePlayOrPause}/>
              </Box>

        </TableCell>
        {serviceIsOnline(SetupService.QMANAGER) && 
          <TableCell align="center">
            {loadingQuery ? 'loading' : 
              queryInstance ? 
                <IconButton 
                  title={translate("entity.action.view")}
                  color="primary"
                    onClick={() => setOpenQuery(true)}>
                      <Visibility />
                </IconButton>
              : '...'
            }
          </TableCell>
        }
        <TableCell align="right">
          <Box display='flex' alignItems='center' justifyContent='center'>
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.UPDATE]}) && props.onUpdate &&
            <IconButton edge="start" aria-label="Edit" onClick={handleEdit}
            size="small" className={"mr-3"}>
              <Edit color="primary" titleAccess="Edit"/>
            </IconButton>
          }
          <IconButton edge="start" aria-label="logigram" 
            onClick={navigateToLogingram} className="mr-3"
                     title="logigram" size="small">
             <FontAwesomeIcon icon={faSitemap} className="text-info" size="sm"/>
          </IconButton>
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.DELETE]}) &&
          <IconButton edge="end" aria-label="Delete" onClick={handleDelete} size="small">
            <Delete color="error" titleAccess="Delete"/>
          </IconButton>}
        </Box>
        </TableCell>
      </TableRow>
      {process.description && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse unmountOnExit in={showDescription} timeout="auto">
              <Box margin={1}>
                  <Grid container spacing={2}>
                      <Grid item xs={12}>
                          <Typography  variant='h5' style={{paddingBottom:5}}>
                            <Translate contentKey="microgatewayApp.microprocessProcess.description">Description</Translate>
                          </Typography>
                            <MyCustomPureHtmlRender body={process.description}
                              boxProps={{ 
                                width: 1,
                                display: "flex",
                                flexWrap: 'wrap',
                                overflow: 'auto',
                              }}
                            />
                      </Grid>
                  </Grid>
              </Box>
          </Collapse>
          </TableCell>
      </TableRow>}
    </React.Fragment>
  )
}

export const Instance = (props: RouteComponentProps<{ processId: string }>) => {
  
  const [searchValue, setSearchValue] = useState('')
  const [process, setProcess] = useState<IProcess>({});
  const [processList, setProcessList] = useState<IProcess[]>([]);
  const [openProcessEditor, setOpenProcessEditor] = useState(false);
  const [processToUpdate, setProcessToUpdate] = useState<IProcess>(null);

  const [loading, setLoading] = useState(true);

  const [justificationProps, setJustificationProps] = useState<JustificationModalProps>(null);

  const [instanceToDisable, setInstanceToDisable] = useState<IProcess>(null);
  const [openDeleter, setOpenDeleter] = useState(false);

  const history = useHistory()
  
  const classes = useStyles()

  const [totalItems, setTotalItems] = useState(0);

  const [activePage, setActivePage] = useState(0);
  
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const getProcessAndInstances = () => {
        axios.get<IProcess>(`${apiUrl}/${props.match.params.processId}`).then(res =>{
            if(res.data){
                setProcess(res.data);
                axios.get<IProcess[]>(`${apiUrl}/?modelId.equals=${props.match.params.processId}&valid.equals=${true}&page=${activePage}&size=${itemsPerPage}`)
                .then(response =>{
                    setProcessList(response.data);
                    setTotalItems(parseInt(response.headers['x-total-count'], 10));
                    setLoading(false);
                }).catch(error =>{
                    /* eslint-disable no-console */
                    console.log(error);
                    setLoading(false);
                })
            }
        }).catch(e => {
            /* eslint-disable no-console */
            console.log(e);
            setLoading(false);
        });
  };

  useEffect(() => {
    getProcessAndInstances();
  }, [activePage, itemsPerPage]);

  const handleOpenJustifications = (modalProps: JustificationModalProps) =>{
     if(modalProps)
        setJustificationProps({...modalProps});
  }
  
  const onDelete = (deleted?: number) =>{
    if(deleted && instanceToDisable){
      setProcessList([...processList].filter(p => p.id !==instanceToDisable.id));
      setOpenDeleter(false)
    }
  }

  const handleDelete = (inst?: IProcess) =>{
    if(inst){
      setInstanceToDisable(inst);
      setOpenDeleter(true);
    }
  }

  const handleUpdate = (p?: IProcess) =>{
    console.log(p);
    setProcessToUpdate(p);
    setOpenProcessEditor(true);
  }

  const onProcessUpdate = (updated: IProcess, isNew?: boolean) =>{
     if(updated){
       if(isNew){
        setProcessList([updated, ...processList]);
        setOpenProcessEditor(false);
       }else{
         setProcessList([...processList].map(p => p.id === updated.id ? updated : p));
       }
     }
  }

  const items = [...processList].sort((a,b) =>b.id-a.id).filter(p => 
     p.valid && p.modelId && (
      (p.label && p.label.toLowerCase().includes(searchValue.toLowerCase()))
      || (p.description && p.description.toLowerCase().includes(searchValue.toLowerCase()))
     )
     ).map((procs, index) =>(
       <ItemRow key={index} process={procs} 
          processes={[...processList]} onUpdate={handleUpdate}
          onOpenJustifications={handleOpenJustifications} onDelete={handleDelete}/>
       ))

  const handleSearchChange = (e) =>{
    setSearchValue(e.target.value);
  }

  const handleChangeItemsPerPage = (e) =>{
    setItemsPerPage(parseInt(e.target.value,10));
  }

  const handleChangePage = (e, newPage) =>{
    setActivePage(newPage);
  }



  return (
    <React.Fragment>
        <Helmet><title>Cperf | Process | Instances</title></Helmet>
        <ProcessUpdate open={openProcessEditor} entity={processToUpdate}
          onSave={onProcessUpdate} onClose={() => setOpenProcessEditor(false)} />
        <ProcessDisable entity={instanceToDisable} open={openDeleter}
          onSave={onDelete} onClose={() => setOpenDeleter(false)}
          question={instanceToDisable ? 
              <Translate contentKey="_global.instance.delete.question" interpolate={{ id: instanceToDisable.label }}>
                Are you sure you want to delete this Process?
              </Translate> : null}
            />
        {/* justificationProps &&
         <JustificationModal open={true} process={justificationProps.process} 
           task={justificationProps.task} reason={justificationProps.reason} onClose={() => setJustificationProps(null)}/>
        */}
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" mt={1}>
                    <Box display="flex" alignItems="center">
                      <IconButton 
                      aria-label="back" 
                      color="inherit"
                      onClick={() =>{ history.push('/process')}} 
                      title="process" style={{ padding: 0}}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                      </IconButton>
                      <Typography variant="h4" className="ml-2 mr-2">
                        <Translate contentKey="_global.instance.home.title">Instances</Translate>
                      </Typography>
                    </Box>
                    <CardSubHeaderInlineSearchBar 
                      onChange = {handleSearchChange}
                    />
                </Box>}
                titleTypographyProps={{ variant: 'h4', style:{ } }}
                 classes={{ root: classes.cardHeader }}
                />
                <CardContent className={classes.cardContent}>
                  <Box width={1} display="flex" justifyContent="center"
                      marginBottom={2} marginTop={-1} boxShadow={2} p={1}>
                      <Typography color="primary" variant="h5">
                          {translate('microgatewayApp.microprocessProcess.detail.title')}&nbsp;:&nbsp;
                      </Typography>
                      <Typography color="primary" variant="h5">
                        {<MyCustomPureHtmlRender body={process.label} renderInSpan />}
                      </Typography>
                  </Box>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left"  style={{width: 10}}></TableCell>
                              <TableCell align="left" className={classes.tHeadCell}>
                                {`${translate('_global.label.label')}s`}</TableCell>
                              <TableCell align="center"  className={classes.tHeadCell}>
                                {translate('microgatewayApp.microprocessProcess.createdAt')}
                              </TableCell>
                              <TableCell align="center"  className={classes.tHeadCell}>
                                  {translate('microgatewayApp.microprocessTask.home.title')}
                              </TableCell>
                              <TableCell align="center" className={classes.tHeadCell}>
                                {`${translate('microgatewayApp.microprocessTask.status')}s`}
                              </TableCell>
                              <TableCell align="center"  className={classes.tHeadCell}>{translate('_global.label.chrono')}</TableCell>
                              {serviceIsOnline(SetupService.QMANAGER) && 
                                <TableCell align="center" className={classes.tHeadCell}>
                                  {translate('microgatewayApp.qmanagerQuery.home.title')}
                                </TableCell>
                              }
                              <TableCell align="center"  className={classes.tHeadCell}>{'Actions'}</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {(loading || items.length <=0) && <TableRow>
                          <TableCell align="center" colSpan={20}>
                            {loading && 'loading...'}
                            {(!loading && items.length<=0) &&
                              <Typography variant="body1">
                                <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
                              </Typography>
                            }
                          </TableCell>
                        </TableRow>}
                        {items}
                    </TableBody>
                </Table>
             </CardContent>
            {totalItems > 0 &&
              <CardActions className={classes.cardActions}>
                <TablePagination 
                component="div"
                count={totalItems}
                page={activePage}
                onPageChange={handleChangePage}
                rowsPerPage={itemsPerPage}
                onChangeRowsPerPage={handleChangeItemsPerPage}
                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                classes={{ 
                    root: classes.pagination,
                    input: classes.paginationInput,
                    selectIcon: classes.paginationSelectIcon,
              }}/>
            </CardActions>
          }
        </Card>
    </React.Fragment>
  );
};

export default Instance;
