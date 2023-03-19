import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './equipement.reducer';
import { IEquipement } from 'app/shared/model/microstock/equipement.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEquipementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EquipementDetail = (props: IEquipementDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { equipementEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microstockEquipement.detail.title">Equipement</Translate> [<b>{equipementEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nom">
              <Translate contentKey="microgatewayApp.microstockEquipement.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{equipementEntity.nom}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microstockEquipement.description">Description</Translate>
            </span>
          </dt>
          <dd>{equipementEntity.description}</dd>
          <dt>
            <span id="dateAjout">
              <Translate contentKey="microgatewayApp.microstockEquipement.dateAjout">Date Ajout</Translate>
            </span>
          </dt>
          <dd>
            {equipementEntity.dateAjout ? (
              <TextFormat value={equipementEntity.dateAjout} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateRemplacement">
              <Translate contentKey="microgatewayApp.microstockEquipement.dateRemplacement">Date Remplacement</Translate>
            </span>
          </dt>
          <dd>
            {equipementEntity.dateRemplacement ? (
              <TextFormat value={equipementEntity.dateRemplacement} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="microgatewayApp.microstockEquipement.composantDe">Composant De</Translate>
          </dt>
          <dd>{equipementEntity.composantDe ? equipementEntity.composantDe.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/equipement" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/equipement/${equipementEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ equipement }: IRootState) => ({
  equipementEntity: equipement.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EquipementDetail);
