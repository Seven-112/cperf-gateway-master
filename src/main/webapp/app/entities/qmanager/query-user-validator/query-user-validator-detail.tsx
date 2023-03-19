import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './query-user-validator.reducer';
import { IQueryUserValidator } from 'app/shared/model/qmanager/query-user-validator.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQueryUserValidatorDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryUserValidatorDetail = (props: IQueryUserValidatorDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { queryUserValidatorEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.detail.title">QueryUserValidator</Translate> [
          <b>{queryUserValidatorEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="validatorId">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validatorId">Validator Id</Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.validatorId}</dd>
          <dt>
            <span id="previewValidatorId">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.previewValidatorId">Preview Validator Id</Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.previewValidatorId}</dd>
          <dt>
            <span id="validationDeleyLimit">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validationDeleyLimit">Validation Deley Limit</Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.validationDeleyLimit}</dd>
          <dt>
            <span id="validationDeleyLimitUnity">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.validationDeleyLimitUnity">
                Validation Deley Limit Unity
              </Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.validationDeleyLimitUnity}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.userId}</dd>
          <dt>
            <span id="queryId">
              <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.queryId">Query Id</Translate>
            </span>
          </dt>
          <dd>{queryUserValidatorEntity.queryId}</dd>
        </dl>
        <Button tag={Link} to="/query-user-validator" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/query-user-validator/${queryUserValidatorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ queryUserValidator }: IRootState) => ({
  queryUserValidatorEntity: queryUserValidator.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryUserValidatorDetail);
