import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, Collapse, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Modal, Select, Slide, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import { AccessTime, Close, FileCopy, FileCopyRounded, GroupAdd, PeopleAlt, PeopleOutline, Remove, Room, Save, Sort } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { DatePicker } from "@material-ui/pickers";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import ModalFileManager from "app/shared/component/modal-file-manager";
import MyToast from "app/shared/component/my-toast";
import TextContentManager from "app/shared/component/text-content-manager";
import { EventRecurrence } from "app/shared/model/enumerations/event-recurrence.model";
import { EventReminderUnity } from "app/shared/model/enumerations/event-reminder-unity.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import { IEventFile } from "app/shared/model/microagenda/event-file.model";
import { IEventParticipant } from "app/shared/model/microagenda/event-participant.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { IRootState } from "app/shared/reducers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS, getUserExtraFullName } from "app/shared/util/helpers";
import { formateTimeZoneName, TIME_ZONES } from "app/shared/util/time-zone";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import ExternalParticipantEdit from "../../event-participant/custom/external-participant-edit";
import EventEditModeChooser from "./partial/event-edit-mode-chooser";
import HourMenu from "./partial/hour-menu";

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
        background: theme.palette.grey[300],
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 0,
        paddingBottom:0,
    },
    cardcontent:{
      background: 'white',
      minHeight: '50vh',
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
    hourMenu:{
        height:300,
        marginTop: theme.spacing(5),
        borderRadius: 6,
        padding: '4px 0',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '&::-webkit-scrollbar': {
          width: '0.7em',
        },
        '&::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px white',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[200], // 'rgba(0,0,0,.1)',
          outline: '1px solid #e1f5fe',
        },
        '&:hover':{
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[400], // 'rgba(0,0,0,.1)',
              outline: '1px solid #e1f5fe',
            }
        }
    },
    timeZoneBtn:{
        background: theme.palette.grey[100],
        boxShadow: 'none',
        '&:hover':{
            background: theme.palette.grey[200],
            boxShadow: 'none',
        },

    },
    patiantListItem:{
        paddingTop:0,
        paddingBottom:0,
        borderRadius:6,
    },
    listTextPrimary:{
        fontSize:13,
    },
    userBox:{
    }
}))

interface AgendaEventUpdateProps extends StateProps, DispatchProps{
    agendaEvent: IAgendaEvent,
    open?: boolean,
    userExtra: IUserExtra,
    onSave?:Function,
    onClose:Function,
}

