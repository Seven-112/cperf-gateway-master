import { EventRecurrence } from "app/shared/model/enumerations/event-recurrence.model";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import EventEditModeChooser from "./partial/event-edit-mode-chooser";

interface AgendaEventDeleteProps{
    entity: IAgendaEvent,
    date: Date,
    hour: number,
    open?: boolean,
    onDelete?:Function,
    onClose:Function,
    handleUpdate?:Function,
}

export const AgendaEventDelete = (props: AgendaEventDeleteProps) =>{
    const { open, date, hour, entity} = props;
    const [loading, setLoading] = useState(false);

    const handleClose = () => props.onClose();

    const handleOk = (onceDeleteMode?: boolean) =>{
        setLoading(false);
        let apiUri = `${API_URIS.agendaEventApiUri}/disable/`;
        apiUri = `${apiUri}?instant=${date.toISOString()}&hour=${hour}&single=${onceDeleteMode}`;
        axios.put(apiUri, cleanEntity(entity))
        .then(() =>{
            if(props.onDelete)
                props.onDelete();
            else
                props.onClose();
        }).catch(e => console.log(e))
        .finally(() =>{
            setLoading(false)
        })
    }

    const isPeriodiqueEvent = entity && entity.recurrence && entity.recurrence !== EventRecurrence.ONCE;

    return (
        <React.Fragment>
            <EventEditModeChooser 
                title={translate(`_calendar.label.delete.${isPeriodiqueEvent ? 'pTitle' :'title'}`)}
                open={open}
                loading={loading}
                isPeriodiqueEvent={isPeriodiqueEvent}
                onClose={handleClose}
                onConfirm={handleOk}
            />
        </React.Fragment>
    )
}
  
export default AgendaEventDelete;
