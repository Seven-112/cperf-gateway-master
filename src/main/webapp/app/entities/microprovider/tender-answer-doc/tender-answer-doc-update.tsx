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
import { ITenderDoc } from 'app/shared/model/microprovider/tender-doc.model';
import { getEntities as getTenderDocs } from 'app/entities/microprovider/tender-doc/tender-doc.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tender-answer-doc.reducer';
import { ITenderAnswerDoc } from 'app/shared/model/microprovider/tender-answer-doc.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderAnswerDocUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerDocUpdate = (props: ITenderAnswerDocUpdateProps) => {
  const [tenderAnswerId, setTenderAnswerId] = useState('0');
  const [tenderDocId, setTenderDocId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderAnswerDocEntity, tenderAnswers, tenderDocs, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-answer-doc' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswers();
    props.getTenderDocs();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tenderAnswerDocEntity,
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
          <h2 id="microgatewayApp.microproviderTenderAnswerDoc.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.home.createOrEditLabel">
              Create or edit a TenderAnswerDoc
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderAnswerDocEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-answer-doc-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-answer-doc-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tender-answer-doc-name">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.name">Name</Translate>
                </Label>
                <AvField
                  id="tender-answer-doc-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="tender-answer-doc-fileId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="tender-answer-doc-fileId"
                  type="string"
                  className="form-control"
                  name="fileId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="tender-answer-doc-tenderAnswer">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.tenderAnswer">Tender Answer</Translate>
                </Label>
                <AvInput
                  id="tender-answer-doc-tenderAnswer"
                  type="select"
                  className="form-control"
                  name="tenderAnswer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : tenderAnswerDocEntity.tenderAnswer?.id}
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
              <AvGroup>
                <Label for="tender-answer-doc-tenderDoc">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.tenderDoc">Tender Doc</Translate>
                </Label>
                <AvInput id="tender-answer-doc-tenderDoc" type="select" className="form-control" name="tenderDoc.id">
                  <option value="" key="0" />
                  {tenderDocs
                    ? tenderDocs.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tender-answer-doc" replace color="info">
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
  tenderDocs: storeState.tenderDoc.entities,
  tenderAnswerDocEntity: storeState.tenderAnswerDoc.entity,
  loading: storeState.tenderAnswerDoc.loading,
  updating: storeState.tenderAnswerDoc.updating,
  updateSuccess: storeState.tenderAnswerDoc.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswers,
  getTenderDocs,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerDocUpdate);
