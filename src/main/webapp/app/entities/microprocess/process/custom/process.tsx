import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProcess } from 'app/shared/model/microprocess/process.model';
import { Box, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, makeStyles, MenuItem, Select, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { faClone, faSitemap, faUsers } from '@fortawesome/free-solid-svg-icons';
import AddIcon from '@material-ui/icons/Add'
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { Visibility, Edit, Delete, AccountTree, AccessAlarms } from '@material-ui/icons';
import { ITask } from 'app/shared/model/microprocess/task.model';
import axios from 'axios';
import { ProcessTasksModal } from './process-tasks-modal';
import { Helmet } from 'react-helmet';
import { InstanceCreateModal } from './instance-create-modal';
import { API_URIS, getTotalPages, openMshzFile } from 'app/shared/util/helpers';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { FileIllustration } from 'app/shared/component/file-previewer';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import CopyProcessModal from './copy-process-modal';
import { IProcessCategory } from 'app/shared/model/microprocess/process-category.model';
import ProcessDisable  from './process-disable';
import ProcessUpdate from './process-update';
import TaskUpdate from '../../task/custom/task-update';
import EventTrigger from '../../event-trigger/custom/event-trigger';
import ProcessCategoryUser from '../../process-category-user/custom/process-category-user';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { IProcessCategoryUser } from 'app/shared/model/microprocess/process-category-user.model';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow: '-1px -1px 10px',
  },
  cardHeader: {
    paddingTop:2,
    paddingBottom:2,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.dark,
    // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
  },
  cardContent:{
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
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
  tasksFab:{
    boxShadow: 'none',
    background: 'transparent',
    color: theme.palette.success.dark,
    '& :disabled':{
      background: 'transparent',
    }
  },
  procedureFileIllustration:{
     height: theme.spacing(4),
     width: theme.spacing(5),
     fontSize: theme.spacing(6),
     cursor: 'pointer',
     marginTop:'1px',
     '&:hover':{
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
  catSelect:{
      height:theme.spacing(3),
      fontSize:15,
      color: theme.palette.primary.dark,
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
      // borderBottom: '1px solid white',
  },
}))

const taskApiUrl = 'services/microprocess/api/tasks';

