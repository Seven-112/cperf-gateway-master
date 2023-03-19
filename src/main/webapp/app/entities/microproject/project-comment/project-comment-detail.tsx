import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-comment.reducer';
import { IProjectComment } from 'app/shared/model/microproject/project-comment.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectCommentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCommentDetail = (props: IProjectCommentDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectCommentEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectComment.detail.title">ProjectComment</Translate> [
          <b>{projectCommentEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="projectId">
              <Translate contentKey="microgatewayApp.microprojectProjectComment.projectId">Project Id</Translate>
            </span>
          </dt>
          <dd>{projectCommentEntity.projectId}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.microprojectProjectComment.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{projectCommentEntity.userId}</dd>
          <dt>
            <span id="userName">
              <Translate contentKey="microgatewayApp.microprojectProjectComment.userName">User Name</Translate>
            </span>
          </dt>
          <dd>{projectCommentEntity.userName}</dd>
          <dt>
            <span id="userEmail">
              <Translate contentKey="microgatewayApp.microprojectProjectComment.userEmail">User Email</Translate>
            </span>
          </dt>
          <dd>{projectCommentEntity.userEmail}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="microgatewayApp.microprojectProjectComment.content">Content</Translate>
            </span>
          </dt>
          <dd>{projectCommentEntity.content}</dd>
        </dl>
        <Button tag={Link} to="/project-comment" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-comment/${projectCommentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectComment }: IRootState) => ({
  projectCommentEntity: projectComment.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCommentDetail);
