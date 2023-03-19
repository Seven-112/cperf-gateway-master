import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './audit-recommendation.reducer';
import { IAuditRecommendation } from 'app/shared/model/microrisque/audit-recommendation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditRecommendationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecommendationUpdate = (props: IAuditRecommendationUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditRecommendationEntity, loading, updating } = props;

  const { content } = auditRecommendationEntity;

  const handleClose = () => {
    props.history.push('/audit-recommendation' + props.location.search);
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
    values.dateLimit = convertDateTimeToServer(values.dateLimit);
    values.editAt = convertDateTimeToServer(values.editAt);
    values.executedAt = convertDateTimeToServer(values.executedAt);

    if (errors.length === 0) {
      const entity = {
        ...auditRecommendationEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditRecommendation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.home.createOrEditLabel">
              Create or edit a AuditRecommendation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditRecommendationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-recommendation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-recommendation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="auditorIdLabel" for="audit-recommendation-auditorId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorId">Auditor Id</Translate>
                </Label>
                <AvField id="audit-recommendation-auditorId" type="string" className="form-control" name="auditorId" />
              </AvGroup>
              <AvGroup>
                <Label id="auditorNameLabel" for="audit-recommendation-auditorName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorName">Auditor Name</Translate>
                </Label>
                <AvField id="audit-recommendation-auditorName" type="text" name="auditorName" />
              </AvGroup>
              <AvGroup>
                <Label id="auditorEmailLabel" for="audit-recommendation-auditorEmail">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditorEmail">Auditor Email</Translate>
                </Label>
                <AvField id="audit-recommendation-auditorEmail" type="text" name="auditorEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="auditIdLabel" for="audit-recommendation-auditId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.auditId">Audit Id</Translate>
                </Label>
                <AvField id="audit-recommendation-auditId" type="string" className="form-control" name="auditId" />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="audit-recommendation-status">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.status">Status</Translate>
                </Label>
                <AvInput
                  id="audit-recommendation-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && auditRecommendationEntity.status) || 'INITIAL'}
                >
                  <option value="INITIAL">{translate('microgatewayApp.AuditStatus.INITIAL')}</option>
                  <option value="STARTED">{translate('microgatewayApp.AuditStatus.STARTED')}</option>
                  <option value="EXECUTED">{translate('microgatewayApp.AuditStatus.EXECUTED')}</option>
                  <option value="SUBMITTED">{translate('microgatewayApp.AuditStatus.SUBMITTED')}</option>
                  <option value="COMPLETED">{translate('microgatewayApp.AuditStatus.COMPLETED')}</option>
                  <option value="CANCELED">{translate('microgatewayApp.AuditStatus.CANCELED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="audit-recommendation-content">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.content">Content</Translate>
                </Label>
                <AvInput id="audit-recommendation-content" type="textarea" name="content" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableIdLabel" for="audit-recommendation-responsableId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableId">Responsable Id</Translate>
                </Label>
                <AvField id="audit-recommendation-responsableId" type="string" className="form-control" name="responsableId" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableNameLabel" for="audit-recommendation-responsableName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableName">Responsable Name</Translate>
                </Label>
                <AvField id="audit-recommendation-responsableName" type="text" name="responsableName" />
              </AvGroup>
              <AvGroup>
                <Label id="responsableEmailLabel" for="audit-recommendation-responsableEmail">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.responsableEmail">Responsable Email</Translate>
                </Label>
                <AvField id="audit-recommendation-responsableEmail" type="text" name="responsableEmail" />
              </AvGroup>
              <AvGroup>
                <Label id="dateLimitLabel" for="audit-recommendation-dateLimit">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.dateLimit">Date Limit</Translate>
                </Label>
                <AvInput
                  id="audit-recommendation-dateLimit"
                  type="datetime-local"
                  className="form-control"
                  name="dateLimit"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditRecommendationEntity.dateLimit)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="editAtLabel" for="audit-recommendation-editAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.editAt">Edit At</Translate>
                </Label>
                <AvInput
                  id="audit-recommendation-editAt"
                  type="datetime-local"
                  className="form-control"
                  name="editAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditRecommendationEntity.editAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="executedAtLabel" for="audit-recommendation-executedAt">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.executedAt">Executed At</Translate>
                </Label>
                <AvInput
                  id="audit-recommendation-executedAt"
                  type="datetime-local"
                  className="form-control"
                  name="executedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.auditRecommendationEntity.executedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="entityIdLabel" for="audit-recommendation-entityId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entityId">Entity Id</Translate>
                </Label>
                <AvField id="audit-recommendation-entityId" type="string" className="form-control" name="entityId" />
              </AvGroup>
              <AvGroup>
                <Label id="entiyNameLabel" for="audit-recommendation-entiyName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendation.entiyName">Entiy Name</Translate>
                </Label>
                <AvField id="audit-recommendation-entiyName" type="text" name="entiyName" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-recommendation" replace color="info">
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
  auditRecommendationEntity: storeState.auditRecommendation.entity,
  loading: storeState.auditRecommendation.loading,
  updating: storeState.auditRecommendation.updating,
  updateSuccess: storeState.auditRecommendation.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationUpdate);
