import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-answer-doc.reducer';
import { ITenderAnswerDoc } from 'app/shared/model/microprovider/tender-answer-doc.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderAnswerDocDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerDocDetail = (props: ITenderAnswerDocDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderAnswerDocEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.detail.title">TenderAnswerDoc</Translate> [
          <b>{tenderAnswerDocEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.name">Name</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerDocEntity.name}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerDocEntity.fileId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.tenderAnswer">Tender Answer</Translate>
          </dt>
          <dd>{tenderAnswerDocEntity.tenderAnswer ? tenderAnswerDocEntity.tenderAnswer.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.tenderDoc">Tender Doc</Translate>
          </dt>
          <dd>{tenderAnswerDocEntity.tenderDoc ? tenderAnswerDocEntity.tenderDoc.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-answer-doc" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-answer-doc/${tenderAnswerDocEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderAnswerDoc }: IRootState) => ({
  tenderAnswerDocEntity: tenderAnswerDoc.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerDocDetail);
