import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IPrivilege } from 'app/shared/model/privilege.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './privilege.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IPrivilegeDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PrivilegeDeleteDialog = (props: IPrivilegeDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/privilege' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.privilegeEntity.id);
  };

  const { privilegeEntity } = props;
  return (
    <DeleteModal handleClose={handleClose} confirmDelete={confirmDelete}
      question={
        <Translate contentKey="microgatewayApp.privilege.delete.question" interpolate={{ id: privilegeEntity.id }}>
          Are you sure you want to delete this Privilege?
        </Translate>} />
  );
};

const mapStateToProps = ({ privilege }: IRootState) => ({
  privilegeEntity: privilege.entity,
  updateSuccess: privilege.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeDeleteDialog);
