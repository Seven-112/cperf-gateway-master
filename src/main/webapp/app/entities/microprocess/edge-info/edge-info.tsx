import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './edge-info.reducer';
import { IEdgeInfo } from 'app/shared/model/microprocess/edge-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEdgeInfoProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const EdgeInfo = (props: IEdgeInfoProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { edgeInfoList, match, loading } = props;
  return (
    <div>
      <h2 id="edge-info-heading">
        <Translate contentKey="microgatewayApp.microprocessEdgeInfo.home.title">Edge Infos</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="microgatewayApp.microprocessEdgeInfo.home.createLabel">Create new Edge Info</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {edgeInfoList && edgeInfoList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.source">Source</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.target">Target</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.sourceHandle">Source Handle</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.targetHandle">Target Handle</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.processId">Process Id</Translate>
                </th>
                <th>
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.valid">Valid</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {edgeInfoList.map((edgeInfo, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${edgeInfo.id}`} color="link" size="sm">
                      {edgeInfo.id}
                    </Button>
                  </td>
                  <td>{edgeInfo.source}</td>
                  <td>{edgeInfo.target}</td>
                  <td>{edgeInfo.sourceHandle}</td>
                  <td>{edgeInfo.targetHandle}</td>
                  <td>{edgeInfo.processId}</td>
                  <td>{edgeInfo.valid ? 'true' : 'false'}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${edgeInfo.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${edgeInfo.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${edgeInfo.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="microgatewayApp.microprocessEdgeInfo.home.notFound">No Edge Infos found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ edgeInfo }: IRootState) => ({
  edgeInfoList: edgeInfo.entities,
  loading: edgeInfo.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EdgeInfo);
