import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAuditStatusTraking } from 'app/shared/model/microrisque/audit-status-traking.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './audit-status-traking.reducer';

export interface IAuditStatusTrakingDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AuditStatusTrakingDeleteDialog = (props: IAuditStatusTrakingDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/audit-status-traking' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.auditStatusTrakingEntity.id);
  };

  const { auditStatusTrakingEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microrisqueAuditStatusTraking.delete.question">
        <Translate
          contentKey="microgatewayApp.microrisqueAuditStatusTraking.delete.question"
          interpolate={{ id: auditStatusTrakingEntity.id }}
        >
          Are you sure you want to delete this AuditStatusTraking?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-auditStatusTraking" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ auditStatusTraking }: IRootState) => ({
  auditStatusTrakingEntity: auditStatusTraking.entity,
  updateSuccess: auditStatusTraking.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingDeleteDialog);
