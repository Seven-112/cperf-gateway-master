import { Box, FormControl, Grid, IconButton, makeStyles, TextField} from '@material-ui/core';
import { IRootState } from 'app/shared/reducers';
import React,{ useEffect, useRef, useState } from 'react';
import { byteSize, setFileData, translate, Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getEntity, updateEntity, createEntity, setBlob, reset } from '../mshz-file.reducer';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ClearIcon from '@material-ui/icons/Clear';
import { formateBase64Src } from 'app/shared/util/helpers';

const useStyles = makeStyles((theme) =>({
    root:{
      background: 'transparent',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(10),
      [theme.breakpoints.up("sm")]:{
        minWidth: theme.spacing(100),
      },
      [theme.breakpoints.down("sm")]:{
        width: theme.spacing(43),
      },
    },
    modalHeader:{
      background:theme.palette.primary.light,
      color:theme.palette.common.white,
      margin:-2,
      marginBottom:0,
      padding:7,
    },
    modalBody:{
      background:theme.palette.common.white,
      color:theme.palette.error.dark,
      margin:-2,
      padding:30,
      borderBottom: '1px solid '+theme.palette.primary.dark,
      justifyContent: "space-between",
      overflow:"auto",
      textAlign:"center",
      [theme.breakpoints.up("sm")]:{
        maxHeight:  theme.spacing(60),
      },
      [theme.breakpoints.down("sm")]:{
        height: theme.spacing(43),
      },
    },
    modalFooter:{
      margin:-2,
      marginTop:1,
      justifyContent: "space-between",
      background:theme.palette.common.white,
    },
    infoBox:{
        border:"0.5px solid "+theme.palette.grey[400],
        borderRadius:5,
        overflow: 'hidden',
    },
  }));

export interface IMshzFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const CustomMshzFileUpdate = (props: IMshzFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [isOpen, setIsOpen] = useState(true);

  const { mshzFileEntity, loading, updating } = props;

  const { fData, fDataContentType } = mshzFileEntity;
  const classes = useStyles();

  const inputFile = useRef(null);

  const handleClose = () => {
    props.history.goBack();
    // props.history.push('/mshz-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...mshzFileEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };
  const triggerInputFileClick = e =>{
      e.preventDefault();
      if(inputFile.current)
        inputFile.current.click();
  }
  return <div>
    <Modal isOpen toggle={handleClose} className={classes.root}>
        <ModalHeader toggle={handleClose} className={classes.modalHeader}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
        </ModalHeader>
        <ModalBody className={classes.modalBody}>
        {loading ? (
            <p>Loading...</p>
          ) : ( 
              (fDataContentType && fDataContentType.toString().toLowerCase().includes('image')) &&
                <img src={formateBase64Src(fDataContentType, fData)} alt=""/>
          )}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
            <Box width={1} style={{ overflow: "hidden" }}>
                <form>
                    {!isNew ? ( 
                        <input id="mshz-file-id" type="hidden" className="form-control" name="id" required readOnly /> )
                     : null}
                    <input ref={inputFile} type="file" onChange={onBlobChange(false, 'fData')} style={{display: 'none'}}/>
                    <Grid container spacing={1} direction="row" alignItems="flex-start">
                        <Grid item xs={12}>
                            <Box width={1} className={classes.infoBox}>
                                <Grid container alignItems="center" direction="row" alignContent="space-between">
                                <Grid item xs={1}>
                                    <IconButton aria-label="Atach file" title="attach file"
                                    onClick={(e) => triggerInputFileClick(e)} edge="end">
                                        {<AttachFileIcon />}
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10}>
                                    <span> {fDataContentType ? fDataContentType + ', ': ''} {fData ? byteSize(fData) : ''} </span>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton aria-label="Atach file" title="attach file"
                                         onClick={() => clearBlob('fData')} edge="end">
                                        {<ClearIcon color="secondary" />}
                                    </IconButton>
                                </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={9}> 
                          <FormControl fullWidth size='small'>
                            <TextField type="text" name="name" error={false} fullWidth
                                label={translate("microgatewayApp.microfilemanagerMshzFile.name")}
                                defaultValue={mshzFileEntity.name} variant="outlined" size='small'
                                onChange={null}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3} style={{ textAlign: "right" }}>
                            <Button color="primary" id="save-entity" type="submit" disabled={updating}
                             style={{ width:"100%", height:38, }}>
                                <FontAwesomeIcon icon="save" />
                                &nbsp;
                                <Translate contentKey="entity.action.save">Save</Translate>
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>  
            {/* <AvForm model={isNew ? {} : mshzFileEntity} onSubmit={saveEntity}>
              {!isNew ? ( <AvInput id="mshz-file-id" type="hidden" className="form-control" name="id" required readOnly /> ) : null}
              <AvGroup>
                <Label id="nameLabel" for="mshz-file-name">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.name">Name</Translate>
                  <AvField id="mshz-file-name" type="text" name="name"/>
                </Label>
              </AvGroup>
              <AvGroup>
                <AvGroup>
                  {fData ? (
                    <div>
                      {fDataContentType ? (
                        <a onClick={openFile(fDataContentType, fData)}>
                          <Translate contentKey="entity.action.open">Open</Translate>
                        </a>
                      ) : null}
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {fDataContentType}, {byteSize(fData)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('fData')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_fData" type="file" onChange={onBlobChange(false, 'fData')} />
                  <AvInput
                    type="hidden"
                    name="fData"
                    value={fData}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                    }}
                  />
                </AvGroup>
              </AvGroup>
                <Button color="primary" onClick={handleClose}>
                    <FontAwesomeIcon icon="ban" />
                    &nbsp;
                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
            </AvForm> */}
        </ModalFooter>
    </Modal>
  </div>;
}

const mapStateToProps = (storeState: IRootState) => ({
  mshzFileEntity: storeState.mshzFile.entity,
  loading: storeState.mshzFile.loading,
  updating: storeState.mshzFile.updating,
  updateSuccess: storeState.mshzFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomMshzFileUpdate);