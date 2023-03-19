import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IControlType } from 'app/shared/model/microrisque/control-type.model';
import { getEntities as getControlTypes } from 'app/entities/microrisque/control-type/control-type.reducer';
import { IControlMaturity } from 'app/shared/model/microrisque/control-maturity.model';
import { getEntities as getControlMaturities } from 'app/entities/microrisque/control-maturity/control-maturity.reducer';
import { IRisk } from 'app/shared/model/microrisque/risk.model';
import { getEntities as getRisks } from 'app/entities/microrisque/risk/risk.reducer';
import { getEntity, updateEntity, createEntity, reset } from './control.reducer';
import { IControl } from 'app/shared/model/microrisque/control.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IControlUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ControlUpdate = (props: IControlUpdateProps) => {
  const [typeId, setTypeId] = useState('0');
  const [maturityId, setMaturityId] = useState('0');
  const [riskId, setRiskId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { controlEntity, controlTypes, controlMaturities, risks, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/control' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getControlTypes();
    props.getControlMaturities();
    props.getRisks();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...controlEntity,
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
          <h2 id="microgatewayApp.microrisqueControl.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueControl.home.createOrEditLabel">Create or edit a Control</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : controlEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="control-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="control-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="descriptionLabel" for="control-description">
                  <Translate contentKey="microgatewayApp.microrisqueControl.description">Description</Translate>
                </Label>
                <AvField
                  id="control-description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="validationRequiredLabel">
                  <AvInput id="control-validationRequired" type="checkbox" className="form-check-input" name="validationRequired" />
                  <Translate contentKey="microgatewayApp.microrisqueControl.validationRequired">Validation Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="control-type">
                  <Translate contentKey="microgatewayApp.microrisqueControl.type">Type</Translate>
                </Label>
                <AvInput
                  id="control-type"
                  type="select"
                  className="form-control"
                  name="type.id"
                  value={isNew ? controlTypes[0] && controlTypes[0].id : controlEntity.type?.id}
                  required
                >
                  {controlTypes
                    ? controlTypes.map(otherEntity => (
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
                <Label for="control-maturity">
                  <Translate contentKey="microgatewayApp.microrisqueControl.maturity">Maturity</Translate>
                </Label>
                <AvInput
                  id="control-maturity"
                  type="select"
                  className="form-control"
                  name="maturity.id"
                  value={isNew ? controlMaturities[0] && controlMaturities[0].id : controlEntity.maturity?.id}
                  required
                >
                  {controlMaturities
                    ? controlMaturities.map(otherEntity => (
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
                <Label for="control-risk">
                  <Translate contentKey="microgatewayApp.microrisqueControl.risk">Risk</Translate>
                </Label>
                <AvInput id="control-risk" type="select" className="form-control" name="risk.id">
                  <option value="" key="0" />
                  {risks
                    ? risks.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/control" replace color="info">
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
  controlTypes: storeState.controlType.entities,
  controlMaturities: storeState.controlMaturity.entities,
  risks: storeState.risk.entities,
  controlEntity: storeState.control.entity,
  loading: storeState.control.loading,
  updating: storeState.control.updating,
  updateSuccess: storeState.control.updateSuccess,
});

const mapDispatchToProps = {
  getControlTypes,
  getControlMaturities,
  getRisks,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ControlUpdate);
