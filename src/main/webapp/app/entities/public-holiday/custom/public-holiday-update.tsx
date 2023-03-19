import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import {  updateEntity, createEntity } from './../public-holiday.reducer';
import { IPublicHoliday } from 'app/shared/model/public-holiday.model';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { SaveButton } from 'app/shared/component/custom-button';
const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
    },
    card:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            width: '96%',
        }
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: '1px',
        paddingBottom: '1px',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
}))

export interface IPublicHolidayUpdateProps extends StateProps, DispatchProps {
    entity: IPublicHoliday,
    open?: boolean,
    onClose?: Function,
    onUpdate: Function,
}

export const PublicHolidayUpdate = (props: IPublicHolidayUpdateProps) => {

  const [open, setOpen] = useState(props.open);

  const [entityState, setEntityState] = useState<IPublicHoliday>(props.entity);

  const [sentUpdated, setSentUpdated] = useState(false);

  const { updating } = props;

  const classes = useStyles();

  const handleClose = () => {
      setOpen(false);
      if(props.onClose)
        props.onClose();
  };

  useEffect(() => {
      setEntityState(props.entity);
  }, [props.entity]);

  useEffect(() => {
      setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (props.updateSuccess && sentUpdated && props.onUpdate) {
      props.onUpdate(props.updatedEntity, props.entity.id ? false: true)
    }
  }, [props.updateSuccess]);

  const saveEntity = (e) => {
      e.preventDefault();
    if (entityState.ofDate) {
      if (!entityState.id) {
        props.createEntity(entityState);
      } else {
        props.updateEntity(entityState);
      }
    }
    setSentUpdated(true);
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      if(name === 'date'){
          const date = new Date(value);
          setEntityState({...entityState, ofDate: date.toISOString()});
      }else{
        setEntityState({...entityState, [name]: value});
      }
  }

  const getDisplayableDate = () =>{
      if(entityState.ofDate)
        return convertDateFromServer(entityState.ofDate);
     return null;
  }

  return (
    <React.Fragment>
        <Modal
            aria-labelledby="edit-holiday-modal-title"
            aria-describedby="edit-holiday-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}>
            <Card className={classes.card}>
                <CardHeader
                title={<Translate contentKey="microgatewayApp.publicHoliday.home.createOrEditLabel">Create or edit a PublicHoliday</Translate>}
                action={
                    <IconButton onClick={handleClose} color="inherit">
                        <CloseIcon />
                    </IconButton>
                }
                titleTypographyProps={{
                    variant:"h4"
                }}
                classes={{ root: classes.cardHeader }}
                />
                <CardContent>
                    <form onSubmit={saveEntity}>
                        <Grid container spacing={2}>
                            {props.updating && <Grid item xs={12} className="text-center">
                                <CircularProgress color="inherit" />
                            </Grid>}
                            <Grid item xs={12}>
                                <TextField fullWidth
                                    name="name"
                                    value={entityState.name}
                                    label={<Translate contentKey="microgatewayApp.publicHoliday.name">Name</Translate>}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                    id="date"
                                    label={<Translate contentKey="microgatewayApp.publicHoliday.ofDate">Date</Translate>}
                                    type="date"
                                    value={getDisplayableDate()}
                                    name="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} className="text-right">
                                <SaveButton type="submit"
                                    disabled={!entityState.ofDate} />
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
  updating: storeState.publicHoliday.updating,
  updateSuccess: storeState.publicHoliday.updateSuccess,
  updatedEntity: storeState.publicHoliday.entity,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PublicHolidayUpdate);
