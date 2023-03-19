import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './query-instance-validation.reducer';

export interface IQueryInstanceValidationDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryInstanceValidationDeleteDialog = (props: IQueryInstanceValidationDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/query-instance-validation' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.queryInstanceValidationEntity.id);
  };

  const { queryInstanceValidationEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.qmanagerQueryInstanceValidation.delete.question">
        <Translate
          contentKey="microgatewayApp.qmanagerQueryInstanceValidation.delete.question"
          interpolate={{ id: queryInstanceValidationEntity.id }}
        >
          Are you sure you want to delete this QueryInstanceValidation?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-queryInstanceValidation" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ queryInstanceValidation }: IRootState) => ({
  queryInstanceValidationEntity: queryInstanceValidation.entity,
  updateSuccess: queryInstanceValidation.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidationDeleteDialog);
