import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './type-objectif.reducer';
import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITypeObjectifDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TypeObjectifDetail = (props: ITypeObjectifDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { typeObjectifEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.typeObjectif.detail.title">TypeObjectif</Translate> [<b>{typeObjectifEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.typeObjectif.name">Name</Translate>
            </span>
          </dt>
          <dd>{typeObjectifEntity.name}</dd>
          <dt>
            <span id="evalutationUnity">
              <Translate contentKey="microgatewayApp.typeObjectif.evalutationUnity">Evalutation Unity</Translate>
            </span>
          </dt>
          <dd>{typeObjectifEntity.evalutationUnity}</dd>
          <dt>
            <span id="valid">
              <Translate contentKey="microgatewayApp.typeObjectif.valid">Valid</Translate>
            </span>
          </dt>
          <dd>{typeObjectifEntity.valid ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/type-objectif" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/type-objectif/${typeObjectifEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ typeObjectif }: IRootState) => ({
  typeObjectifEntity: typeObjectif.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeObjectifDetail);
