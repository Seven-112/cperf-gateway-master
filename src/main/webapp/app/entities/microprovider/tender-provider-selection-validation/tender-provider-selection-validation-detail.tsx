import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tender-provider-selection-validation.reducer';
import { ITenderProviderSelectionValidation } from 'app/shared/model/microprovider/tender-provider-selection-validation.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITenderProviderSelectionValidationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderProviderSelectionValidationDetail = (props: ITenderProviderSelectionValidationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tenderProviderSelectionValidationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.detail.title">
            TenderProviderSelectionValidation
          </Translate>{' '}
          [<b>{tenderProviderSelectionValidationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="validatorId">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.validatorId">Validator Id</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionValidationEntity.validatorId}</dd>
          <dt>
            <span id="approved">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.approved">Approved</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionValidationEntity.approved ? 'true' : 'false'}</dd>
          <dt>
            <span id="justification">
              <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.justification">Justification</Translate>
            </span>
          </dt>
          <dd>{tenderProviderSelectionValidationEntity.justification}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderTenderProviderSelectionValidation.selection">Selection</Translate>
          </dt>
          <dd>{tenderProviderSelectionValidationEntity.selection ? tenderProviderSelectionValidationEntity.selection.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tender-provider-selection-validation" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button
          tag={Link}
          to={`/tender-provider-selection-validation/${tenderProviderSelectionValidationEntity.id}/edit`}
          replace
          color="primary"
        >
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tenderProviderSelectionValidation }: IRootState) => ({
  tenderProviderSelectionValidationEntity: tenderProviderSelectionValidation.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderProviderSelectionValidationDetail);
