import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './event-trigger.reducer';
import { IEventTrigger } from 'app/shared/model/microprocess/event-trigger.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEventTriggerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventTriggerDetail = (props: IEventTriggerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { eventTriggerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessEventTrigger.detail.title">EventTrigger</Translate> [
          <b>{eventTriggerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.editorId}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {eventTriggerEntity.createdAt ? (
              <TextFormat value={eventTriggerEntity.createdAt} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.name">Name</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.name}</dd>
          <dt>
            <span id="recurrence">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.recurrence">Recurrence</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.recurrence}</dd>
          <dt>
            <span id="disabled">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.disabled">Disabled</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.disabled ? 'true' : 'false'}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.editorName}</dd>
          <dt>
            <span id="firstStartedAt">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.firstStartedAt">First Started At</Translate>
            </span>
          </dt>
          <dd>
            {eventTriggerEntity.firstStartedAt ? (
              <TextFormat value={eventTriggerEntity.firstStartedAt} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="nextStartAt">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.nextStartAt">Next Start At</Translate>
            </span>
          </dt>
          <dd>
            {eventTriggerEntity.nextStartAt ? (
              <TextFormat value={eventTriggerEntity.nextStartAt} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="startCount">
              <Translate contentKey="microgatewayApp.microprocessEventTrigger.startCount">Start Count</Translate>
            </span>
          </dt>
          <dd>{eventTriggerEntity.startCount}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessEventTrigger.process">Process</Translate>
          </dt>
          <dd>{eventTriggerEntity.process ? eventTriggerEntity.process.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/event-trigger" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-trigger/${eventTriggerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ eventTrigger }: IRootState) => ({
  eventTriggerEntity: eventTrigger.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventTriggerDetail);
