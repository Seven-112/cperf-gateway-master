import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Tooltip, Typography } from '@material-ui/core';
import { IProjectCategory } from 'app/shared/model/microproject/project-category.model';
import axios from "axios";
import { API_URIS, getUserExtraFullName } from 'app/shared/util/helpers';
import { Close, Edit, Send } from '@material-ui/icons';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import ProjectCategoryUpdate from '../../project-category/custom/project-category';
import { IProject } from 'app/shared/model/microproject/project.model';
import { ProjectPriority } from 'app/shared/model/enumerations/project-priority.model';
import UserExtraFinder2 from 'app/entities/user-extra/custom/user-extra-finder2';
import { IUserExtra } from 'app/shared/model/user-extra.model';
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
        width: '40%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
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
      borderRadius: '0 0 15px 15px',  
    },
}))


export interface IProjectUpdateProps extends StateProps{
  project: IProject,
  open?: boolean,
  onClose: Function,
  onSave?: Function
}

export const ProjectUpdate = (props: IProjectUpdateProps) => {
  const { open, account } = props;
  const [isNew, setIsNew] = useState(!props.project || !props.project.id);

  const [entityState, setEntityState] = useState<IProject>(props.project || {priorityLevel:ProjectPriority.LOW})
  const [labelError, setLabelError] = useState(false)
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [parent, setParent] = useState<IProject>(null);

  const [cats, setCats] = useState<IProjectCategory[]>([]);
  const [openNewCatEditor, setOpenNewCatEditor] = useState(false);
  const [openUserFinder, setOpenUserFinder] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);

  const classes = useStyles()

  const getParent = () =>{
      if(props.project && props.project.parentId){
        setLoading(true)
        axios.get<IProject>(`${API_URIS.projectApiUri}/${props.project.parentId}`)
            .then(res =>{
                if(res.data)
                    setParent(res.data)
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false);
            })
      }else{
          setParent(null)
      }
  }

  const getCategoies = () =>{
    axios.get<IProjectCategory[]>(`${API_URIS.projectCategoryApiUri}`)
        .then(res =>{
          if(res.data)
            setCats([...res.data])
          else
            setCats([]);
        }).catch(e => console.log(e));
  }

  const handleClose = () => props.onClose();

  useEffect(() => {
    getCategoies();
    setIsNew(!props.project || !props.project.id);
    setEntityState(props.project || {priorityLevel:ProjectPriority.LOW})
    getParent();
    setFormSubmitted(false);
    setSuccess(false);
    setShowMessage(false);
  }, [props.project]);

  const saveEntity = (event) => {
    event.preventDefault()
    setSuccess(false);
    setShowMessage(false)
    setFormSubmitted(false);
    if (!labelError) {
      setLoading(true);
      const entity: IProject = {
        ...entityState,
        editorId: account ? account.id : null,
        valid: isNew ? true : entityState.valid,
        priorityLevel: entityState.priorityLevel ? entityState.priorityLevel : ProjectPriority.VERYLOW,
        finishedAt: null,
        startAt: null,
        startCount: 0,
        previewFinishAt: null,
        previewStartAt: null,
        createdAt: isNew ? new Date().toISOString() : entityState.createdAt,
      };
      
      const request = isNew ? axios.post<IProject>(`${API_URIS.projectApiUri}`, cleanEntity(entity))
                              : axios.put<IProject>(`${API_URIS.projectApiUri}`, cleanEntity(entity));
      request.then(res =>{
        if(res.data){
          setSuccess(true);
          if(props.onSave)
            props.onSave(res.data, isNew);
        }
      }).catch(e => {
        console.log(e);
        setSuccess(false);
      }).finally(() =>{ 
        setLoading(false)
        setFormSubmitted(true);
        setShowMessage(true)
      })
    }
  };

  const handleChange = (e) =>{
    const name = e.target.name
    const value = e.target.value
    setEntityState({...entityState, [name]: value})
  }

  const handleBlurLabelField = () =>{
    if(!entityState.label || entityState.label.trim() === '')
      setLabelError(true)
  }

  const handleChangeCategory = (e) =>{
    const value = e.target.value;
    if(value || value === 0){
      if(value === 0 || value === "0")
        setOpenNewCatEditor(true);
      else
        setEntityState({...entityState, categoryId: value});
    }else{
      setEntityState({...entityState, categoryId: null});
    }
  }

  const onResponsableChange = (ue?: IUserExtra) =>{
     if(ue){
      setEntityState({...entityState,
         responsableId: ue.id, 
         responsableEmail: (ue.user && ue.user.email) ? ue.user.email : ue.employee ? ue.employee.email : null, 
         responsableName: getUserExtraFullName(ue),
        })
     }else{
       setEntityState({...entityState, responsableId: null, responsableEmail: null, responsableName: null})
     }
     setOpenUserFinder(false);
  }

  const handleSaveCategory = (saved?: IProjectCategory, isNewOp?:boolean) =>{
      if(saved){
         setEntityState({...entityState, categoryId: saved.id});
         if(isNewOp)
          setCats([saved, ...cats]);
        else
          setCats([...cats].map(c => c.id === saved.id ? saved : c));
        setOpenNewCatEditor(false);
      }
  }

  const responsable = entityState ? entityState.responsableName || entityState.responsableEmail || entityState.responsableId : '';

  return (
  <React.Fragment>
    <UserExtraFinder2 
      open={openUserFinder}
      unSelectableIds={[]}
      onSelectChange={onResponsableChange}
      onClose={() => setOpenUserFinder(false)}
     />
    <ProjectCategoryUpdate open={openNewCatEditor} category={{}}
      onSave={handleSaveCategory} onClose={() =>{setOpenNewCatEditor(false)}} />
    {entityState && <MyCustomRTEModal 
      content={entityState.description}
      open={openDesc}
      onClose={() => setOpenDesc(false)}
      onSave={(content) => {
        setEntityState({...entityState, description: content});
        setOpenDesc(false)
      }}
      label={translate('microgatewayApp.microprojectProject.description')}
    />}
    <Modal open={open} onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
      closeAfterTransition
      disableBackdropClick
      className={classes.modal}
    >
      <Card className={classes.card}>
          <CardHeader className={classes.cardheader}
          title={
              <Translate contentKey="microgatewayApp.microprojectProject.home.createOrEditLabel">Create or edit a Project</Translate>
          }
          titleTypographyProps={{
            variant: 'h4',
          }}
          action={
            <IconButton
                aria-label="forwared"
                color="inherit" 
                onClick={handleClose} edge='start'>
                  <Close />
            </IconButton>
          } 
          />
          <CardContent className={classes.cardcontent}>
            <form onSubmit={saveEntity}>
                <input type="hidden" name="id" defaultValue={entityState.id} />
                <Grid container spacing={3}>
                    {loading && <Grid item xs={12}>
                      <Box width={1} display="flex" justifyContent="center" justifyItems="center">
                          <CircularProgress color="primary" style={{ height:50, width:50}} />
                          <Typography color="primary" className="ml-3">Loading...</Typography>
                      </Box>
                    </Grid>}
                    {formSubmitted && <Grid item xs={12}>
                        <Collapse in={showMessage}>
                            <Alert severity={success? "success" : "error"} 
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                      setShowMessage(false);
                                    }}
                                  >
                                    <Close fontSize="inherit" />
                                  </IconButton>}
                              >
                                  {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                            </Alert>
                        </Collapse>
                    </Grid>}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={labelError}>
                        <TextField name="label" error={labelError}
                          value={entityState.label}
                          label={translate('microgatewayApp.microprojectProject.label') + ' *'}
                          onBlur={handleBlurLabelField}
                          onChange={handleChange}
                          onFocus={() =>setLabelError(false)}
                          InputLabelProps={{ shrink: true }}
                          />
                          {labelError && <FormHelperText>{translate('_global.form.helpersTexts.required')}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    {parent && 
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          value={parent.label}
                          label={translate('microgatewayApp.microprojectProject.parentId')}
                          InputLabelProps={{ shrink: true }}
                          />
                      </FormControl>
                    </Grid>
                    }
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Box width={1} display="flex" alignItems={"center"} flexWrap="wrap">
                          <Tooltip title={translate('entity.action.edit')}
                          onClick={() => setOpenDesc(true)}>
                            <Button 
                              variant='text' 
                              color="primary"
                              size='small'
                              endIcon={<Edit />}
                              className="text-capitalize p-0"
                              >
                                {translate('microgatewayApp.microprojectProject.description')}
                            </Button>
                          </Tooltip>
                        </Box>
                        {entityState.description &&
                          <MyCustomPureHtmlRender
                            body={entityState.description}
                            boxProps={{
                              width: 1,
                              maxHeight: 100,
                              overflow: 'auto',
                            }}
                          />
                         }
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField name="ponderation"
                          value={entityState.ponderation}
                          type="number"
                          label={translate('microgatewayApp.microprojectProject.ponderation')}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel shrink >{translate('microgatewayApp.microprojectProject.priorityLevel')}</InputLabel>
                        <Select
                          name="priorityLevel"
                          value={entityState.priorityLevel ? entityState.priorityLevel : ProjectPriority.VERYLOW}
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value={ProjectPriority.VERYHIGTH}>{translate('microgatewayApp.ProjectPriority.VERYHIGTH')}</MenuItem>
                        <MenuItem value={ProjectPriority.HIGHT}>{translate('microgatewayApp.ProjectPriority.HIGHT')}</MenuItem>
                        <MenuItem value={ProjectPriority.LOW}>{translate('microgatewayApp.ProjectPriority.LOW')}</MenuItem>
                        <MenuItem value={ProjectPriority.VERYLOW}>{translate('microgatewayApp.ProjectPriority.VERYLOW')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          value={responsable}
                          label={translate('microgatewayApp.microprojectProject.responsableName')}
                          onClick={() => setOpenUserFinder(true)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                          <InputLabel shrink >{translate('microgatewayApp.microprojectProjectCategory.detail.title')}</InputLabel>
                          <Select
                          value={entityState.categoryId}
                          onChange={handleChangeCategory}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          >
                          <MenuItem>....</MenuItem>
                          {[...cats].map((c, index) =>(
                          <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                          ))}
                          <MenuItem value={0}>{translate('_global.label.newCategory')}</MenuItem>
                          </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <SaveButton 
                          disabled={entityState.label ? false : true}
                          type="submit"
                          style={{ float: 'right'}}
                      />
                    </Grid>
                  </Grid>
              </form>
            </CardContent>
        </Card>
    </Modal>
  </React.Fragment>
  );
};

const mapStateToProps = ({authentication}: IRootState) => ({
  account: authentication.account,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(ProjectUpdate);
