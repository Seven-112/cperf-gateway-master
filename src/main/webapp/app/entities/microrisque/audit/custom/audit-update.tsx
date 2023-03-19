import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Collapse, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { AuditRiskLevel } from "app/shared/model/enumerations/audit-risk-level.model";
import { AuditType } from "app/shared/model/enumerations/audit-type.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import theme from "app/theme";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { IAuditCycle } from "app/shared/model/microrisque/audit-cycle.model";
import AuditCycleSelector from "../../audit-cycle/custom/audit-cycle-selector";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles({
    modal:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            with: '95%',
        }
    }
    
})

interface AuditUpdateProps{
    audit: IAudit,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const AuditUpdate = (props: AuditUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.audit || !props.audit.id);
    const [audit, setAudit] = useState(props.audit || {});
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [categories, setCategories] = useState<IProcessCategory[]>([]);
    const [openCycleSelector, setOpenCycleSelector] = useState(false);

    const startDate = audit && audit.startDate ? new Date(audit.startDate) : new Date();
    const endDate = audit && audit.endDate ? new Date(audit.endDate) : new Date();

    const classes = useStyles();


    const getCategories = () =>{
        if(serviceIsOnline(SetupService.PROCESS)){
            axios.get<IProcessCategory[]>(API_URIS.processCategoryApiUri)
                 .then(res =>{
                     setCategories(res.data)
                 }).catch(e => console.log(e))
        }
    }

    useEffect(() =>{
        getCategories();
    }, [])

    useEffect(() =>{
        setIsNew(!props.audit || !props.audit.id);
        setAudit(props.audit || {});
        setSubmited(false);
        setSuccess(false);
    }, [props.audit])

    const handleChange = (e) =>{
        const { name, value } = e.target;
        if(name === "processCategoryId"){
            const cat = value ? [...categories].find(c => c.id === value) : null;
            setAudit({
                ...audit,
                 processCategoryId: cat ? cat.id : null,
                 processCategoryName: cat ? cat.name : null,
            })
        }else{
            setAudit({...audit, [name] : value})
        }
    }

    const onSelectCycle = (sected?: IAuditCycle) =>{
        setAudit({...audit, cycle: sected});
        setOpenCycleSelector(false);
    }

