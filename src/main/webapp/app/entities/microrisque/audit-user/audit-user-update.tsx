import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './audit-user.reducer';
import { IAuditUser } from 'app/shared/model/microrisque/audit-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditUserUpdate = (props: IAuditUserUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditUserEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit-user' + props.location.search);
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
        ...auditUserEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditUser.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditUser.home.createOrEditLabel">Create or edit a AuditUser</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="auditIdLabel" for="audit-user-auditId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditUser.auditId">Audit Id</Translate>
                </Label>
                <AvField id="audit-user-auditId" type="string" className="form-control" name="auditId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="audit-user-userId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditUser.userId">User Id</Translate>
                </Label>
                <AvField id="audit-user-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userFullNameLabel" for="audit-user-userFullName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditUser.userFullName">User Full Name</Translate>
                </Label>
                <AvField id="audit-user-userFullName" type="text" name="userFullName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="audit-user-userEmail">
                  <Translate contentKey="microgatewayApp.microrisqueAuditUser.userEmail">User Email</Translate>
                </Label>
                <AvField id="audit-user-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="roleLabel" for="audit-user-role">
                  <Translate contentKey="microgatewayApp.microrisqueAuditUser.role">Role</Translate>
                </Label>
                <AvInput
                  id="audit-user-role"
                  type="select"
                  className="form-control"
                  name="role"
                  value={(!isNew && auditUserEntity.role) || 'EXECUTOR'}
                >
                  <option value="EXECUTOR">{translate('microgatewayApp.AuditUserRole.EXECUTOR')}</option>
                  <option value="SUBMITOR">{translate('microgatewayApp.AuditUserRole.SUBMITOR')}</option>
                  <option value="VALIDATOR">{translate('microgatewayApp.AuditUserRole.VALIDATOR')}</option>
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-user" replace color="info">
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
  auditUserEntity: storeState.auditUser.entity,
  loading: storeState.auditUser.loading,
  updating: storeState.auditUser.updating,
  updateSuccess: storeState.auditUser.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditUserUpdate);
