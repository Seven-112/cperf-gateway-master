import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './field.reducer';
import { IField } from 'app/shared/model/micropartener/field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FieldDetail = (props: IFieldDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { fieldEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerField.detail.title">Field</Translate> [<b>{fieldEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.micropartenerField.label">Label</Translate>
            </span>
          </dt>
          <dd>{fieldEntity.label}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.micropartenerField.type">Type</Translate>
            </span>
          </dt>
          <dd>{fieldEntity.type}</dd>
          <dt>
            <span id="optinal">
              <Translate contentKey="microgatewayApp.micropartenerField.optinal">Optinal</Translate>
            </span>
          </dt>
          <dd>{fieldEntity.optinal ? 'true' : 'false'}</dd>
          <dt>
            <span id="requestFiles">
              <Translate contentKey="microgatewayApp.micropartenerField.requestFiles">Request Files</Translate>
            </span>
          </dt>
          <dd>{fieldEntity.requestFiles ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerField.category">Category</Translate>
          </dt>
          <dd>{fieldEntity.category ? fieldEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/field" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/field/${fieldEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ field }: IRootState) => ({
  fieldEntity: field.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FieldDetail);
