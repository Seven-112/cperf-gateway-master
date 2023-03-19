import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './changement.reducer';
import { IChangement } from 'app/shared/model/microstock/changement.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IChangementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChangementDetail = (props: IChangementDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { changementEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microstockChangement.detail.title">Changement</Translate> [<b>{changementEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="motif">
              <Translate contentKey="microgatewayApp.microstockChangement.motif">Motif</Translate>
            </span>
          </dt>
          <dd>{changementEntity.motif}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="microgatewayApp.microstockChangement.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{changementEntity.etat}</dd>
          <dt>
            <span id="commentaire">
              <Translate contentKey="microgatewayApp.microstockChangement.commentaire">Commentaire</Translate>
            </span>
          </dt>
          <dd>{changementEntity.commentaire}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microstockChangement.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{changementEntity.fileName}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microstockChangement.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{changementEntity.fileId}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="microgatewayApp.microstockChangement.date">Date</Translate>
            </span>
          </dt>
          <dd>{changementEntity.date ? <TextFormat value={changementEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microstockChangement.consommable">Consommable</Translate>
          </dt>
          <dd>{changementEntity.consommable ? changementEntity.consommable.nom : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microstockChangement.equipement">Equipement</Translate>
          </dt>
          <dd>{changementEntity.equipement ? changementEntity.equipement.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/changement" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/changement/${changementEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ changement }: IRootState) => ({
  changementEntity: changement.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChangementDetail);
