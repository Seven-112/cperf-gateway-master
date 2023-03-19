import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './mshz-file.reducer';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IMshzFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MshzFileUpdate = (props: IMshzFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { mshzFileEntity, loading, updating } = props;

  const { fData, fDataContentType } = mshzFileEntity;

  const handleClose = () => {
    props.history.push('/mshz-file' + props.location.search);
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
    values.storeAt = convertDateTimeToServer(values.storeAt);

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

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microgatewayApp.microfilemanagerMshzFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.home.createOrEditLabel">Create or edit a MshzFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : mshzFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="mshz-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="mshz-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="mshz-file-name">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.name">Name</Translate>
                </Label>
                <AvField id="mshz-file-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <AvGroup>
                  <Label id="fDataLabel" for="fData">
                    <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.fData">F Data</Translate>
                  </Label>
                  <br />
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
                  <AvInput type="hidden" name="fData" value={fData} />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="entityIdLabel" for="mshz-file-entityId">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.entityId">Entity Id</Translate>
                </Label>
                <AvField id="mshz-file-entityId" type="string" className="form-control" name="entityId" />
              </AvGroup>
              <AvGroup>
                <Label id="entityTagNameLabel" for="mshz-file-entityTagName">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.entityTagName">Entity Tag Name</Translate>
                </Label>
                <AvField id="mshz-file-entityTagName" type="text" name="entityTagName" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="mshz-file-userId">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.userId">User Id</Translate>
                </Label>
                <AvField id="mshz-file-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="storeAtLabel" for="mshz-file-storeAt">
                  <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.storeAt">Store At</Translate>
                </Label>
                <AvInput
                  id="mshz-file-storeAt"
                  type="datetime-local"
                  className="form-control"
                  name="storeAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.mshzFileEntity.storeAt)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/mshz-file" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MshzFileUpdate);
