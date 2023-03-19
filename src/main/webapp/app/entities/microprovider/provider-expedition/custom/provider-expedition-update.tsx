import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Fab, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProviderExpedition } from "app/shared/model/microprovider/provider-expedition.model";
import moment, { Moment } from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { hasAuthorities, hasPrivileges } from "app/shared/auth/helper";
import { AUTHORITIES } from "app/config/constants";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IChrono } from "app/shared/util/chrono.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '25vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    catBox:{
        borderColor: theme.palette.info.dark,
    },
    criteriaBox:{
        borderColor: theme.palette.success.dark,
    },
    ponderationBox:{
        borderColor: theme.palette.primary.dark,
    },
}))

interface ProviderExpeditionUpdateProps{
    expedition: IProviderExpedition,
    account: any,
    readonly?: boolean
    open?:boolean,
    onSave?:Function,
    onClose:Function,
}

export const ProviderExpeditionUpdate = (props: ProviderExpeditionUpdateProps) =>{
    const { open, account, readonly } = props;
    const [expedition, setExpedition] = useState({...props.expedition});
    const [isNew, setIsNew] = useState(!props.expedition || !props.expedition.id)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setExpedition({...props.expedition});
        setIsNew(!props.expedition || !props.expedition.id)
    }, [props.expedition])

    const handleClose = () => {
        setShowMessage(false)
        props.onClose();
    }

    const formIsValid = expedition && expedition.answer && (expedition.id || expedition.departureDate || expedition.countryOrigin || expedition.portArivalDate || expedition.siteDeliveryDate);

    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        setLoading(true)
        if(formIsValid){
            const request = isNew ? axios.post<IProviderExpedition>(`${API_URIS.providerExpeditionApiUri}`, cleanEntity(expedition))
                                  : axios.put<IProviderExpedition>(`${API_URIS.providerExpeditionApiUri}`, cleanEntity(expedition))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    setShowMessage(true)
                    if(props.onSave){
                        props.onSave(res.data, isNew);
                    }
                }else{
                    setSuccess(false);
                }
            }).catch(e =>{
                setSuccess(false);
                setShowMessage(true);
            }).finally(() => setLoading(false))
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        if(!readonly){
            setExpedition({...expedition, [name]: value});
        }
    }

    const handleDateChange = (name, newValue?: Date) => {
        if(newValue && name && !readonly){
            setExpedition({...expedition, [name]: newValue.toISOString()})
        }
    };
    
    const departureDate = (expedition && expedition.departureDate) ? new Date(expedition.departureDate) : null;
    const  portArivalDate = (expedition && expedition.portArivalDate) ? new Date(expedition.portArivalDate) : null;
    const siteDeliveryDate = (expedition && expedition.siteDeliveryDate) ? new Date(expedition.siteDeliveryDate) : null;
    const previewDepatureDate = (expedition && expedition.previewDepatureDate) ? new Date(expedition.previewDepatureDate) : null;
    const previewSiteDeliveryDate = (expedition && expedition.previewSiteDeliveryDate) ? new Date(expedition.previewSiteDeliveryDate) : null;
    const previewPortArivalDate = (expedition && expedition.previewPortArivalDate) ? new Date(expedition.previewPortArivalDate) : null;

    return (
        <React.Fragment>  
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                                <Typography variant="h4" className="mr-5">
                                    {translate("microgatewayApp.microproviderProviderExpedition.home.createOrEditLabel")}
                                </Typography>
                        </Box>}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSave}>
                            <Grid container spacing={3}>
                                {showMessage && <Grid item xs={12}>
                                        <Alert severity={success? "success" : "error"} 
                                            action={
                                                <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setShowMessage(false);
                                                }}
                                                >
                                                <Close fontSize="inherit" />
                                                </IconButton>}
                                            >
                                                {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                        </Alert>
                                    </Grid>
                                    }
                                {loading && 
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                        boxShadow={1} className={classes.catBox} borderLeft={10} borderRadius={3} p={1}>
                                        <CircularProgress />
                                        <Typography className="ml-3">Loading</Typography>
                                    </Box>
                                </Grid>
                                }
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth
                                        name="countryOrigin"
                                        margin="dense"
                                        size="small"
                                        variant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.countryOrigin")}
                                        InputLabelProps={{ shrink: true}}
                                        value={expedition.countryOrigin}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth
                                        name="transporter"
                                        margin="dense"
                                        size="small"
                                        variant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.transporter")}
                                        InputLabelProps={{ shrink: true}}
                                        value={expedition.transporter}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        variant="inline"
                                        fullWidth
                                        size="small"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.previewDepatureDate")}
                                        format="dd/MM/yyyy"
                                        value={previewDepatureDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("previewDepatureDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        variant="inline"
                                        fullWidth
                                        size="small"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.departureDate")}
                                        format="dd/MM/yyyy"
                                        value={departureDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("departureDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        fullWidth
                                        size="small"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.previewPortArivalDate")}
                                        format="dd/MM/yyyy"
                                        value={previewPortArivalDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("previewPortArivalDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        fullWidth
                                        size="small"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.portArivalDate")}
                                        format="dd/MM/yyyy"
                                        value={portArivalDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("portArivalDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        fullWidth
                                        size="small"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.previewSiteDeliveryDate")}
                                        format="dd/MM/yyyy"
                                        value={previewSiteDeliveryDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("previewSiteDeliveryDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        autoOk
                                        fullWidth
                                        size="small"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={translate("microgatewayApp.microproviderProviderExpedition.siteDeliveryDate")}
                                        format="dd/MM/yyyy"
                                        value={siteDeliveryDate}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={date => handleDateChange("siteDeliveryDate",date)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                        <Button type="submit" variant="text" className="text-primary text-capitalize"
                                            disabled={(!formIsValid || readonly)}>
                                            {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default ProviderExpeditionUpdate;