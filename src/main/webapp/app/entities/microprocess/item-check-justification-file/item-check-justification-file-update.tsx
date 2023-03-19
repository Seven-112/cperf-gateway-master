import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './item-check-justification-file.reducer';
import { IItemCheckJustificationFile } from 'app/shared/model/microprocess/item-check-justification-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IItemCheckJustificationFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ItemCheckJustificationFileUpdate = (props: IItemCheckJustificationFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { itemCheckJustificationFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/item-check-justification-file' + props.location.search);
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
        ...itemCheckJustificationFileEntity,
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
          <h2 id="microgatewayApp.microprocessItemCheckJustificationFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.home.createOrEditLabel">
              Create or edit a ItemCheckJustificationFile
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : itemCheckJustificationFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="item-check-justification-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="item-check-justification-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileIdLabel" for="item-check-justification-file-fileId">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="item-check-justification-file-fileId"
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
                <Label id="fileNameLabel" for="item-check-justification-file-fileName">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="item-check-justification-file-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="ticjIdLabel" for="item-check-justification-file-ticjId">
                  <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.ticjId">Ticj Id</Translate>
                </Label>
                <AvField
                  id="item-check-justification-file-ticjId"
                  type="string"
                  className="form-control"
                  name="ticjId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/item-check-justification-file" replace color="info">
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
  itemCheckJustificationFileEntity: storeState.itemCheckJustificationFile.entity,
  loading: storeState.itemCheckJustificationFile.loading,
  updating: storeState.itemCheckJustificationFile.updating,
  updateSuccess: storeState.itemCheckJustificationFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationFileUpdate);
