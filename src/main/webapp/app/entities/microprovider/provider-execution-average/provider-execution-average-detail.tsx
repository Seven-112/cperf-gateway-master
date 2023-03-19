import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './provider-execution-average.reducer';
import { IProviderExecutionAverage } from 'app/shared/model/microprovider/provider-execution-average.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProviderExecutionAverageDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderExecutionAverageDetail = (props: IProviderExecutionAverageDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { providerExecutionAverageEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.detail.title">ProviderExecutionAverage</Translate> [
          <b>{providerExecutionAverageEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="providerId">
              <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.providerId">Provider Id</Translate>
            </span>
          </dt>
          <dd>{providerExecutionAverageEntity.providerId}</dd>
          <dt>
            <span id="average">
              <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.average">Average</Translate>
            </span>
          </dt>
          <dd>{providerExecutionAverageEntity.average}</dd>
          <dt>
            <span id="dte">
              <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.dte">Dte</Translate>
            </span>
          </dt>
          <dd>
            {providerExecutionAverageEntity.dte ? (
              <TextFormat value={providerExecutionAverageEntity.dte} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.answer">Answer</Translate>
          </dt>
          <dd>{providerExecutionAverageEntity.answer ? providerExecutionAverageEntity.answer.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/provider-execution-average" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/provider-execution-average/${providerExecutionAverageEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ providerExecutionAverage }: IRootState) => ({
  providerExecutionAverageEntity: providerExecutionAverage.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExecutionAverageDetail);
