import { ITypeObjectif } from "app/shared/model/type-objectif.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { updateEntity, createEntity, reset } from 'app/entities/type-objectif/type-objectif.reducer';
import { connect } from "react-redux";
import { Button, Card, CardContent, CardHeader, Fab, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField } from "@material-ui/core";
import { Translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import { ObjectifTypeEvaluationUnity } from "app/shared/model/enumerations/objectif-type-evaluation-unity.model";
import { SaveButton } from "app/shared/component/custom-button";

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

interface ITypeObjectifUpdateProps extends StateProps, DispatchProps{
    typeObjectif: ITypeObjectif,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const TypeObjectifUpdate = (props: ITypeObjectifUpdateProps) =>{
    const [entity, setEntity] = useState<ITypeObjectif>(props.typeObjectif);
    const [open, setOpen] = useState(props.open);

    const classes = useStyles();

    useEffect(() =>{
        props.reset();
    }, [])

    useEffect(() =>{
        setEntity(props.typeObjectif);
    }, [props.typeObjectif])

    useEffect(() =>{
        setOpen(open);
    }, [props.open])

    useEffect(() =>{
        props.onSave(props.savedEntity, props.typeObjectif.id ? false: true);
    }, [props.updateSuccess])

    const handleClose = () =>{
        setOpen(false);
        props.onClose();
    }

    const saveEntity = (e) =>{
        e.preventDefault();
        if(entity.name){
            if(!entity.evalutationUnity)
                entity.evalutationUnity = ObjectifTypeEvaluationUnity.NOTHING;
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

    return(
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
                        <Translate contentKey="microgatewayApp.typeObjectif.home.createOrEditLabel">Create or edit type objectif</Translate>
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
                                    label={<Translate contentKey="microgatewayApp.typeObjectif.name">Name</Translate>}
                                />
                            </Grid>
                            <Grid item xs={12}>
                             <FormControl fullWidth>
                                 <InputLabel><Translate contentKey="microgatewayApp.typeObjectif.evalutationUnity">evalutationUnity</Translate></InputLabel>
                                <Select name="evalutationUnity" value={entity.evalutationUnity} onChange={handleChange}>
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="NOTHING">
                                        <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.NOTHING">NOTHING</Translate>
                                    </MenuItem>
                                    <MenuItem value="YEAR">
                                        <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.YEAR">YEAR</Translate>
                                    </MenuItem>
                                    <MenuItem value="MONTH">
                                        <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.MONTH">MONTH</Translate>
                                    </MenuItem>
                                    <MenuItem value="WEEK">
                                        <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.WEEK">WEEK</Translate>
                                    </MenuItem>
                                    <MenuItem value="DAY">
                                        <Translate contentKey="microgatewayApp.ObjectifTypeEvaluationUnity.DAY">DAY</Translate>
                                    </MenuItem>
                                </Select>
                                </FormControl>
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
    )
}

const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.typeObjectif.loading,
  updating: storeState.typeObjectif.updating,
  updateSuccess: storeState.typeObjectif.updateSuccess,
  savedEntity: storeState.typeObjectif.entity,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeObjectifUpdate);