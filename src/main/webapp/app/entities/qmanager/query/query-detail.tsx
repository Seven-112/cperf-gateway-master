import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query.reducer';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryDetail = (props: IQueryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQuery.detail.title">Query</Translate> [<b>{queryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.qmanagerQuery.name">Name</Translate>
            </span>
          </dt>
          <dd>{queryEntity.name}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.qmanagerQuery.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{queryEntity.processId}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.qmanagerQuery.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{queryEntity.editorId}</dd>
          <dt>
            <span id="shared">
              <Translate contentKey="microgatewayApp.qmanagerQuery.shared">Shared</Translate>
            </span>
          </dt>
          <dd>{queryEntity.shared ? 'true' : 'false'}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.qmanagerQuery.description">Description</Translate>
            </span>
          </dt>
          <dd>{queryEntity.description}</dd>
          <dt>
            <span id="ponctual">
              <Translate contentKey="microgatewayApp.qmanagerQuery.ponctual">Ponctual</Translate>
            </span>
          </dt>
          <dd>{queryEntity.ponctual ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQuery.category">Category</Translate>
          </dt>
          <dd>{queryEntity.category ? queryEntity.category.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQuery.clientType">Client Type</Translate>
          </dt>
          <dd>{queryEntity.clientType ? queryEntity.clientType.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query/${queryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ query }: IRootState) => ({
  queryEntity: query.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryDetail);
