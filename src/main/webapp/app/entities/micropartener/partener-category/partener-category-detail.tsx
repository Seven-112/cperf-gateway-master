import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener-category.reducer';
import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerCategoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryDetail = (props: IPartenerCategoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerCategoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.detail.title">PartenerCategory</Translate> [
          <b>{partenerCategoryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.name">Name</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryEntity.name}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.role">Role</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryEntity.role}</dd>
          <dt>
            <span id="noteMin">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.noteMin">Note Min</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryEntity.noteMin}</dd>
          <dt>
            <span id="noteMax">
              <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.noteMax">Note Max</Translate>
            </span>
          </dt>
          <dd>{partenerCategoryEntity.noteMax}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerCategory.parent">Parent</Translate>
          </dt>
          <dd>{partenerCategoryEntity.parent ? partenerCategoryEntity.parent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener-category" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener-category/${partenerCategoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partenerCategory }: IRootState) => ({
  partenerCategoryEntity: partenerCategory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryDetail);
