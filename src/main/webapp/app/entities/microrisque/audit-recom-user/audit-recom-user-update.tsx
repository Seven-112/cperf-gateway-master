import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './audit-recom-user.reducer';
import { IAuditRecomUser } from 'app/shared/model/microrisque/audit-recom-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditRecomUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecomUserUpdate = (props: IAuditRecomUserUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditRecomUserEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit-recom-user' + props.location.search);
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
        ...auditRecomUserEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditRecomUser.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.home.createOrEditLabel">
              Create or edit a AuditRecomUser
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditRecomUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-recom-user-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-recom-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="recomIdLabel" for="audit-recom-user-recomId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.recomId">Recom Id</Translate>
                </Label>
                <AvField id="audit-recom-user-recomId" type="string" className="form-control" name="recomId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="audit-recom-user-userId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userId">User Id</Translate>
                </Label>
                <AvField id="audit-recom-user-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="userFullNameLabel" for="audit-recom-user-userFullName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userFullName">User Full Name</Translate>
                </Label>
                <AvField id="audit-recom-user-userFullName" type="text" name="userFullName" />
              </AvGroup>
              <AvGroup>
                <Label id="userEmailLabel" for="audit-recom-user-userEmail">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.userEmail">User Email</Translate>
                </Label>
                <AvField id="audit-recom-user-userEmail" type="text" name="userEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="roleLabel" for="audit-recom-user-role">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecomUser.role">Role</Translate>
                </Label>
                <AvInput
                  id="audit-recom-user-role"
                  type="select"
                  className="form-control"
                  name="role"
                  value={(!isNew && auditRecomUserEntity.role) || 'EXECUTOR'}
                >
                  <option value="EXECUTOR">{translate('microgatewayApp.AuditUserRole.EXECUTOR')}</option>
                  <option value="SUBMITOR">{translate('microgatewayApp.AuditUserRole.SUBMITOR')}</option>
                  <option value="VALIDATOR">{translate('microgatewayApp.AuditUserRole.VALIDATOR')}</option>
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-recom-user" replace color="info">
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
  auditRecomUserEntity: storeState.auditRecomUser.entity,
  loading: storeState.auditRecomUser.loading,
  updating: storeState.auditRecomUser.updating,
  updateSuccess: storeState.auditRecomUser.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecomUserUpdate);
