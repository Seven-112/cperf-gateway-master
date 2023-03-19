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
import { getEntities } from './tender-execution-evaluation.reducer';
import { ITenderExecutionEvaluation } from 'app/shared/model/microprovider/tender-execution-evaluation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface ITenderExecutionEvaluationProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TenderExecutionEvaluation = (props: ITenderExecutionEvaluationProps) => {
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

  const { tenderExecutionEvaluationList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tender-execution-evaluation-heading">
        <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.home.title">Tender Execution Evaluations</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.home.createLabel">
            Create new Tender Execution Evaluation
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {tenderExecutionEvaluationList && tenderExecutionEvaluationList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('note')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.note">Note</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('scale')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.scale">Scale</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('justification')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.justification">Justification</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userId')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userId">User Id</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userFullName')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.userFullName">User Full Name</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('storeAt')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.storeAt">Store At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updateAt')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.updateAt">Update At</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('ponderation')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.ponderation">Ponderation</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.execution">Execution</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tenderExecutionEvaluationList.map((tenderExecutionEvaluation, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tenderExecutionEvaluation.id}`} color="link" size="sm">
                      {tenderExecutionEvaluation.id}
                    </Button>
                  </td>
                  <td>{tenderExecutionEvaluation.note}</td>
                  <td>{tenderExecutionEvaluation.scale}</td>
                  <td>{tenderExecutionEvaluation.justification}</td>
                  <td>{tenderExecutionEvaluation.userId}</td>
                  <td>{tenderExecutionEvaluation.userFullName}</td>
                  <td>
                    {tenderExecutionEvaluation.storeAt ? (
                      <TextFormat type="date" value={tenderExecutionEvaluation.storeAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {tenderExecutionEvaluation.updateAt ? (
                      <TextFormat type="date" value={tenderExecutionEvaluation.updateAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{tenderExecutionEvaluation.ponderation}</td>
                  <td>
                    {tenderExecutionEvaluation.execution ? (
                      <Link to={`tender-answer-execution/${tenderExecutionEvaluation.execution.id}`}>
                        {tenderExecutionEvaluation.execution.id}
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tenderExecutionEvaluation.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tenderExecutionEvaluation.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${tenderExecutionEvaluation.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microproviderTenderExecutionEvaluation.home.notFound">
                No Tender Execution Evaluations found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={tenderExecutionEvaluationList && tenderExecutionEvaluationList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tenderExecutionEvaluation }: IRootState) => ({
  tenderExecutionEvaluationList: tenderExecutionEvaluation.entities,
  loading: tenderExecutionEvaluation.loading,
  totalItems: tenderExecutionEvaluation.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderExecutionEvaluation);
