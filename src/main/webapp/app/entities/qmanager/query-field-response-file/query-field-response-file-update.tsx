import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQueryFieldResponse } from 'app/shared/model/qmanager/query-field-response.model';
import { getEntities as getQueryFieldResponses } from 'app/entities/qmanager/query-field-response/query-field-response.reducer';
import { getEntity, updateEntity, createEntity, reset } from './query-field-response-file.reducer';
import { IQueryFieldResponseFile } from 'app/shared/model/qmanager/query-field-response-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryFieldResponseFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFieldResponseFileUpdate = (props: IQueryFieldResponseFileUpdateProps) => {
  const [queryFieldResponseId, setQueryFieldResponseId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryFieldResponseFileEntity, queryFieldResponses, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-field-response-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueryFieldResponses();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...queryFieldResponseFileEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryFieldResponseFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.home.createOrEditLabel">
              Create or edit a QueryFieldResponseFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryFieldResponseFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-field-response-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-field-response-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="query-field-response-file-fileId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="query-field-response-file-fileId"
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
                <Label id="fileNameLabel" for="query-field-response-file-fileName">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="query-field-response-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="query-field-response-file-queryFieldResponse">
                  <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.queryFieldResponse">Query Field Response</Translate>
                </Label>
                <AvInput
                  id="query-field-response-file-queryFieldResponse"
                  type="select"
                  className="form-control"
                  name="queryFieldResponse.id"
                  value={isNew ? queryFieldResponses[0] && queryFieldResponses[0].id : queryFieldResponseFileEntity.queryFieldResponse?.id}
                  required
                >
                  {queryFieldResponses
                    ? queryFieldResponses.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/query-field-response-file" replace color="info">
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
  queryFieldResponses: storeState.queryFieldResponse.entities,
  queryFieldResponseFileEntity: storeState.queryFieldResponseFile.entity,
  loading: storeState.queryFieldResponseFile.loading,
  updating: storeState.queryFieldResponseFile.updating,
  updateSuccess: storeState.queryFieldResponseFile.updateSuccess,
});

const mapDispatchToProps = {
  getQueryFieldResponses,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFieldResponseFileUpdate);
