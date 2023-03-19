import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-doc.reducer';
import { ITenderDoc } from 'app/shared/model/microprovider/tender-doc.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderDocDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderDocDetail = (props: ITenderDocDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderDocEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderDoc.detail.title">TenderDoc</Translate> [<b>{tenderDocEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microproviderTenderDoc.description">Description</Translate>
            </span>
          </dt>
          <dd>{tenderDocEntity.description}</dd>
          <dt>
            <span id="optional">
              <Translate contentKey="microgatewayApp.microproviderTenderDoc.optional">Optional</Translate>
            </span>
          </dt>
          <dd>{tenderDocEntity.optional ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderDoc.tender">Tender</Translate>
          </dt>
          <dd>{tenderDocEntity.tender ? tenderDocEntity.tender.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-doc" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-doc/${tenderDocEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderDoc }: IRootState) => ({
  tenderDocEntity: tenderDoc.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderDocDetail);
