import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-user.reducer';
import { IAuditUser } from 'app/shared/model/microrisque/audit-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditUserDetail = (props: IAuditUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditUser.detail.title">AuditUser</Translate> [<b>{auditUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="auditId">
              <Translate contentKey="microgatewayApp.microrisqueAuditUser.auditId">Audit Id</Translate>
            </span>
          </dt>
          <dd>{auditUserEntity.auditId}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microrisqueAuditUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{auditUserEntity.userId}</dd>
          <dt>
            <span id="userFullName">
              <Translate contentKey="microgatewayApp.microrisqueAuditUser.userFullName">User Full Name</Translate>
            </span>
          </dt>
          <dd>{auditUserEntity.userFullName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microrisqueAuditUser.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{auditUserEntity.userEmail}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="microgatewayApp.microrisqueAuditUser.role">Role</Translate>
            </span>
          </dt>
          <dd>{auditUserEntity.role}</dd>
        </dl>
        <Button tag={Link} to="/audit-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-user/${auditUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditUser }: IRootState) => ({
  auditUserEntity: auditUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditUserDetail);
