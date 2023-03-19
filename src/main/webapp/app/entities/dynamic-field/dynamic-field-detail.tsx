import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './dynamic-field.reducer';
import { IDynamicField } from 'app/shared/model/dynamic-field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDynamicFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DynamicFieldDetail = (props: IDynamicFieldDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { dynamicFieldEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.dynamicField.detail.title">DynamicField</Translate> [<b>{dynamicFieldEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.dynamicField.name">Name</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.name}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.dynamicField.type">Type</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.type}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.dynamicField.required">Required</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.required ? 'true' : 'false'}</dd>
          <dt>
            <span id="docId">
              <Translate contentKey="microgatewayApp.dynamicField.docId">Doc Id</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.docId}</dd>
          <dt>
            <span id="entityId">
              <Translate contentKey="microgatewayApp.dynamicField.entityId">Entity Id</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.entityId}</dd>
          <dt>
            <span id="tag">
              <Translate contentKey="microgatewayApp.dynamicField.tag">Tag</Translate>
            </span>
          </dt>
          <dd>{dynamicFieldEntity.tag}</dd>
        </dl>
        <Button tag={Link} to="/dynamic-field" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/dynamic-field/${dynamicFieldEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ dynamicField }: IRootState) => ({
  dynamicFieldEntity: dynamicField.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DynamicFieldDetail);
