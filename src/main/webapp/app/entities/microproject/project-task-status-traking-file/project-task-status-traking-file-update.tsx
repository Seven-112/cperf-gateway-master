import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-task-status-traking-file.reducer';
import { IProjectTaskStatusTrakingFile } from 'app/shared/model/microproject/project-task-status-traking-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskStatusTrakingFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskStatusTrakingFileUpdate = (props: IProjectTaskStatusTrakingFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskStatusTrakingFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-task-status-traking-file' + props.location.search);
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
        ...projectTaskStatusTrakingFileEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskStatusTrakingFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.home.createOrEditLabel">
              Create or edit a ProjectTaskStatusTrakingFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskStatusTrakingFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-status-traking-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-status-traking-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="project-task-status-traking-file-fileId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="project-task-status-traking-file-fileId"
                  type="string"
                  className="form-control"
                  name="fileId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="project-task-status-traking-file-fileName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="project-task-status-traking-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="trackIdLabel" for="project-task-status-traking-file-trackId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.trackId">Track Id</Translate>
                </Label>
                <AvField
                  id="project-task-status-traking-file-trackId"
                  type="string"
                  className="form-control"
                  name="trackId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-status-traking-file" replace color="info">
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
  projectTaskStatusTrakingFileEntity: storeState.projectTaskStatusTrakingFile.entity,
  loading: storeState.projectTaskStatusTrakingFile.loading,
  updating: storeState.projectTaskStatusTrakingFile.updating,
  updateSuccess: storeState.projectTaskStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingFileUpdate);
