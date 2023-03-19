import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './provider-expedition.reducer';
import { IProviderExpedition } from 'app/shared/model/microprovider/provider-expedition.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProviderExpeditionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderExpeditionDetail = (props: IProviderExpeditionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { providerExpeditionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderProviderExpedition.detail.title">ProviderExpedition</Translate> [
          <b>{providerExpeditionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="countryOrigin">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.countryOrigin">Country Origin</Translate>
            </span>
          </dt>
          <dd>{providerExpeditionEntity.countryOrigin}</dd>
          <dt>
            <span id="departureDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.departureDate">Departure Date</Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.departureDate ? (
              <TextFormat value={providerExpeditionEntity.departureDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="portArivalDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.portArivalDate">Port Arival Date</Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.portArivalDate ? (
              <TextFormat value={providerExpeditionEntity.portArivalDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="siteDeliveryDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.siteDeliveryDate">Site Delivery Date</Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.siteDeliveryDate ? (
              <TextFormat value={providerExpeditionEntity.siteDeliveryDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="readOnly">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.readOnly">Read Only</Translate>
            </span>
          </dt>
          <dd>{providerExpeditionEntity.readOnly ? 'true' : 'false'}</dd>
          <dt>
            <span id="previewDepatureDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewDepatureDate">Preview Depature Date</Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.previewDepatureDate ? (
              <TextFormat value={providerExpeditionEntity.previewDepatureDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="previewPortArivalDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewPortArivalDate">
                Preview Port Arival Date
              </Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.previewPortArivalDate ? (
              <TextFormat value={providerExpeditionEntity.previewPortArivalDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="previewSiteDeliveryDate">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewSiteDeliveryDate">
                Preview Site Delivery Date
              </Translate>
            </span>
          </dt>
          <dd>
            {providerExpeditionEntity.previewSiteDeliveryDate ? (
              <TextFormat value={providerExpeditionEntity.previewSiteDeliveryDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="transporter">
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.transporter">Transporter</Translate>
            </span>
          </dt>
          <dd>{providerExpeditionEntity.transporter}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderProviderExpedition.answer">Answer</Translate>
          </dt>
          <dd>{providerExpeditionEntity.answer ? providerExpeditionEntity.answer.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/provider-expedition" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/provider-expedition/${providerExpeditionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ providerExpedition }: IRootState) => ({
  providerExpeditionEntity: providerExpedition.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExpeditionDetail);
