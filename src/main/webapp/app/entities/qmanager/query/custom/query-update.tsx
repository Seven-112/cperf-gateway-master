import React, { useState, useEffect } from 'react';
import { translate, Translate } from 'react-jhipster';

import { Box, CircularProgress, Collapse, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ProcessFinder from 'app/entities/microprocess/process/custom/process-finder';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import MyCustomRTE from 'app/shared/component/my-custom-rte';
import { SaveButton } from 'app/shared/component/custom-button';
import MyCustomModal from 'app/shared/component/my-custom-modal';

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
}))

export interface IQueryUpdateProps extends StatePorps, DispatchProps {
    query: IQuery,
    open: boolean,
    onSave: Function,
    onClose: Function
}

export const QueryUpdate = (props: IQueryUpdateProps) => {
    const { open, account } = props;
    const [entity, setEntity] = useState<IQuery>(props.query || {});
    const [isNew, setIsNew] = useState(!props.query || !props.query.id)
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openProcessFinder, setOpenProcessFinder]  = useState(false);
    const [queryProcess, setQueryProcess] = useState<IProcess>(null);
    const [clientTypes, setClientTyes] = useState<IQueryClientType[]>([]);
    const [description,setDescription] = useState(null);
    const classes = useStyles();

    const formIsValid = entity && entity.name;

    const getProcess = () =>{
        if(props.query && props.query.processId && serviceIsOnline(SetupService.PROCESS)){
            setLoading(true);
            axios.get<IProcess>(`${API_URIS.processApiUri}/${props.query.processId}`)
                .then(res =>{
                    setQueryProcess(res.data);
                }).catch(e => console.log(e))
                .finally(() =>{
                    setLoading(false)
                })
        }
    }

    const getClientTypes = () =>{
        setLoading(true);
        axios.get<IQueryClientType[]>(`${API_URIS.queryClientTypeApiUri}`)
            .then(res =>{
                setClientTyes([...res.data]);
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false)
            })
    }

    useEffect(() =>{
        setEntity(props.query || {});
        setIsNew(!props.query || !props.query.id)
        setSubmited(false)
        getProcess();
        getClientTypes();
        setDescription(props.query ? props.query.description : null);
    }, [props.query])

    const onSelectProcess = (selected?: IProcess[]) =>{
        if(selected && selected.length !== 0){
            setQueryProcess(selected[0]);
            setEntity({...entity, processId: selected[0].id});
        }
        setOpenProcessFinder(false);
    }


    const handleClose = () => props.onClose();

    const saveEntity = (event) =>{
        event.preventDefault();
        if(formIsValid){
            setLoading(true)
            setSubmited(false)
            const entityToSave: IQuery = {
                ...entity,
                description,
                editorId: entity.editorId ? entity.editorId : account ? account.id : null
            }
            const req = isNew ? axios.post<IQuery>(`${API_URIS.queryApiUri}`, cleanEntity(entityToSave))
                            : axios.put<IQuery>(`${API_URIS.queryApiUri}`, cleanEntity(entityToSave));
                req.then(res =>{
                    if(res.data){
                        setSuccess(true)
                        setEntity(res.data)
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
        const {name, value} = e.target;
        setEntity({...entity, [name]: value});
        setSubmited(false)
    }

    const handleChangeDescription = (value) =>{
        setDescription(value);
        setSubmited(false);
    }

    const handleSelectType = (e) =>{
        const value = e.target.value;
        setEntity({...entity, clientType: [...clientTypes].find(ct => ct.id === value)})
    }

    const qProcess = queryProcess ? queryProcess.label + `${queryProcess.category ? ' ('+ queryProcess.category.name +' )' : ''}` : '';

  return (
    <React.Fragment>
    <ProcessFinder 
        open={openProcessFinder}
        preSelected={queryProcess ? [queryProcess] : []}
        multiple={false}
        onSave={onSelectProcess}
        onClose={() => setOpenProcessFinder(false)}
    />
    <MyCustomModal
        rootCardClassName={classes.card}
        open={open}
        onClose={handleClose}
        title={translate("microgatewayApp.qmanagerQuery.home.createOrEditLabel")}
        >
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
                            label={<Translate contentKey="microgatewayApp.qmanagerQuery.name">Name</Translate>}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel shrink>
                                {translate("microgatewayApp.qmanagerQuery.clientType")}
                            </InputLabel>
                            <Select 
                                fullWidth
                                value={entity.clientType ? entity.clientType.id : 0}
                                onChange={handleSelectType}
                                >
                                <MenuItem value={0}>---Select---</MenuItem>
                                {[...clientTypes].map((t,index) =>(
                                    <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {serviceIsOnline(SetupService.QUERY_PONCTUAL) &&
                    <Grid item xs={12}>
                        <Box width={1} display="flex" justifyContent="center" 
                            alignItems="center" flexWrap="center">
                            <Typography className="mr-2">{translate("microgatewayApp.qmanagerQuery.ponctual")}</Typography>
                            <FormControlLabel 
                                label={translate(`_global.label.${entity.ponctual ? 'yes': 'no'}`)}
                                labelPlacement="end"
                                className='mt-1'
                                control={<Switch checked={entity.ponctual} color="primary"
                                        onChange={() => setEntity({...entity, ponctual: !entity.ponctual})} />}
                            />
                        </Box>
                    </Grid>}
                    <Grid item xs={12}>
                        <TextField 
                            value={qProcess}
                            fullWidth
                            label={<Translate contentKey="microgatewayApp.qmanagerQuery.processId">Process</Translate>}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onClick={() => setOpenProcessFinder(true)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel shrink><Translate contentKey="microgatewayApp.qmanagerQuery.description">description</Translate></InputLabel>
                        <MyCustomRTE content={description || entity.description}
                                onSave={handleChangeDescription}
                                editorMinHeight={120} editorMaxHeight={250}
                            />
                    </Grid>
                    <Grid item xs={12} className="text-right mt-3">
                        <SaveButton type="submit" disabled={!formIsValid} />
                    </Grid>
                </Grid>
            </form>
    </MyCustomModal>
    </React.Fragment>
  );
};

const mapStateProps = ({ authentication }: IRootState) =>({
    account: authentication.account,
})

const mapDispatchProps = {}

type StatePorps = ReturnType<typeof mapStateProps>;

type DispatchProps = typeof mapDispatchProps;

export default connect(mapStateProps, mapDispatchProps)(QueryUpdate);
