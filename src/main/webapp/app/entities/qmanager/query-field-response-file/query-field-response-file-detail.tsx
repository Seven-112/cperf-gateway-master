import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-field-response-file.reducer';
import { IQueryFieldResponseFile } from 'app/shared/model/qmanager/query-field-response-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryFieldResponseFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFieldResponseFileDetail = (props: IQueryFieldResponseFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryFieldResponseFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.detail.title">QueryFieldResponseFile</Translate> [
          <b>{queryFieldResponseFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{queryFieldResponseFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{queryFieldResponseFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponseFile.queryFieldResponse">Query Field Response</Translate>
          </dt>
          <dd>{queryFieldResponseFileEntity.queryFieldResponse ? queryFieldResponseFileEntity.queryFieldResponse.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-field-response-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-field-response-file/${queryFieldResponseFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryFieldResponseFile }: IRootState) => ({
  queryFieldResponseFileEntity: queryFieldResponseFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFieldResponseFileDetail);
