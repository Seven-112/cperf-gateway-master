import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { getEntities as getTenderAnswerExecutions } from 'app/entities/microprovider/tender-answer-execution/tender-answer-execution.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './execution-validation.reducer';
import { IExecutionValidation } from 'app/shared/model/microprovider/execution-validation.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IExecutionValidationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ExecutionValidationUpdate = (props: IExecutionValidationUpdateProps) => {
  const [executionId, setExecutionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { executionValidationEntity, tenderAnswerExecutions, loading, updating } = props;

  const { justification } = executionValidationEntity;

  const handleClose = () => {
    props.history.push('/execution-validation' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswerExecutions();
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
    if (errors.length === 0) {
      const entity = {
        ...executionValidationEntity,
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
          <h2 id="microgatewayApp.microproviderExecutionValidation.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderExecutionValidation.home.createOrEditLabel">
              Create or edit a ExecutionValidation
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : executionValidationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="execution-validation-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="execution-validation-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="execution-validation-userId">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidation.userId">User Id</Translate>
                </Label>
                <AvField
                  id="execution-validation-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="approvedLabel">
                  <AvInput id="execution-validation-approved" type="checkbox" className="form-check-input" name="approved" />
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidation.approved">Approved</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="justificationLabel" for="execution-validation-justification">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidation.justification">Justification</Translate>
                </Label>
                <AvInput id="execution-validation-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label for="execution-validation-execution">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidation.execution">Execution</Translate>
                </Label>
                <AvInput
                  id="execution-validation-execution"
                  type="select"
                  className="form-control"
                  name="execution.id"
                  value={isNew ? tenderAnswerExecutions[0] && tenderAnswerExecutions[0].id : executionValidationEntity.execution?.id}
                  required
                >
                  {tenderAnswerExecutions
                    ? tenderAnswerExecutions.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/execution-validation" replace color="info">
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
  tenderAnswerExecutions: storeState.tenderAnswerExecution.entities,
  executionValidationEntity: storeState.executionValidation.entity,
  loading: storeState.executionValidation.loading,
  updating: storeState.executionValidation.updating,
  updateSuccess: storeState.executionValidation.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswerExecutions,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExecutionValidationUpdate);
