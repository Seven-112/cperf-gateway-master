import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-user.reducer';
import { IQueryUser } from 'app/shared/model/qmanager/query-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryUserDetail = (props: IQueryUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryUser.detail.title">QueryUser</Translate> [<b>{queryUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.qmanagerQueryUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{queryUserEntity.userId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryUser.query">Query</Translate>
          </dt>
          <dd>{queryUserEntity.query ? queryUserEntity.query.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-user/${queryUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryUser }: IRootState) => ({
  queryUserEntity: queryUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryUserDetail);
