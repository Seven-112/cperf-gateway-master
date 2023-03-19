import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-extra.reducer';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserExtraDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserExtraDetail = (props: IUserExtraDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userExtraEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.userExtra.detail.title">UserExtra</Translate> [<b>{userExtraEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="photoId">
              <Translate contentKey="microgatewayApp.userExtra.photoId">Photo Id</Translate>
            </span>
          </dt>
          <dd>{userExtraEntity.photoId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.userExtra.user">User</Translate>
          </dt>
          <dd>{userExtraEntity.user ? userExtraEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.userExtra.employee">Employee</Translate>
          </dt>
          <dd>{userExtraEntity.employee ? userExtraEntity.employee.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/user-extra" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-extra/${userExtraEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userExtra }: IRootState) => ({
  userExtraEntity: userExtra.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserExtraDetail);
