import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-task-status-traking.reducer';
import { IProjectTaskStatusTraking } from 'app/shared/model/microproject/project-task-status-traking.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskStatusTrakingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskStatusTrakingUpdate = (props: IProjectTaskStatusTrakingUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskStatusTrakingEntity, loading, updating } = props;

  const { justification } = projectTaskStatusTrakingEntity;

  const handleClose = () => {
    props.history.push('/project-task-status-traking' + props.location.search);
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
    values.tracingAt = convertDateTimeToServer(values.tracingAt);

    if (errors.length === 0) {
      const entity = {
        ...projectTaskStatusTrakingEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskStatusTraking.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.home.createOrEditLabel">
              Create or edit a ProjectTaskStatusTraking
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskStatusTrakingEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-status-traking-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-status-traking-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-status-traking-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="project-task-status-traking-taskId"
                  type="string"
                  className="form-control"
                  name="taskId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="project-task-status-traking-status">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.status">Status</Translate>
                </Label>
                <AvInput
                  id="project-task-status-traking-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && projectTaskStatusTrakingEntity.status) || 'VALID'}
                >
                  <option value="VALID">{translate('microgatewayApp.ProjectTaskStatus.VALID')}</option>
                  <option value="STARTED">{translate('microgatewayApp.ProjectTaskStatus.STARTED')}</option>
                  <option value="COMPLETED">{translate('microgatewayApp.ProjectTaskStatus.COMPLETED')}</option>
                  <option value="CANCELED">{translate('microgatewayApp.ProjectTaskStatus.CANCELED')}</option>
                  <option value="SUBMITTED">{translate('microgatewayApp.ProjectTaskStatus.SUBMITTED')}</option>
                  <option value="ON_PAUSE">{translate('microgatewayApp.ProjectTaskStatus.ON_PAUSE')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="tracingAtLabel" for="project-task-status-traking-tracingAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.tracingAt">Tracing At</Translate>
                </Label>
                <AvInput
                  id="project-task-status-traking-tracingAt"
                  type="datetime-local"
                  className="form-control"
                  name="tracingAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectTaskStatusTrakingEntity.tracingAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="project-task-status-traking-justification">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.justification">Justification</Translate>
                </Label>
                <AvInput id="project-task-status-traking-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="project-task-status-traking-userId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userId">User Id</Translate>
                </Label>
                <AvField id="project-task-status-traking-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userNameLabel" for="project-task-status-traking-userName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userName">User Name</Translate>
                </Label>
                <AvField id="project-task-status-traking-userName" type="text" name="userName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="project-task-status-traking-userEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTraking.userEmail">User Email</Translate>
                </Label>
                <AvField id="project-task-status-traking-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-status-traking" replace color="info">
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
  projectTaskStatusTrakingEntity: storeState.projectTaskStatusTraking.entity,
  loading: storeState.projectTaskStatusTraking.loading,
  updating: storeState.projectTaskStatusTraking.updating,
  updateSuccess: storeState.projectTaskStatusTraking.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingUpdate);
