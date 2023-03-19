import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './model-entity.reducer';
import { IModelEntity } from 'app/shared/model/model-entity.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IModelEntityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ModelEntityDetail = (props: IModelEntityDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { modelEntityEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.modelEntity.detail.title">ModelEntity</Translate> [<b>{modelEntityEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="entity">
              <Translate contentKey="microgatewayApp.modelEntity.entity">Entity</Translate>
            </span>
          </dt>
          <dd>{modelEntityEntity.entity}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.modelEntity.name">Name</Translate>
            </span>
          </dt>
          <dd>{modelEntityEntity.name}</dd>
        </dl>
        <Button tag={Link} to="/model-entity" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/model-entity/${modelEntityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ modelEntity }: IRootState) => ({
  modelEntityEntity: modelEntity.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ModelEntityDetail);
