import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-item-check-justification.reducer';
import { IProjectItemCheckJustification } from 'app/shared/model/microproject/project-item-check-justification.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectItemCheckJustificationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectItemCheckJustificationDetail = (props: IProjectItemCheckJustificationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectItemCheckJustificationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.detail.title">
            ProjectItemCheckJustification
          </Translate>{' '}
          [<b>{projectItemCheckJustificationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationEntity.checked ? 'true' : 'false'}</dd>
          <dt>
            <span id="taskItemId">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.taskItemId">Task Item Id</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationEntity.taskItemId}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationEntity.justification}</dd>
          <dt>
            <span id="dateAndTime">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustification.dateAndTime">Date And Time</Translate>
            </span>
          </dt>
          <dd>
            {projectItemCheckJustificationEntity.dateAndTime ? (
              <TextFormat value={projectItemCheckJustificationEntity.dateAndTime} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/project-item-check-justification" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-item-check-justification/${projectItemCheckJustificationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectItemCheckJustification }: IRootState) => ({
  projectItemCheckJustificationEntity: projectItemCheckJustification.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationDetail);
