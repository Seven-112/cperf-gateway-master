import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IFonction } from 'app/shared/model/fonction.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './fonction.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IFonctionDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FonctionDeleteDialog = (props: IFonctionDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/fonction' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.fonctionEntity.id);
  };

  const { fonctionEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
      question={
        <Translate contentKey="microgatewayApp.fonction.delete.question" interpolate={{ id: fonctionEntity.id }}>
          Are you sure you want to delete this Fonction?
        </Translate>
      } />
  );
};

const mapStateToProps = ({ fonction }: IRootState) => ({
  fonctionEntity: fonction.entity,
  updateSuccess: fonction.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FonctionDeleteDialog);
