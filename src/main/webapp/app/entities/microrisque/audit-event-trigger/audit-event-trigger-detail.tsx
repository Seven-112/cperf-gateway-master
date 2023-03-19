import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-event-trigger.reducer';
import { IAuditEventTrigger } from 'app/shared/model/microrisque/audit-event-trigger.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditEventTriggerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditEventTriggerDetail = (props: IAuditEventTriggerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditEventTriggerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.detail.title">AuditEventTrigger</Translate> [
          <b>{auditEventTriggerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.editorId}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {auditEventTriggerEntity.createdAt ? (
              <TextFormat value={auditEventTriggerEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.name">Name</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.name}</dd>
          <dt>
            <span id="recurrence">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.recurrence">Recurrence</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.recurrence}</dd>
          <dt>
            <span id="disabled">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.disabled">Disabled</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.disabled ? 'true' : 'false'}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.editorName}</dd>
          <dt>
            <span id="firstStartedAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.firstStartedAt">First Started At</Translate>
            </span>
          </dt>
          <dd>
            {auditEventTriggerEntity.firstStartedAt ? (
              <TextFormat value={auditEventTriggerEntity.firstStartedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="nextStartAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.nextStartAt">Next Start At</Translate>
            </span>
          </dt>
          <dd>
            {auditEventTriggerEntity.nextStartAt ? (
              <TextFormat value={auditEventTriggerEntity.nextStartAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="startCount">
              <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.startCount">Start Count</Translate>
            </span>
          </dt>
          <dd>{auditEventTriggerEntity.startCount}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueAuditEventTrigger.audit">Audit</Translate>
          </dt>
          <dd>{auditEventTriggerEntity.audit ? auditEventTriggerEntity.audit.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/audit-event-trigger" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-event-trigger/${auditEventTriggerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditEventTrigger }: IRootState) => ({
  auditEventTriggerEntity: auditEventTrigger.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditEventTriggerDetail);
