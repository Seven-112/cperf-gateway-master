import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, MenuItem, Modal, Select, Slide, TextField, Typography } from "@material-ui/core";
import { AccessTime, Close, Save } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import MyToast from "app/shared/component/my-toast";
import { AuditEventRecurrence } from "app/shared/model/enumerations/audit-event-recurrence.model";
import { EventRecurrence } from "app/shared/model/enumerations/event-recurrence.model";
import { ProcessEventRecurrence } from "app/shared/model/enumerations/process-event-recurrence.model";
import { IAuditEventTrigger } from "app/shared/model/microrisque/audit-event-trigger.model";
import { IRootState } from "app/shared/reducers";
import { getEventOccurenceLabel, getEventOccurenceStrDateValue } from "app/shared/util/date-utils";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '28%',
        maxWidth: '30%',
        [theme.breakpoints.down("sm")]:{
            minWidth: '50%',
            maxWidth: '60%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 0,
        paddingBottom:0,
    },
    cardcontent:{
      background: 'white',
      minHeight: '20vh',
      maxHeight: '80vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
    field:{
        borderRadius: 5,
        paddingLeft:7,
        paddingRight:7,
        fontSize: 15,
        '&:hover':{
            background: theme.palette.grey[200],
        },
        '&:focus':{
            background: theme.palette.grey[200],
        }
    },
    icon:{
        color: theme.palette.grey[500],
    },
}))

interface AuditEventTriggerUpdateProps extends StateProps, DispatchProps{
    entity: IAuditEventTrigger,
    open?: boolean,
    onSave?:Function,
    onClose:Function,
}

export const AuditEventTriggerUpdate = (props: AuditEventTriggerUpdateProps) =>{
    const { open} = props;
    const [entity, setEntity] = useState(props.entity);
    const [isNew, setIsNew] = useState(!props.entity || !props.entity.id)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const [formSubmited, setFomSubmited] = useState(false);

    const classes = useStyles();

    const formateStartDate = () =>{
        if(entity && entity.nextStartAt){
            const date = new Date(entity.nextStartAt);
            setDateTime(date);
        }
    }

    useEffect(() =>{
        setEntity(props.entity);
        setIsNew(!props.entity || !props.entity.id)
        formateStartDate();
    }, [props.entity])


    const handleClose = () => props.onClose();

    const formIsValid = entity && entity.name && entity.audit && entity.nextStartAt;

    const handleSubmit = (event) =>{
        event.preventDefault();
        setError(false);
        if(formIsValid){
            setFomSubmited(false);
            setLoading(true);
            const req = isNew ? axios.post<IAuditEventTrigger>(API_URIS.auditEventTriggerApiUri, cleanEntity(entity))
                            : axios.put<IAuditEventTrigger>(`${API_URIS.auditEventTriggerApiUri}`, cleanEntity(entity));
            req.then(res =>{
                if(res.data){
                    setEntity(res.data);
                    if(props.onSave)
                        props.onSave(res.data, isNew)
                }else{
                    setError(true);
                }
            }).catch(e => {
                console.log(e)
                setError(true);
            })
            .finally(() => {
                setFomSubmited(true);
                setLoading(false)
            })
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEntity({...entity, [name]: value});
    }

    const haandleChangeDateTime = (newDate: Date) =>{
        setDateTime(newDate);
        if(newDate){
            setEntity({
                ...entity,
                nextStartAt: newDate.toISOString(),
            })
        }
    }

    return (
        <React.Fragment>
        <MyToast 
            open={formSubmited && !loading && error}
            message={translate(`_global.flash.message.failed`)}
            snackBarProps={{
                autoHideDuration:200,
            }}
            alertProps={{
                color: 'error',
                onClose: () => setFomSubmited(false),
            }}
        />
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
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={translate("microgatewayApp.microprocessEventTrigger.home.createOrEditLabel")}
                            action={
                                props.onClose ?(
                                    <IconButton 
                                        color="inherit"
                                        onClick={handleClose}>
                                        <Close />
                                    </IconButton>
                                ): ''
                            }
                            titleTypographyProps={{ variant: 'h4'}}
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>{/*  form body colum */}
                                    {/* <AgendaEventForm aEvent={aEvent} userExtra={userExtra} onSave={onSave}/> */}
                                    {loading && <Box width={1} mt={1} mb={3} display="flex" 
                                            justifyContent="center" alignItems="center" flexWrap="wrap">
                                        <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                        <Typography className="ml-2" color="secondary">Loading...</Typography>    
                                    </Box>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        value={entity.name}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        label={entity.name ? translate("_global.instance.folder") : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder={translate("_global.instance.folder")}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyItems="center"
                                        justifyContent="center" alignItems="center" flexWrap="wrap">
                                        <Box>
                                             <AccessTime className={classes.icon}/>
                                        </Box>
                                        <DatePicker
                                            name="firstStartedAt"
                                            value={dateTime}
                                            autoOk
                                            onChange={haandleChangeDateTime}
                                            variant="inline"
                                            inputProps={{
                                                className: classes.field,
                                            }}
                                            InputProps={{
                                                value: getEventOccurenceStrDateValue(dateTime, entity.recurrence),
                                                disableUnderline: true,
                                            }}
                                            placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.startAt")}`}
                                        />
                                        <Select 
                                            name="recurrence"
                                            value={entity.recurrence}
                                            inputProps={{
                                                className: classes.field,
                                            }}
                                            disableUnderline
                                            onChange={handleChange}>
                                            <MenuItem value={AuditEventRecurrence.ONCE}>
                                                {getEventOccurenceLabel(null,ProcessEventRecurrence.ONCE)}
                                            </MenuItem>
                                            <MenuItem value={AuditEventRecurrence.ALLAWAYS}>
                                                {getEventOccurenceLabel(null,ProcessEventRecurrence.ALLAWAYS)}
                                            </MenuItem>
                                            <MenuItem value={AuditEventRecurrence.EVERY_WEEK_ON_DAY}>
                                               {getEventOccurenceLabel(dateTime, EventRecurrence.EVERY_WEEK_ON_DAY)}
                                            </MenuItem>
                                            <MenuItem value={AuditEventRecurrence.EVERY_MONTH}>
                                                {getEventOccurenceLabel(dateTime,ProcessEventRecurrence.EVERY_MONTH)}
                                            </MenuItem>
                                            <MenuItem value={AuditEventRecurrence.EVERY_YEAR_ON_DATE}>
                                                {getEventOccurenceLabel(dateTime, EventRecurrence.EVERY_YEAR_ON_DATE)}
                                            </MenuItem>
                                            {/* <MenuItem value={AuditEventRecurrence.WEEK}>
                                                {translate("microgatewayApp.EventRecurrence."+ProcessEventRecurrence.WEEK.toString())}
                                            </MenuItem>
                                            <MenuItem value={AuditEventRecurrence.EVERY_MONTH_OF_DAY_POSITION}>
                                                {getEventOccurenceLabel(dateTime, EventRecurrence.EVERY_MONTH_OF_DAY_POSITION)}
                                            </MenuItem> */}
                                        </Select>
                                    </Box>
                                </Grid>
                                {/* submit  row */}
                                <Grid item xs={12}>
                                    <Box width={1} textAlign="right">
                                        <Button type="submit" variant="text" color="primary"
                                            className="text-capitalize" disabled={!formIsValid}>
                                            {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                          </form>
                        </CardContent>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}
const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});
  
  const mapDispatchToProps = { };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(AuditEventTriggerUpdate);
