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
import { getEntities } from './project-task.reducer';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProjectTaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProjectTask = (props: IProjectTaskProps) => {
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

  const { projectTaskList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="project-task-heading">
        <Translate contentKey="microgatewayApp.microprojectProjectTask.home.title">Project Tasks</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprojectProjectTask.home.createLabel">Create new Project Task</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {projectTaskList && projectTaskList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMinuites')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMinuites">Nb Minuites</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbHours')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbHours">Nb Hours</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbDays')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbDays">Nb Days</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMonths')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbMonths">Nb Months</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbYears')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbYears">Nb Years</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startAt">Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('priorityLevel')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.priorityLevel">Priority Level</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('type')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.type">Type</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('valid')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.valid">Valid</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('finishAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.finishAt">Finish At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startWithProcess')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startWithProcess">Start With Process</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.processId">Process Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('parentId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.parentId">Parent Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('taskModelId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.taskModelId">Task Model Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('pauseAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.pauseAt">Pause At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbPause')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.nbPause">Nb Pause</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('logigramPosX')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosX">Logigram Pos X</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('logigramPosY')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.logigramPosY">Logigram Pos Y</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('groupId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.groupId">Group Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('riskId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.riskId">Risk Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('manualMode')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.manualMode">Manual Mode</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartAt">Sheduled Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartHour')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartHour">Sheduled Start Hour</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartMinute')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.sheduledStartMinute">Sheduled Start Minute</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startupTaskId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.startupTaskId">Startup Task Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('ponderation')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.ponderation">Ponderation</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('checked')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectTask.checked">Checked</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projectTaskList.map((projectTask, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${projectTask.id}`} color="link" size="sm">
                      {projectTask.id}
                    </Button>
                  </td>
                  <td>{projectTask.name}</td>
                  <td>{projectTask.description}</td>
                  <td>{projectTask.nbMinuites}</td>
                  <td>{projectTask.nbHours}</td>
                  <td>{projectTask.nbDays}</td>
                  <td>{projectTask.nbMonths}</td>
                  <td>{projectTask.nbYears}</td>
                  <td>{projectTask.startAt ? <TextFormat type="date" value={projectTask.startAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProjectTaskStatus.${projectTask.status}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProjectPriority.${projectTask.priorityLevel}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProjectTaskType.${projectTask.type}`} />
                  </td>
                  <td>{projectTask.valid ? 'true' : 'false'}</td>
                  <td>{projectTask.finishAt ? <TextFormat type="date" value={projectTask.finishAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{projectTask.startWithProcess ? 'true' : 'false'}</td>
                  <td>{projectTask.processId}</td>
                  <td>{projectTask.parentId}</td>
                  <td>{projectTask.taskModelId}</td>
                  <td>{projectTask.pauseAt ? <TextFormat type="date" value={projectTask.pauseAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{projectTask.nbPause}</td>
                  <td>{projectTask.logigramPosX}</td>
                  <td>{projectTask.logigramPosY}</td>
                  <td>{projectTask.groupId}</td>
                  <td>{projectTask.riskId}</td>
                  <td>{projectTask.manualMode ? 'true' : 'false'}</td>
                  <td>
                    {projectTask.sheduledStartAt ? (
                      <TextFormat type="date" value={projectTask.sheduledStartAt} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{projectTask.sheduledStartHour}</td>
                  <td>{projectTask.sheduledStartMinute}</td>
                  <td>{projectTask.startupTaskId}</td>
                  <td>{projectTask.ponderation}</td>
                  <td>{projectTask.checked ? 'true' : 'false'}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${projectTask.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${projectTask.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${projectTask.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprojectProjectTask.home.notFound">No Project Tasks found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={projectTaskList && projectTaskList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ projectTask }: IRootState) => ({
  projectTaskList: projectTask.entities,
  loading: projectTask.loading,
  totalItems: projectTask.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTask);
