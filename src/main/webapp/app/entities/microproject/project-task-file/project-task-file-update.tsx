import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-task-file.reducer';
import { IProjectTaskFile } from 'app/shared/model/microproject/project-task-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectTaskFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskFileUpdate = (props: IProjectTaskFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectTaskFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-task-file' + props.location.search);
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
        ...projectTaskFileEntity,
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
          <h2 id="microgatewayApp.microprojectProjectTaskFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.home.createOrEditLabel">
              Create or edit a ProjectTaskFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectTaskFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-task-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-task-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="project-task-file-fileId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.fileId">File Id</Translate>
                </Label>
                <AvField id="project-task-file-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="project-task-file-fileName">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.fileName">File Name</Translate>
                </Label>
                <AvField id="project-task-file-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="project-task-file-type">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.type">Type</Translate>
                </Label>
                <AvInput
                  id="project-task-file-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && projectTaskFileEntity.type) || 'DESCRIPTION'}
                >
                  <option value="DESCRIPTION">{translate('microgatewayApp.ProjectTaskFileType.DESCRIPTION')}</option>
                  <option value="VALIDATION">{translate('microgatewayApp.ProjectTaskFileType.VALIDATION')}</option>
                  <option value="SOUMISSION">{translate('microgatewayApp.ProjectTaskFileType.SOUMISSION')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="project-task-file-taskId">
                  <Translate contentKey="microgatewayApp.microprojectProjectTaskFile.taskId">Task Id</Translate>
                </Label>
                <AvField id="project-task-file-taskId" type="string" className="form-control" name="taskId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-task-file" replace color="info">
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
  projectTaskFileEntity: storeState.projectTaskFile.entity,
  loading: storeState.projectTaskFile.loading,
  updating: storeState.projectTaskFile.updating,
  updateSuccess: storeState.projectTaskFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskFileUpdate);
