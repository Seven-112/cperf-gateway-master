import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-startable-task.reducer';
import { IProjectStartableTask } from 'app/shared/model/microproject/project-startable-task.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectStartableTaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectStartableTaskUpdate = (props: IProjectStartableTaskUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectStartableTaskEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-startable-task' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.createdAt = convertDateTimeToServer(values.createdAt);

    if (errors.length === 0) {
      const entity = {
        ...projectStartableTaskEntity,
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
          <h2 id="microgatewayApp.microprojectProjectStartableTask.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.home.createOrEditLabel">
              Create or edit a ProjectStartableTask
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectStartableTaskEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-startable-task-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-startable-task-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="triggerTaskIdLabel" for="project-startable-task-triggerTaskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskId">Trigger Task Id</Translate>
                </Label>
                <AvField id="project-startable-task-triggerTaskId" type="string" className="form-control" name="triggerTaskId" />
              </AvGroup>
              <AvGroup>
                <Label id="startableTaskIdLabel" for="project-startable-task-startableTaskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskId">Startable Task Id</Translate>
                </Label>
                <AvField id="project-startable-task-startableTaskId" type="string" className="form-control" name="startableTaskId" />
              </AvGroup>
              <AvGroup>
                <Label id="triggerTaskNameLabel" for="project-startable-task-triggerTaskName">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskName">Trigger Task Name</Translate>
                </Label>
                <AvField id="project-startable-task-triggerTaskName" type="text" name="triggerTaskName" />
              </AvGroup>
              <AvGroup>
                <Label id="startableTaskNameLabel" for="project-startable-task-startableTaskName">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskName">Startable Task Name</Translate>
                </Label>
                <AvField id="project-startable-task-startableTaskName" type="text" name="startableTaskName" />
              </AvGroup>
              <AvGroup>
                <Label id="triggerProjectNameLabel" for="project-startable-task-triggerProjectName">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerProjectName">
                    Trigger Project Name
                  </Translate>
                </Label>
                <AvField id="project-startable-task-triggerProjectName" type="text" name="triggerProjectName" />
              </AvGroup>
              <AvGroup>
                <Label id="startableProjectNameLabel" for="project-startable-task-startableProjectName">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableProjectName">
                    Startable Project Name
                  </Translate>
                </Label>
                <AvField id="project-startable-task-startableProjectName" type="text" name="startableProjectName" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="project-startable-task-userId">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.userId">User Id</Translate>
                </Label>
                <AvField id="project-startable-task-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="project-startable-task-createdAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="project-startable-task-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectStartableTaskEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startCondLabel" for="project-startable-task-startCond">
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startCond">Start Cond</Translate>
                </Label>
                <AvInput
                  id="project-startable-task-startCond"
                  type="select"
                  className="form-control"
                  name="startCond"
                  value={(!isNew && projectStartableTaskEntity.startCond) || 'LOOPBACK'}
                >
                  <option value="LOOPBACK">{translate('microgatewayApp.ProjectStartableTaskCond.LOOPBACK')}</option>
                  <option value="TRIGGER_STARTED">{translate('microgatewayApp.ProjectStartableTaskCond.TRIGGER_STARTED')}</option>
                  <option value="TRIGGER_VALIDATED">{translate('microgatewayApp.ProjectStartableTaskCond.TRIGGER_VALIDATED')}</option>
                  <option value="TRIGGER_CANCELED">{translate('microgatewayApp.ProjectStartableTaskCond.TRIGGER_CANCELED')}</option>
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-startable-task" replace color="info">
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
  projectStartableTaskEntity: storeState.projectStartableTask.entity,
  loading: storeState.projectStartableTask.loading,
  updating: storeState.projectStartableTask.updating,
  updateSuccess: storeState.projectStartableTask.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectStartableTaskUpdate);
