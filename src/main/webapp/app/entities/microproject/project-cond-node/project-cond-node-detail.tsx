import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-cond-node.reducer';
import { IProjectCondNode } from 'app/shared/model/microproject/project-cond-node.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectCondNodeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCondNodeDetail = (props: IProjectCondNodeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectCondNodeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectCondNode.detail.title">ProjectCondNode</Translate> [
          <b>{projectCondNodeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="logigramPosX">
              <Translate contentKey="microgatewayApp.microprojectProjectCondNode.logigramPosX">Logigram Pos X</Translate>
            </span>
          </dt>
          <dd>{projectCondNodeEntity.logigramPosX}</dd>
          <dt>
            <span id="logigramPosY">
              <Translate contentKey="microgatewayApp.microprojectProjectCondNode.logigramPosY">Logigram Pos Y</Translate>
            </span>
          </dt>
          <dd>{projectCondNodeEntity.logigramPosY}</dd>
          <dt>
            <span id="projectId">
              <Translate contentKey="microgatewayApp.microprojectProjectCondNode.projectId">Project Id</Translate>
            </span>
          </dt>
          <dd>{projectCondNodeEntity.projectId}</dd>
        </dl>
        <Button tag={Link} to="/project-cond-node" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-cond-node/${projectCondNodeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectCondNode }: IRootState) => ({
  projectCondNodeEntity: projectCondNode.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCondNodeDetail);
