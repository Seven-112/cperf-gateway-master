import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-submission.reducer';
import { IProjectTaskSubmission } from 'app/shared/model/microproject/project-task-submission.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskSubmissionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskSubmissionDetail = (props: IProjectTaskSubmissionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskSubmissionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.detail.title">ProjectTaskSubmission</Translate> [
          <b>{projectTaskSubmissionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="submitorId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorId">Submitor Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskSubmissionEntity.submitorId}</dd>
          <dt>
            <span id="submitorName">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorName">Submitor Name</Translate>
            </span>
          </dt>
          <dd>{projectTaskSubmissionEntity.submitorName}</dd>
          <dt>
            <span id="submitorEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.submitorEmail">Submitor Email</Translate>
            </span>
          </dt>
          <dd>{projectTaskSubmissionEntity.submitorEmail}</dd>
          <dt>
            <span id="comment">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.comment">Comment</Translate>
            </span>
          </dt>
          <dd>{projectTaskSubmissionEntity.comment}</dd>
          <dt>
            <span id="storeUp">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.storeUp">Store Up</Translate>
            </span>
          </dt>
          <dd>
            {projectTaskSubmissionEntity.storeUp ? (
              <TextFormat value={projectTaskSubmissionEntity.storeUp} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskSubmission.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskSubmissionEntity.taskId}</dd>
        </dl>
        <Button tag={Link} to="/project-task-submission" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-submission/${projectTaskSubmissionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskSubmission }: IRootState) => ({
  projectTaskSubmissionEntity: projectTaskSubmission.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskSubmissionDetail);
