import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IRiskType } from 'app/shared/model/microrisque/risk-type.model';
import { getEntities as getRiskTypes } from 'app/entities/microrisque/risk-type/risk-type.reducer';
import { getEntity, updateEntity, createEntity, reset } from './risk.reducer';
import { IRisk } from 'app/shared/model/microrisque/risk.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRiskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RiskUpdate = (props: IRiskUpdateProps) => {
  const [typeId, setTypeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { riskEntity, riskTypes, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/risk' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getRiskTypes();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...riskEntity,
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
          <h2 id="microgatewayApp.microrisqueRisk.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueRisk.home.createOrEditLabel">Create or edit a Risk</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : riskEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="risk-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="risk-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="risk-label">
                  <Translate contentKey="microgatewayApp.microrisqueRisk.label">Label</Translate>
                </Label>
                <AvField
                  id="risk-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="probabilityLabel" for="risk-probability">
                  <Translate contentKey="microgatewayApp.microrisqueRisk.probability">Probability</Translate>
                </Label>
                <AvField id="risk-probability" type="string" className="form-control" name="probability" />
              </AvGroup>
              <AvGroup>
                <Label id="gravityLabel" for="risk-gravity">
                  <Translate contentKey="microgatewayApp.microrisqueRisk.gravity">Gravity</Translate>
                </Label>
                <AvField id="risk-gravity" type="string" className="form-control" name="gravity" />
              </AvGroup>
              <AvGroup>
                <Label id="causeLabel" for="risk-cause">
                  <Translate contentKey="microgatewayApp.microrisqueRisk.cause">Cause</Translate>
                </Label>
                <AvField id="risk-cause" type="text" name="cause" />
              </AvGroup>
              <AvGroup>
                <Label for="risk-type">
                  <Translate contentKey="microgatewayApp.microrisqueRisk.type">Type</Translate>
                </Label>
                <AvInput
                  id="risk-type"
                  type="select"
                  className="form-control"
                  name="type.id"
                  value={isNew ? riskTypes[0] && riskTypes[0].id : riskEntity.type?.id}
                  required
                >
                  {riskTypes
                    ? riskTypes.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/risk" replace color="info">
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
  riskTypes: storeState.riskType.entities,
  riskEntity: storeState.risk.entity,
  loading: storeState.risk.loading,
  updating: storeState.risk.updating,
  updateSuccess: storeState.risk.updateSuccess,
});

const mapDispatchToProps = {
  getRiskTypes,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RiskUpdate);
