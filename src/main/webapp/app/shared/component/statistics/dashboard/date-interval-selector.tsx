import { Box, BoxProps, Divider, InputAdornment, makeStyles, Typography } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model";
import theme from "app/theme";
import React, { ReactNode, useEffect, useState } from "react";
import { DEFAULT_PERF_INDICATOR_UNITY } from "./unity-selector";

const useStyles = makeStyles({
    box:{
        background: 'transparent',
        color: `${theme.palette.primary.main}`,
    },
    dateInputField:{
        color: theme.palette.primary.main,
        maxWidth: 65,
        fontSize: 12,
        textAlign: 'center',
        cursor: 'pointer',
    },
    icon:{
        color: theme.palette.primary.main,
    }
})



export const getStartDateFromEndDateByUnity = (endDate: Date, u?: PerfIndicatorUnity) =>{
    const unity = u || DEFAULT_PERF_INDICATOR_UNITY;
    const startDate = new Date(endDate.getTime());
    switch(unity){
        case PerfIndicatorUnity.MONTH:
            startDate.setMonth(startDate.getMonth()-1);
            break;
        case PerfIndicatorUnity.SEMESTER:
            startDate.setMonth(startDate.getMonth()-6);
            break;
        case PerfIndicatorUnity.TRIMESTER:
            startDate.setMonth(startDate.getMonth()-4);
             break;
        case PerfIndicatorUnity.WEEK:
            startDate.setDate(startDate.getDate()-7);
            break;
        case PerfIndicatorUnity.YEAR:
            startDate.setFullYear(startDate.getFullYear()-1);
            break;
        default:
            startDate.setDate(startDate.getDate()-1);
    }
    
    return startDate;
}

export interface DashBoardDateSelectorProps{
    minDate: Date,
    maxDate: Date,
    dateSelectorRootBoxProps?: BoxProps,
    dateInputFieldClassName?: string,
    handleDatesChange?: Function,
    iconClassName?: string,
    datesSeperator?: ReactNode,
}

export const DashbordIntervalSelector = (props: DashBoardDateSelectorProps) =>{

    const [startDate, setSartDate] = useState(props.minDate);
    
    const [endDate, setEndDate] = useState(props.maxDate);

    const classes = useStyles();

    const normalizeDates = () =>{
        let d1 = props.minDate || new Date();
        let d2 = props.maxDate || new Date();
        if(d1.getDate() === d2.getDate() 
                && d1.getMonth() === d2.getMonth()
                 && d1.getFullYear() === d2.getFullYear()){
            d1.setDate(d1.getDate()-7); // start on 15 days ecart
        }
        
        if(d1.getTime() > d2.getTime()){
            const d3 = d2;
            d2 = d1;
            d1 = d3;
        }

        setSartDate(d1);
        setEndDate(d2);

        props.handleDatesChange(d1, d2);
    }

    useEffect(() =>{
        normalizeDates();
    }, [props.minDate, props.maxDate])

    const handleChangeStartDate = (date: Date) =>{
        props.handleDatesChange(date, endDate);
    }

    const handleChangeEndDate = (date) =>{
        props.handleDatesChange(startDate, date);
    }
    
    return (
        <React.Fragment>
            <Box 
             display="flex"
             justifyContent="center"
             alignItems="stretch"
             flexWrap="wrap"
             className={classes.box}
             {...props.dateSelectorRootBoxProps}>
             <Box m={0} p={0}>
                <DatePicker 
                    value={startDate}
                    onChange={handleChangeStartDate}
                    autoOk
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: <ArrowDropDown className={`${classes.icon} ${props.iconClassName}`} />
                    }}
                    inputProps={{
                        className: `${classes.dateInputField} ${props.dateInputFieldClassName}`,
                    }}
                    DialogProps={{
                        title: 'End time',
                    }}
                    />
                </Box>
                {props.datesSeperator}
                <Box m={0} ml={props.datesSeperator ? 0 : 1} p={0}>
                    <DatePicker 
                        value={endDate}
                        onChange={handleChangeEndDate}
                        autoOk
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: <ArrowDropDown className={`${classes.icon} ${props.iconClassName}`} />
                        }}
                        inputProps={{
                            className: `${classes.dateInputField} ${props.dateInputFieldClassName}`,
                        }}
                        DialogProps={{
                            title: 'End time',
                        }}
                     />
                </Box>
            </Box>
        </React.Fragment>
    )
}