export const AgendaEventUpdate = (props: AgendaEventUpdateProps) =>{
    const { open} = props;
    const [aEvent, setAEvent] = useState(props.agendaEvent);
    const [userExtra, setUserExtra] = useState(props.userExtra);
    const [isNew, setIsNew] = useState(!props.agendaEvent || !props.agendaEvent.id)
    const [fullDay, setFullDay] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startTimeAnchored, setStartTimeAnchored] = useState(true);
    const [openDescription, setOpenDescription] = useState(false);
    const [partipants, setParticipants] = useState<IEventParticipant[]>([]);
    const [files, setFiles] = useState<IEventFile[]>([]);
    const [openFiles, setOpenFiles] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openUserFinder,setOpenUserFinder] = useState(false);
    const [openExternalUserEditor, setOpenExternalUserEditor] = useState(false);
    const [error, setError] = useState(false);
    const [formSubmited, setFomSubmited] = useState(false);
    const [readonly, setReadonly] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openModeChooser, setOpenModeChooser] = useState(false);
    const [oldRecurence, setOldRecurence] = useState(props.agendaEvent ? props.agendaEvent.recurrence : EventRecurrence.ONCE);

    const classes = useStyles();

    const initializeDates = () =>{
        if(props.agendaEvent){
            if(props.agendaEvent && props.agendaEvent.startAt){
                setStartDate(new Date(props.agendaEvent.startAt));
                if(props.agendaEvent && props.agendaEvent.endAt)
                    setEndDate(new Date(props.agendaEvent.endAt))
                else
                    setEndDate(new Date(props.agendaEvent.startAt));
            }
        }
    }

    const getParticipants = (eventId?:any) =>{
        const id = eventId ? eventId : aEvent && aEvent.id ? aEvent.id : null;
        if(id){
            setLoading(true)
            axios.get<IEventParticipant[]>(`${API_URIS.eventParticipantApiUri}/?eventId.equals=${id}`)
                .then(res => {
                    setParticipants([...res.data])
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const getFiles = (eventId?:any) =>{
        const id = eventId ? eventId : aEvent && aEvent.id ? aEvent.id : null;
        if(id){
            setLoading(true)
            axios.get<IEventFile[]>(`${API_URIS.eventFileApiUri}/?eventId.equals=${id}`)
                .then(res => {
                    setFiles([...res.data])
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const normalizeDate = (startHour?: number, startMinutes?: number, endHour?: number, endMinutes?: number) =>{
        if(!fullDay){
            let d1 = aEvent && aEvent.startAt ? moment(aEvent.startAt) : moment();
            let d2 = aEvent && aEvent.endAt ? moment(aEvent.endAt) : moment().add(30,'m');
            if(startHour || startHour === 0)
                d1.set('h', startHour)
            if(startMinutes || startMinutes === 0)
                d1.set('m',startMinutes)
            if(endHour || endHour === 0)
                d2.set('h', endHour)
            if(endMinutes || endMinutes === 0)
                d2.set('m', endMinutes)
            if(d1.isSame(d2))
                d2.add(30, 'm');
            if(d1.isAfter(d2))
                [d1,d2] = [d2,d1];
            setAEvent({...aEvent, startAt: d1.toISOString(), endAt: d2.toISOString()});
        }
    }

    useEffect(() =>{
        setUserExtra(props.userExtra)
    }, [props.userExtra])

    useEffect(() =>{
        setAEvent(props.agendaEvent);
        setIsNew(!props.agendaEvent || !props.agendaEvent.id)
        setOldRecurence(props.agendaEvent ? props.agendaEvent.recurrence : EventRecurrence.ONCE);
        initializeDates();
        getParticipants();
        getFiles();
    }, [props.agendaEvent])


    const handleClose = () => props.onClose();
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setAEvent({...aEvent, [name]:value});
    }

    const handleChangeStratDate = (newDate: Date) =>{
        setAEvent({...aEvent, startAt: newDate.toISOString()})
    }
    
    const formateTime = (hour: number, minute: number) =>{
        const m = minute<10 ? '0'+minute: minute;
        return `${hour}h:${m}`;
    }
    

    const handleMenuBlur = () =>{
        setAnchorEl(null);
    }

    const handleSelectTime = (hour: number, minute: number) =>{
        const date = startTimeAnchored ? startDate : endDate;
        date.setHours(hour);
        date.setMinutes(minute);
        if(startTimeAnchored)
            normalizeDate(hour, minute)
        else
            normalizeDate(null, null, hour, minute) 
        setAnchorEl(null);
    }

    const unSelectPartiticipant = (p?: IEventParticipant) =>{
        if(p){
            if(p.id){
                setLoading(false)
                axios.delete<IEventParticipant>(`${API_URIS.eventParticipantApiUri}/${p.id}`)
                    .then(res =>{
                        setParticipants([...partipants].filter(pt => pt.id !== p.id))
                    }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
            }else{
                setParticipants([...partipants].filter(pt => pt.participantId !== p.id && pt.email !== p.email));
            }
        }
    }

    const handleUserSelecteChange = (selected?: IUserExtra, isSelectOp?: boolean) =>{
        if(selected && selected.user && selected.user.email){
            if(isSelectOp){
                setParticipants([...partipants, 
                    {
                        email: selected.user.email,
                        participantId: selected.id,
                        name: getUserExtraFullName(selected),
                        required: true,
                        event: aEvent,
                    }
                ])
            }else{
                const p = [...partipants].find(pt => pt.participantId === selected.id);
                unSelectPartiticipant(p);
            }
        }
    }

    const onExternalPatiantEdited = (pat?: IEventParticipant) =>{
        if(pat && pat.email){
            if(![...partipants].some(p => p.email === pat.email)){
                const patient: IEventParticipant = {
                    email: pat.email,
                    name: pat.name,
                    event: aEvent,
                    required: false,
                }
                setParticipants([...partipants, patient]);
            }
            setOpenExternalUserEditor(false)
        }
    }

    const handleSubmitFiles = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            const newFiles = saved.map(f =>{
                const eF: IEventFile={
                    fileId: f.id,
                    fileName: f.name,
                    event: aEvent,
                }
                return eF;
            })

            setFiles([...files, ...newFiles]);
        }
    }

    const handleRemoveFile = (id) =>{
        if(id){
            const fileToRemove = [...files].find(f => f.fileId === id);
            if(fileToRemove){
                if(fileToRemove.id){
                    axios.delete(`${API_URIS.eventFileApiUri}/${fileToRemove.id}`)
                        .then(() =>{
                            setFiles([...files].filter(f => f.id !== fileToRemove.id && f.fileId !== id))
                        }).catch(e => console.log(e))
                }else{
                    setFiles([...files].filter(f => f.fileId !== id)) 
                }
            }
        }
    }

    const saveUnsavedEventFiles = (ev: IAgendaEvent) =>{
        if(ev && ev.id){
            setLoading(true)
            const unsaved = [...files].filter(f => !f.id);
            if(unsaved && unsaved.length !== 0){
                unsaved.map((ef, index) =>{
                    const eFile: IEventFile={
                        ...ef,
                        event: ev,
                    }
                    axios.post<IEventFile>(API_URIS.eventFileApiUri, cleanEntity(eFile))
                        .then(() =>{})
                        .catch(e => {
                            setLoading(false);
                            setError(false);
                        })
                        .finally(() => {
                            if(index === unsaved.length-1){
                                getParticipants(ev.id);
                                getFiles(ev.id);
                                setLoading(false);
                                if(props.onSave)
                                    props.onSave(ev, isNew);
                            }
                        })
                    })
            }else{
                getParticipants(ev.id);
                setLoading(false);
                if(props.onSave)
                    props.onSave(ev, isNew);
            }
        }else{
            setLoading(false)
        }
    }

    const saveUnsavedParticipants = (ev: IAgendaEvent) =>{
        if(ev && ev.id){
            setLoading(true)
            const unsaved = [...partipants].filter(p => !p.id);
            if(unsaved && unsaved.length !==0){
                unsaved.map((p, index) =>{
                    const part: IEventParticipant={
                        ...p,
                        event: ev,
                    }
                    axios.post<IEventParticipant>(API_URIS.eventParticipantApiUri, cleanEntity(part))
                        .then(() =>{ }).catch(e => {
                            console.log(e)
                            saveUnsavedEventFiles(ev);
                        })
                        .finally(() => {
                            if(index === unsaved.length-1){
                                saveUnsavedEventFiles(ev);
                            }
                        })
                    })
            }else{
                saveUnsavedEventFiles(ev);
            }
        }else{
            setLoading(false)
        }
    }

    const saveEvent = (singleUpdateMode?:boolean) =>{
        setFomSubmited(false);
        setLoading(true);
        const startAt = new Date(aEvent.startAt);
        const endAt = aEvent.endAt ? new Date(aEvent.endAt) : startAt;
        if(fullDay){
            startAt.setHours(0)
            startAt.setMinutes(0)
            startAt.setSeconds(0);
            endAt.setHours(23)
            endAt.setMinutes(59);
            endAt.setSeconds(59);
        }
        const entity: IAgendaEvent = {
            ...aEvent,
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            recurrence: aEvent.recurrence ? aEvent.recurrence : EventRecurrence.ONCE,
            createdAt: aEvent.createdAt ? aEvent.createdAt : new Date().toISOString(),
            editorId: aEvent.editorId ? aEvent.editorId : userExtra.id,
            editorEmail: aEvent.editorEmail ? aEvent.editorEmail : userExtra.user.email,
            editorName: aEvent.editorName ? aEvent.editorName : getUserExtraFullName(userExtra),
            langKey: props.currentLocale,
        }
        
        const req = isNew ? axios.post<IAgendaEvent>(API_URIS.agendaEventApiUri, cleanEntity(entity))
            : axios.put<IAgendaEvent>(`${API_URIS.agendaEventApiUri}/update/?single=${singleUpdateMode}`, cleanEntity(entity))
        req.then(res =>{
            if(res.data){
                setAEvent(res.data);
                saveUnsavedParticipants(res.data);
            }else{
                setError(true);
            }
        }).catch(e => {
            console.log(e)
            setError(true);
            setLoading(false);
        })
        .finally(() => {
            setFomSubmited(true);
        })
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        setError(false);
        if(aEvent && aEvent.title && aEvent.startAt && userExtra){
            if(!isNew && oldRecurence && oldRecurence !== EventRecurrence.ONCE)
                setOpenModeChooser(true);
            else
                saveEvent(true);
        }
    }

    const onConfirm = (mode?: boolean) =>{
        saveEvent(mode);
        setOpenModeChooser(false);
    }

    const dayName = startDate ? translate("_calendar.day."+startDate.getDay()) : '';
    const dateAndMonthName = startDate ? `${startDate.getDate()} ${translate("_calendar.month."+startDate.getMonth())}` : '';

    return (
        <React.Fragment>
        {aEvent && <>
        <EventEditModeChooser 
            title={translate(`_calendar.label.update`)}
            open={openModeChooser}
            isPeriodiqueEvent={true}
            onClose={() => setOpenModeChooser(false)}
            onConfirm={onConfirm}
        />
        <TextContentManager 
            value={aEvent.description}
            title={translate("microgatewayApp.microagendaAgendaEvent.description")}
            readonly={readonly}
            open={openDescription}
            onClose={() => setOpenDescription(false)}
            onSave={(value) => {
                setAEvent({...aEvent, description: value})
                setOpenDescription(false)
            }}
        />
        <UserExtraFinder2 
            open={openUserFinder}
            multiple
            onClose={() => setOpenUserFinder(false)}
            unSelectableIds={[...partipants].filter(p => p.participantId).map(p => p.id)}
            onSelectChange={handleUserSelecteChange}
        />
        <ExternalParticipantEdit
            open={openExternalUserEditor}
            onClose={() => setOpenExternalUserEditor(false)}
            onSave={onExternalPatiantEdited}
         />
         <ModalFileManager 
            open={openFiles}
            title={translate("_global.label.files")}
            readonly={readonly}
            files={[...files]}
            selectMultiple
            entityId={aEvent.id}
            entityTagName={FileEntityTag.agendaEvent}
            onClose={()=> setOpenFiles(false)}
            onSave={handleSubmitFiles}
            onRemove={handleRemoveFile}
         />
        </>} 
        <HourMenu anchorEl={anchorEl}
            selected={formateTime(startDate.getHours(), startDate.getMinutes())}
            onBlur={handleMenuBlur} onSelect={handleSelectTime}
        />

        <MyToast 
            open={formSubmited && !loading}
            message={translate(`_global.flash.message.${error ? 'failed' : 'success'}`)}
            snackBarProps={{
                autoHideDuration:300,
            }}
            alertProps={{
                color: error ? 'error' : 'success',
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
                            action={
                                props.onClose ?(
                                    <IconButton 
                                        color="inherit"
                                        onClick={handleClose}>
                                        <Close />
                                    </IconButton>
                                ): ''
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="title"
                                        value={aEvent.title}
                                        fullWidth
                                        label={aEvent.title ? translate("microgatewayApp.microagendaAgendaEvent.title") : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder={translate("microgatewayApp.microagendaAgendaEvent.title")}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>{/*  form body colum */}
                                    {/* <AgendaEventForm aEvent={aEvent} userExtra={userExtra} onSave={onSave}/> */}
                                    {loading && <Box width={1} mt={1} mb={3} display="flex" 
                                            justifyContent="center" alignItems="center" flexWrap="wrap">
                                        <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                        <Typography className="ml-2" color="secondary">Loading...</Typography>    
                                    </Box>}
                                    <Box width={1} m={0}>
                                        <Grid container spacing={1} alignItems="center">
                                            {/* time row */}
                                            <Grid item xs={1}>
                                                <AccessTime className={classes.icon}/>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <DatePicker 
                                                    fullWidth
                                                    value={startDate}
                                                    onChange={handleChangeStratDate}
                                                    variant="inline"
                                                    disableToolbar
                                                    inputProps={{
                                                        className: classes.field,
                                                    }}
                                                    InputProps={{
                                                        value: startDate ? `${translate("_calendar.day.short."+startDate.getDay())}, ${startDate.getDate()} ${translate("_calendar.month."+startDate.getMonth())} ${startDate.getFullYear()}` : '',
                                                        disableUnderline: true,
                                                    }}
                                                    placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.startAt")}`}
                                                />
                                            </Grid>
                                            {fullDay ? (
                                                <>
                                                    <Grid item xs={1}><Remove /></Grid>
                                                    <Grid item xs={5}>
                                                        <DatePicker 
                                                            fullWidth
                                                            value={startDate}
                                                            onChange={handleChangeStratDate}
                                                            variant="inline"
                                                            disableToolbar
                                                            inputProps={{
                                                                className: classes.field,
                                                            }}
                                                            InputProps={{
                                                                value: startDate ? `${translate("_calendar.day.short."+startDate.getDay())}, ${translate("_calendar.month."+startDate.getMonth())} ${startDate.getFullYear()}` : '',
                                                                disableUnderline: true,
                                                            }}
                                                            placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.endAt")}`}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1} />
                                                </>
                                            ):(
                                                <>
                                                    <Grid item xs={2}>
                                                        <InputBase 
                                                            fullWidth
                                                            value={formateTime(startDate.getHours(), startDate.getMinutes())}
                                                            inputProps={{
                                                                className: classes.field,
                                                            }}
                                                            onClick={(e) =>{
                                                                setStartTimeAnchored(true);
                                                                setAnchorEl(e.currentTarget);
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}><Remove /></Grid>
                                                    <Grid item xs={2}>
                                                        <InputBase 
                                                            fullWidth
                                                            value={formateTime(endDate.getHours(), endDate.getMinutes())}
                                                            inputProps={{
                                                                className: classes.field,
                                                            }}
                                                            onClick={(e) =>{
                                                                setStartTimeAnchored(false);
                                                                setAnchorEl(e.currentTarget);
                                                            }}
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            {/* recurrence and reminder row */}
                                            <Grid item xs={12} justify="center">
                                                {/* recurrence section */}
                                                <Box width={1} m={0} pt={0} pb={0} display="flex"
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                                    <FormControlLabel
                                                        label={translate("_calendar.label.allDay")}
                                                        control={<Checkbox 
                                                            checked={fullDay} 
                                                            color="primary"
                                                            size="small"
                                                            onChange={() => setFullDay(!fullDay)} />}
                                                        className="mt-2"
                                                    />
                                                    <Select name="timeZone"
                                                        value={aEvent.timeZone || ""}
                                                        inputProps={{
                                                            className: classes.field,
                                                        }}
                                                        disableUnderline
                                                        displayEmpty
                                                        classes={{
                                                            icon: 'd-none',
                                                        }}
                                                        onChange={handleChange}>
                                                        <MenuItem value="">{translate("_calendar.label.timeZone")}</MenuItem>
                                                        {TIME_ZONES.map((tz, index) =>(
                                                            <MenuItem key={index} value={tz}>{formateTimeZoneName(tz)}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <Select 
                                                        name="recurrence"
                                                        value={aEvent.recurrence}
                                                        inputProps={{
                                                            className: classes.field,
                                                        }}
                                                        disableUnderline
                                                        onChange={handleChange}>
                                                        <MenuItem value={EventRecurrence.ONCE}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.ONCE.toString())}
                                                        </MenuItem>
                                                        <MenuItem value={EventRecurrence.ALLAWAYS}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.ALLAWAYS.toString())}
                                                        </MenuItem>
                                                        {/* <MenuItem value={EventRecurrence.EVERY_MONTH_OF_DAY_POSITION}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.EVERY_MONTH_OF_DAY_POSITION.toString())}
                                                        </MenuItem> */}
                                                        <MenuItem value={EventRecurrence.EVERY_WEEK_ON_DAY}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.EVERY_WEEK_ON_DAY.toString(), {dayName})}
                                                        </MenuItem>
                                                        <MenuItem value={EventRecurrence.EVERY_YEAR_ON_DATE}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.EVERY_YEAR_ON_DATE.toString(), {date: dateAndMonthName})}
                                                        </MenuItem>
                                                        <MenuItem value={EventRecurrence.WEEK}>
                                                            {translate("microgatewayApp.EventRecurrence."+EventRecurrence.WEEK.toString())}
                                                        </MenuItem>
                                                    </Select>
                                                </Box>
                                                {/* reminder section */}
                                                <Box width={1} m={0} pt={0} pb={0} display="flex"
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                                    <Typography className="mr-2">{translate("_calendar.label.reminder")}</Typography>
                                                        <TextField 
                                                            value={aEvent.reminderValue ? aEvent.reminderValue : 0}
                                                            name="reminderValue"
                                                            type="number"
                                                            onChange={handleChange}
                                                            inputProps={{
                                                                className: classes.field,
                                                                style: { width:70, textAlign: "center"}
                                                            }}
                                                            InputProps={{
                                                                disableUnderline: true,
                                                                endAdornment: <InputAdornment position="end">
                                                                    <Select value={aEvent.reminderUnity ? aEvent.reminderUnity.toString() : EventReminderUnity.MINUTE.toString()}
                                                                        name="reminderUnity"
                                                                        onChange={handleChange} 
                                                                        disableUnderline
                                                                        inputProps={{
                                                                            className: classes.field,
                                                                        }}
                                                                        classes={{
                                                                            icon: 'd-none'
                                                                        }}>
                                                                        <MenuItem value={EventReminderUnity.SECOND.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.SECOND")}
                                                                        </MenuItem>
                                                                        <MenuItem value={EventReminderUnity.MINUTE.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.MINUTE")}
                                                                        </MenuItem> 
                                                                        <MenuItem value={EventReminderUnity.HOUR.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.HOUR")}
                                                                        </MenuItem>
                                                                        <MenuItem value={EventReminderUnity.DAY.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.DAY")}
                                                                        </MenuItem>
                                                                        <MenuItem value={EventReminderUnity.WEEK.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.WEEK")}
                                                                        </MenuItem>
                                                                        <MenuItem value={EventReminderUnity.MONTH.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.MONTH")}
                                                                        </MenuItem>
                                                                        <MenuItem value={EventReminderUnity.YEAR.toString()}>
                                                                            {translate("microgatewayApp.EventReminderUnity.YEAR")}
                                                                        </MenuItem>
                                                                    </Select>
                                                                </InputAdornment>
                                                            }}
                                                            placeholder={`${translate("_calendar.label.reminder")}`}
                                                        />
                                                </Box>
                                            </Grid>
                                            {/* loction row */}
                                            <Grid item xs={1}>
                                                <Room className={classes.icon}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <InputBase 
                                                    fullWidth
                                                    value={aEvent.location}
                                                    name="location"
                                                    onChange={handleChange}
                                                    inputProps={{
                                                        className: classes.field,
                                                    }}
                                                    placeholder={`${translate("_global.label.add")} ${translate("_global.label.un")} ${translate("microgatewayApp.microagendaAgendaEvent.location")}`}
                                                />
                                            </Grid>
                                            {/* description row */}
                                            <Grid item xs={1}>
                                                <Sort className={classes.icon}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <InputBase 
                                                    fullWidth
                                                    value={aEvent.description}
                                                    onClick={() => setOpenDescription(true)}
                                                    inputProps={{
                                                        className: classes.field,
                                                    }}
                                                    placeholder={`${translate("_global.label.add")} ${translate("_global.label.une")} ${translate("microgatewayApp.microagendaAgendaEvent.description")}`}
                                                />
                                            </Grid>
                                            {/* participans row */}
                                            <Grid item xs={1}>
                                                <PeopleAlt className={classes.icon}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Box width={1} m={0} pt={0} pb={0} display="flex"
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                                    <Button 
                                                        className={`${classes.timeZoneBtn} text-capitalize mr-3`}
                                                        onClick={() => setOpenUserFinder(true)}
                                                    >
                                                        <GroupAdd className="mr-2"/>
                                                        {translate("_calendar.label.internalParticipants")}
                                                    </Button>
                                                    <Button 
                                                        className={`${classes.timeZoneBtn} text-capitalize mr-3`}
                                                        onClick={() => setOpenExternalUserEditor(true)}
                                                    >
                                                        <PeopleOutline className="mr-2"/>
                                                        {translate("_calendar.label.externalParticipants")}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                            {/* participans list row */}
                                            <Grid item xs={1}/>
                                            <Grid item xs={11}>
                                                    <Box width={1} textAlign="center">
                                                        <Typography variant="caption" color="primary">
                                                            {`${[...partipants].length +1} ${translate("microgatewayApp.microagendaEventParticipant.home.title")}`}
                                                        </Typography>
                                                    </Box>
                                                    <Box width={1}>
                                                        <List>
                                                            {userExtra && 
                                                            <ListItem button className={classes.patiantListItem}>
                                                                <ListItemText 
                                                                    primary={`${getUserExtraFullName(userExtra)} *`}
                                                                    secondary={userExtra.user.email ? userExtra.user.email : ''}
                                                                    classes={{
                                                                        primary: classes.listTextPrimary,
                                                                        secondary: 'ml-1'
                                                                    }}
                                                                />
                                                            </ListItem>
                                                            }
                                                            {[...partipants].map((p, index) =>(
                                                                <ListItem key={index} button className={classes.patiantListItem}>
                                                                    <ListItemText 
                                                                        primary={`${p.name ? p.name : p.email} ${p.required ? '*' : ''}`}
                                                                        secondary={p.name ? p.email : ''}
                                                                        classes={{
                                                                            primary: classes.listTextPrimary,
                                                                            secondary: 'ml-1'
                                                                        }}
                                                                    />
                                                                    <ListItemSecondaryAction>
                                                                        {!readonly && <IconButton size="small" 
                                                                            className="p-0" color="secondary"
                                                                            onClick={() => unSelectPartiticipant(p)}>
                                                                            <FontAwesomeIcon icon={faTimes} size="sm" />
                                                                        </IconButton>}
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                            </Grid>
                                            {/* files row */}
                                            <Grid item xs={1}>
                                                <FileCopy className={classes.icon}/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Box width={1} m={0} pt={0} pb={0} display="flex"
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                                    <Button 
                                                        className={`${classes.timeZoneBtn} text-capitalize mr-3`}
                                                        onClick={() => setOpenFiles(true)}
                                                    >
                                                        <FileCopyRounded className="mr-2"/>
                                                        {`${[...files].length > 0 ? files.length : ''} ${translate("_global.label.files")}`}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                            {/* submit  row */}
                                            {!readonly && <Grid item xs={12}>
                                                <Box width={1} display="flex" flexWrap="wrap" justifyContent="flex-end">
                                                    <Button type="submit" variant="text" color="primary"
                                                        className="text-capitalize" disabled={!aEvent || !aEvent.title || !aEvent.startAt || !userExtra}>
                                                        {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                                    </Button>
                                                </Box>
                                            </Grid>}
                                        </Grid>
                                    </Box>
                                    
                                </Grid>{/*  form body colum */}
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(AgendaEventUpdate);
