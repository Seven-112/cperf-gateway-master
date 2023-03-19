import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getEquipements } from 'app/entities/microstock/equipement/equipement.reducer';
import { getEntity, updateEntity, createEntity, reset } from './equipement.reducer';
import { IEquipement } from 'app/shared/model/microstock/equipement.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEquipementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EquipementUpdate = (props: IEquipementUpdateProps) => {
  const [composantDeId, setComposantDeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { equipementEntity, equipements, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/equipement' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

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
        ...equipementEntity,
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
          <h2 id="microgatewayApp.microstockEquipement.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microstockEquipement.home.createOrEditLabel">Create or edit a Equipement</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : equipementEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="equipement-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="equipement-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nomLabel" for="equipement-nom">
                  <Translate contentKey="microgatewayApp.microstockEquipement.nom">Nom</Translate>
                </Label>
                <AvField
                  id="equipement-nom"
                  type="text"
                  name="nom"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="equipement-description">
                  <Translate contentKey="microgatewayApp.microstockEquipement.description">Description</Translate>
                </Label>
                <AvField id="equipement-description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="dateAjoutLabel" for="equipement-dateAjout">
                  <Translate contentKey="microgatewayApp.microstockEquipement.dateAjout">Date Ajout</Translate>
                </Label>
                <AvField id="equipement-dateAjout" type="date" className="form-control" name="dateAjout" />
              </AvGroup>
              <AvGroup>
                <Label id="dateRemplacementLabel" for="equipement-dateRemplacement">
                  <Translate contentKey="microgatewayApp.microstockEquipement.dateRemplacement">Date Remplacement</Translate>
                </Label>
                <AvField id="equipement-dateRemplacement" type="date" className="form-control" name="dateRemplacement" />
              </AvGroup>
              <AvGroup>
                <Label for="equipement-composantDe">
                  <Translate contentKey="microgatewayApp.microstockEquipement.composantDe">Composant De</Translate>
                </Label>
                <AvInput id="equipement-composantDe" type="select" className="form-control" name="composantDe.id">
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
              <Button tag={Link} id="cancel-save" to="/equipement" replace color="info">
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
  equipements: storeState.equipement.entities,
  equipementEntity: storeState.equipement.entity,
  loading: storeState.equipement.loading,
  updating: storeState.equipement.updating,
  updateSuccess: storeState.equipement.updateSuccess,
});

const mapDispatchToProps = {
  getEquipements,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EquipementUpdate);
