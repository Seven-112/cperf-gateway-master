import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-task-validation-control.reducer';
import { IProjectTaskValidationControl } from 'app/shared/model/microproject/project-task-validation-control.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskValidationControlUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskValidationControlUpdate = (props: IProjectTaskValidationControlUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskValidationControlEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-task-validation-control' + props.location.search);
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
        ...projectTaskValidationControlEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskValidationControl.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.home.createOrEditLabel">
              Create or edit a ProjectTaskValidationControl
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskValidationControlEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-validation-control-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-validation-control-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="project-task-validation-control-label">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.label">Label</Translate>
                </Label>
                <AvField
                  id="project-task-validation-control-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="project-task-validation-control-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.required">Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="project-task-validation-control-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-validation-control-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="project-task-validation-control-taskId"
                  type="string"
                  className="form-control"
                  name="taskId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-validation-control" replace color="info">
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
  projectTaskValidationControlEntity: storeState.projectTaskValidationControl.entity,
  loading: storeState.projectTaskValidationControl.loading,
  updating: storeState.projectTaskValidationControl.updating,
  updateSuccess: storeState.projectTaskValidationControl.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskValidationControlUpdate);
