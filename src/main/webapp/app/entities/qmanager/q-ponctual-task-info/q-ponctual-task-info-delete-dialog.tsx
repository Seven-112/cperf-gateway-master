import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IQPonctualTaskInfo } from 'app/shared/model/qmanager/q-ponctual-task-info.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './q-ponctual-task-info.reducer';

export interface IQPonctualTaskInfoDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const QPonctualTaskInfoDeleteDialog = (props: IQPonctualTaskInfoDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/q-ponctual-task-info' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.qPonctualTaskInfoEntity.id);
  };

  const { qPonctualTaskInfoEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.qmanagerQPonctualTaskInfo.delete.question">
        <Translate contentKey="microgatewayApp.qmanagerQPonctualTaskInfo.delete.question" interpolate={{ id: qPonctualTaskInfoEntity.id }}>
          Are you sure you want to delete this QPonctualTaskInfo?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-qPonctualTaskInfo" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ qPonctualTaskInfo }: IRootState) => ({
  qPonctualTaskInfoEntity: qPonctualTaskInfo.entity,
  updateSuccess: qPonctualTaskInfo.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(QPonctualTaskInfoDeleteDialog);
