import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IModelEntity } from 'app/shared/model/model-entity.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './model-entity.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IModelEntityDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ModelEntityDeleteDialog = (props: IModelEntityDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/model-entity' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.modelEntityEntity.id);
  };

  const { modelEntityEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
      question={
        <Translate contentKey="microgatewayApp.modelEntity.delete.question" interpolate={{ id: modelEntityEntity.id }}>
          Are you sure you want to delete this ModelEntity?
        </Translate>
      } />
  );
};

const mapStateToProps = ({ modelEntity }: IRootState) => ({
  modelEntityEntity: modelEntity.entity,
  updateSuccess: modelEntity.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ModelEntityDeleteDialog);
