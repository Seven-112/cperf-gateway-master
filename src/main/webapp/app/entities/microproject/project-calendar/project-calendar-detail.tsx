import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-calendar.reducer';
import { IProjectCalendar } from 'app/shared/model/microproject/project-calendar.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectCalendarDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCalendarDetail = (props: IProjectCalendarDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectCalendarEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectCalendar.detail.title">ProjectCalendar</Translate> [
          <b>{projectCalendarEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dayNumber">
              <Translate contentKey="microgatewayApp.microprojectProjectCalendar.dayNumber">Day Number</Translate>
            </span>
          </dt>
          <dd>{projectCalendarEntity.dayNumber}</dd>
          <dt>
            <span id="startTime">
              <Translate contentKey="microgatewayApp.microprojectProjectCalendar.startTime">Start Time</Translate>
            </span>
          </dt>
          <dd>
            {projectCalendarEntity.startTime ? (
              <TextFormat value={projectCalendarEntity.startTime} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="endTime">
              <Translate contentKey="microgatewayApp.microprojectProjectCalendar.endTime">End Time</Translate>
            </span>
          </dt>
          <dd>
            {projectCalendarEntity.endTime ? (
              <TextFormat value={projectCalendarEntity.endTime} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="projectId">
              <Translate contentKey="microgatewayApp.microprojectProjectCalendar.projectId">Project Id</Translate>
            </span>
          </dt>
          <dd>{projectCalendarEntity.projectId}</dd>
        </dl>
        <Button tag={Link} to="/project-calendar" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-calendar/${projectCalendarEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectCalendar }: IRootState) => ({
  projectCalendarEntity: projectCalendar.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCalendarDetail);
