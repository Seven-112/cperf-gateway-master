import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderProviderSelection } from 'app/shared/model/microprovider/tender-provider-selection.model';
import { getEntities as getTenderProviderSelections } from 'app/entities/microprovider/tender-provider-selection/tender-provider-selection.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender-provider-selection-validation.reducer';
import { ITenderProviderSelectionValidation } from 'app/shared/model/microprovider/tender-provider-selection-validation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderProviderSelectionValidationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderSelectionValidationUpdate = (props: ITenderProviderSelectionValidationUpdateProps) => {
  const [selectionId, setSelectionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderProviderSelectionValidationEntity, tenderProviderSelections, loading, updating } = props;

  const { justification } = tenderProviderSelectionValidationEntity;

  const handleClose = () => {
    props.history.push('/tender-provider-selection-validation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderProviderSelections();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tenderProviderSelectionValidationEntity,
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
          <h2 id="microgatewayApp.microproviderTenderProviderSelectionValidation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.home.createOrEditLabel">
              Create or edit a TenderProviderSelectionValidation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderProviderSelectionValidationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-provider-selection-validation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-provider-selection-validation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="validatorIdLabel" for="tender-provider-selection-validation-validatorId">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.validatorId">
                    Validator Id
                  </Translate>
                </Label>
                <AvField
                  id="tender-provider-selection-validation-validatorId"
                  type="string"
                  className="form-control"
                  name="validatorId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="approvedLabel">
                  <AvInput
                    id="tender-provider-selection-validation-approved"
                    type="checkbox"
                    className="form-check-input"
                    name="approved"
                  />
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.approved">Approved</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="tender-provider-selection-validation-justification">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.justification">
                    Justification
                  </Translate>
                </Label>
                <AvInput id="tender-provider-selection-validation-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label for="tender-provider-selection-validation-selection">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.selection">Selection</Translate>
                </Label>
                <AvInput
                  id="tender-provider-selection-validation-selection"
                  type="select"
                  className="form-control"
                  name="selection.id"
                  value={
                    isNew
                      ? tenderProviderSelections[0] && tenderProviderSelections[0].id
                      : tenderProviderSelectionValidationEntity.selection?.id
                  }
                  required
                >
                  {tenderProviderSelections
                    ? tenderProviderSelections.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/tender-provider-selection-validation" replace color="info">
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
  tenderProviderSelections: storeState.tenderProviderSelection.entities,
  tenderProviderSelectionValidationEntity: storeState.tenderProviderSelectionValidation.entity,
  loading: storeState.tenderProviderSelectionValidation.loading,
  updating: storeState.tenderProviderSelectionValidation.updating,
  updateSuccess: storeState.tenderProviderSelectionValidation.updateSuccess,
});

const mapDispatchToProps = {
  getTenderProviderSelections,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderSelectionValidationUpdate);
