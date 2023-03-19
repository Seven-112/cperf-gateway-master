import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './q-ponctual-task-info.reducer';
import { IQPonctualTaskInfo } from 'app/shared/model/qmanager/q-ponctual-task-info.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IQPonctualTaskInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QPonctualTaskInfoUpdate = (props: IQPonctualTaskInfoUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { qPonctualTaskInfoEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/q-ponctual-task-info' + props.location.search);
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
        ...qPonctualTaskInfoEntity,
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
          <h2 id="microgatewayApp.qmanagerQPonctualTaskInfo.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.home.createOrEditLabel">
              Create or edit a QPonctualTaskInfo
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : qPonctualTaskInfoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="q-ponctual-task-info-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="q-ponctual-task-info-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nbMinutesLabel" for="q-ponctual-task-info-nbMinutes">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMinutes">Nb Minutes</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-nbMinutes" type="string" className="form-control" name="nbMinutes" />
              </AvGroup>
              <AvGroup>
                <Label id="nbHoursLabel" for="q-ponctual-task-info-nbHours">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbHours">Nb Hours</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-nbHours" type="string" className="form-control" name="nbHours" />
              </AvGroup>
              <AvGroup>
                <Label id="nbDaysLabel" for="q-ponctual-task-info-nbDays">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbDays">Nb Days</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-nbDays" type="string" className="form-control" name="nbDays" />
              </AvGroup>
              <AvGroup>
                <Label id="nbMonthsLabel" for="q-ponctual-task-info-nbMonths">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbMonths">Nb Months</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-nbMonths" type="string" className="form-control" name="nbMonths" />
              </AvGroup>
              <AvGroup>
                <Label id="nbYearsLabel" for="q-ponctual-task-info-nbYears">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.nbYears">Nb Years</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-nbYears" type="string" className="form-control" name="nbYears" />
              </AvGroup>
              <AvGroup>
                <Label id="qInstanceIdLabel" for="q-ponctual-task-info-qInstanceId">
                  <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.qInstanceId">Q Instance Id</Translate>
                </Label>
                <AvField id="q-ponctual-task-info-qInstanceId" type="string" className="form-control" name="qInstanceId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/q-ponctual-task-info" replace color="info">
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
  qPonctualTaskInfoEntity: storeState.qPonctualTaskInfo.entity,
  loading: storeState.qPonctualTaskInfo.loading,
  updating: storeState.qPonctualTaskInfo.updating,
  updateSuccess: storeState.qPonctualTaskInfo.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QPonctualTaskInfoUpdate);
