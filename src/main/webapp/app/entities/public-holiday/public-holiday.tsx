import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './public-holiday.reducer';
import { IPublicHoliday } from 'app/shared/model/public-holiday.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPublicHolidayProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const PublicHoliday = (props: IPublicHolidayProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { publicHolidayList, match, loading } = props;
  return (
    <div>
      <h2 id="public-holiday-heading">
        <Translate contentKey="microgatewayApp.publicHoliday.home.title">Public Holidays</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.publicHoliday.home.createLabel">Create new Public Holiday</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {publicHolidayList && publicHolidayList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.publicHoliday.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.publicHoliday.ofDate">Of Date</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {publicHolidayList.map((publicHoliday, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${publicHoliday.id}`} color="link" size="sm">
                      {publicHoliday.id}
                    </Button>
                  </td>
                  <td>{publicHoliday.name}</td>
                  <td>
                    {publicHoliday.ofDate ? <TextFormat type="date" value={publicHoliday.ofDate} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${publicHoliday.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${publicHoliday.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${publicHoliday.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="microgatewayApp.publicHoliday.home.notFound">No Public Holidays found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ publicHoliday }: IRootState) => ({
  publicHolidayList: publicHoliday.entities,
  loading: publicHoliday.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PublicHoliday);
