import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './privilege.reducer';
import { IPrivilege } from 'app/shared/model/privilege.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPrivilegeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PrivilegeUpdate = (props: IPrivilegeUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { privilegeEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/privilege' + props.location.search);
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
        ...privilegeEntity,
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
          <h2 id="microgatewayApp.privilege.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.privilege.home.createOrEditLabel">Create or edit a Privilege</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : privilegeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="privilege-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="privilege-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup check>
                <Label id="constrainedLabel">
                  <AvInput id="privilege-constrained" type="checkbox" className="form-check-input" name="constrained" />
                  <Translate contentKey="microgatewayApp.privilege.constrained">Constrained</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="authorityLabel" for="privilege-authority">
                  <Translate contentKey="microgatewayApp.privilege.authority">Authority</Translate>
                </Label>
                <AvField
                  id="privilege-authority"
                  type="text"
                  name="authority"
                  validate={{
                    maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="entityLabel" for="privilege-entity">
                  <Translate contentKey="microgatewayApp.privilege.entity">Entity</Translate>
                </Label>
                <AvField
                  id="privilege-entity"
                  type="text"
                  name="entity"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    maxLength: { value: 40, errorMessage: translate('entity.validation.maxlength', { max: 40 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="actionLabel" for="privilege-action">
                  <Translate contentKey="microgatewayApp.privilege.action">Action</Translate>
                </Label>
                <AvField
                  id="privilege-action"
                  type="text"
                  name="action"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/privilege" replace color="info">
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
  privilegeEntity: storeState.privilege.entity,
  loading: storeState.privilege.loading,
  updating: storeState.privilege.updating,
  updateSuccess: storeState.privilege.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeUpdate);
