import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project.reducer';
import { IProject } from 'app/shared/model/microproject/project.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectUpdate = (props: IProjectUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectEntity, loading, updating } = props;

  const { description } = projectEntity;

  const handleClose = () => {
    props.history.push('/project' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.previewStartAt = convertDateTimeToServer(values.previewStartAt);
    values.startAt = convertDateTimeToServer(values.startAt);
    values.previewFinishAt = convertDateTimeToServer(values.previewFinishAt);
    values.finishedAt = convertDateTimeToServer(values.finishedAt);
    values.createdAt = convertDateTimeToServer(values.createdAt);

    if (errors.length === 0) {
      const entity = {
        ...projectEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microgatewayApp.microprojectProject.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProject.home.createOrEditLabel">Create or edit a Project</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="project-label">
                  <Translate contentKey="microgatewayApp.microprojectProject.label">Label</Translate>
                </Label>
                <AvField
                  id="project-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="project-description">
                  <Translate contentKey="microgatewayApp.microprojectProject.description">Description</Translate>
                </Label>
                <AvInput id="project-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="priorityLevelLabel" for="project-priorityLevel">
                  <Translate contentKey="microgatewayApp.microprojectProject.priorityLevel">Priority Level</Translate>
                </Label>
                <AvInput
                  id="project-priorityLevel"
                  type="select"
                  className="form-control"
                  name="priorityLevel"
                  value={(!isNew && projectEntity.priorityLevel) || 'VERYHIGTH'}
                >
                  <option value="VERYHIGTH">{translate('microgatewayApp.ProjectPriority.VERYHIGTH')}</option>
                  <option value="HIGHT">{translate('microgatewayApp.ProjectPriority.HIGHT')}</option>
                  <option value="LOW">{translate('microgatewayApp.ProjectPriority.LOW')}</option>
                  <option value="VERYLOW">{translate('microgatewayApp.ProjectPriority.VERYLOW')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="project-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprojectProject.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="previewStartAtLabel" for="project-previewStartAt">
                  <Translate contentKey="microgatewayApp.microprojectProject.previewStartAt">Preview Start At</Translate>
                </Label>
                <AvInput
                  id="project-previewStartAt"
                  type="datetime-local"
                  className="form-control"
                  name="previewStartAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEntity.previewStartAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="project-startAt">
                  <Translate contentKey="microgatewayApp.microprojectProject.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="project-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="previewFinishAtLabel" for="project-previewFinishAt">
                  <Translate contentKey="microgatewayApp.microprojectProject.previewFinishAt">Preview Finish At</Translate>
                </Label>
                <AvInput
                  id="project-previewFinishAt"
                  type="datetime-local"
                  className="form-control"
                  name="previewFinishAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEntity.previewFinishAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="finishedAtLabel" for="project-finishedAt">
                  <Translate contentKey="microgatewayApp.microprojectProject.finishedAt">Finished At</Translate>
                </Label>
                <AvInput
                  id="project-finishedAt"
                  type="datetime-local"
                  className="form-control"
                  name="finishedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEntity.finishedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="project-createdAt">
                  <Translate contentKey="microgatewayApp.microprojectProject.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="project-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startCountLabel" for="project-startCount">
                  <Translate contentKey="microgatewayApp.microprojectProject.startCount">Start Count</Translate>
                </Label>
                <AvField id="project-startCount" type="string" className="form-control" name="startCount" />
              </AvGroup>
              <AvGroup>
                <Label id="parentIdLabel" for="project-parentId">
                  <Translate contentKey="microgatewayApp.microprojectProject.parentId">Parent Id</Translate>
                </Label>
                <AvField id="project-parentId" type="string" className="form-control" name="parentId" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="project-editorId">
                  <Translate contentKey="microgatewayApp.microprojectProject.editorId">Editor Id</Translate>
                </Label>
                <AvField id="project-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <AvGroup>
                <Label id="runnableProcessIdLabel" for="project-runnableProcessId">
                  <Translate contentKey="microgatewayApp.microprojectProject.runnableProcessId">Runnable Process Id</Translate>
                </Label>
                <AvField id="project-runnableProcessId" type="string" className="form-control" name="runnableProcessId" />
              </AvGroup>
              <AvGroup>
                <Label id="categoryIdLabel" for="project-categoryId">
                  <Translate contentKey="microgatewayApp.microprojectProject.categoryId">Category Id</Translate>
                </Label>
                <AvField id="project-categoryId" type="string" className="form-control" name="categoryId" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableIdLabel" for="project-responsableId">
                  <Translate contentKey="microgatewayApp.microprojectProject.responsableId">Responsable Id</Translate>
                </Label>
                <AvField id="project-responsableId" type="string" className="form-control" name="responsableId" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableNameLabel" for="project-responsableName">
                  <Translate contentKey="microgatewayApp.microprojectProject.responsableName">Responsable Name</Translate>
                </Label>
                <AvField id="project-responsableName" type="text" name="responsableName" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableEmailLabel" for="project-responsableEmail">
                  <Translate contentKey="microgatewayApp.microprojectProject.responsableEmail">Responsable Email</Translate>
                </Label>
                <AvField id="project-responsableEmail" type="text" name="responsableEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="advencedStatePercentLabel" for="project-advencedStatePercent">
                  <Translate contentKey="microgatewayApp.microprojectProject.advencedStatePercent">Advenced State Percent</Translate>
                </Label>
                <AvField id="project-advencedStatePercent" type="string" className="form-control" name="advencedStatePercent" />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="project-ponderation">
                  <Translate contentKey="microgatewayApp.microprojectProject.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="project-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup>
                <Label id="taskGlobalPonderationLabel" for="project-taskGlobalPonderation">
                  <Translate contentKey="microgatewayApp.microprojectProject.taskGlobalPonderation">Task Global Ponderation</Translate>
                </Label>
                <AvField id="project-taskGlobalPonderation" type="string" className="form-control" name="taskGlobalPonderation" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  projectEntity: storeState.project.entity,
  loading: storeState.project.loading,
  updating: storeState.project.updating,
  updateSuccess: storeState.project.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdate);
