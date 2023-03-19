import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './query-user-validator.reducer';
import { IQueryUserValidator } from 'app/shared/model/qmanager/query-user-validator.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQueryUserValidatorUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryUserValidatorUpdate = (props: IQueryUserValidatorUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { queryUserValidatorEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/query-user-validator' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...queryUserValidatorEntity,
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
          <h2 id="microgatewayApp.qmanagerQueryUserValidator.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.home.createOrEditLabel">
              Create or edit a QueryUserValidator
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : queryUserValidatorEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="query-user-validator-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="query-user-validator-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="validatorIdLabel" for="query-user-validator-validatorId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validatorId">Validator Id</Translate>
                </Label>
                <AvField
                  id="query-user-validator-validatorId"
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
                <Label id="previewValidatorIdLabel" for="query-user-validator-previewValidatorId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.previewValidatorId">Preview Validator Id</Translate>
                </Label>
                <AvField id="query-user-validator-previewValidatorId" type="string" className="form-control" name="previewValidatorId" />
              </AvGroup>
              <AvGroup>
                <Label id="validationDeleyLimitLabel" for="query-user-validator-validationDeleyLimit">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validationDeleyLimit">Validation Deley Limit</Translate>
                </Label>
                <AvField
                  id="query-user-validator-validationDeleyLimit"
                  type="string"
                  className="form-control"
                  name="validationDeleyLimit"
                />
              </AvGroup>
              <AvGroup>
                <Label id="validationDeleyLimitUnityLabel" for="query-user-validator-validationDeleyLimitUnity">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validationDeleyLimitUnity">
                    Validation Deley Limit Unity
                  </Translate>
                </Label>
                <AvInput
                  id="query-user-validator-validationDeleyLimitUnity"
                  type="select"
                  className="form-control"
                  name="validationDeleyLimitUnity"
                  value={(!isNew && queryUserValidatorEntity.validationDeleyLimitUnity) || 'SECOND'}
                >
                  <option value="SECOND">{translate('microgatewayApp.QPeriodUnity.SECOND')}</option>
                  <option value="MINUTE">{translate('microgatewayApp.QPeriodUnity.MINUTE')}</option>
                  <option value="HOUR">{translate('microgatewayApp.QPeriodUnity.HOUR')}</option>
                  <option value="DAY">{translate('microgatewayApp.QPeriodUnity.DAY')}</option>
                  <option value="MONTH">{translate('microgatewayApp.QPeriodUnity.MONTH')}</option>
                  <option value="YEAR">{translate('microgatewayApp.QPeriodUnity.YEAR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="query-user-validator-userId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.userId">User Id</Translate>
                </Label>
                <AvField
                  id="query-user-validator-userId"
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
                <Label id="queryIdLabel" for="query-user-validator-queryId">
                  <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.queryId">Query Id</Translate>
                </Label>
                <AvField
                  id="query-user-validator-queryId"
                  type="string"
                  className="form-control"
                  name="queryId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/query-user-validator" replace color="info">
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
  queryUserValidatorEntity: storeState.queryUserValidator.entity,
  loading: storeState.queryUserValidator.loading,
  updating: storeState.queryUserValidator.updating,
  updateSuccess: storeState.queryUserValidator.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryUserValidatorUpdate);
