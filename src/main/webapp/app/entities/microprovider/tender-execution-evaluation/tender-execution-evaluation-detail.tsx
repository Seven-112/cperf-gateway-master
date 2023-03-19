import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-execution-evaluation.reducer';
import { ITenderExecutionEvaluation } from 'app/shared/model/microprovider/tender-execution-evaluation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderExecutionEvaluationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderExecutionEvaluationDetail = (props: ITenderExecutionEvaluationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderExecutionEvaluationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.detail.title">TenderExecutionEvaluation</Translate>{' '}
          [<b>{tenderExecutionEvaluationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="note">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.note">Note</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.note}</dd>
          <dt>
            <span id="scale">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.scale">Scale</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.scale}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.justification}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.userId}</dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.userFullName}</dd>
          <dt>
            <span id="storeAt">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.storeAt">Store At</Translate>
            </span>
          </dt>
          <dd>
            {tenderExecutionEvaluationEntity.storeAt ? (
              <TextFormat value={tenderExecutionEvaluationEntity.storeAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updateAt">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.updateAt">Update At</Translate>
            </span>
          </dt>
          <dd>
            {tenderExecutionEvaluationEntity.updateAt ? (
              <TextFormat value={tenderExecutionEvaluationEntity.updateAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.ponderation}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.execution">Execution</Translate>
          </dt>
          <dd>{tenderExecutionEvaluationEntity.execution ? tenderExecutionEvaluationEntity.execution.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-execution-evaluation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-execution-evaluation/${tenderExecutionEvaluationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderExecutionEvaluation }: IRootState) => ({
  tenderExecutionEvaluationEntity: tenderExecutionEvaluation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderExecutionEvaluationDetail);
