import { IJustification } from "app/shared/model/microprocess/justification.model";
import React, { useEffect, useState } from "react";
import { createEntity, updateEntity } from 'app/entities/microprocess/justification/justification.reducer';
import { getSession } from 'app/shared/reducers/authentication';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import EditFileModal from "app/shared/component/edit-file-modal";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { Backdrop, Card, CardContent, CardHeader, Fab, Fade, Grid, IconButton, makeStyles, Modal, TextField } from "@material-ui/core";
import { Translate } from "react-jhipster";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import DescriptionIcon from '@material-ui/icons/Description';

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
      width:"45%",
      [theme.breakpoints.down('sm')]:{
        width: '97%',
      },
    },
    cardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
  }));
  
interface JusficationUpdateModalProps extends StateProps, DispatchProps{
    entity: IJustification,
    title?: string,
    open: boolean,
    onSaved: Function,
    onClose: Function,
}

export const JusficationUpdateModal = (props: JusficationUpdateModalProps) =>{
    const isNew = !props.entity || !props.entity.id;

    const [entityState, setEntityState] = useState<IJustification>(props.entity);

    const [open, setOpen] = useState(props.open);
    
    const [openFileEditor, setOpenFileEditor] = useState(false);

    const [file, setFile] = useState<IMshzFile>({});

    const [formSubmited, setFormSubmited] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        setEntityState(props.entity);
    }, [props.entity])

    useEffect(() =>{
        setOpen(props.open);
    }, [props.open])

    useEffect(() =>{
        if(file)
            setEntityState({...entityState,fileId: file.id});
    }, [file])

    useEffect(() =>{
        if(formSubmited){
            if(isNew)
                props.onSaved(props.savedEntity, false, file);
            else
                props.onSaved(props.savedEntity, true, file);
            setFormSubmited(false);
            setFile(null);
        }
    }, [props.updateSuccess])

    const onFileSaved = (savedFiles: IMshzFile[]) =>{
        if(savedFiles && savedFiles.length){
            setFile({...savedFiles[0]});
        }
        setOpenFileEditor(false);
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEntityState({...entityState, [name]: value});
    }

    const formValid = () =>{
        if(entityState && entityState.reason && (entityState.taskId || entityState.processId) && (entityState.content || entityState.fileId))
            return true;
        return false;
    }

    const saveEntity = (e) =>{
        e.preventDefault();
        if(formValid()){
            const entityToSave: IJustification = {
                ...entityState,
                editorId: props.account ? props.account.id : null,
            }
            setFormSubmited(true);
            if(isNew)
                props.createEntity(entityToSave);
            else
                props.updateEntity(entityToSave);
        }
    }

    const handleClose = () =>{
        setOpen(false);
        props.onClose();
    }

    return (
        <React.Fragment>
            {/* <EditFileModal selectMultiple={false} 
              open={openFileEditor}
              withClearPreviewerItem={true}
              onSaved={onFileSaved} 
              onCloseNoCancelSaving={() => setOpenFileEditor(false)}
              /> */}
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
                 timeout: 100,
             }}
             >
                 <Card className={classes.paper}>
                     <CardHeader className={classes.cardHeader}
                     title={ props.title ? props.title : 
                        <Translate contentKey="microgatewayApp.microprocessJustification.home.createOrEditLabel">
                            Create or edit justification
                        </Translate>
                    }
                     action={
                         <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon style={{ color: 'white' }} />
                         </IconButton>
                     }/>
                     <CardContent>
                       <form method="post" onSubmit={saveEntity}>
                         <Grid container>
                             <Grid item xs={12} className="center-align">
                               {props.updating && 'updating ..'}
                             </Grid>
                             <Grid item xs={12}>
                                 <TextField fullWidth name="content" onChange={handleChange}
                                   label={<Translate contentKey="microgatewayApp.microprocessJustification.content">Content</Translate>}
                                   value={entityState.content} multiline={true} rowsMax={3}
                                 />
                             </Grid>
                             <Grid item xs={12} className="pt-2">
                                <Fab color="secondary" onClick={() => setOpenFileEditor(true)} 
                                    title="attach file" className="mt-3 mr-2">
                                    <DescriptionIcon />
                                </Fab>
                                {file && file.name}
                             </Grid>
                             <Grid item xs={12} className="pt-3">
                               <Fab type="submit" variant="extended" size="medium" className="mt-3 float-right"
                                     color="primary" disabled={!formValid()}>
                                     <SaveIcon />
                                     <Translate contentKey="entity.action.save">Save</Translate>
                               </Fab>
                             </Grid>
                         </Grid>
                       </form>
                     </CardContent>
                 </Card>
             </Modal>
        </React.Fragment>
    )
}


const mapStateToProps = ({ justification, authentication }: IRootState) => ({
    updating: justification.updating,
    updateSuccess: justification.updateSuccess,
    account: authentication.account,
    savedEntity: justification.entity,
  });
  
  const mapDispatchToProps = {
      createEntity,
      updateEntity,
      getSession,
  };

  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;

  export default connect(mapStateToProps, mapDispatchToProps)(JusficationUpdateModal);