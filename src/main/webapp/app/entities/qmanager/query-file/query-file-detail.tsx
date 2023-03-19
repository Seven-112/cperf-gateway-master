import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-file.reducer';
import { IQueryFile } from 'app/shared/model/qmanager/query-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFileDetail = (props: IQueryFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryFile.detail.title">QueryFile</Translate> [<b>{queryFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.qmanagerQueryFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{queryFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.qmanagerQueryFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{queryFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryFile.query">Query</Translate>
          </dt>
          <dd>{queryFileEntity.query ? queryFileEntity.query.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-file/${queryFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryFile }: IRootState) => ({
  queryFileEntity: queryFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFileDetail);
