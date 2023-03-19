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
import { getEntity, updateEntity, createEntity, reset } from './partener.reducer';
import { IPartener } from 'app/shared/model/micropartener/partener.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPartenerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerUpdate = (props: IPartenerUpdateProps) => {
  const [categoryId, setCategoryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { partenerEntity, partenerCategories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/partener' + props.location.search);
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
        ...partenerEntity,
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
          <h2 id="microgatewayApp.micropartenerPartener.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerPartener.home.createOrEditLabel">Create or edit a Partener</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : partenerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="partener-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="partener-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="emailLabel" for="partener-email">
                  <Translate contentKey="microgatewayApp.micropartenerPartener.email">Email</Translate>
                </Label>
                <AvField
                  id="partener-email"
                  type="text"
                  name="email"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="partener-userId">
                  <Translate contentKey="microgatewayApp.micropartenerPartener.userId">User Id</Translate>
                </Label>
                <AvField id="partener-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="partener-name">
                  <Translate contentKey="microgatewayApp.micropartenerPartener.name">Name</Translate>
                </Label>
                <AvField
                  id="partener-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="partener-category">
                  <Translate contentKey="microgatewayApp.micropartenerPartener.category">Category</Translate>
                </Label>
                <AvInput
                  id="partener-category"
                  type="select"
                  className="form-control"
                  name="category.id"
                  value={isNew ? partenerCategories[0] && partenerCategories[0].id : partenerEntity.category?.id}
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
              <Button tag={Link} id="cancel-save" to="/partener" replace color="info">
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
  partenerEntity: storeState.partener.entity,
  loading: storeState.partener.loading,
  updating: storeState.partener.updating,
  updateSuccess: storeState.partener.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(PartenerUpdate);
