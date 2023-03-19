import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './justification.reducer';
import { IJustification } from 'app/shared/model/microprocess/justification.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IJustificationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JustificationUpdate = (props: IJustificationUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { justificationEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/justification' + props.location.search);
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
        ...justificationEntity,
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
          <h2 id="microgatewayApp.microprocessJustification.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessJustification.home.createOrEditLabel">
              Create or edit a Justification
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : justificationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="justification-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="justification-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="contentLabel" for="justification-content">
                  <Translate contentKey="microgatewayApp.microprocessJustification.content">Content</Translate>
                </Label>
                <AvField id="justification-content" type="text" name="content" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="justification-fileId">
                  <Translate contentKey="microgatewayApp.microprocessJustification.fileId">File Id</Translate>
                </Label>
                <AvField id="justification-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="taskIdLabel" for="justification-taskId">
                  <Translate contentKey="microgatewayApp.microprocessJustification.taskId">Task Id</Translate>
                </Label>
                <AvField id="justification-taskId" type="string" className="form-control" name="taskId" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="justification-processId">
                  <Translate contentKey="microgatewayApp.microprocessJustification.processId">Process Id</Translate>
                </Label>
                <AvField id="justification-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <AvGroup>
                <Label id="reasonLabel" for="justification-reason">
                  <Translate contentKey="microgatewayApp.microprocessJustification.reason">Reason</Translate>
                </Label>
                <AvInput
                  id="justification-reason"
                  type="select"
                  className="form-control"
                  name="reason"
                  value={(!isNew && justificationEntity.reason) || 'NOSTARTED'}
                >
                  <option value="NOSTARTED">{translate('microgatewayApp.JustifcationReason.NOSTARTED')}</option>
                  <option value="CANCELED">{translate('microgatewayApp.JustifcationReason.CANCELED')}</option>
                  <option value="LATER_COMPLETED">{translate('microgatewayApp.JustifcationReason.LATER_COMPLETED')}</option>
                  <option value="LATER_UNFINISH">{translate('microgatewayApp.JustifcationReason.LATER_UNFINISH')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="acceptedLabel">
                  <AvInput id="justification-accepted" type="checkbox" className="form-check-input" name="accepted" />
                  <Translate contentKey="microgatewayApp.microprocessJustification.accepted">Accepted</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="editorIdLabel" for="justification-editorId">
                  <Translate contentKey="microgatewayApp.microprocessJustification.editorId">Editor Id</Translate>
                </Label>
                <AvField id="justification-editorId" type="string" className="form-control" name="editorId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/justification" replace color="info">
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
  justificationEntity: storeState.justification.entity,
  loading: storeState.justification.loading,
  updating: storeState.justification.updating,
  updateSuccess: storeState.justification.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JustificationUpdate);
