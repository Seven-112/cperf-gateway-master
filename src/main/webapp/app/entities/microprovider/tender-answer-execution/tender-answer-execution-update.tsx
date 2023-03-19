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
import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender-answer-execution.reducer';
import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderAnswerExecutionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerExecutionUpdate = (props: ITenderAnswerExecutionUpdateProps) => {
  const [answerId, setAnswerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderAnswerExecutionEntity, tenderAnswers, loading, updating } = props;

  const { comment } = tenderAnswerExecutionEntity;

  const handleClose = () => {
    props.history.push('/tender-answer-execution' + props.location.search);
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
    if (errors.length === 0) {
      const entity = {
        ...tenderAnswerExecutionEntity,
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
          <h2 id="microgatewayApp.microproviderTenderAnswerExecution.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.home.createOrEditLabel">
              Create or edit a TenderAnswerExecution
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderAnswerExecutionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-answer-execution-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-answer-execution-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="tender-answer-execution-userId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.userId">User Id</Translate>
                </Label>
                <AvField id="tender-answer-execution-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup check>
                <Label id="validatedLabel">
                  <AvInput id="tender-answer-execution-validated" type="checkbox" className="form-check-input" name="validated" />
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.validated">Validated</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="tender-answer-execution-comment">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.comment">Comment</Translate>
                </Label>
                <AvInput id="tender-answer-execution-comment" type="textarea" name="comment" />
              </AvGroup>
              <AvGroup>
                <Label for="tender-answer-execution-answer">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.answer">Answer</Translate>
                </Label>
                <AvInput
                  id="tender-answer-execution-answer"
                  type="select"
                  className="form-control"
                  name="answer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : tenderAnswerExecutionEntity.answer?.id}
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
              <Button tag={Link} id="cancel-save" to="/tender-answer-execution" replace color="info">
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
  tenderAnswerExecutionEntity: storeState.tenderAnswerExecution.entity,
  loading: storeState.tenderAnswerExecution.loading,
  updating: storeState.tenderAnswerExecution.updating,
  updateSuccess: storeState.tenderAnswerExecution.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerExecutionUpdate);
