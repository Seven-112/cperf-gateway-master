import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './process-category-user.reducer';
import { IProcessCategoryUser } from 'app/shared/model/microprocess/process-category-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessCategoryUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessCategoryUserUpdate = (props: IProcessCategoryUserUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { processCategoryUserEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/process-category-user' + props.location.search);
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
        ...processCategoryUserEntity,
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
          <h2 id="microgatewayApp.microprocessProcessCategoryUser.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.home.createOrEditLabel">
              Create or edit a ProcessCategoryUser
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processCategoryUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-category-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="process-category-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="process-category-user-userId">
                  <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userId">User Id</Translate>
                </Label>
                <AvField id="process-category-user-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userFullNameLabel" for="process-category-user-userFullName">
                  <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userFullName">User Full Name</Translate>
                </Label>
                <AvField id="process-category-user-userFullName" type="text" name="userFullName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="process-category-user-userEmail">
                  <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.userEmail">User Email</Translate>
                </Label>
                <AvField id="process-category-user-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="categoryIdLabel" for="process-category-user-categoryId">
                  <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.categoryId">Category Id</Translate>
                </Label>
                <AvField id="process-category-user-categoryId" type="string" className="form-control" name="categoryId" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="process-category-user-processId">
                  <Translate contentKey="microgatewayApp.microprocessProcessCategoryUser.processId">Process Id</Translate>
                </Label>
                <AvField id="process-category-user-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process-category-user" replace color="info">
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
  processCategoryUserEntity: storeState.processCategoryUser.entity,
  loading: storeState.processCategoryUser.loading,
  updating: storeState.processCategoryUser.updating,
  updateSuccess: storeState.processCategoryUser.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCategoryUserUpdate);
