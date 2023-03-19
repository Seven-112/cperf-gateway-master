import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './tender.reducer';
import { ITender } from 'app/shared/model/microprovider/tender.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderUpdate = (props: ITenderUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderEntity, loading, updating } = props;

  const { content, concernedProviderIds } = tenderEntity;

  const handleClose = () => {
    props.history.push('/tender' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
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
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.expireAt = convertDateTimeToServer(values.expireAt);

    if (errors.length === 0) {
      const entity = {
        ...tenderEntity,
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
          <h2 id="microgatewayApp.microproviderTender.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTender.home.createOrEditLabel">Create or edit a Tender</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="objectLabel" for="tender-object">
                  <Translate contentKey="microgatewayApp.microproviderTender.object">Object</Translate>
                </Label>
                <AvField
                  id="tender-object"
                  type="text"
                  name="object"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="tender-userId">
                  <Translate contentKey="microgatewayApp.microproviderTender.userId">User Id</Translate>
                </Label>
                <AvField
                  id="tender-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="targetCategoryIdLabel" for="tender-targetCategoryId">
                  <Translate contentKey="microgatewayApp.microproviderTender.targetCategoryId">Target Category Id</Translate>
                </Label>
                <AvField
                  id="tender-targetCategoryId"
                  type="string"
                  className="form-control"
                  name="targetCategoryId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tender-createdAt">
                  <Translate contentKey="microgatewayApp.microproviderTender.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="tender-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="expireAtLabel" for="tender-expireAt">
                  <Translate contentKey="microgatewayApp.microproviderTender.expireAt">Expire At</Translate>
                </Label>
                <AvInput
                  id="tender-expireAt"
                  type="datetime-local"
                  className="form-control"
                  name="expireAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.tenderEntity.expireAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="tender-content">
                  <Translate contentKey="microgatewayApp.microproviderTender.content">Content</Translate>
                </Label>
                <AvInput id="tender-content" type="textarea" name="content" />
              </AvGroup>
              <AvGroup check>
                <Label id="executionDeleyRequiredLabel">
                  <AvInput id="tender-executionDeleyRequired" type="checkbox" className="form-check-input" name="executionDeleyRequired" />
                  <Translate contentKey="microgatewayApp.microproviderTender.executionDeleyRequired">Execution Deley Required</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="closedLabel">
                  <AvInput id="tender-closed" type="checkbox" className="form-check-input" name="closed" />
                  <Translate contentKey="microgatewayApp.microproviderTender.closed">Closed</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="publishedLabel">
                  <AvInput id="tender-published" type="checkbox" className="form-check-input" name="published" />
                  <Translate contentKey="microgatewayApp.microproviderTender.published">Published</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="concernedProviderIdsLabel" for="tender-concernedProviderIds">
                  <Translate contentKey="microgatewayApp.microproviderTender.concernedProviderIds">Concerned Provider Ids</Translate>
                </Label>
                <AvInput id="tender-concernedProviderIds" type="textarea" name="concernedProviderIds" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tender" replace color="info">
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
  tenderEntity: storeState.tender.entity,
  loading: storeState.tender.loading,
  updating: storeState.tender.updating,
  updateSuccess: storeState.tender.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderUpdate);
