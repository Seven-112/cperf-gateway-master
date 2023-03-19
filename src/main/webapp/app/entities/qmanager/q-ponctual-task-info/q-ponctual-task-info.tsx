import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './q-ponctual-task-info.reducer';
import { IQPonctualTaskInfo } from 'app/shared/model/qmanager/q-ponctual-task-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IQPonctualTaskInfoProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const QPonctualTaskInfo = (props: IQPonctualTaskInfoProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const { qPonctualTaskInfoList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="q-ponctual-task-info-heading">
        <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.home.title">Q Ponctual Task Infos</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.home.createLabel">Create new Q Ponctual Task Info</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {qPonctualTaskInfoList && qPonctualTaskInfoList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMinutes')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMinutes">Nb Minutes</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbHours')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbHours">Nb Hours</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbDays')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbDays">Nb Days</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMonths')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMonths">Nb Months</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbYears')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbYears">Nb Years</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('qInstanceId')}>
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.qInstanceId">Q Instance Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {qPonctualTaskInfoList.map((qPonctualTaskInfo, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${qPonctualTaskInfo.id}`} color="link" size="sm">
                      {qPonctualTaskInfo.id}
                    </Button>
                  </td>
                  <td>{qPonctualTaskInfo.nbMinutes}</td>
                  <td>{qPonctualTaskInfo.nbHours}</td>
                  <td>{qPonctualTaskInfo.nbDays}</td>
                  <td>{qPonctualTaskInfo.nbMonths}</td>
                  <td>{qPonctualTaskInfo.nbYears}</td>
                  <td>{qPonctualTaskInfo.qInstanceId}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${qPonctualTaskInfo.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${qPonctualTaskInfo.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${qPonctualTaskInfo.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
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
              <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.home.notFound">No Q Ponctual Task Infos found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={qPonctualTaskInfoList && qPonctualTaskInfoList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ qPonctualTaskInfo }: IRootState) => ({
  qPonctualTaskInfoList: qPonctualTaskInfo.entities,
  loading: qPonctualTaskInfo.loading,
  totalItems: qPonctualTaskInfo.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QPonctualTaskInfo);
