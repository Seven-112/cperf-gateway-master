import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop, Button, Card, CardContent, CardHeader, IconButton, makeStyles, Modal } from '@material-ui/core';
import React from 'react';
import { Translate } from 'react-jhipster';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) =>({
  root:{
    background: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(-40),
  },
  modalHeader:{
    backgroundColor: theme.palette.warning.dark,
    color:theme.palette.common.white,
    margin:-2,
    marginBottom:0,
    padding:7,
  },
  modalBody:{
    background:theme.palette.common.white,
    color:theme.palette.error.dark,
  },
  modalFooter:{
    marginTop: theme.spacing(2),
    borderTop: '1px solid '+theme.palette.primary.dark,
    textAlign:'center',
    paddingTop: theme.spacing(1),
  }
}));

export interface IDeleteModal{
    handleClose: Function,
    confirmDelete: Function,
    question?: any
}

export const DeleteModal = (props: IDeleteModal) =>{
    const classes = useStyles();
    const {handleClose, confirmDelete, question} = props;

    return (
      <Modal
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          className={classes.root}
          open={true}
          closeAfterTransition
          disableBackdropClick
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}>
        <Card>
            <CardHeader className={classes.modalHeader}
              title={<Translate contentKey="entity.delete.title">Confirm delete operation</Translate>}
              action={
                <IconButton onClick={() =>handleClose()} color="inherit">
                  <CloseIcon />
                </IconButton>
              }/>
              <CardContent>
                  <div  className={ classes.modalBody}>
                    { (question) ? question : 'Are you sure you want to delete?' }
                  </div>
                  <div className={ classes.modalFooter}>
                  <Button color="primary" onClick={() =>handleClose()} variant="contained" className="mr-3">
                    <FontAwesomeIcon icon="ban" />
                    &nbsp;
                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                  </Button>
                  <Button variant="contained" color="secondary"
                   onClick={() =>confirmDelete()} className="ml-3">
                    <FontAwesomeIcon icon="trash" />
                    &nbsp;
                    <Translate contentKey="entity.action.delete">Delete</Translate>
                  </Button>
                  </div>
              </CardContent>
        </Card>
      </Modal>
    );
}

export default DeleteModal;