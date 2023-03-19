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
import { getEntity, updateEntity, createEntity, reset } from './task-user.reducer';
import { ITaskUser } from 'app/shared/model/microprocess/task-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskUserUpdate = (props: ITaskUserUpdateProps) => {
  const [taskId, setTaskId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskUserEntity, tasks, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/task-user' + props.location.search);
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
        ...taskUserEntity,
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
          <h2 id="microgatewayApp.microprocessTaskUser.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskUser.home.createOrEditLabel">Create or edit a TaskUser</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="task-user-userId">
                  <Translate contentKey="microgatewayApp.microprocessTaskUser.userId">User Id</Translate>
                </Label>
                <AvField
                  id="task-user-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="roleLabel" for="task-user-role">
                  <Translate contentKey="microgatewayApp.microprocessTaskUser.role">Role</Translate>
                </Label>
                <AvInput
                  id="task-user-role"
                  type="select"
                  className="form-control"
                  name="role"
                  value={(!isNew && taskUserEntity.role) || 'EXCEUTOR'}
                >
                  <option value="EXCEUTOR">{translate('microgatewayApp.TaskUserRole.EXCEUTOR')}</option>
                  <option value="VALIDATOR">{translate('microgatewayApp.TaskUserRole.VALIDATOR')}</option>
                  <option value="SUBMITOR">{translate('microgatewayApp.TaskUserRole.SUBMITOR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="userFullNameLabel" for="task-user-userFullName">
                  <Translate contentKey="microgatewayApp.microprocessTaskUser.userFullName">User Full Name</Translate>
                </Label>
                <AvField id="task-user-userFullName" type="text" name="userFullName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="task-user-userEmail">
                  <Translate contentKey="microgatewayApp.microprocessTaskUser.userEmail">User Email</Translate>
                </Label>
                <AvField id="task-user-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <AvGroup>
                <Label for="task-user-task">
                  <Translate contentKey="microgatewayApp.microprocessTaskUser.task">Task</Translate>
                </Label>
                <AvInput
                  id="task-user-task"
                  type="select"
                  className="form-control"
                  name="task.id"
                  value={isNew ? tasks[0] && tasks[0].id : taskUserEntity.task?.id}
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
              <Button tag={Link} id="cancel-save" to="/task-user" replace color="info">
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
  taskUserEntity: storeState.taskUser.entity,
  loading: storeState.taskUser.loading,
  updating: storeState.taskUser.updating,
  updateSuccess: storeState.taskUser.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskUserUpdate);
