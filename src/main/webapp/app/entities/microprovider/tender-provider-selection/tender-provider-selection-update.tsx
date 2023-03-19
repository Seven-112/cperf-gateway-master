import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITender } from 'app/shared/model/microprovider/tender.model';
import { getEntities as getTenders } from 'app/entities/microprovider/tender/tender.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tender-provider-selection.reducer';
import { ITenderProviderSelection } from 'app/shared/model/microprovider/tender-provider-selection.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderProviderSelectionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderSelectionUpdate = (props: ITenderProviderSelectionUpdateProps) => {
  const [tenderId, setTenderId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderProviderSelectionEntity, tenders, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-provider-selection' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenders();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tenderProviderSelectionEntity,
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
          <h2 id="microgatewayApp.microproviderTenderProviderSelection.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.home.createOrEditLabel">
              Create or edit a TenderProviderSelection
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderProviderSelectionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-provider-selection-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-provider-selection-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="providerIdLabel" for="tender-provider-selection-providerId">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.providerId">Provider Id</Translate>
                </Label>
                <AvField
                  id="tender-provider-selection-providerId"
                  type="string"
                  className="form-control"
                  name="providerId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="tender-provider-selection-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="tender-provider-selection-userId">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.userId">User Id</Translate>
                </Label>
                <AvField id="tender-provider-selection-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup check>
                <Label id="validatedLabel">
                  <AvInput id="tender-provider-selection-validated" type="checkbox" className="form-check-input" name="validated" />
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.validated">Validated</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="tender-provider-selection-tender">
                  <Translate contentKey="microgatewayApp.microproviderTenderProviderSelection.tender">Tender</Translate>
                </Label>
                <AvInput
                  id="tender-provider-selection-tender"
                  type="select"
                  className="form-control"
                  name="tender.id"
                  value={isNew ? tenders[0] && tenders[0].id : tenderProviderSelectionEntity.tender?.id}
                  required
                >
                  {tenders
                    ? tenders.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/tender-provider-selection" replace color="info">
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
  tenders: storeState.tender.entities,
  tenderProviderSelectionEntity: storeState.tenderProviderSelection.entity,
  loading: storeState.tenderProviderSelection.loading,
  updating: storeState.tenderProviderSelection.updating,
  updateSuccess: storeState.tenderProviderSelection.updateSuccess,
});

const mapDispatchToProps = {
  getTenders,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderSelectionUpdate);
