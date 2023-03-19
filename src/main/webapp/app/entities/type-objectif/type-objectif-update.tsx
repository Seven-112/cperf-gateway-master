import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './type-objectif.reducer';
import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITypeObjectifUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TypeObjectifUpdate = (props: ITypeObjectifUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { typeObjectifEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/type-objectif' + props.location.search);
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
        ...typeObjectifEntity,
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
          <h2 id="microgatewayApp.typeObjectif.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.typeObjectif.home.createOrEditLabel">Create or edit a TypeObjectif</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : typeObjectifEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="type-objectif-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="type-objectif-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="type-objectif-name">
                  <Translate contentKey="microgatewayApp.typeObjectif.name">Name</Translate>
                </Label>
                <AvField
                  id="type-objectif-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="evalutationUnityLabel" for="type-objectif-evalutationUnity">
                  <Translate contentKey="microgatewayApp.typeObjectif.evalutationUnity">Evalutation Unity</Translate>
                </Label>
                <AvInput
                  id="type-objectif-evalutationUnity"
                  type="select"
                  className="form-control"
                  name="evalutationUnity"
                  value={(!isNew && typeObjectifEntity.evalutationUnity) || 'NOTHING'}
                >
                  <option value="NOTHING">{translate('microgatewayApp.ObjectifTypeEvaluationUnity.NOTHING')}</option>
                  <option value="YEAR">{translate('microgatewayApp.ObjectifTypeEvaluationUnity.YEAR')}</option>
                  <option value="MONTH">{translate('microgatewayApp.ObjectifTypeEvaluationUnity.MONTH')}</option>
                  <option value="WEEK">{translate('microgatewayApp.ObjectifTypeEvaluationUnity.WEEK')}</option>
                  <option value="DAY">{translate('microgatewayApp.ObjectifTypeEvaluationUnity.DAY')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="type-objectif-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.typeObjectif.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/type-objectif" replace color="info">
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
  typeObjectifEntity: storeState.typeObjectif.entity,
  loading: storeState.typeObjectif.loading,
  updating: storeState.typeObjectif.updating,
  updateSuccess: storeState.typeObjectif.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeObjectifUpdate);
