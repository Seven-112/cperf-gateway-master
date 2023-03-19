import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-edge-info.reducer';
import { IProjectEdgeInfo } from 'app/shared/model/microproject/project-edge-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectEdgeInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectEdgeInfoDetail = (props: IProjectEdgeInfoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectEdgeInfoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.detail.title">ProjectEdgeInfo</Translate> [
          <b>{projectEdgeInfoEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="source">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.source">Source</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.source}</dd>
          <dt>
            <span id="target">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.target">Target</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.target}</dd>
          <dt>
            <span id="sourceHandle">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.sourceHandle">Source Handle</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.sourceHandle}</dd>
          <dt>
            <span id="targetHandle">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.targetHandle">Target Handle</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.targetHandle}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.processId}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.microprojectProjectEdgeInfo.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{projectEdgeInfoEntity.valid ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/project-edge-info" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-edge-info/${projectEdgeInfoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectEdgeInfo }: IRootState) => ({
  projectEdgeInfoEntity: projectEdgeInfo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEdgeInfoDetail);
