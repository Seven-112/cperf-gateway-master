import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './execution-validation-file.reducer';
import { IExecutionValidationFile } from 'app/shared/model/microprovider/execution-validation-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IExecutionValidationFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ExecutionValidationFileDetail = (props: IExecutionValidationFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { executionValidationFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.detail.title">ExecutionValidationFile</Translate> [
          <b>{executionValidationFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{executionValidationFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{executionValidationFileEntity.fileName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.microproviderExecutionValidationFile.execution">Execution</Translate>
          </dt>
          <dd>{executionValidationFileEntity.execution ? executionValidationFileEntity.execution.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/execution-validation-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/execution-validation-file/${executionValidationFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ executionValidationFile }: IRootState) => ({
  executionValidationFileEntity: executionValidationFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ExecutionValidationFileDetail);
