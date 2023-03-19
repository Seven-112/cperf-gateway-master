import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './typeindicator.reducer';
import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITypeindicatorUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TypeindicatorUpdate = (props: ITypeindicatorUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { typeindicatorEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/typeindicator' + props.location.search);
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
        ...typeindicatorEntity,
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
          <h2 id="microgatewayApp.typeindicator.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.typeindicator.home.createOrEditLabel">Create or edit a Typeindicator</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : typeindicatorEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="typeindicator-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="typeindicator-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="typeindicator-name">
                  <Translate contentKey="microgatewayApp.typeindicator.name">Name</Translate>
                </Label>
                <AvField
                  id="typeindicator-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="measurableLabel">
                  <AvInput id="typeindicator-measurable" type="checkbox" className="form-check-input" name="measurable" />
                  <Translate contentKey="microgatewayApp.typeindicator.measurable">Measurable</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="typeindicator-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.typeindicator.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/typeindicator" replace color="info">
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
  typeindicatorEntity: storeState.typeindicator.entity,
  loading: storeState.typeindicator.loading,
  updating: storeState.typeindicator.updating,
  updateSuccess: storeState.typeindicator.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeindicatorUpdate);
