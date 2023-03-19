import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-client.reducer';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryClientDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryClientDetail = (props: IQueryClientDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryClientEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryClient.detail.title">QueryClient</Translate> [<b>{queryClientEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.qmanagerQueryClient.name">Name</Translate>
            </span>
          </dt>
          <dd>{queryClientEntity.name}</dd>
          <dt>
            <span id="accountNum">
              <Translate contentKey="microgatewayApp.qmanagerQueryClient.accountNum">Account Num</Translate>
            </span>
          </dt>
          <dd>{queryClientEntity.accountNum}</dd>
          <dt>
            <span id="disabled">
              <Translate contentKey="microgatewayApp.qmanagerQueryClient.disabled">Disabled</Translate>
            </span>
          </dt>
          <dd>{queryClientEntity.disabled ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryClient.type">Type</Translate>
          </dt>
          <dd>{queryClientEntity.type ? queryClientEntity.type.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-client" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-client/${queryClientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryClient }: IRootState) => ({
  queryClientEntity: queryClient.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryClientDetail);
