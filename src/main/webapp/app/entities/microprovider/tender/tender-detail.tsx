import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender.reducer';
import { ITender } from 'app/shared/model/microprovider/tender.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderDetail = (props: ITenderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTender.detail.title">Tender</Translate> [<b>{tenderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="object">
              <Translate contentKey="microgatewayApp.microproviderTender.object">Object</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.object}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderTender.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.userId}</dd>
          <dt>
            <span id="targetCategoryId">
              <Translate contentKey="microgatewayApp.microproviderTender.targetCategoryId">Target Category Id</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.targetCategoryId}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microproviderTender.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.createdAt ? <TextFormat value={tenderEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="expireAt">
              <Translate contentKey="microgatewayApp.microproviderTender.expireAt">Expire At</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.expireAt ? <TextFormat value={tenderEntity.expireAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="microgatewayApp.microproviderTender.content">Content</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.content}</dd>
          <dt>
            <span id="executionDeleyRequired">
              <Translate contentKey="microgatewayApp.microproviderTender.executionDeleyRequired">Execution Deley Required</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.executionDeleyRequired ? 'true' : 'false'}</dd>
          <dt>
            <span id="closed">
              <Translate contentKey="microgatewayApp.microproviderTender.closed">Closed</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.closed ? 'true' : 'false'}</dd>
          <dt>
            <span id="published">
              <Translate contentKey="microgatewayApp.microproviderTender.published">Published</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.published ? 'true' : 'false'}</dd>
          <dt>
            <span id="concernedProviderIds">
              <Translate contentKey="microgatewayApp.microproviderTender.concernedProviderIds">Concerned Provider Ids</Translate>
            </span>
          </dt>
          <dd>{tenderEntity.concernedProviderIds}</dd>
        </dl>
        <Button tag={Link} to="/tender" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender/${tenderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tender }: IRootState) => ({
  tenderEntity: tender.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderDetail);
