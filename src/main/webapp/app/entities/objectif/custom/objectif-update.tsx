import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getTypeObjectifs } from 'app/entities/type-objectif/type-objectif.reducer';
import { IFonction } from 'app/shared/model/fonction.model';
import { getEntities as getFonctions } from 'app/entities/fonction/fonction.reducer';
import { IDepartment } from 'app/shared/model/department.model';
import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { IEmployee } from 'app/shared/model/employee.model';
import { getEntities as getEmployees } from 'app/entities/employee/employee.reducer';
import { getEntity, updateEntity, createEntity, reset } from '../objectif.reducer';
import { IObjectif } from 'app/shared/model/objectif.model';
import { ObjectifCategorie } from 'app/shared/model/enumerations/objectif-categorie.model';
import { Button, Card, CardContent, CardHeader, Fab, FormControl, Grid, IconButton, InputAdornment, InputLabel, makeStyles, MenuItem, Modal, Select, TextField } from '@material-ui/core';
import { Close, Explore, Save } from '@material-ui/icons';
import { ObjectifTypeEvaluationUnity } from 'app/shared/model/enumerations/objectif-type-evaluation-unity.model';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ObjectifParentSelector from './objectif--parent-selector';
import { SaveButton } from 'app/shared/component/custom-button';

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
            width: '70%',
        },
        height: theme.spacing(70),
        marginTop: theme.spacing(5),
    },
    cardheader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
    },
    cardContent:{
        height: theme.spacing(60),
        borer: '1px solid red',
        overflow: 'auto',
    },
    btnSubmit:{
    }
}))

export interface IObjectifUpdateProps extends StateProps, DispatchProps {
    objectif: IObjectif,
    open: boolean,
    onSaved: Function,
    onClose: Function,
}

