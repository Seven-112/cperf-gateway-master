import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './item-check-justification.reducer';
import { IItemCheckJustification } from 'app/shared/model/microprocess/item-check-justification.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IItemCheckJustificationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ItemCheckJustificationUpdate = (props: IItemCheckJustificationUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { itemCheckJustificationEntity, loading, updating } = props;

  const { justification } = itemCheckJustificationEntity;

  const handleClose = () => {
    props.history.push('/item-check-justification' + props.location.search);
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
    values.date = convertDateTimeToServer(values.date);

    if (errors.length === 0) {
      const entity = {
        ...itemCheckJustificationEntity,
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
          <h2 id="microgatewayApp.microprocessItemCheckJustification.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.home.createOrEditLabel">
              Create or edit a ItemCheckJustification
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : itemCheckJustificationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="item-check-justification-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="item-check-justification-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup check>
                <Label id="checkedLabel">
                  <AvInput id="item-check-justification-checked" type="checkbox" className="form-check-input" name="checked" />
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.checked">Checked</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="taskItemIdLabel" for="item-check-justification-taskItemId">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.taskItemId">Task Item Id</Translate>
                </Label>
                <AvField
                  id="item-check-justification-taskItemId"
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
                <Label id="justificationLabel" for="item-check-justification-justification">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.justification">Justification</Translate>
                </Label>
                <AvInput id="item-check-justification-justification" type="textarea" name="justification" />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="item-check-justification-date">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.date">Date</Translate>
                </Label>
                <AvInput
                  id="item-check-justification-date"
                  type="datetime-local"
                  className="form-control"
                  name="date"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.itemCheckJustificationEntity.date)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/item-check-justification" replace color="info">
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
  itemCheckJustificationEntity: storeState.itemCheckJustification.entity,
  loading: storeState.itemCheckJustification.loading,
  updating: storeState.itemCheckJustification.updating,
  updateSuccess: storeState.itemCheckJustification.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationUpdate);
