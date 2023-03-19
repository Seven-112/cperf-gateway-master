import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-task.reducer';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskUpdate = (props: IProjectTaskUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskEntity, loading, updating } = props;

  const { description } = projectTaskEntity;

  const handleClose = () => {
    props.history.push('/project-task' + props.location.search);
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
    values.startAt = convertDateTimeToServer(values.startAt);
    values.finishAt = convertDateTimeToServer(values.finishAt);
    values.pauseAt = convertDateTimeToServer(values.pauseAt);

    if (errors.length === 0) {
      const entity = {
        ...projectTaskEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTask.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTask.home.createOrEditLabel">Create or edit a ProjectTask</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="project-task-name">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.name">Name</Translate>
                </Label>
                <AvField
                  id="project-task-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="project-task-description">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.description">Description</Translate>
                </Label>
                <AvInput id="project-task-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="nbMinuitesLabel" for="project-task-nbMinuites">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMinuites">Nb Minuites</Translate>
                </Label>
                <AvField id="project-task-nbMinuites" type="string" className="form-control" name="nbMinuites" />
              </AvGroup>
              <AvGroup>
                <Label id="nbHoursLabel" for="project-task-nbHours">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbHours">Nb Hours</Translate>
                </Label>
                <AvField id="project-task-nbHours" type="string" className="form-control" name="nbHours" />
              </AvGroup>
              <AvGroup>
                <Label id="nbDaysLabel" for="project-task-nbDays">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbDays">Nb Days</Translate>
                </Label>
                <AvField id="project-task-nbDays" type="string" className="form-control" name="nbDays" />
              </AvGroup>
              <AvGroup>
                <Label id="nbMonthsLabel" for="project-task-nbMonths">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMonths">Nb Months</Translate>
                </Label>
                <AvField id="project-task-nbMonths" type="string" className="form-control" name="nbMonths" />
              </AvGroup>
              <AvGroup>
                <Label id="nbYearsLabel" for="project-task-nbYears">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbYears">Nb Years</Translate>
                </Label>
                <AvField id="project-task-nbYears" type="string" className="form-control" name="nbYears" />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="project-task-startAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="project-task-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectTaskEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="project-task-status">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.status">Status</Translate>
                </Label>
                <AvInput
                  id="project-task-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && projectTaskEntity.status) || 'VALID'}
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
                <Label id="priorityLevelLabel" for="project-task-priorityLevel">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.priorityLevel">Priority Level</Translate>
                </Label>
                <AvInput
                  id="project-task-priorityLevel"
                  type="select"
                  className="form-control"
                  name="priorityLevel"
                  value={(!isNew && projectTaskEntity.priorityLevel) || 'VERYHIGTH'}
                >
                  <option value="VERYHIGTH">{translate('microgatewayApp.ProjectPriority.VERYHIGTH')}</option>
                  <option value="HIGHT">{translate('microgatewayApp.ProjectPriority.HIGHT')}</option>
                  <option value="LOW">{translate('microgatewayApp.ProjectPriority.LOW')}</option>
                  <option value="VERYLOW">{translate('microgatewayApp.ProjectPriority.VERYLOW')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="project-task-type">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.type">Type</Translate>
                </Label>
                <AvInput
                  id="project-task-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && projectTaskEntity.type) || 'START'}
                >
                  <option value="START">{translate('microgatewayApp.ProjectTaskType.START')}</option>
                  <option value="ACTIVITY">{translate('microgatewayApp.ProjectTaskType.ACTIVITY')}</option>
                  <option value="SUBACTIVITY">{translate('microgatewayApp.ProjectTaskType.SUBACTIVITY')}</option>
                  <option value="DOC">{translate('microgatewayApp.ProjectTaskType.DOC')}</option>
                  <option value="END">{translate('microgatewayApp.ProjectTaskType.END')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="project-task-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="finishAtLabel" for="project-task-finishAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.finishAt">Finish At</Translate>
                </Label>
                <AvInput
                  id="project-task-finishAt"
                  type="datetime-local"
                  className="form-control"
                  name="finishAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectTaskEntity.finishAt)}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="startWithProcessLabel">
                  <AvInput id="project-task-startWithProcess" type="checkbox" className="form-check-input" name="startWithProcess" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startWithProcess">Start With Process</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="project-task-processId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.processId">Process Id</Translate>
                </Label>
                <AvField id="project-task-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="parentIdLabel" for="project-task-parentId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.parentId">Parent Id</Translate>
                </Label>
                <AvField id="project-task-parentId" type="string" className="form-control" name="parentId" />
              </AvGroup>
              <AvGroup>
                <Label id="taskModelIdLabel" for="project-task-taskModelId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.taskModelId">Task Model Id</Translate>
                </Label>
                <AvField id="project-task-taskModelId" type="string" className="form-control" name="taskModelId" />
              </AvGroup>
              <AvGroup>
                <Label id="pauseAtLabel" for="project-task-pauseAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.pauseAt">Pause At</Translate>
                </Label>
                <AvInput
                  id="project-task-pauseAt"
                  type="datetime-local"
                  className="form-control"
                  name="pauseAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectTaskEntity.pauseAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nbPauseLabel" for="project-task-nbPause">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbPause">Nb Pause</Translate>
                </Label>
                <AvField id="project-task-nbPause" type="string" className="form-control" name="nbPause" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosXLabel" for="project-task-logigramPosX">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosX">Logigram Pos X</Translate>
                </Label>
                <AvField id="project-task-logigramPosX" type="string" className="form-control" name="logigramPosX" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosYLabel" for="project-task-logigramPosY">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosY">Logigram Pos Y</Translate>
                </Label>
                <AvField id="project-task-logigramPosY" type="string" className="form-control" name="logigramPosY" />
              </AvGroup>
              <AvGroup>
                <Label id="groupIdLabel" for="project-task-groupId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.groupId">Group Id</Translate>
                </Label>
                <AvField id="project-task-groupId" type="string" className="form-control" name="groupId" />
              </AvGroup>
              <AvGroup>
                <Label id="riskIdLabel" for="project-task-riskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.riskId">Risk Id</Translate>
                </Label>
                <AvField id="project-task-riskId" type="string" className="form-control" name="riskId" />
              </AvGroup>
              <AvGroup check>
                <Label id="manualModeLabel">
                  <AvInput id="project-task-manualMode" type="checkbox" className="form-check-input" name="manualMode" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.manualMode">Manual Mode</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartAtLabel" for="project-task-sheduledStartAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartAt">Sheduled Start At</Translate>
                </Label>
                <AvField id="project-task-sheduledStartAt" type="date" className="form-control" name="sheduledStartAt" />
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartHourLabel" for="project-task-sheduledStartHour">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartHour">Sheduled Start Hour</Translate>
                </Label>
                <AvField id="project-task-sheduledStartHour" type="string" className="form-control" name="sheduledStartHour" />
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartMinuteLabel" for="project-task-sheduledStartMinute">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartMinute">Sheduled Start Minute</Translate>
                </Label>
                <AvField id="project-task-sheduledStartMinute" type="string" className="form-control" name="sheduledStartMinute" />
              </AvGroup>
              <AvGroup>
                <Label id="startupTaskIdLabel" for="project-task-startupTaskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startupTaskId">Startup Task Id</Translate>
                </Label>
                <AvField id="project-task-startupTaskId" type="string" className="form-control" name="startupTaskId" />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="project-task-ponderation">
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="project-task-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup check>
                <Label id="checkedLabel">
                  <AvInput id="project-task-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task" replace color="info">
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
  projectTaskEntity: storeState.projectTask.entity,
  loading: storeState.projectTask.loading,
  updating: storeState.projectTask.updating,
  updateSuccess: storeState.projectTask.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskUpdate);
