import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IQueryUserValidator } from 'app/shared/model/qmanager/query-user-validator.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './query-user-validator.reducer';

export interface IQueryUserValidatorDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QueryUserValidatorDeleteDialog = (props: IQueryUserValidatorDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/query-user-validator' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.queryUserValidatorEntity.id);
  };

  const { queryUserValidatorEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.qmanagerQueryUserValidator.delete.question">
        <Translate
          contentKey="microgatewayApp.qmanagerQueryUserValidator.delete.question"
          interpolate={{ id: queryUserValidatorEntity.id }}
        >
          Are you sure you want to delete this QueryUserValidator?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-queryUserValidator" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ queryUserValidator }: IRootState) => ({
  queryUserValidatorEntity: queryUserValidator.entity,
  updateSuccess: queryUserValidator.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QueryUserValidatorDeleteDialog);
