import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITenderAnswerExecution } from 'app/shared/model/microprovider/tender-answer-execution.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './tender-answer-execution.reducer';

export interface ITenderAnswerExecutionDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerExecutionDeleteDialog = (props: ITenderAnswerExecutionDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/tender-answer-execution' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.tenderAnswerExecutionEntity.id);
  };

  const { tenderAnswerExecutionEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microproviderTenderAnswerExecution.delete.question">
        <Translate
          contentKey="microgatewayApp.microproviderTenderAnswerExecution.delete.question"
          interpolate={{ id: tenderAnswerExecutionEntity.id }}
        >
          Are you sure you want to delete this TenderAnswerExecution?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-tenderAnswerExecution" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ tenderAnswerExecution }: IRootState) => ({
  tenderAnswerExecutionEntity: tenderAnswerExecution.entity,
  updateSuccess: tenderAnswerExecution.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerExecutionDeleteDialog);
