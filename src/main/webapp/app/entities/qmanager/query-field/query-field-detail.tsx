import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-field.reducer';
import { IQueryField } from 'app/shared/model/qmanager/query-field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryFieldDetail = (props: IQueryFieldDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryFieldEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryField.detail.title">QueryField</Translate> [<b>{queryFieldEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fieldId">
              <Translate contentKey="microgatewayApp.qmanagerQueryField.fieldId">Field Id</Translate>
            </span>
          </dt>
          <dd>{queryFieldEntity.fieldId}</dd>
          <dt>
            <span id="queryId">
              <Translate contentKey="microgatewayApp.qmanagerQueryField.queryId">Query Id</Translate>
            </span>
          </dt>
          <dd>{queryFieldEntity.queryId}</dd>
        </dl>
        <Button tag={Link} to="/query-field" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-field/${queryFieldEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryField }: IRootState) => ({
  queryFieldEntity: queryField.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryFieldDetail);
