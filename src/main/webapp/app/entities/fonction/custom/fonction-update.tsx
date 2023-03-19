import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from '../fonction.reducer';
import { IFonction } from 'app/shared/model/fonction.model';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import { NaturePeople } from '@material-ui/icons';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    modal:{
        width: '30%',
        [theme.breakpoints.down('sm')]:{
            width: '80%',
        }
    },
}))

export interface IFonctionUpdateProps extends StateProps, DispatchProps{
    fonction: IFonction,
    open: boolean,
    onClose: Function,
    onSaved: Function,
}

export const FonctionUpdate = (props: IFonctionUpdateProps) => {
  
    const { open } = props;

   const [fonction, setFonction] = useState<IFonction>(props.fonction);
   const [isNew, setIsNew] = useState(!props.fonction || !props.fonction.id);

   const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  };

  useEffect(() =>{
    setFonction(props.fonction);
  }, [props.fonction])

  useEffect(() => {
    if (props.updateSuccess) {
        props.onSaved(props.fonctionEntity, isNew);
    }
  }, [props.updateSuccess]);

  const saveEntity = (event) => {
      event.preventDefault();
    if (fonction.name) {
      props.reset();
      if (!fonction.id) {
        props.createEntity(fonction);
      } else {
        props.updateEntity(fonction);
      }
    }
  };

  const handleChange = (e) =>{
      const {name, value} = e.target;
      setFonction({...fonction, [name]: value});
  }

  const {loading, updating} = props;

  return (
      <React.Fragment>
        <MyCustomModal
            open={open}
            onClose={handleClose}
            avatarIcon={<NaturePeople fontSize="small"/>}
            rootCardClassName={classes.modal}
            title={translate("microgatewayApp.fonction.home.createOrEditLabel")}
        >
            <form onSubmit={saveEntity}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField name="name" value={fonction.name} onChange={handleChange} fullWidth
                        required label={<Translate contentKey="microgatewayApp.fonction.name">Name</Translate>}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="description" value={fonction.description} 
                        onChange={handleChange} fullWidth multiline rowsMax={2}
                        label={<Translate contentKey="microgatewayApp.fonction.description">Description</Translate>}
                        />
                    </Grid>
                    <Grid item xs={12} className="text-right mt-3">
                        <SaveButton type="submit" disabled={!fonction.name} />
                    </Grid>
                </Grid>
            </form>  
        </MyCustomModal>
      </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  fonctionEntity: storeState.fonction.entity,
  loading: storeState.fonction.loading,
  updating: storeState.fonction.updating,
  updateSuccess: storeState.fonction.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FonctionUpdate);
