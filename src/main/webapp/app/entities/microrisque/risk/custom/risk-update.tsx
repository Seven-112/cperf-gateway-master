import { Box, Button, CircularProgress, Fab, FormControl, Grid, IconButton, InputAdornment, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { ITask } from "app/shared/model/microprocess/task.model";
import { IRiskType } from "app/shared/model/microrisque/risk-type.model";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { translate } from "react-jhipster";
import { Add, Save } from "@material-ui/icons";
import RiskTypeUpdate from "../../risk-type/custom/risk-type-update";
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
}))

interface RiskUpdateProps{
    risk?:IRisk
    task?: ITask,
    onSave: Function
    enableEdit?:boolean
}

export const RiskUpdate = (props: RiskUpdateProps) =>{
    const [risk, setRisk] = useState<IRisk>(props.risk || {});
    const [task, setTask] = useState<ITask>(props.task);
    const [types, setTypes] = useState<IRiskType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const enableEdit = props.enableEdit;

    const classes = useStyles();

    const getTypes = () =>{
        setLoading(true);
        axios.get<IRiskType[]>(`${API_URIS.riskTypeApiUri}`)
            .then(res =>{
                setTypes([...res.data]);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false))
    }

    useEffect(() =>{
        getTypes();
    }, [])

    const handleChange = (e) =>{
        if(enableEdit){
            const {value, name} = e.target;
            if(value){
                if(name === "probability" || name==="gravity")
                   setRisk({...risk, [name]: parseFloat(value) < 0 ? 0 : parseFloat(value) > 100 ? 100 : parseFloat(value)});
                else if(name === "type")
                    setRisk({...risk, [name]: types.find(t => t.id === parseInt(value, 10))})
                else
                    setRisk({...risk, [name]: value});
            }else{
                setRisk({...risk, [name]: value});
            }
        }else{
            e.preventDefault();
        }
    }

    const handleClose = () => setOpen(false);

    const handleSave = (saved?: IRiskType) =>{
        if(saved){
            setRisk({...risk, type: {...saved}})
            setTypes([saved,...types]);
            setOpen(false);
        }
    }

    const onSave = () =>{
        if(risk.label && risk.type){
            setLoading(true);
            const isNew = risk.id ? false : true;
            const request = risk.id ? axios.put<IRisk>(`${API_URIS.riskApiUri}`, cleanEntity(risk))
                                    :  axios.post<IRisk>(`${API_URIS.riskApiUri}`, cleanEntity(risk));
                
            request.then(res =>{
                    props.onSave(res.data, isNew);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false));
        }
    }

    return(
        <React.Fragment>
            <RiskTypeUpdate open={open} onSave={handleSave} onClose={handleClose} />
            <Box width={1}>
                {loading &&
                <Box display="flex" flexDirection="column" textAlign="center">
                    <Box>
                        <CircularProgress color="secondary" />
                    </Box>
                    <Box>
                        <Typography color="secondary" className="text-update font-weight-bold" >Loading...</Typography>
                    </Box>
                </Box>
                }
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                            <TextField 
                                name="label"
                                value={risk.label}
                                onChange={handleChange}
                                label={translate("microgatewayApp.microrisqueRisk.label")+' *'}/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense" size="small">
                            <TextField 
                                name="cause"
                                label={translate("microgatewayApp.microrisqueRisk.cause")}
                                value={risk.cause}
                                onChange={handleChange}
                                />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin="dense" size="small">
                            <TextField 
                                name="probability"
                                type="number"
                                inputProps={{
                                    min:0,
                                    max:100,
                                }}
                                label={translate("microgatewayApp.microrisqueRisk.probability")}
                                value={risk.probability}
                                onChange={handleChange}
                                />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth margin="dense" size="small">
                            <TextField 
                                name="gravity"
                                type="number"
                                inputProps={{
                                    min:0,
                                    max:100,
                                }}
                                label={translate("microgatewayApp.microrisqueRisk.gravity")}
                                value={risk.gravity}
                                onChange={handleChange}
                                />
                        </FormControl>
                    </Grid>
                    {enableEdit ? (<>
                    <Grid item xs={8} sm={10} md={11}>
                        <FormControl fullWidth margin="dense" size="small">
                            <InputLabel style={{}}>{translate("microgatewayApp.microrisqueRisk.type")}</InputLabel>
                            <Select
                                name="type"
                                onChange={handleChange}
                                value={risk.type ? risk.type.id : null}
                            >
                                {types.map((t, index) =><MenuItem key={index} value={t.id}>{t.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={2} md={1}>
                        <Fab color="primary" size="small" onClick={() => setOpen(true)}><Add /></Fab>
                    </Grid>
                    <Grid item xs={12}>
                        <Fab color="primary" variant="extended" size="small"
                         disabled={!risk.label || !risk.type} onClick={onSave}>
                            {translate('entity.action.save')}&nbsp;<Save />
                        </Fab>
                    </Grid>
                    </>):(
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense" size="small">
                                <TextField
                                    label={translate("microgatewayApp.microrisqueRisk.type")}
                                    value={risk.type ? risk.type.name: null}
                                />
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </React.Fragment>
    )
}

RiskUpdate.defaultProps ={
    enableEdit: true
}


export default RiskUpdate;