import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IEvaluationCriteria } from 'app/shared/model/micropartener/evaluation-criteria.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './evaluation-criteria.reducer';

export interface IEvaluationCriteriaDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EvaluationCriteriaDeleteDialog = (props: IEvaluationCriteriaDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/evaluation-criteria' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.evaluationCriteriaEntity.id);
  };

  const { evaluationCriteriaEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.micropartenerEvaluationCriteria.delete.question">
        <Translate
          contentKey="microgatewayApp.micropartenerEvaluationCriteria.delete.question"
          interpolate={{ id: evaluationCriteriaEntity.id }}
        >
          Are you sure you want to delete this EvaluationCriteria?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-evaluationCriteria" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ evaluationCriteria }: IRootState) => ({
  evaluationCriteriaEntity: evaluationCriteria.entity,
  updateSuccess: evaluationCriteria.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationCriteriaDeleteDialog);
