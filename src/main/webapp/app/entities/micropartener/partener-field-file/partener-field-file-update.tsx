import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPartenerField } from 'app/shared/model/micropartener/partener-field.model';
import { getEntities as getPartenerFields } from 'app/entities/micropartener/partener-field/partener-field.reducer';
import { getEntity, updateEntity, createEntity, reset } from './partener-field-file.reducer';
import { IPartenerFieldFile } from 'app/shared/model/micropartener/partener-field-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPartenerFieldFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerFieldFileUpdate = (props: IPartenerFieldFileUpdateProps) => {
  const [partenerFieldId, setPartenerFieldId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { partenerFieldFileEntity, partenerFields, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/partener-field-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getPartenerFields();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...partenerFieldFileEntity,
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
          <h2 id="microgatewayApp.micropartenerPartenerFieldFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.home.createOrEditLabel">
              Create or edit a PartenerFieldFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : partenerFieldFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="partener-field-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="partener-field-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="partener-field-file-fileId">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="partener-field-file-fileId"
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
                <Label id="fileNameLabel" for="partener-field-file-fileName">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="partener-field-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="partener-field-file-partenerField">
                  <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.partenerField">Partener Field</Translate>
                </Label>
                <AvInput
                  id="partener-field-file-partenerField"
                  type="select"
                  className="form-control"
                  name="partenerField.id"
                  value={isNew ? partenerFields[0] && partenerFields[0].id : partenerFieldFileEntity.partenerField?.id}
                  required
                >
                  {partenerFields
                    ? partenerFields.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/partener-field-file" replace color="info">
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
  partenerFields: storeState.partenerField.entities,
  partenerFieldFileEntity: storeState.partenerFieldFile.entity,
  loading: storeState.partenerFieldFile.loading,
  updating: storeState.partenerFieldFile.updating,
  updateSuccess: storeState.partenerFieldFile.updateSuccess,
});

const mapDispatchToProps = {
  getPartenerFields,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerFieldFileUpdate);
