import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-status-traking.reducer';
import { IAuditStatusTraking } from 'app/shared/model/microrisque/audit-status-traking.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditStatusTrakingDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingDetail = (props: IAuditStatusTrakingDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditStatusTrakingEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.detail.title">AuditStatusTraking</Translate> [
          <b>{auditStatusTrakingEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="auditId">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.auditId">Audit Id</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.auditId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.status">Status</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.status}</dd>
          <dt>
            <span id="tracingAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.tracingAt">Tracing At</Translate>
            </span>
          </dt>
          <dd>
            {auditStatusTrakingEntity.tracingAt ? (
              <TextFormat value={auditStatusTrakingEntity.tracingAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.justification}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.userId}</dd>
          <dt>
            <span id="editable">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.editable">Editable</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.editable ? 'true' : 'false'}</dd>
          <dt>
            <span id="recom">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTraking.recom">Recom</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingEntity.recom ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/audit-status-traking" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-status-traking/${auditStatusTrakingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditStatusTraking }: IRootState) => ({
  auditStatusTrakingEntity: auditStatusTraking.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingDetail);
