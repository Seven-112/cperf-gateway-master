import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './approvisionnement.reducer';
import { IApprovisionnement } from 'app/shared/model/microstock/approvisionnement.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IApprovisionnementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ApprovisionnementDetail = (props: IApprovisionnementDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { approvisionnementEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microstockApprovisionnement.detail.title">Approvisionnement</Translate> [
          <b>{approvisionnementEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="quantite">
              <Translate contentKey="microgatewayApp.microstockApprovisionnement.quantite">Quantite</Translate>
            </span>
          </dt>
          <dd>{approvisionnementEntity.quantite}</dd>
          <dt>
            <span id="motif">
              <Translate contentKey="microgatewayApp.microstockApprovisionnement.motif">Motif</Translate>
            </span>
          </dt>
          <dd>{approvisionnementEntity.motif}</dd>
          <dt>
            <span id="dateAjout">
              <Translate contentKey="microgatewayApp.microstockApprovisionnement.dateAjout">Date Ajout</Translate>
            </span>
          </dt>
          <dd>
            {approvisionnementEntity.dateAjout ? (
              <TextFormat value={approvisionnementEntity.dateAjout} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="delaisAttente">
              <Translate contentKey="microgatewayApp.microstockApprovisionnement.delaisAttente">Delais Attente</Translate>
            </span>
          </dt>
          <dd>
            {approvisionnementEntity.delaisAttente ? (
              <TextFormat value={approvisionnementEntity.delaisAttente} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/approvisionnement" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/approvisionnement/${approvisionnementEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ approvisionnement }: IRootState) => ({
  approvisionnementEntity: approvisionnement.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ApprovisionnementDetail);
