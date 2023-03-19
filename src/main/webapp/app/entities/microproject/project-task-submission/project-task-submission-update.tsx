import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-task-submission.reducer';
import { IProjectTaskSubmission } from 'app/shared/model/microproject/project-task-submission.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskSubmissionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskSubmissionUpdate = (props: IProjectTaskSubmissionUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskSubmissionEntity, loading, updating } = props;

  const { comment } = projectTaskSubmissionEntity;

  const handleClose = () => {
    props.history.push('/project-task-submission' + props.location.search);
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
    values.storeUp = convertDateTimeToServer(values.storeUp);

    if (errors.length === 0) {
      const entity = {
        ...projectTaskSubmissionEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskSubmission.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.home.createOrEditLabel">
              Create or edit a ProjectTaskSubmission
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskSubmissionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-submission-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-submission-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="submitorIdLabel" for="project-task-submission-submitorId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorId">Submitor Id</Translate>
                </Label>
                <AvField id="project-task-submission-submitorId" type="string" className="form-control" name="submitorId" />
              </AvGroup>
              <AvGroup>
                <Label id="submitorNameLabel" for="project-task-submission-submitorName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorName">Submitor Name</Translate>
                </Label>
                <AvField
                  id="project-task-submission-submitorName"
                  type="text"
                  name="submitorName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="submitorEmailLabel" for="project-task-submission-submitorEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorEmail">Submitor Email</Translate>
                </Label>
                <AvField
                  id="project-task-submission-submitorEmail"
                  type="text"
                  name="submitorEmail"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="project-task-submission-comment">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.comment">Comment</Translate>
                </Label>
                <AvInput id="project-task-submission-comment" type="textarea" name="comment" />
              </AvGroup>
              <AvGroup>
                <Label id="storeUpLabel" for="project-task-submission-storeUp">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.storeUp">Store Up</Translate>
                </Label>
                <AvInput
                  id="project-task-submission-storeUp"
                  type="datetime-local"
                  className="form-control"
                  name="storeUp"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectTaskSubmissionEntity.storeUp)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-submission-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.taskId">Task Id</Translate>
                </Label>
                <AvField
                  id="project-task-submission-taskId"
                  type="string"
                  className="form-control"
                  name="taskId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-submission" replace color="info">
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
  projectTaskSubmissionEntity: storeState.projectTaskSubmission.entity,
  loading: storeState.projectTaskSubmission.loading,
  updating: storeState.projectTaskSubmission.updating,
  updateSuccess: storeState.projectTaskSubmission.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskSubmissionUpdate);
