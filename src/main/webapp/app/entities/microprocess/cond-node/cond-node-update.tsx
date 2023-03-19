import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './cond-node.reducer';
import { ICondNode } from 'app/shared/model/microprocess/cond-node.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICondNodeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CondNodeUpdate = (props: ICondNodeUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { condNodeEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/cond-node' + props.location.search);
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
        ...condNodeEntity,
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
          <h2 id="microgatewayApp.microprocessCondNode.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessCondNode.home.createOrEditLabel">Create or edit a CondNode</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : condNodeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="cond-node-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="cond-node-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="logigramPosXLabel" for="cond-node-logigramPosX">
                  <Translate contentKey="microgatewayApp.microprocessCondNode.logigramPosX">Logigram Pos X</Translate>
                </Label>
                <AvField id="cond-node-logigramPosX" type="string" className="form-control" name="logigramPosX" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosYLabel" for="cond-node-logigramPosY">
                  <Translate contentKey="microgatewayApp.microprocessCondNode.logigramPosY">Logigram Pos Y</Translate>
                </Label>
                <AvField id="cond-node-logigramPosY" type="string" className="form-control" name="logigramPosY" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="cond-node-processId">
                  <Translate contentKey="microgatewayApp.microprocessCondNode.processId">Process Id</Translate>
                </Label>
                <AvField id="cond-node-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="modelIdLabel" for="cond-node-modelId">
                  <Translate contentKey="microgatewayApp.microprocessCondNode.modelId">Model Id</Translate>
                </Label>
                <AvField id="cond-node-modelId" type="string" className="form-control" name="modelId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/cond-node" replace color="info">
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
  condNodeEntity: storeState.condNode.entity,
  loading: storeState.condNode.loading,
  updating: storeState.condNode.updating,
  updateSuccess: storeState.condNode.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CondNodeUpdate);
