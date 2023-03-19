import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './task-item.reducer';
import { ITaskItem } from 'app/shared/model/microprocess/task-item.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskItemUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskItemUpdate = (props: ITaskItemUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskItemEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/task-item' + props.location.search);
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
    if (errors.length === 0) {
      const entity = {
        ...taskItemEntity,
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
          <h2 id="microgatewayApp.microprocessTaskItem.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskItem.home.createOrEditLabel">Create or edit a TaskItem</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskItemEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-item-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-item-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="task-item-name">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.name">Name</Translate>
                </Label>
                <AvField
                  id="task-item-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="task-item-taskId">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="task-item-taskId"
                  type="string"
                  className="form-control"
                  name="taskId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="checkedLabel">
                  <AvInput id="task-item-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="checkerIdLabel" for="task-item-checkerId">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerId">Checker Id</Translate>
                </Label>
                <AvField
                  id="task-item-checkerId"
                  type="string"
                  className="form-control"
                  name="checkerId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="checkerNameLabel" for="task-item-checkerName">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerName">Checker Name</Translate>
                </Label>
                <AvField
                  id="task-item-checkerName"
                  type="text"
                  name="checkerName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="checkerEmailLabel" for="task-item-checkerEmail">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.checkerEmail">Checker Email</Translate>
                </Label>
                <AvField id="task-item-checkerEmail" type="text" name="checkerEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="task-item-editorId">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.editorId">Editor Id</Translate>
                </Label>
                <AvField id="task-item-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <AvGroup>
                <Label id="editorEmailLabel" for="task-item-editorEmail">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.editorEmail">Editor Email</Translate>
                </Label>
                <AvField id="task-item-editorEmail" type="text" name="editorEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="editorNameLabel" for="task-item-editorName">
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.editorName">Editor Name</Translate>
                </Label>
                <AvField id="task-item-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="task-item-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.microprocessTaskItem.required">Required</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/task-item" replace color="info">
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
  taskItemEntity: storeState.taskItem.entity,
  loading: storeState.taskItem.loading,
  updating: storeState.taskItem.updating,
  updateSuccess: storeState.taskItem.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemUpdate);
