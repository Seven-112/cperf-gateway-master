import { IAuditCycle } from "app/shared/model/microrisque/audit-cycle.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Box, Button, CircularProgress, Collapse, FormControl, FormHelperText, Grid, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import theme from "app/theme";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "@material-ui/lab";
import { Close, Save } from "@material-ui/icons";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles({
    modal:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            with: '95%',
        }
    }
    
})

interface AuditCycleUpdateProps{
    open?: boolean,
    cycle: IAuditCycle,
    onSave?: Function,
    onClose: Function,
}

export const AuditCycleUpdate = (props: AuditCycleUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.cycle || !props.cycle.id);
    const [cycle, setCycle] = useState(props.cycle || {});
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setIsNew(!props.cycle || !props.cycle.id);
        setCycle(props.cycle || {});
        setSubmited(false);
        setSuccess(false);
    }, [props.cycle])


    const onSave = (event) =>{
        event.preventDefault();
        setSubmited(true);
        setSuccess(false)
        setShowMessage(false)
        if(cycle && cycle.name){
            setLoading(true);
            const req = isNew ? axios.post<IAuditCycle>(API_URIS.auditCycleApiUri, cleanEntity(cycle))
                            : axios.put<IAuditCycle>(API_URIS.auditApiUri, cleanEntity(cycle));
            req.then(res =>{
                if(res.data){
                    setSuccess(true);
                    if(props.onSave)
                        props.onSave(res.data, isNew);
                }else{
                    setSuccess(false)
                    setShowMessage(true);
                }
            }).catch(e =>{
                setSuccess(false)
                setShowMessage(true);
                console.log(e)

            }).finally(() =>{
                setLoading(false)
            })
        }
    }

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setCycle({...cycle, [name] : value})
    }

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faCircleNotch} size="2x"/>}
                title={translate("microgatewayApp.microrisqueAuditCycle.home.createOrEditLabel")}
                rootCardClassName={classes.modal}
            >
                <form onSubmit={onSave}>
                    <Grid container spacing={2} alignItems="center">
                        {loading && <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                    <CircularProgress color="secondary"/>
                                    <Typography variant="h4" color="secondary" className="ml-2">Loading...</Typography>
                            </Box>
                        </Grid>}
                        {submited && <Grid item xs={12}>
                            <Collapse in={showMessage}>
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
                            </Collapse>
                        </Grid>}
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth error={submited && !cycle.name} size="medium">
                                <TextField error={submited && !cycle.name}
                                    name="name"
                                    margin="dense"
                                    variant="outlined"
                                    type="text"
                                    label={translate("microgatewayApp.microrisqueAuditCycle.name")}
                                    InputLabelProps={{ shrink: true}}
                                    value={cycle.name}
                                    onChange={handleChange}
                                />
                                {submited && !cycle.name && <FormHelperText error={true}>
                                    {translate("_global.form.helpersTexts.required")}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} mt={1} display="flex" justifyContent="flex-end">
                                <SaveButton type="submit" disabled={!cycle || !cycle.name} />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default AuditCycleUpdate;