import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getTasks } from 'app/entities/microprocess/task/task.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './task.reducer';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskUpdate = (props: ITaskUpdateProps) => {
  const [startupTaskId, setStartupTaskId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskEntity, tasks, loading, updating } = props;

  const { description } = taskEntity;

  const handleClose = () => {
    props.history.push('/task' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTasks();
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
        ...taskEntity,
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
          <h2 id="microgatewayApp.microprocessTask.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTask.home.createOrEditLabel">Create or edit a Task</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="task-name">
                  <Translate contentKey="microgatewayApp.microprocessTask.name">Name</Translate>
                </Label>
                <AvField
                  id="task-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="task-description">
                  <Translate contentKey="microgatewayApp.microprocessTask.description">Description</Translate>
                </Label>
                <AvInput id="task-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="nbMinuitesLabel" for="task-nbMinuites">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbMinuites">Nb Minuites</Translate>
                </Label>
                <AvField id="task-nbMinuites" type="string" className="form-control" name="nbMinuites" />
              </AvGroup>
              <AvGroup>
                <Label id="nbHoursLabel" for="task-nbHours">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbHours">Nb Hours</Translate>
                </Label>
                <AvField id="task-nbHours" type="string" className="form-control" name="nbHours" />
              </AvGroup>
              <AvGroup>
                <Label id="nbDaysLabel" for="task-nbDays">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbDays">Nb Days</Translate>
                </Label>
                <AvField id="task-nbDays" type="string" className="form-control" name="nbDays" />
              </AvGroup>
              <AvGroup>
                <Label id="nbMonthsLabel" for="task-nbMonths">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbMonths">Nb Months</Translate>
                </Label>
                <AvField id="task-nbMonths" type="string" className="form-control" name="nbMonths" />
              </AvGroup>
              <AvGroup>
                <Label id="nbYearsLabel" for="task-nbYears">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbYears">Nb Years</Translate>
                </Label>
                <AvField id="task-nbYears" type="string" className="form-control" name="nbYears" />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="task-startAt">
                  <Translate contentKey="microgatewayApp.microprocessTask.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="task-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.taskEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="task-status">
                  <Translate contentKey="microgatewayApp.microprocessTask.status">Status</Translate>
                </Label>
                <AvInput
                  id="task-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && taskEntity.status) || 'VALID'}
                >
                  <option value="VALID">{translate('microgatewayApp.TaskStatus.VALID')}</option>
                  <option value="STARTED">{translate('microgatewayApp.TaskStatus.STARTED')}</option>
                  <option value="COMPLETED">{translate('microgatewayApp.TaskStatus.COMPLETED')}</option>
                  <option value="CANCELED">{translate('microgatewayApp.TaskStatus.CANCELED')}</option>
                  <option value="SUBMITTED">{translate('microgatewayApp.TaskStatus.SUBMITTED')}</option>
                  <option value="ON_PAUSE">{translate('microgatewayApp.TaskStatus.ON_PAUSE')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="priorityLevelLabel" for="task-priorityLevel">
                  <Translate contentKey="microgatewayApp.microprocessTask.priorityLevel">Priority Level</Translate>
                </Label>
                <AvInput
                  id="task-priorityLevel"
                  type="select"
                  className="form-control"
                  name="priorityLevel"
                  value={(!isNew && taskEntity.priorityLevel) || 'VERYHIGTH'}
                >
                  <option value="VERYHIGTH">{translate('microgatewayApp.ProcessPriority.VERYHIGTH')}</option>
                  <option value="HIGHT">{translate('microgatewayApp.ProcessPriority.HIGHT')}</option>
                  <option value="LOW">{translate('microgatewayApp.ProcessPriority.LOW')}</option>
                  <option value="VERYLOW">{translate('microgatewayApp.ProcessPriority.VERYLOW')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="task-type">
                  <Translate contentKey="microgatewayApp.microprocessTask.type">Type</Translate>
                </Label>
                <AvInput id="task-type" type="select" className="form-control" name="type" value={(!isNew && taskEntity.type) || 'START'}>
                  <option value="START">{translate('microgatewayApp.TaskType.START')}</option>
                  <option value="ACTIVITY">{translate('microgatewayApp.TaskType.ACTIVITY')}</option>
                  <option value="SUBACTIVITY">{translate('microgatewayApp.TaskType.SUBACTIVITY')}</option>
                  <option value="DOC">{translate('microgatewayApp.TaskType.DOC')}</option>
                  <option value="END">{translate('microgatewayApp.TaskType.END')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="task-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprocessTask.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="finishAtLabel" for="task-finishAt">
                  <Translate contentKey="microgatewayApp.microprocessTask.finishAt">Finish At</Translate>
                </Label>
                <AvInput
                  id="task-finishAt"
                  type="datetime-local"
                  className="form-control"
                  name="finishAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.taskEntity.finishAt)}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="startWithProcessLabel">
                  <AvInput id="task-startWithProcess" type="checkbox" className="form-check-input" name="startWithProcess" />
                  <Translate contentKey="microgatewayApp.microprocessTask.startWithProcess">Start With Process</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="task-processId">
                  <Translate contentKey="microgatewayApp.microprocessTask.processId">Process Id</Translate>
                </Label>
                <AvField id="task-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="parentIdLabel" for="task-parentId">
                  <Translate contentKey="microgatewayApp.microprocessTask.parentId">Parent Id</Translate>
                </Label>
                <AvField id="task-parentId" type="string" className="form-control" name="parentId" />
              </AvGroup>
              <AvGroup>
                <Label id="taskModelIdLabel" for="task-taskModelId">
                  <Translate contentKey="microgatewayApp.microprocessTask.taskModelId">Task Model Id</Translate>
                </Label>
                <AvField id="task-taskModelId" type="string" className="form-control" name="taskModelId" />
              </AvGroup>
              <AvGroup>
                <Label id="pauseAtLabel" for="task-pauseAt">
                  <Translate contentKey="microgatewayApp.microprocessTask.pauseAt">Pause At</Translate>
                </Label>
                <AvInput
                  id="task-pauseAt"
                  type="datetime-local"
                  className="form-control"
                  name="pauseAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.taskEntity.pauseAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nbPauseLabel" for="task-nbPause">
                  <Translate contentKey="microgatewayApp.microprocessTask.nbPause">Nb Pause</Translate>
                </Label>
                <AvField id="task-nbPause" type="string" className="form-control" name="nbPause" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosXLabel" for="task-logigramPosX">
                  <Translate contentKey="microgatewayApp.microprocessTask.logigramPosX">Logigram Pos X</Translate>
                </Label>
                <AvField id="task-logigramPosX" type="string" className="form-control" name="logigramPosX" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosYLabel" for="task-logigramPosY">
                  <Translate contentKey="microgatewayApp.microprocessTask.logigramPosY">Logigram Pos Y</Translate>
                </Label>
                <AvField id="task-logigramPosY" type="string" className="form-control" name="logigramPosY" />
              </AvGroup>
              <AvGroup>
                <Label id="groupIdLabel" for="task-groupId">
                  <Translate contentKey="microgatewayApp.microprocessTask.groupId">Group Id</Translate>
                </Label>
                <AvField id="task-groupId" type="string" className="form-control" name="groupId" />
              </AvGroup>
              <AvGroup>
                <Label id="riskIdLabel" for="task-riskId">
                  <Translate contentKey="microgatewayApp.microprocessTask.riskId">Risk Id</Translate>
                </Label>
                <AvField id="task-riskId" type="string" className="form-control" name="riskId" />
              </AvGroup>
              <AvGroup check>
                <Label id="manualModeLabel">
                  <AvInput id="task-manualMode" type="checkbox" className="form-check-input" name="manualMode" />
                  <Translate contentKey="microgatewayApp.microprocessTask.manualMode">Manual Mode</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartAtLabel" for="task-sheduledStartAt">
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartAt">Sheduled Start At</Translate>
                </Label>
                <AvField id="task-sheduledStartAt" type="date" className="form-control" name="sheduledStartAt" />
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartHourLabel" for="task-sheduledStartHour">
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartHour">Sheduled Start Hour</Translate>
                </Label>
                <AvField id="task-sheduledStartHour" type="string" className="form-control" name="sheduledStartHour" />
              </AvGroup>
              <AvGroup>
                <Label id="sheduledStartMinuteLabel" for="task-sheduledStartMinute">
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartMinute">Sheduled Start Minute</Translate>
                </Label>
                <AvField id="task-sheduledStartMinute" type="string" className="form-control" name="sheduledStartMinute" />
              </AvGroup>
              <AvGroup check>
                <Label id="checkedLabel">
                  <AvInput id="task-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprocessTask.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="currentPauseHistoryIdLabel" for="task-currentPauseHistoryId">
                  <Translate contentKey="microgatewayApp.microprocessTask.currentPauseHistoryId">Current Pause History Id</Translate>
                </Label>
                <AvField id="task-currentPauseHistoryId" type="string" className="form-control" name="currentPauseHistoryId" />
              </AvGroup>
              <AvGroup check>
                <Label id="exceceedLabel">
                  <AvInput id="task-exceceed" type="checkbox" className="form-check-input" name="exceceed" />
                  <Translate contentKey="microgatewayApp.microprocessTask.exceceed">Exceceed</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="task-startupTask">
                  <Translate contentKey="microgatewayApp.microprocessTask.startupTask">Startup Task</Translate>
                </Label>
                <AvInput id="task-startupTask" type="select" className="form-control" name="startupTask.id">
                  <option value="" key="0" />
                  {tasks
                    ? tasks.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/task" replace color="info">
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
  tasks: storeState.task.entities,
  taskEntity: storeState.task.entity,
  loading: storeState.task.loading,
  updating: storeState.task.updating,
  updateSuccess: storeState.task.updateSuccess,
});

const mapDispatchToProps = {
  getTasks,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskUpdate);
