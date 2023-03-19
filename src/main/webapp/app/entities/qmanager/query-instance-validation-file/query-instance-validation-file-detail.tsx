import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-instance-validation-file.reducer';
import { IQueryInstanceValidationFile } from 'app/shared/model/qmanager/query-instance-validation-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryInstanceValidationFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationFileDetail = (props: IQueryInstanceValidationFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryInstanceValidationFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.detail.title">QueryInstanceValidationFile</Translate> [
          <b>{queryInstanceValidationFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{queryInstanceValidationFileEntity.fileName}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{queryInstanceValidationFileEntity.fileId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.validation">Validation</Translate>
          </dt>
          <dd>{queryInstanceValidationFileEntity.validation ? queryInstanceValidationFileEntity.validation.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-instance-validation-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-instance-validation-file/${queryInstanceValidationFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryInstanceValidationFile }: IRootState) => ({
  queryInstanceValidationFileEntity: queryInstanceValidationFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationFileDetail);
