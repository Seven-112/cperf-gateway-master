import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './engeneering.reducer';
import { IEngeneering } from 'app/shared/model/microstock/engeneering.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEngeneeringDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EngeneeringDetail = (props: IEngeneeringDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { engeneeringEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microstockEngeneering.detail.title">Engeneering</Translate> [<b>{engeneeringEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="expertise">
              <Translate contentKey="microgatewayApp.microstockEngeneering.expertise">Expertise</Translate>
            </span>
          </dt>
          <dd>{engeneeringEntity.expertise}</dd>
          <dt>
            <span id="commentaire">
              <Translate contentKey="microgatewayApp.microstockEngeneering.commentaire">Commentaire</Translate>
            </span>
          </dt>
          <dd>{engeneeringEntity.commentaire}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microstockEngeneering.equipement">Equipement</Translate>
          </dt>
          <dd>{engeneeringEntity.equipement ? engeneeringEntity.equipement.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/engeneering" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/engeneering/${engeneeringEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ engeneering }: IRootState) => ({
  engeneeringEntity: engeneering.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EngeneeringDetail);
