import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { ITask, defaultValue as initTask } from 'app/shared/model/microprocess/task.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Backdrop, Badge, Box, Button, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Slide, TextField, Typography } from '@material-ui/core';
import { Card } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save'
import axios from 'axios'
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import Alert from '@material-ui/lab/Alert';
import { Description, Edit, OpenWith } from '@material-ui/icons';
import TaskFileModal from '../../taskfile/custom/task-file-modal';
import { TaskFileType } from 'app/shared/model/enumerations/task-file-type.model';
import TaskUserModal from '../../task-user/custom/task-user-modal';
import StartupTasksModal from './startup-tasks-modal';
import { TaskType } from 'app/shared/model/enumerations/task-type.model';
import Close from '@material-ui/icons/Close';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { DateTimePicker } from '@material-ui/pickers';
import { convertDateFromServer, formateDate } from 'app/shared/util/date-utils';
import TaskItem from '../../task-item/custom/task-item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faUsers } from '@fortawesome/free-solid-svg-icons';
import theme from 'app/theme';
import MyCustomRTEModal from 'app/shared/component/my-custom-rte-modal';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles({
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
        overflow: 'auto'
    },
    cardheader:{
        background: theme.palette.background.paper,
        color:  theme.palette.primary.dark,
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
    cardActions:{
      background: 'white',
      color: theme.palette.primary.main,
      borderRadius: '0 0 15px 15px',
    },
   badge: {
    right: -3,
    border: `2px solid ${theme.palette.secondary.light}`,
  },
  field:{
      borderRadius: 5,
      paddingLeft:7,
      paddingRight:7,
      fontSize: 15,
      marginTop:20,
      background: theme.palette.grey[200],
      '&:hover':{
          background: theme.palette.grey[300],
      },
      '&:focus':{
          background: theme.palette.grey[300],
      }
  },
  descCard:{
    width: '43%',
    [theme.breakpoints.down("sm")]:{
        width: '85%',
    },
  },
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const taskApiUrl = 'services/microprocess/api/tasks';

export const enum TASK_START_MODE{
  WITH_PROCESS = 'with_process',
  AFTER_PREVIEW = 'after_preview',
  ON_FIXED_DATE = 'on_fixed_date',
}

export interface ITaskUpdateProps extends StateProps, DispatchProps{
   task?:ITask,
   tProcess: IProcess,
   open?:boolean,
   onClose: Function,
   onSave?: Function,
 }

export const TaskUpdate = (props: ITaskUpdateProps) => {
  const { departments, tProcess, open } = props;
  const [isNew, setIsNew] = useState(!props.task || !props.task.id);
  const [entityState, setEntityState] = useState<ITask>(props.task || {...initTask});
  const classes = useStyles()

  const [formError, setFormError] =  useState<object>({})

  const [updating, setUpdating] = useState(false)
  const [updated, setUpdated] = useState(false)

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [openFileModal, setOpenFileModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openStartupTasksModal, setOpenStartupTasksModal] = useState(false);

  const [filesSize, setFilesSize] = useState(0);
  const [startupTasksSize, setStartupTasksSize] = useState(0);
  const [tASK_START_MODE, setTASK_START_MODE] = useState(TASK_START_MODE.WITH_PROCESS);
  const [openCheckList, setOpenCheckList] = useState(false);

  const [sheduledOn, setSheduledOn] = useState(new Date());
  const [openDescEditor, setOpenDescEditor] = useState(false);

  const initTializeSheduledOn = () =>{
    if(entityState && entityState.sheduledStartAt){
      const date = new Date(entityState.sheduledStartAt);
        date.setHours(entityState.sheduledStartHour || 0);
        date.setMinutes(entityState.sheduledStartMinute || 0);
        setSheduledOn(date);
    }
  }

  const handleClose = () => props.onClose();

  useEffect(() =>{
     props.getDepartments();
  }, [])

  useEffect(() => {
    props.getDepartments();
  }, []);

  useEffect(() =>{
      setIsNew(!props.task || !props.task.id);
      setEntityState(props.task || {...initTask});
      initTializeSheduledOn();
      if(props.task){
        if(props.task.sheduledStartAt && (props.task.sheduledStartHour || props.task.sheduledStartHour === 0)){
          setTASK_START_MODE(TASK_START_MODE.ON_FIXED_DATE)
        }else{
          if(props.task.startWithProcess)
            setTASK_START_MODE(TASK_START_MODE.WITH_PROCESS)
          else
            setTASK_START_MODE(TASK_START_MODE.AFTER_PREVIEW)
        }
      }
  }, [props.task, props.tProcess])

  const hasError = (property) =>{
      return Object.prototype.hasOwnProperty.call(formError, property)
  }

  const addError = (property) =>{
     if(!hasError(property)){
       setFormError({...formError, [property]: true})
     }
  }

  const deleteError = (property) =>{
     if(hasError(property)){
        delete formError[property]
        setFormError({...formError})
     }
  }

  const handleChange = (e) =>{
    const name = e.target.name
    let value = e.target.type==='checkbox' ? e.target.checked : e.target.value

    if(typeof value === 'string' && value.trim() === '')
      value = null
    if(name==="isYesCond"){
      value = value === "true" ? true : value === "false" ? false : value
    }
    setEntityState({...entityState, [name]: value})

    if(e.target.required){
      if(value)
         deleteError(name)
      else
        addError(name)
    }
  }

  const handleChangeTASK_START_MODE = (e) =>{
     setTASK_START_MODE(e.target.value);
  }

  const initForm = () =>{
    setEntityState({...initTask})
  }
  
  const handleAdd = () =>{
    setIsNew(true)
    initForm()
  }

  const saveEntity = (event) => {
      event.preventDefault()
      setUpdating(true)
      setUpdated(false)
      setUpdateSuccess(false)
      if(!hasError('name') && tProcess){
         const entity: ITask = {
           ...entityState,
           valid: isNew ? true : entityState.valid,
           status: isNew ? TaskStatus.VALID : entityState.status,
           processId:  isNew ? tProcess.id : entityState.processId,
           type: TaskType.ACTIVITY,
           startWithProcess: tASK_START_MODE === TASK_START_MODE.WITH_PROCESS ? true : false,
           sheduledStartAt: tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE ? convertDateFromServer(sheduledOn) : null,
           sheduledStartHour: tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE ? sheduledOn.getHours() : null,
           sheduledStartMinute: tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE ? sheduledOn.getMinutes() : null,
         }
         const req = isNew ? axios.post<ITask>(`${taskApiUrl}`, cleanEntity(entity))
                           : axios.put<ITask>(`${taskApiUrl}`, cleanEntity(entity));
         req.then(res =>{
             if(res.data){
               setEntityState({...res.data});
               setUpdateSuccess(true);
               props.onSave(res.data, isNew);
             }
         }).catch(e =>{
           /* eslint-disable no-console */
           console.log(e);
           setUpdateSuccess(false)
         }).finally(() =>{
           setUpdating(false)
           setUpdated(true)
         })
    }
  };
  
  const handleOpenFileModal = () =>{
    setOpenFileModal(true);
  }
  
  const handleOpenUserModal = () =>{
    setOpenUserModal(true);
  }

  const handleCloseFileModal = (size) =>{
    setFilesSize(size);
    setOpenFileModal(false);
  }
  const handleCloseUserModal = () =>{
    setOpenUserModal(false);
  }

  const handleOpenStatupTasksModal = () => setOpenStartupTasksModal(true);

  const handleCloseStartupTasksModal = (size: number) => {
    setStartupTasksSize(size);
    setOpenStartupTasksModal(false);
  }

  const handleChangeSheduledOn = (newDate) => setSheduledOn(newDate);

  const handleOpendDescEditor = (e) =>{
    e.preventDefault();
    setOpenDescEditor(true);
  }

  return (
      <React.Fragment>
        {/* modal cheick list */}
        {entityState && entityState.id && <TaskItem open={openCheckList} task={entityState} onClose={() => setOpenCheckList(false)}/>}
        {entityState && entityState.id && <TaskFileModal task={entityState} 
          open={openFileModal}  type={TaskFileType.DESCRIPTION} canAdd
          canDelete onClose={handleCloseFileModal}/>}
        {entityState && entityState.id && <TaskUserModal task={entityState} 
          open={openUserModal} canAdd canDelete onClose={handleCloseUserModal} />}
        {entityState && openStartupTasksModal && <StartupTasksModal 
          task={entityState} open={openStartupTasksModal} canEdit onClose={handleCloseStartupTasksModal} />}
        
        <MyCustomRTEModal 
          open={openDescEditor}
          content={entityState ?  entityState.description : ''}
          title={translate('microgatewayApp.microprocessTask.description')}
          onClose={() => setOpenDescEditor(false)}
          onSave={value => {
            setEntityState({...entityState, description: value})
            setOpenDescEditor(false)
          }}
          cardClassName={classes.descCard}
          editorMinHeight={300}
        />
        <MyCustomModal 
          open={open}
           onClose={handleClose}
           rootCardClassName={classes.card}
           headerClassName={classes.cardheader}
           title={translate('microgatewayApp.microprocessTask.home.createOrEditLabel')}
           customCardContentClassName={classes.cardcontent}
           foolterClassName={classes.cardActions}
           footer={<>
            {entityState && entityState.id && tProcess && <>
                <IconButton title={translate("_global.task.descriptionFiles")}
                onClick={handleOpenFileModal}>
                  <Badge badgeContent={filesSize} color="secondary"
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}>
                    <Description />
                  </Badge>
                </IconButton>
                <IconButton title={translate(`microgatewayApp.microprocessTaskUser.home.title`)}
                onClick={handleOpenUserModal}>
                    <FontAwesomeIcon icon={faUsers} />
                </IconButton>
                {/* serviceIsOnline(SetupService.RISK) && <>
                <IconButton title={translate(`microgatewayApp.TaskUserRole.${TaskUserRole.SUBMITOR.toString()}`) + 'S'}
                  onClick={() =>handleOpenUserModal(TaskUserRole.SUBMITOR)}>
                  <Badge badgeContent={submitorsSize} color="secondary"
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}>
                    <TouchApp />
                  </Badge>
                </IconButton>
                <IconButton title={translate(`microgatewayApp.TaskUserRole.${TaskUserRole.VALIDATOR.toString()}`) + 'S'}
                  onClick={() =>handleOpenUserModal(TaskUserRole.VALIDATOR)}>
                  <Badge badgeContent={validatorsSize} color="secondary"
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}>
                      <HowToReg />
                  </Badge>
                </IconButton>
                  </> */}
                <IconButton title={translate(`_global.label.startupTasks`)}
                  onClick={handleOpenStatupTasksModal}>
                  <Badge badgeContent={startupTasksSize} color="secondary"
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}>
                      <OpenWith />
                  </Badge>
                </IconButton>
                  {/* ------- Button to display task checkList modal */ }
                  <IconButton title={translate(`microgatewayApp.microprocessTaskItem.home.title`)} 
                       onClick={() => setOpenCheckList(true)}>
                          <FontAwesomeIcon icon={faTasks} size="sm" />
                  </IconButton> 
                </>}
           </>}
          >
            <>
            {tProcess && 
              <form  onSubmit={saveEntity}>
                <Grid container spacing={1} alignItems="baseline">
                  <Grid item xs={12}>
                      {updating && <Box textAlign="center">
                        <CircularProgress />
                      </Box>}
                    {(updated && updateSuccess) && <Alert onClose={() =>{setUpdated(false)}}>
                        <Translate contentKey="_global.messages.entity.edition.success.title">Success : </Translate>&nbsp;:&nbsp;
                        <Translate contentKey="_global.messages.entity.edition.success.info">opération réussi </Translate>
                    </Alert> }
                    {(updated && !updateSuccess) && <Alert onClose={() =>{ setUpdated(false)}}>
                        <Translate contentKey="_global.messages.entity.edition.error.title">erreur : </Translate>&nbsp;:&nbsp;
                        <Translate contentKey="_global.messages.entity.edition.error.info">opération échouée </Translate>
                    </Alert> }
                  </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl error={hasError('name')} fullWidth>
                      <TextField type="text" name="name"
                          value={entityState.name} required 
                          label={translate('microgatewayApp.microprocessTask.name')}
                          onFocus={() => deleteError('name')}
                          onBlur={() => entityState.name ? deleteError('name') : addError('name')}
                          onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                          {hasError('name') && 
                          <FormHelperText>{translate('_global.form.helpersTexts.required')}</FormHelperText>}
                    </FormControl>
                </Grid>
                {/* <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="type_task-select-label" shrink>
                          <Translate contentKey="microgatewayApp.microprocessTask.type">Type de la tâche</Translate>
                      </InputLabel>
                      <Select
                        labelId="type_task-select-label"
                        id="type_task-select-label"
                        name="type"
                        value={entityState.type}
                        onChange={handleChange}
                        
                      >
                      {/* <MenuItem value="START">{translate('microgatewayApp.TaskType.START')}</MenuItem> *}
                      <MenuItem value="ACTIVITY">{translate('microgatewayApp.TaskType.ACTIVITY')}</MenuItem>
                      <MenuItem value="SUBACTIVITY">{translate('microgatewayApp.TaskType.SUBACTIVITY')}</MenuItem>
                      <MenuItem value="DOC">{translate('microgatewayApp.TaskType.DOC')}</MenuItem>
                      {/* <MenuItem value="END">{translate('microgatewayApp.TaskType.END')}</MenuItem> *}
                      </Select>
                    </FormControl>
                </Grid> */}
                <Grid item xs={12} md={12}>
                  <Box width={1} textAlign={"center"} mt={1} mb={1}>
                    <Button endIcon={<Edit />} 
                      color="primary"
                      className="text-capitalize"
                      onClick={() => setOpenDescEditor(true)}>
                      {translate('microgatewayApp.microprocessProcess.description')}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE ? 4 : 6}>
                    <FormControl fullWidth>
                      <InputLabel id="type_task-select-label" shrink>
                          <Translate contentKey="microgatewayApp.microprocessTask.groupId">Groupe</Translate>
                      </InputLabel>
                      <Select
                        labelId="type_task-select-label"
                        id="type_task-select-label"
                        name="groupId"
                        value={entityState.groupId}
                        onChange={handleChange}
                      >
                      <MenuItem value="">...</MenuItem>
                        {departments.map(dept =><MenuItem key={dept.id} value={dept.id}>{ dept.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                </Grid>
                  <Grid item xs={12} md={tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE ? 4 : 6}>
                      <FormControl fullWidth>
                        <InputLabel shrink>
                          <Translate contentKey="_global.form.selectOptions.taskSection.startWithProcessSelectLabel">Start With Process</Translate>
                        </InputLabel>
                        <Select
                          value={tASK_START_MODE}
                          onChange={handleChangeTASK_START_MODE}
                        >
                          <MenuItem value={TASK_START_MODE.AFTER_PREVIEW}>
                            <Translate contentKey="_global.form.selectOptions.taskSection.noStartWithProcessOpt">Démarre par le process</Translate>
                            </MenuItem>
                          <MenuItem value={TASK_START_MODE.WITH_PROCESS}>
                            <Translate contentKey="_global.form.selectOptions.taskSection.startWithProcessesOpt">Attendre la fin de la tâche précédente</Translate>
                          </MenuItem>
                          {(!tProcess || tProcess.modelId) && 
                          <MenuItem value={TASK_START_MODE.ON_FIXED_DATE}>
                            <Translate contentKey="_global.form.selectOptions.taskSection.withCustomDate">Sur une date bien définie</Translate>
                          </MenuItem>}
                        </Select>
                      </FormControl>
                  </Grid>
                  {(tASK_START_MODE === TASK_START_MODE.ON_FIXED_DATE && tProcess && tProcess.modelId )&&
                    <Grid item xs={12} md={4}>
                          <DateTimePicker
                              value={sheduledOn}
                              fullWidth
                              onChange={handleChangeSheduledOn}
                              variant="inline"
                              inputProps={{
                                className: `${ classes.field}`,
                              }}
                              InputProps={{
                                  value: sheduledOn ? `${translate("_calendar.day.short."+sheduledOn.getDay())} ${formateDate(sheduledOn, `DD/MM/YYYY ${translate("_global.label.to")} HH:mm`)}` : '',
                                  disableUnderline: true,
                              }}
                              placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.startAt")}`}
                          />
                    </Grid>}
                  <Grid item xs={12}>
                      <Typography variant="h5" align="center" color="primary"
                        style={{ marginTop:12, marginBottom:12, }}>
                        {translate('_global.form.selectOptions.taskSection.duration')}
                      </Typography>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <FormControl fullWidth>
                        <TextField type="number" name="nbMinuites"
                            value={entityState.nbMinuites}
                            label={translate('microgatewayApp.microprocessTask.nbMinuites')}
                            onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <FormControl fullWidth>
                        <TextField type="number" name="nbHours"
                            value={entityState.nbHours}
                            label={translate('microgatewayApp.microprocessTask.nbHours')}
                            onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <FormControl fullWidth>
                        <TextField type="number" name="nbDays"
                            value={entityState.nbDays}
                            label={translate('microgatewayApp.microprocessTask.nbDays')}
                            onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <TextField type="number" name="nbMonths"
                            value={entityState.nbMonths}
                            label={translate('microgatewayApp.microprocessTask.nbMonths')}
                            onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <TextField type="number" name="nbYears"
                            value={entityState.nbYears}
                            label={translate('microgatewayApp.microprocessTask.nbYears')}
                            onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                      <SaveButton
                        type="submit" disabled={entityState.name ? false : true}
                        style={{float: 'right', marginTop: 30}} />
                  </Grid>
                </Grid>
              </form>
              }
              {!tProcess && 
                  <Typography variant="body1">
                    <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
                  </Typography>}
            </>
          </MyCustomModal>
      </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  departments: storeState.department.entities,
});

const mapDispatchToProps = {
  getDepartments,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskUpdate);
