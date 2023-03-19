import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import React, { useEffect, useState } from "react"
import { Box, makeStyles } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { translate } from "react-jhipster";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData 
} from "chart.js";
import theme from "app/theme";
import { ChartContainer } from "../chart-container";
import { MultiDataPreviewerChartProps } from "./task-execution-traking-chart";
import { removeToDate } from "app/shared/util/date-utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartBgColor = theme.palette.primary.dark;

const useStyles = makeStyles({
    root:{
        border: `1px solid ${chartBgColor}`,
        borderRadius: 7,
        backgroundColor: chartBgColor,
    },
    chart:{
        '&> canvas':{
           backgroundColor: chartBgColor,
           color: 'white',
        }
    }
})


export const DeleyRespectRateChart = (props: MultiDataPreviewerChartProps) =>{
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

    const handleDatesChange = (start?: Date, end?: Date) =>{
        if(props.onChangeDates)
            props.onChangeDates(start, end);
    }

    const handleChangeUnity = (unity?: PerfIndicatorUnity) =>{
        if(props.onChangeUnity)
            props.onChangeUnity(unity);
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

    const calculeData = (a: number, b: number) =>{
        if(b !== 0){
            const res = a/b;
            if(`${res}`.includes(',') || `${res}`.includes('.'))
                return Number(res.toFixed(2));
            return res;
        }
        return 0;
    }

    const data1 = sortedData.map(i => calculeData(i.executed, i.totalExecuted));

    const data2 = sortedData.map(i => calculeData(i.executedLate, i.totalExecuted));

    const chartData: ChartData<"line"> = {
        labels: [...chartLabels],
        datasets: [
            {
                data: data1.length === 1 ? [0, ...data1] : data1,
                label: translate("_global.stats.respectedDeleyRate"),
                backgroundColor: theme.palette.success.main,
                borderColor:theme.palette.success.main,
            },
            {
                data: data2.length !==0 ? [0,...data2] : data2,
                label: translate("_global.stats.noRespectedDeleyRate"),
                backgroundColor: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
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
                beginAtZero: true,
              }
            },
            y:{
                grid:{
                  color: theme.palette.grey[600], // donner une couleurs aux axes des y (lignes horizontales)
                  tickColor: 'transparent',
                  drawBorder: false, // cacher la ligne vertical de l'axe y
                },
                ticks:{
                  beginAtZero: true,
                  color: theme.palette.grey[200],
                }
            },
        },
        plugins: {
            legend:{
                labels:{
                    color: theme.palette.grey[300],
                }
            }
        }
    };

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
                }}
                dateInputFieldClassName="text-white"
                iconClassName="text-white"
                selectClassName="text-white"
                selectIconClassName="text-white"
                loadingTypographyProps={{ className: "text-white" }}
                validBtnProps={{
                    children: 'valider',
                    size: "small",
                    variant: "contained",
                    onClick: handleSubmitSearch,
                    className: `${((!props.dateMax && !props.dateMax) || !canSubmitSearch) ? 'd-none' : ''} p-0 pl-2 pr-2 ml-2 text-capitalize text-white bg-success`
                }}
            >
                <Box className={classes.chart} width={1}>
                    <Line data={chartData} options={options} />
                </Box>
            </ChartContainer>
        </React.Fragment>
    )
}