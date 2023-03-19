import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from '../procedure.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IProcedureDeleteDialogProps extends StateProps, DispatchProps {
    id: number,
    handleClose: Function,
}

export const ProcedureDeleteDialog = (props: IProcedureDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.id);
  }, []);

  const handleClose = () => {
    props.handleClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
       props.handleClose(props.id);
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.procedureEntity.id);
  };

  const { procedureEntity } = props;

  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose} 
      question={
         <Translate contentKey="microgatewayApp.microprocessProcedure.delete.question" interpolate={{ id: procedureEntity.id }}>
          Are you sure you want to delete this Procedure?
        </Translate>} 
    />
  );
};

const mapStateToProps = ({ procedure }: IRootState) => ({
  procedureEntity: procedure.entity,
  updateSuccess: procedure.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcedureDeleteDialog);
