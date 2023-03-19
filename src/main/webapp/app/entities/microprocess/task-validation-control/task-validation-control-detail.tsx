import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-validation-control.reducer';
import { ITaskValidationControl } from 'app/shared/model/microprocess/task-validation-control.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskValidationControlDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskValidationControlDetail = (props: ITaskValidationControlDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { taskValidationControlEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.detail.title">TaskValidationControl</Translate> [
          <b>{taskValidationControlEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.label">Label</Translate>
            </span>
          </dt>
          <dd>{taskValidationControlEntity.label}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.required">Required</Translate>
            </span>
          </dt>
          <dd>{taskValidationControlEntity.required ? 'true' : 'false'}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{taskValidationControlEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microprocessTaskValidationControl.task">Task</Translate>
          </dt>
          <dd>{taskValidationControlEntity.task ? taskValidationControlEntity.task.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/task-validation-control" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/task-validation-control/${taskValidationControlEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ taskValidationControl }: IRootState) => ({
  taskValidationControlEntity: taskValidationControl.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskValidationControlDetail);
