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
import { getEntity, updateEntity, createEntity, reset } from './tender-answer-execution-file.reducer';
import { ITenderAnswerExecutionFile } from 'app/shared/model/microprovider/tender-answer-execution-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderAnswerExecutionFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerExecutionFileUpdate = (props: ITenderAnswerExecutionFileUpdateProps) => {
  const [executionId, setExecutionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderAnswerExecutionFileEntity, tenderAnswerExecutions, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-answer-execution-file' + props.location.search);
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
        ...tenderAnswerExecutionFileEntity,
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
          <h2 id="microgatewayApp.microproviderTenderAnswerExecutionFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecutionFile.home.createOrEditLabel">
              Create or edit a TenderAnswerExecutionFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderAnswerExecutionFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-answer-execution-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-answer-execution-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="tender-answer-execution-file-fileId">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecutionFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="tender-answer-execution-file-fileId"
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
                <Label id="fileNameLabel" for="tender-answer-execution-file-fileName">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecutionFile.fileName">File Name</Translate>
                </Label>
                <AvField id="tender-answer-execution-file-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label for="tender-answer-execution-file-execution">
                  <Translate contentKey="microgatewayApp.microproviderTenderAnswerExecutionFile.execution">Execution</Translate>
                </Label>
                <AvInput
                  id="tender-answer-execution-file-execution"
                  type="select"
                  className="form-control"
                  name="execution.id"
                  value={isNew ? tenderAnswerExecutions[0] && tenderAnswerExecutions[0].id : tenderAnswerExecutionFileEntity.execution?.id}
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
              <Button tag={Link} id="cancel-save" to="/tender-answer-execution-file" replace color="info">
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
  tenderAnswerExecutionFileEntity: storeState.tenderAnswerExecutionFile.entity,
  loading: storeState.tenderAnswerExecutionFile.loading,
  updating: storeState.tenderAnswerExecutionFile.updating,
  updateSuccess: storeState.tenderAnswerExecutionFile.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerExecutionFileUpdate);
