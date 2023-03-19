import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-client-type.reducer';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryClientTypeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryClientTypeDetail = (props: IQueryClientTypeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryClientTypeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryClientType.detail.title">QueryClientType</Translate> [
          <b>{queryClientTypeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.qmanagerQueryClientType.name">Name</Translate>
            </span>
          </dt>
          <dd>{queryClientTypeEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.qmanagerQueryClientType.description">Description</Translate>
            </span>
          </dt>
          <dd>{queryClientTypeEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/query-client-type" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-client-type/${queryClientTypeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryClientType }: IRootState) => ({
  queryClientTypeEntity: queryClientType.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryClientTypeDetail);
