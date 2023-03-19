import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './partener-field-file.reducer';
import { IPartenerFieldFile } from 'app/shared/model/micropartener/partener-field-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPartenerFieldFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerFieldFileDetail = (props: IPartenerFieldFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { partenerFieldFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.detail.title">PartenerFieldFile</Translate> [
          <b>{partenerFieldFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{partenerFieldFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{partenerFieldFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.micropartenerPartenerFieldFile.partenerField">Partener Field</Translate>
          </dt>
          <dd>{partenerFieldFileEntity.partenerField ? partenerFieldFileEntity.partenerField.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/partener-field-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/partener-field-file/${partenerFieldFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ partenerFieldFile }: IRootState) => ({
  partenerFieldFileEntity: partenerFieldFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerFieldFileDetail);
