import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQuery } from 'app/shared/model/qmanager/query.model';
import { getEntities as getQueries } from 'app/entities/qmanager/query/query.reducer';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { getEntities as getQueryClients } from 'app/entities/qmanager/query-client/query-client.reducer';
import { getEntity, updateEntity, createEntity, reset } from './query-instance.reducer';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryInstanceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceUpdate = (props: IQueryInstanceUpdateProps) => {
  const [queryId, setQueryId] = useState('0');
  const [clientId, setClientId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryInstanceEntity, queries, queryClients, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-instance' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueries();
    props.getQueryClients();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.startAt = convertDateTimeToServer(values.startAt);

    if (errors.length === 0) {
      const entity = {
        ...queryInstanceEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryInstance.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryInstance.home.createOrEditLabel">Create or edit a QueryInstance</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryInstanceEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-instance-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-instance-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="query-instance-name">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.name">Name</Translate>
                </Label>
                <AvField
                  id="query-instance-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="query-instance-startAt">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="query-instance-startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.queryInstanceEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="query-instance-userId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.userId">User Id</Translate>
                </Label>
                <AvField
                  id="query-instance-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="query-instance-status">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.status">Status</Translate>
                </Label>
                <AvInput
                  id="query-instance-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && queryInstanceEntity.status) || 'WAIT_VALIDATION'}
                >
                  <option value="WAIT_VALIDATION">{translate('microgatewayApp.QueryInstanceStatus.WAIT_VALIDATION')}</option>
                  <option value="REJECTED">{translate('microgatewayApp.QueryInstanceStatus.REJECTED')}</option>
                  <option value="VALIDATED">{translate('microgatewayApp.QueryInstanceStatus.VALIDATED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="ponctualLabel">
                  <AvInput id="query-instance-ponctual" type="checkbox" className="form-check-input" name="ponctual" />
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.ponctual">Ponctual</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="query-instance-query">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.query">Query</Translate>
                </Label>
                <AvInput
                  id="query-instance-query"
                  type="select"
                  className="form-control"
                  name="query.id"
                  value={isNew ? queries[0] && queries[0].id : queryInstanceEntity.query?.id}
                  required
                >
                  {queries
                    ? queries.map(otherEntity => (
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
              <AvGroup>
                <Label for="query-instance-client">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstance.client">Client</Translate>
                </Label>
                <AvInput id="query-instance-client" type="select" className="form-control" name="client.id">
                  <option value="" key="0" />
                  {queryClients
                    ? queryClients.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/query-instance" replace color="info">
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
  queries: storeState.query.entities,
  queryClients: storeState.queryClient.entities,
  queryInstanceEntity: storeState.queryInstance.entity,
  loading: storeState.queryInstance.loading,
  updating: storeState.queryInstance.updating,
  updateSuccess: storeState.queryInstance.updateSuccess,
});

const mapDispatchToProps = {
  getQueries,
  getQueryClients,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceUpdate);
