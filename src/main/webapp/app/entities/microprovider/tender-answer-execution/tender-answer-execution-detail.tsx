import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-answer-execution.reducer';
import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderAnswerExecutionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerExecutionDetail = (props: ITenderAnswerExecutionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderAnswerExecutionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.detail.title">TenderAnswerExecution</Translate> [
          <b>{tenderAnswerExecutionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerExecutionEntity.userId}</dd>
          <dt>
            <span id="validated">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.validated">Validated</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerExecutionEntity.validated ? 'true' : 'false'}</dd>
          <dt>
            <span id="comment">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.comment">Comment</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerExecutionEntity.comment}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecution.answer">Answer</Translate>
          </dt>
          <dd>{tenderAnswerExecutionEntity.answer ? tenderAnswerExecutionEntity.answer.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-answer-execution" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-answer-execution/${tenderAnswerExecutionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderAnswerExecution }: IRootState) => ({
  tenderAnswerExecutionEntity: tenderAnswerExecution.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerExecutionDetail);