const ItemRow = (props: {process: IProcess, onCopying: Function, onUpdate?: Function,
   onDelete?: Function, handleOpenEvents: Function}) =>{
  const process = props.process
  const [showDescription, setShowDescription] = useState(false)
  const [tasksSize, setTasksSize] = useState(0);
  const [instanceSize, setInstancesSize] =useState(0);
  const [openTaskEditor, setOpenTaskEditor] = useState(false);
  const [openUsers,setOpenUsers] = useState(false);

  const history = useHistory()

  const classes = useStyles()

  const [open, setOpen] = useState(false);

  const [openCreateInstanceModal, setOpenCreateInstanceModal] = useState(false);
  
  const [procedure, setProcedure] = useState<IProcedure>(null);
  const [procedureFile, setProcedureFile] = useState<IMshzFile>(null)

  const handleDelete = () =>{
    if(props.onDelete)
      props.onDelete(process);
  }

  const getInstancesSize = () =>{
    if(process && process.id){
      axios.get<IProcess[]>(`${API_URIS.processApiUri}/?valid.equals=${true}&modelId.equals=${process.id}&page=${0}&size=${1}`)
            .then(res =>{
              setInstancesSize(parseInt(res.headers['x-total-count'], 10));
            }).catch(() =>{})
    }
  }

  const getProcedureAndFile = () =>{
     if(process && process.procedureId){
       axios.get<IProcedure>(`${API_URIS.procedureApiUri}/${process.procedureId}`).then(resp =>{
          if(resp.data){
            setProcedure(resp.data);
            if(resp.data.fileId && serviceIsOnline(SetupService.FILEMANAGER)){
              axios.get<IMshzFile>(`${API_URIS.mshzFileApiUri}/${resp.data.fileId}`).then(res =>{
                  if(res.data)
                    setProcedureFile(res.data);
              }).catch(() =>{})
            }
          }
       }).catch(() =>{})
     }
  }

  useEffect(() =>{
    axios.get<ITask[]>(`${taskApiUrl}/?page=${0}&size=${1}&processId.equals=${process.id}&valid.equals=${true}`).then(res =>{
       if(res.data)
        setTasksSize(parseInt(res.headers['x-total-count'], 10));
    }).catch(e =>{
      /* eslint-disable no-console */
      console.log(e)
    })
    getProcedureAndFile();
    getInstancesSize();
  }, [props.process])

  const handleEdit = () =>{
    if(props.onUpdate)
      props.onUpdate(process);
  }
  const handlAddTask = () => setOpenTaskEditor(true);

  const handleSaveTask = (saved?: ITask, isNew?:boolean) =>{
      if(saved){
        if(isNew){
          setTasksSize(tasksSize + 1);
          setOpenTaskEditor(false);
        }
      }
  }

  const handleShowTasks = () =>{
    setOpen(true);
    // props.onShowTasks(tasks, process)
  }

  const handleCloseTaskModal = () =>{
    setOpen(false);
  }

  const handleCloseCeateInstanceModal = () =>{
    setOpenCreateInstanceModal(false);
  }

  const handleInstanceCreated = (instance?: IProcess) =>{
    if(instance){
      setInstancesSize(instanceSize + 1);
      setOpenCreateInstanceModal(false);
    }
  }

  const handleShowInstances = () =>{
      history.push('/instance/'+process.id);
  }

  const navigateToLogingram = () =>{
     history.push('/process/'+process.id+'/logigram');
  }

  const handleOpenEvents = () => props.handleOpenEvents(process);

  const handleDeleteTask = (deletedId) =>{
    if(deletedId)
      setTasksSize(tasksSize -1);
  }

  return (
    <React.Fragment>
      <ProcessCategoryUser open={openUsers} processus={process} onClose={() => setOpenUsers(false)} />
      {open && <ProcessTasksModal open={open} process={process}
       onClose={handleCloseTaskModal} onTaskDelete={handleDeleteTask} />}
      {openTaskEditor && <TaskUpdate open={openTaskEditor} task={null} tProcess={process}
          onClose={() => setOpenTaskEditor(false)} onSave={handleSaveTask}/>}
      {openCreateInstanceModal && <InstanceCreateModal process={process}
         open={openCreateInstanceModal} onClose={handleCloseCeateInstanceModal}
         onCreated={handleInstanceCreated}/>}
      <TableRow hover>
        <TableCell align="left" style={{width: 10}}>
            <IconButton aria-label="expand row" size="small" onClick={() => setShowDescription(!showDescription)}>
              {showDescription ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        <TableCell align="left">{<MyCustomPureHtmlRender body={process.label} renderInSpan />}</TableCell>
        {/* <TableCell align="center">
            {<Translate contentKey={'microgatewayApp.ProcessPriority.'+process.priorityLevel.toString()}>Priority</Translate>}
        </TableCell> */}
        <TableCell align="center">
            {process && process.category ? process.category.name || '...' : '....'}
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" display="inline">{tasksSize}</Typography>&nbsp;&nbsp;
          <IconButton color="primary" aria-label="show" size="small"
           className={classes.tasksFab} onClick={handleShowTasks}>
           <Visibility fontSize="small"/>
          </IconButton>&nbsp;&nbsp;
          {hasPrivileges({ entities: ['Process','Task'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}) &&
           <IconButton color="primary" aria-label="add" size="small"
             className={classes.tasksFab} onClick={handlAddTask}>
              <AddIcon/>
          </IconButton>}
        </TableCell>
        <TableCell align="center">
          {procedure && procedure.name} <br/>
          {procedureFile && <FileIllustration file={procedureFile} title="Description file"
              className={classes.procedureFileIllustration} onClick={() => openMshzFile(procedureFile)}/>}
          {!procedure && '...'}
        </TableCell>
        <TableCell align="center">
          <Box display='flex' alignItems='center' justifyContent='center'>
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.UPDATE]}) && props.onUpdate && 
            <IconButton edge="start" aria-label="Edit" onClick={handleEdit}
              size="small" className="mr-2">
              <Edit color="primary" titleAccess="Edit"/>
            </IconButton>
          }
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}) &&
          <Tooltip title={translate("userManagement.home.title")}
              onClick={() => setOpenUsers(true)}>
              <IconButton color="default">
                  <FontAwesomeIcon icon={faUsers} />
              </IconButton>
          </Tooltip>
          }
          <IconButton edge="start" aria-label="logigram" onClick={navigateToLogingram} 
            size="small" className="mr-2" title="logigram">
            <FontAwesomeIcon icon={faSitemap} className="text-info" size="sm"/>
          </IconButton>
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.ALL]}) &&
            <IconButton edge="start" aria-label="copy" onClick={() => props.onCopying(process)} 
              size="small" className="mr-2" title="copy">
              <FontAwesomeIcon icon={faClone} className="text-secondary" size="sm"/>
            </IconButton>
          }
          {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.DELETE]}) &&
          <IconButton edge="end" aria-label="Delete" onClick={handleDelete} size="small">
            <Delete color="error" titleAccess="Delete"/>
          </IconButton>}
        </Box>
        </TableCell>
        <TableCell align="right">
          <IconButton color="primary" size="small" onClick={handleShowInstances}>
              <Visibility />
          </IconButton>
          {tasksSize >0 && hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}) &&
            <IconButton color="primary" size="small" onClick={() =>setOpenCreateInstanceModal(true)} title="create">
                <AddIcon />
            </IconButton>
          }
          {tasksSize >0 && hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}) &&
            <IconButton color="primary" size="small" onClick={handleOpenEvents} title="">
              <AccessAlarms />
            </IconButton>
          }
        </TableCell>
      </TableRow>
      {process.description && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
          <Collapse unmountOnExit in={showDescription} timeout="auto">
              <Box margin={1}>
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
              </Box>
          </Collapse>
          </TableCell>
      </TableRow>}
    </React.Fragment>
  )
}

