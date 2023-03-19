import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './notification.reducer';
import { INotification } from 'app/shared/model/notification.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface INotificationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NotificationUpdate = (props: INotificationUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { notificationEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/notification' + props.location.search);
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
    values.createdAt = convertDateTimeToServer(values.createdAt);

    if (errors.length === 0) {
      const entity = {
        ...notificationEntity,
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
          <h2 id="microgatewayApp.notification.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.notification.home.createOrEditLabel">Create or edit a Notification</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : notificationEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="notification-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="notification-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="notification-title">
                  <Translate contentKey="microgatewayApp.notification.title">Title</Translate>
                </Label>
                <AvField
                  id="notification-title"
                  type="text"
                  name="title"
                  validate={{
                    maxLength: { value: 100, errorMessage: translate('entity.validation.maxlength', { max: 100 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="notification-note">
                  <Translate contentKey="microgatewayApp.notification.note">Note</Translate>
                </Label>
                <AvField id="notification-note" type="text" name="note" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="notification-type">
                  <Translate contentKey="microgatewayApp.notification.type">Type</Translate>
                </Label>
                <AvInput
                  id="notification-type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && notificationEntity.type) || 'MESSAGE'}
                >
                  <option value="MESSAGE">{translate('microgatewayApp.NotifType.MESSAGE')}</option>
                  <option value="INFO">{translate('microgatewayApp.NotifType.INFO')}</option>
                  <option value="WARNING">{translate('microgatewayApp.NotifType.WARNING')}</option>
                  <option value="DANGER">{translate('microgatewayApp.NotifType.DANGER')}</option>
                  <option value="SUCCESS">{translate('microgatewayApp.NotifType.SUCCESS')}</option>
                  <option value="TASKSTARTED">{translate('microgatewayApp.NotifType.TASKSTARTED')}</option>
                  <option value="TASKFINISHED">{translate('microgatewayApp.NotifType.TASKFINISHED')}</option>
                  <option value="TASKCANCELED">{translate('microgatewayApp.NotifType.TASKCANCELED')}</option>
                  <option value="TASKCREATED">{translate('microgatewayApp.NotifType.TASKCREATED')}</option>
                  <option value="PROCESSCREATED">{translate('microgatewayApp.NotifType.PROCESSCREATED')}</option>
                  <option value="PROCESSSTARTED">{translate('microgatewayApp.NotifType.PROCESSSTARTED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="linkLabel" for="notification-link">
                  <Translate contentKey="microgatewayApp.notification.link">Link</Translate>
                </Label>
                <AvField id="notification-link" type="text" name="link" />
              </AvGroup>
              <AvGroup check>
                <Label id="seenLabel">
                  <AvInput id="notification-seen" type="checkbox" className="form-check-input" name="seen" />
                  <Translate contentKey="microgatewayApp.notification.seen">Seen</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="blankTargetLabel">
                  <AvInput id="notification-blankTarget" type="checkbox" className="form-check-input" name="blankTarget" />
                  <Translate contentKey="microgatewayApp.notification.blankTarget">Blank Target</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="senderIdLabel" for="notification-senderId">
                  <Translate contentKey="microgatewayApp.notification.senderId">Sender Id</Translate>
                </Label>
                <AvField id="notification-senderId" type="string" className="form-control" name="senderId" />
              </AvGroup>
              <AvGroup>
                <Label id="targetIdLabel" for="notification-targetId">
                  <Translate contentKey="microgatewayApp.notification.targetId">Target Id</Translate>
                </Label>
                <AvField
                  id="notification-targetId"
                  type="string"
                  className="form-control"
                  name="targetId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    number: { value: true, errorMessage: translate('entity.validation.number') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tagLabel" for="notification-tag">
                  <Translate contentKey="microgatewayApp.notification.tag">Tag</Translate>
                </Label>
                <AvField id="notification-tag" type="text" name="tag" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="notification-createdAt">
                  <Translate contentKey="microgatewayApp.notification.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="notification-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.notificationEntity.createdAt)}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/notification" replace color="info">
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
  notificationEntity: storeState.notification.entity,
  loading: storeState.notification.loading,
  updating: storeState.notification.updating,
  updateSuccess: storeState.notification.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NotificationUpdate);
