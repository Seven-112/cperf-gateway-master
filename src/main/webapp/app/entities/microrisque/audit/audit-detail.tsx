import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit.reducer';
import { IAudit } from 'app/shared/model/microrisque/audit.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditDetail = (props: IAuditDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAudit.detail.title">Audit</Translate> [<b>{auditEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="microgatewayApp.microrisqueAudit.title">Title</Translate>
            </span>
          </dt>
          <dd>{auditEntity.title}</dd>
          <dt>
            <span id="startDate">
              <Translate contentKey="microgatewayApp.microrisqueAudit.startDate">Start Date</Translate>
            </span>
          </dt>
          <dd>{auditEntity.startDate ? <TextFormat value={auditEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="endDate">
              <Translate contentKey="microgatewayApp.microrisqueAudit.endDate">End Date</Translate>
            </span>
          </dt>
          <dd>{auditEntity.endDate ? <TextFormat value={auditEntity.endDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="executedAt">
              <Translate contentKey="microgatewayApp.microrisqueAudit.executedAt">Executed At</Translate>
            </span>
          </dt>
          <dd>{auditEntity.executedAt ? <TextFormat value={auditEntity.executedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microrisqueAudit.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{auditEntity.processId}</dd>
          <dt>
            <span id="processName">
              <Translate contentKey="microgatewayApp.microrisqueAudit.processName">Process Name</Translate>
            </span>
          </dt>
          <dd>{auditEntity.processName}</dd>
          <dt>
            <span id="processCategoryId">
              <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryId">Process Category Id</Translate>
            </span>
          </dt>
          <dd>{auditEntity.processCategoryId}</dd>
          <dt>
            <span id="processCategoryName">
              <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryName">Process Category Name</Translate>
            </span>
          </dt>
          <dd>{auditEntity.processCategoryName}</dd>
          <dt>
            <span id="riskLevel">
              <Translate contentKey="microgatewayApp.microrisqueAudit.riskLevel">Risk Level</Translate>
            </span>
          </dt>
          <dd>{auditEntity.riskLevel}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.microrisqueAudit.type">Type</Translate>
            </span>
          </dt>
          <dd>{auditEntity.type}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microrisqueAudit.status">Status</Translate>
            </span>
          </dt>
          <dd>{auditEntity.status}</dd>
          <dt>
            <span id="riskId">
              <Translate contentKey="microgatewayApp.microrisqueAudit.riskId">Risk Id</Translate>
            </span>
          </dt>
          <dd>{auditEntity.riskId}</dd>
          <dt>
            <span id="riskName">
              <Translate contentKey="microgatewayApp.microrisqueAudit.riskName">Risk Name</Translate>
            </span>
          </dt>
          <dd>{auditEntity.riskName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueAudit.cycle">Cycle</Translate>
          </dt>
          <dd>{auditEntity.cycle ? auditEntity.cycle.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/audit" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit/${auditEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ audit }: IRootState) => ({
  auditEntity: audit.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditDetail);
