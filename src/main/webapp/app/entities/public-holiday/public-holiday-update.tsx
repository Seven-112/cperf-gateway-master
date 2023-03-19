import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './public-holiday.reducer';
import { IPublicHoliday } from 'app/shared/model/public-holiday.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPublicHolidayUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PublicHolidayUpdate = (props: IPublicHolidayUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { publicHolidayEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/public-holiday');
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
        ...publicHolidayEntity,
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
          <h2 id="microgatewayApp.publicHoliday.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.publicHoliday.home.createOrEditLabel">Create or edit a PublicHoliday</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : publicHolidayEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="public-holiday-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="public-holiday-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="public-holiday-name">
                  <Translate contentKey="microgatewayApp.publicHoliday.name">Name</Translate>
                </Label>
                <AvField id="public-holiday-name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="ofDateLabel" for="public-holiday-ofDate">
                  <Translate contentKey="microgatewayApp.publicHoliday.ofDate">Of Date</Translate>
                </Label>
                <AvField
                  id="public-holiday-ofDate"
                  type="date"
                  className="form-control"
                  name="ofDate"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/public-holiday" replace color="info">
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
  publicHolidayEntity: storeState.publicHoliday.entity,
  loading: storeState.publicHoliday.loading,
  updating: storeState.publicHoliday.updating,
  updateSuccess: storeState.publicHoliday.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PublicHolidayUpdate);
