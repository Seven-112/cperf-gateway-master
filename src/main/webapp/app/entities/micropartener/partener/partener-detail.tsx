import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener.reducer';
import { IPartener } from 'app/shared/model/micropartener/partener.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerDetail = (props: IPartenerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartener.detail.title">Partener</Translate> [<b>{partenerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="email">
              <Translate contentKey="microgatewayApp.micropartenerPartener.email">Email</Translate>
            </span>
          </dt>
          <dd>{partenerEntity.email}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.micropartenerPartener.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{partenerEntity.userId}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.micropartenerPartener.name">Name</Translate>
            </span>
          </dt>
          <dd>{partenerEntity.name}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartener.category">Category</Translate>
          </dt>
          <dd>{partenerEntity.category ? partenerEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener/${partenerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partener }: IRootState) => ({
  partenerEntity: partener.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerDetail);