export const ObjectifUpdate = (props: IObjectifUpdateProps) => {

  const [objectif, setObjectif] = useState<IObjectif>(props.objectif);


  const [autoComplteIputValue, setAutoComplteInputValue] = useState('');

  const {typeObjectifs, fonctions, departments, employees, loading, updating } = props;

  const [openParentSelector, setOpenParentSelector] = useState(false);

  const classes = useStyles();

  const handleClose = () => {
      props.onClose();
  };

  const handleCloseParentSelector = (selected: IObjectif[]) =>{
      if(selected && selected.length > 0)
        setObjectif({...objectif, parent: selected[0]});
      else
        setObjectif({...objectif, parent:null});
      setOpenParentSelector(false);
  }

  useEffect(() => {
    props.getTypeObjectifs();
    props.getFonctions();
    props.getDepartments();
    props.getEmployees();
  }, []);

  useEffect(() =>{
    props.reset();
    setObjectif(props.objectif);
  }, [props.objectif])

  useEffect(() =>{
    if(objectif.categorie === ObjectifCategorie.COLLECTIVE && objectif.department)
        setAutoComplteInputValue(objectif.department.name)
    if(objectif.categorie === ObjectifCategorie.INDIVIDUAL && objectif.employee)
        setAutoComplteInputValue(objectif.employee.firstName + ' '+objectif.employee.lastName)
    if(objectif.categorie === ObjectifCategorie.FONCTIONAL && objectif.fonction)
        setAutoComplteInputValue(objectif.fonction.name);
  }, [objectif.categorie])

  useEffect(() => {
    if (props.updateSuccess) {
      props.onSaved(props.objectifEntity, props.objectif.id ? false : true);
    }
  }, [props.updateSuccess]);

  const isValid = () =>{
      if(objectif && objectif.name && objectif.categorie && objectif.delay){
        if(objectif.categorie === ObjectifCategorie.COLLECTIVE && objectif.department)
            return true;
        if(objectif.categorie === ObjectifCategorie.INDIVIDUAL && objectif.employee)
            return true;
        if(objectif.categorie === ObjectifCategorie.FONCTIONAL && objectif.fonction)
            return true;
      }
      return false;
  }

  const saveEntity = (event) => {
    event.preventDefault();

    if (isValid()) {
      if(!objectif.createdAt){
        setObjectif({...objectif, createdAt: new Date().toISOString()})
        objectif.createdAt = new Date().toISOString();
      }
      if(!objectif.ponderation){
          setObjectif({...objectif, ponderation: 1});
          objectif.ponderation = 1;
      }
      if(!objectif.averagePercentage){
          setObjectif({...objectif, averagePercentage: 100.0});
          objectif.averagePercentage = 100.0;
      }
      if (!objectif.id) {
        props.createEntity(objectif);
      } else {
        props.updateEntity(objectif);
      }
    }
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      if(name==="typeObjectif")
        setObjectif({...objectif, typeObjectif: typeObjectifs.find(to => to.id === value)});
      else if(name==="fonction")
        setObjectif({...objectif, fonction: fonctions.find(f => f.id.toString() === value)});
      else if(name==="department")
        setObjectif({...objectif, department: departments.find(d => d.id.toString() === value)});
      else if(name==="employee")
        setObjectif({...objectif, employee: employees.find(emp => emp.id.toString() === value)});
      else if(name === "delay")
        setObjectif({...objectif, delay: parseInt(value, 10)});
      else if(name === "ponderation")
        setObjectif({...objectif, ponderation: parseInt(value, 10)});
      else if(name === "averagePercentage")
        setObjectif({...objectif, averagePercentage: parseFloat(value)});
      else
        setObjectif({...objectif, [name]: value});   
  }
  

  return (
      <React.Fragment>
          <ObjectifParentSelector objectif={objectif} open={openParentSelector} multiple={false} onClose={handleCloseParentSelector} />
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
                    title={<Translate contentKey="microgatewayApp.objectif.home.createOrEditLabel">Create or edit a Objectif</Translate>}
                    avatar={
                        <Explore color="inherit" />
                    } 
                    action={
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                      </IconButton>
                  }
                  classes={{root: classes.cardheader}}
                  titleTypographyProps={{
                      variant: 'h4',
                  }}/>
                  <CardContent className={classes.cardContent}>
                      <form onSubmit={saveEntity}>
                        <Grid container spacing={2}>
                            {loading || updating && <Grid item xs={12} className="text-center text-info h5">loading....</Grid>}
                            <Grid item xs={12}>
                                <TextField required name="name" value={objectif.name} onChange={handleChange} fullWidth 
                                    label={<Translate contentKey="microgatewayApp.objectif.name">Name</Translate>}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel><Translate contentKey="microgatewayApp.typeObjectif.detail.title">Type</Translate></InputLabel>
                                    <Select name="typeObjectif" 
                                        value={objectif.typeObjectif ? objectif.typeObjectif.id : null}
                                        onChange={handleChange}>
                                        {typeObjectifs.filter(to => to.valid).map(to =><MenuItem key={to.id} value={to.id}>{to.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type="number" value={objectif.delay} name="delay" onChange={handleChange}
                                    label={<Translate contentKey="microgatewayApp.objectif.delay">Delay</Translate>}
                                    fullWidth
                                    InputProps={{
                                        inputProps: {min: 1, step: 1},
                                        endAdornment: <InputAdornment position="end">
                                            {objectif.typeObjectif &&objectif.typeObjectif.evalutationUnity !== ObjectifTypeEvaluationUnity.NOTHING
                                             ? objectif.typeObjectif.evalutationUnity :
                                              <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.MONTH">MONTH</Translate>}
                                        </InputAdornment>
                                    }}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type="number" value={objectif.averagePercentage ? objectif.averagePercentage : 100} name="averagePercentage" onChange={handleChange}
                                    label={<Translate contentKey="microgatewayApp.objectif.averagePercentage">averagePercentage</Translate>}
                                    fullWidth
                                    InputProps={{
                                        inputProps: {min: 1},
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}/>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel><Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate></InputLabel>
                                    <Select name="categorie" 
                                        value={objectif.categorie}
                                        onChange={handleChange}>
                                        <MenuItem value={ObjectifCategorie.FONCTIONAL}>
                                            <Translate contentKey="microgatewayApp.ObjectifCategorie.FONCTIONAL">FONCTIONAL</Translate>
                                        </MenuItem>
                                        <MenuItem value={ObjectifCategorie.COLLECTIVE}>
                                            <Translate contentKey="microgatewayApp.ObjectifCategorie.COLLECTIVE">Collective</Translate>
                                        </MenuItem>
                                        <MenuItem value={ObjectifCategorie.INDIVIDUAL}>
                                            <Translate contentKey="microgatewayApp.ObjectifCategorie.INDIVIDUAL">INDIVIDUAL</Translate>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid> */}
                            <Grid item xs={12}>
                                {!objectif.categorie || objectif.categorie === ObjectifCategorie.FONCTIONAL &&
                                    <FormControl fullWidth>
                                        <Autocomplete size="small"
                                            id="fonction-combo"
                                            inputValue ={autoComplteIputValue}
                                            options={[...fonctions]}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: '100%' }}
                                            onChange={(e, item: IFonction) =>{
                                                setObjectif({...objectif, fonction: item});
                                                setAutoComplteInputValue(item.name);
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                setAutoComplteInputValue(newInputValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label={`Choose ...`} variant="standard" />}
                                        />
                                    </FormControl>
                                }
                                {!objectif.categorie || objectif.categorie === ObjectifCategorie.COLLECTIVE &&
                                    <FormControl fullWidth>
                                    <Autocomplete size="small"
                                        inputValue ={autoComplteIputValue}
                                        options={[...departments]}
                                        getOptionLabel={(option) => option.name}
                                        style={{ width: '100%' }}
                                        onChange={(e, item: IDepartment) =>{
                                            setObjectif({...objectif, department: item});
                                            setAutoComplteInputValue(item.name);
                                        }}
                                        onInputChange={(event, newInputValue) => {
                                            setAutoComplteInputValue(newInputValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label={`Choose ...`} variant="standard" />}
                                    />
                                    </FormControl>
                                }
                                {!objectif.categorie || objectif.categorie === ObjectifCategorie.INDIVIDUAL &&
                                    <FormControl fullWidth>
                                        <Autocomplete size="small"
                                        inputValue ={autoComplteIputValue}
                                        options={[...employees]}
                                        getOptionLabel={(option) => option.firstName+ ' '+option.lastName}
                                        style={{ width: '100%' }}
                                        onChange={(e, item: IEmployee) =>{
                                            setObjectif({...objectif, employee: item});
                                            setAutoComplteInputValue(item.firstName + ' '+item.lastName);
                                        }}
                                        onInputChange={(event, newInputValue) => {
                                            setAutoComplteInputValue(newInputValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label={`${translate("_global.label.searchAndChooseEmp")}...`} variant="standard" />}
                                    />
                                    </FormControl>
                                }
                            </Grid>
                            <Grid item xs={objectif.parent ? 6 : 12}>
                                <TextField value={`${objectif.parent ? objectif.parent.name: ''}`} fullWidth
                                    label={<Translate contentKey="microgatewayApp.objectif.parent">Parent</Translate>}
                                    onClick={() => setOpenParentSelector(true)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type="number" fullWidth hidden={!objectif.parent}
                                    value={objectif.parent ? objectif.ponderation: 1} onChange={handleChange}
                                    label={<Translate contentKey="microgatewayApp.objectif.ponderation">ponderation</Translate>}
                                    InputProps={{
                                        inputProps: {min: 1, step: 1},
                                    }}/>
                            </Grid>
                            <Grid item xs={12} className="text-right" >
                                <SaveButton type="submit"
                                    className={classes.btnSubmit + ' text-capitalize'}
                                    disabled={!isValid()} />
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
  typeObjectifs: storeState.typeObjectif.entities,
  fonctions: storeState.fonction.entities,
  departments: storeState.department.entities,
  employees: storeState.employee.entities,
  objectifEntity: storeState.objectif.entity,
  loading: storeState.objectif.loading,
  updating: storeState.objectif.updating,
  updateSuccess: storeState.objectif.updateSuccess,
});

const mapDispatchToProps = {
  getTypeObjectifs,
  getFonctions,
  getDepartments,
  getEmployees,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ObjectifUpdate);