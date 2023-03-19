import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './objectif.reducer';
import { IObjectif } from 'app/shared/model/objectif.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IObjectifProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Objectif = (props: IObjectifProps) => {
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

  const { objectifList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="objectif-heading">
        <Translate contentKey="microgatewayApp.objectif.home.title">Objectifs</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.objectif.home.createLabel">Create new Objectif</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {objectifList && objectifList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="microgatewayApp.objectif.name">Name</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('delay')}>
                  <Translate contentKey="microgatewayApp.objectif.delay">Delay</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="microgatewayApp.objectif.createdAt">Created At</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('categorie')}>
                  <Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('averagePercentage')}>
                  <Translate contentKey="microgatewayApp.objectif.averagePercentage">Average Percentage</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('ponderation')}>
                  <Translate contentKey="microgatewayApp.objectif.ponderation">Ponderation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('realized')}>
                  <Translate contentKey="microgatewayApp.objectif.realized">Realized</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.objectif.typeObjectif">Type Objectif</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.objectif.fonction">Fonction</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.objectif.department">Department</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.objectif.employee">Employee</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.objectif.parent">Parent</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {objectifList.map((objectif, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${objectif.id}`} color="link" size="sm">
                      {objectif.id}
                    </Button>
                  </td>
                  <td>{objectif.name}</td>
                  <td>{objectif.delay}</td>
                  <td>{objectif.createdAt ? <TextFormat type="date" value={objectif.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    <Translate contentKey={`microgatewayApp.ObjectifCategorie.${objectif.categorie}`} />
                  </td>
                  <td>{objectif.averagePercentage}</td>
                  <td>{objectif.ponderation}</td>
                  <td>{objectif.realized ? 'true' : 'false'}</td>
                  <td>
                    {objectif.typeObjectif ? <Link to={`type-objectif/${objectif.typeObjectif.id}`}>{objectif.typeObjectif.id}</Link> : ''}
                  </td>
                  <td>{objectif.fonction ? <Link to={`fonction/${objectif.fonction.id}`}>{objectif.fonction.id}</Link> : ''}</td>
                  <td>{objectif.department ? <Link to={`department/${objectif.department.id}`}>{objectif.department.id}</Link> : ''}</td>
                  <td>{objectif.employee ? <Link to={`employee/${objectif.employee.id}`}>{objectif.employee.id}</Link> : ''}</td>
                  <td>{objectif.parent ? <Link to={`objectif/${objectif.parent.id}`}>{objectif.parent.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${objectif.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${objectif.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${objectif.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.objectif.home.notFound">No Objectifs found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={objectifList && objectifList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ objectif }: IRootState) => ({
  objectifList: objectif.entities,
  loading: objectif.loading,
  totalItems: objectif.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Objectif);
