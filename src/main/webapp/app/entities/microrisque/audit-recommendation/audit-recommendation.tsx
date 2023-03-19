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
import { getEntities } from './audit-recommendation.reducer';
import { IAuditRecommendation } from 'app/shared/model/microrisque/audit-recommendation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IAuditRecommendationProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const AuditRecommendation = (props: IAuditRecommendationProps) => {
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

  const { auditRecommendationList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="audit-recommendation-heading">
        <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.home.title">Audit Recommendations</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.home.createLabel">
            Create new Audit Recommendation
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {auditRecommendationList && auditRecommendationList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('auditorId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorId">Auditor Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('auditorName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorName">Auditor Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('auditorEmail')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorEmail">Auditor Email</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('auditId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditId">Audit Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('content')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.content">Content</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('responsableId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableId">Responsable Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('responsableName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableName">Responsable Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('responsableEmail')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableEmail">Responsable Email</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateLimit')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.dateLimit">Date Limit</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('editAt')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.editAt">Edit At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('executedAt')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.executedAt">Executed At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('entityId')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entityId">Entity Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('entiyName')}>
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entiyName">Entiy Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {auditRecommendationList.map((auditRecommendation, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${auditRecommendation.id}`} color="link" size="sm">
                      {auditRecommendation.id}
                    </Button>
                  </td>
                  <td>{auditRecommendation.auditorId}</td>
                  <td>{auditRecommendation.auditorName}</td>
                  <td>{auditRecommendation.auditorEmail}</td>
                  <td>{auditRecommendation.auditId}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.AuditStatus.${auditRecommendation.status}`} />
                  </td>
                  <td>{auditRecommendation.content}</td>
                  <td>{auditRecommendation.responsableId}</td>
                  <td>{auditRecommendation.responsableName}</td>
                  <td>{auditRecommendation.responsableEmail}</td>
                  <td>
                    {auditRecommendation.dateLimit ? (
                      <TextFormat type="date" value={auditRecommendation.dateLimit} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {auditRecommendation.editAt ? (
                      <TextFormat type="date" value={auditRecommendation.editAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {auditRecommendation.executedAt ? (
                      <TextFormat type="date" value={auditRecommendation.executedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{auditRecommendation.entityId}</td>
                  <td>{auditRecommendation.entiyName}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${auditRecommendation.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${auditRecommendation.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${auditRecommendation.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.home.notFound">
                No Audit Recommendations found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={auditRecommendationList && auditRecommendationList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ auditRecommendation }: IRootState) => ({
  auditRecommendationList: auditRecommendation.entities,
  loading: auditRecommendation.loading,
  totalItems: auditRecommendation.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendation);
