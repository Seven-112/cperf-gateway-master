import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './item-check-justification.reducer';
import { IItemCheckJustification } from 'app/shared/model/microprocess/item-check-justification.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IItemCheckJustificationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ItemCheckJustificationDetail = (props: IItemCheckJustificationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { itemCheckJustificationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.detail.title">ItemCheckJustification</Translate> [
          <b>{itemCheckJustificationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="checked">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.checked">Checked</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationEntity.checked ? 'true' : 'false'}</dd>
          <dt>
            <span id="taskItemId">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.taskItemId">Task Item Id</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationEntity.taskItemId}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationEntity.justification}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustification.date">Date</Translate>
            </span>
          </dt>
          <dd>
            {itemCheckJustificationEntity.date ? (
              <TextFormat value={itemCheckJustificationEntity.date} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/item-check-justification" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/item-check-justification/${itemCheckJustificationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ itemCheckJustification }: IRootState) => ({
  itemCheckJustificationEntity: itemCheckJustification.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationDetail);
