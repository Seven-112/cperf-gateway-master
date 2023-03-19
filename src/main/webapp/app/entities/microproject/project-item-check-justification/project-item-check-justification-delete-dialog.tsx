import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProjectItemCheckJustification } from 'app/shared/model/microproject/project-item-check-justification.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './project-item-check-justification.reducer';

export interface IProjectItemCheckJustificationDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectItemCheckJustificationDeleteDialog = (props: IProjectItemCheckJustificationDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/project-item-check-justification' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.projectItemCheckJustificationEntity.id);
  };

  const { projectItemCheckJustificationEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprojectProjectItemCheckJustification.delete.question">
        <Translate
          contentKey="microgatewayApp.microprojectProjectItemCheckJustification.delete.question"
          interpolate={{ id: projectItemCheckJustificationEntity.id }}
        >
          Are you sure you want to delete this ProjectItemCheckJustification?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-projectItemCheckJustification" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ projectItemCheckJustification }: IRootState) => ({
  projectItemCheckJustificationEntity: projectItemCheckJustification.entity,
  updateSuccess: projectItemCheckJustification.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationDeleteDialog);
