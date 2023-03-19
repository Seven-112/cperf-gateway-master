import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, Grow, IconButton, List, ListItem, ListItemText, makeStyles, Modal, Tooltip, Typography } from "@material-ui/core";
import { Close, Delete, Edit, FileCopy, PeopleAlt, Room, Sort, Visibility } from "@material-ui/icons";
import ModalFileManager from "app/shared/component/modal-file-manager";
import TextContentManager from "app/shared/component/text-content-manager";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import { IEventFile } from "app/shared/model/microagenda/event-file.model";
import { IEventParticipant } from "app/shared/model/microagenda/event-participant.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getEventRecurrence, getUserExtraFullName } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '20%',
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
        paddingBottom:0,
    },
    cardcontent:{
      paddingTop: 0,
      paddingBottom:0,
      background: 'white',
      minHeight: '30vh',
      maxHeight: '80vh',
      overflow: 'auto',
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
    patiantListItem:{
        paddingTop:0,
        paddingBottom:0,
        borderRadius:6,
    },
    listTextPrimary:{
        fontSize:13,
    },
}))

interface AgendaEventDetailProps{
    agendaEvent: IAgendaEvent,
    date: Date,
    open?: boolean,
    userExtra: IUserExtra,
    onClose:Function,
    handleUpdate?:Function,
    handleDelete?:Function,
}

