import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from '../department.reducer';
import { Backdrop, Button, Card, CardContent, CardHeader, Fade, Grid, IconButton, makeStyles, Modal, TextField } from '@material-ui/core';
import { IDepartment } from 'app/shared/model/department.model';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
  modal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.common.white,
    border: '2px solid '+theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 3),
    width:"35%",
    [theme.breakpoints.down('sm')]:{
      width: '97%',
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.dark,
  },
}));

export interface IDepartmentUpdateProps extends StateProps, DispatchProps {
  open?:boolean,
  department?: IDepartment,
  handleClose?: Function,
  onSaved?: Function,
}
export const DepartmentUpdate = (props: IDepartmentUpdateProps) => {

  const classes = useStyles();

  const {loading, updating } = props;

  const [open, setOpen] = useState(props.open);
  const [departmentState, setDepartmentState] = useState<IDepartment>(props.department);

  useEffect(() =>{
      setDepartmentState(props.department ? props.department : {});
  },[props.department]);

  const handleClose = () => {
    setOpen(false);
    if(props.handleClose)
      props.handleClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
       if(props.onSaved)
          props.onSaved();
    }
  }, [props.updateSuccess]);

  useEffect(() =>{
        setOpen(props.open);
  }, [props.open])

  const handleChange = e =>{
    const {name, value} = e.target;
    setDepartmentState({...departmentState, [name]: value});
  }

  const saveEntity = (e) => {
    e.preventDefault();
    if(departmentState && departmentState.name){
      const entity: IDepartment = { ...departmentState };
      if (!entity.id) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <Modal
    aria-labelledby="edit-department-modal-title"
    aria-describedby="edit-department-modal-description"
    className={classes.modal}
    open={open}
    onClose={handleClose}
    closeAfterTransition
    disableBackdropClick
    BackdropComponent={Backdrop}
    BackdropProps={{
        timeout: 500,
    }}
    >
    <Fade in={open}>
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader}
            title={<Translate contentKey="microgatewayApp.department.home.createOrEditLabel">Create or edit a Department</Translate>}
            titleTypographyProps={{ variant: 'h4'}}
            action={
                <IconButton aria-label="close" 
                color="inherit"
                onClick={ () => handleClose()}>
                <CloseIcon />
                </IconButton>
            }/>
            <CardContent>
              <form method="post" onSubmit={saveEntity}>
                <Grid container>
                    <Grid item xs={12} className="center-align">
                      {loading && 'loaging ..'}
                      {updating && 'updating ..'}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required={true} name="name" onChange={handleChange}
                          label={<Translate contentKey="microgatewayApp.department.name">Name</Translate>}
                          value={departmentState.name}
                        />
                    </Grid>
                    <Grid item xs={12} className="text-right pt-3">
                      <SaveButton type="submit" disabled={!departmentState.name} />
                    </Grid>
                </Grid>
              </form>
            </CardContent>
        </Card>
    </Fade>
    </Modal>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.department.loading,
  updating: storeState.department.updating,
  updateSuccess: storeState.department.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentUpdate);
