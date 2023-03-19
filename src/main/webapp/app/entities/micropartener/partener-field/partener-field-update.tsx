import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IField } from 'app/shared/model/micropartener/field.model';
import { getEntities as getFields } from 'app/entities/micropartener/field/field.reducer';
import { IPartener } from 'app/shared/model/micropartener/partener.model';
import { getEntities as getParteners } from 'app/entities/micropartener/partener/partener.reducer';
import { getEntity, updateEntity, createEntity, reset } from './partener-field.reducer';
import { IPartenerField } from 'app/shared/model/micropartener/partener-field.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPartenerFieldUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerFieldUpdate = (props: IPartenerFieldUpdateProps) => {
  const [fieldId, setFieldId] = useState('0');
  const [partenerId, setPartenerId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { partenerFieldEntity, fields, parteners, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/partener-field' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getFields();
    props.getParteners();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...partenerFieldEntity,
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
          <h2 id="microgatewayApp.micropartenerPartenerField.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerPartenerField.home.createOrEditLabel">
              Create or edit a PartenerField
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : partenerFieldEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="partener-field-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="partener-field-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="valLabel" for="partener-field-val">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerField.val">Val</Translate>
                </Label>
                <AvField id="partener-field-val" type="text" name="val" />
              </AvGroup>
              <AvGroup check>
                <Label id="visibleLabel">
                  <AvInput id="partener-field-visible" type="checkbox" className="form-check-input" name="visible" />
                  <Translate contentKey="microgatewayApp.micropartenerPartenerField.visible">Visible</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="partener-field-field">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerField.field">Field</Translate>
                </Label>
                <AvInput
                  id="partener-field-field"
                  type="select"
                  className="form-control"
                  name="field.id"
                  value={isNew ? fields[0] && fields[0].id : partenerFieldEntity.field?.id}
                  required
                >
                  {fields
                    ? fields.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="partener-field-partener">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerField.partener">Partener</Translate>
                </Label>
                <AvInput
                  id="partener-field-partener"
                  type="select"
                  className="form-control"
                  name="partener.id"
                  value={isNew ? parteners[0] && parteners[0].id : partenerFieldEntity.partener?.id}
                  required
                >
                  {parteners
                    ? parteners.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/partener-field" replace color="info">
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
  fields: storeState.field.entities,
  parteners: storeState.partener.entities,
  partenerFieldEntity: storeState.partenerField.entity,
  loading: storeState.partenerField.loading,
  updating: storeState.partenerField.updating,
  updateSuccess: storeState.partenerField.updateSuccess,
});

const mapDispatchToProps = {
  getFields,
  getParteners,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerFieldUpdate);
