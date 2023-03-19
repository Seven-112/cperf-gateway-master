import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './type-objectif.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface ITypeObjectifDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TypeObjectifDeleteDialog = (props: ITypeObjectifDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/type-objectif' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.typeObjectifEntity.id);
  };

  const { typeObjectifEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
        question={
          <Translate contentKey="microgatewayApp.typeObjectif.delete.question" interpolate={{ id: typeObjectifEntity.id }}>
            Are you sure you want to delete this TypeObjectif?
          </Translate>
        } />
  );
};

const mapStateToProps = ({ typeObjectif }: IRootState) => ({
  typeObjectifEntity: typeObjectif.entity,
  updateSuccess: typeObjectif.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeObjectifDeleteDialog);
