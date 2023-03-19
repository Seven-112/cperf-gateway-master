import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';
import { getEntities as getTenderAnswers } from 'app/entities/microprovider/tender-answer/tender-answer.reducer';
import { getEntity, updateEntity, createEntity, reset } from './provider-execution-average.reducer';
import { IProviderExecutionAverage } from 'app/shared/model/microprovider/provider-execution-average.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProviderExecutionAverageUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderExecutionAverageUpdate = (props: IProviderExecutionAverageUpdateProps) => {
  const [answerId, setAnswerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { providerExecutionAverageEntity, tenderAnswers, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/provider-execution-average' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...providerExecutionAverageEntity,
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
          <h2 id="microgatewayApp.microproviderProviderExecutionAverage.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.home.createOrEditLabel">
              Create or edit a ProviderExecutionAverage
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : providerExecutionAverageEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="provider-execution-average-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="provider-execution-average-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="providerIdLabel" for="provider-execution-average-providerId">
                  <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.providerId">Provider Id</Translate>
                </Label>
                <AvField
                  id="provider-execution-average-providerId"
                  type="string"
                  className="form-control"
                  name="providerId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="averageLabel" for="provider-execution-average-average">
                  <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.average">Average</Translate>
                </Label>
                <AvField id="provider-execution-average-average" type="string" className="form-control" name="average" />
              </AvGroup>
              <AvGroup>
                <Label id="dteLabel" for="provider-execution-average-dte">
                  <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.dte">Dte</Translate>
                </Label>
                <AvField id="provider-execution-average-dte" type="date" className="form-control" name="dte" />
              </AvGroup>
              <AvGroup>
                <Label for="provider-execution-average-answer">
                  <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.answer">Answer</Translate>
                </Label>
                <AvInput
                  id="provider-execution-average-answer"
                  type="select"
                  className="form-control"
                  name="answer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : providerExecutionAverageEntity.answer?.id}
                  required
                >
                  {tenderAnswers
                    ? tenderAnswers.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/provider-execution-average" replace color="info">
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
  tenderAnswers: storeState.tenderAnswer.entities,
  providerExecutionAverageEntity: storeState.providerExecutionAverage.entity,
  loading: storeState.providerExecutionAverage.loading,
  updating: storeState.providerExecutionAverage.updating,
  updateSuccess: storeState.providerExecutionAverage.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExecutionAverageUpdate);
