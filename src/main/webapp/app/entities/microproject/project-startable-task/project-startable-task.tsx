import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './project-startable-task.reducer';
import { IProjectStartableTask } from 'app/shared/model/microproject/project-startable-task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProjectStartableTaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProjectStartableTask = (props: IProjectStartableTaskProps) => {
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

  const { projectStartableTaskList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="project-startable-task-heading">
        <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.home.title">Project Startable Tasks</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.home.createLabel">
            Create new Project Startable Task
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {projectStartableTaskList && projectStartableTaskList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('triggerTaskId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskId">Trigger Task Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startableTaskId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskId">Startable Task Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('triggerTaskName')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerTaskName">Trigger Task Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startableTaskName')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableTaskName">Startable Task Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('triggerProjectName')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.triggerProjectName">
                    Trigger Project Name
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startableProjectName')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startableProjectName">
                    Startable Project Name
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.userId">User Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startCond')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.startCond">Start Cond</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projectStartableTaskList.map((projectStartableTask, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${projectStartableTask.id}`} color="link" size="sm">
                      {projectStartableTask.id}
                    </Button>
                  </td>
                  <td>{projectStartableTask.triggerTaskId}</td>
                  <td>{projectStartableTask.startableTaskId}</td>
                  <td>{projectStartableTask.triggerTaskName}</td>
                  <td>{projectStartableTask.startableTaskName}</td>
                  <td>{projectStartableTask.triggerProjectName}</td>
                  <td>{projectStartableTask.startableProjectName}</td>
                  <td>{projectStartableTask.userId}</td>
                  <td>
                    {projectStartableTask.createdAt ? (
                      <TextFormat type="date" value={projectStartableTask.createdAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProjectStartableTaskCond.${projectStartableTask.startCond}`} />
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${projectStartableTask.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${projectStartableTask.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${projectStartableTask.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprojectProjectStartableTask.home.notFound">
                No Project Startable Tasks found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={projectStartableTaskList && projectStartableTaskList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ projectStartableTask }: IRootState) => ({
  projectStartableTaskList: projectStartableTask.entities,
  loading: projectStartableTask.loading,
  totalItems: projectStartableTask.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectStartableTask);
