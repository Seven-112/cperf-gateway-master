import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './provider-expedition.reducer';
import { IProviderExpedition } from 'app/shared/model/microprovider/provider-expedition.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProviderExpeditionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProviderExpedition = (props: IProviderExpeditionProps) => {
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

  const { providerExpeditionList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="provider-expedition-heading">
        <Translate contentKey="microgatewayApp.microproviderProviderExpedition.home.title">Provider Expeditions</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microproviderProviderExpedition.home.createLabel">
            Create new Provider Expedition
          </Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {providerExpeditionList && providerExpeditionList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('countryOrigin')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.countryOrigin">Country Origin</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('departureDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.departureDate">Departure Date</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('portArivalDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.portArivalDate">Port Arival Date</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteDeliveryDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.siteDeliveryDate">Site Delivery Date</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('readOnly')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.readOnly">Read Only</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('previewDepatureDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewDepatureDate">
                    Preview Depature Date
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('previewPortArivalDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewPortArivalDate">
                    Preview Port Arival Date
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('previewSiteDeliveryDate')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewSiteDeliveryDate">
                    Preview Site Delivery Date
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('transporter')}>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.transporter">Transporter</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microproviderProviderExpedition.answer">Answer</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {providerExpeditionList.map((providerExpedition, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${providerExpedition.id}`} color="link" size="sm">
                      {providerExpedition.id}
                    </Button>
                  </td>
                  <td>{providerExpedition.countryOrigin}</td>
                  <td>
                    {providerExpedition.departureDate ? (
                      <TextFormat type="date" value={providerExpedition.departureDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {providerExpedition.portArivalDate ? (
                      <TextFormat type="date" value={providerExpedition.portArivalDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {providerExpedition.siteDeliveryDate ? (
                      <TextFormat type="date" value={providerExpedition.siteDeliveryDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{providerExpedition.readOnly ? 'true' : 'false'}</td>
                  <td>
                    {providerExpedition.previewDepatureDate ? (
                      <TextFormat type="date" value={providerExpedition.previewDepatureDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {providerExpedition.previewPortArivalDate ? (
                      <TextFormat type="date" value={providerExpedition.previewPortArivalDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {providerExpedition.previewSiteDeliveryDate ? (
                      <TextFormat type="date" value={providerExpedition.previewSiteDeliveryDate} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{providerExpedition.transporter}</td>
                  <td>
                    {providerExpedition.answer ? (
                      <Link to={`tender-answer/${providerExpedition.answer.id}`}>{providerExpedition.answer.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${providerExpedition.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${providerExpedition.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${providerExpedition.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="microgatewayApp.microproviderProviderExpedition.home.notFound">
                No Provider Expeditions found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={providerExpeditionList && providerExpeditionList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ providerExpedition }: IRootState) => ({
  providerExpeditionList: providerExpedition.entities,
  loading: providerExpedition.loading,
  totalItems: providerExpedition.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExpedition);
