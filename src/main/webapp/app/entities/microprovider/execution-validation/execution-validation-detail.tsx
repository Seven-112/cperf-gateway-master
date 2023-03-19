import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './execution-validation.reducer';
import { IExecutionValidation } from 'app/shared/model/microprovider/execution-validation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IExecutionValidationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ExecutionValidationDetail = (props: IExecutionValidationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { executionValidationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderExecutionValidation.detail.title">ExecutionValidation</Translate> [
          <b>{executionValidationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microproviderExecutionValidation.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{executionValidationEntity.userId}</dd>
          <dt>
            <span id="approved">
              <Translate contentKey="microgatewayApp.microproviderExecutionValidation.approved">Approved</Translate>
            </span>
          </dt>
          <dd>{executionValidationEntity.approved ? 'true' : 'false'}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microproviderExecutionValidation.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{executionValidationEntity.justification}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderExecutionValidation.execution">Execution</Translate>
          </dt>
          <dd>{executionValidationEntity.execution ? executionValidationEntity.execution.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/execution-validation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/execution-validation/${executionValidationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ executionValidation }: IRootState) => ({
  executionValidationEntity: executionValidation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExecutionValidationDetail);
