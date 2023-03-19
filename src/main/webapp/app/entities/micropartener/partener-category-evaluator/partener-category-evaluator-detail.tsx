import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener-category-evaluator.reducer';
import { IPartenerCategoryEvaluator } from 'app/shared/model/micropartener/partener-category-evaluator.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerCategoryEvaluatorDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryEvaluatorDetail = (props: IPartenerCategoryEvaluatorDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerCategoryEvaluatorEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryEvaluator.detail.title">PartenerCategoryEvaluator</Translate>{' '}
          [<b>{partenerCategoryEvaluatorEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryEvaluator.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryEvaluatorEntity.userId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryEvaluator.category">Category</Translate>
          </dt>
          <dd>{partenerCategoryEvaluatorEntity.category ? partenerCategoryEvaluatorEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener-category-evaluator" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener-category-evaluator/${partenerCategoryEvaluatorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partenerCategoryEvaluator }: IRootState) => ({
  partenerCategoryEvaluatorEntity: partenerCategoryEvaluator.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryEvaluatorDetail);
