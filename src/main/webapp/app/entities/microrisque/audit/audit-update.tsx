import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAuditCycle } from 'app/shared/model/microrisque/audit-cycle.model';
import { getEntities as getAuditCycles } from 'app/entities/microrisque/audit-cycle/audit-cycle.reducer';
import { getEntity, updateEntity, createEntity, reset } from './audit.reducer';
import { IAudit } from 'app/shared/model/microrisque/audit.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditUpdate = (props: IAuditUpdateProps) => {
  const [cycleId, setCycleId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditEntity, auditCycles, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAuditCycles();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.startDate = convertDateTimeToServer(values.startDate);
    values.endDate = convertDateTimeToServer(values.endDate);
    values.executedAt = convertDateTimeToServer(values.executedAt);

    if (errors.length === 0) {
      const entity = {
        ...auditEntity,
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
          <h2 id="microgatewayApp.microrisqueAudit.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAudit.home.createOrEditLabel">Create or edit a Audit</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="audit-title">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.title">Title</Translate>
                </Label>
                <AvField id="audit-title" type="text" name="title" />
              </AvGroup>
              <AvGroup>
                <Label id="startDateLabel" for="audit-startDate">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.startDate">Start Date</Translate>
                </Label>
                <AvInput
                  id="audit-startDate"
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEntity.startDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endDateLabel" for="audit-endDate">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.endDate">End Date</Translate>
                </Label>
                <AvInput
                  id="audit-endDate"
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEntity.endDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="executedAtLabel" for="audit-executedAt">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.executedAt">Executed At</Translate>
                </Label>
                <AvInput
                  id="audit-executedAt"
                  type="datetime-local"
                  className="form-control"
                  name="executedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEntity.executedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="audit-processId">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processId">Process Id</Translate>
                </Label>
                <AvField id="audit-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="processNameLabel" for="audit-processName">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processName">Process Name</Translate>
                </Label>
                <AvField id="audit-processName" type="text" name="processName" />
              </AvGroup>
              <AvGroup>
                <Label id="processCategoryIdLabel" for="audit-processCategoryId">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryId">Process Category Id</Translate>
                </Label>
                <AvField id="audit-processCategoryId" type="string" className="form-control" name="processCategoryId" />
              </AvGroup>
              <AvGroup>
                <Label id="processCategoryNameLabel" for="audit-processCategoryName">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryName">Process Category Name</Translate>
                </Label>
                <AvField id="audit-processCategoryName" type="text" name="processCategoryName" />
              </AvGroup>
              <AvGroup>
                <Label id="riskLevelLabel" for="audit-riskLevel">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskLevel">Risk Level</Translate>
                </Label>
                <AvInput
                  id="audit-riskLevel"
                  type="select"
                  className="form-control"
                  name="riskLevel"
                  value={(!isNew && auditEntity.riskLevel) || 'MINOR'}
                >
                  <option value="MINOR">{translate('microgatewayApp.AuditRiskLevel.MINOR')}</option>
                  <option value="MEDIUM">{translate('microgatewayApp.AuditRiskLevel.MEDIUM')}</option>
                  <option value="MAJOR">{translate('microgatewayApp.AuditRiskLevel.MAJOR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="audit-type">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.type">Type</Translate>
                </Label>
                <AvInput
                  id="audit-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && auditEntity.type) || 'INTERNAL'}
                >
                  <option value="INTERNAL">{translate('microgatewayApp.AuditType.INTERNAL')}</option>
                  <option value="PERMANENT">{translate('microgatewayApp.AuditType.PERMANENT')}</option>
                  <option value="QUALITY">{translate('microgatewayApp.AuditType.QUALITY')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="audit-status">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.status">Status</Translate>
                </Label>
                <AvInput
                  id="audit-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && auditEntity.status) || 'INITIAL'}
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
                <Label id="riskIdLabel" for="audit-riskId">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskId">Risk Id</Translate>
                </Label>
                <AvField id="audit-riskId" type="string" className="form-control" name="riskId" />
              </AvGroup>
              <AvGroup>
                <Label id="riskNameLabel" for="audit-riskName">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskName">Risk Name</Translate>
                </Label>
                <AvField id="audit-riskName" type="text" name="riskName" />
              </AvGroup>
              <AvGroup>
                <Label for="audit-cycle">
                  <Translate contentKey="microgatewayApp.microrisqueAudit.cycle">Cycle</Translate>
                </Label>
                <AvInput id="audit-cycle" type="select" className="form-control" name="cycle.id">
                  <option value="" key="0" />
                  {auditCycles
                    ? auditCycles.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit" replace color="info">
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
  auditCycles: storeState.auditCycle.entities,
  auditEntity: storeState.audit.entity,
  loading: storeState.audit.loading,
  updating: storeState.audit.updating,
  updateSuccess: storeState.audit.updateSuccess,
});

const mapDispatchToProps = {
  getAuditCycles,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditUpdate);
