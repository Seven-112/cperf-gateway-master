import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IObjectif } from 'app/shared/model/objectif.model';
import { IRootState } from 'app/shared/reducers';
import { reset, deleteEntity } from '../objectif.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';
import axios from 'axios'
import { IIndicator } from 'app/shared/model/indicator.model';
import { API_URIS } from 'app/shared/util/helpers';

export interface IObjectifDeleteDialogProps extends StateProps, DispatchProps {
    objectif: IObjectif,
    onClose: Function,

}

export const ObjectifDeleteDialog = (props: IObjectifDeleteDialogProps) => {

  const handleClose = () => {
    props.onClose(false);
  };

  useEffect(() =>{
    reset();
  }, [props.objectif])

  useEffect(() => {
    if (props.updateSuccess) {
      props.onClose(true);
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
     axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?objectif.equals=${props.objectif}`)
              .then(res =>{
                  res.data.forEach(indicator => {
                    axios.delete(`${API_URIS.indicatorApiUri}/${indicator.id}`).then(() =>{}).catch(() =>{});
                  })
              }).catch(() =>{})
              .finally(() => props.deleteEntity(props.objectif.id));
   
  };

  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
     question={
      <Translate contentKey="microgatewayApp.objectif.delete.question" interpolate={{ id: props.objectif.id }}>
      Are you sure you want to delete this Objectif?
    </Translate>
     }/>
  );
};

const mapStateToProps = ({ objectif }: IRootState) => ({
  updateSuccess: objectif.updateSuccess,
});

const mapDispatchToProps = { deleteEntity, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ObjectifDeleteDialog);
