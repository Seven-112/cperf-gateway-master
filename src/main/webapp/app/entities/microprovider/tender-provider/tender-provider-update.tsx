import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tender-provider.reducer';
import { ITenderProvider } from 'app/shared/model/microprovider/tender-provider.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderProviderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderUpdate = (props: ITenderProviderUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderProviderEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-provider' + props.location.search);
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
        ...tenderProviderEntity,
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
          <h2 id="microgatewayApp.microproviderTenderProvider.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderProvider.home.createOrEditLabel">
              Create or edit a TenderProvider
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderProviderEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-provider-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-provider-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="tenderIdLabel" for="tender-provider-tenderId">
                  <Translate contentKey="microgatewayApp.microproviderTenderProvider.tenderId">Tender Id</Translate>
                </Label>
                <AvField
                  id="tender-provider-tenderId"
                  type="string"
                  className="form-control"
                  name="tenderId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="providerIdLabel" for="tender-provider-providerId">
                  <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerId">Provider Id</Translate>
                </Label>
                <AvField id="tender-provider-providerId" type="string" className="form-control" name="providerId" />
              </AvGroup>
              <AvGroup>
                <Label id="providerEmailLabel" for="tender-provider-providerEmail">
                  <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerEmail">Provider Email</Translate>
                </Label>
                <AvField id="tender-provider-providerEmail" type="text" name="providerEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="providerNameLabel" for="tender-provider-providerName">
                  <Translate contentKey="microgatewayApp.microproviderTenderProvider.providerName">Provider Name</Translate>
                </Label>
                <AvField id="tender-provider-providerName" type="text" name="providerName" />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="tender-provider-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microproviderTenderProvider.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tender-provider" replace color="info">
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
  tenderProviderEntity: storeState.tenderProvider.entity,
  loading: storeState.tenderProvider.loading,
  updating: storeState.tenderProvider.updating,
  updateSuccess: storeState.tenderProvider.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderUpdate);
