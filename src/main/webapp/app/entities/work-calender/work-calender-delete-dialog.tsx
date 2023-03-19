import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IWorkCalender } from 'app/shared/model/work-calender.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './work-calender.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IWorkCalenderDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WorkCalenderDeleteDialog = (props: IWorkCalenderDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/work-calender');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.workCalenderEntity.id);
  };

  const { workCalenderEntity } = props;
  return (
     <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
      question={
        <Translate contentKey="microgatewayApp.workCalender.delete.question" interpolate={{ id: workCalenderEntity.id }}>
          Are you sure you want to delete this WorkCalender?
        </Translate>
      }
    />
  );
};

const mapStateToProps = ({ workCalender }: IRootState) => ({
  workCalenderEntity: workCalender.entity,
  updateSuccess: workCalender.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkCalenderDeleteDialog);
