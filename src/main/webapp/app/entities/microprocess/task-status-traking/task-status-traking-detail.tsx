import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-status-traking.reducer';
import { ITaskStatusTraking } from 'app/shared/model/microprocess/task-status-traking.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskStatusTrakingDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskStatusTrakingDetail = (props: ITaskStatusTrakingDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskStatusTrakingEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.detail.title">TaskStatusTraking</Translate> [
          <b>{taskStatusTrakingEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.taskId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.status">Status</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.status}</dd>
          <dt>
            <span id="tracingAt">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.tracingAt">Tracing At</Translate>
            </span>
          </dt>
          <dd>
            {taskStatusTrakingEntity.tracingAt ? (
              <TextFormat value={taskStatusTrakingEntity.tracingAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.justification}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.userId}</dd>
          <dt>
            <span id="editable">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.editable">Editable</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.editable ? 'true' : 'false'}</dd>
          <dt>
            <span id="execeed">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.execeed">Execeed</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.execeed ? 'true' : 'false'}</dd>
          <dt>
            <span id="perfIndicator">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.perfIndicator">Perf Indicator</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingEntity.perfIndicator ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/task-status-traking" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task-status-traking/${taskStatusTrakingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskStatusTraking }: IRootState) => ({
  taskStatusTrakingEntity: taskStatusTraking.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingDetail);
