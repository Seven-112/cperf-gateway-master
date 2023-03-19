import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task.reducer';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskDetail = (props: IProjectTaskDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTask.detail.title">ProjectTask</Translate> [
          <b>{projectTaskEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.description">Description</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.description}</dd>
          <dt>
            <span id="nbMinuites">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMinuites">Nb Minuites</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbMinuites}</dd>
          <dt>
            <span id="nbHours">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbHours">Nb Hours</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbHours}</dd>
          <dt>
            <span id="nbDays">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbDays">Nb Days</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbDays}</dd>
          <dt>
            <span id="nbMonths">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMonths">Nb Months</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbMonths}</dd>
          <dt>
            <span id="nbYears">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbYears">Nb Years</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbYears}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskEntity.startAt ? <TextFormat value={projectTaskEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.status">Status</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.status}</dd>
          <dt>
            <span id="priorityLevel">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.priorityLevel">Priority Level</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.priorityLevel}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.type">Type</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.type}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="finishAt">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.finishAt">Finish At</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskEntity.finishAt ? <TextFormat value={projectTaskEntity.finishAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="startWithProcess">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.startWithProcess">Start With Process</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.startWithProcess ? 'true' : 'false'}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.processId}</dd>
          <dt>
            <span id="parentId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.parentId">Parent Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.parentId}</dd>
          <dt>
            <span id="taskModelId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.taskModelId">Task Model Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.taskModelId}</dd>
          <dt>
            <span id="pauseAt">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.pauseAt">Pause At</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskEntity.pauseAt ? <TextFormat value={projectTaskEntity.pauseAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="nbPause">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.nbPause">Nb Pause</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.nbPause}</dd>
          <dt>
            <span id="logigramPosX">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosX">Logigram Pos X</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.logigramPosX}</dd>
          <dt>
            <span id="logigramPosY">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosY">Logigram Pos Y</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.logigramPosY}</dd>
          <dt>
            <span id="groupId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.groupId">Group Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.groupId}</dd>
          <dt>
            <span id="riskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.riskId">Risk Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.riskId}</dd>
          <dt>
            <span id="manualMode">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.manualMode">Manual Mode</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.manualMode ? 'true' : 'false'}</dd>
          <dt>
            <span id="sheduledStartAt">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartAt">Sheduled Start At</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskEntity.sheduledStartAt ? (
              <TextFormat value={projectTaskEntity.sheduledStartAt} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="sheduledStartHour">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartHour">Sheduled Start Hour</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.sheduledStartHour}</dd>
          <dt>
            <span id="sheduledStartMinute">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartMinute">Sheduled Start Minute</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.sheduledStartMinute}</dd>
          <dt>
            <span id="startupTaskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.startupTaskId">Startup Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.startupTaskId}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.ponderation}</dd>
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprojectProjectTask.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{projectTaskEntity.checked ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/project-task" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task/${projectTaskEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTask }: IRootState) => ({
  projectTaskEntity: projectTask.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskDetail);
