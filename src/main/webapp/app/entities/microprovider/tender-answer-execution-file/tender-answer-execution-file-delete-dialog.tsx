import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITenderAnswerExecutionFile } from 'app/shared/model/microprovider/tender-answer-execution-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './tender-answer-execution-file.reducer';

export interface ITenderAnswerExecutionFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerExecutionFileDeleteDialog = (props: ITenderAnswerExecutionFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/tender-answer-execution-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.tenderAnswerExecutionFileEntity.id);
  };

  const { tenderAnswerExecutionFileEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microproviderTenderAnswerExecutionFile.delete.question">
        <Translate
          contentKey="microgatewayApp.microproviderTenderAnswerExecutionFile.delete.question"
          interpolate={{ id: tenderAnswerExecutionFileEntity.id }}
        >
          Are you sure you want to delete this TenderAnswerExecutionFile?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-tenderAnswerExecutionFile" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ tenderAnswerExecutionFile }: IRootState) => ({
  tenderAnswerExecutionFileEntity: tenderAnswerExecutionFile.entity,
  updateSuccess: tenderAnswerExecutionFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerExecutionFileDeleteDialog);
