import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITender } from 'app/shared/model/microprovider/tender.model';
import { getEntities as getTenders } from 'app/entities/microprovider/tender/tender.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tender-file.reducer';
import { ITenderFile } from 'app/shared/model/microprovider/tender-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITenderFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderFileUpdate = (props: ITenderFileUpdateProps) => {
  const [tenderId, setTenderId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tenderFileEntity, tenders, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tender-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTenders();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tenderFileEntity,
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
          <h2 id="microgatewayApp.microproviderTenderFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.microproviderTenderFile.home.createOrEditLabel">Create or edit a TenderFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tenderFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tender-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="tender-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tender-file-name">
                  <Translate contentKey="microgatewayApp.microproviderTenderFile.name">Name</Translate>
                </Label>
                <AvField
                  id="tender-file-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="tender-file-fileId">
                  <Translate contentKey="microgatewayApp.microproviderTenderFile.fileId">File Id</Translate>
                </Label>
                <AvField
                  id="tender-file-fileId"
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
                <Label for="tender-file-tender">
                  <Translate contentKey="microgatewayApp.microproviderTenderFile.tender">Tender</Translate>
                </Label>
                <AvInput
                  id="tender-file-tender"
                  type="select"
                  className="form-control"
                  name="tender.id"
                  value={isNew ? tenders[0] && tenders[0].id : tenderFileEntity.tender?.id}
                  required
                >
                  {tenders
                    ? tenders.map(otherEntity => (
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
              <Button tag={Link} id="cancel-save" to="/tender-file" replace color="info">
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
  tenders: storeState.tender.entities,
  tenderFileEntity: storeState.tenderFile.entity,
  loading: storeState.tenderFile.loading,
  updating: storeState.tenderFile.updating,
  updateSuccess: storeState.tenderFile.updateSuccess,
});

const mapDispatchToProps = {
  getTenders,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderFileUpdate);
