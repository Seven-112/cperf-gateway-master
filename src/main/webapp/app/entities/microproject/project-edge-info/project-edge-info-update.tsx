import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-edge-info.reducer';
import { IProjectEdgeInfo } from 'app/shared/model/microproject/project-edge-info.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectEdgeInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectEdgeInfoUpdate = (props: IProjectEdgeInfoUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectEdgeInfoEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-edge-info' + props.location.search);
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
        ...projectEdgeInfoEntity,
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
          <h2 id="microgatewayApp.microprojectProjectEdgeInfo.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.home.createOrEditLabel">
              Create or edit a ProjectEdgeInfo
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectEdgeInfoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-edge-info-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-edge-info-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="sourceLabel" for="project-edge-info-source">
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.source">Source</Translate>
                </Label>
                <AvField id="project-edge-info-source" type="text" name="source" />
              </AvGroup>
              <AvGroup>
                <Label id="targetLabel" for="project-edge-info-target">
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.target">Target</Translate>
                </Label>
                <AvField id="project-edge-info-target" type="text" name="target" />
              </AvGroup>
              <AvGroup>
                <Label id="sourceHandleLabel" for="project-edge-info-sourceHandle">
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.sourceHandle">Source Handle</Translate>
                </Label>
                <AvField id="project-edge-info-sourceHandle" type="text" name="sourceHandle" />
              </AvGroup>
              <AvGroup>
                <Label id="targetHandleLabel" for="project-edge-info-targetHandle">
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.targetHandle">Target Handle</Translate>
                </Label>
                <AvField id="project-edge-info-targetHandle" type="text" name="targetHandle" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="project-edge-info-processId">
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.processId">Process Id</Translate>
                </Label>
                <AvField id="project-edge-info-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="project-edge-info-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-edge-info" replace color="info">
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
  projectEdgeInfoEntity: storeState.projectEdgeInfo.entity,
  loading: storeState.projectEdgeInfo.loading,
  updating: storeState.projectEdgeInfo.updating,
  updateSuccess: storeState.projectEdgeInfo.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEdgeInfoUpdate);
