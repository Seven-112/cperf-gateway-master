import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './provider-evaluation.reducer';
import { IProviderEvaluation } from 'app/shared/model/microprovider/provider-evaluation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProviderEvaluationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderEvaluationDetail = (props: IProviderEvaluationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { providerEvaluationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.detail.title">ProviderEvaluation</Translate> [
          <b>{providerEvaluationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="note">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.note">Note</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.note}</dd>
          <dt>
            <span id="scale">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.scale">Scale</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.scale}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.justification}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.userId}</dd>
          <dt>
            <span id="storeAt">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.storeAt">Store At</Translate>
            </span>
          </dt>
          <dd>
            {providerEvaluationEntity.storeAt ? (
              <TextFormat value={providerEvaluationEntity.storeAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updateAt">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.updateAt">Update At</Translate>
            </span>
          </dt>
          <dd>
            {providerEvaluationEntity.updateAt ? (
              <TextFormat value={providerEvaluationEntity.updateAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.userFullName}</dd>
          <dt>
            <span id="criteriaId">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.criteriaId">Criteria Id</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.criteriaId}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{providerEvaluationEntity.ponderation}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderProviderEvaluation.answer">Answer</Translate>
          </dt>
          <dd>{providerEvaluationEntity.answer ? providerEvaluationEntity.answer.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/provider-evaluation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/provider-evaluation/${providerEvaluationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ providerEvaluation }: IRootState) => ({
  providerEvaluationEntity: providerEvaluation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderEvaluationDetail);
