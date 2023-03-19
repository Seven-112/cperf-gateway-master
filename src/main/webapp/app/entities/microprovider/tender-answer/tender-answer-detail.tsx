import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-answer.reducer';
import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderAnswerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerDetail = (props: ITenderAnswerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderAnswerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderAnswer.detail.title">TenderAnswer</Translate> [
          <b>{tenderAnswerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="storeAt">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.storeAt">Store At</Translate>
            </span>
          </dt>
          <dd>
            {tenderAnswerEntity.storeAt ? <TextFormat value={tenderAnswerEntity.storeAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="content">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.content">Content</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.content}</dd>
          <dt>
            <span id="providerId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.providerId">Provider Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.providerId}</dd>
          <dt>
            <span id="executionDeley">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionDeley">Execution Deley</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.executionDeley}</dd>
          <dt>
            <span id="executionDeleyUnity">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionDeleyUnity">Execution Deley Unity</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.executionDeleyUnity}</dd>
          <dt>
            <span id="average">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.average">Average</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.average}</dd>
          <dt>
            <span id="startedAt">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.startedAt">Started At</Translate>
            </span>
          </dt>
          <dd>
            {tenderAnswerEntity.startedAt ? <TextFormat value={tenderAnswerEntity.startedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="starterId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.starterId">Starter Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.starterId}</dd>
          <dt>
            <span id="finishedAt">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.finishedAt">Finished At</Translate>
            </span>
          </dt>
          <dd>
            {tenderAnswerEntity.finishedAt ? (
              <TextFormat value={tenderAnswerEntity.finishedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="finisherId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.finisherId">Finisher Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.finisherId}</dd>
          <dt>
            <span id="executionAverage">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.executionAverage">Execution Average</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.executionAverage}</dd>
          <dt>
            <span id="confirmSelectMailSent">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswer.confirmSelectMailSent">Confirm Select Mail Sent</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerEntity.confirmSelectMailSent ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderAnswer.tender">Tender</Translate>
          </dt>
          <dd>{tenderAnswerEntity.tender ? tenderAnswerEntity.tender.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-answer" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-answer/${tenderAnswerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderAnswer }: IRootState) => ({
  tenderAnswerEntity: tenderAnswer.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerDetail);
