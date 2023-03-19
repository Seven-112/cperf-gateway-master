import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './work-calender.reducer';
import { IWorkCalender } from 'app/shared/model/work-calender.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWorkCalenderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WorkCalenderDetail = (props: IWorkCalenderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { workCalenderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.workCalender.detail.title">WorkCalender</Translate> [<b>{workCalenderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dayNumber">
              <Translate contentKey="microgatewayApp.workCalender.dayNumber">Day Number</Translate>
            </span>
          </dt>
          <dd>{workCalenderEntity.dayNumber}</dd>
          <dt>
            <span id="startTime">
              <Translate contentKey="microgatewayApp.workCalender.startTime">Start Time</Translate>
            </span>
          </dt>
          <dd>
            {workCalenderEntity.startTime ? <TextFormat value={workCalenderEntity.startTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endTime">
              <Translate contentKey="microgatewayApp.workCalender.endTime">End Time</Translate>
            </span>
          </dt>
          <dd>
            {workCalenderEntity.endTime ? <TextFormat value={workCalenderEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/work-calender" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/work-calender/${workCalenderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ workCalender }: IRootState) => ({
  workCalenderEntity: workCalender.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkCalenderDetail);
