import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { IProcess } from 'app/shared/model/microprocess/process.model';
import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography } from '@material-ui/core';
import { ProcessPriority } from 'app/shared/model/enumerations/process-priority.model';
import { IProcessCategory } from 'app/shared/model/microprocess/process-category.model';
import axios from "axios";
import { API_URIS } from 'app/shared/util/helpers';
import ProcessCategoryUpdate from '../../process-category/custom/process-category-update';
import { Close, Edit, Send } from '@material-ui/icons';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import MyCustomRTEModal from 'app/shared/component/my-custom-rte-modal';
import { SaveButton } from 'app/shared/component/custom-button';
import MyCustomRTE from 'app/shared/component/my-custom-rte';

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
    descCard:{
      width: '43%',
      [theme.breakpoints.down("sm")]:{
          width: '85%',
      },
    },
}))

export interface IProcessUpdateProps extends StateProps{
  entity: IProcess,
  open?: boolean,
  onClose: Function,
  onSave?: Function
}

export const ProcessUpdate = (props: IProcessUpdateProps) => {
  const { open, account } = props;
  const [isNew, setIsNew] = useState(!props.entity || !props.entity.id);
  const [openDescEditor, setOpenDescEditor] = useState(false);

  const [entityState, setEntityState] = useState<IProcess>(props.entity || {priorityLevel:ProcessPriority.LOW})
  const [labelError, setLabelError] = useState(false)
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [labelText, setLabelText] = useState(null);

  const [cats, setCats] = useState<IProcessCategory[]>([]);
  const [openNewCatEditor, setOpenNewCatEditor] = useState(false);

  const classes = useStyles()

  const getCategoies = () =>{
    axios.get<IProcessCategory[]>(`${API_URIS.processCategoryApiUri}`)
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
    setIsNew(!props.entity || !props.entity.id);
    setEntityState(props.entity || {priorityLevel:ProcessPriority.LOW})
    setFormSubmitted(false);
    setSuccess(false);
    setShowMessage(false);
  }, [props.entity]);

  const saveEntity = (event) => {
    event.preventDefault()
    setSuccess(false);
    setShowMessage(false)
    setFormSubmitted(false);
    if (!labelError) {
      setLoading(true);
      const entity: IProcess = {
        ...entityState,
        label: labelText || entityState.label,
        editorId: account ? account.id : null,
        valid: isNew ? true : entityState.valid,
        priorityLevel: entityState.priorityLevel ? entityState.priorityLevel : ProcessPriority.VERYLOW,
        finishedAt: null,
        startAt: null,
        startCount: 0,
        previewFinishAt: null,
        previewStartAt: null,
        createdAt: isNew ? new Date().toISOString() : entityState.createdAt,
      };
      
      const request = isNew ? axios.post<IProcess>(`${API_URIS.processApiUri}`, cleanEntity(entity))
                              : axios.put<IProcess>(`${API_URIS.processApiUri}`, cleanEntity(entity));
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
        setEntityState({...entityState, category: [...cats].find(c => c.id.toString() === value.toString())});
    }else{
      setEntityState({...entityState, category: null});
    }
  }

  const handleSaveCategory = (saved?: IProcessCategory, isNewOp?:boolean) =>{
      if(saved){
         setEntityState({...entityState, category: saved});
         if(isNewOp)
          setCats([saved, ...cats]);
        else
          setCats([...cats].map(c => c.id === saved.id ? saved : c));
        setOpenNewCatEditor(false);
      }
  }

  return (
  <React.Fragment>
    <ProcessCategoryUpdate open={openNewCatEditor} category={{}}
      onSave={handleSaveCategory} onClose={() =>{setOpenNewCatEditor(false)}} />
    <MyCustomRTEModal 
      open={openDescEditor}
      content={entityState.description}
      title={translate('microgatewayApp.microprocessProcess.description')}
      onClose={() => setOpenDescEditor(false)}
      onSave={value => {
        setEntityState({...entityState, description: value});
        setOpenDescEditor(false)
      }}
      cardClassName={classes.descCard}
      editorMinHeight={300}
    />
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
              <Translate contentKey="microgatewayApp.microprocessProcess.home.createOrEditLabel">Create or edit a Process</Translate>
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
                        <MyCustomRTE 
                          label={translate('microgatewayApp.microprocessProcess.label') + ' *'}
                          content={labelText || entityState.label}
                          onSave={(value) => setLabelText(value)}
                          editorMinHeight={100}
                          editorMaxHeight={200}
                        />
                        {/* <TextField name="label" error={labelError}
                          value={entityState.label}
                          label={translate('microgatewayApp.microprocessProcess.label') + ' *'}
                          onBlur={handleBlurLabelField}
                          onChange={handleChange}
                          onFocus={() =>setLabelError(false)}
                          InputLabelProps={{ shrink: true }}
                          /> */}
                          {labelError && <FormHelperText>{translate('_global.form.helpersTexts.required')}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel shrink >{translate('microgatewayApp.microprocessProcess.priorityLevel')}</InputLabel>
                        <Select
                          name="priorityLevel"
                          value={entityState.priorityLevel ? entityState.priorityLevel : ProcessPriority.VERYLOW}
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value={ProcessPriority.VERYHIGTH}>{translate('microgatewayApp.ProcessPriority.VERYHIGTH')}</MenuItem>
                        <MenuItem value={ProcessPriority.HIGHT}>{translate('microgatewayApp.ProcessPriority.HIGHT')}</MenuItem>
                        <MenuItem value={ProcessPriority.LOW}>{translate('microgatewayApp.ProcessPriority.LOW')}</MenuItem>
                        <MenuItem value={ProcessPriority.VERYLOW}>{translate('microgatewayApp.ProcessPriority.VERYLOW')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid> */}
                    {!entityState.modelId && 
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel shrink >{translate('microgatewayApp.microprocessProcessCategory.detail.title')}</InputLabel>
                          <Select
                            value={entityState.category ? entityState.category.id : null}
                            onChange={handleChangeCategory}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                          <MenuItem>....</MenuItem>
                          {[...cats].map((c, index) =>(
                            <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                          ))}
                          {/* <MenuItem value={0}>{translate('_global.label.newCategory')}</MenuItem> */}
                          </Select>
                        </FormControl>
                      </Grid>
                    }
                    <Grid item xs={12}>
                      <Box width={1} textAlign={"center"}>
                        <Button endIcon={<Edit />} 
                          color="primary"
                          className="text-capitalize"
                          onClick={() => setOpenDescEditor(true)}>
                          {translate('microgatewayApp.microprocessProcess.description')}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <SaveButton
                         disabled={(entityState.label || labelText) ? false : true}
                          type="submit" />
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

export default connect(mapStateToProps, null)(ProcessUpdate);
