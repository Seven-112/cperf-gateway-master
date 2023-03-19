import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { updateEntity, createEntity, reset } from 'app/entities/microstock/engeneering/engeneering.reducer';
import { connect } from "react-redux";
import { Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField } from "@material-ui/core";
import { Translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers";
import { IEngeneering } from "app/shared/model/microstock/engeneering.model";
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

    },
}))

interface IEngeneeringUpdateProps extends StateProps, DispatchProps{
    engeneering: IEngeneering,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const EngeneeringUpdate = (props: IEngeneeringUpdateProps) =>{
    const [entity, setEntity] = useState<IEngeneering>(props.engeneering || {});
    const [isNew, setIsNew] = useState(!props.engeneering || !props.engeneering.id );
    const open = props.open;
    const [equipements, setEquipements] = useState<IEquipement[]>([]);
    const classes = useStyles();

   
    const getEquipements =() => {
        axios.get<IEquipement[]>(API_URIS.equipementApi).then(res =>{
            setEquipements([...res.data])
        }).catch(e =>console.log(e))
    }

    useEffect(() =>{
        setEntity(props.engeneering || {} );
        setIsNew(!props.engeneering || !props.engeneering.id );
    }, [props.engeneering])

    useEffect(() =>{
        getEquipements();
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
        if((entity && entity.equipement)){
            
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
        if(name==="equipement")
         setEntity({...entity, equipement: [...equipements].find(co=>co.id===value)});
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
                             <FormControl fullWidth>
                                 <InputLabel shrink>
                                 <Translate contentKey="microgatewayApp.equipement.detail.title">Equipement</Translate>
                                 </InputLabel>
                                <Select name="equipement" value={entity.equipement? entity.equipement.id:0}  onChange={handleChange}>
                                    <MenuItem value={0}>select</MenuItem>
                                    {[...equipements].map((co,index)=>(
                                         <MenuItem value={co.id} key={index}>{co.nom}</MenuItem>
                                    ))}                                   
                                </Select>
                                </FormControl>
                            </Grid>  

                            <Grid item xs={12}>
                                <TextField name="commentaire" value={entity.commentaire}  onChange={handleChange} fullWidth
                                    label={<Translate contentKey="microgatewayApp.engeneering.commentaire">commentaire</Translate>}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField name="expertise" value={entity.expertise}  onChange={handleChange} fullWidth
                                    label={<Translate contentKey="microgatewayApp.engeneering.expertise">commentaire</Translate>}
                                />
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
        </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.engeneering.loading,
  updating: storeState.engeneering.updating,
  updateSuccess: storeState.engeneering.updateSuccess,
  savedEntity: storeState.engeneering.entity,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EngeneeringUpdate);