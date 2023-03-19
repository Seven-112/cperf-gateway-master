import { Box, BoxProps, makeStyles } from "@material-ui/core";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import { formateDate } from "app/shared/util/date-utils";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { calanderCellHeight } from "../user-calener";

const useStyles = makeStyles(theme =>({
    root:{
        padding:0,
        height: calanderCellHeight,
    },
    event:{
        position: 'absolute',
        width: '100%',
        background: theme.palette.primary.main,
        overflow: 'hidden',
        paddingLeft:7,
        paddingRight:7,
        cursor: 'pointer',
        color: 'white',
        borderRadius: 5,
        fontSize: 13,
        '&:hover':{
            background: theme.palette.primary.dark,
        }
    },
    title:{
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        marginBottom:-7,
    },
    time:{

    }
}))

interface EventWedgetProps{
    agendaEvent: IAgendaEvent,
    onClick?: Function,
}

export const EventWedget = (props: EventWedgetProps) =>{

    const [entity, setEntity] = useState(props.agendaEvent);
    
    const classes = useStyles();

    const calendarWidgetHeight = calanderCellHeight;

    useEffect(() =>{
        setEntity(props.agendaEvent);
    }, [props.agendaEvent])

    const handleClick = () =>{
        if(props.onClick)
            props.onClick(entity);
    }

    const time = entity ? `${formateDate(new Date(entity.startAt), 'HH:mm')} ${translate("_global.label.to")} ${formateDate(new Date(entity.endAt), 'HH:mm')}` : '';

    const startDate = entity && entity.startAt ? new Date(entity.startAt) : new Date();
    const endDate = entity && entity.endAt ? new Date(entity.endAt) : entity.startAt ? new Date(entity.startAt) : new Date();

    const startPos = (startDate && startDate.getMinutes() !== 0) ? startDate.getMinutes()<=15 ? 1 : startDate.getMinutes()<=30 ? 2 : 3 : 0;

    const getWidgetHeight = () =>{
       let height = calendarWidgetHeight;
        if(startDate && endDate){
            // call celle number (1cell = 1hour)
            const nbCell = Math.abs(endDate.getHours() - startDate.getHours());
            if(nbCell !==0){
                height = height * nbCell;
                // andding endMinutes to height
                if(endDate.getMinutes()){
                    height = height + endDate.getMinutes();
                }
                if(startPos !== 0){
                     height = height -  ((endDate.getMinutes()+startPos) * nbCell);

                }
            }else{
                if(endDate.getMinutes()){
                    height = height - Math.abs(endDate.getMinutes() - startDate.getMinutes());
                }
            }
        }

        return height;
    }

    return (
        <React.Fragment>
            {entity && <>
                <Box width={'95%'}
                    className={classes.root}
                    ml={1}
                    onClick={handleClick}>
                    <Box position="relative" height={calanderCellHeight} overflow="visible">
                        <Box className={classes.event} height={getWidgetHeight()} 
                            mt={startPos} boxShadow={2}>
                            <span className={classes.title}>
                                {entity.title}
                            </span><br/>
                            <span className={classes.time}>
                                {time}
                            </span>
                        </Box>
                    </Box>
                </Box>
            </>}
        </React.Fragment>
    )
}

export default EventWedget;
