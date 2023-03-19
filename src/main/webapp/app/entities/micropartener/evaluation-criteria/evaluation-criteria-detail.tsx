import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './evaluation-criteria.reducer';
import { IEvaluationCriteria } from 'app/shared/model/micropartener/evaluation-criteria.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEvaluationCriteriaDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EvaluationCriteriaDetail = (props: IEvaluationCriteriaDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { evaluationCriteriaEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.detail.title">EvaluationCriteria</Translate> [
          <b>{evaluationCriteriaEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.name">Name</Translate>
            </span>
          </dt>
          <dd>{evaluationCriteriaEntity.name}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{evaluationCriteriaEntity.ponderation}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.category">Category</Translate>
          </dt>
          <dd>{evaluationCriteriaEntity.category ? evaluationCriteriaEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/evaluation-criteria" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/evaluation-criteria/${evaluationCriteriaEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ evaluationCriteria }: IRootState) => ({
  evaluationCriteriaEntity: evaluationCriteria.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationCriteriaDetail);
