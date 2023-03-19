import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAgendaEvent } from 'app/shared/model/microagenda/agenda-event.model';
import { getEntities as getAgendaEvents } from 'app/entities/microagenda/agenda-event/agenda-event.reducer';
import { getEntity, updateEntity, createEntity, reset } from './event-participant.reducer';
import { IEventParticipant } from 'app/shared/model/microagenda/event-participant.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEventParticipantUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventParticipantUpdate = (props: IEventParticipantUpdateProps) => {
  const [eventId, setEventId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { eventParticipantEntity, agendaEvents, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/event-participant' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAgendaEvents();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...eventParticipantEntity,
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
          <h2 id="microgatewayApp.microagendaEventParticipant.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microagendaEventParticipant.home.createOrEditLabel">
              Create or edit a EventParticipant
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : eventParticipantEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="event-participant-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="event-participant-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="participantIdLabel" for="event-participant-participantId">
                  <Translate contentKey="microgatewayApp.microagendaEventParticipant.participantId">Participant Id</Translate>
                </Label>
                <AvField id="event-participant-participantId" type="string" className="form-control" name="participantId" />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="event-participant-name">
                  <Translate contentKey="microgatewayApp.microagendaEventParticipant.name">Name</Translate>
                </Label>
                <AvField id="event-participant-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="event-participant-email">
                  <Translate contentKey="microgatewayApp.microagendaEventParticipant.email">Email</Translate>
                </Label>
                <AvField
                  id="event-participant-email"
                  type="text"
                  name="email"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 100, errorMessage: translate('entity.validation.minlength', { min: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="event-participant-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.microagendaEventParticipant.required">Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="event-participant-event">
                  <Translate contentKey="microgatewayApp.microagendaEventParticipant.event">Event</Translate>
                </Label>
                <AvInput
                  id="event-participant-event"
                  type="select"
                  className="form-control"
                  name="event.id"
                  value={isNew ? agendaEvents[0] && agendaEvents[0].id : eventParticipantEntity.event?.id}
                  required
                >
                  {agendaEvents
                    ? agendaEvents.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/event-participant" replace color="info">
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
  eventParticipantEntity: storeState.eventParticipant.entity,
  loading: storeState.eventParticipant.loading,
  updating: storeState.eventParticipant.updating,
  updateSuccess: storeState.eventParticipant.updateSuccess,
});

const mapDispatchToProps = {
  getAgendaEvents,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventParticipantUpdate);
