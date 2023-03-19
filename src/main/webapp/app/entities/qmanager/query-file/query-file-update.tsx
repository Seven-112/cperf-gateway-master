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
import { getEntity, updateEntity, createEntity, reset } from './query-file.reducer';
import { IQueryFile } from 'app/shared/model/qmanager/query-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFileUpdate = (props: IQueryFileUpdateProps) => {
  const [queryId, setQueryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryFileEntity, queries, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueries();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...queryFileEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryFile.home.createOrEditLabel">Create or edit a QueryFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="query-file-fileId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="query-file-fileId"
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
                <Label id="fileNameLabel" for="query-file-fileName">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="query-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="query-file-query">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFile.query">Query</Translate>
                </Label>
                <AvInput
                  id="query-file-query"
                  type="select"
                  className="form-control"
                  name="query.id"
                  value={isNew ? queries[0] && queries[0].id : queryFileEntity.query?.id}
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
              <Button tag={Link} id="cancel-save" to="/query-file" replace color="info">
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
  queryFileEntity: storeState.queryFile.entity,
  loading: storeState.queryFile.loading,
  updating: storeState.queryFile.updating,
  updateSuccess: storeState.queryFile.updateSuccess,
});

const mapDispatchToProps = {
  getQueries,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFileUpdate);
