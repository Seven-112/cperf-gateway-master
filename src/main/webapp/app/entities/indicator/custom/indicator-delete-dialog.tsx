import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IObjectif } from 'app/shared/model/objectif.model';
import { IRootState } from 'app/shared/reducers';
import { reset, deleteEntity } from '../indicator.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';
import axios from 'axios'
import { IIndicator } from 'app/shared/model/indicator.model';
import { API_URIS } from 'app/shared/util/helpers';

export interface IObjectifDeleteDialogProps extends StateProps, DispatchProps {
    indicator: IIndicator,
    onClose: Function,

}

export const IndicatorDeleteDialog = (props: IObjectifDeleteDialogProps) => {

  const handleClose = () => {
    props.onClose();
  };

  useEffect(() =>{
    reset();
  }, [])

  useEffect(() => {
    if (props.updateSuccess) {
      props.onClose(props.indicator);
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.indicator.id);
  };

  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
     question={
      <Translate contentKey="microgatewayApp.indicator.delete.question" interpolate={{ id: props.indicator.id }}>
      Are you sure you want to delete this Objectif?
    </Translate>
     }/>
  );
};

const mapStateToProps = ({ indicator }: IRootState) => ({
  updateSuccess: indicator.updateSuccess,
});

const mapDispatchToProps = { deleteEntity, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorDeleteDialog);
