import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-recommendation.reducer';
import { IAuditRecommendation } from 'app/shared/model/microrisque/audit-recommendation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditRecommendationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecommendationDetail = (props: IAuditRecommendationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditRecommendationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.detail.title">AuditRecommendation</Translate> [
          <b>{auditRecommendationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="auditorId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorId">Auditor Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.auditorId}</dd>
          <dt>
            <span id="auditorName">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorName">Auditor Name</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.auditorName}</dd>
          <dt>
            <span id="auditorEmail">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorEmail">Auditor Email</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.auditorEmail}</dd>
          <dt>
            <span id="auditId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditId">Audit Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.auditId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.status">Status</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.status}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.content">Content</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.content}</dd>
          <dt>
            <span id="responsableId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableId">Responsable Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.responsableId}</dd>
          <dt>
            <span id="responsableName">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableName">Responsable Name</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.responsableName}</dd>
          <dt>
            <span id="responsableEmail">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableEmail">Responsable Email</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.responsableEmail}</dd>
          <dt>
            <span id="dateLimit">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.dateLimit">Date Limit</Translate>
            </span>
          </dt>
          <dd>
            {auditRecommendationEntity.dateLimit ? (
              <TextFormat value={auditRecommendationEntity.dateLimit} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="editAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.editAt">Edit At</Translate>
            </span>
          </dt>
          <dd>
            {auditRecommendationEntity.editAt ? (
              <TextFormat value={auditRecommendationEntity.editAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="executedAt">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.executedAt">Executed At</Translate>
            </span>
          </dt>
          <dd>
            {auditRecommendationEntity.executedAt ? (
              <TextFormat value={auditRecommendationEntity.executedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="entityId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entityId">Entity Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.entityId}</dd>
          <dt>
            <span id="entiyName">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entiyName">Entiy Name</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationEntity.entiyName}</dd>
        </dl>
        <Button tag={Link} to="/audit-recommendation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-recommendation/${auditRecommendationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditRecommendation }: IRootState) => ({
  auditRecommendationEntity: auditRecommendation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationDetail);
