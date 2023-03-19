import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process-category.reducer';
import { IProcessCategory } from 'app/shared/model/microprocess/process-category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessCategoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessCategoryDetail = (props: IProcessCategoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processCategoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessProcessCategory.detail.title">ProcessCategory</Translate> [
          <b>{processCategoryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprocessProcessCategory.name">Name</Translate>
            </span>
          </dt>
          <dd>{processCategoryEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="microgatewayApp.microprocessProcessCategory.description">Description</Translate>
            </span>
          </dt>
          <dd>{processCategoryEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/process-category" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process-category/${processCategoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ processCategory }: IRootState) => ({
  processCategoryEntity: processCategory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCategoryDetail);
