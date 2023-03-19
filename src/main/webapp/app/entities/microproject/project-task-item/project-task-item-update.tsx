import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-task-item.reducer';
import { IProjectTaskItem } from 'app/shared/model/microproject/project-task-item.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskItemUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskItemUpdate = (props: IProjectTaskItemUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskItemEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-task-item' + props.location.search);
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
        ...projectTaskItemEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskItem.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.home.createOrEditLabel">
              Create or edit a ProjectTaskItem
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskItemEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-item-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-item-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="project-task-item-name">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.name">Name</Translate>
                </Label>
                <AvField
                  id="project-task-item-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-item-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="project-task-item-taskId"
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
                  <AvInput id="project-task-item-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="checkerIdLabel" for="project-task-item-checkerId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerId">Checker Id</Translate>
                </Label>
                <AvField
                  id="project-task-item-checkerId"
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
                <Label id="checkerNameLabel" for="project-task-item-checkerName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerName">Checker Name</Translate>
                </Label>
                <AvField
                  id="project-task-item-checkerName"
                  type="text"
                  name="checkerName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="checkerEmailLabel" for="project-task-item-checkerEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.checkerEmail">Checker Email</Translate>
                </Label>
                <AvField id="project-task-item-checkerEmail" type="text" name="checkerEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="project-task-item-editorId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorId">Editor Id</Translate>
                </Label>
                <AvField id="project-task-item-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <AvGroup>
                <Label id="editorEmailLabel" for="project-task-item-editorEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorEmail">Editor Email</Translate>
                </Label>
                <AvField id="project-task-item-editorEmail" type="text" name="editorEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="editorNameLabel" for="project-task-item-editorName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.editorName">Editor Name</Translate>
                </Label>
                <AvField id="project-task-item-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="project-task-item-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskItem.required">Required</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-item" replace color="info">
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
  projectTaskItemEntity: storeState.projectTaskItem.entity,
  loading: storeState.projectTaskItem.loading,
  updating: storeState.projectTaskItem.updating,
  updateSuccess: storeState.projectTaskItem.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskItemUpdate);
