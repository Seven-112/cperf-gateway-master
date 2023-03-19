import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-instance.reducer';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryInstanceDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceDetail = (props: IQueryInstanceDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryInstanceEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryInstance.detail.title">QueryInstance</Translate> [
          <b>{queryInstanceEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstance.name">Name</Translate>
            </span>
          </dt>
          <dd>{queryInstanceEntity.name}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstance.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>
            {queryInstanceEntity.startAt ? <TextFormat value={queryInstanceEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstance.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{queryInstanceEntity.userId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstance.status">Status</Translate>
            </span>
          </dt>
          <dd>{queryInstanceEntity.status}</dd>
          <dt>
            <span id="ponctual">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstance.ponctual">Ponctual</Translate>
            </span>
          </dt>
          <dd>{queryInstanceEntity.ponctual ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryInstance.query">Query</Translate>
          </dt>
          <dd>{queryInstanceEntity.query ? queryInstanceEntity.query.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryInstance.client">Client</Translate>
          </dt>
          <dd>{queryInstanceEntity.client ? queryInstanceEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-instance" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-instance/${queryInstanceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryInstance }: IRootState) => ({
  queryInstanceEntity: queryInstance.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceDetail);
