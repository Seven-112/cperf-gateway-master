import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getConsommables } from 'app/entities/microstock/consommable/consommable.reducer';
import { getEntity, updateEntity, createEntity, reset } from './consommable.reducer';
import { IConsommable } from 'app/shared/model/microstock/consommable.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IConsommableUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ConsommableUpdate = (props: IConsommableUpdateProps) => {
  const [composantDeId, setComposantDeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { consommableEntity, consommables, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/consommable' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getConsommables();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...consommableEntity,
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
          <h2 id="microgatewayApp.microstockConsommable.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microstockConsommable.home.createOrEditLabel">Create or edit a Consommable</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : consommableEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="consommable-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="consommable-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nomLabel" for="consommable-nom">
                  <Translate contentKey="microgatewayApp.microstockConsommable.nom">Nom</Translate>
                </Label>
                <AvField
                  id="consommable-nom"
                  type="text"
                  name="nom"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="consommable-description">
                  <Translate contentKey="microgatewayApp.microstockConsommable.description">Description</Translate>
                </Label>
                <AvField id="consommable-description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="dateAjoutLabel" for="consommable-dateAjout">
                  <Translate contentKey="microgatewayApp.microstockConsommable.dateAjout">Date Ajout</Translate>
                </Label>
                <AvField id="consommable-dateAjout" type="date" className="form-control" name="dateAjout" />
              </AvGroup>
              <AvGroup>
                <Label id="dateRemplacementLabel" for="consommable-dateRemplacement">
                  <Translate contentKey="microgatewayApp.microstockConsommable.dateRemplacement">Date Remplacement</Translate>
                </Label>
                <AvField id="consommable-dateRemplacement" type="date" className="form-control" name="dateRemplacement" />
              </AvGroup>
              <AvGroup>
                <Label id="quantiteLabel" for="consommable-quantite">
                  <Translate contentKey="microgatewayApp.microstockConsommable.quantite">Quantite</Translate>
                </Label>
                <AvField id="consommable-quantite" type="string" className="form-control" name="quantite" />
              </AvGroup>
              <AvGroup>
                <Label for="consommable-composantDe">
                  <Translate contentKey="microgatewayApp.microstockConsommable.composantDe">Composant De</Translate>
                </Label>
                <AvInput id="consommable-composantDe" type="select" className="form-control" name="composantDe.id">
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
              <Button tag={Link} id="cancel-save" to="/consommable" replace color="info">
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
  consommableEntity: storeState.consommable.entity,
  loading: storeState.consommable.loading,
  updating: storeState.consommable.updating,
  updateSuccess: storeState.consommable.updateSuccess,
});

const mapDispatchToProps = {
  getConsommables,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConsommableUpdate);
