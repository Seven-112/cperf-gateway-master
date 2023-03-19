import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './cond-node.reducer';
import { ICondNode } from 'app/shared/model/microprocess/cond-node.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICondNodeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CondNodeDetail = (props: ICondNodeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { condNodeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessCondNode.detail.title">CondNode</Translate> [<b>{condNodeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="logigramPosX">
              <Translate contentKey="microgatewayApp.microprocessCondNode.logigramPosX">Logigram Pos X</Translate>
            </span>
          </dt>
          <dd>{condNodeEntity.logigramPosX}</dd>
          <dt>
            <span id="logigramPosY">
              <Translate contentKey="microgatewayApp.microprocessCondNode.logigramPosY">Logigram Pos Y</Translate>
            </span>
          </dt>
          <dd>{condNodeEntity.logigramPosY}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprocessCondNode.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{condNodeEntity.processId}</dd>
          <dt>
            <span id="modelId">
              <Translate contentKey="microgatewayApp.microprocessCondNode.modelId">Model Id</Translate>
            </span>
          </dt>
          <dd>{condNodeEntity.modelId}</dd>
        </dl>
        <Button tag={Link} to="/cond-node" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/cond-node/${condNodeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ condNode }: IRootState) => ({
  condNodeEntity: condNode.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CondNodeDetail);
