import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './audit-status-traking.reducer';
import { IAuditStatusTraking } from 'app/shared/model/microrisque/audit-status-traking.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditStatusTrakingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingUpdate = (props: IAuditStatusTrakingUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditStatusTrakingEntity, loading, updating } = props;

  const { justification } = auditStatusTrakingEntity;

  const handleClose = () => {
    props.history.push('/audit-status-traking' + props.location.search);
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
    values.tracingAt = convertDateTimeToServer(values.tracingAt);

    if (errors.length === 0) {
      const entity = {
        ...auditStatusTrakingEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditStatusTraking.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.home.createOrEditLabel">
              Create or edit a AuditStatusTraking
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditStatusTrakingEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-status-traking-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-status-traking-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="auditIdLabel" for="audit-status-traking-auditId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.auditId">Audit Id</Translate>
                </Label>
                <AvField
                  id="audit-status-traking-auditId"
                  type="string"
                  className="form-control"
                  name="auditId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="audit-status-traking-status">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.status">Status</Translate>
                </Label>
                <AvInput
                  id="audit-status-traking-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && auditStatusTrakingEntity.status) || 'INITIAL'}
                >
                  <option value="INITIAL">{translate('microgatewayApp.AuditStatus.INITIAL')}</option>
                  <option value="STARTED">{translate('microgatewayApp.AuditStatus.STARTED')}</option>
                  <option value="EXECUTED">{translate('microgatewayApp.AuditStatus.EXECUTED')}</option>
                  <option value="SUBMITTED">{translate('microgatewayApp.AuditStatus.SUBMITTED')}</option>
                  <option value="COMPLETED">{translate('microgatewayApp.AuditStatus.COMPLETED')}</option>
                  <option value="CANCELED">{translate('microgatewayApp.AuditStatus.CANCELED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="tracingAtLabel" for="audit-status-traking-tracingAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.tracingAt">Tracing At</Translate>
                </Label>
                <AvInput
                  id="audit-status-traking-tracingAt"
                  type="datetime-local"
                  className="form-control"
                  name="tracingAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditStatusTrakingEntity.tracingAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="audit-status-traking-justification">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.justification">Justification</Translate>
                </Label>
                <AvInput id="audit-status-traking-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="audit-status-traking-userId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.userId">User Id</Translate>
                </Label>
                <AvField id="audit-status-traking-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup check>
                <Label id="editableLabel">
                  <AvInput id="audit-status-traking-editable" type="checkbox" className="form-check-input" name="editable" />
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.editable">Editable</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="recomLabel">
                  <AvInput id="audit-status-traking-recom" type="checkbox" className="form-check-input" name="recom" />
                  <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.recom">Recom</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-status-traking" replace color="info">
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
  auditStatusTrakingEntity: storeState.auditStatusTraking.entity,
  loading: storeState.auditStatusTraking.loading,
  updating: storeState.auditStatusTraking.updating,
  updateSuccess: storeState.auditStatusTraking.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingUpdate);
