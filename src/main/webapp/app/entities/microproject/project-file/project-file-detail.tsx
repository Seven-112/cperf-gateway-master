import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-file.reducer';
import { IProjectFile } from 'app/shared/model/microproject/project-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectFileDetail = (props: IProjectFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectFile.detail.title">ProjectFile</Translate> [
          <b>{projectFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.fileName}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.description">Description</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.description}</dd>
          <dt>
            <span id="fileType">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.fileType">File Type</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.fileType}</dd>
          <dt>
            <span id="projectId">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.projectId">Project Id</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.projectId}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.userId}</dd>
          <dt>
            <span id="userName">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.userName">User Name</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.userName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectFile.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{projectFileEntity.userEmail}</dd>
        </dl>
        <Button tag={Link} to="/project-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-file/${projectFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectFile }: IRootState) => ({
  projectFileEntity: projectFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectFileDetail);
