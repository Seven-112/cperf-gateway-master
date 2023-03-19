import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IPartenerCategoryValidator } from 'app/shared/model/micropartener/partener-category-validator.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './partener-category-validator.reducer';

export interface IPartenerCategoryValidatorDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryValidatorDeleteDialog = (props: IPartenerCategoryValidatorDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/partener-category-validator' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.partenerCategoryValidatorEntity.id);
  };

  const { partenerCategoryValidatorEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.micropartenerPartenerCategoryValidator.delete.question">
        <Translate
          contentKey="microgatewayApp.micropartenerPartenerCategoryValidator.delete.question"
          interpolate={{ id: partenerCategoryValidatorEntity.id }}
        >
          Are you sure you want to delete this PartenerCategoryValidator?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-partenerCategoryValidator" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ partenerCategoryValidator }: IRootState) => ({
  partenerCategoryValidatorEntity: partenerCategoryValidator.entity,
  updateSuccess: partenerCategoryValidator.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryValidatorDeleteDialog);
