import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process-category-user.reducer';
import { IProcessCategoryUser } from 'app/shared/model/microprocess/process-category-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessCategoryUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessCategoryUserDetail = (props: IProcessCategoryUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processCategoryUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.detail.title">ProcessCategoryUser</Translate> [
          <b>{processCategoryUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{processCategoryUserEntity.userId}</dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{processCategoryUserEntity.userFullName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{processCategoryUserEntity.userEmail}</dd>
          <dt>
            <span id="categoryId">
              <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.categoryId">Category Id</Translate>
            </span>
          </dt>
          <dd>{processCategoryUserEntity.categoryId}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{processCategoryUserEntity.processId}</dd>
        </dl>
        <Button tag={Link} to="/process-category-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process-category-user/${processCategoryUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ processCategoryUser }: IRootState) => ({
  processCategoryUserEntity: processCategoryUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCategoryUserDetail);
