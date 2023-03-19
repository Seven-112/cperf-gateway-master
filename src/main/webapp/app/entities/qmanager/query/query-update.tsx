import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import { getEntities as getQCategories } from 'app/entities/qmanager/q-category/q-category.reducer';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import { getEntities as getQueryClientTypes } from 'app/entities/qmanager/query-client-type/query-client-type.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './query.reducer';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryUpdate = (props: IQueryUpdateProps) => {
  const [categoryId, setCategoryId] = useState('0');
  const [clientTypeId, setClientTypeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryEntity, qCategories, queryClientTypes, loading, updating } = props;

  const { description } = queryEntity;

  const handleClose = () => {
    props.history.push('/query' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQCategories();
    props.getQueryClientTypes();
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
        ...queryEntity,
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
          <h2 id="microgatewayApp.qmanagerQuery.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQuery.home.createOrEditLabel">Create or edit a Query</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="query-name">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.name">Name</Translate>
                </Label>
                <AvField
                  id="query-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="query-processId">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.processId">Process Id</Translate>
                </Label>
                <AvField id="query-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="query-editorId">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.editorId">Editor Id</Translate>
                </Label>
                <AvField id="query-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <AvGroup check>
                <Label id="sharedLabel">
                  <AvInput id="query-shared" type="checkbox" className="form-check-input" name="shared" />
                  <Translate contentKey="microgatewayApp.qmanagerQuery.shared">Shared</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="query-description">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.description">Description</Translate>
                </Label>
                <AvInput id="query-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup check>
                <Label id="ponctualLabel">
                  <AvInput id="query-ponctual" type="checkbox" className="form-check-input" name="ponctual" />
                  <Translate contentKey="microgatewayApp.qmanagerQuery.ponctual">Ponctual</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="query-category">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.category">Category</Translate>
                </Label>
                <AvInput id="query-category" type="select" className="form-control" name="category.id">
                  <option value="" key="0" />
                  {qCategories
                    ? qCategories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="query-clientType">
                  <Translate contentKey="microgatewayApp.qmanagerQuery.clientType">Client Type</Translate>
                </Label>
                <AvInput id="query-clientType" type="select" className="form-control" name="clientType.id">
                  <option value="" key="0" />
                  {queryClientTypes
                    ? queryClientTypes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/query" replace color="info">
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
  qCategories: storeState.qCategory.entities,
  queryClientTypes: storeState.queryClientType.entities,
  queryEntity: storeState.query.entity,
  loading: storeState.query.loading,
  updating: storeState.query.updating,
  updateSuccess: storeState.query.updateSuccess,
});

const mapDispatchToProps = {
  getQCategories,
  getQueryClientTypes,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryUpdate);
