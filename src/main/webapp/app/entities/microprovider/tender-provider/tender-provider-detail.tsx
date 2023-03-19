import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-provider.reducer';
import { ITenderProvider } from 'app/shared/model/microprovider/tender-provider.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderProviderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderDetail = (props: ITenderProviderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderProviderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderProvider.detail.title">TenderProvider</Translate> [
          <b>{tenderProviderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="tenderId">
              <Translate contentKey="microgatewayApp.microproviderTenderProvider.tenderId">Tender Id</Translate>
            </span>
          </dt>
          <dd>{tenderProviderEntity.tenderId}</dd>
          <dt>
            <span id="providerId">
              <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerId">Provider Id</Translate>
            </span>
          </dt>
          <dd>{tenderProviderEntity.providerId}</dd>
          <dt>
            <span id="providerEmail">
              <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerEmail">Provider Email</Translate>
            </span>
          </dt>
          <dd>{tenderProviderEntity.providerEmail}</dd>
          <dt>
            <span id="providerName">
              <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerName">Provider Name</Translate>
            </span>
          </dt>
          <dd>{tenderProviderEntity.providerName}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microproviderTenderProvider.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{tenderProviderEntity.valid ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/tender-provider" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-provider/${tenderProviderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderProvider }: IRootState) => ({
  tenderProviderEntity: tenderProvider.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderDetail);
