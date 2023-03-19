import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './q-category.reducer';
import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQCategoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QCategoryDetail = (props: IQCategoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { qCategoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQCategory.detail.title">QCategory</Translate> [<b>{qCategoryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.qmanagerQCategory.name">Name</Translate>
            </span>
          </dt>
          <dd>{qCategoryEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.qmanagerQCategory.description">Description</Translate>
            </span>
          </dt>
          <dd>{qCategoryEntity.description}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQCategory.parent">Parent</Translate>
          </dt>
          <dd>{qCategoryEntity.parent ? qCategoryEntity.parent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/q-category" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/q-category/${qCategoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ qCategory }: IRootState) => ({
  qCategoryEntity: qCategory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QCategoryDetail);
