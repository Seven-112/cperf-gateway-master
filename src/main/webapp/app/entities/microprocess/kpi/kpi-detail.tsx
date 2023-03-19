import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './kpi.reducer';
import { IKPI } from 'app/shared/model/microprocess/kpi.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IKPIDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KPIDetail = (props: IKPIDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { kPIEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessKPi.detail.title">KPI</Translate> [<b>{kPIEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprocessKPi.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.userId}</dd>
          <dt>
            <span id="dte">
              <Translate contentKey="microgatewayApp.microprocessKPi.dte">Dte</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.dte ? <TextFormat value={kPIEntity.dte} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="executed">
              <Translate contentKey="microgatewayApp.microprocessKPi.executed">Executed</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executed}</dd>
          <dt>
            <span id="executedRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.executedRate">Executed Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executedRate}</dd>
          <dt>
            <span id="executedLate">
              <Translate contentKey="microgatewayApp.microprocessKPi.executedLate">Executed Late</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executedLate}</dd>
          <dt>
            <span id="executedLateRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.executedLateRate">Executed Late Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executedLateRate}</dd>
          <dt>
            <span id="totalExecuted">
              <Translate contentKey="microgatewayApp.microprocessKPi.totalExecuted">Total Executed</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.totalExecuted}</dd>
          <dt>
            <span id="totalExecutedRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.totalExecutedRate">Total Executed Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.totalExecutedRate}</dd>
          <dt>
            <span id="started">
              <Translate contentKey="microgatewayApp.microprocessKPi.started">Started</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.started}</dd>
          <dt>
            <span id="startedRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.startedRate">Started Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.startedRate}</dd>
          <dt>
            <span id="startedLate">
              <Translate contentKey="microgatewayApp.microprocessKPi.startedLate">Started Late</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.startedLate}</dd>
          <dt>
            <span id="startedLateRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.startedLateRate">Started Late Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.startedLateRate}</dd>
          <dt>
            <span id="totalStarted">
              <Translate contentKey="microgatewayApp.microprocessKPi.totalStarted">Total Started</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.totalStarted}</dd>
          <dt>
            <span id="totalStartedRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.totalStartedRate">Total Started Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.totalStartedRate}</dd>
          <dt>
            <span id="noStarted">
              <Translate contentKey="microgatewayApp.microprocessKPi.noStarted">No Started</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.noStarted}</dd>
          <dt>
            <span id="noStartedRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.noStartedRate">No Started Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.noStartedRate}</dd>
          <dt>
            <span id="executionLevel">
              <Translate contentKey="microgatewayApp.microprocessKPi.executionLevel">Execution Level</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executionLevel}</dd>
          <dt>
            <span id="executionLevelRate">
              <Translate contentKey="microgatewayApp.microprocessKPi.executionLevelRate">Execution Level Rate</Translate>
            </span>
          </dt>
          <dd>{kPIEntity.executionLevelRate}</dd>
        </dl>
        <Button tag={Link} to="/kpi" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kpi/${kPIEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ kPI }: IRootState) => ({
  kPIEntity: kPI.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KPIDetail);
