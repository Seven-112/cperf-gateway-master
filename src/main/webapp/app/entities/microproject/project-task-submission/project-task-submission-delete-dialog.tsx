import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProjectTaskSubmission } from 'app/shared/model/microproject/project-task-submission.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './project-task-submission.reducer';

export interface IProjectTaskSubmissionDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectTaskSubmissionDeleteDialog = (props: IProjectTaskSubmissionDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/project-task-submission' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.projectTaskSubmissionEntity.id);
  };

  const { projectTaskSubmissionEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprojectProjectTaskSubmission.delete.question">
        <Translate
          contentKey="microgatewayApp.microprojectProjectTaskSubmission.delete.question"
          interpolate={{ id: projectTaskSubmissionEntity.id }}
        >
          Are you sure you want to delete this ProjectTaskSubmission?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-projectTaskSubmission" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ projectTaskSubmission }: IRootState) => ({
  projectTaskSubmissionEntity: projectTaskSubmission.entity,
  updateSuccess: projectTaskSubmission.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTaskSubmissionDeleteDialog);
