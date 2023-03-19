import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { updateEntity, createEntity, reset } from 'app/entities/microstock/equipement/equipement.reducer';
import { connect } from "react-redux";
import { Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Slide, TextField } from "@material-ui/core";
import { Translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers";
import { IEquipement } from "app/shared/model/microstock/equipement.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        minHeight: theme.spacing(37),
        width: '35%',
        overflow:"auto",
        marginTop: theme.spacing(5),
        background: 'transparent',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
        boxShadow:'none',
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '10px 10px 0 0',
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
        borderRadius: '0 0 10px 10px',

    },
}))

interface IEquipementUpdateProps extends StateProps, DispatchProps{
    equipement: IEquipement,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const EquipementUpdate = (props: IEquipementUpdateProps) =>{
    const [entity, setEntity] = useState<IEquipement>(props.equipement || {});
    const [isNew, setIsNew] = useState(!props.equipement || !props.equipement.id );
    const [composantDes, setComposantDes] = useState<IEquipement[]>([]);
    const open = props.open;
    const classes = useStyles();


    const getComposantDes =() => {
        axios.get<IEquipement[]>(API_URIS.equipementApi).then(res =>{
            setComposantDes([...res.data])
        }).catch(e =>console.log(e))
    }

    useEffect(() =>{
        setEntity(props.equipement || {});
        setIsNew(!props.equipement || !props.equipement.id );
    }, [props.equipement])

    useEffect(() =>{
        getComposantDes();
     
    }, [])

    useEffect(() =>{
        if(props.updateSuccess){
            props.onSave(props.savedEntity, isNew);
        }
      
    }, [props.updateSuccess])

    const handleClose = () =>{
        props.onClose();
    }

    const saveEntity = (e) =>{
        e.preventDefault();
        if(entity && entity.nom){
            
            if(!isNew){
                props.updateEntity(entity);
            }
            else{
                props.createEntity(entity);
            }
        }
    } 

    const handleChange = (e) =>{
        const {name, value} = e.target;
        if(name==="composantDe")
         setEntity({...entity,composantDe: [...composantDes].find(co=>co.id===value)});
        else
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
            <Slide in={open}>
                <Card className={classes.card}>
                    <CardHeader classes={{root: classes.cardHeader}} 
                        title={
                            <Translate contentKey="microgatewayApp.microstockEquipement.home.createOrEditLabel">Create or edit equipementf</Translate>
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
                                    <TextField name="nom" value={entity.nom}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockEquipement.nom">nom</Translate>}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>

                            

                                <Grid item xs={12}>
                                    <TextField name="description" value={entity.description}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockEquipement.description">description</Translate>}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField name="dateAjout" type="date" value={entity.dateAjout}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockEquipement.dateAjout">DateAjout</Translate>}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField name="dateRemplacement" type="date" value={entity.dateRemplacement}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockEquipement.dateRemplacement">dateRemplacement</Translate>}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                    <Translate contentKey="microgatewayApp.microstockEquipement.composantDe">ComposantDe</Translate>
                                    </InputLabel>
                                    <Select name="composantDe" value={entity.composantDe? entity.composantDe.id:0}  onChange={handleChange}>
                                        <MenuItem value={0}>select</MenuItem>
                                        {[...composantDes].map((co,index)=>(
                                            <MenuItem value={co.id} key={index}>{co.nom}</MenuItem>
                                        ))}                                   
                                    </Select>
                                    </FormControl>
                                </Grid>         


                                <Grid item xs={12} className="text-right mt-3">
                                    <Button type="submit" 
                                        variant="text" 
                                        color="primary"
                                        className="text-capitalize" 
                                        >
                                        <Translate contentKey="entity.action.save">save</Translate>&nbsp;
                                        <Save />
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Slide>
        </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.equipement.loading,
  updating: storeState.equipement.updating,
  updateSuccess: storeState.equipement.updateSuccess,
  savedEntity: storeState.equipement.entity,
  
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EquipementUpdate);