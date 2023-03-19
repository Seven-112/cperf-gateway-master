import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task.reducer';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskDetail = (props: ITaskDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTask.detail.title">Task</Translate> [<b>{taskEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprocessTask.name">Name</Translate>
            </span>
          </dt>
          <dd>{taskEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprocessTask.description">Description</Translate>
            </span>
          </dt>
          <dd>{taskEntity.description}</dd>
          <dt>
            <span id="nbMinuites">
              <Translate contentKey="microgatewayApp.microprocessTask.nbMinuites">Nb Minuites</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbMinuites}</dd>
          <dt>
            <span id="nbHours">
              <Translate contentKey="microgatewayApp.microprocessTask.nbHours">Nb Hours</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbHours}</dd>
          <dt>
            <span id="nbDays">
              <Translate contentKey="microgatewayApp.microprocessTask.nbDays">Nb Days</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbDays}</dd>
          <dt>
            <span id="nbMonths">
              <Translate contentKey="microgatewayApp.microprocessTask.nbMonths">Nb Months</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbMonths}</dd>
          <dt>
            <span id="nbYears">
              <Translate contentKey="microgatewayApp.microprocessTask.nbYears">Nb Years</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbYears}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.microprocessTask.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>{taskEntity.startAt ? <TextFormat value={taskEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microprocessTask.status">Status</Translate>
            </span>
          </dt>
          <dd>{taskEntity.status}</dd>
          <dt>
            <span id="priorityLevel">
              <Translate contentKey="microgatewayApp.microprocessTask.priorityLevel">Priority Level</Translate>
            </span>
          </dt>
          <dd>{taskEntity.priorityLevel}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.microprocessTask.type">Type</Translate>
            </span>
          </dt>
          <dd>{taskEntity.type}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprocessTask.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{taskEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="finishAt">
              <Translate contentKey="microgatewayApp.microprocessTask.finishAt">Finish At</Translate>
            </span>
          </dt>
          <dd>{taskEntity.finishAt ? <TextFormat value={taskEntity.finishAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="startWithProcess">
              <Translate contentKey="microgatewayApp.microprocessTask.startWithProcess">Start With Process</Translate>
            </span>
          </dt>
          <dd>{taskEntity.startWithProcess ? 'true' : 'false'}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprocessTask.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.processId}</dd>
          <dt>
            <span id="parentId">
              <Translate contentKey="microgatewayApp.microprocessTask.parentId">Parent Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.parentId}</dd>
          <dt>
            <span id="taskModelId">
              <Translate contentKey="microgatewayApp.microprocessTask.taskModelId">Task Model Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.taskModelId}</dd>
          <dt>
            <span id="pauseAt">
              <Translate contentKey="microgatewayApp.microprocessTask.pauseAt">Pause At</Translate>
            </span>
          </dt>
          <dd>{taskEntity.pauseAt ? <TextFormat value={taskEntity.pauseAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="nbPause">
              <Translate contentKey="microgatewayApp.microprocessTask.nbPause">Nb Pause</Translate>
            </span>
          </dt>
          <dd>{taskEntity.nbPause}</dd>
          <dt>
            <span id="logigramPosX">
              <Translate contentKey="microgatewayApp.microprocessTask.logigramPosX">Logigram Pos X</Translate>
            </span>
          </dt>
          <dd>{taskEntity.logigramPosX}</dd>
          <dt>
            <span id="logigramPosY">
              <Translate contentKey="microgatewayApp.microprocessTask.logigramPosY">Logigram Pos Y</Translate>
            </span>
          </dt>
          <dd>{taskEntity.logigramPosY}</dd>
          <dt>
            <span id="groupId">
              <Translate contentKey="microgatewayApp.microprocessTask.groupId">Group Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.groupId}</dd>
          <dt>
            <span id="riskId">
              <Translate contentKey="microgatewayApp.microprocessTask.riskId">Risk Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.riskId}</dd>
          <dt>
            <span id="manualMode">
              <Translate contentKey="microgatewayApp.microprocessTask.manualMode">Manual Mode</Translate>
            </span>
          </dt>
          <dd>{taskEntity.manualMode ? 'true' : 'false'}</dd>
          <dt>
            <span id="sheduledStartAt">
              <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartAt">Sheduled Start At</Translate>
            </span>
          </dt>
          <dd>
            {taskEntity.sheduledStartAt ? (
              <TextFormat value={taskEntity.sheduledStartAt} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="sheduledStartHour">
              <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartHour">Sheduled Start Hour</Translate>
            </span>
          </dt>
          <dd>{taskEntity.sheduledStartHour}</dd>
          <dt>
            <span id="sheduledStartMinute">
              <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartMinute">Sheduled Start Minute</Translate>
            </span>
          </dt>
          <dd>{taskEntity.sheduledStartMinute}</dd>
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprocessTask.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{taskEntity.checked ? 'true' : 'false'}</dd>
          <dt>
            <span id="currentPauseHistoryId">
              <Translate contentKey="microgatewayApp.microprocessTask.currentPauseHistoryId">Current Pause History Id</Translate>
            </span>
          </dt>
          <dd>{taskEntity.currentPauseHistoryId}</dd>
          <dt>
            <span id="exceceed">
              <Translate contentKey="microgatewayApp.microprocessTask.exceceed">Exceceed</Translate>
            </span>
          </dt>
          <dd>{taskEntity.exceceed ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessTask.startupTask">Startup Task</Translate>
          </dt>
          <dd>{taskEntity.startupTask ? taskEntity.startupTask.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/task" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task/${taskEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ task }: IRootState) => ({
  taskEntity: task.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
