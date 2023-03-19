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
import { getEntity, updateEntity, createEntity, setBlob, reset } from './query-field-response.reducer';
import { IQueryFieldResponse } from 'app/shared/model/qmanager/query-field-response.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryFieldResponseUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFieldResponseUpdate = (props: IQueryFieldResponseUpdateProps) => {
  const [instanceId, setInstanceId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryFieldResponseEntity, queryInstances, loading, updating } = props;

  const { val } = queryFieldResponseEntity;

  const handleClose = () => {
    props.history.push('/query-field-response' + props.location.search);
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
    if (errors.length === 0) {
      const entity = {
        ...queryFieldResponseEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryFieldResponse.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.home.createOrEditLabel">
              Create or edit a QueryFieldResponse
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryFieldResponseEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-field-response-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-field-response-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="valLabel" for="query-field-response-val">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.val">Val</Translate>
                </Label>
                <AvInput id="query-field-response-val" type="textarea" name="val" />
              </AvGroup>
              <AvGroup>
                <Label id="fieldIdLabel" for="query-field-response-fieldId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.fieldId">Field Id</Translate>
                </Label>
                <AvField
                  id="query-field-response-fieldId"
                  type="string"
                  className="form-control"
                  name="fieldId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="query-field-response-instance">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.instance">Instance</Translate>
                </Label>
                <AvInput
                  id="query-field-response-instance"
                  type="select"
                  className="form-control"
                  name="instance.id"
                  value={isNew ? queryInstances[0] && queryInstances[0].id : queryFieldResponseEntity.instance?.id}
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
              <Button tag={Link} id="cancel-save" to="/query-field-response" replace color="info">
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
  queryFieldResponseEntity: storeState.queryFieldResponse.entity,
  loading: storeState.queryFieldResponse.loading,
  updating: storeState.queryFieldResponse.updating,
  updateSuccess: storeState.queryFieldResponse.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(QueryFieldResponseUpdate);
