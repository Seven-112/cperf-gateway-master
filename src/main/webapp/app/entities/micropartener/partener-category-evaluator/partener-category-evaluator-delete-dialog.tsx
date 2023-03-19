import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IPartenerCategoryEvaluator } from 'app/shared/model/micropartener/partener-category-evaluator.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './partener-category-evaluator.reducer';

export interface IPartenerCategoryEvaluatorDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PartenerCategoryEvaluatorDeleteDialog = (props: IPartenerCategoryEvaluatorDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/partener-category-evaluator' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.partenerCategoryEvaluatorEntity.id);
  };

  const { partenerCategoryEvaluatorEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.micropartenerPartenerCategoryEvaluator.delete.question">
        <Translate
          contentKey="microgatewayApp.micropartenerPartenerCategoryEvaluator.delete.question"
          interpolate={{ id: partenerCategoryEvaluatorEntity.id }}
        >
          Are you sure you want to delete this PartenerCategoryEvaluator?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-partenerCategoryEvaluator" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ partenerCategoryEvaluator }: IRootState) => ({
  partenerCategoryEvaluatorEntity: partenerCategoryEvaluator.entity,
  updateSuccess: partenerCategoryEvaluator.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartenerCategoryEvaluatorDeleteDialog);
