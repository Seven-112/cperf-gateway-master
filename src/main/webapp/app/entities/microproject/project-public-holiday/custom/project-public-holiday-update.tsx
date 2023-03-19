import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import {  updateEntity, createEntity } from '../project-public-holiday.reducer';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { IProjectPublicHoliday } from 'app/shared/model/microproject/project-public-holiday.model';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { cleanEntity } from 'app/shared/util/entity-utils';
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

export interface IProjectPublicHolidayUpdateProps{
    entity: IProjectPublicHoliday,
    open?: boolean,
    onClose?: Function,
    onUpdate: Function,
}

export const ProjectPublicHolidayUpdate = (props: IProjectPublicHolidayUpdateProps) => {

  const open = props.open;

  const [entityState, setEntityState] = useState<IProjectPublicHoliday>(props.entity || {});
  const [isNew, setIsNew] = useState(!props.entity || !props.entity.id);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleClose = () => {
      if(props.onClose)
        props.onClose();
  };

  useEffect(() => {
      setEntityState(props.entity || {});
      setIsNew(!props.entity || !props.entity.id)
  }, [props.entity]);

  const saveEntity = (event) => {
    event.preventDefault();
    if (entityState.date) {
        setLoading(true);
        const req = isNew ? axios.post<IProjectPublicHoliday>(API_URIS.projectPublicHolidayApiUri, cleanEntity(entityState))
                        : axios.put<IProjectPublicHoliday>(API_URIS.projectPublicHolidayApiUri, cleanEntity(entityState));
        req.then(res =>{
            if(res.data){
                if(props.onUpdate)
                    props.onUpdate(res.data, isNew);
            }
        }).catch(e => console.log(e))
        .finally(() => setLoading(false))
    }
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      if(name === 'date'){
          const date = new Date(value);
          setEntityState({...entityState, date: date.toISOString()});
      }else{
        setEntityState({...entityState, [name]: value});
      }
  }

  const getDisplayableDate = () =>{
      if(entityState.date)
        return convertDateFromServer(entityState.date);
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
                            {loading && <Grid item xs={12} className="text-center">
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
                                <Button type="submit" variant="text" color="primary"
                                    disabled={!entityState.date}
                                    className="text-capitalize">
                                    <SaveIcon />&nbsp;&nbsp;
                                    {<Translate contentKey={"entity.action.save"}>Save</Translate>}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Modal>
    </React.Fragment>
  );
};
export default ProjectPublicHolidayUpdate;
