import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from 'app/entities/microprocess/procedure/procedure.reducer';
import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { Helmet } from 'react-helmet';
import { Button, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import { AttachFile, Save } from '@material-ui/icons';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { translate, Translate } from 'react-jhipster';
import EditFileModal from 'app/shared/component/edit-file-modal';
import { FileIllustration } from 'app/shared/component/file-previewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import { SaveButton } from 'app/shared/component/custom-button';
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';
import { getSession } from 'app/shared/reducers/authentication';
import { FileEntityTag } from 'app/shared/model/file-chunk.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
    },
    fileIllustrator:{
        height: theme.spacing(5),
        width: theme.spacing(5),
        fontSize: theme.spacing(7),
        marginRight: theme.spacing(1),
    }
}))

export interface IProcedureUpdateProps extends StateProps, DispatchProps {
    procedure: IProcedure,
    open: boolean,
    onSaved?: Function,
    onClose?: Function,
}

export const ProcedureUpdate = (props: IProcedureUpdateProps) => {

  const {updating, open } = props;

  const [isNew] = useState(!props.procedure || !props.procedure.id);

  const [formState, setFormState] = useState<IProcedure>(props.procedure);

  const [file, setFile] = useState<IMshzFile>(null);

  const [openFileEditor, setOpenFileEditor] = useState(false);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  };

  const assiateUploadedFileToField = (id) =>{
      if(isNew && id){
          if(props.account){
              props.setFileUploadWillAssociateEntityId(id);
              props.associateFilesToEntity(id, FileEntityTag.procedure.toString(), props.account.id)
          }
      }
  }
  
  useEffect(() => {
      props.reset();
      if(!props.account)
        props.getSession();
  }, []);

  useEffect(() =>{
        setFormState(props.procedure);
        if(props.procedure.fileId && serviceIsOnline(SetupService.FILEMANAGER)){
            // loading file
            axios.get<IMshzFile>(`${API_URIS.mshzFileApiUri}/${props.procedure.fileId}`)
              .then(resp =>{
                if(resp.data)
                    setFile(resp.data);
            }).catch(() =>{});
        }
  }, [props.procedure])

  useEffect(() => {
    if (props.updateSuccess) {
      if(props.onSaved){
        props.onSaved(props.procedureEntity, isNew);
        assiateUploadedFileToField(props.procedureEntity.id)
      }
    }
  }, [props.updateSuccess]);

  const onSavedFiles = (savedFiles?: IMshzFile[]) =>{
      if(savedFiles && savedFiles.length){
        setFormState({...formState, fileId: savedFiles[0].id});
        setFile(savedFiles[0]);
      }
      setOpenFileEditor(false);
  }

  const saveEntity = (event) => {
      event.preventDefault();
    if (formState.name) {
      const entity: IProcedure = {
        ...formState,
        fileId: file ? file.id : null,
      };

      if (isNew) {
        entity.storeAt = new Date().toISOString();
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      setFormState({...formState, [name]: value});
  }

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Procedure | Create Or Update</title></Helmet>
          <EditFileModal open={openFileEditor} 
              withClearPreviewerItem 
              entityId={formState.id}
              entityTagName={FileEntityTag.procedure}
              onSaved={onSavedFiles} 
              onCloseNoCancelSaving={() => setOpenFileEditor(false)}
          />
          <MyCustomModal open={open} onClose={handleClose} rootCardClassName={classes.card}
            title={translate("microgatewayApp.microprocessProcedure.home.createOrEditLabel")}
            avatarIcon={<FontAwesomeIcon icon={faFileAlt} className="mr-3"/>}
          >
          <form onSubmit={saveEntity}>
              {props.updating && 
              <Grid container spacing={2} className="text-center">updating..</Grid> }
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <TextField name="name" value={formState.name} onChange={handleChange} fullWidth required
                      label={<Translate contentKey="microgatewayApp.microprocessProcedure.name">name</Translate>}/>
                  </Grid>
                  <Grid item xs={12}>
                      <IconButton onClick={() => setOpenFileEditor(true)} color="primary"
                           className="mr-3 d-inline" title="Description file">
                          <AttachFile />
                      </IconButton>
                      {file && <React.Fragment>
                          <FileIllustration file={file} className={classes.fileIllustrator}/>
                          {file.name}
                       </React.Fragment> }
                  </Grid>
                  <Grid item xs={12} className="text-right">
                      <SaveButton type="submit" disabled={!formState.name} />
                  </Grid>
              </Grid>
            </form>
          </MyCustomModal>
      </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  procedureEntity: storeState.procedure.entity,
  updating: storeState.procedure.updating,
  updateSuccess: storeState.procedure.updateSuccess,
  account: storeState.authentication.account,
  associatedFileSize: storeState.fileUpload.updatedFileSize,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  associateFilesToEntity,
  setFileUploadWillAssociateEntityId,
  getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcedureUpdate);
