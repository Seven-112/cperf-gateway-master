import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcess } from 'app/shared/model/microprocess/process.model';
import { getEntities as getProcesses } from 'app/entities/microprocess/process/process.reducer';
import { getEntity, updateEntity, createEntity, reset } from './event-trigger.reducer';
import { IEventTrigger } from 'app/shared/model/microprocess/event-trigger.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEventTriggerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventTriggerUpdate = (props: IEventTriggerUpdateProps) => {
  const [processId, setProcessId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { eventTriggerEntity, processes, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/event-trigger' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcesses();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...eventTriggerEntity,
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
          <h2 id="microgatewayApp.microprocessEventTrigger.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessEventTrigger.home.createOrEditLabel">
              Create or edit a EventTrigger
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : eventTriggerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="event-trigger-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="event-trigger-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="editorIdLabel" for="event-trigger-editorId">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.editorId">Editor Id</Translate>
                </Label>
                <AvField
                  id="event-trigger-editorId"
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
                <Label id="createdAtLabel" for="event-trigger-createdAt">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.createdAt">Created At</Translate>
                </Label>
                <AvField id="event-trigger-createdAt" type="date" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="event-trigger-name">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.name">Name</Translate>
                </Label>
                <AvField id="event-trigger-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="recurrenceLabel" for="event-trigger-recurrence">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.recurrence">Recurrence</Translate>
                </Label>
                <AvInput
                  id="event-trigger-recurrence"
                  type="select"
                  className="form-control"
                  name="recurrence"
                  value={(!isNew && eventTriggerEntity.recurrence) || 'ONCE'}
                >
                  <option value="ONCE">{translate('microgatewayApp.ProcessEventRecurrence.ONCE')}</option>
                  <option value="ALLAWAYS">{translate('microgatewayApp.ProcessEventRecurrence.ALLAWAYS')}</option>
                  <option value="WEEK">{translate('microgatewayApp.ProcessEventRecurrence.WEEK')}</option>
                  <option value="EVERY_WEEK_ON_DAY">{translate('microgatewayApp.ProcessEventRecurrence.EVERY_WEEK_ON_DAY')}</option>
                  <option value="EVERY_YEAR_ON_DATE">{translate('microgatewayApp.ProcessEventRecurrence.EVERY_YEAR_ON_DATE')}</option>
                  <option value="EVERY_MONTH_OF_DAY_POSITION">
                    {translate('microgatewayApp.ProcessEventRecurrence.EVERY_MONTH_OF_DAY_POSITION')}
                  </option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="disabledLabel">
                  <AvInput id="event-trigger-disabled" type="checkbox" className="form-check-input" name="disabled" />
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.disabled">Disabled</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="editorNameLabel" for="event-trigger-editorName">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.editorName">Editor Name</Translate>
                </Label>
                <AvField id="event-trigger-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup>
                <Label id="firstStartedAtLabel" for="event-trigger-firstStartedAt">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.firstStartedAt">First Started At</Translate>
                </Label>
                <AvField id="event-trigger-firstStartedAt" type="date" className="form-control" name="firstStartedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="nextStartAtLabel" for="event-trigger-nextStartAt">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.nextStartAt">Next Start At</Translate>
                </Label>
                <AvField id="event-trigger-nextStartAt" type="date" className="form-control" name="nextStartAt" />
              </AvGroup>
              <AvGroup>
                <Label id="startCountLabel" for="event-trigger-startCount">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.startCount">Start Count</Translate>
                </Label>
                <AvField id="event-trigger-startCount" type="string" className="form-control" name="startCount" />
              </AvGroup>
              <AvGroup>
                <Label for="event-trigger-process">
                  <Translate contentKey="microgatewayApp.microprocessEventTrigger.process">Process</Translate>
                </Label>
                <AvInput id="event-trigger-process" type="select" className="form-control" name="process.id">
                  <option value="" key="0" />
                  {processes
                    ? processes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/event-trigger" replace color="info">
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
  processes: storeState.process.entities,
  eventTriggerEntity: storeState.eventTrigger.entity,
  loading: storeState.eventTrigger.loading,
  updating: storeState.eventTrigger.updating,
  updateSuccess: storeState.eventTrigger.updateSuccess,
});

const mapDispatchToProps = {
  getProcesses,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventTriggerUpdate);
