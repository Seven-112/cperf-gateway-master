import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './risk.reducer';
import { IRisk } from 'app/shared/model/microrisque/risk.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRiskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RiskDetail = (props: IRiskDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { riskEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueRisk.detail.title">Risk</Translate> [<b>{riskEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.microrisqueRisk.label">Label</Translate>
            </span>
          </dt>
          <dd>{riskEntity.label}</dd>
          <dt>
            <span id="probability">
              <Translate contentKey="microgatewayApp.microrisqueRisk.probability">Probability</Translate>
            </span>
          </dt>
          <dd>{riskEntity.probability}</dd>
          <dt>
            <span id="gravity">
              <Translate contentKey="microgatewayApp.microrisqueRisk.gravity">Gravity</Translate>
            </span>
          </dt>
          <dd>{riskEntity.gravity}</dd>
          <dt>
            <span id="cause">
              <Translate contentKey="microgatewayApp.microrisqueRisk.cause">Cause</Translate>
            </span>
          </dt>
          <dd>{riskEntity.cause}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueRisk.type">Type</Translate>
          </dt>
          <dd>{riskEntity.type ? riskEntity.type.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/risk" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/risk/${riskEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ risk }: IRootState) => ({
  riskEntity: risk.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RiskDetail);
