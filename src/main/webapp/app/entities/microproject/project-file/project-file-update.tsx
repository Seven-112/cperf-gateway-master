import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-file.reducer';
import { IProjectFile } from 'app/shared/model/microproject/project-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectFileUpdate = (props: IProjectFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectFileEntity, loading, updating } = props;

  const { description } = projectFileEntity;

  const handleClose = () => {
    props.history.push('/project-file' + props.location.search);
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
        ...projectFileEntity,
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
          <h2 id="microgatewayApp.microprojectProjectFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectFile.home.createOrEditLabel">Create or edit a ProjectFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="project-file-fileId">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.fileId">File Id</Translate>
                </Label>
                <AvField id="project-file-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="project-file-fileName">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.fileName">File Name</Translate>
                </Label>
                <AvField id="project-file-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="project-file-description">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.description">Description</Translate>
                </Label>
                <AvInput id="project-file-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="fileTypeLabel" for="project-file-fileType">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.fileType">File Type</Translate>
                </Label>
                <AvInput
                  id="project-file-fileType"
                  type="select"
                  className="form-control"
                  name="fileType"
                  value={(!isNew && projectFileEntity.fileType) || 'DESCRIPTION'}
                >
                  <option value="DESCRIPTION">{translate('microgatewayApp.ProjectFileType.DESCRIPTION')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="projectIdLabel" for="project-file-projectId">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.projectId">Project Id</Translate>
                </Label>
                <AvField id="project-file-projectId" type="string" className="form-control" name="projectId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="project-file-userId">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.userId">User Id</Translate>
                </Label>
                <AvField id="project-file-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userNameLabel" for="project-file-userName">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.userName">User Name</Translate>
                </Label>
                <AvField id="project-file-userName" type="text" name="userName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="project-file-userEmail">
                  <Translate contentKey="microgatewayApp.microprojectProjectFile.userEmail">User Email</Translate>
                </Label>
                <AvField id="project-file-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-file" replace color="info">
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
  projectFileEntity: storeState.projectFile.entity,
  loading: storeState.projectFile.loading,
  updating: storeState.projectFile.updating,
  updateSuccess: storeState.projectFile.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectFileUpdate);
