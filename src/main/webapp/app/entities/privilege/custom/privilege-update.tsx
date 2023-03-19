import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from '../privilege.reducer';
import { getEntities as getModelEntities } from 'app/entities/model-entity/model-entity.reducer';
import { getRoles } from 'app/modules/administration/user-management/user-management.reducer'
import { IPrivilege } from 'app/shared/model/privilege.model';
import { Avatar, Button, Card, CardContent, CardHeader, Checkbox, Fab, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select } from '@material-ui/core';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Close, Save } from '@material-ui/icons';
import { ALL_PRIVILIGES_ENTITY, PRIVILEGE_ACTIONS_SEPARATOR } from 'app/shared/util/constantes';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
  modal:{
      display: 'flex',
      justifyItems: 'center',
      justifyContent: 'center',
  },
  card:{
      marginTop: theme.spacing(7),
      background: 'transparent',
      boxShadow: 'none',
      width: theme.spacing(70),
      [theme.breakpoints.down('sm')]:{
        width: theme.spacing(100),
      }
  },
  cardHeader:{
      background: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      borderRadius: '7px 7px 0 0',
  },
  cardContent:{
      backgroundColor: theme.palette.background.paper,
  },
  formGroupRow:{
    border: '1px solid',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
}))

export interface IPrivilegeUpdateProps extends StateProps, DispatchProps{
  privilege: IPrivilege,
  open: boolean,
  onSave: Function,
  onClose: Function,
}

export const PrivilegeUpdate = (props: IPrivilegeUpdateProps) => {

  const [entityState, setEntityState] = useState(props.privilege);

  const handleClose = () => {
    props.onClose();
  };

  useEffect(() => {
    props.reset();
    props.getModelEntities();
    props.getRoles();
  }, []);

  useEffect(() =>{
    setEntityState(props.privilege);
  },[props.privilege])

  useEffect(() => {
    if (props.updateSuccess) {
       props.onSave(props.privilegeEntity, props.privilege.id ? false : true);
    }
  }, [props.updateSuccess]);

  const isFormValid = () =>{
     return (entityState.action && entityState.authority && entityState.entity) || 
            (entityState.authority && entityState.entity && entityState.entity.includes(ALL_PRIVILIGES_ENTITY));
  }

  const saveEntity = (event) => {
      event.preventDefault();
    if (isFormValid()) {
      const entity: IPrivilege = { ...entityState, 
        action: entityState.entity.toLowerCase()
                .includes(ALL_PRIVILIGES_ENTITY.toLowerCase()) 
              ? PrivilegeAction.ALL : entityState.action
          };
      if (!entity.id) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      setEntityState({...entityState, [name]: value});
  }

  const handleCheck = (e) =>{
    const {name} = e.target;
    if(name === PrivilegeAction.ALL.toString()){
        setEntityState({...entityState, action: entityState.action ? null : PrivilegeAction.ALL.toString()});
    }else{
      if(!entityState.action || !entityState.action.toLocaleLowerCase().includes(name.toLocaleLowerCase())){
        if(entityState.action)
          setEntityState({...entityState, action: entityState.action + PRIVILEGE_ACTIONS_SEPARATOR + name});
        else
          setEntityState({...entityState, action: name});
      }else{
        const split = entityState.action.split(PRIVILEGE_ACTIONS_SEPARATOR);
        if(split && split.length > 0){
          const filtered = split.filter(action => !action.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
          setEntityState({...entityState, action: filtered.join(PRIVILEGE_ACTIONS_SEPARATOR)});
        }
      }
    }
  }

  const check = (name: string) =>{
     return (entityState &&  entityState.action && entityState.action.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
  }

  const renderOthersActions = (!entityState || !entityState.action || !entityState.action.toUpperCase().includes("ALL")) ? true : false;

  const classes = useStyles();
  return (
      <React.Fragment>
        <Modal
            aria-labelledby="edit-privilege-modal-title"
            aria-describedby="edit-privilege-modal-description"
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
                    title={
                        <Translate contentKey="microgatewayApp.privilege.home.createOrEditLabel">Create or edit a Privilege</Translate>
                    }
                    avatar={<FontAwesomeIcon icon={faUserShield} color="inherit" />}
                    action={
                      <IconButton onClick={handleClose} color="inherit">
                          <Close />
                      </IconButton>
                    }
                    titleTypographyProps={{ variant: 'h4' }}
                    classes={{ root: classes.cardHeader}}
                  />
                  <CardContent className={classes.cardContent}>
                      <form onSubmit={saveEntity}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>
                                        <Translate contentKey="microgatewayApp.privilege.authority">Authority</Translate>
                                    </InputLabel>
                                    <Select name="authority" required 
                                        value={entityState.authority} onChange={handleChange}>
                                        <MenuItem></MenuItem>
                                        {props.roles.map((role, index) =>(
                                            <MenuItem key={index} value={role}>{role}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>
                                        <Translate contentKey="microgatewayApp.privilege.entity">entity</Translate>
                                    </InputLabel>
                                    <Select name="entity" required
                                        value={entityState.entity} onChange={handleChange}>
                                        <MenuItem></MenuItem>
                                        {props.modelEntities.map((entity, index) =>(
                                            <MenuItem key={index} value={entity.entity}>
                                              {entity.entity}{entity.name ? " ( "+entity.name+" )": ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {!entityState.entity || !entityState.entity.includes(ALL_PRIVILIGES_ENTITY) &&
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel>
                                        <Translate contentKey="microgatewayApp.privilege.home.title">Privileges</Translate>
                                    </FormLabel>
                                    <FormGroup row classes={{ row: classes.formGroupRow }}>
                                        <FormControlLabel 
                                          control={<Checkbox name="ALL" checked={check("ALL")} onChange={handleCheck} color="primary"/>}
                                          label={translate('microgatewayApp.PrivilegeAction.ALL')}
                                          />
                                        {renderOthersActions && <React.Fragment>
                                          <FormControlLabel 
                                            control={<Checkbox name="CREATE" checked={check("CREATE")} onChange={handleCheck} color="primary"/>}
                                            label={translate('microgatewayApp.PrivilegeAction.CREATE')}
                                            />
                                            <FormControlLabel 
                                              control={<Checkbox onChange={handleCheck} name="UPDATE" checked={check("UPDATE")} color="primary"/>}
                                              label={translate('microgatewayApp.PrivilegeAction.UPDATE')}
                                            />
                                            <FormControlLabel 
                                              control={<Checkbox onChange={handleCheck} name="LISTE" checked={check("LISTE")} color="primary"/>}
                                              label={translate('microgatewayApp.PrivilegeAction.LISTE')}
                                              />
                                              <FormControlLabel 
                                                control={<Checkbox onChange={handleCheck} name="DELETE" checked={check("DELETE")} color="primary"/>}
                                                label={translate('microgatewayApp.PrivilegeAction.DELETE')}
                                              />
                                            </React.Fragment> }
                                    </FormGroup>
                                </FormControl> 
                            </Grid> }
                            <Grid item xs={12} className="text-right pt-3">
                                    <SaveButton 
                                      type="submit" 
                                      size="medium" 
                                      color="primary"
                                      disabled={!isFormValid()} />
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
  privilegeEntity: storeState.privilege.entity,
  loading: storeState.privilege.loading,
  updating: storeState.privilege.updating,
  updateSuccess: storeState.privilege.updateSuccess,
  modelEntities: storeState.modelEntity.entities,
  roles: storeState.userManagement.authorities,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getModelEntities,
  getRoles,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeUpdate);
