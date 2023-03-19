import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './task-status-traking.reducer';
import { ITaskStatusTraking } from 'app/shared/model/microprocess/task-status-traking.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskStatusTrakingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskStatusTrakingUpdate = (props: ITaskStatusTrakingUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskStatusTrakingEntity, loading, updating } = props;

  const { justification } = taskStatusTrakingEntity;

  const handleClose = () => {
    props.history.push('/task-status-traking' + props.location.search);
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
        ...taskStatusTrakingEntity,
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
          <h2 id="microgatewayApp.microprocessTaskStatusTraking.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.home.createOrEditLabel">
              Create or edit a TaskStatusTraking
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskStatusTrakingEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-status-traking-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-status-traking-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="taskIdLabel" for="task-status-traking-taskId">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="task-status-traking-taskId"
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
                <Label id="statusLabel" for="task-status-traking-status">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.status">Status</Translate>
                </Label>
                <AvInput
                  id="task-status-traking-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && taskStatusTrakingEntity.status) || 'VALID'}
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
                <Label id="tracingAtLabel" for="task-status-traking-tracingAt">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.tracingAt">Tracing At</Translate>
                </Label>
                <AvInput
                  id="task-status-traking-tracingAt"
                  type="datetime-local"
                  className="form-control"
                  name="tracingAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.taskStatusTrakingEntity.tracingAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="task-status-traking-justification">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.justification">Justification</Translate>
                </Label>
                <AvInput id="task-status-traking-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="task-status-traking-userId">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.userId">User Id</Translate>
                </Label>
                <AvField id="task-status-traking-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup check>
                <Label id="editableLabel">
                  <AvInput id="task-status-traking-editable" type="checkbox" className="form-check-input" name="editable" />
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.editable">Editable</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="execeedLabel">
                  <AvInput id="task-status-traking-execeed" type="checkbox" className="form-check-input" name="execeed" />
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.execeed">Execeed</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="perfIndicatorLabel">
                  <AvInput id="task-status-traking-perfIndicator" type="checkbox" className="form-check-input" name="perfIndicator" />
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTraking.perfIndicator">Perf Indicator</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/task-status-traking" replace color="info">
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
  taskStatusTrakingEntity: storeState.taskStatusTraking.entity,
  loading: storeState.taskStatusTraking.loading,
  updating: storeState.taskStatusTraking.updating,
  updateSuccess: storeState.taskStatusTraking.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingUpdate);
