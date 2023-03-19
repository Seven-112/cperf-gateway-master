import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAudit } from 'app/shared/model/microrisque/audit.model';
import { getEntities as getAudits } from 'app/entities/microrisque/audit/audit.reducer';
import { getEntity, updateEntity, createEntity, reset } from './audit-event-trigger.reducer';
import { IAuditEventTrigger } from 'app/shared/model/microrisque/audit-event-trigger.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditEventTriggerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditEventTriggerUpdate = (props: IAuditEventTriggerUpdateProps) => {
  const [auditId, setAuditId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditEventTriggerEntity, audits, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit-event-trigger' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAudits();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.firstStartedAt = convertDateTimeToServer(values.firstStartedAt);
    values.nextStartAt = convertDateTimeToServer(values.nextStartAt);

    if (errors.length === 0) {
      const entity = {
        ...auditEventTriggerEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditEventTrigger.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.home.createOrEditLabel">
              Create or edit a AuditEventTrigger
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditEventTriggerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-event-trigger-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-event-trigger-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="editorIdLabel" for="audit-event-trigger-editorId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.editorId">Editor Id</Translate>
                </Label>
                <AvField
                  id="audit-event-trigger-editorId"
                  type="string"
                  className="form-control"
                  name="editorId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="audit-event-trigger-createdAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="audit-event-trigger-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEventTriggerEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="audit-event-trigger-name">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.name">Name</Translate>
                </Label>
                <AvField id="audit-event-trigger-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="recurrenceLabel" for="audit-event-trigger-recurrence">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.recurrence">Recurrence</Translate>
                </Label>
                <AvInput
                  id="audit-event-trigger-recurrence"
                  type="select"
                  className="form-control"
                  name="recurrence"
                  value={(!isNew && auditEventTriggerEntity.recurrence) || 'ONCE'}
                >
                  <option value="ONCE">{translate('microgatewayApp.AuditEventRecurrence.ONCE')}</option>
                  <option value="ALLAWAYS">{translate('microgatewayApp.AuditEventRecurrence.ALLAWAYS')}</option>
                  <option value="WEEK">{translate('microgatewayApp.AuditEventRecurrence.WEEK')}</option>
                  <option value="EVERY_WEEK_ON_DAY">{translate('microgatewayApp.AuditEventRecurrence.EVERY_WEEK_ON_DAY')}</option>
                  <option value="EVERY_YEAR_ON_DATE">{translate('microgatewayApp.AuditEventRecurrence.EVERY_YEAR_ON_DATE')}</option>
                  <option value="EVERY_MONTH_OF_DAY_POSITION">
                    {translate('microgatewayApp.AuditEventRecurrence.EVERY_MONTH_OF_DAY_POSITION')}
                  </option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="disabledLabel">
                  <AvInput id="audit-event-trigger-disabled" type="checkbox" className="form-check-input" name="disabled" />
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.disabled">Disabled</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="editorNameLabel" for="audit-event-trigger-editorName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.editorName">Editor Name</Translate>
                </Label>
                <AvField id="audit-event-trigger-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup>
                <Label id="firstStartedAtLabel" for="audit-event-trigger-firstStartedAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.firstStartedAt">First Started At</Translate>
                </Label>
                <AvInput
                  id="audit-event-trigger-firstStartedAt"
                  type="datetime-local"
                  className="form-control"
                  name="firstStartedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEventTriggerEntity.firstStartedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nextStartAtLabel" for="audit-event-trigger-nextStartAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.nextStartAt">Next Start At</Translate>
                </Label>
                <AvInput
                  id="audit-event-trigger-nextStartAt"
                  type="datetime-local"
                  className="form-control"
                  name="nextStartAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditEventTriggerEntity.nextStartAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startCountLabel" for="audit-event-trigger-startCount">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.startCount">Start Count</Translate>
                </Label>
                <AvField id="audit-event-trigger-startCount" type="string" className="form-control" name="startCount" />
              </AvGroup>
              <AvGroup>
                <Label for="audit-event-trigger-audit">
                  <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.audit">Audit</Translate>
                </Label>
                <AvInput id="audit-event-trigger-audit" type="select" className="form-control" name="audit.id">
                  <option value="" key="0" />
                  {audits
                    ? audits.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-event-trigger" replace color="info">
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
  audits: storeState.audit.entities,
  auditEventTriggerEntity: storeState.auditEventTrigger.entity,
  loading: storeState.auditEventTrigger.loading,
  updating: storeState.auditEventTrigger.updating,
  updateSuccess: storeState.auditEventTrigger.updateSuccess,
});

const mapDispatchToProps = {
  getAudits,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditEventTriggerUpdate);
