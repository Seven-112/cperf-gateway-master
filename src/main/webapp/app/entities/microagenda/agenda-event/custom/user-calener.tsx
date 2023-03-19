import { Fab, Table, TableCell, TableHead, Typography, makeStyles as themeMakeStyles, TableBody, TableRow, Box, TableContainer, Paper, makeStyles } from "@material-ui/core";
import { IAgendaEvent } from "app/shared/model/microagenda/agenda-event.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import DateCalendarItem from "./date-calendar-iitem";
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers";
import { colors } from "@react-spring/shared";

export const calanderCellHeight = 50;

const useStyles = makeStyles({
    paper:{
        width:'100%',
        overflow: 'hidden',
    },
    tableRow:{
        height:calanderCellHeight,
    },
    tableCell:{
        padding: 0,
        background: 'white',
    },
    tableContainer:{
        height: '77vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.7em',
        },
        '&::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px white',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.grey[200], // 'rgba(0,0,0,.1)',
          outline: '1px solid #e1f5fe',
        },
        '&:hover':{
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colors.grey[400], // 'rgba(0,0,0,.1)',
              outline: '1px solid #e1f5fe',
            }
        }
    },
    hourBox:{
        height: calanderCellHeight+1,
        borderBottom:`1px solid #e0e0e0`,
        width:10,
    },
    hourLabel:{
        paddingTop: calanderCellHeight-5,
        position: 'absolute',
        marginLeft: -25,
        fontSize:10,
        color: '#424242',
    },
    headerCellBoderBox:{
        position: 'absolute',
        border:`1px solid #e0e0e0`,
        borderTop: 'none',
        marginTop:-13,
        height: 15,
    },
    hourLegendBox:{
        borderBottom:`1px solid #e0e0e0`,
        position: 'absolute',
        height: 15,
        marginTop: calanderCellHeight-1,
        width: 10,
    },

    hourLegendBoxLabel:{
        position: 'absolute',
        marginTop:3,
        marginLeft: -25,
        fontSize:10,
        color: '#424242',
    }
});

const themeStyles = themeMakeStyles(theme =>({
    thBtn:{
        boxShadow: 'none',
        fontSize: 20,
    },
    thSelectedBtn:{
        background: theme.palette.primary.main,
        color: 'white',
        '&:hover':{
            background: theme.palette.primary.dark,
        }
    },
    thUnSelectedBtn:{
        background: 'white',
        color: theme.palette.grey[600],
        '&:hover':{
            background: theme.palette.grey[100],
        }
    },
}))

interface UserCalendarProps{
    startDate: Date,
    endDate: Date,
    selectedDate?: Date,
    onDateClick?: Function,
    userExtra: IUserExtra,
}

export const UserCalendar = (props: UserCalendarProps) =>{
    const { startDate,endDate, selectedDate, userExtra } = props;
    const [dates, setDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(false);
    
    const classes = useStyles();

    const themeClasses = themeStyles();

    const getDates = () =>{
        let d = startDate || new Date();
        const dMax = endDate || new Date();
        const dtes = [];
        do{
            dtes.push(d);
            d = new Date(d.getTime() + (24*60*60*1000));
        }while(d <= dMax)

        setDates(dtes);
    }

    useEffect(() =>{
        getDates();
        setLoading(!loading)
    }, [props.startDate, props.endDate])

    const handleDateClick = (dte) =>{
        if(dte && props.onDateClick)
            props.onDateClick(dte);
    }
    

    const isCurrentDate = (dte: Date) =>{
        return dte && selectedDate  && 
        selectedDate.getDate() === dte.getDate() && 
        selectedDate.getMonth() === dte.getMonth() &&
        selectedDate.getFullYear() === dte.getFullYear()
    }

    const getHours = () =>{
        const hours: number[] = [];
        for(let h=0; h<24; h++)
            hours.push(h);
        return hours;
    }

    return (
        <React.Fragment>
            {dates && dates.length !== 0 && 
             <Paper className={classes.paper}>
                <TableContainer className={classes.tableContainer}>
                    <Table 
                         stickyHeader size="small"
                         aria-label="calendars table">
                        <TableHead>
                            <TableRow>
                                <TableCell size="small"
                                    className={`${classes.tableCell} border-0`}
                                    style={{width:70}}>
                                    <Box position="relative" overflow="visible" height={calanderCellHeight}
                                        display="flex" justifyContent="right">
                                        <Box className={classes.hourLegendBox}>
                                            <Box className={classes.hourLegendBoxLabel}>0 H</Box>
                                        </Box>
                                    </Box>
                                </TableCell>
                                {[...dates].sort((a,b) => a.getTime() - b.getTime()).map((dte, index) =>(
                                    <TableCell key={index}  size="small" align="center"
                                            className={`${classes.tableCell} border-0`}>
                                        <Box width={1} textAlign="center" height={75}>
                                            <Typography color={isCurrentDate(dte) ? 'primary' : 'inherit'} className="text-uppercase">
                                                {`${translate(`_calendar.day.short.${dte.getDay()}`)}.`}<br/>
                                            </Typography>
                                            <Fab variant="round" size="medium"
                                                className={clsx(themeClasses.thBtn, {
                                                    [themeClasses.thSelectedBtn]: isCurrentDate(dte),
                                                    [themeClasses.thUnSelectedBtn]: !isCurrentDate(dte)
                                                })}
                                                onClick={() =>{handleDateClick(dte)}}
                                                >
                                                {dte.getDate()}
                                            </Fab>
                                        </Box>
                                        <Box width={1} className={classes.headerCellBoderBox}></Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...getHours()].map(hour =>(
                                <React.Fragment key={hour}>
                                    <TableRow className={classes.tableRow}>
                                        <TableCell  size="small"
                                        className={`${classes.tableCell} border-0`}>
                                        {hour < 23 &&
                                        <Box>
                                            <Box position="relative" overflow="visible" height={calanderCellHeight}
                                                display="flex" justifyContent="right">
                                                <Box className={classes.hourBox}>
                                                    <Box className={classes.hourLabel}>{`${hour +1} H`}</Box>
                                                </Box>
                                            </Box>
                                        </Box>}
                                        </TableCell>
                                        {[...dates].sort((a,b) => a.getTime() - b.getTime())
                                        .map((dte, index)  =>(
                                            <TableCell key={index}  size="small"
                                                className={`${classes.tableCell} border-right border-left border-top border-bottom-0`}>
                                                <DateCalendarItem hour={hour} date={dte} 
                                                    userExtra={userExtra} loading={loading}
                                                    onSave={() => setLoading(!loading)}
                                                    onDelete={() => setLoading(!loading)}/>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            }
        </React.Fragment>
    )
}

export default UserCalendar;

