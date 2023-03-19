import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-answer-field.reducer';
import { ITenderAnswerField } from 'app/shared/model/microprovider/tender-answer-field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderAnswerFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerFieldDetail = (props: ITenderAnswerFieldDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderAnswerFieldEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.detail.title">TenderAnswerField</Translate> [
          <b>{tenderAnswerFieldEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="val">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.val">Val</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerFieldEntity.val}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerFieldEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerFieldEntity.fileName}</dd>
          <dt>
            <span id="fieldId">
              <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.fieldId">Field Id</Translate>
            </span>
          </dt>
          <dd>{tenderAnswerFieldEntity.fieldId}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderAnswerField.answer">Answer</Translate>
          </dt>
          <dd>{tenderAnswerFieldEntity.answer ? tenderAnswerFieldEntity.answer.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-answer-field" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tender-answer-field/${tenderAnswerFieldEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderAnswerField }: IRootState) => ({
  tenderAnswerFieldEntity: tenderAnswerField.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerFieldDetail);
