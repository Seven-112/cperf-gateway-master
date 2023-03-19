import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './indicator.reducer';
import { IIndicator } from 'app/shared/model/indicator.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IIndicatorDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const IndicatorDetail = (props: IIndicatorDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { indicatorEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.indicator.detail.title">Indicator</Translate> [<b>{indicatorEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="expectedResultNumber">
              <Translate contentKey="microgatewayApp.indicator.expectedResultNumber">Expected Result Number</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.expectedResultNumber}</dd>
          <dt>
            <span id="resultUnity">
              <Translate contentKey="microgatewayApp.indicator.resultUnity">Result Unity</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.resultUnity}</dd>
          <dt>
            <span id="label">
              <Translate contentKey="microgatewayApp.indicator.label">Label</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.label}</dd>
          <dt>
            <span id="question">
              <Translate contentKey="microgatewayApp.indicator.question">Question</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.question}</dd>
          <dt>
            <span id="resultEditableByActor">
              <Translate contentKey="microgatewayApp.indicator.resultEditableByActor">Result Editable By Actor</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.resultEditableByActor ? 'true' : 'false'}</dd>
          <dt>
            <span id="numberResult">
              <Translate contentKey="microgatewayApp.indicator.numberResult">Number Result</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.numberResult}</dd>
          <dt>
            <span id="percentResult">
              <Translate contentKey="microgatewayApp.indicator.percentResult">Percent Result</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.percentResult}</dd>
          <dt>
            <span id="resultAppreciation">
              <Translate contentKey="microgatewayApp.indicator.resultAppreciation">Result Appreciation</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.resultAppreciation}</dd>
          <dt>
            <span id="averagePercentage">
              <Translate contentKey="microgatewayApp.indicator.averagePercentage">Average Percentage</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.averagePercentage}</dd>
          <dt>
            <span id="ponderation">
              <Translate contentKey="microgatewayApp.indicator.ponderation">Ponderation</Translate>
            </span>
          </dt>
          <dd>{indicatorEntity.ponderation}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.indicator.typeindicator">Typeindicator</Translate>
          </dt>
          <dd>{indicatorEntity.typeindicator ? indicatorEntity.typeindicator.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.indicator.objectif">Objectif</Translate>
          </dt>
          <dd>{indicatorEntity.objectif ? indicatorEntity.objectif.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.indicator.parent">Parent</Translate>
          </dt>
          <dd>{indicatorEntity.parent ? indicatorEntity.parent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/indicator" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/indicator/${indicatorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ indicator }: IRootState) => ({
  indicatorEntity: indicator.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorDetail);
