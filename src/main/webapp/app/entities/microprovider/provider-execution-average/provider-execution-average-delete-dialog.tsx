import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IProviderExecutionAverage } from 'app/shared/model/microprovider/provider-execution-average.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './provider-execution-average.reducer';

export interface IProviderExecutionAverageDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProviderExecutionAverageDeleteDialog = (props: IProviderExecutionAverageDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/provider-execution-average' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.providerExecutionAverageEntity.id);
  };

  const { providerExecutionAverageEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="microgatewayApp.microproviderProviderExecutionAverage.delete.question">
        <Translate
          contentKey="microgatewayApp.microproviderProviderExecutionAverage.delete.question"
          interpolate={{ id: providerExecutionAverageEntity.id }}
        >
          Are you sure you want to delete this ProviderExecutionAverage?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-providerExecutionAverage" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ providerExecutionAverage }: IRootState) => ({
  providerExecutionAverageEntity: providerExecutionAverage.entity,
  updateSuccess: providerExecutionAverage.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProviderExecutionAverageDeleteDialog);
