import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './audit.reducer';
import { IAudit } from 'app/shared/model/microrisque/audit.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IAuditProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Audit = (props: IAuditProps) => {
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

  const { auditList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="audit-heading">
        <Translate contentKey="microgatewayApp.microrisqueAudit.home.title">Audits</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microrisqueAudit.home.createLabel">Create new Audit</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {auditList && auditList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('title')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.title">Title</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('startDate')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.startDate">Start Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('endDate')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.endDate">End Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executedAt')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.executedAt">Executed At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processId">Process Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processName">Process Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processCategoryId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryId">Process Category Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('processCategoryName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.processCategoryName">Process Category Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('riskLevel')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskLevel">Risk Level</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('type')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.type">Type</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('riskId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskId">Risk Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('riskName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.riskName">Risk Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microrisqueAudit.cycle">Cycle</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {auditList.map((audit, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${audit.id}`} color="link" size="sm">
                      {audit.id}
                    </Button>
                  </td>
                  <td>{audit.title}</td>
                  <td>{audit.startDate ? <TextFormat type="date" value={audit.startDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{audit.endDate ? <TextFormat type="date" value={audit.endDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{audit.executedAt ? <TextFormat type="date" value={audit.executedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{audit.processId}</td>
                  <td>{audit.processName}</td>
                  <td>{audit.processCategoryId}</td>
                  <td>{audit.processCategoryName}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.AuditRiskLevel.${audit.riskLevel}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.AuditType.${audit.type}`} />
                  </td>
                  <td>
                    <Translate contentKey={`microgatewayApp.AuditStatus.${audit.status}`} />
                  </td>
                  <td>{audit.riskId}</td>
                  <td>{audit.riskName}</td>
                  <td>{audit.cycle ? <Link to={`audit-cycle/${audit.cycle.id}`}>{audit.cycle.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${audit.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${audit.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${audit.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microrisqueAudit.home.notFound">No Audits found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={auditList && auditList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ audit }: IRootState) => ({
  auditList: audit.entities,
  loading: audit.loading,
  totalItems: audit.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Audit);
