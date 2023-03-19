import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './kpi.reducer';
import { IKPI } from 'app/shared/model/microprocess/kpi.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IKPIUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const KPIUpdate = (props: IKPIUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { kPIEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/kpi' + props.location.search);
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
        ...kPIEntity,
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
          <h2 id="microgatewayApp.microprocessKPi.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessKPi.home.createOrEditLabel">Create or edit a KPI</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : kPIEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="kpi-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="kpi-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="kpi-userId">
                  <Translate contentKey="microgatewayApp.microprocessKPi.userId">User Id</Translate>
                </Label>
                <AvField id="kpi-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="dteLabel" for="kpi-dte">
                  <Translate contentKey="microgatewayApp.microprocessKPi.dte">Dte</Translate>
                </Label>
                <AvField id="kpi-dte" type="date" className="form-control" name="dte" />
              </AvGroup>
              <AvGroup>
                <Label id="executedLabel" for="kpi-executed">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executed">Executed</Translate>
                </Label>
                <AvField id="kpi-executed" type="string" className="form-control" name="executed" />
              </AvGroup>
              <AvGroup>
                <Label id="executedRateLabel" for="kpi-executedRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedRate">Executed Rate</Translate>
                </Label>
                <AvField id="kpi-executedRate" type="string" className="form-control" name="executedRate" />
              </AvGroup>
              <AvGroup>
                <Label id="executedLateLabel" for="kpi-executedLate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedLate">Executed Late</Translate>
                </Label>
                <AvField id="kpi-executedLate" type="string" className="form-control" name="executedLate" />
              </AvGroup>
              <AvGroup>
                <Label id="executedLateRateLabel" for="kpi-executedLateRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executedLateRate">Executed Late Rate</Translate>
                </Label>
                <AvField id="kpi-executedLateRate" type="string" className="form-control" name="executedLateRate" />
              </AvGroup>
              <AvGroup>
                <Label id="totalExecutedLabel" for="kpi-totalExecuted">
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalExecuted">Total Executed</Translate>
                </Label>
                <AvField id="kpi-totalExecuted" type="string" className="form-control" name="totalExecuted" />
              </AvGroup>
              <AvGroup>
                <Label id="totalExecutedRateLabel" for="kpi-totalExecutedRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalExecutedRate">Total Executed Rate</Translate>
                </Label>
                <AvField id="kpi-totalExecutedRate" type="string" className="form-control" name="totalExecutedRate" />
              </AvGroup>
              <AvGroup>
                <Label id="startedLabel" for="kpi-started">
                  <Translate contentKey="microgatewayApp.microprocessKPi.started">Started</Translate>
                </Label>
                <AvField id="kpi-started" type="string" className="form-control" name="started" />
              </AvGroup>
              <AvGroup>
                <Label id="startedRateLabel" for="kpi-startedRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedRate">Started Rate</Translate>
                </Label>
                <AvField id="kpi-startedRate" type="string" className="form-control" name="startedRate" />
              </AvGroup>
              <AvGroup>
                <Label id="startedLateLabel" for="kpi-startedLate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedLate">Started Late</Translate>
                </Label>
                <AvField id="kpi-startedLate" type="string" className="form-control" name="startedLate" />
              </AvGroup>
              <AvGroup>
                <Label id="startedLateRateLabel" for="kpi-startedLateRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.startedLateRate">Started Late Rate</Translate>
                </Label>
                <AvField id="kpi-startedLateRate" type="string" className="form-control" name="startedLateRate" />
              </AvGroup>
              <AvGroup>
                <Label id="totalStartedLabel" for="kpi-totalStarted">
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalStarted">Total Started</Translate>
                </Label>
                <AvField id="kpi-totalStarted" type="string" className="form-control" name="totalStarted" />
              </AvGroup>
              <AvGroup>
                <Label id="totalStartedRateLabel" for="kpi-totalStartedRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.totalStartedRate">Total Started Rate</Translate>
                </Label>
                <AvField id="kpi-totalStartedRate" type="string" className="form-control" name="totalStartedRate" />
              </AvGroup>
              <AvGroup>
                <Label id="noStartedLabel" for="kpi-noStarted">
                  <Translate contentKey="microgatewayApp.microprocessKPi.noStarted">No Started</Translate>
                </Label>
                <AvField id="kpi-noStarted" type="string" className="form-control" name="noStarted" />
              </AvGroup>
              <AvGroup>
                <Label id="noStartedRateLabel" for="kpi-noStartedRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.noStartedRate">No Started Rate</Translate>
                </Label>
                <AvField id="kpi-noStartedRate" type="string" className="form-control" name="noStartedRate" />
              </AvGroup>
              <AvGroup>
                <Label id="executionLevelLabel" for="kpi-executionLevel">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executionLevel">Execution Level</Translate>
                </Label>
                <AvField id="kpi-executionLevel" type="string" className="form-control" name="executionLevel" />
              </AvGroup>
              <AvGroup>
                <Label id="executionLevelRateLabel" for="kpi-executionLevelRate">
                  <Translate contentKey="microgatewayApp.microprocessKPi.executionLevelRate">Execution Level Rate</Translate>
                </Label>
                <AvField id="kpi-executionLevelRate" type="string" className="form-control" name="executionLevelRate" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/kpi" replace color="info">
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
  kPIEntity: storeState.kPI.entity,
  loading: storeState.kPI.loading,
  updating: storeState.kPI.updating,
  updateSuccess: storeState.kPI.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KPIUpdate);
