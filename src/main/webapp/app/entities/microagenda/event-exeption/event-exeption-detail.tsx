import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './event-exeption.reducer';
import { IEventExeption } from 'app/shared/model/microagenda/event-exeption.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEventExeptionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventExeptionDetail = (props: IEventExeptionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { eventExeptionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microagendaEventExeption.detail.title">EventExeption</Translate> [
          <b>{eventExeptionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="eventId">
              <Translate contentKey="microgatewayApp.microagendaEventExeption.eventId">Event Id</Translate>
            </span>
          </dt>
          <dd>{eventExeptionEntity.eventId}</dd>
          <dt>
            <span id="hour">
              <Translate contentKey="microgatewayApp.microagendaEventExeption.hour">Hour</Translate>
            </span>
          </dt>
          <dd>{eventExeptionEntity.hour}</dd>
          <dt>
            <span id="month">
              <Translate contentKey="microgatewayApp.microagendaEventExeption.month">Month</Translate>
            </span>
          </dt>
          <dd>{eventExeptionEntity.month}</dd>
          <dt>
            <span id="year">
              <Translate contentKey="microgatewayApp.microagendaEventExeption.year">Year</Translate>
            </span>
          </dt>
          <dd>{eventExeptionEntity.year}</dd>
          <dt>
            <span id="dateOfMonth">
              <Translate contentKey="microgatewayApp.microagendaEventExeption.dateOfMonth">Date Of Month</Translate>
            </span>
          </dt>
          <dd>{eventExeptionEntity.dateOfMonth}</dd>
        </dl>
        <Button tag={Link} to="/event-exeption" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-exeption/${eventExeptionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ eventExeption }: IRootState) => ({
  eventExeptionEntity: eventExeption.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventExeptionDetail);
