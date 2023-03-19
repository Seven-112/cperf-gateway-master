import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Backdrop, Badge, Box, Button, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Slide, TextField, Tooltip, Typography } from '@material-ui/core';
import { Card } from '@material-ui/core';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import { API_URIS } from 'app/shared/util/helpers';
import { Description, Edit, OpenWith } from '@material-ui/icons';
import StartupTasksModal from './project-startup-tasks-modal';
import Close from '@material-ui/icons/Close';
import { DateTimePicker } from '@material-ui/pickers';
import { convertDateFromServer, formateDate } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faUsers } from '@fortawesome/free-solid-svg-icons';
import { ProjectTaskStatus } from 'app/shared/model/enumerations/project-task-status.model';
import { ProjectTaskType } from 'app/shared/model/enumerations/project-task-type.model';
import ProjectTaskItem from '../../project-task-item/custom/project-task-item';
import ProjectTaskFileModal from '../../project-task-file/custom/project-task-file-modal';
import ProjectTaskUserModal from '../../project-task-user/custom/project-task-user-modal';
import { ProjectTaskFileType } from 'app/shared/model/enumerations/project-task-file-type.model';
import { IProject } from 'app/shared/model/microproject/project.model';
import MyCustomRTEModal from 'app/shared/component/my-custom-rte-modal';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import { SaveButton } from 'app/shared/component/custom-button';

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
      marginTop:19,
      /* '&:hover':{
          background: theme.palette.grey[300],
      },
      '&:focus':{
          background: theme.palette.grey[300],
      } */
  },
}))

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

const enum STARTMODE{
  WITH_PROCESS = 'with_process',
  AFTER_PREVIEW = 'after_preview',
  ON_FIXED_DATE = 'on_fixed_date',
}

export interface IProjectTaskUpdateProps extends StateProps, DispatchProps{
   task?:IProjectTask,
   project: IProject,
   open?:boolean,
   onClose: Function,
   onSave?: Function,
 }

