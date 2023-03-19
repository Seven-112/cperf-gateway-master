import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './event-participant.reducer';
import { IEventParticipant } from 'app/shared/model/microagenda/event-participant.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEventParticipantDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventParticipantDetail = (props: IEventParticipantDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { eventParticipantEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microagendaEventParticipant.detail.title">EventParticipant</Translate> [
          <b>{eventParticipantEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="participantId">
              <Translate contentKey="microgatewayApp.microagendaEventParticipant.participantId">Participant Id</Translate>
            </span>
          </dt>
          <dd>{eventParticipantEntity.participantId}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microagendaEventParticipant.name">Name</Translate>
            </span>
          </dt>
          <dd>{eventParticipantEntity.name}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="microgatewayApp.microagendaEventParticipant.email">Email</Translate>
            </span>
          </dt>
          <dd>{eventParticipantEntity.email}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.microagendaEventParticipant.required">Required</Translate>
            </span>
          </dt>
          <dd>{eventParticipantEntity.required ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microagendaEventParticipant.event">Event</Translate>
          </dt>
          <dd>{eventParticipantEntity.event ? eventParticipantEntity.event.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/event-participant" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-participant/${eventParticipantEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ eventParticipant }: IRootState) => ({
  eventParticipantEntity: eventParticipant.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventParticipantDetail);
