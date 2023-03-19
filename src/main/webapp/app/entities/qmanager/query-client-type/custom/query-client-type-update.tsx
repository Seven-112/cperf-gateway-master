import React, { useState, useEffect } from 'react';
import { translate, Translate } from 'react-jhipster';

import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, Grid, IconButton, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';
import axios from 'axios';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import { API_URIS } from 'app/shared/util/helpers';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '10px 10px 0 0',
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
    },
}))

export interface IQueryClientTypeUpdateProps {
    type: IQueryClientType,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const QueryClientTypeUpdate = (props: IQueryClientTypeUpdateProps) => {
    const { open } = props;
    const [entity, setEntity] = useState<IQueryClientType>(props.type || {});
    const [isNew, setIsNew] = useState(!props.type || !props.type.id)
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);

    const classes = useStyles();
    useEffect(() =>{
        setEntity(props.type || {});
        setIsNew(!props.type || !props.type.id)
        setSubmited(false)
    }, [props.type])


    const handleClose = () => props.onClose();

    const saveEntity = (event) =>{
        event.preventDefault();
        if(entity.name){
            setLoading(true)
            setSubmited(false)
            const req = isNew ? axios.post<IQueryClientType>(`${API_URIS.queryClientTypeApiUri}`, cleanEntity(entity))
                            : axios.put<IQueryClientType>(`${API_URIS.queryClientTypeApiUri}`, cleanEntity(entity));
                req.then(res =>{
                    if(res.data){
                        setSuccess(true)
                        if(props.onSave)
                            props.onSave(res.data, isNew)
                    }
                }).catch(err => {
                    console.log(err)
                    setSuccess(false)
                })
                .finally(() => {
                    setLoading(false)
                    setSubmited(true)
                })
        }
    }

    const handleChange = (e) =>{
        setSubmited(false)
        const {name, value} = e.target;
        setEntity({...entity, [name]: value});
    }

  return (
    <React.Fragment>
    <Modal
        aria-labelledby="edit-type-objectif-modal-title"
        aria-describedby="edit-type-objectif-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableBackdropClick
        BackdropProps={{
            timeout: 500,
        }}>
        <Card className={classes.card}>
            <CardHeader classes={{root: classes.cardHeader}} 
                title={
                    <Translate contentKey="microgatewayApp.qmanagerQueryClientType.home.createOrEditLabel">Create or edit type objectif</Translate>
                }
                titleTypographyProps={{ variant: 'h4'}}
                action={
                    <IconButton color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>
                }/>
            <CardContent className={classes.cardContent}>
                <form onSubmit={saveEntity}>
                    <Grid container spacing={3}>
                        {loading && <Grid item xs={12}>
                        <Box width={1} display="flex" justifyContent="center" justifyItems="center">
                            <CircularProgress color="primary" style={{ height:50, width:50}} />
                            <Typography color="primary" className="ml-3">Loading...</Typography>
                        </Box>
                        </Grid>}
                        {submited && <Grid item xs={12}>
                            <Collapse in={true}>
                                <Alert severity={success? "success" : "error"} 
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {setSubmited(false); }}
                                    >
                                        <Close fontSize="inherit" />
                                    </IconButton>}
                                >
                                    {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                </Alert>
                            </Collapse>
                        </Grid>}
                        <Grid item xs={12}>
                            <TextField name="name" value={entity.name} onChange={handleChange} fullWidth
                                label={<Translate contentKey="microgatewayApp.qmanagerQueryClientType.name">Name</Translate>}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="description" value={entity.description} onChange={handleChange} fullWidth
                                label={<Translate contentKey="microgatewayApp.qmanagerQueryClientType.description">description</Translate>}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} className="text-right mt-3">
                            <SaveButton type="submit" disabled={!entity.name} />
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    </Modal>
    </React.Fragment>
  );
};

export default QueryClientTypeUpdate;
