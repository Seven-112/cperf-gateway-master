import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-startable-task.reducer';
import { IProjectStartableTask } from 'app/shared/model/microproject/project-startable-task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectStartableTaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectStartableTaskDetail = (props: IProjectStartableTaskDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectStartableTaskEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.detail.title">ProjectStartableTask</Translate> [
          <b>{projectStartableTaskEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="triggerTaskId">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskId">Trigger Task Id</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.triggerTaskId}</dd>
          <dt>
            <span id="startableTaskId">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskId">Startable Task Id</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.startableTaskId}</dd>
          <dt>
            <span id="triggerTaskName">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskName">Trigger Task Name</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.triggerTaskName}</dd>
          <dt>
            <span id="startableTaskName">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskName">Startable Task Name</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.startableTaskName}</dd>
          <dt>
            <span id="triggerProjectName">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerProjectName">Trigger Project Name</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.triggerProjectName}</dd>
          <dt>
            <span id="startableProjectName">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableProjectName">
                Startable Project Name
              </Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.startableProjectName}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.userId}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {projectStartableTaskEntity.createdAt ? (
              <TextFormat value={projectStartableTaskEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="startCond">
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startCond">Start Cond</Translate>
            </span>
          </dt>
          <dd>{projectStartableTaskEntity.startCond}</dd>
        </dl>
        <Button tag={Link} to="/project-startable-task" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-startable-task/${projectStartableTaskEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectStartableTask }: IRootState) => ({
  projectStartableTaskEntity: projectStartableTask.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectStartableTaskDetail);
