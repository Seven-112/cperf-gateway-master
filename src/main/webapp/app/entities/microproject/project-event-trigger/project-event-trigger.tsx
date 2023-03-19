import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './project-event-trigger.reducer';
import { IProjectEventTrigger } from 'app/shared/model/microproject/project-event-trigger.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProjectEventTriggerProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProjectEventTrigger = (props: IProjectEventTriggerProps) => {
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

  const { projectEventTriggerList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="project-event-trigger-heading">
        <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.home.title">Project Event Triggers</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.home.createLabel">
            Create new Project Event Trigger
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {projectEventTriggerList && projectEventTriggerList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorId">Editor Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.name">Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('recurrence')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.recurrence">Recurrence</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('disabled')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.disabled">Disabled</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorName')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorName">Editor Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('hour')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.hour">Hour</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('minute')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.minute">Minute</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('firstStartedAt')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.firstStartedAt">First Started At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sheduledOn')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.sheduledOn">Sheduled On</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processId')}>
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.processId">Process Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projectEventTriggerList.map((projectEventTrigger, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${projectEventTrigger.id}`} color="link" size="sm">
                      {projectEventTrigger.id}
                    </Button>
                  </td>
                  <td>{projectEventTrigger.editorId}</td>
                  <td>
                    {projectEventTrigger.createdAt ? (
                      <TextFormat type="date" value={projectEventTrigger.createdAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{projectEventTrigger.name}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ProjectEventRecurrence.${projectEventTrigger.recurrence}`} />
                  </td>
                  <td>{projectEventTrigger.disabled ? 'true' : 'false'}</td>
                  <td>{projectEventTrigger.editorName}</td>
                  <td>{projectEventTrigger.hour}</td>
                  <td>{projectEventTrigger.minute}</td>
                  <td>
                    {projectEventTrigger.firstStartedAt ? (
                      <TextFormat type="date" value={projectEventTrigger.firstStartedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {projectEventTrigger.sheduledOn ? (
                      <TextFormat type="date" value={projectEventTrigger.sheduledOn} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{projectEventTrigger.processId}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${projectEventTrigger.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${projectEventTrigger.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${projectEventTrigger.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.home.notFound">
                No Project Event Triggers found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={projectEventTriggerList && projectEventTriggerList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ projectEventTrigger }: IRootState) => ({
  projectEventTriggerList: projectEventTrigger.entities,
  loading: projectEventTrigger.loading,
  totalItems: projectEventTrigger.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEventTrigger);
