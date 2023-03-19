import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAuditStatusTrakingFile } from 'app/shared/model/microrisque/audit-status-traking-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './audit-status-traking-file.reducer';

export interface IAuditStatusTrakingFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingFileDeleteDialog = (props: IAuditStatusTrakingFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/audit-status-traking-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.auditStatusTrakingFileEntity.id);
  };

  const { auditStatusTrakingFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microrisqueAuditStatusTrakingFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microrisqueAuditStatusTrakingFile.delete.question"
          interpolate={{ id: auditStatusTrakingFileEntity.id }}
        >
          Are you sure you want to delete this AuditStatusTrakingFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-auditStatusTrakingFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ auditStatusTrakingFile }: IRootState) => ({
  auditStatusTrakingFileEntity: auditStatusTrakingFile.entity,
  updateSuccess: auditStatusTrakingFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingFileDeleteDialog);
