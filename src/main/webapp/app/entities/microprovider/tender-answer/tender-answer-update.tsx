import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITender } from 'app/shared/model/microprovider/tender.model';
import { getEntities as getTenders } from 'app/entities/microprovider/tender/tender.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender-answer.reducer';
import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderAnswerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerUpdate = (props: ITenderAnswerUpdateProps) => {
  const [tenderId, setTenderId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderAnswerEntity, tenders, loading, updating } = props;

  const { content } = tenderAnswerEntity;

  const handleClose = () => {
    props.history.push('/tender-answer' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenders();
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
    values.startedAt = convertDateTimeToServer(values.startedAt);
    values.finishedAt = convertDateTimeToServer(values.finishedAt);

    if (errors.length === 0) {
      const entity = {
        ...tenderAnswerEntity,
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
          <h2 id="microgatewayApp.microproviderTenderAnswer.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderAnswer.home.createOrEditLabel">
              Create or edit a TenderAnswer
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderAnswerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-answer-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-answer-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="storeAtLabel" for="tender-answer-storeAt">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.storeAt">Store At</Translate>
                </Label>
                <AvInput
                  id="tender-answer-storeAt"
                  type="datetime-local"
                  className="form-control"
                  name="storeAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderAnswerEntity.storeAt)}
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="tender-answer-content">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.content">Content</Translate>
                </Label>
                <AvInput id="tender-answer-content" type="textarea" name="content" />
              </AvGroup>
              <AvGroup>
                <Label id="providerIdLabel" for="tender-answer-providerId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.providerId">Provider Id</Translate>
                </Label>
                <AvField
                  id="tender-answer-providerId"
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
                <Label id="executionDeleyLabel" for="tender-answer-executionDeley">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionDeley">Execution Deley</Translate>
                </Label>
                <AvField id="tender-answer-executionDeley" type="string" className="form-control" name="executionDeley" />
              </AvGroup>
              <AvGroup>
                <Label id="executionDeleyUnityLabel" for="tender-answer-executionDeleyUnity">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionDeleyUnity">Execution Deley Unity</Translate>
                </Label>
                <AvInput
                  id="tender-answer-executionDeleyUnity"
                  type="select"
                  className="form-control"
                  name="executionDeleyUnity"
                  value={(!isNew && tenderAnswerEntity.executionDeleyUnity) || 'MINUTE'}
                >
                  <option value="MINUTE">{translate('microgatewayApp.DeleyUnity.MINUTE')}</option>
                  <option value="HOUR">{translate('microgatewayApp.DeleyUnity.HOUR')}</option>
                  <option value="DAY">{translate('microgatewayApp.DeleyUnity.DAY')}</option>
                  <option value="MONTH">{translate('microgatewayApp.DeleyUnity.MONTH')}</option>
                  <option value="YEAR">{translate('microgatewayApp.DeleyUnity.YEAR')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="averageLabel" for="tender-answer-average">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.average">Average</Translate>
                </Label>
                <AvField id="tender-answer-average" type="string" className="form-control" name="average" />
              </AvGroup>
              <AvGroup>
                <Label id="startedAtLabel" for="tender-answer-startedAt">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.startedAt">Started At</Translate>
                </Label>
                <AvInput
                  id="tender-answer-startedAt"
                  type="datetime-local"
                  className="form-control"
                  name="startedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderAnswerEntity.startedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="starterIdLabel" for="tender-answer-starterId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.starterId">Starter Id</Translate>
                </Label>
                <AvField id="tender-answer-starterId" type="string" className="form-control" name="starterId" />
              </AvGroup>
              <AvGroup>
                <Label id="finishedAtLabel" for="tender-answer-finishedAt">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.finishedAt">Finished At</Translate>
                </Label>
                <AvInput
                  id="tender-answer-finishedAt"
                  type="datetime-local"
                  className="form-control"
                  name="finishedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderAnswerEntity.finishedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="finisherIdLabel" for="tender-answer-finisherId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.finisherId">Finisher Id</Translate>
                </Label>
                <AvField id="tender-answer-finisherId" type="string" className="form-control" name="finisherId" />
              </AvGroup>
              <AvGroup>
                <Label id="executionAverageLabel" for="tender-answer-executionAverage">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionAverage">Execution Average</Translate>
                </Label>
                <AvField id="tender-answer-executionAverage" type="string" className="form-control" name="executionAverage" />
              </AvGroup>
              <AvGroup check>
                <Label id="confirmSelectMailSentLabel">
                  <AvInput
                    id="tender-answer-confirmSelectMailSent"
                    type="checkbox"
                    className="form-check-input"
                    name="confirmSelectMailSent"
                  />
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.confirmSelectMailSent">
                    Confirm Select Mail Sent
                  </Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="tender-answer-tender">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswer.tender">Tender</Translate>
                </Label>
                <AvInput
                  id="tender-answer-tender"
                  type="select"
                  className="form-control"
                  name="tender.id"
                  value={isNew ? tenders[0] && tenders[0].id : tenderAnswerEntity.tender?.id}
                  required
                >
                  {tenders
                    ? tenders.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/tender-answer" replace color="info">
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
  tenders: storeState.tender.entities,
  tenderAnswerEntity: storeState.tenderAnswer.entity,
  loading: storeState.tenderAnswer.loading,
  updating: storeState.tenderAnswer.updating,
  updateSuccess: storeState.tenderAnswer.updateSuccess,
});

const mapDispatchToProps = {
  getTenders,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerUpdate);
