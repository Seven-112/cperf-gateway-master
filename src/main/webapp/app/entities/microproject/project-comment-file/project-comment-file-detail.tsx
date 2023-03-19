import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-comment-file.reducer';
import { IProjectCommentFile } from 'app/shared/model/microproject/project-comment-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectCommentFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCommentFileDetail = (props: IProjectCommentFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectCommentFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectCommentFile.detail.title">ProjectCommentFile</Translate> [
          <b>{projectCommentFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprojectProjectCommentFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{projectCommentFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprojectProjectCommentFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{projectCommentFileEntity.fileName}</dd>
          <dt>
            <span id="commentId">
              <Translate contentKey="microgatewayApp.microprojectProjectCommentFile.commentId">Comment Id</Translate>
            </span>
          </dt>
          <dd>{projectCommentFileEntity.commentId}</dd>
        </dl>
        <Button tag={Link} to="/project-comment-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-comment-file/${projectCommentFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectCommentFile }: IRootState) => ({
  projectCommentFileEntity: projectCommentFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCommentFileDetail);
