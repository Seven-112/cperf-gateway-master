import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-event-trigger.reducer';
import { IProjectEventTrigger } from 'app/shared/model/microproject/project-event-trigger.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectEventTriggerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectEventTriggerDetail = (props: IProjectEventTriggerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectEventTriggerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.detail.title">ProjectEventTrigger</Translate> [
          <b>{projectEventTriggerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.editorId}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {projectEventTriggerEntity.createdAt ? (
              <TextFormat value={projectEventTriggerEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.name}</dd>
          <dt>
            <span id="recurrence">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.recurrence">Recurrence</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.recurrence}</dd>
          <dt>
            <span id="disabled">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.disabled">Disabled</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.disabled ? 'true' : 'false'}</dd>
          <dt>
            <span id="editorName">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.editorName">Editor Name</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.editorName}</dd>
          <dt>
            <span id="hour">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.hour">Hour</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.hour}</dd>
          <dt>
            <span id="minute">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.minute">Minute</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.minute}</dd>
          <dt>
            <span id="firstStartedAt">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.firstStartedAt">First Started At</Translate>
            </span>
          </dt>
          <dd>
            {projectEventTriggerEntity.firstStartedAt ? (
              <TextFormat value={projectEventTriggerEntity.firstStartedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="sheduledOn">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.sheduledOn">Sheduled On</Translate>
            </span>
          </dt>
          <dd>
            {projectEventTriggerEntity.sheduledOn ? (
              <TextFormat value={projectEventTriggerEntity.sheduledOn} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprojectProjectEventTrigger.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{projectEventTriggerEntity.processId}</dd>
        </dl>
        <Button tag={Link} to="/project-event-trigger" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-event-trigger/${projectEventTriggerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectEventTrigger }: IRootState) => ({
  projectEventTriggerEntity: projectEventTrigger.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEventTriggerDetail);