interface ProcessProps extends StateProps, DispatchProps{} 

export const Process = (props: ProcessProps) => {
  const { account } = props;
  const [searchValue, setSearchValue] = useState('')
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [processToDelete, setProcessToDelete] = useState<IProcess>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openProcessEditor, setOpenProcessEditor] = useState(false);
  const [processToUpdate, setProcessToUpdate] = useState<IProcess>(null);
  const [selectedProcess, setSelectedProcess] = useState<IProcess>(null);
  const [openEventes, setOpenEvents] = useState(false);
  const [userCatsAndProcesses, setUserCatsAndProcessus] = useState<IProcessCategoryUser[]>([]);
  const [initalizeData, setIntiliazeData] = useState(false);

  const [cats, setCats] = useState<IProcessCategory[]>([]);
  const [cat, setCat] = useState<IProcessCategory>(null);
  
  const classes = useStyles()

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const [processToCopy, setProcessToCopy] = useState<IProcess>(null);

  const getCategories = (ids?: number[]) =>{
    let apiUri = `${API_URIS.processCategoryApiUri}`;
    if(ids && ids.length !== 0)
      apiUri = `${apiUri}/?catgoryId.in=${ids.join(',')}`
    else
      apiUri = `${apiUri}/all`
    setLoading(true)
    axios.get<IProcessCategory[]>(apiUri)
        .then(res =>{
            setCats([...res.data])
            setIntiliazeData(true);
        }).catch(e => console.log(e))
        .finally(() => setLoading(false));
  }

  const getUserCatsAndProcesses = () =>{
    if(props.account && props.account.id){
      setLoading(true);
      axios.get<IProcessCategoryUser[]>(`${API_URIS.processCategoryUserApiUri}/?userId.equals=${props.account.id}&page=0&size=1000`)
          .then(res =>{
              setUserCatsAndProcessus([...res.data])
              if(hasPrivileges({entities: ['Process'], actions: [PrivilegeAction.ALL]}, account.authorities)){
                getCategories(); // find all cats
              }else{
                if(res.data && res.data.length !== 0){
                  const catIds = res.data.filter(pcu => pcu.categoryId).map(pcu => pcu.categoryId);
                  getCategories(catIds);
                }
              }
          }).catch(e => {
            console.log(e)
            setUserCatsAndProcessus([]);
          }).finally(() => setLoading(false));
    }
  }


  const getProcesses = (catId?: any, p?: number, rows?: number) => {
    if(account){
      const page = p || p === 0 ? p : activePage;
      const size = rows || itemsPerPage;
      let requestUri =`${API_URIS.processApiUri}/?valid.equals=${true}&modelId.specified=false&page=${page}&size=${size}`;
      if(catId){
        requestUri = `${requestUri}&categoryId.equals=${catId}`
      }else{
        if(hasPrivileges({entities: ['Process'], actions: [PrivilegeAction.ALL]}, account.authorities)){
          requestUri = `${requestUri}&categoryId.specified=false`
        }else{
          if(userCatsAndProcesses && userCatsAndProcesses.filter(item => item.processId && !item.categoryId).length !== 0){
            const processIds = userCatsAndProcesses.filter(item => item.processId && !item.categoryId).map(item => item.processId);
            requestUri = `${requestUri}&id.in=${processIds.join(',')}`
          }else{
            requestUri = null;
          }
        }
      }
      if(requestUri){
        setLoading(true);
        axios.get<IProcess[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setProcesses([...res.data])
            setLoading(false);
          }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
          });
      }else{
        setProcesses([]);
      }
    }
  };

  useEffect(() =>{
    getUserCatsAndProcesses();
  }, [props.account])

  useEffect(() =>{
      if(initalizeData)
        getProcesses();
  }, [initalizeData])

  const handleCoping = (p: IProcess) =>{
    if(p){
      setProcessToCopy(p);
    }
  }

  const onCloseProcessCopyMOdal = (copied?: IProcess) =>{
    if(copied){
      setProcesses([copied, ...processes]);
      /* esint-disable no-console */
      console.log(copied);
    }
    setProcessToCopy(null);
  }

  const handleUpdate = (p?: IProcess) =>{
    console.log(p);
    setProcessToUpdate(p);
    setOpenProcessEditor(true);
  }

  const onProcessUpdate = (updated: IProcess, isNew?: boolean) =>{
     if(updated){
       if(isNew){
        setProcesses([updated, ...processes]);
        setOpenProcessEditor(false);
       }else{
         setProcesses([...processes].map(p => p.id === updated.id ? updated : p));
       }
     }
  }

  const handleDelete = (p?: IProcess) =>{
    if(p){
      setProcessToDelete(p);
      setOpen(true);
    }
  }

  const onDelete = (deleted?: number) =>{
    if(deleted && processToDelete){
      setProcesses([...processes].filter(p => p.id !==processToDelete.id));
      setOpen(false)
    }
  }

  const handleOpenEvents = (p?: IProcess) =>{
    if(p){
      setSelectedProcess(p);
      setOpenEvents(true);
    }
  }

  const items = [...processes].sort((a,b) =>b.id-a.id).filter(p => 
     p.valid && !p.modelId && (
      (p.label && p.label.toLowerCase().includes(searchValue.toLowerCase()))
      || (p.description && p.description.toLowerCase().includes(searchValue.toLowerCase()))
     )
    ).map((process, index) =>(
       <ItemRow key={index} process={process} onUpdate={handleUpdate}
        onCopying={handleCoping} onDelete={handleDelete} handleOpenEvents={handleOpenEvents}/>
    ))

  const handleSearchChange = (e) =>{
    setSearchValue(e.target.value);
  }

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getProcesses(cat ? cat.id : null, null, parseInt(event.target.value, 10));
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getProcesses(cat ? cat.id : null, newPage, null);
  }

  const handleChange = (e) =>{
      const value = e.target.value;
      if(value === 0){
       setCat(null)
       getProcesses();
      }else{
          setCat([...cats].find(c => c.id.toString() === value.toString()))
          getProcesses(value);
      }
  }
  
  return (
    <React.Fragment>
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.microprocessProcess.home.title")}`}</title></Helmet>
        <ProcessUpdate open={openProcessEditor} entity={processToUpdate}
          onSave={onProcessUpdate} onClose={() => setOpenProcessEditor(false)} />
        {selectedProcess && 
          <EventTrigger open={openEventes} 
              process={selectedProcess} onClose={() => setOpenEvents(false)}/> }
        <ProcessDisable entity={processToDelete} open={open}
          onSave={onDelete} onClose={() => setOpen(false)}
          question={processToDelete ? 
              <Translate contentKey="microgatewayApp.microprocessProcess.delete.question" interpolate={{ id: processToDelete.label }}>
                Are you sure you want to delete this Process?
              </Translate> : null}
            />
        {processToCopy && <CopyProcessModal process={processToCopy} open={true} onClose={onCloseProcessCopyMOdal}/>}
        <Card className={classes.card}>
          <CardHeader 
                action={
                  <>
                  {hasPrivileges({ entities: ['Process'] , actions: [PrivilegeAction.CREATE]}) && 
                    <IconButton aria-label="add" onClick={() => handleUpdate(null)} color="primary" className="mt-1">
                      <AddIcon style={{ fontSize: 30 }} />
                    </IconButton>
                  }
                  </>
                }
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccountTree className="mr-3"/>
                    <Translate contentKey="microgatewayApp.microprocessProcess.home.title">Process</Translate>
                    <CardSubHeaderInlineSearchBar
                     onChange = {handleSearchChange}
                     />
                    <Box display="flex" justifyContent="flex-end" alignItems="center">
                          <Typography variant="body2" className="mr-2">
                              {translate("microgatewayApp.micropartenerPartener.category")}&nbsp;:
                          </Typography>
                          <Select value={cat && cat.id ? cat.id:  0} onChange={handleChange}
                              fullWidth margin="none"
                              variant="standard"
                              className={classes.catSelect}
                              >
                                <MenuItem value={0}>{translate('_global.label.uncategorized')}</MenuItem>
                                {[...cats].map((c, index) =>(
                                  <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                                ))}
                          </Select>
                    </Box>
                </Box>}
                titleTypographyProps={{ variant: 'h4', style:{ } }}
                classes={{ root: classes.cardHeader }}
                />
                <CardContent className={classes.cardContent}>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left"  style={{width: 10}}></TableCell>
                              <TableCell align="left">
                                {translate('microgatewayApp.microprocessProcess.detail.title')}</TableCell>
                              {/* <TableCell align="center">{translate('microgatewayApp.microprocessProcess.priorityLevel')}</TableCell> */}
                              <TableCell align="center">{translate('microgatewayApp.microprocessProcessCategory.detail.title')}</TableCell>
                              <TableCell align="center">{translate('microgatewayApp.microprocessTask.home.title')}</TableCell>
                              <TableCell align="center">{translate('microgatewayApp.microprocessProcedure.detail.title')}</TableCell>
                              <TableCell align="center">{'Actions'}</TableCell>
                              <TableCell align="right">{translate('_global.instance.home.title')}</TableCell>
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
              }
        </Card>
    </React.Fragment>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Process);
