import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IDepartment } from 'app/shared/model/department.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './department.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IDepartmentDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DepartmentDeleteDialog = (props: IDepartmentDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/department' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.departmentEntity.id);
  };

  const { departmentEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose} 
      question={
        <Translate contentKey="microgatewayApp.department.delete.question" interpolate={{ id: departmentEntity.id }}>
          Are you sure you want to delete this Department?
        </Translate>
      }/>
  );
};

const mapStateToProps = ({ department }: IRootState) => ({
  departmentEntity: department.entity,
  updateSuccess: department.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentDeleteDialog);
