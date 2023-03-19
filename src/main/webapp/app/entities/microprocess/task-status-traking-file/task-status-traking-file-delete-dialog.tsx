import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITaskStatusTrakingFile } from 'app/shared/model/microprocess/task-status-traking-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './task-status-traking-file.reducer';

export interface ITaskStatusTrakingFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TaskStatusTrakingFileDeleteDialog = (props: ITaskStatusTrakingFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/task-status-traking-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.taskStatusTrakingFileEntity.id);
  };

  const { taskStatusTrakingFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprocessTaskStatusTrakingFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microprocessTaskStatusTrakingFile.delete.question"
          interpolate={{ id: taskStatusTrakingFileEntity.id }}
        >
          Are you sure you want to delete this TaskStatusTrakingFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-taskStatusTrakingFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ taskStatusTrakingFile }: IRootState) => ({
  taskStatusTrakingFileEntity: taskStatusTrakingFile.entity,
  updateSuccess: taskStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskStatusTrakingFileDeleteDialog);
