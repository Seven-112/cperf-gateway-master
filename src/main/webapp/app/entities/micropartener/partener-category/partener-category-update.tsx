import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getPartenerCategories } from 'app/entities/micropartener/partener-category/partener-category.reducer';
import { getEntity, updateEntity, createEntity, reset } from './partener-category.reducer';
import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPartenerCategoryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryUpdate = (props: IPartenerCategoryUpdateProps) => {
  const [parentId, setParentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { partenerCategoryEntity, partenerCategories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/partener-category' + props.location.search);
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
        ...partenerCategoryEntity,
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
          <h2 id="microgatewayApp.micropartenerPartenerCategory.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.home.createOrEditLabel">
              Create or edit a PartenerCategory
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : partenerCategoryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="partener-category-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="partener-category-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="partener-category-name">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.name">Name</Translate>
                </Label>
                <AvField
                  id="partener-category-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="roleLabel" for="partener-category-role">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.role">Role</Translate>
                </Label>
                <AvInput
                  id="partener-category-role"
                  type="select"
                  className="form-control"
                  name="role"
                  value={(!isNew && partenerCategoryEntity.role) || 'ROLE_PROVIDER'}
                >
                  <option value="ROLE_PROVIDER">{translate('microgatewayApp.PartenerRole.ROLE_PROVIDER')}</option>
                  <option value="ROLE_CLIENT">{translate('microgatewayApp.PartenerRole.ROLE_CLIENT')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="noteMinLabel" for="partener-category-noteMin">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.noteMin">Note Min</Translate>
                </Label>
                <AvField id="partener-category-noteMin" type="string" className="form-control" name="noteMin" />
              </AvGroup>
              <AvGroup>
                <Label id="noteMaxLabel" for="partener-category-noteMax">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.noteMax">Note Max</Translate>
                </Label>
                <AvField id="partener-category-noteMax" type="string" className="form-control" name="noteMax" />
              </AvGroup>
              <AvGroup>
                <Label for="partener-category-parent">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.parent">Parent</Translate>
                </Label>
                <AvInput id="partener-category-parent" type="select" className="form-control" name="parent.id">
                  <option value="" key="0" />
                  {partenerCategories
                    ? partenerCategories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/partener-category" replace color="info">
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
  partenerCategoryEntity: storeState.partenerCategory.entity,
  loading: storeState.partenerCategory.loading,
  updating: storeState.partenerCategory.updating,
  updateSuccess: storeState.partenerCategory.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryUpdate);
