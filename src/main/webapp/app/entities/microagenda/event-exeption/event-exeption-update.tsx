import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './event-exeption.reducer';
import { IEventExeption } from 'app/shared/model/microagenda/event-exeption.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEventExeptionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventExeptionUpdate = (props: IEventExeptionUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { eventExeptionEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/event-exeption' + props.location.search);
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
        ...eventExeptionEntity,
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
          <h2 id="microgatewayApp.microagendaEventExeption.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microagendaEventExeption.home.createOrEditLabel">
              Create or edit a EventExeption
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : eventExeptionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="event-exeption-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="event-exeption-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="eventIdLabel" for="event-exeption-eventId">
                  <Translate contentKey="microgatewayApp.microagendaEventExeption.eventId">Event Id</Translate>
                </Label>
                <AvField
                  id="event-exeption-eventId"
                  type="string"
                  className="form-control"
                  name="eventId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="hourLabel" for="event-exeption-hour">
                  <Translate contentKey="microgatewayApp.microagendaEventExeption.hour">Hour</Translate>
                </Label>
                <AvField
                  id="event-exeption-hour"
                  type="string"
                  className="form-control"
                  name="hour"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="monthLabel" for="event-exeption-month">
                  <Translate contentKey="microgatewayApp.microagendaEventExeption.month">Month</Translate>
                </Label>
                <AvField
                  id="event-exeption-month"
                  type="string"
                  className="form-control"
                  name="month"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="yearLabel" for="event-exeption-year">
                  <Translate contentKey="microgatewayApp.microagendaEventExeption.year">Year</Translate>
                </Label>
                <AvField
                  id="event-exeption-year"
                  type="string"
                  className="form-control"
                  name="year"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="dateOfMonthLabel" for="event-exeption-dateOfMonth">
                  <Translate contentKey="microgatewayApp.microagendaEventExeption.dateOfMonth">Date Of Month</Translate>
                </Label>
                <AvField
                  id="event-exeption-dateOfMonth"
                  type="string"
                  className="form-control"
                  name="dateOfMonth"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/event-exeption" replace color="info">
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
  eventExeptionEntity: storeState.eventExeption.entity,
  loading: storeState.eventExeption.loading,
  updating: storeState.eventExeption.updating,
  updateSuccess: storeState.eventExeption.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventExeptionUpdate);
