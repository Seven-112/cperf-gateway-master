import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './consommable.reducer';
import { IConsommable } from 'app/shared/model/microstock/consommable.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IConsommableDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ConsommableDetail = (props: IConsommableDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { consommableEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microstockConsommable.detail.title">Consommable</Translate> [<b>{consommableEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nom">
              <Translate contentKey="microgatewayApp.microstockConsommable.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{consommableEntity.nom}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microstockConsommable.description">Description</Translate>
            </span>
          </dt>
          <dd>{consommableEntity.description}</dd>
          <dt>
            <span id="dateAjout">
              <Translate contentKey="microgatewayApp.microstockConsommable.dateAjout">Date Ajout</Translate>
            </span>
          </dt>
          <dd>
            {consommableEntity.dateAjout ? (
              <TextFormat value={consommableEntity.dateAjout} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateRemplacement">
              <Translate contentKey="microgatewayApp.microstockConsommable.dateRemplacement">Date Remplacement</Translate>
            </span>
          </dt>
          <dd>
            {consommableEntity.dateRemplacement ? (
              <TextFormat value={consommableEntity.dateRemplacement} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="quantite">
              <Translate contentKey="microgatewayApp.microstockConsommable.quantite">Quantite</Translate>
            </span>
          </dt>
          <dd>{consommableEntity.quantite}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microstockConsommable.composantDe">Composant De</Translate>
          </dt>
          <dd>{consommableEntity.composantDe ? consommableEntity.composantDe.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/consommable" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/consommable/${consommableEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ consommable }: IRootState) => ({
  consommableEntity: consommable.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConsommableDetail);
