import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-calendar.reducer';
import { IProjectCalendar } from 'app/shared/model/microproject/project-calendar.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectCalendarUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCalendarUpdate = (props: IProjectCalendarUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectCalendarEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-calendar' + props.location.search);
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
    values.startTime = convertDateTimeToServer(values.startTime);
    values.endTime = convertDateTimeToServer(values.endTime);

    if (errors.length === 0) {
      const entity = {
        ...projectCalendarEntity,
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
          <h2 id="microgatewayApp.microprojectProjectCalendar.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectCalendar.home.createOrEditLabel">
              Create or edit a ProjectCalendar
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectCalendarEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-calendar-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-calendar-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dayNumberLabel" for="project-calendar-dayNumber">
                  <Translate contentKey="microgatewayApp.microprojectProjectCalendar.dayNumber">Day Number</Translate>
                </Label>
                <AvField
                  id="project-calendar-dayNumber"
                  type="string"
                  className="form-control"
                  name="dayNumber"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    min: { value: 0, errorMessage: translate('entity.validation.min', { min: 0 }) },
                    max: { value: 7, errorMessage: translate('entity.validation.max', { max: 7 }) },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="startTimeLabel" for="project-calendar-startTime">
                  <Translate contentKey="microgatewayApp.microprojectProjectCalendar.startTime">Start Time</Translate>
                </Label>
                <AvInput
                  id="project-calendar-startTime"
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectCalendarEntity.startTime)}
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endTimeLabel" for="project-calendar-endTime">
                  <Translate contentKey="microgatewayApp.microprojectProjectCalendar.endTime">End Time</Translate>
                </Label>
                <AvInput
                  id="project-calendar-endTime"
                  type="datetime-local"
                  className="form-control"
                  name="endTime"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.projectCalendarEntity.endTime)}
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="projectIdLabel" for="project-calendar-projectId">
                  <Translate contentKey="microgatewayApp.microprojectProjectCalendar.projectId">Project Id</Translate>
                </Label>
                <AvField id="project-calendar-projectId" type="string" className="form-control" name="projectId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-calendar" replace color="info">
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
  projectCalendarEntity: storeState.projectCalendar.entity,
  loading: storeState.projectCalendar.loading,
  updating: storeState.projectCalendar.updating,
  updateSuccess: storeState.projectCalendar.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCalendarUpdate);
