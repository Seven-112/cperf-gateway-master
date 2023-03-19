import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './agenda-event.reducer';
import { IAgendaEvent } from 'app/shared/model/microagenda/agenda-event.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAgendaEventDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AgendaEventDetail = (props: IAgendaEventDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { agendaEventEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microagendaAgendaEvent.detail.title">AgendaEvent</Translate> [<b>{agendaEventEntity.id}</b>
          ]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.title">Title</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.description">Description</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.description}</dd>
          <dt>
            <span id="location">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.location">Location</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.location}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>
            {agendaEventEntity.startAt ? <TextFormat value={agendaEventEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.endAt">End At</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.endAt ? <TextFormat value={agendaEventEntity.endAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="timeZone">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.timeZone">Time Zone</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.timeZone}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.editorId}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.editorName}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {agendaEventEntity.createdAt ? <TextFormat value={agendaEventEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="recurrence">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.recurrence">Recurrence</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.recurrence}</dd>
          <dt>
            <span id="reminderValue">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderValue">Reminder Value</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.reminderValue}</dd>
          <dt>
            <span id="reminderUnity">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderUnity">Reminder Unity</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.reminderUnity}</dd>
          <dt>
            <span id="editorEmail">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorEmail">Editor Email</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.editorEmail}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="nextReminderAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextReminderAt">Next Reminder At</Translate>
            </span>
          </dt>
          <dd>
            {agendaEventEntity.nextReminderAt ? (
              <TextFormat value={agendaEventEntity.nextReminderAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="nextOccurenceStartAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceStartAt">Next Occurence Start At</Translate>
            </span>
          </dt>
          <dd>
            {agendaEventEntity.nextOccurenceStartAt ? (
              <TextFormat value={agendaEventEntity.nextOccurenceStartAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="nextOccurenceEndAt">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceEndAt">Next Occurence End At</Translate>
            </span>
          </dt>
          <dd>
            {agendaEventEntity.nextOccurenceEndAt ? (
              <TextFormat value={agendaEventEntity.nextOccurenceEndAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="langKey">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.langKey">Lang Key</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.langKey}</dd>
          <dt>
            <span id="startHour">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startHour">Start Hour</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.startHour}</dd>
          <dt>
            <span id="dayOfWeek">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dayOfWeek">Day Of Week</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.dayOfWeek}</dd>
          <dt>
            <span id="month">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.month">Month</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.month}</dd>
          <dt>
            <span id="dateOfMonth">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dateOfMonth">Date Of Month</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.dateOfMonth}</dd>
          <dt>
            <span id="startYear">
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startYear">Start Year</Translate>
            </span>
          </dt>
          <dd>{agendaEventEntity.startYear}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microagendaAgendaEvent.parent">Parent</Translate>
          </dt>
          <dd>{agendaEventEntity.parent ? agendaEventEntity.parent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/agenda-event" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/agenda-event/${agendaEventEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ agendaEvent }: IRootState) => ({
  agendaEventEntity: agendaEvent.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AgendaEventDetail);
