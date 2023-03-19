import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITenderAnswerDoc } from 'app/shared/model/microprovider/tender-answer-doc.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './tender-answer-doc.reducer';

export interface ITenderAnswerDocDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TenderAnswerDocDeleteDialog = (props: ITenderAnswerDocDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/tender-answer-doc' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.tenderAnswerDocEntity.id);
  };

  const { tenderAnswerDocEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microproviderTenderAnswerDoc.delete.question">
        <Translate contentKey="microgatewayApp.microproviderTenderAnswerDoc.delete.question" interpolate={{ id: tenderAnswerDocEntity.id }}>
          Are you sure you want to delete this TenderAnswerDoc?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-tenderAnswerDoc" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ tenderAnswerDoc }: IRootState) => ({
  tenderAnswerDocEntity: tenderAnswerDoc.entity,
  updateSuccess: tenderAnswerDoc.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerDocDeleteDialog);
