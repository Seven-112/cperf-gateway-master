import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './q-ponctual-task-info.reducer';
import { IQPonctualTaskInfo } from 'app/shared/model/qmanager/q-ponctual-task-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IQPonctualTaskInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QPonctualTaskInfoDetail = (props: IQPonctualTaskInfoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { qPonctualTaskInfoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.detail.title">QPonctualTaskInfo</Translate> [
          <b>{qPonctualTaskInfoEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nbMinutes">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMinutes">Nb Minutes</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.nbMinutes}</dd>
          <dt>
            <span id="nbHours">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbHours">Nb Hours</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.nbHours}</dd>
          <dt>
            <span id="nbDays">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbDays">Nb Days</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.nbDays}</dd>
          <dt>
            <span id="nbMonths">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMonths">Nb Months</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.nbMonths}</dd>
          <dt>
            <span id="nbYears">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbYears">Nb Years</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.nbYears}</dd>
          <dt>
            <span id="qInstanceId">
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.qInstanceId">Q Instance Id</Translate>
            </span>
          </dt>
          <dd>{qPonctualTaskInfoEntity.qInstanceId}</dd>
        </dl>
        <Button tag={Link} to="/q-ponctual-task-info" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/q-ponctual-task-info/${qPonctualTaskInfoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ qPonctualTaskInfo }: IRootState) => ({
  qPonctualTaskInfoEntity: qPonctualTaskInfo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QPonctualTaskInfoDetail);
