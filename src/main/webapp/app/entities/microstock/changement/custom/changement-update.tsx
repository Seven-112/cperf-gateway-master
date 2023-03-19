import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { updateEntity, createEntity,reset } from 'app/entities/microstock/changement/changement.reducer';
import { connect } from "react-redux";
import {Card, CardContent, CardHeader, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Slide, TextField } from "@material-ui/core";
import { translate, Translate} from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers";
import { Etat } from "app/shared/model/enumerations/etat.model";
import { Button } from 'reactstrap';
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IChangement } from "app/shared/model/microstock/changement.model";
import { IConsommable } from "app/shared/model/microstock/consommable.model";
import { IEquipement } from "app/shared/model/microstock/equipement.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";


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

interface IChangementUpdateProps extends StateProps, DispatchProps{
    changement: IChangement,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const ChangementUpdate = (props: IChangementUpdateProps) =>{
    const [entity, setEntity] = useState<IChangement>(props.changement || {etat:Etat.Attente} );
    const [isNew, setIsNew] = useState(!props.changement || !props.changement.id );
    const open = props.open;
    const [consommables, setConsommables] = useState<IConsommable[]>([]);
    const [equipements, setEquipements] = useState<IEquipement[]>([]);
    const classes = useStyles();

    const { changementEntity,loading, updating } = props;

    const [ fichier, setFichier ] = useState<IMshzFile>(null);
    const [ openFile, setOpenFile ] = useState(false);

    const getFile =() => {
        if(props.changement && props.changement.fileId && serviceIsOnline(SetupService.FILEMANAGER)){
            axios.get<IMshzFile>(API_URIS.mshzFileApiUri+"/"+props.changement.fileId)
            .then(res =>{
                setFichier(res.data)
            }).catch(e =>console.log(e))
        }else{
            setFichier(null)
        }
    }

    const getEquipements =() => {
        axios.get<IEquipement[]>(API_URIS.equipementApi).then(res =>{
            setEquipements([...res.data])
        }).catch(e =>console.log(e))
    }

    useEffect(() =>{
        setEntity(props.changement || {etat:Etat.Attente} );
        setIsNew(!props.changement || !props.changement.id );
        getFile();
    }, [props.changement])

    useEffect(() =>{
        // getConsommables();
        getEquipements();
    }, [])

    useEffect(() =>{
        if(props.updateSuccess){
            props.onSave(props.savedEntity, isNew);
            props.setFileUploadWillAssociateEntityId(props.savedEntity.id);
            if(isNew && props.account)
                props.associateFilesToEntity(props.savedEntity.id, FileEntityTag.stockChangement.toString(), props.account.id);
        }
      
    }, [props.updateSuccess])

    const handleClose = () =>{
        props.onClose();
    }

    const saveEntity = (e) =>{
        e.preventDefault();
        if( entity && (entity.consommable || entity.equipement) ){
            
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
        // if(name==="consommable")
        //  setEntity({...entity,consommable: [...consommables].find(co=>co.id===value)});
        if(name==="equipement")
         setEntity({...entity,equipement: [...equipements].find(co=>co.id===value)});
        else
          setEntity({...entity, [name]: value});
    }

    const onsavedFile =(saved ?:IMshzFile[]) =>{
        if(saved && saved.length !==0){
            setEntity({...entity, fileId: saved[0].id, fileName: saved[0].name})
            setOpenFile(false)
        }
    }

    const onDelete =(deletedId) =>{
        if(deletedId){
            setEntity({...entity, fileId: null, fileName: null})
        }
    }

    const files = fichier ? [fichier]:[]

    return(
        <React.Fragment>
            <ModalFileManager
            entityId={entity ? entity.id : null}
            entityTagName={FileEntityTag.stockChangement}
            open={openFile}
            files={[...files]}
            onSave={onsavedFile}
            readonly={false}
            onRemove={onDelete}
            onClose={()=>setOpenFile(false)}
            />
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
                            <Translate contentKey="microgatewayApp.microstockChangement.home.createOrEditLabel">Create or edit type objectif</Translate>
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
                            
                            {/* 
                                <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                    <Translate contentKey="microgatewayApp.consommable.detail.title">Consommable</Translate>
                                    </InputLabel>
                                    <Select name="consommable" value={entity.consommable? entity.consommable.id:0}  onChange={handleChange}>
                                        <MenuItem value={0}>select</MenuItem>
                                        {[...consommables].map((co,index)=>(
                                            <MenuItem value={co.id} key={index}>{co.nom}</MenuItem>
                                        ))}                                   
                                    </Select>
                                    </FormControl>
                                </Grid> */}

                                <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                    <Translate contentKey="microgatewayApp.microstockEquipement.detail.title">Equipement</Translate>
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
                                    <TextField name="motif" value={entity.motif}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockChangement.motif">motif</Translate>}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                <TextField value={entity.fileName}  onClick={()=>setOpenFile(true)} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockChangement.fileName">fileName</Translate>}
                                        InputLabelProps={{ shrink: true }}
                                    />        
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField name="commentaire" value={entity.commentaire}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockChangement.commentaire">commentaire</Translate>}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                    <Translate contentKey="microgatewayApp.microstockChangement.etat">Etat</Translate>
                                    </InputLabel>
                                    <Select name="etat" value={entity.etat? entity.etat:Etat.Attente}  onChange={handleChange}>
                                        <MenuItem value={Etat.Attente}>{translate("microgatewayApp.Etat.Attente")}</MenuItem>
                                        <MenuItem value={Etat.Validee}>{translate("microgatewayApp.Etat.Validee")}</MenuItem>
                                        <MenuItem value={Etat.Rejetter}>{translate("microgatewayApp.Etat.Rejetter")}</MenuItem>
                                                                        
                                    </Select>
                                    </FormControl>
                                </Grid>  

                                <Grid item xs={12}>
                                    <TextField type="date" name="date" value={entity.date}  onChange={handleChange} fullWidth
                                        label={<Translate contentKey="microgatewayApp.microstockChangement.date">date</Translate>}
                                        InputLabelProps={{ shrink: true }}
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
            </Slide>
        </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
  equipements: storeState.equipement.entities,
  consommables: storeState.consommable.entities,
  loading: storeState.changement.loading,
  updating: storeState.changement.updating,
  updateSuccess: storeState.changement.updateSuccess,
  savedEntity: storeState.changement.entity,
  changementEntity: storeState.changement.entity,
  account: storeState.authentication.account,
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
  reset,
  associateFilesToEntity, 
  setFileUploadWillAssociateEntityId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChangementUpdate);