import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import { getEntities as getQueryClientTypes } from 'app/entities/qmanager/query-client-type/query-client-type.reducer';
import { getEntity, updateEntity, createEntity, reset } from './query-client.reducer';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryClientUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryClientUpdate = (props: IQueryClientUpdateProps) => {
  const [typeId, setTypeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryClientEntity, queryClientTypes, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-client' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueryClientTypes();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...queryClientEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryClient.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.createOrEditLabel">Create or edit a QueryClient</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryClientEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-client-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-client-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="query-client-name">
                  <Translate contentKey="microgatewayApp.qmanagerQueryClient.name">Name</Translate>
                </Label>
                <AvField
                  id="query-client-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="accountNumLabel" for="query-client-accountNum">
                  <Translate contentKey="microgatewayApp.qmanagerQueryClient.accountNum">Account Num</Translate>
                </Label>
                <AvField
                  id="query-client-accountNum"
                  type="text"
                  name="accountNum"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="disabledLabel">
                  <AvInput id="query-client-disabled" type="checkbox" className="form-check-input" name="disabled" />
                  <Translate contentKey="microgatewayApp.qmanagerQueryClient.disabled">Disabled</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="query-client-type">
                  <Translate contentKey="microgatewayApp.qmanagerQueryClient.type">Type</Translate>
                </Label>
                <AvInput
                  id="query-client-type"
                  type="select"
                  className="form-control"
                  name="type.id"
                  value={isNew ? queryClientTypes[0] && queryClientTypes[0].id : queryClientEntity.type?.id}
                  required
                >
                  {queryClientTypes
                    ? queryClientTypes.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/query-client" replace color="info">
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
  queryClientTypes: storeState.queryClientType.entities,
  queryClientEntity: storeState.queryClient.entity,
  loading: storeState.queryClient.loading,
  updating: storeState.queryClient.updating,
  updateSuccess: storeState.queryClient.updateSuccess,
});

const mapDispatchToProps = {
  getQueryClientTypes,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryClientUpdate);
