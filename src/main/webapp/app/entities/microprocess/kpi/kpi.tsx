import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './kpi.reducer';
import { IKPI } from 'app/shared/model/microprocess/kpi.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IKPIProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const KPI = (props: IKPIProps) => {
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

  const { kPIList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="kpi-heading">
        <Translate contentKey="microgatewayApp.microprocessKPi.home.title">KPIS</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprocessKPi.home.createLabel">Create new KPI</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {kPIList && kPIList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userId')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.userId">User Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dte')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.dte">Dte</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executed')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executed">Executed</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executedRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedRate">Executed Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executedLate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedLate">Executed Late</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executedLateRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedLateRate">Executed Late Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalExecuted')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalExecuted">Total Executed</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalExecutedRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalExecutedRate">Total Executed Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('started')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.started">Started</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startedRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedRate">Started Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startedLate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedLate">Started Late</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startedLateRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedLateRate">Started Late Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalStarted')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalStarted">Total Started</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalStartedRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalStartedRate">Total Started Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('noStarted')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.noStarted">No Started</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('noStartedRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.noStartedRate">No Started Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executionLevel')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executionLevel">Execution Level</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executionLevelRate')}>
                  <Translate contentKey="microgatewayApp.microprocessKPi.executionLevelRate">Execution Level Rate</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kPIList.map((kPI, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${kPI.id}`} color="link" size="sm">
                      {kPI.id}
                    </Button>
                  </td>
                  <td>{kPI.userId}</td>
                  <td>{kPI.dte ? <TextFormat type="date" value={kPI.dte} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{kPI.executed}</td>
                  <td>{kPI.executedRate}</td>
                  <td>{kPI.executedLate}</td>
                  <td>{kPI.executedLateRate}</td>
                  <td>{kPI.totalExecuted}</td>
                  <td>{kPI.totalExecutedRate}</td>
                  <td>{kPI.started}</td>
                  <td>{kPI.startedRate}</td>
                  <td>{kPI.startedLate}</td>
                  <td>{kPI.startedLateRate}</td>
                  <td>{kPI.totalStarted}</td>
                  <td>{kPI.totalStartedRate}</td>
                  <td>{kPI.noStarted}</td>
                  <td>{kPI.noStartedRate}</td>
                  <td>{kPI.executionLevel}</td>
                  <td>{kPI.executionLevelRate}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${kPI.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${kPI.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${kPI.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprocessKPi.home.notFound">No KPIS found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={kPIList && kPIList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ kPI }: IRootState) => ({
  kPIList: kPI.entities,
  loading: kPI.loading,
  totalItems: kPI.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KPI);
