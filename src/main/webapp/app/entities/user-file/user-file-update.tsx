import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './user-file.reducer';
import { IUserFile } from 'app/shared/model/user-file.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUserFileUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserFileUpdate = (props: IUserFileUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { userFileEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/user-file' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...userFileEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microgatewayApp.userFile.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.userFile.home.createOrEditLabel">Create or edit a UserFile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : userFileEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="user-file-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="user-file-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="user-file-userId">
                  <Translate contentKey="microgatewayApp.userFile.userId">User Id</Translate>
                </Label>
                <AvField id="user-file-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileIdLabel" for="user-file-fileId">
                  <Translate contentKey="microgatewayApp.userFile.fileId">File Id</Translate>
                </Label>
                <AvField id="user-file-fileId" type="string" className="form-control" name="fileId" />
              </AvGroup>
              <AvGroup>
                <Label id="fileNameLabel" for="user-file-fileName">
                  <Translate contentKey="microgatewayApp.userFile.fileName">File Name</Translate>
                </Label>
                <AvField id="user-file-fileName" type="text" name="fileName" />
              </AvGroup>
              <AvGroup>
                <Label id="parentIdLabel" for="user-file-parentId">
                  <Translate contentKey="microgatewayApp.userFile.parentId">Parent Id</Translate>
                </Label>
                <AvField id="user-file-parentId" type="string" className="form-control" name="parentId" />
              </AvGroup>
              <AvGroup check>
                <Label id="isFolderLabel">
                  <AvInput id="user-file-isFolder" type="checkbox" className="form-check-input" name="isFolder" />
                  <Translate contentKey="microgatewayApp.userFile.isFolder">Is Folder</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="isEmployeLabel">
                  <AvInput id="user-file-isEmploye" type="checkbox" className="form-check-input" name="isEmploye" />
                  <Translate contentKey="microgatewayApp.userFile.isEmploye">Is Employe</Translate>
                </Label>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/user-file" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  userFileEntity: storeState.userFile.entity,
  loading: storeState.userFile.loading,
  updating: storeState.userFile.updating,
  updateSuccess: storeState.userFile.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserFileUpdate);
