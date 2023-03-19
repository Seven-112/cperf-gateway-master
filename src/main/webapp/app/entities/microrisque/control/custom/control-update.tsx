import { Avatar, Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Switch, TextField, Typography } from "@material-ui/core";
import { Policy, Save } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { CircularProgressWithLabel } from "app/shared/component/edit-file-modal";
import { IControlMaturity } from "app/shared/model/microrisque/control-maturity.model";
import { IControlType } from "app/shared/model/microrisque/control-type.model";
import { IControl } from "app/shared/model/microrisque/control.model";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '40%',
        [theme.breakpoints.down('sm')]:{
            width: '90%',
        },
        background: 'transparent',
        marginTop: theme.spacing(5),
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        paddingBottom:2,
        paddingTop:2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        borderRadius: '7px 7px 0 0',
    },
    cardAvatar:{
        background: 'transparent',
        color: theme.palette.background.paper,
    },
    cardcontent:{
        minHeight: '10%',
        maxHeight: '80%',
        background: theme.palette.background.paper,
    },
    cardactions:{
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '0 0 7px 7px',
        padding: 2,
        textAlign: 'center',
        background: theme.palette.primary.main,
        color: theme.palette.background.paper,
    }
}))

interface ControlUpdateProps{
    risk: IRisk,
    control?:IControl,
    open?:boolean,
    onSave: Function,
    onClose: Function,
}

export const ControlUpdate = (props: ControlUpdateProps) =>{
    const {risk, open} = props;
    const [control, setControl] = useState<IControl>(props.control);
    const [types, setTypes] = useState<IControlType[]>([])
    const [maturities, setMaturities] = useState<IControlMaturity[]>([])
    const [loading, setLoading] = useState(false);
    const [isNew, setNew] = useState(!props.control || !props.control.id);
    const [error, setError] = useState(false);
    const classes = useStyles()

    const getConrolTypes = () =>{
        setLoading(true);
        axios.get<IControlType[]>(`${API_URIS.riskControlTypeApiUri}`)
            .then(res =>setTypes([...res.data]))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    const getMaturities = () =>{
        setLoading(true);
        axios.get<IControlMaturity[]>(`${API_URIS.riskControlMaturityApiUri}`)
            .then(res =>setMaturities([...res.data]))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    useEffect(() =>{
        getMaturities();
        getConrolTypes();
    }, [])

    useEffect(() =>{
        setControl(props.control);
        setNew(!props.control || !props.control.id);
    }, [props.control])

    const handleClose = () => props.onClose();

    const handleChange = (e) =>{
        const {value, name} = e.target;
        if(name==="type")
            setControl({...control, [name]: types.find(t => t.id === value)});
        else if(name==="maturity")
            setControl({...control, [name]: maturities.find(m => m.id === value)});
        else
            setControl({...control, [name]:value});

        if(error) 
            setError(false);

    }

    const formIsValid = (control.description && control.type && control.type.id && control.maturity && control.maturity.id);

    const onSubmit = (event) =>{
        event.preventDefault();
        if(formIsValid){
            setLoading(true);
            const entity: IControl = {
                ...control,
                risk
            }
            const request = isNew ? axios.post<IControl>(`${API_URIS.controlApiUri}`, cleanEntity(entity))
                                  : axios.put<IControl>(`${API_URIS.controlApiUri}`, cleanEntity(entity))
            request.then(res =>{
                if(res.data){
                    props.onSave(res.data, isNew);
                    if(isNew)
                        setControl({});
                }
            }).catch(e => {
                console.log(e);
                setError(true);
            }).finally(() => setLoading(false));
        }
    }

    return(
        <React.Fragment>
            {risk &&
                <Modal
                    open={open}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout:200
                    }}
                    onClose={handleClose}
                    disableBackdropClick
                    closeAfterTransition
                    className={classes.modal}
                >
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar className={classes.cardAvatar}> <Policy /></Avatar>
                            }
                            title={
                                isNew ? translate('microgatewayApp.microrisqueControl.home.createLabel')
                                      :  translate('microgatewayApp.microrisqueControl.home.createOrEditLabel')
                            }
                            titleTypographyProps={{
                                variant: 'h4',
                            }}
                            action={
                                <IconButton color="inherit" onClick={handleClose}>
                                    <Close />
                                </IconButton>
                            }
                            className={classes.cardheader}
                         />
                         <CardContent className={classes.cardcontent}>
                            {risk &&
                                <>
                                     <Box width={1} textAlign="center">
                                         {loading && <>
                                            <CircularProgress />
                                            <Typography color="primary">Loading...</Typography>
                                            </>
                                         }
                                         {error && <Typography color="error">{translate("_global.messages.entity.edition.error.info")}</Typography>}
                                     </Box>
                                     <Box width={1}>
                                         <form onSubmit={onSubmit}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            label={translate('microgatewayApp.microrisqueControl.description')}
                                                            name="description"
                                                            value={control.description}
                                                            onChange={handleChange}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel style={{ marginBottom:7,}}>{translate('microgatewayApp.microrisqueControl.type')}</InputLabel>
                                                        <Select
                                                        name="type"
                                                        value={control.type ? control.type.id : null}
                                                        onChange={handleChange}
                                                        >
                                                        {types.map(t =>(<MenuItem key={t.id} value={t.id}>{t.type}</MenuItem>))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel style={{ marginBottom:7,}}>{translate('microgatewayApp.microrisqueControl.maturity')}</InputLabel>
                                                        <Select
                                                        name="maturity"
                                                        value={control.maturity ? control.maturity.id : null}
                                                        onChange={handleChange}
                                                        >
                                                        {maturities.map(m =>(<MenuItem key={m.id} value={m.id}>{m.label}</MenuItem>))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box width={1} m={0} p={0} display="flex" alignItems="center" flexWrap="wrap">
                                                        <Typography className="mr-5">{translate('microgatewayApp.microrisqueControl.validationRequired')}</Typography>
                                                        <FormControlLabel style={{padding:0, margin:0}}
                                                            control={
                                                                <Switch
                                                                    color="primary"
                                                                    checked={control.validationRequired}
                                                                    onChange={() => setControl({...control, validationRequired: !control.validationRequired})}
                                                                />
                                                            }
                                                            label={translate(`_global.label.${control.validationRequired ? 'yes': 'no'}`)}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box width={1} m={0} p={0} textAlign="right">
                                                        <Fab type="submit" variant="extended" size="small"
                                                            color="primary" disabled={!formIsValid}>
                                                            {translate(`entity.action.save`)}&nbsp;
                                                            <Save />
                                                        </Fab>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </form>
                                     </Box>
                                </>
                            }
                         </CardContent>
                         {risk &&
                         <CardActions className={classes.cardactions}>
                                <Typography variant="caption">{translate("microgatewayApp.microrisqueRisk.detail.title")}</Typography>
                                 &nbsp;:&nbsp;<Typography variant="caption">{risk.label}</Typography>
                         </CardActions>
                        }
                    </Card>
                </Modal>
           }
        </React.Fragment>
    )
}

ControlUpdate.defaultProps={
    control: {validationRequired: true}
}

export default ControlUpdate;
