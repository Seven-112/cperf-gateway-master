import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProjectTaskValidationControl } from 'app/shared/model/microproject/project-task-validation-control.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './project-task-validation-control.reducer';

export interface IProjectTaskValidationControlDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskValidationControlDeleteDialog = (props: IProjectTaskValidationControlDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/project-task-validation-control' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.projectTaskValidationControlEntity.id);
  };

  const { projectTaskValidationControlEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprojectProjectTaskValidationControl.delete.question">
        <Translate
          contentKey="microgatewayApp.microprojectProjectTaskValidationControl.delete.question"
          interpolate={{ id: projectTaskValidationControlEntity.id }}
        >
          Are you sure you want to delete this ProjectTaskValidationControl?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-projectTaskValidationControl" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ projectTaskValidationControl }: IRootState) => ({
  projectTaskValidationControlEntity: projectTaskValidationControl.entity,
  updateSuccess: projectTaskValidationControl.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskValidationControlDeleteDialog);
