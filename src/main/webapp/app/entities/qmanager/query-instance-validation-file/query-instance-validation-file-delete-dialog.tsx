import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IQueryInstanceValidationFile } from 'app/shared/model/qmanager/query-instance-validation-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './query-instance-validation-file.reducer';

export interface IQueryInstanceValidationFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationFileDeleteDialog = (props: IQueryInstanceValidationFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/query-instance-validation-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.queryInstanceValidationFileEntity.id);
  };

  const { queryInstanceValidationFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.qmanagerQueryInstanceValidationFile.delete.question">
        <Translate
          contentKey="microgatewayApp.qmanagerQueryInstanceValidationFile.delete.question"
          interpolate={{ id: queryInstanceValidationFileEntity.id }}
        >
          Are you sure you want to delete this QueryInstanceValidationFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-queryInstanceValidationFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ queryInstanceValidationFile }: IRootState) => ({
  queryInstanceValidationFileEntity: queryInstanceValidationFile.entity,
  updateSuccess: queryInstanceValidationFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationFileDeleteDialog);
