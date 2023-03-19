import React, { useState, useEffect } from 'react';
import { translate, Translate } from 'react-jhipster';

import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography } from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
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

export interface IQueryClientUpdateProps {
    client: IQueryClient,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const QueryClientUpdate = (props: IQueryClientUpdateProps) => {
    const { open } = props;
    const [entity, setEntity] = useState<IQueryClient>(props.client || {});
    const [isNew, setIsNew] = useState(!props.client || !props.client.id)
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [types, setTypes] = useState<IQueryClientType[]>([]);
    const classes = useStyles();

    const getTypes = () => {
        setLoading(true);
        const requestUri =`${API_URIS.queryClientTypeApiUri}`;
        axios.get<IQueryClientType[]>(requestUri)
          .then(res => {
            setTypes(res.data)
            setLoading(false);
          }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
          });
      };

    useEffect(() =>{
        getTypes();
    }, [])

    useEffect(() =>{
        setEntity(props.client || {});
        setIsNew(!props.client || !props.client.id)
        setSubmited(false)
    }, [props.client])


    const handleClose = () => props.onClose();

    const saveEntity = (event) =>{
        event.preventDefault();
        if(entity.name && entity.accountNum){
            setLoading(true)
            setSubmited(false)
            const req = isNew ? axios.post<IQueryClient>(`${API_URIS.queryClientApiUri}`, cleanEntity(entity))
                            : axios.put<IQueryClient>(`${API_URIS.queryClientApiUri}`, cleanEntity(entity));
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
        if(name !== 'type'){
            setEntity({...entity, [name]: value});
        }else{
            if(value){
                const type = [...types].find(t => t.id === value);
                setEntity({...entity, type})
            }else{
                setEntity({...entity, type: null})
            }
        }
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
                    <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.createOrEditLabel">Create or edit</Translate>
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
                                label={<Translate contentKey="microgatewayApp.qmanagerQueryClient.name">Name</Translate>}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="accountNum" value={entity.accountNum} onChange={handleChange} fullWidth
                                label={<Translate contentKey="microgatewayApp.qmanagerQueryClient.accountNum">accountNum</Translate>}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel shrink><Translate contentKey="microgatewayApp.qmanagerQueryClient.type">type</Translate></InputLabel>
                                <Select name="type"
                                     value={entity.type ? entity.id : 0}
                                     displayEmpty
                                     renderValue={() => entity.type ? entity.type.name : '---Select---'}
                                     onChange={handleChange}>
                                    <MenuItem value={0}>---Select---</MenuItem>
                                    {[...types].map((t, index) =>(
                                        <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} className="text-right mt-3">
                            <SaveButton type="submit" disabled={!entity.name || !entity.name} />
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    </Modal>
    </React.Fragment>
  );
};

export default QueryClientUpdate;
