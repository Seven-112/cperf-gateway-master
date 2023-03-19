import { Box } from "@material-ui/core";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import React, { useEffect, useState } from "react";
import AgendaEventUpdate from "./agenda-event-update";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { EventRecurrence } from "app/shared/model/enumerations/event-recurrence.model";
import EventWedget from "./partial/event-widget";
import { calanderCellHeight } from "./user-calener";
import { Skeleton } from "@material-ui/lab";
import { API_URIS } from "app/shared/util/helpers";
import axios from "axios";
import AgendaEventDetail from "./agenda-event-detail";
import AgendaEventDelete from "./agenda-event-delete";

interface DateCalendarItemProps{
    hour: number,
    date: Date,
    loading?: boolean,
    userExtra: IUserExtra,
    onSave?:Function,
    onDelete?: Function,
}

export const DateCalendarItem = (props: DateCalendarItemProps) =>{
    const { date,hour, userExtra } = props
    const [events, setEvents] = useState<IAgendaEvent[]>([]);
    const [activeEvent, setActiveEvent] = useState<IAgendaEvent>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false)
    const [openDelete, setOpenDelete] = useState(false);

    const getEvents = () =>{
        if(date && hour && userExtra && userExtra.user){
            setLoading(true)
            const dte = new Date(date.toISOString());
            dte.setHours(hour);
            let apiUri = `${API_URIS.agendaEventApiUri}/byUserEmailAndDateAndValid/`;
            apiUri = `${apiUri}?email=${userExtra.user.email}`;
            apiUri = `${apiUri}&date=${dte.toISOString()}`;
            axios.get<IAgendaEvent[]>(apiUri)
                .then(res =>{
                    setEvents([...res.data])
                }).catch(e => console.log(e))
                .finally(() =>setLoading(false))
        }
    }

    useEffect(() =>{
        getEvents();
    }, [props.loading, props.userExtra])

    const handleUpdate = (aEvent?: IAgendaEvent) =>{
        if(aEvent){
            if(date){
                const startAt = new Date(aEvent.endAt);
                startAt.setDate(date.getDate())
                startAt.setMonth(date.getMonth())
                startAt.setFullYear(date.getFullYear())

                const endAt = new Date(aEvent.endAt);
                endAt.setDate(date.getDate())
                endAt.setMonth(date.getMonth())
                endAt.setFullYear(date.getFullYear());
                setActiveEvent({...aEvent, startAt: startAt.toISOString(), endAt: endAt.toISOString()})
            }else{
                setActiveEvent(aEvent);
            }
        }else{
            const eventDate = date ? new Date(date.getTime()) : new Date();
            if(hour)
                eventDate.setHours(hour);
            setActiveEvent({startAt: eventDate.toISOString(), recurrence: EventRecurrence.ONCE});
        }
        setOpen(true);
    }

    const handleDelete = (aEvent?: IAgendaEvent) =>{
        if(aEvent){
            setActiveEvent(aEvent);
            setOpenDelete(true)
        }
    }

    const handleOpenDetail = (aEvent?: IAgendaEvent) =>{
        if(aEvent){
            setActiveEvent(aEvent);
            setOpen(false);
            setOpenDetail(true);
        }
    }

    const onSave = (ev: IAgendaEvent, isNew?: boolean) =>{
        if(ev){
            if(isNew){
                setEvents([...events, ev])
            }else{
                setEvents([...events].map(item => item.id === ev.id ? ev : item));
            }
            setOpen(false);
            if(props.onSave)
                props.onSave(ev, isNew);
        }
    }

    const handleOpenUpdateWithMinute = (minute: number) =>{
        const d1 = date ? new Date(date.getTime()) : new Date();
        const d2 = date ? new Date(date.getTime()) : new Date();
        if(hour){
            d1.setHours(hour, minute);
            d2.setHours(hour, minute +30);
        }else{
            d1.setMinutes(minute);
            d2.setMinutes(minute +30);
        }

        const ev: IAgendaEvent = {
            startAt: d1.toISOString(),
            endAt: d2.toISOString(),
            recurrence: EventRecurrence.ONCE,
        }

        setActiveEvent(ev);
        setOpen(true);
    }

    const handleClose = () =>{
        setOpen(false);
    }

    const handleCloseDetail = () =>{
        setOpenDetail(false)
    }

    const onDelete = () =>{
        setOpenDelete(false);
        setOpenDetail(false);
        if(props.onDelete)
            props.onDelete();
    }

    return (
        <React.Fragment>
            {activeEvent && <>
                <AgendaEventDetail 
                    open={openDetail}
                    agendaEvent={activeEvent}
                    date={date}
                    userExtra={userExtra}
                    onClose={handleCloseDetail}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                />
                <AgendaEventUpdate 
                    open={open}
                    agendaEvent={activeEvent}
                    userExtra={userExtra}
                    onClose={handleClose}
                    onSave={onSave}
                />
                <AgendaEventDelete 
                    open={openDelete}
                    entity={activeEvent}
                    date={date}
                    hour={hour}
                    onClose={() =>{ setOpenDelete(false)}}
                    onDelete={onDelete}
                />
            </>}
            {loading ? (
                    <Skeleton 
                        animation="wave"
                        width={'95%'}
                        height={calanderCellHeight}
                        style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexWrap:"wrap",
                        justifyContent:"center",
                        alignItems:"center",
                        background: '#ffffff'
                        }}>
                        loading...
                    </Skeleton>
                ) : (
                <>
                    {events && events.length !== 0 ? <>
                        {events.map((ev, index) =>(
                            <EventWedget key={index} agendaEvent={ev} onClick={handleOpenDetail} />
                        ))}
                    </> : (
                        <Box 
                            width={1}
                            m={0}
                            display="flex"
                            flexWrap="wrap"
                            justifyContent="center"
                            alignItems="center"
                            height={calanderCellHeight}>
                                <Box width={1} m={0} height={calanderCellHeight/3}
                                onClick={() =>{handleOpenUpdateWithMinute(0)}}></Box>
                                <Box width={1} m={0} height={calanderCellHeight/3}
                                onClick={() =>{handleOpenUpdateWithMinute(15)}}></Box>
                                <Box width={1} height={calanderCellHeight/3}
                                    onClick={() =>{handleOpenUpdateWithMinute(30)}}></Box>
                        </Box>
                    )}
                </>
            )}
        </React.Fragment>
    )
}

export default DateCalendarItem;