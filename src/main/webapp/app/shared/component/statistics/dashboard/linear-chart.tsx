import { Box, BoxProps, makeStyles} from "@material-ui/core";
import { IPerfIndicator, PerfIndicatorUnity } from "app/shared/model/perf-indicator.model";
import { ChartData } from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { translate } from "react-jhipster";
import { PerfUnitySelector } from "./unity-selector";
import axios from 'axios';

const useStyles = makeStyles({
    chart:{
        '&> canvas':{
           // backgroundColor: 'red',
           // color: 'white',
        }
    }
});

interface LinearWidgetProps{
    apiUri?: string,
    label?: string,
    displayAvg?: boolean,
    rootBoxProps?: BoxProps,
    unity: PerfIndicatorUnity,
    handleChangeUnity?: Function,
    dateMin?: Date,
    dateMax?: Date,
    handleChangeDate?: Function,
}
export const LinearChart = (props: LinearWidgetProps) =>{

    const [indicators, setIndicators] = useState<IPerfIndicator[]>([]);

    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getIndicators = () =>{
        if(props.apiUri){
            if(props.apiUri){
                setLoading(true);
                axios.get<IPerfIndicator[]>(props.apiUri)
                    .then(res => setIndicators(res.data))
                    .catch(e => console.log(e))
                    .finally(() => setLoading(false))
            }
        }
    }

    useEffect(() =>{
        getIndicators();
    }, [props.apiUri])

    const chartOptions = {
        responsive: true,
    }

    const getLabelFromDate = (date: Date) =>{
        const dayOfMonth = date.getDate() > 10 ? date.getDate() : "0"+date.getDate();
        return `${translate(`_calendar.day.short.${date.getDay()}`)} ${dayOfMonth} ${translate(`_calendar.month.short.${date.getMonth()}`)} ${date.getFullYear()}`;
    }

    const chartLabels = [...indicators].length === 1 ? [
        getLabelFromDate(new Date(indicators[0].dateMin)),
        getLabelFromDate(new Date(indicators[0].dateMax))
    ] : [...indicators].map((i, index) =>{
        if(indicators.length > 1){
            const date = new Date((index === indicators.length-1) ? i.dateMax : i.dateMin);
            return getLabelFromDate(date);
        }
    });

    const indicatorDataKey = props.displayAvg ? 'avg' : 'count';

    const chartData: ChartData<"line"> = {
        labels: chartLabels,
        datasets:[{
            data: [...indicators].length === 1 ? [0, indicators[0][indicatorDataKey]] : [...indicators].map(i => i[indicatorDataKey]),
            label: props.label || "",
        }]
    };


    return (
        <React.Fragment>
            <Box width={1} boxShadow={5} p={1} {...props.rootBoxProps}>
                {loading ? 'loading...' : (
                    <>
                        {props.handleChangeUnity && <Box width={1} textAlign="center">
                            <PerfUnitySelector selected={props.unity} 
                                handleChangeUnity={props.handleChangeUnity} />
                        </Box>}
                        <Box width={1} className={classes.chart}>
                            <Line data={chartData} 
                                options={chartOptions}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </React.Fragment>
    )
}