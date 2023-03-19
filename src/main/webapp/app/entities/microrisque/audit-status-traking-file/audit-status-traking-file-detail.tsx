import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './audit-status-traking-file.reducer';
import { IAuditStatusTrakingFile } from 'app/shared/model/microrisque/audit-status-traking-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAuditStatusTrakingFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingFileDetail = (props: IAuditStatusTrakingFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { auditStatusTrakingFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.detail.title">AuditStatusTrakingFile</Translate> [
          <b>{auditStatusTrakingFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="trackId">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.trackId">Track Id</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingFileEntity.trackId}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{auditStatusTrakingFileEntity.fileName}</dd>
        </dl>
        <Button tag={Link} to="/audit-status-traking-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/audit-status-traking-file/${auditStatusTrakingFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ auditStatusTrakingFile }: IRootState) => ({
  auditStatusTrakingFileEntity: auditStatusTrakingFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingFileDetail);
