import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-file.reducer';
import { IProjectTaskFile } from 'app/shared/model/microproject/project-task-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskFileDetail = (props: IProjectTaskFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.detail.title">ProjectTaskFile</Translate> [
          <b>{projectTaskFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskFileEntity.fileName}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.type">Type</Translate>
            </span>
          </dt>
          <dd>{projectTaskFileEntity.type}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskFileEntity.taskId}</dd>
        </dl>
        <Button tag={Link} to="/project-task-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-file/${projectTaskFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskFile }: IRootState) => ({
  projectTaskFileEntity: projectTaskFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskFileDetail);
