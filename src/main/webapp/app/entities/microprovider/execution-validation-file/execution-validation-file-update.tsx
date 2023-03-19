import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { getEntities as getTenderAnswerExecutions } from 'app/entities/microprovider/tender-answer-execution/tender-answer-execution.reducer';
import { getEntity, updateEntity, createEntity, reset } from './execution-validation-file.reducer';
import { IExecutionValidationFile } from 'app/shared/model/microprovider/execution-validation-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IExecutionValidationFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ExecutionValidationFileUpdate = (props: IExecutionValidationFileUpdateProps) => {
  const [executionId, setExecutionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { executionValidationFileEntity, tenderAnswerExecutions, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/execution-validation-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenderAnswerExecutions();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...executionValidationFileEntity,
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
          <h2 id="microgatewayApp.microproviderExecutionValidationFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.home.createOrEditLabel">
              Create or edit a ExecutionValidationFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : executionValidationFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="execution-validation-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="execution-validation-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="execution-validation-file-fileId">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="execution-validation-file-fileId"
                  type="string"
                  className="form-control"
                  name="fileId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="execution-validation-file-fileName">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="execution-validation-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="execution-validation-file-execution">
                  <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.execution">Execution</Translate>
                </Label>
                <AvInput id="execution-validation-file-execution" type="select" className="form-control" name="execution.id">
                  <option value="" key="0" />
                  {tenderAnswerExecutions
                    ? tenderAnswerExecutions.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/execution-validation-file" replace color="info">
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
  executionValidationFileEntity: storeState.executionValidationFile.entity,
  loading: storeState.executionValidationFile.loading,
  updating: storeState.executionValidationFile.updating,
  updateSuccess: storeState.executionValidationFile.updateSuccess,
});

const mapDispatchToProps = {
  getTenderAnswerExecutions,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExecutionValidationFileUpdate);
