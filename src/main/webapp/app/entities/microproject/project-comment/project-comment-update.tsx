import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-comment.reducer';
import { IProjectComment } from 'app/shared/model/microproject/project-comment.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectCommentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCommentUpdate = (props: IProjectCommentUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectCommentEntity, loading, updating } = props;

  const { content } = projectCommentEntity;

  const handleClose = () => {
    props.history.push('/project-comment' + props.location.search);
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
    if (errors.length === 0) {
      const entity = {
        ...projectCommentEntity,
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
          <h2 id="microgatewayApp.microprojectProjectComment.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectComment.home.createOrEditLabel">
              Create or edit a ProjectComment
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectCommentEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-comment-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-comment-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="projectIdLabel" for="project-comment-projectId">
                  <Translate contentKey="microgatewayApp.microprojectProjectComment.projectId">Project Id</Translate>
                </Label>
                <AvField
                  id="project-comment-projectId"
                  type="string"
                  className="form-control"
                  name="projectId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="project-comment-userId">
                  <Translate contentKey="microgatewayApp.microprojectProjectComment.userId">User Id</Translate>
                </Label>
                <AvField id="project-comment-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userNameLabel" for="project-comment-userName">
                  <Translate contentKey="microgatewayApp.microprojectProjectComment.userName">User Name</Translate>
                </Label>
                <AvField id="project-comment-userName" type="text" name="userName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="project-comment-userEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectComment.userEmail">User Email</Translate>
                </Label>
                <AvField id="project-comment-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="project-comment-content">
                  <Translate contentKey="microgatewayApp.microprojectProjectComment.content">Content</Translate>
                </Label>
                <AvInput id="project-comment-content" type="textarea" name="content" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-comment" replace color="info">
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
  projectCommentEntity: storeState.projectComment.entity,
  loading: storeState.projectComment.loading,
  updating: storeState.projectComment.updating,
  updateSuccess: storeState.projectComment.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCommentUpdate);
