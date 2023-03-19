import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IEquipement } from 'app/shared/model/microstock/equipement.model';
import { getEntities as getEquipements } from 'app/entities/microstock/equipement/equipement.reducer';
import { getEntity, updateEntity, createEntity, reset } from './engeneering.reducer';
import { IEngeneering } from 'app/shared/model/microstock/engeneering.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEngeneeringUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EngeneeringUpdate = (props: IEngeneeringUpdateProps) => {
  const [equipementId, setEquipementId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { engeneeringEntity, equipements, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/engeneering' + props.location.search);
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
        ...engeneeringEntity,
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
          <h2 id="microgatewayApp.microstockEngeneering.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microstockEngeneering.home.createOrEditLabel">Create or edit a Engeneering</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : engeneeringEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="engeneering-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="engeneering-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="expertiseLabel" for="engeneering-expertise">
                  <Translate contentKey="microgatewayApp.microstockEngeneering.expertise">Expertise</Translate>
                </Label>
                <AvField id="engeneering-expertise" type="text" name="expertise" />
              </AvGroup>
              <AvGroup>
                <Label id="commentaireLabel" for="engeneering-commentaire">
                  <Translate contentKey="microgatewayApp.microstockEngeneering.commentaire">Commentaire</Translate>
                </Label>
                <AvField id="engeneering-commentaire" type="text" name="commentaire" />
              </AvGroup>
              <AvGroup>
                <Label for="engeneering-equipement">
                  <Translate contentKey="microgatewayApp.microstockEngeneering.equipement">Equipement</Translate>
                </Label>
                <AvInput id="engeneering-equipement" type="select" className="form-control" name="equipement.id">
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
              <Button tag={Link} id="cancel-save" to="/engeneering" replace color="info">
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
  engeneeringEntity: storeState.engeneering.entity,
  loading: storeState.engeneering.loading,
  updating: storeState.engeneering.updating,
  updateSuccess: storeState.engeneering.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(EngeneeringUpdate);
