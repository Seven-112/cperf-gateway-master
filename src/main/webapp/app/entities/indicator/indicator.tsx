import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './indicator.reducer';
import { IIndicator } from 'app/shared/model/indicator.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IIndicatorProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Indicator = (props: IIndicatorProps) => {
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

  const { indicatorList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="indicator-heading">
        <Translate contentKey="microgatewayApp.indicator.home.title">Indicators</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.indicator.home.createLabel">Create new Indicator</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {indicatorList && indicatorList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('expectedResultNumber')}>
                  <Translate contentKey="microgatewayApp.indicator.expectedResultNumber">Expected Result Number</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('resultUnity')}>
                  <Translate contentKey="microgatewayApp.indicator.resultUnity">Result Unity</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('label')}>
                  <Translate contentKey="microgatewayApp.indicator.label">Label</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('question')}>
                  <Translate contentKey="microgatewayApp.indicator.question">Question</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('resultEditableByActor')}>
                  <Translate contentKey="microgatewayApp.indicator.resultEditableByActor">Result Editable By Actor</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('numberResult')}>
                  <Translate contentKey="microgatewayApp.indicator.numberResult">Number Result</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('percentResult')}>
                  <Translate contentKey="microgatewayApp.indicator.percentResult">Percent Result</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('resultAppreciation')}>
                  <Translate contentKey="microgatewayApp.indicator.resultAppreciation">Result Appreciation</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('averagePercentage')}>
                  <Translate contentKey="microgatewayApp.indicator.averagePercentage">Average Percentage</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('ponderation')}>
                  <Translate contentKey="microgatewayApp.indicator.ponderation">Ponderation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.indicator.typeindicator">Typeindicator</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.indicator.objectif">Objectif</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.indicator.parent">Parent</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {indicatorList.map((indicator, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${indicator.id}`} color="link" size="sm">
                      {indicator.id}
                    </Button>
                  </td>
                  <td>{indicator.expectedResultNumber}</td>
                  <td>{indicator.resultUnity}</td>
                  <td>{indicator.label}</td>
                  <td>{indicator.question}</td>
                  <td>{indicator.resultEditableByActor ? 'true' : 'false'}</td>
                  <td>{indicator.numberResult}</td>
                  <td>{indicator.percentResult}</td>
                  <td>{indicator.resultAppreciation}</td>
                  <td>{indicator.averagePercentage}</td>
                  <td>{indicator.ponderation}</td>
                  <td>
                    {indicator.typeindicator ? (
                      <Link to={`typeindicator/${indicator.typeindicator.id}`}>{indicator.typeindicator.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{indicator.objectif ? <Link to={`objectif/${indicator.objectif.id}`}>{indicator.objectif.id}</Link> : ''}</td>
                  <td>{indicator.parent ? <Link to={`indicator/${indicator.parent.id}`}>{indicator.parent.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${indicator.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${indicator.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${indicator.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.indicator.home.notFound">No Indicators found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={indicatorList && indicatorList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ indicator }: IRootState) => ({
  indicatorList: indicator.entities,
  loading: indicator.loading,
  totalItems: indicator.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Indicator);
