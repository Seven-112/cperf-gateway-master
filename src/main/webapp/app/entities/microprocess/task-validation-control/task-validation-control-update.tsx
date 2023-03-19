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
import { getEntity, updateEntity, createEntity, reset } from './task-validation-control.reducer';
import { ITaskValidationControl } from 'app/shared/model/microprocess/task-validation-control.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskValidationControlUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskValidationControlUpdate = (props: ITaskValidationControlUpdateProps) => {
  const [taskId, setTaskId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskValidationControlEntity, tasks, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/task-validation-control' + props.location.search);
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
        ...taskValidationControlEntity,
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
          <h2 id="microgatewayApp.microprocessTaskValidationControl.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.home.createOrEditLabel">
              Create or edit a TaskValidationControl
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskValidationControlEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-validation-control-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-validation-control-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="task-validation-control-label">
                  <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.label">Label</Translate>
                </Label>
                <AvField
                  id="task-validation-control-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="task-validation-control-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.required">Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="task-validation-control-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="task-validation-control-task">
                  <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.task">Task</Translate>
                </Label>
                <AvInput
                  id="task-validation-control-task"
                  type="select"
                  className="form-control"
                  name="task.id"
                  value={isNew ? tasks[0] && tasks[0].id : taskValidationControlEntity.task?.id}
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
              <Button tag={Link} id="cancel-save" to="/task-validation-control" replace color="info">
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
  taskValidationControlEntity: storeState.taskValidationControl.entity,
  loading: storeState.taskValidationControl.loading,
  updating: storeState.taskValidationControl.updating,
  updateSuccess: storeState.taskValidationControl.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskValidationControlUpdate);
