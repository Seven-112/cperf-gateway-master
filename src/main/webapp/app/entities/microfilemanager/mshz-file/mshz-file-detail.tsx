import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './mshz-file.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IMshzFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MshzFileDetail = (props: IMshzFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { mshzFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.detail.title">MshzFile</Translate> [<b>{mshzFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.name">Name</Translate>
            </span>
          </dt>
          <dd>{mshzFileEntity.name}</dd>
          <dt>
            <span id="fData">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.fData">F Data</Translate>
            </span>
          </dt>
          <dd>
            {mshzFileEntity.fData ? (
              <div>
                {mshzFileEntity.fDataContentType ? (
                  <a onClick={openFile(mshzFileEntity.fDataContentType, mshzFileEntity.fData)}>
                    <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                  </a>
                ) : null}
                <span>
                  {mshzFileEntity.fDataContentType}, {byteSize(mshzFileEntity.fData)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="entityId">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.entityId">Entity Id</Translate>
            </span>
          </dt>
          <dd>{mshzFileEntity.entityId}</dd>
          <dt>
            <span id="entityTagName">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.entityTagName">Entity Tag Name</Translate>
            </span>
          </dt>
          <dd>{mshzFileEntity.entityTagName}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{mshzFileEntity.userId}</dd>
          <dt>
            <span id="storeAt">
              <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.storeAt">Store At</Translate>
            </span>
          </dt>
          <dd>{mshzFileEntity.storeAt ? <TextFormat value={mshzFileEntity.storeAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/mshz-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/mshz-file/${mshzFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ mshzFile }: IRootState) => ({
  mshzFileEntity: mshzFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MshzFileDetail);
