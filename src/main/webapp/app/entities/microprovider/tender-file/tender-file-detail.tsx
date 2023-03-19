import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-file.reducer';
import { ITenderFile } from 'app/shared/model/microprovider/tender-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderFileDetail = (props: ITenderFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderFile.detail.title">TenderFile</Translate> [<b>{tenderFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microproviderTenderFile.name">Name</Translate>
            </span>
          </dt>
          <dd>{tenderFileEntity.name}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microproviderTenderFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{tenderFileEntity.fileId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderFile.tender">Tender</Translate>
          </dt>
          <dd>{tenderFileEntity.tender ? tenderFileEntity.tender.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-file/${tenderFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderFile }: IRootState) => ({
  tenderFileEntity: tenderFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderFileDetail);
