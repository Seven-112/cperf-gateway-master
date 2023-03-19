import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './audit-status-traking-file.reducer';
import { IAuditStatusTrakingFile } from 'app/shared/model/microrisque/audit-status-traking-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditStatusTrakingFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingFileUpdate = (props: IAuditStatusTrakingFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditStatusTrakingFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit-status-traking-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...auditStatusTrakingFileEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditStatusTrakingFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.home.createOrEditLabel">
              Create or edit a AuditStatusTrakingFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditStatusTrakingFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-status-traking-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-status-traking-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="trackIdLabel" for="audit-status-traking-file-trackId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.trackId">Track Id</Translate>
                </Label>
                <AvField id="audit-status-traking-file-trackId" type="string" className="form-control" name="trackId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="audit-status-traking-file-fileId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="audit-status-traking-file-fileId"
                  type="string"
                  className="form-control"
                  name="fileId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="audit-status-traking-file-fileName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="audit-status-traking-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-status-traking-file" replace color="info">
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
  auditStatusTrakingFileEntity: storeState.auditStatusTrakingFile.entity,
  loading: storeState.auditStatusTrakingFile.loading,
  updating: storeState.auditStatusTrakingFile.updating,
  updateSuccess: storeState.auditStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingFileUpdate);
