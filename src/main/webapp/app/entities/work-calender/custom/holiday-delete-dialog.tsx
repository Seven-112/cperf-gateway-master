import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IPublicHoliday } from 'app/shared/model/public-holiday.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from 'app/entities/public-holiday/public-holiday.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IHolidayDeleteDialogProps extends StateProps, DispatchProps {
    id: any,
    onClose: Function,
}

export const HolidayDeleteDialog = (props: IHolidayDeleteDialogProps) => {

    const [id, setId] = useState(props.id);

  useEffect(() => {
      setId(props.id)
  }, [props.id]);

  const handleClose = () => {
    props.onClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
        props.onClose(props.id);
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(id);
  };

  return (
    <DeleteModal handleClose={handleClose} confirmDelete={confirmDelete} 
    question={
          <Translate contentKey="microgatewayApp.publicHoliday.delete.question" interpolate={{ id: props.id }}>
          Are you sure you want to delete this PublicHoliday?
          </Translate>
      }
  />
  );
};

const mapStateToProps = ({ publicHoliday }: IRootState) => ({
  updateSuccess: publicHoliday.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HolidayDeleteDialog);
