import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-item.reducer';
import { ITaskItem } from 'app/shared/model/microprocess/task-item.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskItemDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskItemDetail = (props: ITaskItemDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskItemEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskItem.detail.title">TaskItem</Translate> [<b>{taskItemEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.name">Name</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.name}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.taskId}</dd>
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.checked ? 'true' : 'false'}</dd>
          <dt>
            <span id="checkerId">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerId">Checker Id</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.checkerId}</dd>
          <dt>
            <span id="checkerName">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerName">Checker Name</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.checkerName}</dd>
          <dt>
            <span id="checkerEmail">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerEmail">Checker Email</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.checkerEmail}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.editorId}</dd>
          <dt>
            <span id="editorEmail">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.editorEmail">Editor Email</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.editorEmail}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.editorName}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.microprocessTaskItem.required">Required</Translate>
            </span>
          </dt>
          <dd>{taskItemEntity.required ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/task-item" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task-item/${taskItemEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskItem }: IRootState) => ({
  taskItemEntity: taskItem.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemDetail);
