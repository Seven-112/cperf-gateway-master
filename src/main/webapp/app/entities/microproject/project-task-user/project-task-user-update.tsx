import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-task-user.reducer';
import { IProjectTaskUser } from 'app/shared/model/microproject/project-task-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskUserUpdate = (props: IProjectTaskUserUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskUserEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-task-user' + props.location.search);
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
        ...projectTaskUserEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskUser.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.home.createOrEditLabel">
              Create or edit a ProjectTaskUser
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="project-task-user-userId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userId">User Id</Translate>
                </Label>
                <AvField id="project-task-user-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userNameLabel" for="project-task-user-userName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userName">User Name</Translate>
                </Label>
                <AvField
                  id="project-task-user-userName"
                  type="text"
                  name="userName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="project-task-user-userEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.userEmail">User Email</Translate>
                </Label>
                <AvField
                  id="project-task-user-userEmail"
                  type="text"
                  name="userEmail"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="roleLabel" for="project-task-user-role">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.role">Role</Translate>
                </Label>
                <AvInput
                  id="project-task-user-role"
                  type="select"
                  className="form-control"
                  name="role"
                  value={(!isNew && projectTaskUserEntity.role) || 'EXCEUTOR'}
                >
                  <option value="EXCEUTOR">{translate('microgatewayApp.ProjectTaskUserRole.EXCEUTOR')}</option>
                  <option value="VALIDATOR">{translate('microgatewayApp.ProjectTaskUserRole.VALIDATOR')}</option>
                  <option value="SUBMITOR">{translate('microgatewayApp.ProjectTaskUserRole.SUBMITOR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-user-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskUser.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="project-task-user-taskId"
                  type="string"
                  className="form-control"
                  name="taskId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-user" replace color="info">
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
  projectTaskUserEntity: storeState.projectTaskUser.entity,
  loading: storeState.projectTaskUser.loading,
  updating: storeState.projectTaskUser.updating,
  updateSuccess: storeState.projectTaskUser.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskUserUpdate);
