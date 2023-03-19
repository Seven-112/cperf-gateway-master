import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-provider-selection.reducer';
import { ITenderProviderSelection } from 'app/shared/model/microprovider/tender-provider-selection.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderProviderSelectionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderSelectionDetail = (props: ITenderProviderSelectionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderProviderSelectionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.detail.title">TenderProviderSelection</Translate> [
          <b>{tenderProviderSelectionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="providerId">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.providerId">Provider Id</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionEntity.providerId}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionEntity.userId}</dd>
          <dt>
            <span id="validated">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.validated">Validated</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionEntity.validated ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.tender">Tender</Translate>
          </dt>
          <dd>{tenderProviderSelectionEntity.tender ? tenderProviderSelectionEntity.tender.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-provider-selection" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-provider-selection/${tenderProviderSelectionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderProviderSelection }: IRootState) => ({
  tenderProviderSelectionEntity: tenderProviderSelection.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderSelectionDetail);
