import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-recommendation-file.reducer';
import { IAuditRecommendationFile } from 'app/shared/model/microrisque/audit-recommendation-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditRecommendationFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecommendationFileDetail = (props: IAuditRecommendationFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditRecommendationFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.detail.title">AuditRecommendationFile</Translate> [
          <b>{auditRecommendationFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="recommendationId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.recommendationId">Recommendation Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationFileEntity.recommendationId}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{auditRecommendationFileEntity.fileName}</dd>
        </dl>
        <Button tag={Link} to="/audit-recommendation-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-recommendation-file/${auditRecommendationFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditRecommendationFile }: IRootState) => ({
  auditRecommendationFileEntity: auditRecommendationFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationFileDetail);
