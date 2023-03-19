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
import { getEntities } from './agenda-event.reducer';
import { IAgendaEvent } from 'app/shared/model/microagenda/agenda-event.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IAgendaEventProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const AgendaEvent = (props: IAgendaEventProps) => {
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

  const { agendaEventList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="agenda-event-heading">
        <Translate contentKey="microgatewayApp.microagendaAgendaEvent.home.title">Agenda Events</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microagendaAgendaEvent.home.createLabel">Create new Agenda Event</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {agendaEventList && agendaEventList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('title')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.title">Title</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('location')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.location">Location</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startAt">Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('endAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.endAt">End At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('timeZone')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.timeZone">Time Zone</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorId')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorId">Editor Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorName')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorName">Editor Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('recurrence')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.recurrence">Recurrence</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('reminderValue')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderValue">Reminder Value</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('reminderUnity')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.reminderUnity">Reminder Unity</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editorEmail')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.editorEmail">Editor Email</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('valid')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.valid">Valid</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nextReminderAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextReminderAt">Next Reminder At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nextOccurenceStartAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceStartAt">Next Occurence Start At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nextOccurenceEndAt')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.nextOccurenceEndAt">Next Occurence End At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('langKey')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.langKey">Lang Key</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startHour')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startHour">Start Hour</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dayOfWeek')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dayOfWeek">Day Of Week</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('month')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.month">Month</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateOfMonth')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.dateOfMonth">Date Of Month</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startYear')}>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.startYear">Start Year</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microagendaAgendaEvent.parent">Parent</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {agendaEventList.map((agendaEvent, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${agendaEvent.id}`} color="link" size="sm">
                      {agendaEvent.id}
                    </Button>
                  </td>
                  <td>{agendaEvent.title}</td>
                  <td>{agendaEvent.description}</td>
                  <td>{agendaEvent.location}</td>
                  <td>{agendaEvent.startAt ? <TextFormat type="date" value={agendaEvent.startAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{agendaEvent.endAt ? <TextFormat type="date" value={agendaEvent.endAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{agendaEvent.timeZone}</td>
                  <td>{agendaEvent.editorId}</td>
                  <td>{agendaEvent.editorName}</td>
                  <td>
                    {agendaEvent.createdAt ? <TextFormat type="date" value={agendaEvent.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.EventRecurrence.${agendaEvent.recurrence}`} />
                  </td>
                  <td>{agendaEvent.reminderValue}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.EventReminderUnity.${agendaEvent.reminderUnity}`} />
                  </td>
                  <td>{agendaEvent.editorEmail}</td>
                  <td>{agendaEvent.valid ? 'true' : 'false'}</td>
                  <td>
                    {agendaEvent.nextReminderAt ? (
                      <TextFormat type="date" value={agendaEvent.nextReminderAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {agendaEvent.nextOccurenceStartAt ? (
                      <TextFormat type="date" value={agendaEvent.nextOccurenceStartAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {agendaEvent.nextOccurenceEndAt ? (
                      <TextFormat type="date" value={agendaEvent.nextOccurenceEndAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{agendaEvent.langKey}</td>
                  <td>{agendaEvent.startHour}</td>
                  <td>{agendaEvent.dayOfWeek}</td>
                  <td>{agendaEvent.month}</td>
                  <td>{agendaEvent.dateOfMonth}</td>
                  <td>{agendaEvent.startYear}</td>
                  <td>{agendaEvent.parent ? <Link to={`agenda-event/${agendaEvent.parent.id}`}>{agendaEvent.parent.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${agendaEvent.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${agendaEvent.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${agendaEvent.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microagendaAgendaEvent.home.notFound">No Agenda Events found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={agendaEventList && agendaEventList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ agendaEvent }: IRootState) => ({
  agendaEventList: agendaEvent.entities,
  loading: agendaEvent.loading,
  totalItems: agendaEvent.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AgendaEvent);
