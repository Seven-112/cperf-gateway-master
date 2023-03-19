import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getQCategories } from 'app/entities/qmanager/q-category/q-category.reducer';
import { getEntity, updateEntity, createEntity, reset } from './q-category.reducer';
import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQCategoryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QCategoryUpdate = (props: IQCategoryUpdateProps) => {
  const [parentId, setParentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { qCategoryEntity, qCategories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/q-category' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getQCategories();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...qCategoryEntity,
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
          <h2 id="microgatewayApp.qmanagerQCategory.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQCategory.home.createOrEditLabel">Create or edit a QCategory</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : qCategoryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="q-category-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="q-category-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="q-category-name">
                  <Translate contentKey="microgatewayApp.qmanagerQCategory.name">Name</Translate>
                </Label>
                <AvField
                  id="q-category-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="q-category-description">
                  <Translate contentKey="microgatewayApp.qmanagerQCategory.description">Description</Translate>
                </Label>
                <AvField id="q-category-description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label for="q-category-parent">
                  <Translate contentKey="microgatewayApp.qmanagerQCategory.parent">Parent</Translate>
                </Label>
                <AvInput id="q-category-parent" type="select" className="form-control" name="parent.id">
                  <option value="" key="0" />
                  {qCategories
                    ? qCategories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/q-category" replace color="info">
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
  qCategories: storeState.qCategory.entities,
  qCategoryEntity: storeState.qCategory.entity,
  loading: storeState.qCategory.loading,
  updating: storeState.qCategory.updating,
  updateSuccess: storeState.qCategory.updateSuccess,
});

const mapDispatchToProps = {
  getQCategories,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QCategoryUpdate);
