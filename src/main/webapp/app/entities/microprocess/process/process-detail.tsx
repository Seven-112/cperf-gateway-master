import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process.reducer';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessDetail = (props: IProcessDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessProcess.detail.title">Process</Translate> [<b>{processEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.microprocessProcess.label">Label</Translate>
            </span>
          </dt>
          <dd>{processEntity.label}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprocessProcess.description">Description</Translate>
            </span>
          </dt>
          <dd>{processEntity.description}</dd>
          <dt>
            <span id="priorityLevel">
              <Translate contentKey="microgatewayApp.microprocessProcess.priorityLevel">Priority Level</Translate>
            </span>
          </dt>
          <dd>{processEntity.priorityLevel}</dd>
          <dt>
            <span id="canceledAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.canceledAt">Canceled At</Translate>
            </span>
          </dt>
          <dd>{processEntity.canceledAt ? <TextFormat value={processEntity.canceledAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprocessProcess.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{processEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="previewStartAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.previewStartAt">Preview Start At</Translate>
            </span>
          </dt>
          <dd>
            {processEntity.previewStartAt ? <TextFormat value={processEntity.previewStartAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>{processEntity.startAt ? <TextFormat value={processEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="previewFinishAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.previewFinishAt">Preview Finish At</Translate>
            </span>
          </dt>
          <dd>
            {processEntity.previewFinishAt ? (
              <TextFormat value={processEntity.previewFinishAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="finishedAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.finishedAt">Finished At</Translate>
            </span>
          </dt>
          <dd>{processEntity.finishedAt ? <TextFormat value={processEntity.finishedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.microprocessProcess.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{processEntity.createdAt ? <TextFormat value={processEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="startCount">
              <Translate contentKey="microgatewayApp.microprocessProcess.startCount">Start Count</Translate>
            </span>
          </dt>
          <dd>{processEntity.startCount}</dd>
          <dt>
            <span id="modelId">
              <Translate contentKey="microgatewayApp.microprocessProcess.modelId">Model Id</Translate>
            </span>
          </dt>
          <dd>{processEntity.modelId}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprocessProcess.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{processEntity.editorId}</dd>
          <dt>
            <span id="procedureId">
              <Translate contentKey="microgatewayApp.microprocessProcess.procedureId">Procedure Id</Translate>
            </span>
          </dt>
          <dd>{processEntity.procedureId}</dd>
          <dt>
            <span id="runnableProcessId">
              <Translate contentKey="microgatewayApp.microprocessProcess.runnableProcessId">Runnable Process Id</Translate>
            </span>
          </dt>
          <dd>{processEntity.runnableProcessId}</dd>
          <dt>
            <span id="queryId">
              <Translate contentKey="microgatewayApp.microprocessProcess.queryId">Query Id</Translate>
            </span>
          </dt>
          <dd>{processEntity.queryId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessProcess.category">Category</Translate>
          </dt>
          <dd>{processEntity.category ? processEntity.category.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/process" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process/${processEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ process }: IRootState) => ({
  processEntity: process.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessDetail);
