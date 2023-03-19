import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './approvisionnement.reducer';
import { IApprovisionnement } from 'app/shared/model/microstock/approvisionnement.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IApprovisionnementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ApprovisionnementUpdate = (props: IApprovisionnementUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { approvisionnementEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/approvisionnement' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...approvisionnementEntity,
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
          <h2 id="microgatewayApp.microstockApprovisionnement.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microstockApprovisionnement.home.createOrEditLabel">
              Create or edit a Approvisionnement
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : approvisionnementEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="approvisionnement-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="approvisionnement-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="quantiteLabel" for="approvisionnement-quantite">
                  <Translate contentKey="microgatewayApp.microstockApprovisionnement.quantite">Quantite</Translate>
                </Label>
                <AvField id="approvisionnement-quantite" type="string" className="form-control" name="quantite" />
              </AvGroup>
              <AvGroup>
                <Label id="motifLabel" for="approvisionnement-motif">
                  <Translate contentKey="microgatewayApp.microstockApprovisionnement.motif">Motif</Translate>
                </Label>
                <AvField id="approvisionnement-motif" type="text" name="motif" />
              </AvGroup>
              <AvGroup>
                <Label id="dateAjoutLabel" for="approvisionnement-dateAjout">
                  <Translate contentKey="microgatewayApp.microstockApprovisionnement.dateAjout">Date Ajout</Translate>
                </Label>
                <AvField id="approvisionnement-dateAjout" type="date" className="form-control" name="dateAjout" />
              </AvGroup>
              <AvGroup>
                <Label id="delaisAttenteLabel" for="approvisionnement-delaisAttente">
                  <Translate contentKey="microgatewayApp.microstockApprovisionnement.delaisAttente">Delais Attente</Translate>
                </Label>
                <AvField id="approvisionnement-delaisAttente" type="date" className="form-control" name="delaisAttente" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/approvisionnement" replace color="info">
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
  approvisionnementEntity: storeState.approvisionnement.entity,
  loading: storeState.approvisionnement.loading,
  updating: storeState.approvisionnement.updating,
  updateSuccess: storeState.approvisionnement.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ApprovisionnementUpdate);
