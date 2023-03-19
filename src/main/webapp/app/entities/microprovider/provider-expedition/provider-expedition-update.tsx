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
import { getEntity, updateEntity, createEntity, reset } from './provider-expedition.reducer';
import { IProviderExpedition } from 'app/shared/model/microprovider/provider-expedition.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProviderExpeditionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderExpeditionUpdate = (props: IProviderExpeditionUpdateProps) => {
  const [answerId, setAnswerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { providerExpeditionEntity, tenderAnswers, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/provider-expedition' + props.location.search);
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
    values.departureDate = convertDateTimeToServer(values.departureDate);
    values.portArivalDate = convertDateTimeToServer(values.portArivalDate);
    values.siteDeliveryDate = convertDateTimeToServer(values.siteDeliveryDate);
    values.previewDepatureDate = convertDateTimeToServer(values.previewDepatureDate);
    values.previewPortArivalDate = convertDateTimeToServer(values.previewPortArivalDate);
    values.previewSiteDeliveryDate = convertDateTimeToServer(values.previewSiteDeliveryDate);

    if (errors.length === 0) {
      const entity = {
        ...providerExpeditionEntity,
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
          <h2 id="microgatewayApp.microproviderProviderExpedition.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderProviderExpedition.home.createOrEditLabel">
              Create or edit a ProviderExpedition
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : providerExpeditionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="provider-expedition-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="provider-expedition-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="countryOriginLabel" for="provider-expedition-countryOrigin">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.countryOrigin">Country Origin</Translate>
                </Label>
                <AvField id="provider-expedition-countryOrigin" type="text" name="countryOrigin" />
              </AvGroup>
              <AvGroup>
                <Label id="departureDateLabel" for="provider-expedition-departureDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.departureDate">Departure Date</Translate>
                </Label>
                <AvInput
                  id="provider-expedition-departureDate"
                  type="datetime-local"
                  className="form-control"
                  name="departureDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.departureDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="portArivalDateLabel" for="provider-expedition-portArivalDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.portArivalDate">Port Arival Date</Translate>
                </Label>
                <AvInput
                  id="provider-expedition-portArivalDate"
                  type="datetime-local"
                  className="form-control"
                  name="portArivalDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.portArivalDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="siteDeliveryDateLabel" for="provider-expedition-siteDeliveryDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.siteDeliveryDate">Site Delivery Date</Translate>
                </Label>
                <AvInput
                  id="provider-expedition-siteDeliveryDate"
                  type="datetime-local"
                  className="form-control"
                  name="siteDeliveryDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.siteDeliveryDate)}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="readOnlyLabel">
                  <AvInput id="provider-expedition-readOnly" type="checkbox" className="form-check-input" name="readOnly" />
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.readOnly">Read Only</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="previewDepatureDateLabel" for="provider-expedition-previewDepatureDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewDepatureDate">
                    Preview Depature Date
                  </Translate>
                </Label>
                <AvInput
                  id="provider-expedition-previewDepatureDate"
                  type="datetime-local"
                  className="form-control"
                  name="previewDepatureDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.previewDepatureDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="previewPortArivalDateLabel" for="provider-expedition-previewPortArivalDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewPortArivalDate">
                    Preview Port Arival Date
                  </Translate>
                </Label>
                <AvInput
                  id="provider-expedition-previewPortArivalDate"
                  type="datetime-local"
                  className="form-control"
                  name="previewPortArivalDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.previewPortArivalDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="previewSiteDeliveryDateLabel" for="provider-expedition-previewSiteDeliveryDate">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewSiteDeliveryDate">
                    Preview Site Delivery Date
                  </Translate>
                </Label>
                <AvInput
                  id="provider-expedition-previewSiteDeliveryDate"
                  type="datetime-local"
                  className="form-control"
                  name="previewSiteDeliveryDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={
                    isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.providerExpeditionEntity.previewSiteDeliveryDate)
                  }
                />
              </AvGroup>
              <AvGroup>
                <Label id="transporterLabel" for="provider-expedition-transporter">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.transporter">Transporter</Translate>
                </Label>
                <AvField id="provider-expedition-transporter" type="text" name="transporter" />
              </AvGroup>
              <AvGroup>
                <Label for="provider-expedition-answer">
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.answer">Answer</Translate>
                </Label>
                <AvInput
                  id="provider-expedition-answer"
                  type="select"
                  className="form-control"
                  name="answer.id"
                  value={isNew ? tenderAnswers[0] && tenderAnswers[0].id : providerExpeditionEntity.answer?.id}
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
              <Button tag={Link} id="cancel-save" to="/provider-expedition" replace color="info">
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
  providerExpeditionEntity: storeState.providerExpedition.entity,
  loading: storeState.providerExpedition.loading,
  updating: storeState.providerExpedition.updating,
  updateSuccess: storeState.providerExpedition.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExpeditionUpdate);
