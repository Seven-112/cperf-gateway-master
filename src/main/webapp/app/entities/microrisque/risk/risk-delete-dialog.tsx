import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRisk } from 'app/shared/model/microrisque/risk.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './risk.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IRiskDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const RiskDeleteDialog = (props: IRiskDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/risk' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.riskEntity.id);
  };

  const { riskEntity } = props;
  return (
    <DeleteModal
      handleClose={handleClose}
      confirmDelete={confirmDelete}
      question={
        <Translate contentKey="microgatewayApp.microrisqueRisk.delete.question" interpolate={{ id: riskEntity.id }}>
          Are you sure you want to delete this Risk?
        </Translate>}
     />
  );
};

const mapStateToProps = ({ risk }: IRootState) => ({
  riskEntity: risk.entity,
  updateSuccess: risk.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RiskDeleteDialog);
