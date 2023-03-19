import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { getEntities as getTypeindicators } from 'app/entities/typeindicator/typeindicator.reducer';
import { IObjectif } from 'app/shared/model/objectif.model';
import { getEntities as getObjectifs } from 'app/entities/objectif/objectif.reducer';
import { getEntities as getIndicators } from 'app/entities/indicator/indicator.reducer';
import { getEntity, updateEntity, createEntity, reset } from './indicator.reducer';
import { IIndicator } from 'app/shared/model/indicator.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IIndicatorUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const IndicatorUpdate = (props: IIndicatorUpdateProps) => {
  const [typeindicatorId, setTypeindicatorId] = useState('0');
  const [objectifId, setObjectifId] = useState('0');
  const [parentId, setParentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { indicatorEntity, typeindicators, objectifs, indicators, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/indicator' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTypeindicators();
    props.getObjectifs();
    props.getIndicators();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...indicatorEntity,
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
          <h2 id="microgatewayApp.indicator.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.indicator.home.createOrEditLabel">Create or edit a Indicator</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : indicatorEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="indicator-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="indicator-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="expectedResultNumberLabel" for="indicator-expectedResultNumber">
                  <Translate contentKey="microgatewayApp.indicator.expectedResultNumber">Expected Result Number</Translate>
                </Label>
                <AvField id="indicator-expectedResultNumber" type="string" className="form-control" name="expectedResultNumber" />
              </AvGroup>
              <AvGroup>
                <Label id="resultUnityLabel" for="indicator-resultUnity">
                  <Translate contentKey="microgatewayApp.indicator.resultUnity">Result Unity</Translate>
                </Label>
                <AvField
                  id="indicator-resultUnity"
                  type="text"
                  name="resultUnity"
                  validate={{
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="labelLabel" for="indicator-label">
                  <Translate contentKey="microgatewayApp.indicator.label">Label</Translate>
                </Label>
                <AvField
                  id="indicator-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="questionLabel" for="indicator-question">
                  <Translate contentKey="microgatewayApp.indicator.question">Question</Translate>
                </Label>
                <AvField id="indicator-question" type="text" name="question" />
              </AvGroup>
              <AvGroup check>
                <Label id="resultEditableByActorLabel">
                  <AvInput id="indicator-resultEditableByActor" type="checkbox" className="form-check-input" name="resultEditableByActor" />
                  <Translate contentKey="microgatewayApp.indicator.resultEditableByActor">Result Editable By Actor</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="numberResultLabel" for="indicator-numberResult">
                  <Translate contentKey="microgatewayApp.indicator.numberResult">Number Result</Translate>
                </Label>
                <AvField id="indicator-numberResult" type="string" className="form-control" name="numberResult" />
              </AvGroup>
              <AvGroup>
                <Label id="percentResultLabel" for="indicator-percentResult">
                  <Translate contentKey="microgatewayApp.indicator.percentResult">Percent Result</Translate>
                </Label>
                <AvField id="indicator-percentResult" type="string" className="form-control" name="percentResult" />
              </AvGroup>
              <AvGroup>
                <Label id="resultAppreciationLabel" for="indicator-resultAppreciation">
                  <Translate contentKey="microgatewayApp.indicator.resultAppreciation">Result Appreciation</Translate>
                </Label>
                <AvField
                  id="indicator-resultAppreciation"
                  type="text"
                  name="resultAppreciation"
                  validate={{
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="averagePercentageLabel" for="indicator-averagePercentage">
                  <Translate contentKey="microgatewayApp.indicator.averagePercentage">Average Percentage</Translate>
                </Label>
                <AvField id="indicator-averagePercentage" type="string" className="form-control" name="averagePercentage" />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="indicator-ponderation">
                  <Translate contentKey="microgatewayApp.indicator.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="indicator-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup>
                <Label for="indicator-typeindicator">
                  <Translate contentKey="microgatewayApp.indicator.typeindicator">Typeindicator</Translate>
                </Label>
                <AvInput id="indicator-typeindicator" type="select" className="form-control" name="typeindicator.id">
                  <option value="" key="0" />
                  {typeindicators
                    ? typeindicators.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="indicator-objectif">
                  <Translate contentKey="microgatewayApp.indicator.objectif">Objectif</Translate>
                </Label>
                <AvInput
                  id="indicator-objectif"
                  type="select"
                  className="form-control"
                  name="objectif.id"
                  value={isNew ? objectifs[0] && objectifs[0].id : indicatorEntity.objectif?.id}
                  required
                >
                  {objectifs
                    ? objectifs.map(otherEntity => (
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
                <Label for="indicator-parent">
                  <Translate contentKey="microgatewayApp.indicator.parent">Parent</Translate>
                </Label>
                <AvInput id="indicator-parent" type="select" className="form-control" name="parent.id">
                  <option value="" key="0" />
                  {indicators
                    ? indicators.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/indicator" replace color="info">
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
  typeindicators: storeState.typeindicator.entities,
  objectifs: storeState.objectif.entities,
  indicators: storeState.indicator.entities,
  indicatorEntity: storeState.indicator.entity,
  loading: storeState.indicator.loading,
  updating: storeState.indicator.updating,
  updateSuccess: storeState.indicator.updateSuccess,
});

const mapDispatchToProps = {
  getTypeindicators,
  getObjectifs,
  getIndicators,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorUpdate);
