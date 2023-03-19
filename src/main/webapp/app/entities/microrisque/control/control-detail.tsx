import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './control.reducer';
import { IControl } from 'app/shared/model/microrisque/control.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IControlDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ControlDetail = (props: IControlDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { controlEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microrisqueControl.detail.title">Control</Translate> [<b>{controlEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microrisqueControl.description">Description</Translate>
            </span>
          </dt>
          <dd>{controlEntity.description}</dd>
          <dt>
            <span id="validationRequired">
              <Translate contentKey="microgatewayApp.microrisqueControl.validationRequired">Validation Required</Translate>
            </span>
          </dt>
          <dd>{controlEntity.validationRequired ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueControl.type">Type</Translate>
          </dt>
          <dd>{controlEntity.type ? controlEntity.type.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueControl.maturity">Maturity</Translate>
          </dt>
          <dd>{controlEntity.maturity ? controlEntity.maturity.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microrisqueControl.risk">Risk</Translate>
          </dt>
          <dd>{controlEntity.risk ? controlEntity.risk.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/control" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/control/${controlEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ control }: IRootState) => ({
  controlEntity: control.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ControlDetail);