export const ProjectTaskUpdate = (props: IProjectTaskUpdateProps) => {
  const { departments, project, open } = props;
  const [isNew, setIsNew] = useState(!props.task || !props.task.id);
  const [entityState, setEntityState] = useState<IProjectTask>(props.task || {valid: false,startWithProcess: false,manualMode: false});
  
  const classes = useStyles()

  const [formError, setFormError] =  useState<object>({})

  const [updating, setUpdating] = useState(false)
  const [updated, setUpdated] = useState(false)

  const [updateSuccess, setUpdateSuccess] = useState(false)

  // presaved tasks total count
  const [totalItems, setTotalItems] = useState(0);

  const [openFileModal, setOpenFileModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openStartupTasksModal, setOpenStartupTasksModal] = useState(false);

  const [filesSize, setFilesSize] = useState(0);
  const [startupTasksSize, setStartupTasksSize] = useState(0);
  const [startMode, setStartMode] = useState(STARTMODE.WITH_PROCESS);
  const [openCheckList, setOpenCheckList] = useState(false);
  const [openDescEditor, setOpenDescEditor] = useState(false);


  const [sheduledOn, setSheduledOn] = useState(new Date());

  const initTializeSheduledOn = () =>{
    if(entityState && entityState.sheduledStartAt){
      const date = new Date(entityState.sheduledStartAt);
        date.setHours(entityState.sheduledStartHour || 0);
        date.setMinutes(entityState.sheduledStartMinute || 0);
        setSheduledOn(date);
    }
  }

  const getTotalItems = () =>{
    if(project){
      axios.get<IProjectTask>(`${API_URIS.projectTaskApiUri}/?page=${0}&size=${1}&processId.equals=${project.id}`)
          .then(res =>{
            /* eslint-disable no-console */
            console.log(res.headers['x-total-count']);
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
          }).catch(() =>{});
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
    if(props.open){
      setUpdated(false)
      setIsNew(!props.task || !props.task.id);
      setEntityState(props.task || {valid: false,startWithProcess: false,manualMode: false});
      initTializeSheduledOn();
      getTotalItems();
      if(props.task){
        if(props.task.sheduledStartAt && (props.task.sheduledStartHour || props.task.sheduledStartHour === 0)){
          setStartMode(STARTMODE.ON_FIXED_DATE)
        }else{
          if(props.task.startWithProcess)
            setStartMode(STARTMODE.WITH_PROCESS)
          else
            setStartMode(STARTMODE.AFTER_PREVIEW)
        }
      }
    }
  }, [props.task, props.project, props.open])

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

  const handleChangeStartMode = (e) =>{
     setStartMode(e.target.value);
  }

  const initForm = () =>{
    setEntityState({valid: false,startWithProcess: false,manualMode: false})
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
      if(!hasError('name') && project){
         const entity: IProjectTask = {
           ...entityState,
           valid: isNew ? true : entityState.valid,
           status: isNew ? ProjectTaskStatus.VALID : entityState.status,
           processId:  isNew ? project.id : entityState.processId,
           type: ProjectTaskType.ACTIVITY,
           startWithProcess: startMode === STARTMODE.WITH_PROCESS ? true : false,
           sheduledStartAt: startMode === STARTMODE.ON_FIXED_DATE ? convertDateFromServer(sheduledOn) : null,
           sheduledStartHour: startMode === STARTMODE.ON_FIXED_DATE ? sheduledOn.getHours() : null,
           sheduledStartMinute: startMode === STARTMODE.ON_FIXED_DATE ? sheduledOn.getMinutes() : null,
         }
         const req = isNew ? axios.post<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
                           : axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity));
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

  return (
      <React.Fragment>
        {/* modal cheick list */}
        {entityState && entityState.id && <ProjectTaskItem open={openCheckList} task={entityState} onClose={() => setOpenCheckList(false)}/>}
        {entityState && entityState.id && <ProjectTaskFileModal task={entityState} 
          open={openFileModal}  type={ProjectTaskFileType.DESCRIPTION} canAdd
          canDelete onClose={handleCloseFileModal}/>}
        {entityState && entityState.id && <ProjectTaskUserModal
           task={entityState} open={openUserModal} 
           canAdd canDelete onClose={handleCloseUserModal} />}
        {entityState && openStartupTasksModal && <StartupTasksModal 
          task={entityState} open={openStartupTasksModal} canEdit onClose={handleCloseStartupTasksModal} />}
        {entityState && <MyCustomRTEModal 
            open={openDescEditor}
            content={entityState.description}
            title={translate('microgatewayApp.microprocessTask.description')}
            onClose={() => setOpenDescEditor(false)}
            onSave={content => {
              setEntityState({...entityState, description: content});
              setOpenDescEditor(false)
            }}
        />}
          <Modal open={open} onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 300,
            }}
            closeAfterTransition
            className={classes.modal}
          >
          <Slide in={open} unmountOnExit>
            <Card className={classes.card}>
                <CardHeader classes={{ root: classes.cardheader}}
                  title={translate('microgatewayApp.microprocessTask.home.createOrEditLabel')}
                  titleTypographyProps={{
                      variant: 'h4',
                  }}
                  action={
                    <IconButton color="inherit" 
                      aria-label="back" title="back" onClick={handleClose}>
                        <Close />
                    </IconButton>
                  }
                />
                <CardContent className={classes.cardcontent}>
                {project && 
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
                        <FormControl fullWidth>
                          <Box width={1}>
                             <Tooltip title={translate("entity.action.edit")}
                              onClick={() => setOpenDescEditor(true)}>
                                <Button size='small' endIcon={<Edit />} className="text-capitalize p-0 mb-2">
                                  {translate('microgatewayApp.microprocessTask.description')}
                                </Button>
                             </Tooltip>
                          </Box>
                          <MyCustomPureHtmlRender
                            body={entityState.description}
                            boxProps={{ 
                              overflow: 'auto',
                              maxHeight: 100,
                            }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField name="ponderation"
                          value={entityState.ponderation}
                          type="number"
                          inputProps={{
                            min:1,
                            step:1,
                          }}
                          label={translate('microgatewayApp.microprojectProjectTask.ponderation')}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                      <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel shrink>
                              <Translate contentKey="_global.form.selectOptions.taskSection.startWithProcessSelectLabel">Start With Process</Translate>
                            </InputLabel>
                            <Select
                              value={startMode}
                              onChange={handleChangeStartMode}
                            >
                              <MenuItem value={STARTMODE.AFTER_PREVIEW}>
                                <Translate contentKey="_global.form.selectOptions.taskSection.noStartWithProcessOpt">Attendre la fin de la tâche précédente</Translate>
                                </MenuItem>
                              <MenuItem value={STARTMODE.WITH_PROCESS}>
                                <Translate contentKey="_global.label.startNow">Démarre toute de suite</Translate>
                              </MenuItem>
                              {entityState && (!entityState.status || entityState.status === ProjectTaskStatus.VALID) && 
                              <MenuItem value={STARTMODE.ON_FIXED_DATE}>
                                <Translate contentKey="_global.form.selectOptions.taskSection.withCustomDate">Sur une date bien définie</Translate>
                              </MenuItem>}
                            </Select>
                          </FormControl>
                      </Grid>
                      {(startMode === STARTMODE.ON_FIXED_DATE && project)&&
                        <Grid item xs={12} md={6}>
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
                                      disableUnderline: false,
                                  }}
                                  placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.startAt")}`}
                              />
                      </Grid>}
                      <Grid item xs={12} md={startMode === STARTMODE.ON_FIXED_DATE ? 6 : 12}>
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
                            type="submit"
                            disabled={entityState.name ? false : true}
                            style={{float: 'right', marginTop: 30}} />
                      </Grid>
                    </Grid>
                  </form>
                  }
                  {!project && 
                      <Typography variant="body1">
                        <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
                      </Typography>}
                </CardContent>
              {entityState && entityState.id && project &&
                <CardActions className={classes.cardActions}>
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
                  <IconButton title={translate(`microgatewayApp.ProjectTaskUserRole.${ProjectTaskUserRole.SUBMITOR.toString()}`) + 'S'}
                    onClick={() =>handleOpenUserModal(ProjectTaskUserRole.SUBMITOR)}>
                    <Badge badgeContent={submitorsSize} color="secondary"
                      anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom',
                      }}>
                      <TouchApp />
                    </Badge>
                  </IconButton>
                  <IconButton title={translate(`microgatewayApp.ProjectTaskUserRole.${ProjectTaskUserRole.VALIDATOR.toString()}`) + 'S'}
                    onClick={() =>handleOpenUserModal(ProjectTaskUserRole.VALIDATOR)}>
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
                </CardActions>}
            </Card>
          </Slide>
          </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskUpdate);
