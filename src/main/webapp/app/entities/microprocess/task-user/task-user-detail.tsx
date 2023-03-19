import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-user.reducer';
import { ITaskUser } from 'app/shared/model/microprocess/task-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskUserDetail = (props: ITaskUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskUser.detail.title">TaskUser</Translate> [<b>{taskUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprocessTaskUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{taskUserEntity.userId}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="microgatewayApp.microprocessTaskUser.role">Role</Translate>
            </span>
          </dt>
          <dd>{taskUserEntity.role}</dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microprocessTaskUser.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{taskUserEntity.userFullName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprocessTaskUser.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{taskUserEntity.userEmail}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessTaskUser.task">Task</Translate>
          </dt>
          <dd>{taskUserEntity.task ? taskUserEntity.task.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/task-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task-user/${taskUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskUser }: IRootState) => ({
  taskUserEntity: taskUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskUserDetail);
