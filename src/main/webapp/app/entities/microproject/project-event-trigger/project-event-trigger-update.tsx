import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-event-trigger.reducer';
import { IProjectEventTrigger } from 'app/shared/model/microproject/project-event-trigger.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectEventTriggerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectEventTriggerUpdate = (props: IProjectEventTriggerUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectEventTriggerEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-event-trigger' + props.location.search);
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
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.firstStartedAt = convertDateTimeToServer(values.firstStartedAt);

    if (errors.length === 0) {
      const entity = {
        ...projectEventTriggerEntity,
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
          <h2 id="microgatewayApp.microprojectProjectEventTrigger.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.home.createOrEditLabel">
              Create or edit a ProjectEventTrigger
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectEventTriggerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-event-trigger-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-event-trigger-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="editorIdLabel" for="project-event-trigger-editorId">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorId">Editor Id</Translate>
                </Label>
                <AvField
                  id="project-event-trigger-editorId"
                  type="string"
                  className="form-control"
                  name="editorId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="project-event-trigger-createdAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="project-event-trigger-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEventTriggerEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="project-event-trigger-name">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.name">Name</Translate>
                </Label>
                <AvField id="project-event-trigger-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="recurrenceLabel" for="project-event-trigger-recurrence">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.recurrence">Recurrence</Translate>
                </Label>
                <AvInput
                  id="project-event-trigger-recurrence"
                  type="select"
                  className="form-control"
                  name="recurrence"
                  value={(!isNew && projectEventTriggerEntity.recurrence) || 'ONCE'}
                >
                  <option value="ONCE">{translate('microgatewayApp.ProjectEventRecurrence.ONCE')}</option>
                  <option value="ALLAWAYS">{translate('microgatewayApp.ProjectEventRecurrence.ALLAWAYS')}</option>
                  <option value="WEEK">{translate('microgatewayApp.ProjectEventRecurrence.WEEK')}</option>
                  <option value="EVERY_WEEK_ON_DAY">{translate('microgatewayApp.ProjectEventRecurrence.EVERY_WEEK_ON_DAY')}</option>
                  <option value="EVERY_YEAR_ON_DATE">{translate('microgatewayApp.ProjectEventRecurrence.EVERY_YEAR_ON_DATE')}</option>
                  <option value="EVERY_MONTH_OF_DAY_POSITION">
                    {translate('microgatewayApp.ProjectEventRecurrence.EVERY_MONTH_OF_DAY_POSITION')}
                  </option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="disabledLabel">
                  <AvInput id="project-event-trigger-disabled" type="checkbox" className="form-check-input" name="disabled" />
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.disabled">Disabled</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="editorNameLabel" for="project-event-trigger-editorName">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorName">Editor Name</Translate>
                </Label>
                <AvField id="project-event-trigger-editorName" type="text" name="editorName" />
              </AvGroup>
              <AvGroup>
                <Label id="hourLabel" for="project-event-trigger-hour">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.hour">Hour</Translate>
                </Label>
                <AvField id="project-event-trigger-hour" type="string" className="form-control" name="hour" />
              </AvGroup>
              <AvGroup>
                <Label id="minuteLabel" for="project-event-trigger-minute">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.minute">Minute</Translate>
                </Label>
                <AvField id="project-event-trigger-minute" type="string" className="form-control" name="minute" />
              </AvGroup>
              <AvGroup>
                <Label id="firstStartedAtLabel" for="project-event-trigger-firstStartedAt">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.firstStartedAt">First Started At</Translate>
                </Label>
                <AvInput
                  id="project-event-trigger-firstStartedAt"
                  type="datetime-local"
                  className="form-control"
                  name="firstStartedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectEventTriggerEntity.firstStartedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="sheduledOnLabel" for="project-event-trigger-sheduledOn">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.sheduledOn">Sheduled On</Translate>
                </Label>
                <AvField id="project-event-trigger-sheduledOn" type="date" className="form-control" name="sheduledOn" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="project-event-trigger-processId">
                  <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.processId">Process Id</Translate>
                </Label>
                <AvField id="project-event-trigger-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-event-trigger" replace color="info">
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
  projectEventTriggerEntity: storeState.projectEventTrigger.entity,
  loading: storeState.projectEventTrigger.loading,
  updating: storeState.projectEventTrigger.updating,
  updateSuccess: storeState.projectEventTrigger.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEventTriggerUpdate);
