import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-item.reducer';
import { IProjectTaskItem } from 'app/shared/model/microproject/project-task-item.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskItemDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskItemDetail = (props: IProjectTaskItemDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskItemEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.detail.title">ProjectTaskItem</Translate> [
          <b>{projectTaskItemEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.name}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.taskId}</dd>
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.checked ? 'true' : 'false'}</dd>
          <dt>
            <span id="checkerId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerId">Checker Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.checkerId}</dd>
          <dt>
            <span id="checkerName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerName">Checker Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.checkerName}</dd>
          <dt>
            <span id="checkerEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerEmail">Checker Email</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.checkerEmail}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.editorId}</dd>
          <dt>
            <span id="editorEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorEmail">Editor Email</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.editorEmail}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.editorName}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.required">Required</Translate>
            </span>
          </dt>
          <dd>{projectTaskItemEntity.required ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/project-task-item" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-item/${projectTaskItemEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskItem }: IRootState) => ({
  projectTaskItemEntity: projectTaskItem.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskItemDetail);
