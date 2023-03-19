import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-item-check-justification-file.reducer';
import { IProjectItemCheckJustificationFile } from 'app/shared/model/microproject/project-item-check-justification-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectItemCheckJustificationFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectItemCheckJustificationFileDetail = (props: IProjectItemCheckJustificationFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectItemCheckJustificationFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustificationFile.detail.title">
            ProjectItemCheckJustificationFile
          </Translate>{' '}
          [<b>{projectItemCheckJustificationFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustificationFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustificationFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationFileEntity.fileName}</dd>
          <dt>
            <span id="ticjId">
              <Translate contentKey="microgatewayApp.microprojectProjectItemCheckJustificationFile.ticjId">Ticj Id</Translate>
            </span>
          </dt>
          <dd>{projectItemCheckJustificationFileEntity.ticjId}</dd>
        </dl>
        <Button tag={Link} to="/project-item-check-justification-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button
          tag={Link}
          to={`/project-item-check-justification-file/${projectItemCheckJustificationFileEntity.id}/edit`}
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

const mapStateToProps = ({ projectItemCheckJustificationFile }: IRootState) => ({
  projectItemCheckJustificationFileEntity: projectItemCheckJustificationFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationFileDetail);
