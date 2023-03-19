import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-user.reducer';
import { IProjectTaskUser } from 'app/shared/model/microproject/project-task-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskUserDetail = (props: IProjectTaskUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.detail.title">ProjectTaskUser</Translate> [
          <b>{projectTaskUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskUserEntity.userId}</dd>
          <dt>
            <span id="userName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userName">User Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskUserEntity.userName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{projectTaskUserEntity.userEmail}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.role">Role</Translate>
            </span>
          </dt>
          <dd>{projectTaskUserEntity.role}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskUserEntity.taskId}</dd>
        </dl>
        <Button tag={Link} to="/project-task-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-user/${projectTaskUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskUser }: IRootState) => ({
  projectTaskUserEntity: projectTaskUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskUserDetail);
