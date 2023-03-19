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
import { getEntity, updateEntity, createEntity, reset } from './event-file.reducer';
import { IEventFile } from 'app/shared/model/microagenda/event-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEventFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventFileUpdate = (props: IEventFileUpdateProps) => {
  const [eventId, setEventId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { eventFileEntity, agendaEvents, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/event-file' + props.location.search);
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
        ...eventFileEntity,
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
          <h2 id="microgatewayApp.microagendaEventFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microagendaEventFile.home.createOrEditLabel">Create or edit a EventFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : eventFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="event-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="event-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="event-file-fileId">
                  <Translate contentKey="microgatewayApp.microagendaEventFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="event-file-fileId"
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
                <Label id="fileNameLabel" for="event-file-fileName">
                  <Translate contentKey="microgatewayApp.microagendaEventFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="event-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="event-file-event">
                  <Translate contentKey="microgatewayApp.microagendaEventFile.event">Event</Translate>
                </Label>
                <AvInput
                  id="event-file-event"
                  type="select"
                  className="form-control"
                  name="event.id"
                  value={isNew ? agendaEvents[0] && agendaEvents[0].id : eventFileEntity.event?.id}
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
              <Button tag={Link} id="cancel-save" to="/event-file" replace color="info">
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
  eventFileEntity: storeState.eventFile.entity,
  loading: storeState.eventFile.loading,
  updating: storeState.eventFile.updating,
  updateSuccess: storeState.eventFile.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(EventFileUpdate);
