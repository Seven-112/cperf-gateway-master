import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './project-public-holiday.reducer';
import { IProjectPublicHoliday } from 'app/shared/model/microproject/project-public-holiday.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProjectPublicHolidayUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectPublicHolidayUpdate = (props: IProjectPublicHolidayUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { projectPublicHolidayEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/project-public-holiday' + props.location.search);
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
        ...projectPublicHolidayEntity,
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
          <h2 id="microgatewayApp.microprojectProjectPublicHoliday.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.home.createOrEditLabel">
              Create or edit a ProjectPublicHoliday
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : projectPublicHolidayEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="project-public-holiday-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="project-public-holiday-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="project-public-holiday-name">
                  <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.name">Name</Translate>
                </Label>
                <AvField id="project-public-holiday-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="project-public-holiday-date">
                  <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.date">Date</Translate>
                </Label>
                <AvField
                  id="project-public-holiday-date"
                  type="date"
                  className="form-control"
                  name="date"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="levelIdLabel" for="project-public-holiday-levelId">
                  <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.levelId">Level Id</Translate>
                </Label>
                <AvField id="project-public-holiday-levelId" type="string" className="form-control" name="levelId" />
              </AvGroup>
              <AvGroup>
                <Label id="processIdLabel" for="project-public-holiday-processId">
                  <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.processId">Process Id</Translate>
                </Label>
                <AvField id="project-public-holiday-processId" type="string" className="form-control" name="processId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/project-public-holiday" replace color="info">
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
  projectPublicHolidayEntity: storeState.projectPublicHoliday.entity,
  loading: storeState.projectPublicHoliday.loading,
  updating: storeState.projectPublicHoliday.updating,
  updateSuccess: storeState.projectPublicHoliday.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPublicHolidayUpdate);
