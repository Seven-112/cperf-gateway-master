import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import React, { useEffect, useState } from "react"
import { Box, makeStyles } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { translate } from "react-jhipster";
import { 
    Chart as ChartJS,
    CategoryScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartData, 
    LinearScale,
    LineElement
} from "chart.js";
import theme from "app/theme";
import { ChartContainer } from "../chart-container";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { removeToDate } from "app/shared/util/date-utils";

ChartJS.register(
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartBgColor = theme.palette.grey[200];

const useStyles = makeStyles({
    root:{
        borderRadius: 7,
        backgroundColor: chartBgColor,
        borderColor: theme.palette.grey[500],
    },
    chart:{
        '&> canvas':{
           backgroundColor: chartBgColor,
           color: 'white',
        }
    }
})

export interface MultiDataPreviewerChartProps{
    kpis?: IKPI[],
    loading?: boolean,
    dateMin?: Date,
    dateMax?: Date,
    unity?: PerfIndicatorUnity,
    onSearch?: Function,
    onChangeDates?: Function,
    onChangeUnity?: Function,
}

export const TaskExecutionTrakingChart = (props: MultiDataPreviewerChartProps) =>{
    const [canSubmitSearch, setCanSubmitSearch] = useState(false);

    const classes = useStyles();


    useEffect(() =>{
        setCanSubmitSearch(true);
    }, [props.dateMax, props.dateMin, props.unity])

    const handleSubmitSearch = (e) =>{
        e.preventDefault();
        if(props.onSearch){
            props.onSearch();
            setCanSubmitSearch(false);
        }
    }

    const getLabelFromDate = (date: Date) =>{
        const dayOfMonth = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();
        return `${translate(`_calendar.day.short.${date.getDay()}`)} ${dayOfMonth} ${translate(`_calendar.month.short.${date.getMonth()}`)} ${date.getFullYear()}`;
    }

    const mySorter = (f1?: string, f2?: string) =>{
        let d1 = new Date(f1);
        let d2 = new Date(f2);
        if(d1 > d2){
            d1 = null;
            d2 = null;
            return 1;
        }
        return 0;
    }

    const sortedData = [...props.kpis].sort((a, b) => mySorter(a.dte, b.dte));
    
    const chartLabels = sortedData.length === 1 ? [
        getLabelFromDate(removeToDate(new Date(sortedData[0].dte), {nbDays: 1})),
        getLabelFromDate(new Date(sortedData[0].dte))
    ] : sortedData.map((i) =>getLabelFromDate(new Date(i.dte)));

    const chartData: ChartData<"line"> = {
        labels: [...chartLabels],
        datasets: [
            {
                data: sortedData.length === 1 ? [0, sortedData[0].executedLate] : sortedData.map(i => i.executedLate),
                label: translate("_global.stats.execeedCompletedTasks"),
                backgroundColor: theme.palette.info.main,
                borderColor:theme.palette.info.main,
            },
            {
                data: sortedData.length === 1 ? [0, sortedData[0].startedLate] : sortedData.map(i => i.startedLate),
                label: translate("_global.stats.execeedStartedTasks"),
                backgroundColor: theme.palette.warning.main,
                borderColor: theme.palette.warning.main,
            }
        ],
    }

    const options: any = {
        responsive: true,
        scales:{
            x:{
              grid:{
                color: 'transparent', // cacher les ligne verticales du grid du chart
                tickColor: 'transparent', // cacher les legends secondaire de l'axe absices
                drawBorder: false, // cacher la ligne vertical des axes de absisse
              },
              ticks:{
                display: false, // cacher les legends des axis des absices 
              }
            },
            y:{
                ticks:{
                    biginAtZero: true,
                }
            },
        },
        /* plugins: {
            legend:{
                labels:{
                    color: theme.palette.grey[400],
                }
            } 
        } */
    };

    const handleDatesChange = (start?: Date, end?: Date) =>{
        if(props.onChangeDates)
            props.onChangeDates(start, end);
    }

    const handleChangeUnity = (unity?: PerfIndicatorUnity) =>{
        if(props.onChangeUnity)
            props.onChangeUnity(unity);
    }

    return (
        <React.Fragment>
            <ChartContainer
                minDate={props.dateMin}
                maxDate={props.dateMax}
                unity={props.unity}
                loading={props.loading}
                handleDatesChange={handleDatesChange}
                handleChangeUnity={handleChangeUnity}
                rootBoxProps={{
                    className: classes.root,
                    boxShadow:2,
                    border:1,
                }}
                validBtnProps={{
                    children: 'valider',
                    size: "small",
                    variant: "contained",
                    onClick: handleSubmitSearch,
                    className: `${((!props.dateMax && !props.dateMax) || !canSubmitSearch) ? 'd-none' : ''} p-0 pl-2 pr-2 ml-2 text-capitalize text-white bg-success`
                }}
                /* dateInputFieldClassName="text-white"
                iconClassName="text-white"
                selectClassName="text-white"
                selectIconClassName="text-white"
                loadingTypographyProps={{ className: "text-white" }} */
            >
                <Box className={classes.chart} width={1}>
                    <Line data={chartData} options={options} />
                </Box>
            </ChartContainer>
        </React.Fragment>
    )
}