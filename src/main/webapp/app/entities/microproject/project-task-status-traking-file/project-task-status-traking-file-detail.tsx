import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-status-traking-file.reducer';
import { IProjectTaskStatusTrakingFile } from 'app/shared/model/microproject/project-task-status-traking-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskStatusTrakingFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskStatusTrakingFileDetail = (props: IProjectTaskStatusTrakingFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskStatusTrakingFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.detail.title">
            ProjectTaskStatusTrakingFile
          </Translate>{' '}
          [<b>{projectTaskStatusTrakingFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingFileEntity.fileName}</dd>
          <dt>
            <span id="trackId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.trackId">Track Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskStatusTrakingFileEntity.trackId}</dd>
        </dl>
        <Button tag={Link} to="/project-task-status-traking-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-status-traking-file/${projectTaskStatusTrakingFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskStatusTrakingFile }: IRootState) => ({
  projectTaskStatusTrakingFileEntity: projectTaskStatusTrakingFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingFileDetail);
