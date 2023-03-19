import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcessCategory } from 'app/shared/model/microprocess/process-category.model';
import { getEntities as getProcessCategories } from 'app/entities/microprocess/process-category/process-category.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './process.reducer';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessUpdate = (props: IProcessUpdateProps) => {
  const [categoryId, setCategoryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { processEntity, processCategories, loading, updating } = props;

  const { label, description } = processEntity;

  const handleClose = () => {
    props.history.push('/process' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcessCategories();
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
    values.canceledAt = convertDateTimeToServer(values.canceledAt);
    values.previewStartAt = convertDateTimeToServer(values.previewStartAt);
    values.startAt = convertDateTimeToServer(values.startAt);
    values.previewFinishAt = convertDateTimeToServer(values.previewFinishAt);
    values.finishedAt = convertDateTimeToServer(values.finishedAt);
    values.createdAt = convertDateTimeToServer(values.createdAt);

    if (errors.length === 0) {
      const entity = {
        ...processEntity,
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
          <h2 id="microgatewayApp.microprocessProcess.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessProcess.home.createOrEditLabel">Create or edit a Process</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="process-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="process-label">
                  <Translate contentKey="microgatewayApp.microprocessProcess.label">Label</Translate>
                </Label>
                <AvInput
                  id="process-label"
                  type="textarea"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="process-description">
                  <Translate contentKey="microgatewayApp.microprocessProcess.description">Description</Translate>
                </Label>
                <AvInput id="process-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="priorityLevelLabel" for="process-priorityLevel">
                  <Translate contentKey="microgatewayApp.microprocessProcess.priorityLevel">Priority Level</Translate>
                </Label>
                <AvInput
                  id="process-priorityLevel"
                  type="select"
                  className="form-control"
                  name="priorityLevel"
                  value={(!isNew && processEntity.priorityLevel) || 'VERYHIGTH'}
                >
                  <option value="VERYHIGTH">{translate('microgatewayApp.ProcessPriority.VERYHIGTH')}</option>
                  <option value="HIGHT">{translate('microgatewayApp.ProcessPriority.HIGHT')}</option>
                  <option value="LOW">{translate('microgatewayApp.ProcessPriority.LOW')}</option>
                  <option value="VERYLOW">{translate('microgatewayApp.ProcessPriority.VERYLOW')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="canceledAtLabel" for="process-canceledAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.canceledAt">Canceled At</Translate>
                </Label>
                <AvInput
                  id="process-canceledAt"
                  type="datetime-local"
                  className="form-control"
                  name="canceledAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.canceledAt)}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="process-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprocessProcess.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="previewStartAtLabel" for="process-previewStartAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.previewStartAt">Preview Start At</Translate>
                </Label>
                <AvInput
                  id="process-previewStartAt"
                  type="datetime-local"
                  className="form-control"
                  name="previewStartAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.previewStartAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="process-startAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="process-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="previewFinishAtLabel" for="process-previewFinishAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.previewFinishAt">Preview Finish At</Translate>
                </Label>
                <AvInput
                  id="process-previewFinishAt"
                  type="datetime-local"
                  className="form-control"
                  name="previewFinishAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.previewFinishAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="finishedAtLabel" for="process-finishedAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.finishedAt">Finished At</Translate>
                </Label>
                <AvInput
                  id="process-finishedAt"
                  type="datetime-local"
                  className="form-control"
                  name="finishedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.finishedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="process-createdAt">
                  <Translate contentKey="microgatewayApp.microprocessProcess.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="process-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startCountLabel" for="process-startCount">
                  <Translate contentKey="microgatewayApp.microprocessProcess.startCount">Start Count</Translate>
                </Label>
                <AvField id="process-startCount" type="string" className="form-control" name="startCount" />
              </AvGroup>
              <AvGroup>
                <Label id="modelIdLabel" for="process-modelId">
                  <Translate contentKey="microgatewayApp.microprocessProcess.modelId">Model Id</Translate>
                </Label>
                <AvField id="process-modelId" type="string" className="form-control" name="modelId" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="process-editorId">
                  <Translate contentKey="microgatewayApp.microprocessProcess.editorId">Editor Id</Translate>
                </Label>
                <AvField id="process-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <AvGroup>
                <Label id="procedureIdLabel" for="process-procedureId">
                  <Translate contentKey="microgatewayApp.microprocessProcess.procedureId">Procedure Id</Translate>
                </Label>
                <AvField id="process-procedureId" type="string" className="form-control" name="procedureId" />
              </AvGroup>
              <AvGroup>
                <Label id="runnableProcessIdLabel" for="process-runnableProcessId">
                  <Translate contentKey="microgatewayApp.microprocessProcess.runnableProcessId">Runnable Process Id</Translate>
                </Label>
                <AvField id="process-runnableProcessId" type="string" className="form-control" name="runnableProcessId" />
              </AvGroup>
              <AvGroup>
                <Label id="queryIdLabel" for="process-queryId">
                  <Translate contentKey="microgatewayApp.microprocessProcess.queryId">Query Id</Translate>
                </Label>
                <AvField id="process-queryId" type="string" className="form-control" name="queryId" />
              </AvGroup>
              <AvGroup>
                <Label for="process-category">
                  <Translate contentKey="microgatewayApp.microprocessProcess.category">Category</Translate>
                </Label>
                <AvInput id="process-category" type="select" className="form-control" name="category.id">
                  <option value="" key="0" />
                  {processCategories
                    ? processCategories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process" replace color="info">
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
  processCategories: storeState.processCategory.entities,
  processEntity: storeState.process.entity,
  loading: storeState.process.loading,
  updating: storeState.process.updating,
  updateSuccess: storeState.process.updateSuccess,
});

const mapDispatchToProps = {
  getProcessCategories,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessUpdate);
