import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './project-item-check-justification.reducer';
import { IProjectItemCheckJustification } from 'app/shared/model/microproject/project-item-check-justification.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectItemCheckJustificationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectItemCheckJustificationUpdate = (props: IProjectItemCheckJustificationUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectItemCheckJustificationEntity, loading, updating } = props;

  const { justification } = projectItemCheckJustificationEntity;

  const handleClose = () => {
    props.history.push('/project-item-check-justification' + props.location.search);
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
    values.dateAndTime = convertDateTimeToServer(values.dateAndTime);

    if (errors.length === 0) {
      const entity = {
        ...projectItemCheckJustificationEntity,
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
          <h2 id="microgatewayApp.microprojectProjectItemCheckJustification.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.home.createOrEditLabel">
              Create or edit a ProjectItemCheckJustification
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectItemCheckJustificationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-item-check-justification-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-item-check-justification-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup check>
                <Label id="checkedLabel">
                  <AvInput id="project-item-check-justification-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="taskItemIdLabel" for="project-item-check-justification-taskItemId">
                  <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.taskItemId">Task Item Id</Translate>
                </Label>
                <AvField
                  id="project-item-check-justification-taskItemId"
                  type="string"
                  className="form-control"
                  name="taskItemId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="project-item-check-justification-justification">
                  <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.justification">Justification</Translate>
                </Label>
                <AvInput id="project-item-check-justification-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="dateAndTimeLabel" for="project-item-check-justification-dateAndTime">
                  <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.dateAndTime">Date And Time</Translate>
                </Label>
                <AvInput
                  id="project-item-check-justification-dateAndTime"
                  type="datetime-local"
                  className="form-control"
                  name="dateAndTime"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={
                    isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectItemCheckJustificationEntity.dateAndTime)
                  }
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-item-check-justification" replace color="info">
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
  projectItemCheckJustificationEntity: storeState.projectItemCheckJustification.entity,
  loading: storeState.projectItemCheckJustification.loading,
  updating: storeState.projectItemCheckJustification.updating,
  updateSuccess: storeState.projectItemCheckJustification.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationUpdate);
