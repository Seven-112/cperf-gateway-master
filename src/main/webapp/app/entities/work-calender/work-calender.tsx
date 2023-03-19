import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './work-calender.reducer';
import { IWorkCalender } from 'app/shared/model/work-calender.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWorkCalenderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WorkCalender = (props: IWorkCalenderProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { workCalenderList, match, loading } = props;
  
  return (
    <div>
      <h2 id="work-calender-heading">
        <Translate contentKey="microgatewayApp.workCalender.home.title">Work Calenders</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.workCalender.home.createLabel">Create new Work Calender</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {workCalenderList && workCalenderList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.workCalender.dayNumber">Day Number</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.workCalender.startTime">Start Time</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.workCalender.endTime">End Time</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {workCalenderList.map((workCalender, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${workCalender.id}`} color="link" size="sm">
                      {workCalender.id}
                    </Button>
                  </td>
                  <td>{workCalender.dayNumber}</td>
                  <td>
                    {workCalender.startTime ? <TextFormat type="date" value={workCalender.startTime} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{workCalender.endTime ? <TextFormat type="date" value={workCalender.endTime} format={APP_DATE_FORMAT} /> : null}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${workCalender.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${workCalender.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${workCalender.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="microgatewayApp.workCalender.home.notFound">No Work Calenders found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ workCalender }: IRootState) => ({
  workCalenderList: workCalender.entities,
  loading: workCalender.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkCalender);
