import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './audit-recommendation-file.reducer';
import { IAuditRecommendationFile } from 'app/shared/model/microrisque/audit-recommendation-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAuditRecommendationFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditRecommendationFileUpdate = (props: IAuditRecommendationFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { auditRecommendationFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/audit-recommendation-file' + props.location.search);
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
        ...auditRecommendationFileEntity,
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
          <h2 id="microgatewayApp.microrisqueAuditRecommendationFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.home.createOrEditLabel">
              Create or edit a AuditRecommendationFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : auditRecommendationFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="audit-recommendation-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="audit-recommendation-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="recommendationIdLabel" for="audit-recommendation-file-recommendationId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.recommendationId">Recommendation Id</Translate>
                </Label>
                <AvField id="audit-recommendation-file-recommendationId" type="string" className="form-control" name="recommendationId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="audit-recommendation-file-fileId">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.fileId">File Id</Translate>
                </Label>
                <AvField id="audit-recommendation-file-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="audit-recommendation-file-fileName">
                  <Translate contentKey="microgatewayApp.microrisqueAuditRecommendationFile.fileName">File Name</Translate>
                </Label>
                <AvField id="audit-recommendation-file-fileName" type="text" name="fileName" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/audit-recommendation-file" replace color="info">
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
  auditRecommendationFileEntity: storeState.auditRecommendationFile.entity,
  loading: storeState.auditRecommendationFile.loading,
  updating: storeState.auditRecommendationFile.updating,
  updateSuccess: storeState.auditRecommendationFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationFileUpdate);
