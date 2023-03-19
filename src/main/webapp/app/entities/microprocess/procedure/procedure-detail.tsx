import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './procedure.reducer';
import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcedureDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcedureDetail = (props: IProcedureDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { procedureEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessProcedure.detail.title">Procedure</Translate> [<b>{procedureEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprocessProcedure.name">Name</Translate>
            </span>
          </dt>
          <dd>{procedureEntity.name}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprocessProcedure.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{procedureEntity.fileId}</dd>
          <dt>
            <span id="storeAt">
              <Translate contentKey="microgatewayApp.microprocessProcedure.storeAt">Store At</Translate>
            </span>
          </dt>
          <dd>
            {procedureEntity.storeAt ? <TextFormat value={procedureEntity.storeAt} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/procedure" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/procedure/${procedureEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ procedure }: IRootState) => ({
  procedureEntity: procedure.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcedureDetail);
