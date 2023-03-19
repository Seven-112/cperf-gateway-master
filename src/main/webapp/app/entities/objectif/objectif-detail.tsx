import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './objectif.reducer';
import { IObjectif } from 'app/shared/model/objectif.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IObjectifDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ObjectifDetail = (props: IObjectifDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { objectifEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.objectif.detail.title">Objectif</Translate> [<b>{objectifEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.objectif.name">Name</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.name}</dd>
          <dt>
            <span id="delay">
              <Translate contentKey="microgatewayApp.objectif.delay">Delay</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.delay}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="microgatewayApp.objectif.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.createdAt ? <TextFormat value={objectifEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="categorie">
              <Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.categorie}</dd>
          <dt>
            <span id="averagePercentage">
              <Translate contentKey="microgatewayApp.objectif.averagePercentage">Average Percentage</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.averagePercentage}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.objectif.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.ponderation}</dd>
          <dt>
            <span id="realized">
              <Translate contentKey="microgatewayApp.objectif.realized">Realized</Translate>
            </span>
          </dt>
          <dd>{objectifEntity.realized ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.objectif.typeObjectif">Type Objectif</Translate>
          </dt>
          <dd>{objectifEntity.typeObjectif ? objectifEntity.typeObjectif.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.objectif.fonction">Fonction</Translate>
          </dt>
          <dd>{objectifEntity.fonction ? objectifEntity.fonction.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.objectif.department">Department</Translate>
          </dt>
          <dd>{objectifEntity.department ? objectifEntity.department.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.objectif.employee">Employee</Translate>
          </dt>
          <dd>{objectifEntity.employee ? objectifEntity.employee.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.objectif.parent">Parent</Translate>
          </dt>
          <dd>{objectifEntity.parent ? objectifEntity.parent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/objectif" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/objectif/${objectifEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ objectif }: IRootState) => ({
  objectifEntity: objectif.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ObjectifDetail);
