import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-status-traking-file.reducer';
import { ITaskStatusTrakingFile } from 'app/shared/model/microprocess/task-status-traking-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskStatusTrakingFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskStatusTrakingFileDetail = (props: ITaskStatusTrakingFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskStatusTrakingFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.detail.title">TaskStatusTrakingFile</Translate> [
          <b>{taskStatusTrakingFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{taskStatusTrakingFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.track">Track</Translate>
          </dt>
          <dd>{taskStatusTrakingFileEntity.track ? taskStatusTrakingFileEntity.track.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/task-status-traking-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task-status-traking-file/${taskStatusTrakingFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskStatusTrakingFile }: IRootState) => ({
  taskStatusTrakingFileEntity: taskStatusTrakingFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingFileDetail);
