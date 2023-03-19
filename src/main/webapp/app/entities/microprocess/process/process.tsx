import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import {
  byteSize,
  Translate,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount,
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './process.reducer';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProcessProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Process = (props: IProcessProps) => {
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

  const { processList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="process-heading">
        <Translate contentKey="microgatewayApp.microprocessProcess.home.title">Processes</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprocessProcess.home.createLabel">Create new Process</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {processList && processList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('label')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.label">Label</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('priorityLevel')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.priorityLevel">Priority Level</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('canceledAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.canceledAt">Canceled At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('valid')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.valid">Valid</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('previewStartAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.previewStartAt">Preview Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.startAt">Start At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('previewFinishAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.previewFinishAt">Preview Finish At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('finishedAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.finishedAt">Finished At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startCount')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.startCount">Start Count</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('modelId')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.modelId">Model Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorId')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.editorId">Editor Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('procedureId')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.procedureId">Procedure Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('runnableProcessId')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.runnableProcessId">Runnable Process Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('queryId')}>
                  <Translate contentKey="microgatewayApp.microprocessProcess.queryId">Query Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessProcess.category">Category</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {processList.map((process, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${process.id}`} color="link" size="sm">
                      {process.id}
                    </Button>
                  </td>
                  <td>{process.label}</td>
                  <td>{process.description}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProcessPriority.${process.priorityLevel}`} />
                  </td>
                  <td>{process.canceledAt ? <TextFormat type="date" value={process.canceledAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{process.valid ? 'true' : 'false'}</td>
                  <td>
                    {process.previewStartAt ? <TextFormat type="date" value={process.previewStartAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{process.startAt ? <TextFormat type="date" value={process.startAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    {process.previewFinishAt ? <TextFormat type="date" value={process.previewFinishAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{process.finishedAt ? <TextFormat type="date" value={process.finishedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{process.createdAt ? <TextFormat type="date" value={process.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{process.startCount}</td>
                  <td>{process.modelId}</td>
                  <td>{process.editorId}</td>
                  <td>{process.procedureId}</td>
                  <td>{process.runnableProcessId}</td>
                  <td>{process.queryId}</td>
                  <td>{process.category ? <Link to={`process-category/${process.category.id}`}>{process.category.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${process.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${process.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${process.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={processList && processList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ process }: IRootState) => ({
  processList: process.entities,
  loading: process.loading,
  totalItems: process.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Process);
