import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-file.reducer';
import { IUserFile } from 'app/shared/model/user-file.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserFileDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserFileDetail = (props: IUserFileDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userFileEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.userFile.detail.title">UserFile</Translate> [<b>{userFileEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">
              <Translate contentKey="microgatewayApp.userFile.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.userId}</dd>
          <dt>
            <span id="fileId">
              <Translate contentKey="microgatewayApp.userFile.fileId">File Id</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.fileId}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="microgatewayApp.userFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.fileName}</dd>
          <dt>
            <span id="parentId">
              <Translate contentKey="microgatewayApp.userFile.parentId">Parent Id</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.parentId}</dd>
          <dt>
            <span id="isFolder">
              <Translate contentKey="microgatewayApp.userFile.isFolder">Is Folder</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.isFolder ? 'true' : 'false'}</dd>
          <dt>
            <span id="isEmploye">
              <Translate contentKey="microgatewayApp.userFile.isEmploye">Is Employe</Translate>
            </span>
          </dt>
          <dd>{userFileEntity.isEmploye ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/user-file" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-file/${userFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userFile }: IRootState) => ({
  userFileEntity: userFile.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserFileDetail);
