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
import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender-answer-field.reducer';
import { ITenderAnswerField } from 'app/shared/model/microprovider/tender-answer-field.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderAnswerFieldUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerFieldUpdate = (props: ITenderAnswerFieldUpdateProps) => {
  const [answerId, setAnswerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderAnswerFieldEntity, tenderAnswers, loading, updating } = props;

  const { val } = tenderAnswerFieldEntity;

  const handleClose = () => {
    props.history.push('/tender-answer-field' + props.location.search);
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
        ...tenderAnswerFieldEntity,
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
          <h2 id="microgatewayApp.microproviderTenderAnswerField.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.home.createOrEditLabel">
              Create or edit a TenderAnswerField
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderAnswerFieldEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-answer-field-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-answer-field-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="valLabel" for="tender-answer-field-val">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.val">Val</Translate>
                </Label>
                <AvInput id="tender-answer-field-val" type="textarea" name="val" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="tender-answer-field-fileId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fileId">File Id</Translate>
                </Label>
                <AvField id="tender-answer-field-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="tender-answer-field-fileName">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fileName">File Name</Translate>
                </Label>
                <AvField id="tender-answer-field-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label id="fieldIdLabel" for="tender-answer-field-fieldId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fieldId">Field Id</Translate>
                </Label>
                <AvField
                  id="tender-answer-field-fieldId"
                  type="string"
                  className="form-control"
                  name="fieldId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="tender-answer-field-answer">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.answer">Answer</Translate>
                </Label>
                <AvInput
                  id="tender-answer-field-answer"
                  type="select"
                  className="form-control"
                  name="answer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : tenderAnswerFieldEntity.answer?.id}
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
              <Button tag={Link} id="cancel-save" to="/tender-answer-field" replace color="info">
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
  tenderAnswerFieldEntity: storeState.tenderAnswerField.entity,
  loading: storeState.tenderAnswerField.loading,
  updating: storeState.tenderAnswerField.updating,
  updateSuccess: storeState.tenderAnswerField.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerFieldUpdate);
