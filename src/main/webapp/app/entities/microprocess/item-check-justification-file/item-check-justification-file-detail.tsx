import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './item-check-justification-file.reducer';
import { IItemCheckJustificationFile } from 'app/shared/model/microprocess/item-check-justification-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IItemCheckJustificationFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ItemCheckJustificationFileDetail = (props: IItemCheckJustificationFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { itemCheckJustificationFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.detail.title">ItemCheckJustificationFile</Translate>{' '}
          [<b>{itemCheckJustificationFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationFileEntity.fileName}</dd>
          <dt>
            <span id="ticjId">
              <Translate contentKey="microgatewayApp.microprocessItemCheckJustificationFile.ticjId">Ticj Id</Translate>
            </span>
          </dt>
          <dd>{itemCheckJustificationFileEntity.ticjId}</dd>
        </dl>
        <Button tag={Link} to="/item-check-justification-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/item-check-justification-file/${itemCheckJustificationFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ itemCheckJustificationFile }: IRootState) => ({
  itemCheckJustificationFileEntity: itemCheckJustificationFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationFileDetail);
