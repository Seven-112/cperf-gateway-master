import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { updateEntity, createEntity, reset } from '../typeindicator.reducer';
import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { Button, Card, CardContent, CardHeader, Fab, Grid, IconButton, makeStyles, Modal, Switch, TextField } from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        height: theme.spacing(37),
        marginTop: theme.spacing(5),
        background: 'transparent',
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '10px 10px 0 0',
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
    },
}))

export interface ITypeindicatorUpdateProps extends StateProps, DispatchProps {
    typeindicator: ITypeindicator,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const TypeindicatorUpdate = (props: ITypeindicatorUpdateProps) => {
    const [entity, setEntity] = useState<ITypeindicator>(props.typeindicator);
    const [open, setOpen] = useState(props.open);

    const classes = useStyles();

    useEffect(() =>{
        props.reset();
    }, [])

    useEffect(() =>{
        setEntity(props.typeindicator);
    }, [props.typeindicator])

    useEffect(() =>{
        setOpen(open);
    }, [props.open])

    useEffect(() =>{
        props.onSave(props.savedEntity, props.typeindicator.id ? false: true);
    }, [props.updateSuccess])

    const handleClose = () =>{
        setOpen(false);
        props.onClose();
    }

    const saveEntity = (e) =>{
        e.preventDefault();
        if(entity.name){
            if(entity.id){
                props.updateEntity(entity);
            }
            else{
                entity.valid = true;
                props.createEntity(entity);
            }
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEntity({...entity, [name]: value});
    }

    const handleChangeSwith = (e) => setEntity({...entity, measurable: e.target.checked});

  return (
    <React.Fragment>
    <Modal
        aria-labelledby="edit-type-objectif-modal-title"
        aria-describedby="edit-type-objectif-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableBackdropClick
        BackdropProps={{
            timeout: 500,
        }}>
        <Card className={classes.card}>
            <CardHeader classes={{root: classes.cardHeader}} 
                title={
                    <Translate contentKey="microgatewayApp.typeindicator.home.createOrEditLabel">Create or edit type objectif</Translate>
                }
                titleTypographyProps={{ variant: 'h4'}}
                action={
                    <IconButton color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>
                }/>
            <CardContent className={classes.cardContent}>
                <form onSubmit={saveEntity}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField name="name" value={entity.name} onChange={handleChange} fullWidth
                                label={<Translate contentKey="microgatewayApp.typeindicator.name">Name</Translate>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid item className="mr-3">
                                    <Translate contentKey="microgatewayApp.typeindicator.measurable">Measurable</Translate> :
                                 </Grid>
                                <Grid item><Translate contentKey="_global.label.no">No</Translate></Grid>
                                <Grid item>
                                    <Switch checked={entity.measurable} onChange={handleChangeSwith} />
                                </Grid>
                                <Grid item><Translate contentKey="_global.label.yes">yes</Translate></Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className="text-right mt-3">
                            <SaveButton type="submit" disabled={!entity.name} />
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
  savedEntity: storeState.typeindicator.entity,
  loading: storeState.typeindicator.loading,
  updating: storeState.typeindicator.updating,
  updateSuccess: storeState.typeindicator.updateSuccess,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeindicatorUpdate);