    const onSave = (event) =>{
        event.preventDefault();
        setSubmited(true);
        setSuccess(false)
        setShowMessage(false)
        if(audit && audit.title && audit.startDate && audit.endDate){
            setLoading(true);
            const entity: IAudit = {
                ...audit,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }
            const req = isNew ? axios.post<IAudit>(API_URIS.auditApiUri, cleanEntity(entity))
                            : axios.put<IAudit>(API_URIS.auditApiUri, cleanEntity(entity));
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

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <AuditCycleSelector
                open={openCycleSelector}
                onClose={() => setOpenCycleSelector(false)}
                onSelect={onSelectCycle}
            />
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faGlasses} />}
                title={translate("microgatewayApp.microrisqueAudit.home.createOrEditLabel")}
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
                            <FormControl fullWidth error={submited && !audit.title} size="medium">
                                <TextField error={submited && !audit.title}
                                    name="title"
                                    margin="dense"
                                    variant="outlined"
                                    type="text"
                                    label={translate("microgatewayApp.microrisqueAudit.title")}
                                    InputLabelProps={{ shrink: true}}
                                    value={audit.title}
                                    onChange={handleChange}
                                />
                                {submited && !audit.title && <FormHelperText error={true}>
                                    {translate("_global.form.helpersTexts.required")}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={submited && !audit.startDate} size="medium">
                                <KeyboardDateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    label={translate("microgatewayApp.microrisqueAudit.startDate")}
                                    value={startDate}
                                    onChange={newDate => setAudit({...audit, startDate: newDate.toISOString()})}
                                    onError={console.log}
                                    format="dd/MM/yyyy HH:mm"
                                    InputLabelProps={{ shrink: true }}
                                    inputVariant="outlined"
                                    size="small"
                                />
                                {submited && !audit.startDate && <FormHelperText error={true}>
                                    {translate("_global.form.helpersTexts.required")}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={submited && !audit.endDate} size="medium">
                                <KeyboardDateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    label={translate("microgatewayApp.microrisqueAudit.endDate")}
                                    value={endDate}
                                    onChange={newDate => setAudit({...audit, endDate: newDate.toISOString()})}
                                    onError={console.log}
                                    format="dd/MM/yyyy HH:mm"
                                    InputLabelProps={{ shrink: true }}
                                    inputVariant="outlined"
                                    size="small"
                                />
                                {submited && !audit.endDate && <FormHelperText error={true}>
                                    {translate("_global.form.helpersTexts.required")}
                                </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink={true}>{translate("microgatewayApp.microrisqueAudit.type")}</InputLabel>
                                <Select value={audit.type} name="type"
                                    displayEmpty variant="outlined" onChange={handleChange}>
                                    <MenuItem value={AuditType.INTERNAL}>
                                        {translate(`microgatewayApp.AuditType.${AuditType.INTERNAL.toString()}`)}
                                    </MenuItem>
                                    <MenuItem value={AuditType.PERMANENT}>
                                        {translate(`microgatewayApp.AuditType.${AuditType.PERMANENT.toString()}`)}
                                    </MenuItem>
                                    <MenuItem value={AuditType.QUALITY}>
                                        {translate(`microgatewayApp.AuditType.${AuditType.QUALITY.toString()}`)}
                                    </MenuItem>
                                    <MenuItem>...</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink={true}>{translate("microgatewayApp.microrisqueAudit.riskLevel")}</InputLabel>
                                <Select value={audit.riskLevel} name="riskLevel" 
                                    displayEmpty variant="outlined" onChange={handleChange}>
                                    <MenuItem value={AuditRiskLevel.MINOR}>
                                        {translate(`microgatewayApp.AuditRiskLevel.${AuditRiskLevel.MINOR.toString()}`)}
                                    </MenuItem>
                                    <MenuItem value={AuditRiskLevel.MEDIUM}>
                                        {translate(`microgatewayApp.AuditRiskLevel.${AuditRiskLevel.MEDIUM.toString()}`)}
                                    </MenuItem>
                                    <MenuItem value={AuditRiskLevel.MAJOR}>
                                        {translate(`microgatewayApp.AuditRiskLevel.${AuditRiskLevel.MAJOR.toString()}`)}
                                    </MenuItem>
                                    <MenuItem>...</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth  size="medium">
                                <TextField
                                    name="riskName"
                                    margin="dense"
                                    variant="outlined"
                                    type="text"
                                    label={translate("microgatewayApp.microrisqueAudit.riskName")}
                                    InputLabelProps={{ shrink: true}}
                                    value={audit.riskName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth  size="medium">
                                <TextField
                                    margin="dense"
                                    variant="outlined"
                                    type="text"
                                    label={translate("microgatewayApp.microrisqueAudit.cycle")}
                                    InputLabelProps={{ shrink: true}}
                                    value={audit.cycle ? audit.cycle.name : ''}
                                    onClick={() => setOpenCycleSelector(true)}
                                />
                            </FormControl>
                        </Grid>
                        {serviceIsOnline(SetupService.PROCESS) && 
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <InputLabel shrink={true}>{translate("microgatewayApp.microrisqueAudit.processCategoryName")}</InputLabel>
                                    <Select value={audit.processCategoryId} name="processCategoryId"
                                        displayEmpty variant="outlined" onChange={handleChange}>
                                        {[...categories].map((c, index) =>(
                                            <MenuItem key={index} value={c.id}> {c.name}</MenuItem>
                                        ))}
                                        <MenuItem>{translate('_global.label.uncategorized')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Box width={1} mt={1} display="flex" justifyContent="flex-end">
                                <SaveButton type="submit"
                                    disabled={!audit || !audit.title || !audit.startDate || !audit.endDate} />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default AuditUpdate;