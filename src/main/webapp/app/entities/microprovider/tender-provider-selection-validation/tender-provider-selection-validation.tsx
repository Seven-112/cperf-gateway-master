import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { byteSize, Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tender-provider-selection-validation.reducer';
import { ITenderProviderSelectionValidation } from 'app/shared/model/microprovider/tender-provider-selection-validation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface ITenderProviderSelectionValidationProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TenderProviderSelectionValidation = (props: ITenderProviderSelectionValidationProps) => {
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

  const { tenderProviderSelectionValidationList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tender-provider-selection-validation-heading">
        <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.home.title">
          Tender Provider Selection Validations
        </Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.home.createLabel">
            Create new Tender Provider Selection Validation
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {tenderProviderSelectionValidationList && tenderProviderSelectionValidationList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('validatorId')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.validatorId">
                    Validator Id
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('approved')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.approved">Approved</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('justification')}>
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.justification">
                    Justification
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.selection">Selection</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tenderProviderSelectionValidationList.map((tenderProviderSelectionValidation, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tenderProviderSelectionValidation.id}`} color="link" size="sm">
                      {tenderProviderSelectionValidation.id}
                    </Button>
                  </td>
                  <td>{tenderProviderSelectionValidation.validatorId}</td>
                  <td>{tenderProviderSelectionValidation.approved ? 'true' : 'false'}</td>
                  <td>{tenderProviderSelectionValidation.justification}</td>
                  <td>
                    {tenderProviderSelectionValidation.selection ? (
                      <Link to={`tender-provider-selection/${tenderProviderSelectionValidation.selection.id}`}>
                        {tenderProviderSelectionValidation.selection.id}
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tenderProviderSelectionValidation.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tenderProviderSelectionValidation.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${tenderProviderSelectionValidation.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.home.notFound">
                No Tender Provider Selection Validations found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={tenderProviderSelectionValidationList && tenderProviderSelectionValidationList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tenderProviderSelectionValidation }: IRootState) => ({
  tenderProviderSelectionValidationList: tenderProviderSelectionValidation.entities,
  loading: tenderProviderSelectionValidation.loading,
  totalItems: tenderProviderSelectionValidation.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderSelectionValidation);
