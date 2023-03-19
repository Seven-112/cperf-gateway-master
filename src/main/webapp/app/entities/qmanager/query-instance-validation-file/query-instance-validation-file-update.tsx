import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';
import { getEntities as getQueryInstanceValidations } from 'app/entities/qmanager/query-instance-validation/query-instance-validation.reducer';
import { getEntity, updateEntity, createEntity, reset } from './query-instance-validation-file.reducer';
import { IQueryInstanceValidationFile } from 'app/shared/model/qmanager/query-instance-validation-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryInstanceValidationFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationFileUpdate = (props: IQueryInstanceValidationFileUpdateProps) => {
  const [validationId, setValidationId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryInstanceValidationFileEntity, queryInstanceValidations, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-instance-validation-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQueryInstanceValidations();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...queryInstanceValidationFileEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryInstanceValidationFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.home.createOrEditLabel">
              Create or edit a QueryInstanceValidationFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryInstanceValidationFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-instance-validation-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-instance-validation-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileNameLabel" for="query-instance-validation-file-fileName">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="query-instance-validation-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="query-instance-validation-file-fileId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="query-instance-validation-file-fileId"
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
                <Label for="query-instance-validation-file-validation">
                  <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.validation">Validation</Translate>
                </Label>
                <AvInput
                  id="query-instance-validation-file-validation"
                  type="select"
                  className="form-control"
                  name="validation.id"
                  value={
                    isNew ? queryInstanceValidations[0] && queryInstanceValidations[0].id : queryInstanceValidationFileEntity.validation?.id
                  }
                  required
                >
                  {queryInstanceValidations
                    ? queryInstanceValidations.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/query-instance-validation-file" replace color="info">
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
  queryInstanceValidations: storeState.queryInstanceValidation.entities,
  queryInstanceValidationFileEntity: storeState.queryInstanceValidationFile.entity,
  loading: storeState.queryInstanceValidationFile.loading,
  updating: storeState.queryInstanceValidationFile.updating,
  updateSuccess: storeState.queryInstanceValidationFile.updateSuccess,
});

const mapDispatchToProps = {
  getQueryInstanceValidations,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationFileUpdate);
