import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-category.reducer';
import { IProjectCategory } from 'app/shared/model/microproject/project-category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectCategoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectCategoryDetail = (props: IProjectCategoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectCategoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectCategory.detail.title">ProjectCategory</Translate> [
          <b>{projectCategoryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprojectProjectCategory.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectCategoryEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprojectProjectCategory.description">Description</Translate>
            </span>
          </dt>
          <dd>{projectCategoryEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/project-category" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-category/${projectCategoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectCategory }: IRootState) => ({
  projectCategoryEntity: projectCategory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCategoryDetail);
