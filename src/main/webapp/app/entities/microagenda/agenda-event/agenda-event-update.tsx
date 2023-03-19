import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, setFileData } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getAgendaEvents } from 'app/entities/microagenda/agenda-event/agenda-event.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './agenda-event.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

export interface IAgendaEventUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AgendaEventUpdate = (props: IAgendaEventUpdateProps) => {
  const [parentId, setParentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { agendaEventEntity, agendaEvents, loading, updating } = props;

  const { description } = agendaEventEntity;

  const handleClose = () => {
    props.history.push('/agenda-event' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAgendaEvents();
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
    values.startAt = convertDateTimeToServer(values.startAt);
    values.endAt = convertDateTimeToServer(values.endAt);
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.nextReminderAt = convertDateTimeToServer(values.nextReminderAt);
    values.nextOccurenceStartAt = convertDateTimeToServer(values.nextOccurenceStartAt);
    values.nextOccurenceEndAt = convertDateTimeToServer(values.nextOccurenceEndAt);

    if (errors.length === 0) {
      const entity = {
        ...agendaEventEntity,
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
          <h2 id="microgatewayApp.microagendaAgendaEvent.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microagendaAgendaEvent.home.createOrEditLabel">Create or edit a AgendaEvent</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : agendaEventEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="agenda-event-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="agenda-event-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="agenda-event-title">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.title">Title</Translate>
                </Label>
                <AvField
                  id="agenda-event-title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="agenda-event-description">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.description">Description</Translate>
                </Label>
                <AvInput id="agenda-event-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="locationLabel" for="agenda-event-location">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.location">Location</Translate>
                </Label>
                <AvField id="agenda-event-location" type="text" name="location" />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="agenda-event-startAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endAtLabel" for="agenda-event-endAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.endAt">End At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-endAt"
                  type="datetime-local"
                  className="form-control"
                  name="endAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.endAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="timeZoneLabel" for="agenda-event-timeZone">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.timeZone">Time Zone</Translate>
                </Label>
                <AvField id="agenda-event-timeZone" type="text" name="timeZone" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="agenda-event-editorId">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorId">Editor Id</Translate>
                </Label>
                <AvField
                  id="agenda-event-editorId"
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
                <Label id="editorNameLabel" for="agenda-event-editorName">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorName">Editor Name</Translate>
                </Label>
                <AvField id="agenda-event-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="agenda-event-createdAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="recurrenceLabel" for="agenda-event-recurrence">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.recurrence">Recurrence</Translate>
                </Label>
                <AvInput
                  id="agenda-event-recurrence"
                  type="select"
                  className="form-control"
                  name="recurrence"
                  value={(!isNew && agendaEventEntity.recurrence) || 'ONCE'}
                >
                  <option value="ONCE">{translate('microgatewayApp.EventRecurrence.ONCE')}</option>
                  <option value="ALLAWAYS">{translate('microgatewayApp.EventRecurrence.ALLAWAYS')}</option>
                  <option value="WEEK">{translate('microgatewayApp.EventRecurrence.WEEK')}</option>
                  <option value="EVERY_WEEK_ON_DAY">{translate('microgatewayApp.EventRecurrence.EVERY_WEEK_ON_DAY')}</option>
                  <option value="EVERY_YEAR_ON_DATE">{translate('microgatewayApp.EventRecurrence.EVERY_YEAR_ON_DATE')}</option>
                  <option value="EVERY_MONTH_OF_DAY_POSITION">
                    {translate('microgatewayApp.EventRecurrence.EVERY_MONTH_OF_DAY_POSITION')}
                  </option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="reminderValueLabel" for="agenda-event-reminderValue">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderValue">Reminder Value</Translate>
                </Label>
                <AvField id="agenda-event-reminderValue" type="string" className="form-control" name="reminderValue" />
              </AvGroup>
              <AvGroup>
                <Label id="reminderUnityLabel" for="agenda-event-reminderUnity">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderUnity">Reminder Unity</Translate>
                </Label>
                <AvInput
                  id="agenda-event-reminderUnity"
                  type="select"
                  className="form-control"
                  name="reminderUnity"
                  value={(!isNew && agendaEventEntity.reminderUnity) || 'SECOND'}
                >
                  <option value="SECOND">{translate('microgatewayApp.EventReminderUnity.SECOND')}</option>
                  <option value="MINUTE">{translate('microgatewayApp.EventReminderUnity.MINUTE')}</option>
                  <option value="HOUR">{translate('microgatewayApp.EventReminderUnity.HOUR')}</option>
                  <option value="DAY">{translate('microgatewayApp.EventReminderUnity.DAY')}</option>
                  <option value="WEEK">{translate('microgatewayApp.EventReminderUnity.WEEK')}</option>
                  <option value="MONTH">{translate('microgatewayApp.EventReminderUnity.MONTH')}</option>
                  <option value="YEAR">{translate('microgatewayApp.EventReminderUnity.YEAR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="editorEmailLabel" for="agenda-event-editorEmail">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorEmail">Editor Email</Translate>
                </Label>
                <AvField
                  id="agenda-event-editorEmail"
                  type="text"
                  name="editorEmail"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="agenda-event-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="nextReminderAtLabel" for="agenda-event-nextReminderAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextReminderAt">Next Reminder At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-nextReminderAt"
                  type="datetime-local"
                  className="form-control"
                  name="nextReminderAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.nextReminderAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nextOccurenceStartAtLabel" for="agenda-event-nextOccurenceStartAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceStartAt">Next Occurence Start At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-nextOccurenceStartAt"
                  type="datetime-local"
                  className="form-control"
                  name="nextOccurenceStartAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.nextOccurenceStartAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nextOccurenceEndAtLabel" for="agenda-event-nextOccurenceEndAt">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceEndAt">Next Occurence End At</Translate>
                </Label>
                <AvInput
                  id="agenda-event-nextOccurenceEndAt"
                  type="datetime-local"
                  className="form-control"
                  name="nextOccurenceEndAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.agendaEventEntity.nextOccurenceEndAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="langKeyLabel" for="agenda-event-langKey">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.langKey">Lang Key</Translate>
                </Label>
                <AvField
                  id="agenda-event-langKey"
                  type="text"
                  name="langKey"
                  validate={{
                    maxLength: { value: 20, errorMessage: translate('entity.validation.maxlength', { max: 20 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startHourLabel" for="agenda-event-startHour">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startHour">Start Hour</Translate>
                </Label>
                <AvField id="agenda-event-startHour" type="string" className="form-control" name="startHour" />
              </AvGroup>
              <AvGroup>
                <Label id="dayOfWeekLabel" for="agenda-event-dayOfWeek">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dayOfWeek">Day Of Week</Translate>
                </Label>
                <AvField id="agenda-event-dayOfWeek" type="string" className="form-control" name="dayOfWeek" />
              </AvGroup>
              <AvGroup>
                <Label id="monthLabel" for="agenda-event-month">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.month">Month</Translate>
                </Label>
                <AvField id="agenda-event-month" type="string" className="form-control" name="month" />
              </AvGroup>
              <AvGroup>
                <Label id="dateOfMonthLabel" for="agenda-event-dateOfMonth">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dateOfMonth">Date Of Month</Translate>
                </Label>
                <AvField id="agenda-event-dateOfMonth" type="string" className="form-control" name="dateOfMonth" />
              </AvGroup>
              <AvGroup>
                <Label id="startYearLabel" for="agenda-event-startYear">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startYear">Start Year</Translate>
                </Label>
                <AvField id="agenda-event-startYear" type="string" className="form-control" name="startYear" />
              </AvGroup>
              <AvGroup>
                <Label for="agenda-event-parent">
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.parent">Parent</Translate>
                </Label>
                <AvInput id="agenda-event-parent" type="select" className="form-control" name="parent.id">
                  <option value="" key="0" />
                  {agendaEvents
                    ? agendaEvents.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/agenda-event" replace color="info">
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
  agendaEvents: storeState.agendaEvent.entities,
  agendaEventEntity: storeState.agendaEvent.entity,
  loading: storeState.agendaEvent.loading,
  updating: storeState.agendaEvent.updating,
  updateSuccess: storeState.agendaEvent.updateSuccess,
});

const mapDispatchToProps = {
  getAgendaEvents,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AgendaEventUpdate);
