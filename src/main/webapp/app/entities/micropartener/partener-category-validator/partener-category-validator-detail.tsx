import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener-category-validator.reducer';
import { IPartenerCategoryValidator } from 'app/shared/model/micropartener/partener-category-validator.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerCategoryValidatorDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryValidatorDetail = (props: IPartenerCategoryValidatorDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerCategoryValidatorEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryValidator.detail.title">PartenerCategoryValidator</Translate>{' '}
          [<b>{partenerCategoryValidatorEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryValidator.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryValidatorEntity.userId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerCategoryValidator.category">Category</Translate>
          </dt>
          <dd>{partenerCategoryValidatorEntity.category ? partenerCategoryValidatorEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener-category-validator" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener-category-validator/${partenerCategoryValidatorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partenerCategoryValidator }: IRootState) => ({
  partenerCategoryValidatorEntity: partenerCategoryValidator.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryValidatorDetail);