export const AgendaEventDetail = (props: AgendaEventDetailProps) =>{
    const { open, date} = props;
    const [aEvent, setAEvent] = useState(props.agendaEvent);
    const [userExtra, setUserExtra] = useState(props.userExtra);
    const [openDescription, setOpenDescription] = useState(false);
    const [partipants, setParticipants] = useState<IEventParticipant[]>([]);
    const [files, setFiles] = useState<IEventFile[]>([]);
    const [openFiles, setOpenFiles] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const classes = useStyles();

    const initializeDates = () =>{
        if(props.agendaEvent){
            if(date){
                setStartDate(date);
            }else{
                if(props.agendaEvent && props.agendaEvent.startAt){
                    setStartDate(new Date(props.agendaEvent.startAt));
                    if(props.agendaEvent && props.agendaEvent.endAt)
                        setEndDate(new Date(props.agendaEvent.endAt))
                    else
                        setEndDate(new Date(props.agendaEvent.startAt));
                }
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

    useEffect(() =>{
        setUserExtra(props.userExtra)
    }, [props.userExtra])

    useEffect(() =>{
        setAEvent(props.agendaEvent);
        initializeDates();
        getParticipants();
        getFiles();
    }, [props.agendaEvent])


    const handleClose = () => props.onClose();
    
    const formateTime = (hour: number, minute: number) =>{
        const m = minute<10 ? '0'+minute: minute;
        return `${hour}h:${m}`;
    }

    const canEditOrDelete = aEvent && userExtra && userExtra.user && aEvent.editorEmail === userExtra.user.email;

    const handleUpdate = () =>{
        if(canEditOrDelete && props.handleUpdate)
            props.handleUpdate(aEvent);
    }
    
    const handleDelete = () =>{
        if(canEditOrDelete && props.handleDelete)
            props.handleDelete(aEvent);
    }

    return (
        <React.Fragment>
        {aEvent && <>
        <TextContentManager 
            value={aEvent.description}
            title={translate("microgatewayApp.microagendaAgendaEvent.description")}
            readonly
            open={openDescription}
            onClose={() => setOpenDescription(false)}
            onSave={(value) => {
                setAEvent({...aEvent, description: value})
                setOpenDescription(false)
            }}
        />
         <ModalFileManager 
            open={openFiles}
            title={translate("_global.label.files")}
            entityId={aEvent.id}
            entityTagName={FileEntityTag.agendaEvent}
            readonly
            files={[...files]}
            selectMultiple
            onClose={()=> setOpenFiles(false)}
         />
        </>} 
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
                <Grow
                    in={open}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(open ? { timeout: 100 } : {})}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            action={
                                <Box display="flex" alignItems="center" p={0} m={0}>
                                    {canEditOrDelete && <>
                                        <Tooltip
                                            title={translate("entity.action.edit")}
                                            onClick={handleUpdate}>
                                            <IconButton 
                                                color="inherit"
                                                >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            title={translate("entity.action.delete")}
                                            onClick={handleDelete}>
                                            <IconButton 
                                                color="inherit"
                                                >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </>}
                                    {props.onClose && 
                                        <IconButton 
                                            color="inherit"
                                            onClick={handleClose}>
                                            <Close />
                                        </IconButton>
                                    }
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                        {loading && <Box width={1} mt={1} mb={3} display="flex" 
                                            justifyContent="center" alignItems="center" flexWrap="wrap">
                                        <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                        <Typography className="ml-2" color="secondary">Loading...</Typography>    
                                    </Box>}
                            <List>
                                <ListItem className="w-100">
                                    <ListItemText 
                                        primary={
                                            <Box display="flex" width={1} flexWrap="wrap" alignItems="center">
                                                <Box width={15} height={15} boxShadow={1} mr={3} bgcolor="#0277bd"></Box>
                                                <Typography variant="h3">{aEvent.title}</Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box display="flex" flexWrap="wrap">
                                                <Typography variant="caption">
                                                    {startDate ? `${translate("_calendar.day."+startDate.getDay())}, ${startDate.getDate()} ${translate("_calendar.month."+startDate.getMonth())} ${startDate.getFullYear()} ` : ''}
                                                    {` ${translate("_global.label.of")} ${formateTime(startDate.getHours(), startDate.getMinutes())} ${translate("_global.label.to")} ${formateTime(endDate.getHours(), endDate.getMinutes())}`}
                                                    <br/>{getEventRecurrence(aEvent)}
                                                </Typography>
                                            </Box>
                                        }
                                        classes={{
                                            secondary: 'ml-5'
                                        }}
                                    />
                                </ListItem>
                                {aEvent.location && 
                                    <ListItem className="w-100">
                                        <ListItemText 
                                            primary={
                                                <Box display="flex" width={1} flexWrap="wrap">
                                                    <Room className={`${classes.icon} mr-3`}/>
                                                    <Typography>{aEvent.location}</Typography>
                                                </Box>
                                            }
                                            classes={{
                                                secondary: 'ml-5'
                                            }}
                                        />
                                    </ListItem>
                                }
                                {aEvent.description && 
                                    <ListItem className="w-100">
                                        <ListItemText 
                                            primary={
                                                <Box display="flex" width={1} flexWrap="wrap" alignItems="center">
                                                    <Sort className={`${classes.icon} mr-3`}/>
                                                    <Typography>{translate("microgatewayApp.microagendaAgendaEvent.description")}</Typography>
                                                    <Tooltip
                                                        title={translate("entity.action.view")}
                                                        onClick={() => setOpenDescription(true)}
                                                        className="ml-3">
                                                        <IconButton className="p-0" color="primary"><Visibility /></IconButton>
                                                    </Tooltip>
                                                </Box>
                                            }
                                            classes={{
                                                secondary: 'ml-5'
                                            }}
                                        />
                                    </ListItem>
                                }
                                <ListItem className="w-100">
                                    <ListItemText 
                                        primary={
                                            <Box display="flex" width={1} flexWrap="wrap" alignItems="center">
                                                <PeopleAlt className={`${classes.icon} mr-3`}/>
                                                <Typography>{`${[...partipants].length +1} ${translate("microgatewayApp.microagendaEventParticipant.home.title")}`}</Typography>
                                            </Box>
                                        }
                                        secondary={
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
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        }
                                        classes={{
                                            secondary: 'ml-5'
                                        }}
                                    />
                                </ListItem>
                                {[...files].length !==0 && 
                                    <ListItem className="w-100">
                                        <ListItemText 
                                            primary={
                                                <Box display="flex" width={1} flexWrap="wrap" alignItems="center">
                                                    <FileCopy className={`${classes.icon} mr-3`}/>
                                                    <Typography>{translate("_global.label.files")}</Typography>
                                                    <Tooltip
                                                        title={translate("entity.action.view")}
                                                        onClick={() => setOpenFiles(true)}
                                                        className="ml-3">
                                                        <IconButton className="p-0" color="primary"><Visibility /></IconButton>
                                                    </Tooltip>
                                                </Box>
                                            }
                                            classes={{
                                                secondary: 'ml-5'
                                            }}
                                        />
                                    </ListItem>
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grow>
            </Modal>
        </React.Fragment>
    )
}
  
export default AgendaEventDetail;
