import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-task-validation-control.reducer';
import { IProjectTaskValidationControl } from 'app/shared/model/microproject/project-task-validation-control.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectTaskValidationControlDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskValidationControlDetail = (props: IProjectTaskValidationControlDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectTaskValidationControlEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.detail.title">
            ProjectTaskValidationControl
          </Translate>{' '}
          [<b>{projectTaskValidationControlEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.label">Label</Translate>
            </span>
          </dt>
          <dd>{projectTaskValidationControlEntity.label}</dd>
          <dt>
            <span id="required">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.required">Required</Translate>
            </span>
          </dt>
          <dd>{projectTaskValidationControlEntity.required ? 'true' : 'false'}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{projectTaskValidationControlEntity.valid ? 'true' : 'false'}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprojectProjectTaskValidationControl.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{projectTaskValidationControlEntity.taskId}</dd>
        </dl>
        <Button tag={Link} to="/project-task-validation-control" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-task-validation-control/${projectTaskValidationControlEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectTaskValidationControl }: IRootState) => ({
  projectTaskValidationControlEntity: projectTaskValidationControl.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskValidationControlDetail);
