import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-field-response.reducer';
import { IQueryFieldResponse } from 'app/shared/model/qmanager/query-field-response.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryFieldResponseDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFieldResponseDetail = (props: IQueryFieldResponseDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryFieldResponseEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.detail.title">QueryFieldResponse</Translate> [
          <b>{queryFieldResponseEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="val">
              <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.val">Val</Translate>
            </span>
          </dt>
          <dd>{queryFieldResponseEntity.val}</dd>
          <dt>
            <span id="fieldId">
              <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.fieldId">Field Id</Translate>
            </span>
          </dt>
          <dd>{queryFieldResponseEntity.fieldId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryFieldResponse.instance">Instance</Translate>
          </dt>
          <dd>{queryFieldResponseEntity.instance ? queryFieldResponseEntity.instance.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-field-response" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-field-response/${queryFieldResponseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryFieldResponse }: IRootState) => ({
  queryFieldResponseEntity: queryFieldResponse.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFieldResponseDetail);
