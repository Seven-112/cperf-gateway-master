import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITask } from 'app/shared/model/microprocess/task.model';
import { getEntities as getTasks } from 'app/entities/microprocess/task/task.reducer';
import { getEntity, updateEntity, createEntity, reset } from './taskfile.reducer';
import { ITaskfile } from 'app/shared/model/microprocess/taskfile.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskfileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskfileUpdate = (props: ITaskfileUpdateProps) => {
  const [taskId, setTaskId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskfileEntity, tasks, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/taskfile' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTasks();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...taskfileEntity,
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
          <h2 id="microgatewayApp.microprocessTaskfile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskfile.home.createOrEditLabel">Create or edit a Taskfile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskfileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="taskfile-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="taskfile-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="taskfile-fileId">
                  <Translate contentKey="microgatewayApp.microprocessTaskfile.fileId">File Id</Translate>
                </Label>
                <AvField id="taskfile-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="taskfile-description">
                  <Translate contentKey="microgatewayApp.microprocessTaskfile.description">Description</Translate>
                </Label>
                <AvField id="taskfile-description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="taskfile-type">
                  <Translate contentKey="microgatewayApp.microprocessTaskfile.type">Type</Translate>
                </Label>
                <AvInput
                  id="taskfile-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && taskfileEntity.type) || 'DESCRIPTION'}
                >
                  <option value="DESCRIPTION">{translate('microgatewayApp.TaskFileType.DESCRIPTION')}</option>
                  <option value="VALIDATION">{translate('microgatewayApp.TaskFileType.VALIDATION')}</option>
                  <option value="SOUMISSION">{translate('microgatewayApp.TaskFileType.SOUMISSION')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="taskfile-task">
                  <Translate contentKey="microgatewayApp.microprocessTaskfile.task">Task</Translate>
                </Label>
                <AvInput
                  id="taskfile-task"
                  type="select"
                  className="form-control"
                  name="task.id"
                  value={isNew ? tasks[0] && tasks[0].id : taskfileEntity.task?.id}
                  required
                >
                  {tasks
                    ? tasks.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/taskfile" replace color="info">
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
  taskfileEntity: storeState.taskfile.entity,
  loading: storeState.taskfile.loading,
  updating: storeState.taskfile.updating,
  updateSuccess: storeState.taskfile.updateSuccess,
});

const mapDispatchToProps = {
  getTasks,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskfileUpdate);
