import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './event-file.reducer';
import { IEventFile } from 'app/shared/model/microagenda/event-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEventFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EventFileDetail = (props: IEventFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { eventFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microagendaEventFile.detail.title">EventFile</Translate> [<b>{eventFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microagendaEventFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{eventFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microagendaEventFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{eventFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microagendaEventFile.event">Event</Translate>
          </dt>
          <dd>{eventFileEntity.event ? eventFileEntity.event.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/event-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/event-file/${eventFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ eventFile }: IRootState) => ({
  eventFileEntity: eventFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventFileDetail);
