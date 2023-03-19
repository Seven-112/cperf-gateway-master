import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProjectTaskStatusTrakingFile } from 'app/shared/model/microproject/project-task-status-traking-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './project-task-status-traking-file.reducer';

export interface IProjectTaskStatusTrakingFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskStatusTrakingFileDeleteDialog = (props: IProjectTaskStatusTrakingFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/project-task-status-traking-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.projectTaskStatusTrakingFileEntity.id);
  };

  const { projectTaskStatusTrakingFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprojectProjectTaskStatusTrakingFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microprojectProjectTaskStatusTrakingFile.delete.question"
          interpolate={{ id: projectTaskStatusTrakingFileEntity.id }}
        >
          Are you sure you want to delete this ProjectTaskStatusTrakingFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-projectTaskStatusTrakingFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ projectTaskStatusTrakingFile }: IRootState) => ({
  projectTaskStatusTrakingFileEntity: projectTaskStatusTrakingFile.entity,
  updateSuccess: projectTaskStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskStatusTrakingFileDeleteDialog);
