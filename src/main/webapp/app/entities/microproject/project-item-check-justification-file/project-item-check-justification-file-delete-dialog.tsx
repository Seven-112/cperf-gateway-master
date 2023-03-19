import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProjectItemCheckJustificationFile } from 'app/shared/model/microproject/project-item-check-justification-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './project-item-check-justification-file.reducer';

export interface IProjectItemCheckJustificationFileDeleteDialogProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string }> {}

export const ProjectItemCheckJustificationFileDeleteDialog = (props: IProjectItemCheckJustificationFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/project-item-check-justification-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.projectItemCheckJustificationFileEntity.id);
  };

  const { projectItemCheckJustificationFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprojectProjectItemCheckJustificationFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microprojectProjectItemCheckJustificationFile.delete.question"
          interpolate={{ id: projectItemCheckJustificationFileEntity.id }}
        >
          Are you sure you want to delete this ProjectItemCheckJustificationFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-projectItemCheckJustificationFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ projectItemCheckJustificationFile }: IRootState) => ({
  projectItemCheckJustificationFileEntity: projectItemCheckJustificationFile.entity,
  updateSuccess: projectItemCheckJustificationFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItemCheckJustificationFileDeleteDialog);
