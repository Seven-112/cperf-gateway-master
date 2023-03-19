import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener-field.reducer';
import { IPartenerField } from 'app/shared/model/micropartener/partener-field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerFieldDetail = (props: IPartenerFieldDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerFieldEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartenerField.detail.title">PartenerField</Translate> [
          <b>{partenerFieldEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="val">
              <Translate contentKey="microgatewayApp.micropartenerPartenerField.val">Val</Translate>
            </span>
          </dt>
          <dd>{partenerFieldEntity.val}</dd>
          <dt>
            <span id="visible">
              <Translate contentKey="microgatewayApp.micropartenerPartenerField.visible">Visible</Translate>
            </span>
          </dt>
          <dd>{partenerFieldEntity.visible ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerField.field">Field</Translate>
          </dt>
          <dd>{partenerFieldEntity.field ? partenerFieldEntity.field.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerField.partener">Partener</Translate>
          </dt>
          <dd>{partenerFieldEntity.partener ? partenerFieldEntity.partener.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener-field" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener-field/${partenerFieldEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partenerField }: IRootState) => ({
  partenerFieldEntity: partenerField.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerFieldDetail);
