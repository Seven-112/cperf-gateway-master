import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITaskStatusTraking } from 'app/shared/model/microprocess/task-status-traking.model';
import { getEntities as getTaskStatusTrakings } from 'app/entities/microprocess/task-status-traking/task-status-traking.reducer';
import { getEntity, updateEntity, createEntity, reset } from './task-status-traking-file.reducer';
import { ITaskStatusTrakingFile } from 'app/shared/model/microprocess/task-status-traking-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskStatusTrakingFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskStatusTrakingFileUpdate = (props: ITaskStatusTrakingFileUpdateProps) => {
  const [trackId, setTrackId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { taskStatusTrakingFileEntity, taskStatusTrakings, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/task-status-traking-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTaskStatusTrakings();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...taskStatusTrakingFileEntity,
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
          <h2 id="microgatewayApp.microprocessTaskStatusTrakingFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.home.createOrEditLabel">
              Create or edit a TaskStatusTrakingFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : taskStatusTrakingFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="task-status-traking-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="task-status-traking-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="task-status-traking-file-fileId">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="task-status-traking-file-fileId"
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
                <Label id="fileNameLabel" for="task-status-traking-file-fileName">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="task-status-traking-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="task-status-traking-file-track">
                  <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.track">Track</Translate>
                </Label>
                <AvInput
                  id="task-status-traking-file-track"
                  type="select"
                  className="form-control"
                  name="track.id"
                  value={isNew ? taskStatusTrakings[0] && taskStatusTrakings[0].id : taskStatusTrakingFileEntity.track?.id}
                  required
                >
                  {taskStatusTrakings
                    ? taskStatusTrakings.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/task-status-traking-file" replace color="info">
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
  taskStatusTrakings: storeState.taskStatusTraking.entities,
  taskStatusTrakingFileEntity: storeState.taskStatusTrakingFile.entity,
  loading: storeState.taskStatusTrakingFile.loading,
  updating: storeState.taskStatusTrakingFile.updating,
  updateSuccess: storeState.taskStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = {
  getTaskStatusTrakings,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingFileUpdate);
