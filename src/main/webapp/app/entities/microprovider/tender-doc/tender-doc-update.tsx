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
import { getEntity, updateEntity, createEntity, reset } from './tender-doc.reducer';
import { ITenderDoc } from 'app/shared/model/microprovider/tender-doc.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderDocUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderDocUpdate = (props: ITenderDocUpdateProps) => {
  const [tenderId, setTenderId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderDocEntity, tenders, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-doc' + props.location.search);
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
        ...tenderDocEntity,
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
          <h2 id="microgatewayApp.microproviderTenderDoc.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderDoc.home.createOrEditLabel">Create or edit a TenderDoc</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderDocEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-doc-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-doc-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="descriptionLabel" for="tender-doc-description">
                  <Translate contentKey="microgatewayApp.microproviderTenderDoc.description">Description</Translate>
                </Label>
                <AvField
                  id="tender-doc-description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="optionalLabel">
                  <AvInput id="tender-doc-optional" type="checkbox" className="form-check-input" name="optional" />
                  <Translate contentKey="microgatewayApp.microproviderTenderDoc.optional">Optional</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="tender-doc-tender">
                  <Translate contentKey="microgatewayApp.microproviderTenderDoc.tender">Tender</Translate>
                </Label>
                <AvInput
                  id="tender-doc-tender"
                  type="select"
                  className="form-control"
                  name="tender.id"
                  value={isNew ? tenders[0] && tenders[0].id : tenderDocEntity.tender?.id}
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
              <Button tag={Link} id="cancel-save" to="/tender-doc" replace color="info">
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
  tenderDocEntity: storeState.tenderDoc.entity,
  loading: storeState.tenderDoc.loading,
  updating: storeState.tenderDoc.updating,
  updateSuccess: storeState.tenderDoc.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderDocUpdate);
