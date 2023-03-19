import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-cond-node.reducer';
import { IProjectCondNode } from 'app/shared/model/microproject/project-cond-node.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectCondNodeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCondNodeUpdate = (props: IProjectCondNodeUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectCondNodeEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-cond-node' + props.location.search);
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
        ...projectCondNodeEntity,
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
          <h2 id="microgatewayApp.microprojectProjectCondNode.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectCondNode.home.createOrEditLabel">
              Create or edit a ProjectCondNode
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectCondNodeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-cond-node-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-cond-node-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="logigramPosXLabel" for="project-cond-node-logigramPosX">
                  <Translate contentKey="microgatewayApp.microprojectProjectCondNode.logigramPosX">Logigram Pos X</Translate>
                </Label>
                <AvField id="project-cond-node-logigramPosX" type="string" className="form-control" name="logigramPosX" />
              </AvGroup>
              <AvGroup>
                <Label id="logigramPosYLabel" for="project-cond-node-logigramPosY">
                  <Translate contentKey="microgatewayApp.microprojectProjectCondNode.logigramPosY">Logigram Pos Y</Translate>
                </Label>
                <AvField id="project-cond-node-logigramPosY" type="string" className="form-control" name="logigramPosY" />
              </AvGroup>
              <AvGroup>
                <Label id="projectIdLabel" for="project-cond-node-projectId">
                  <Translate contentKey="microgatewayApp.microprojectProjectCondNode.projectId">Project Id</Translate>
                </Label>
                <AvField id="project-cond-node-projectId" type="string" className="form-control" name="projectId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-cond-node" replace color="info">
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
  projectCondNodeEntity: storeState.projectCondNode.entity,
  loading: storeState.projectCondNode.loading,
  updating: storeState.projectCondNode.updating,
  updateSuccess: storeState.projectCondNode.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCondNodeUpdate);
