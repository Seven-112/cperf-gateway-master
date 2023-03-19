import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IConsommable } from 'app/shared/model/microstock/consommable.model';
import { getEntities as getConsommables } from 'app/entities/microstock/consommable/consommable.reducer';
import { IEquipement } from 'app/shared/model/microstock/equipement.model';
import { getEntities as getEquipements } from 'app/entities/microstock/equipement/equipement.reducer';
import { getEntity, updateEntity, createEntity, reset } from './changement.reducer';
import { IChangement } from 'app/shared/model/microstock/changement.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IChangementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChangementUpdate = (props: IChangementUpdateProps) => {
  const [consommableId, setConsommableId] = useState('0');
  const [equipementId, setEquipementId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { changementEntity, consommables, equipements, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/changement' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getConsommables();
    props.getEquipements();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...changementEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microgatewayApp.microstockChangement.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microstockChangement.home.createOrEditLabel">Create or edit a Changement</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : changementEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="changement-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="changement-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="motifLabel" for="changement-motif">
                  <Translate contentKey="microgatewayApp.microstockChangement.motif">Motif</Translate>
                </Label>
                <AvField
                  id="changement-motif"
                  type="text"
                  name="motif"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="etatLabel" for="changement-etat">
                  <Translate contentKey="microgatewayApp.microstockChangement.etat">Etat</Translate>
                </Label>
                <AvInput
                  id="changement-etat"
                  type="select"
                  className="form-control"
                  name="etat"
                  value={(!isNew && changementEntity.etat) || 'Attente'}
                >
                  <option value="Attente">{translate('microgatewayApp.Etat.Attente')}</option>
                  <option value="Validee">{translate('microgatewayApp.Etat.Validee')}</option>
                  <option value="Rejetter">{translate('microgatewayApp.Etat.Rejetter')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="commentaireLabel" for="changement-commentaire">
                  <Translate contentKey="microgatewayApp.microstockChangement.commentaire">Commentaire</Translate>
                </Label>
                <AvField id="changement-commentaire" type="text" name="commentaire" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="changement-fileName">
                  <Translate contentKey="microgatewayApp.microstockChangement.fileName">File Name</Translate>
                </Label>
                <AvField id="changement-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="changement-fileId">
                  <Translate contentKey="microgatewayApp.microstockChangement.fileId">File Id</Translate>
                </Label>
                <AvField id="changement-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="changement-date">
                  <Translate contentKey="microgatewayApp.microstockChangement.date">Date</Translate>
                </Label>
                <AvField id="changement-date" type="date" className="form-control" name="date" />
              </AvGroup>
              <AvGroup>
                <Label for="changement-consommable">
                  <Translate contentKey="microgatewayApp.microstockChangement.consommable">Consommable</Translate>
                </Label>
                <AvInput id="changement-consommable" type="select" className="form-control" name="consommable.id">
                  <option value="" key="0" />
                  {consommables
                    ? consommables.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.nom}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="changement-equipement">
                  <Translate contentKey="microgatewayApp.microstockChangement.equipement">Equipement</Translate>
                </Label>
                <AvInput id="changement-equipement" type="select" className="form-control" name="equipement.id">
                  <option value="" key="0" />
                  {equipements
                    ? equipements.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.nom}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/changement" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  consommables: storeState.consommable.entities,
  equipements: storeState.equipement.entities,
  changementEntity: storeState.changement.entity,
  loading: storeState.changement.loading,
  updating: storeState.changement.updating,
  updateSuccess: storeState.changement.updateSuccess,
});

const mapDispatchToProps = {
  getConsommables,
  getEquipements,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChangementUpdate);
