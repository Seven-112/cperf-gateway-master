import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';
import { getEntities as getPartenerCategories } from 'app/entities/micropartener/partener-category/partener-category.reducer';
import { getEntity, updateEntity, createEntity, reset } from './field.reducer';
import { IField } from 'app/shared/model/micropartener/field.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IFieldUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FieldUpdate = (props: IFieldUpdateProps) => {
  const [categoryId, setCategoryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { fieldEntity, partenerCategories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/field' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getPartenerCategories();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...fieldEntity,
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
          <h2 id="microgatewayApp.micropartenerField.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerField.home.createOrEditLabel">Create or edit a Field</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : fieldEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="field-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="field-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="field-label">
                  <Translate contentKey="microgatewayApp.micropartenerField.label">Label</Translate>
                </Label>
                <AvField
                  id="field-label"
                  type="text"
                  name="label"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="field-type">
                  <Translate contentKey="microgatewayApp.micropartenerField.type">Type</Translate>
                </Label>
                <AvInput
                  id="field-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && fieldEntity.type) || 'STRING'}
                >
                  <option value="STRING">{translate('microgatewayApp.FieldType.STRING')}</option>
                  <option value="NUMBER">{translate('microgatewayApp.FieldType.NUMBER')}</option>
                  <option value="BOOLEAN">{translate('microgatewayApp.FieldType.BOOLEAN')}</option>
                  <option value="DATE">{translate('microgatewayApp.FieldType.DATE')}</option>
                  <option value="DATETIME">{translate('microgatewayApp.FieldType.DATETIME')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="optinalLabel">
                  <AvInput id="field-optinal" type="checkbox" className="form-check-input" name="optinal" />
                  <Translate contentKey="microgatewayApp.micropartenerField.optinal">Optinal</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="requestFilesLabel">
                  <AvInput id="field-requestFiles" type="checkbox" className="form-check-input" name="requestFiles" />
                  <Translate contentKey="microgatewayApp.micropartenerField.requestFiles">Request Files</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="field-category">
                  <Translate contentKey="microgatewayApp.micropartenerField.category">Category</Translate>
                </Label>
                <AvInput
                  id="field-category"
                  type="select"
                  className="form-control"
                  name="category.id"
                  value={isNew ? partenerCategories[0] && partenerCategories[0].id : fieldEntity.category?.id}
                  required
                >
                  {partenerCategories
                    ? partenerCategories.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/field" replace color="info">
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
  partenerCategories: storeState.partenerCategory.entities,
  fieldEntity: storeState.field.entity,
  loading: storeState.field.loading,
  updating: storeState.field.updating,
  updateSuccess: storeState.field.updateSuccess,
});

const mapDispatchToProps = {
  getPartenerCategories,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FieldUpdate);
