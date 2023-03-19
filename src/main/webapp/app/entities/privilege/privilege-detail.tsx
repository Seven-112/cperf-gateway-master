import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './privilege.reducer';
import { IPrivilege } from 'app/shared/model/privilege.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPrivilegeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PrivilegeDetail = (props: IPrivilegeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { privilegeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.privilege.detail.title">Privilege</Translate> [<b>{privilegeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="constrained">
              <Translate contentKey="microgatewayApp.privilege.constrained">Constrained</Translate>
            </span>
          </dt>
          <dd>{privilegeEntity.constrained ? 'true' : 'false'}</dd>
          <dt>
            <span id="authority">
              <Translate contentKey="microgatewayApp.privilege.authority">Authority</Translate>
            </span>
          </dt>
          <dd>{privilegeEntity.authority}</dd>
          <dt>
            <span id="entity">
              <Translate contentKey="microgatewayApp.privilege.entity">Entity</Translate>
            </span>
          </dt>
          <dd>{privilegeEntity.entity}</dd>
          <dt>
            <span id="action">
              <Translate contentKey="microgatewayApp.privilege.action">Action</Translate>
            </span>
          </dt>
          <dd>{privilegeEntity.action}</dd>
        </dl>
        <Button tag={Link} to="/privilege" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/privilege/${privilegeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ privilege }: IRootState) => ({
  privilegeEntity: privilege.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeDetail);
