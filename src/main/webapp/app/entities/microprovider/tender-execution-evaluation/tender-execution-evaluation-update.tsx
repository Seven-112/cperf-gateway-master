import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { getEntities as getTenderAnswerExecutions } from 'app/entities/microprovider/tender-answer-execution/tender-answer-execution.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender-execution-evaluation.reducer';
import { ITenderExecutionEvaluation } from 'app/shared/model/microprovider/tender-execution-evaluation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderExecutionEvaluationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderExecutionEvaluationUpdate = (props: ITenderExecutionEvaluationUpdateProps) => {
  const [executionId, setExecutionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderExecutionEvaluationEntity, tenderAnswerExecutions, loading, updating } = props;

  const { justification } = tenderExecutionEvaluationEntity;

  const handleClose = () => {
    props.history.push('/tender-execution-evaluation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswerExecutions();
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
        ...tenderExecutionEvaluationEntity,
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
          <h2 id="microgatewayApp.microproviderTenderExecutionEvaluation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.home.createOrEditLabel">
              Create or edit a TenderExecutionEvaluation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderExecutionEvaluationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-execution-evaluation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-execution-evaluation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="noteLabel" for="tender-execution-evaluation-note">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.note">Note</Translate>
                </Label>
                <AvField id="tender-execution-evaluation-note" type="string" className="form-control" name="note" />
              </AvGroup>
              <AvGroup>
                <Label id="scaleLabel" for="tender-execution-evaluation-scale">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.scale">Scale</Translate>
                </Label>
                <AvField id="tender-execution-evaluation-scale" type="string" className="form-control" name="scale" />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="tender-execution-evaluation-justification">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.justification">Justification</Translate>
                </Label>
                <AvInput id="tender-execution-evaluation-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="tender-execution-evaluation-userId">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userId">User Id</Translate>
                </Label>
                <AvField
                  id="tender-execution-evaluation-userId"
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
                <Label id="userFullNameLabel" for="tender-execution-evaluation-userFullName">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userFullName">User Full Name</Translate>
                </Label>
                <AvField
                  id="tender-execution-evaluation-userFullName"
                  type="text"
                  name="userFullName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 100, errorMessage: translate('entity.validation.minlength', { min: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="storeAtLabel" for="tender-execution-evaluation-storeAt">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.storeAt">Store At</Translate>
                </Label>
                <AvInput
                  id="tender-execution-evaluation-storeAt"
                  type="datetime-local"
                  className="form-control"
                  name="storeAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderExecutionEvaluationEntity.storeAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updateAtLabel" for="tender-execution-evaluation-updateAt">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.updateAt">Update At</Translate>
                </Label>
                <AvInput
                  id="tender-execution-evaluation-updateAt"
                  type="datetime-local"
                  className="form-control"
                  name="updateAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderExecutionEvaluationEntity.updateAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="tender-execution-evaluation-ponderation">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="tender-execution-evaluation-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup>
                <Label for="tender-execution-evaluation-execution">
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.execution">Execution</Translate>
                </Label>
                <AvInput
                  id="tender-execution-evaluation-execution"
                  type="select"
                  className="form-control"
                  name="execution.id"
                  value={isNew ? tenderAnswerExecutions[0] && tenderAnswerExecutions[0].id : tenderExecutionEvaluationEntity.execution?.id}
                  required
                >
                  {tenderAnswerExecutions
                    ? tenderAnswerExecutions.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/tender-execution-evaluation" replace color="info">
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
  tenderAnswerExecutions: storeState.tenderAnswerExecution.entities,
  tenderExecutionEvaluationEntity: storeState.tenderExecutionEvaluation.entity,
  loading: storeState.tenderExecutionEvaluation.loading,
  updating: storeState.tenderExecutionEvaluation.updating,
  updateSuccess: storeState.tenderExecutionEvaluation.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswerExecutions,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderExecutionEvaluationUpdate);
