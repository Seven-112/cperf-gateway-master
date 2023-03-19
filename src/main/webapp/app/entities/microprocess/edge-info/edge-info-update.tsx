import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './edge-info.reducer';
import { IEdgeInfo } from 'app/shared/model/microprocess/edge-info.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IEdgeInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EdgeInfoUpdate = (props: IEdgeInfoUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { edgeInfoEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/edge-info');
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
        ...edgeInfoEntity,
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
          <h2 id="microgatewayApp.microprocessEdgeInfo.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessEdgeInfo.home.createOrEditLabel">Create or edit a EdgeInfo</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : edgeInfoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="edge-info-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="edge-info-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="sourceLabel" for="edge-info-source">
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.source">Source</Translate>
                </Label>
                <AvField id="edge-info-source" type="text" name="source" />
              </AvGroup>
              <AvGroup>
                <Label id="targetLabel" for="edge-info-target">
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.target">Target</Translate>
                </Label>
                <AvField id="edge-info-target" type="text" name="target" />
              </AvGroup>
              <AvGroup>
                <Label id="sourceHandleLabel" for="edge-info-sourceHandle">
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.sourceHandle">Source Handle</Translate>
                </Label>
                <AvField id="edge-info-sourceHandle" type="text" name="sourceHandle" />
              </AvGroup>
              <AvGroup>
                <Label id="targetHandleLabel" for="edge-info-targetHandle">
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.targetHandle">Target Handle</Translate>
                </Label>
                <AvField id="edge-info-targetHandle" type="text" name="targetHandle" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="edge-info-processId">
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.processId">Process Id</Translate>
                </Label>
                <AvField id="edge-info-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup check>
                <Label id="validLabel">
                  <AvInput id="edge-info-valid" type="checkbox" className="form-check-input" name="valid" />
                  <Translate contentKey="microgatewayApp.microprocessEdgeInfo.valid">Valid</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/edge-info" replace color="info">
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
  edgeInfoEntity: storeState.edgeInfo.entity,
  loading: storeState.edgeInfo.loading,
  updating: storeState.edgeInfo.updating,
  updateSuccess: storeState.edgeInfo.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EdgeInfoUpdate);
