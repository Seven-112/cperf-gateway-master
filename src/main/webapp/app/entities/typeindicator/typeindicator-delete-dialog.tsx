import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './typeindicator.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface ITypeindicatorDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TypeindicatorDeleteDialog = (props: ITypeindicatorDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/typeindicator' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.typeindicatorEntity.id);
  };

  const { typeindicatorEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
          question={
            <Translate contentKey="microgatewayApp.typeindicator.delete.question" interpolate={{ id: typeindicatorEntity.id }}>
              Are you sure you want to delete this Typeindicator?
            </Translate>
          } />
  );
};

const mapStateToProps = ({ typeindicator }: IRootState) => ({
  typeindicatorEntity: typeindicator.entity,
  updateSuccess: typeindicator.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeindicatorDeleteDialog);
