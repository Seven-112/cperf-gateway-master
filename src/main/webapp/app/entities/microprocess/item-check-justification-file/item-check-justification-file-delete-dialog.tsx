import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IItemCheckJustificationFile } from 'app/shared/model/microprocess/item-check-justification-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './item-check-justification-file.reducer';

export interface IItemCheckJustificationFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ItemCheckJustificationFileDeleteDialog = (props: IItemCheckJustificationFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/item-check-justification-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.itemCheckJustificationFileEntity.id);
  };

  const { itemCheckJustificationFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microprocessItemCheckJustificationFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microprocessItemCheckJustificationFile.delete.question"
          interpolate={{ id: itemCheckJustificationFileEntity.id }}
        >
          Are you sure you want to delete this ItemCheckJustificationFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-itemCheckJustificationFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ itemCheckJustificationFile }: IRootState) => ({
  itemCheckJustificationFileEntity: itemCheckJustificationFile.entity,
  updateSuccess: itemCheckJustificationFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheckJustificationFileDeleteDialog);
