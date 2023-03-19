import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './justification.reducer';
import { IJustification } from 'app/shared/model/microprocess/justification.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJustificationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JustificationDetail = (props: IJustificationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { justificationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessJustification.detail.title">Justification</Translate> [
          <b>{justificationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="content">
              <Translate contentKey="microgatewayApp.microprocessJustification.content">Content</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.content}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprocessJustification.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.fileId}</dd>
          <dt>
            <span id="taskId">
              <Translate contentKey="microgatewayApp.microprocessJustification.taskId">Task Id</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.taskId}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprocessJustification.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.processId}</dd>
          <dt>
            <span id="reason">
              <Translate contentKey="microgatewayApp.microprocessJustification.reason">Reason</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.reason}</dd>
          <dt>
            <span id="accepted">
              <Translate contentKey="microgatewayApp.microprocessJustification.accepted">Accepted</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.accepted ? 'true' : 'false'}</dd>
          <dt>
            <span id="editorId">
              <Translate contentKey="microgatewayApp.microprocessJustification.editorId">Editor Id</Translate>
            </span>
          </dt>
          <dd>{justificationEntity.editorId}</dd>
        </dl>
        <Button tag={Link} to="/justification" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/justification/${justificationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ justification }: IRootState) => ({
  justificationEntity: justification.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JustificationDetail);
