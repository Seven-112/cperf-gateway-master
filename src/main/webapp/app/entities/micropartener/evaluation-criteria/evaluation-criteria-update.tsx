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
import { getEntity, updateEntity, createEntity, reset } from './evaluation-criteria.reducer';
import { IEvaluationCriteria } from 'app/shared/model/micropartener/evaluation-criteria.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEvaluationCriteriaUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EvaluationCriteriaUpdate = (props: IEvaluationCriteriaUpdateProps) => {
  const [categoryId, setCategoryId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { evaluationCriteriaEntity, partenerCategories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/evaluation-criteria' + props.location.search);
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
        ...evaluationCriteriaEntity,
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
          <h2 id="microgatewayApp.micropartenerEvaluationCriteria.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.home.createOrEditLabel">
              Create or edit a EvaluationCriteria
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : evaluationCriteriaEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="evaluation-criteria-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="evaluation-criteria-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="evaluation-criteria-name">
                  <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.name">Name</Translate>
                </Label>
                <AvField
                  id="evaluation-criteria-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="evaluation-criteria-ponderation">
                  <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="evaluation-criteria-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup>
                <Label for="evaluation-criteria-category">
                  <Translate contentKey="microgatewayApp.micropartenerEvaluationCriteria.category">Category</Translate>
                </Label>
                <AvInput
                  id="evaluation-criteria-category"
                  type="select"
                  className="form-control"
                  name="category.id"
                  value={isNew ? partenerCategories[0] && partenerCategories[0].id : evaluationCriteriaEntity.category?.id}
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
              <Button tag={Link} id="cancel-save" to="/evaluation-criteria" replace color="info">
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
  evaluationCriteriaEntity: storeState.evaluationCriteria.entity,
  loading: storeState.evaluationCriteria.loading,
  updating: storeState.evaluationCriteria.updating,
  updateSuccess: storeState.evaluationCriteria.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationCriteriaUpdate);
