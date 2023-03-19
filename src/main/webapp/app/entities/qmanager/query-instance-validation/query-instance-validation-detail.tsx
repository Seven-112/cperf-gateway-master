import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-instance-validation.reducer';
import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryInstanceValidationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationDetail = (props: IQueryInstanceValidationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryInstanceValidationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.detail.title">QueryInstanceValidation</Translate> [
          <b>{queryInstanceValidationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="validatorId">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.validatorId">Validator Id</Translate>
            </span>
          </dt>
          <dd>{queryInstanceValidationEntity.validatorId}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{queryInstanceValidationEntity.justification}</dd>
          <dt>
            <span id="validatedAt">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.validatedAt">Validated At</Translate>
            </span>
          </dt>
          <dd>
            {queryInstanceValidationEntity.validatedAt ? (
              <TextFormat value={queryInstanceValidationEntity.validatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="status">
              <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.status">Status</Translate>
            </span>
          </dt>
          <dd>{queryInstanceValidationEntity.status}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.instance">Instance</Translate>
          </dt>
          <dd>{queryInstanceValidationEntity.instance ? queryInstanceValidationEntity.instance.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/query-instance-validation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-instance-validation/${queryInstanceValidationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryInstanceValidation }: IRootState) => ({
  queryInstanceValidationEntity: queryInstanceValidation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationDetail);
