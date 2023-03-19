import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';
import { getEntities as getTenderAnswers } from 'app/entities/microprovider/tender-answer/tender-answer.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './provider-evaluation.reducer';
import { IProviderEvaluation } from 'app/shared/model/microprovider/provider-evaluation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProviderEvaluationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderEvaluationUpdate = (props: IProviderEvaluationUpdateProps) => {
  const [answerId, setAnswerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { providerEvaluationEntity, tenderAnswers, loading, updating } = props;

  const { justification } = providerEvaluationEntity;

  const handleClose = () => {
    props.history.push('/provider-evaluation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswers();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.storeAt = convertDateTimeToServer(values.storeAt);
    values.updateAt = convertDateTimeToServer(values.updateAt);

    if (errors.length === 0) {
      const entity = {
        ...providerEvaluationEntity,
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
          <h2 id="microgatewayApp.microproviderProviderEvaluation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.home.createOrEditLabel">
              Create or edit a ProviderEvaluation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : providerEvaluationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="provider-evaluation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="provider-evaluation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="noteLabel" for="provider-evaluation-note">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.note">Note</Translate>
                </Label>
                <AvField id="provider-evaluation-note" type="string" className="form-control" name="note" />
              </AvGroup>
              <AvGroup>
                <Label id="scaleLabel" for="provider-evaluation-scale">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.scale">Scale</Translate>
                </Label>
                <AvField id="provider-evaluation-scale" type="string" className="form-control" name="scale" />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="provider-evaluation-justification">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.justification">Justification</Translate>
                </Label>
                <AvInput id="provider-evaluation-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="provider-evaluation-userId">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.userId">User Id</Translate>
                </Label>
                <AvField
                  id="provider-evaluation-userId"
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
                <Label id="storeAtLabel" for="provider-evaluation-storeAt">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.storeAt">Store At</Translate>
                </Label>
                <AvInput
                  id="provider-evaluation-storeAt"
                  type="datetime-local"
                  className="form-control"
                  name="storeAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerEvaluationEntity.storeAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updateAtLabel" for="provider-evaluation-updateAt">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.updateAt">Update At</Translate>
                </Label>
                <AvInput
                  id="provider-evaluation-updateAt"
                  type="datetime-local"
                  className="form-control"
                  name="updateAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerEvaluationEntity.updateAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userFullNameLabel" for="provider-evaluation-userFullName">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.userFullName">User Full Name</Translate>
                </Label>
                <AvField
                  id="provider-evaluation-userFullName"
                  type="text"
                  name="userFullName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 200, errorMessage: translate('entity.validation.maxlength', { max: 200 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="criteriaIdLabel" for="provider-evaluation-criteriaId">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.criteriaId">Criteria Id</Translate>
                </Label>
                <AvField id="provider-evaluation-criteriaId" type="string" className="form-control" name="criteriaId" />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="provider-evaluation-ponderation">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="provider-evaluation-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup>
                <Label for="provider-evaluation-answer">
                  <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.answer">Answer</Translate>
                </Label>
                <AvInput
                  id="provider-evaluation-answer"
                  type="select"
                  className="form-control"
                  name="answer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : providerEvaluationEntity.answer?.id}
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
              <Button tag={Link} id="cancel-save" to="/provider-evaluation" replace color="info">
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
  providerEvaluationEntity: storeState.providerEvaluation.entity,
  loading: storeState.providerEvaluation.loading,
  updating: storeState.providerEvaluation.updating,
  updateSuccess: storeState.providerEvaluation.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswers,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderEvaluationUpdate);
