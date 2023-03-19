import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getTypeindicators } from 'app/entities/typeindicator/typeindicator.reducer';
import { getEntities as getObjectifs } from 'app/entities/objectif/objectif.reducer';
import { getEntities as getIndicators } from 'app/entities/indicator/indicator.reducer';
import { getEntity, updateEntity, createEntity, reset } from '../indicator.reducer';
import { IIndicator } from 'app/shared/model/indicator.model';
import { Helmet } from 'react-helmet';
import { Avatar, Card, CardContent, CardHeader, Fab, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Radio, RadioGroup, Select, TextField } from '@material-ui/core';
import { Translate } from 'react-jhipster';
import { Close, Save, SettingsInputAntenna } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        width: '40%',
        [theme.breakpoints.down('md')]:{
            width: '75%',
        },
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
        height: theme.spacing(63),
        marginTop: theme.spacing(5),
        overflow: 'auto',
    },
    cardheader:{
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
    },
    cardContent:{
    },
    btnSubmit:{
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
        '&:hover':{
            backgroundColor: theme.palette.secondary.main,
        }
    }
}))

export interface IIndicatorUpdateProps extends StateProps, DispatchProps {
    indicator: IIndicator,
    open: boolean,
    onSaved: Function,
    onClose: Function,
}

export const IndicatorUpdateModal = (props: IIndicatorUpdateProps) => {

  const [indicator, setIndicator] = useState<IIndicator>(props.indicator);

  const { typeindicators, objectifs, loading, updating } = props;

  const [parents, setParents] = useState<IIndicator[]>([]);

  const [formIsValid, setFormIsValid] = useState(false);

  const classes = useStyles();

  const filterParents = (indicators: IIndicator[]): IIndicator[] =>{
        if(indicator && indicators && indicators.length >0)
            return indicators.filter(i => i.id !== indicator.id && (!i.parent || (i.parent && i.parent.id !== indicator.id)));
        return [];
  }
  
  const getParents = () =>{
      if(indicator && indicator.objectif){
            axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?objectifId.equals=${indicator.objectif.id}`)
                .then(res =>{
                    if(res.data){
                        setParents([...filterParents(res.data)]);
                    }
                }).catch(() =>{})
      }
  }

  const validateForm = () =>{
      if(indicator && indicator.label && indicator.typeindicator && indicator.objectif){
        if(indicator.typeindicator.measurable && (!indicator.expectedResultNumber || !indicator.resultUnity)){
            setFormIsValid(false);
        }else{
            setFormIsValid(true);
        }
      }else{
        setFormIsValid(false);
      }
  }

  useEffect(() => {
    props.reset();
    props.getTypeindicators();
    props.getObjectifs();
    setIndicator(props.indicator);
    getParents();
  }, [props.indicator]);

  useEffect(() =>{
    validateForm();
  }, [indicator])

  useEffect(() => {
    if (props.updateSuccess) {
      props.onSaved(props.indicatorEntity, props.indicator.id ? false : true)
    }
    getParents();
  }, [props.updateSuccess]);

  const handleClose = () => props.onClose();

  const saveEntity = (e) =>{
      e.preventDefault();
      if(formIsValid){
          if(!indicator.ponderation){
              setIndicator({...indicator, ponderation: 1})
              indicator.ponderation = 1;
          }
          if(indicator.id)
            props.updateEntity(indicator);
          else
            props.createEntity(indicator);
      }
  }

  const handleChange = (e) =>{
      const {name, value} = e.target;
      if(name === "expectedResultNumber")
        setIndicator({...indicator, expectedResultNumber: value ? parseFloat(value): 0})
      if(name === "ponderation")
        setIndicator({...indicator, ponderation: value ? parseFloat(value): 1})
      else if(name === "numberResult")
        setIndicator({...indicator, numberResult: value ? parseFloat(value): 0})
      else if(name === "percentResult")
        setIndicator({...indicator, percentResult: value ? parseFloat(value): 0})
      else if(name === "typeindicator")
        setIndicator({...indicator, typeindicator: typeindicators.find(ti => ti.id === value)});
      else if(name === "objectif")
        setIndicator({...indicator, objectif: objectifs.find(o => o.id === value)})
      else if(name === "parent")
        setIndicator({...indicator, parent: parents.find(i => i.id === value && i.id !== indicator.id)})
      else
        setIndicator({...indicator, [name]: value});
  }

  return (
      <React.Fragment>
          <title>Cperf | Indicators</title>
        <Modal
            aria-labelledby="edit-fonction-modal-title"
            aria-describedby="edit-fonction-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}>
            <Card className={classes.card}>
                <CardHeader
                  title={<Translate contentKey="microgatewayApp.indicator.home.createOrEditLabel">Create or edit a Indicator</Translate>}
                  avatar={
                      <Avatar><SettingsInputAntenna color="secondary" /></Avatar>
                  } 
                  action={
                      <IconButton color="inherit" onClick={handleClose}>
                          <Close />
                    </IconButton>
                }
                classes={{root: classes.cardheader}}
                titleTypographyProps={{
                    variant: 'h5',
                }}/>
                <CardContent className={classes.cardContent}>
                    <form onSubmit={saveEntity}>
                      <Grid container spacing={0}>
                          {loading || updating && <Grid item xs={12} className="text-center text-info h5">loading....</Grid>}
                          <Grid item xs={12}>
                              <TextField required name="label" value={indicator.label} onChange={handleChange} fullWidth 
                                  label={<Translate contentKey="microgatewayApp.indicator.label">Label</Translate>}/>
                          </Grid>
                          <Grid item xs={12}>
                              <FormControl fullWidth>
                                  <InputLabel><Translate contentKey="microgatewayApp.typeindicator.detail.title">Type</Translate></InputLabel>
                                  <Select name="typeindicator" 
                                      value={indicator.typeindicator ? indicator.typeindicator.id : null}
                                      onChange={handleChange}>
                                      {typeindicators.filter(ti=> ti.valid).map(ti =><MenuItem key={ti.id} value={ti.id}>{ti.name}</MenuItem>)}
                                  </Select>
                              </FormControl>
                          </Grid>
                          <Grid item xs={12} md={indicator.parent ? 6 : 12}>
                              <FormControl fullWidth>
                                  <InputLabel><Translate contentKey="microgatewayApp.indicator.parent">Parent</Translate></InputLabel>
                                  <Select name="parent" 
                                      value={indicator.parent ? indicator.parent.id : null}
                                      onChange={handleChange}>
                                      <MenuItem>....</MenuItem>
                                      {filterParents(parents).map(i =><MenuItem key={i.id} value={i.id}>{i.label}</MenuItem>)}
                                  </Select>
                              </FormControl>
                          </Grid>
                          {indicator.parent &&
                          <Grid item xs={12} md={6}>
                            <TextField required type="number" name="ponderation" InputProps={{ inputProps: {min:1, step:1} }}
                                 value={indicator.ponderation ? indicator.ponderation : 1} onChange={handleChange} fullWidth 
                                label={<Translate contentKey="microgatewayApp.indicator.ponderation">ponderation</Translate>}/>
                          </Grid>}
                          {indicator.typeindicator && indicator.typeindicator.measurable && 
                            <React.Fragment>
                                <Grid item xs={6} sm={6} md={8}>
                                    <TextField required type="number" name="expectedResultNumber" value={indicator.expectedResultNumber} onChange={handleChange} fullWidth 
                                        label={<Translate contentKey="microgatewayApp.indicator.expectedResultNumber">expectedResultNumber</Translate>}/>
                                </Grid>
                                <Grid item xs={6} sm={6} md={4}>
                                    <TextField required name="resultUnity" value={indicator.resultUnity} onChange={handleChange} fullWidth 
                                        label={<Translate contentKey="microgatewayApp.indicator.resultUnity">resultUnity</Translate>}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl component="fieldset" fullWidth className="mt-3">
                                        <FormLabel component="h6">
                                            <Translate contentKey="microgatewayApp.indicator.resultEditableByActor">resultEditableByActor</Translate>
                                        </FormLabel>
                                        <RadioGroup row aria-label="result editable by actor"
                                            onChange={(e) => setIndicator({...indicator, resultEditableByActor: e.target.value === "true" ? true: false})}
                                            name="resultEditableByActor" value={indicator.resultEditableByActor ? "true" : "false"}>
                                                <FormControlLabel
                                                    value="true"
                                                    control={<Radio />}
                                                    label={<Translate contentKey="_global.label.yes">Yes</Translate>}
                                                    labelPlacement="end"
                                                    />
                                                <FormControlLabel
                                                value="false"
                                                control={<Radio />}
                                                label={<Translate contentKey="_global.label.no">No</Translate>}
                                                labelPlacement="end"
                                                />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </React.Fragment>
                          }
                         {/*  <Grid item xs={12}>
                              <TextField required name="question" value={indicator.question} onChange={handleChange} fullWidth 
                                  label={<Translate contentKey="microgatewayApp.indicator.question">question</Translate>}/>
                          </Grid> */}
                          <Grid item xs={12} className="text-right">
                              <Fab type="submit" variant="extended" className={classes.btnSubmit} size="medium" disabled={!formIsValid}>
                                  <Translate contentKey="entity.action.save">Save</Translate>&nbsp;&nbsp;
                                  <Save />
                              </Fab>
                          </Grid>
                      </Grid>
                    </form>
                </CardContent>
            </Card>
            </Modal>
      </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  typeindicators: storeState.typeindicator.entities,
  objectifs: storeState.objectif.entities,
  indicatorEntity: storeState.indicator.entity,
  loading: storeState.indicator.loading,
  updating: storeState.indicator.updating,
  updateSuccess: storeState.indicator.updateSuccess,
});

const mapDispatchToProps = {
  getTypeindicators,
  getObjectifs,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorUpdateModal);
