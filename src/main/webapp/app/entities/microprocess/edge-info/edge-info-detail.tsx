import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './edge-info.reducer';
import { IEdgeInfo } from 'app/shared/model/microprocess/edge-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEdgeInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EdgeInfoDetail = (props: IEdgeInfoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { edgeInfoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessEdgeInfo.detail.title">EdgeInfo</Translate> [<b>{edgeInfoEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="source">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.source">Source</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.source}</dd>
          <dt>
            <span id="target">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.target">Target</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.target}</dd>
          <dt>
            <span id="sourceHandle">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.sourceHandle">Source Handle</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.sourceHandle}</dd>
          <dt>
            <span id="targetHandle">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.targetHandle">Target Handle</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.targetHandle}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.processId}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{edgeInfoEntity.valid ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/edge-info" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/edge-info/${edgeInfoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ edgeInfo }: IRootState) => ({
  edgeInfoEntity: edgeInfo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EdgeInfoDetail);
