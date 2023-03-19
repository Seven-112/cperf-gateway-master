import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from 'app/entities/microfilemanager/mshz-file/mshz-file.reducer';
import DeleteModal from 'app/shared/modals/delete-modal';

export interface IMshzFileDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JustificationFileDelete = (props: IMshzFileDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/mshz-file' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.mshzFileEntity.id);
  };

  const { mshzFileEntity } = props;
  return (
    <DeleteModal confirmDelete={confirmDelete} handleClose={handleClose}
      question={
       <Translate contentKey="microgatewayApp.microfilemanagerMshzFile.delete.question"
          interpolate={{ id: mshzFileEntity.id }}> Are you sure you want to delete this MshzFile?
        </Translate>
      }
    />
  );
};

const mapStateToProps = ({ mshzFile }: IRootState) => ({
  mshzFileEntity: mshzFile.entity,
  updateSuccess: mshzFile.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JustificationFileDelete);
