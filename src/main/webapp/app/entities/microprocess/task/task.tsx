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
import { getEntities } from './task.reducer';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface ITaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Task = (props: ITaskProps) => {
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

  const { taskList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="task-heading">
        <Translate contentKey="microgatewayApp.microprocessTask.home.title">Tasks</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprocessTask.home.createLabel">Create new Task</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {taskList && taskList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMinuites')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbMinuites">Nb Minuites</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbHours')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbHours">Nb Hours</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbDays')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbDays">Nb Days</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbMonths')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbMonths">Nb Months</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbYears')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbYears">Nb Years</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startAt')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.startAt">Start At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('priorityLevel')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.priorityLevel">Priority Level</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('type')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.type">Type</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('valid')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.valid">Valid</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('finishAt')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.finishAt">Finish At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startWithProcess')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.startWithProcess">Start With Process</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.processId">Process Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('parentId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.parentId">Parent Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('taskModelId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.taskModelId">Task Model Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('pauseAt')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.pauseAt">Pause At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nbPause')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.nbPause">Nb Pause</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('logigramPosX')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.logigramPosX">Logigram Pos X</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('logigramPosY')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.logigramPosY">Logigram Pos Y</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('groupId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.groupId">Group Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('riskId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.riskId">Risk Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('manualMode')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.manualMode">Manual Mode</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartAt')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartAt">Sheduled Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartHour')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartHour">Sheduled Start Hour</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledStartMinute')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.sheduledStartMinute">Sheduled Start Minute</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('checked')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.checked">Checked</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('currentPauseHistoryId')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.currentPauseHistoryId">Current Pause History Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('exceceed')}>
                  <Translate contentKey="microgatewayApp.microprocessTask.exceceed">Exceceed</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessTask.startupTask">Startup Task</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {taskList.map((task, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${task.id}`} color="link" size="sm">
                      {task.id}
                    </Button>
                  </td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.nbMinuites}</td>
                  <td>{task.nbHours}</td>
                  <td>{task.nbDays}</td>
                  <td>{task.nbMonths}</td>
                  <td>{task.nbYears}</td>
                  <td>{task.startAt ? <TextFormat type="date" value={task.startAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.TaskStatus.${task.status}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProcessPriority.${task.priorityLevel}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.TaskType.${task.type}`} />
                  </td>
                  <td>{task.valid ? 'true' : 'false'}</td>
                  <td>{task.finishAt ? <TextFormat type="date" value={task.finishAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{task.startWithProcess ? 'true' : 'false'}</td>
                  <td>{task.processId}</td>
                  <td>{task.parentId}</td>
                  <td>{task.taskModelId}</td>
                  <td>{task.pauseAt ? <TextFormat type="date" value={task.pauseAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{task.nbPause}</td>
                  <td>{task.logigramPosX}</td>
                  <td>{task.logigramPosY}</td>
                  <td>{task.groupId}</td>
                  <td>{task.riskId}</td>
                  <td>{task.manualMode ? 'true' : 'false'}</td>
                  <td>
                    {task.sheduledStartAt ? <TextFormat type="date" value={task.sheduledStartAt} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{task.sheduledStartHour}</td>
                  <td>{task.sheduledStartMinute}</td>
                  <td>{task.checked ? 'true' : 'false'}</td>
                  <td>{task.currentPauseHistoryId}</td>
                  <td>{task.exceceed ? 'true' : 'false'}</td>
                  <td>{task.startupTask ? <Link to={`task/${task.startupTask.id}`}>{task.startupTask.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${task.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${task.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${task.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprocessTask.home.notFound">No Tasks found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={taskList && taskList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ task }: IRootState) => ({
  taskList: task.entities,
  loading: task.loading,
  totalItems: task.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Task);
