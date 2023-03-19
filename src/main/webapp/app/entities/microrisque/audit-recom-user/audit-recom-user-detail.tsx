import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-recom-user.reducer';
import { IAuditRecomUser } from 'app/shared/model/microrisque/audit-recom-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditRecomUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecomUserDetail = (props: IAuditRecomUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditRecomUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.detail.title">AuditRecomUser</Translate> [
          <b>{auditRecomUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="recomId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.recomId">Recom Id</Translate>
            </span>
          </dt>
          <dd>{auditRecomUserEntity.recomId}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{auditRecomUserEntity.userId}</dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{auditRecomUserEntity.userFullName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{auditRecomUserEntity.userEmail}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.role">Role</Translate>
            </span>
          </dt>
          <dd>{auditRecomUserEntity.role}</dd>
        </dl>
        <Button tag={Link} to="/audit-recom-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-recom-user/${auditRecomUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditRecomUser }: IRootState) => ({
  auditRecomUserEntity: auditRecomUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecomUserDetail);
