import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './notification.reducer';
import { INotification } from 'app/shared/model/notification.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INotificationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NotificationDetail = (props: INotificationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { notificationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.notification.detail.title">Notification</Translate> [<b>{notificationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="microgatewayApp.notification.title">Title</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.title}</dd>
          <dt>
            <span id="note">
              <Translate contentKey="microgatewayApp.notification.note">Note</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.note}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.notification.type">Type</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.type}</dd>
          <dt>
            <span id="link">
              <Translate contentKey="microgatewayApp.notification.link">Link</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.link}</dd>
          <dt>
            <span id="seen">
              <Translate contentKey="microgatewayApp.notification.seen">Seen</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.seen ? 'true' : 'false'}</dd>
          <dt>
            <span id="blankTarget">
              <Translate contentKey="microgatewayApp.notification.blankTarget">Blank Target</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.blankTarget ? 'true' : 'false'}</dd>
          <dt>
            <span id="senderId">
              <Translate contentKey="microgatewayApp.notification.senderId">Sender Id</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.senderId}</dd>
          <dt>
            <span id="targetId">
              <Translate contentKey="microgatewayApp.notification.targetId">Target Id</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.targetId}</dd>
          <dt>
            <span id="tag">
              <Translate contentKey="microgatewayApp.notification.tag">Tag</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.tag}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.notification.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {notificationEntity.createdAt ? <TextFormat value={notificationEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/notification" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/notification/${notificationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ notification }: IRootState) => ({
  notificationEntity: notification.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDetail);
