import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './dynamic-field.reducer';

export interface IDynamicFieldUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DynamicFieldUpdate = (props: IDynamicFieldUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { dynamicFieldEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/dynamic-field' + props.location.search);
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
        ...dynamicFieldEntity,
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
          <h2 id="microgatewayApp.dynamicField.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.dynamicField.home.createOrEditLabel">Create or edit a DynamicField</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : dynamicFieldEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="dynamic-field-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="dynamic-field-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="dynamic-field-name">
                  <Translate contentKey="microgatewayApp.dynamicField.name">Name</Translate>
                </Label>
                <AvField
                  id="dynamic-field-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="dynamic-field-type">
                  <Translate contentKey="microgatewayApp.dynamicField.type">Type</Translate>
                </Label>
                <AvInput
                  id="dynamic-field-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && dynamicFieldEntity.type) || 'TEXT'}
                >
                  <option value="TEXT">{translate('microgatewayApp.DynamicFieldType.TEXT')}</option>
                  <option value="NUMBER">{translate('microgatewayApp.DynamicFieldType.NUMBER')}</option>
                  <option value="BOOLEAN">{translate('microgatewayApp.DynamicFieldType.BOOLEAN')}</option>
                  <option value="DATE">{translate('microgatewayApp.DynamicFieldType.DATE')}</option>
                  <option value="DATETIME">{translate('microgatewayApp.DynamicFieldType.DATETIME')}</option>
                  <option value="FILE">{translate('microgatewayApp.DynamicFieldType.FILE')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="requiredLabel">
                  <AvInput id="dynamic-field-required" type="checkbox" className="form-check-input" name="required" />
                  <Translate contentKey="microgatewayApp.dynamicField.required">Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="docIdLabel" for="dynamic-field-docId">
                  <Translate contentKey="microgatewayApp.dynamicField.docId">Doc Id</Translate>
                </Label>
                <AvField id="dynamic-field-docId" type="string" className="form-control" name="docId" />
              </AvGroup>
              <AvGroup>
                <Label id="entityIdLabel" for="dynamic-field-entityId">
                  <Translate contentKey="microgatewayApp.dynamicField.entityId">Entity Id</Translate>
                </Label>
                <AvField
                  id="dynamic-field-entityId"
                  type="string"
                  className="form-control"
                  name="entityId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tagLabel" for="dynamic-field-tag">
                  <Translate contentKey="microgatewayApp.dynamicField.tag">Tag</Translate>
                </Label>
                <AvInput
                  id="dynamic-field-tag"
                  type="select"
                  className="form-control"
                  name="tag"
                  value={(!isNew && dynamicFieldEntity.tag) || 'TENDER'}
                >
                  <option value="TENDER">{translate('microgatewayApp.DynamicFieldTag.TENDER')}</option>
                  <option value="TRAKING_EXPEDITION">{translate('microgatewayApp.DynamicFieldTag.TRAKING_EXPEDITION')}</option>
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/dynamic-field" replace color="info">
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
  dynamicFieldEntity: storeState.dynamicField.entity,
  loading: storeState.dynamicField.loading,
  updating: storeState.dynamicField.updating,
  updateSuccess: storeState.dynamicField.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DynamicFieldUpdate);
