import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { getEntities as getQueryInstances } from 'app/entities/qmanager/query-instance/query-instance.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './query-instance-validation.reducer';
import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryInstanceValidationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationUpdate = (props: IQueryInstanceValidationUpdateProps) => {
  const [instanceId, setInstanceId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryInstanceValidationEntity, queryInstances, loading, updating } = props;

  const { justification } = queryInstanceValidationEntity;

  const handleClose = () => {
    props.history.push('/query-instance-validation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueryInstances();
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
    values.validatedAt = convertDateTimeToServer(values.validatedAt);

    if (errors.length === 0) {
      const entity = {
        ...queryInstanceValidationEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryInstanceValidation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.home.createOrEditLabel">
              Create or edit a QueryInstanceValidation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryInstanceValidationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-instance-validation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-instance-validation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="validatorIdLabel" for="query-instance-validation-validatorId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.validatorId">Validator Id</Translate>
                </Label>
                <AvField
                  id="query-instance-validation-validatorId"
                  type="string"
                  className="form-control"
                  name="validatorId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="query-instance-validation-justification">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.justification">Justification</Translate>
                </Label>
                <AvInput id="query-instance-validation-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="validatedAtLabel" for="query-instance-validation-validatedAt">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.validatedAt">Validated At</Translate>
                </Label>
                <AvInput
                  id="query-instance-validation-validatedAt"
                  type="datetime-local"
                  className="form-control"
                  name="validatedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.queryInstanceValidationEntity.validatedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="query-instance-validation-status">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.status">Status</Translate>
                </Label>
                <AvInput
                  id="query-instance-validation-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && queryInstanceValidationEntity.status) || 'INITIAL'}
                >
                  <option value="INITIAL">{translate('microgatewayApp.QueryValidationStatus.INITIAL')}</option>
                  <option value="REJECTED">{translate('microgatewayApp.QueryValidationStatus.REJECTED')}</option>
                  <option value="APPROVED">{translate('microgatewayApp.QueryValidationStatus.APPROVED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="query-instance-validation-instance">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.instance">Instance</Translate>
                </Label>
                <AvInput
                  id="query-instance-validation-instance"
                  type="select"
                  className="form-control"
                  name="instance.id"
                  value={isNew ? queryInstances[0] && queryInstances[0].id : queryInstanceValidationEntity.instance?.id}
                  required
                >
                  {queryInstances
                    ? queryInstances.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/query-instance-validation" replace color="info">
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
  queryInstances: storeState.queryInstance.entities,
  queryInstanceValidationEntity: storeState.queryInstanceValidation.entity,
  loading: storeState.queryInstanceValidation.loading,
  updating: storeState.queryInstanceValidation.updating,
  updateSuccess: storeState.queryInstanceValidation.updateSuccess,
});

const mapDispatchToProps = {
  getQueryInstances,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationUpdate);
