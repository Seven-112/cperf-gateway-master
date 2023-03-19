import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-status-traking.reducer';
import { IProjectTaskStatusTraking } from 'app/shared/model/microproject/project-task-status-traking.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskStatusTrakingDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskStatusTrakingDetail = (props: IProjectTaskStatusTrakingDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskStatusTrakingEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.detail.title">ProjectTaskStatusTraking</Translate> [
          <b>{projectTaskStatusTrakingEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.taskId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.status">Status</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.status}</dd>
          <dt>
            <span id="tracingAt">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.tracingAt">Tracing At</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskStatusTrakingEntity.tracingAt ? (
              <TextFormat value={projectTaskStatusTrakingEntity.tracingAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.justification}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.userId}</dd>
          <dt>
            <span id="userName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userName">User Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.userName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingEntity.userEmail}</dd>
        </dl>
        <Button tag={Link} to="/project-task-status-traking" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-status-traking/${projectTaskStatusTrakingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskStatusTraking }: IRootState) => ({
  projectTaskStatusTrakingEntity: projectTaskStatusTraking.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingDetail);
