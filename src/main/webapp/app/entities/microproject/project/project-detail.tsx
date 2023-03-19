import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project.reducer';
import { IProject } from 'app/shared/model/microproject/project.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectDetail = (props: IProjectDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProject.detail.title">Project</Translate> [<b>{projectEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.microprojectProject.label">Label</Translate>
            </span>
          </dt>
          <dd>{projectEntity.label}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprojectProject.description">Description</Translate>
            </span>
          </dt>
          <dd>{projectEntity.description}</dd>
          <dt>
            <span id="priorityLevel">
              <Translate contentKey="microgatewayApp.microprojectProject.priorityLevel">Priority Level</Translate>
            </span>
          </dt>
          <dd>{projectEntity.priorityLevel}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprojectProject.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{projectEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="previewStartAt">
              <Translate contentKey="microgatewayApp.microprojectProject.previewStartAt">Preview Start At</Translate>
            </span>
          </dt>
          <dd>
            {projectEntity.previewStartAt ? <TextFormat value={projectEntity.previewStartAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.microprojectProject.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>{projectEntity.startAt ? <TextFormat value={projectEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="previewFinishAt">
              <Translate contentKey="microgatewayApp.microprojectProject.previewFinishAt">Preview Finish At</Translate>
            </span>
          </dt>
          <dd>
            {projectEntity.previewFinishAt ? (
              <TextFormat value={projectEntity.previewFinishAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="finishedAt">
              <Translate contentKey="microgatewayApp.microprojectProject.finishedAt">Finished At</Translate>
            </span>
          </dt>
          <dd>{projectEntity.finishedAt ? <TextFormat value={projectEntity.finishedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microprojectProject.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{projectEntity.createdAt ? <TextFormat value={projectEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="startCount">
              <Translate contentKey="microgatewayApp.microprojectProject.startCount">Start Count</Translate>
            </span>
          </dt>
          <dd>{projectEntity.startCount}</dd>
          <dt>
            <span id="parentId">
              <Translate contentKey="microgatewayApp.microprojectProject.parentId">Parent Id</Translate>
            </span>
          </dt>
          <dd>{projectEntity.parentId}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprojectProject.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{projectEntity.editorId}</dd>
          <dt>
            <span id="runnableProcessId">
              <Translate contentKey="microgatewayApp.microprojectProject.runnableProcessId">Runnable Process Id</Translate>
            </span>
          </dt>
          <dd>{projectEntity.runnableProcessId}</dd>
          <dt>
            <span id="categoryId">
              <Translate contentKey="microgatewayApp.microprojectProject.categoryId">Category Id</Translate>
            </span>
          </dt>
          <dd>{projectEntity.categoryId}</dd>
          <dt>
            <span id="responsableId">
              <Translate contentKey="microgatewayApp.microprojectProject.responsableId">Responsable Id</Translate>
            </span>
          </dt>
          <dd>{projectEntity.responsableId}</dd>
          <dt>
            <span id="responsableName">
              <Translate contentKey="microgatewayApp.microprojectProject.responsableName">Responsable Name</Translate>
            </span>
          </dt>
          <dd>{projectEntity.responsableName}</dd>
          <dt>
            <span id="responsableEmail">
              <Translate contentKey="microgatewayApp.microprojectProject.responsableEmail">Responsable Email</Translate>
            </span>
          </dt>
          <dd>{projectEntity.responsableEmail}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.microprojectProject.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{projectEntity.ponderation}</dd>
          <dt>
            <span id="taskGlobalPonderation">
              <Translate contentKey="microgatewayApp.microprojectProject.taskGlobalPonderation">Task Global Ponderation</Translate>
            </span>
          </dt>
          <dd>{projectEntity.taskGlobalPonderation}</dd>
        </dl>
        <Button tag={Link} to="/project" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project/${projectEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ project }: IRootState) => ({
  projectEntity: project.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
