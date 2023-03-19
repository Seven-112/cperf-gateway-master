import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './taskfile.reducer';
import { ITaskfile } from 'app/shared/model/microprocess/taskfile.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskfileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskfileDetail = (props: ITaskfileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskfileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskfile.detail.title">Taskfile</Translate> [<b>{taskfileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprocessTaskfile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{taskfileEntity.fileId}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprocessTaskfile.description">Description</Translate>
            </span>
          </dt>
          <dd>{taskfileEntity.description}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="microgatewayApp.microprocessTaskfile.type">Type</Translate>
            </span>
          </dt>
          <dd>{taskfileEntity.type}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessTaskfile.task">Task</Translate>
          </dt>
          <dd>{taskfileEntity.task ? taskfileEntity.task.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/taskfile" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/taskfile/${taskfileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskfile }: IRootState) => ({
  taskfileEntity: taskfile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskfileDetail);
