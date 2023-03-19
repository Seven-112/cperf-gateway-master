import { IPerfIndicator, PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import React, { useEffect, useState } from "react"
import axios  from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Box, makeStyles } from "@material-ui/core";
import { DEFAULT_PERF_INDICATOR_UNITY } from "../unity-selector";
import { getStartDateFromEndDateByUnity } from "../date-interval-selector";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartBgColor = theme.palette.secondary.light;

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

interface TaskExecutionLevelChartProps{
    userIds?: any[],
}

export const TaskExecutionLevelChart = (props: TaskExecutionLevelChartProps) =>{
    const [indicators, setIndicators] = useState<IPerfIndicator[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateMin, setDateMin] = useState<Date>(null);
    const [dateMax, setDateMax] = useState<Date>(null);
    const [unity, setUnity] = useState(DEFAULT_PERF_INDICATOR_UNITY);

    const classes = useStyles();

    const getIndicators = (dteMin: Date, dteMax: Date, pUnity: PerfIndicatorUnity) =>{
        let apiUri = `${API_URIS.processStatApiUri}/getExecutionsLevels`;
        apiUri = `${apiUri}/?unity=${pUnity.toString()}`;
        apiUri = `${apiUri}&startTime=${dteMin.toISOString()}&endTime=${dteMax.toISOString()}`;

        if(props.userIds && props.userIds.length !== 0)
            apiUri = `${apiUri}&userIds=${props.userIds.join(",")}`;
        setLoading(true);
        axios.get<IPerfIndicator[]>(apiUri)
            .then(res =>{
                setIndicators(res.data)
            }).catch(e => console.log(e))
            .finally(() => setLoading(false));
    }

    const initAndGetDates = () =>{
        if(dateMax === null && dateMin === null){
            const endDate = new Date();
            const startDate = getStartDateFromEndDateByUnity(endDate,unity);
            setDateMin(startDate);
            setDateMax(endDate);
            return [startDate, endDate];
        }
        return [dateMin, dateMax];
    }

    const prepareAndGetData = (dteMin?: Date, dteMax?: Date, pUnity?: PerfIndicatorUnity) =>{
        const dates = initAndGetDates();
        const startDate = dteMin || dates[0];
        const endDate = dteMax || dates[1];
        const intervallUnity = pUnity || unity;
        setUnity(intervallUnity);
        setDateMin(startDate);
        setDateMax(endDate);
        getIndicators(startDate, endDate, intervallUnity);
    }

    useEffect(() =>{
        prepareAndGetData();
    }, [props.userIds])

    const handleChangeUnity = (newUnity) =>{
        prepareAndGetData(null, null,newUnity);
    }

    const handleDatesChange = (startDate?: Date, endDate?: Date) =>{
        prepareAndGetData(startDate, endDate);
    }

    const getLabelFromDate = (date: Date) =>{
        const dayOfMonth = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();
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

    const chartData: ChartData<"line"> = {
        labels: [...chartLabels],
        datasets: [
            {
                data: [...indicators].length === 1 ? [0, indicators[0].count/100] : [...indicators].map(i => i.count/100),
                label: translate("_global.stats.executionLevel"),
                backgroundColor: theme.palette.grey[50],
                borderColor:theme.palette.grey[50],
                fill: false,
            }
        ],
    }

    const options:any = {
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
                grid:{
                  color: theme.palette.grey[600], // donner une couleurs aux axes des y (lignes horizontales)
                  tickColor: 'transparent',
                  drawBorder: false, // cacher la ligne vertical de l'axe y
                },
                ticks:{
                  beginAtZero: true,
                  color: theme.palette.grey[50],
                }
            }
        },
        plugins: {
            legend:{
                labels:{
                    color: theme.palette.grey[50],
                }
            }
        }
    };

    return (
        <React.Fragment>
            <ChartContainer
                minDate={dateMin}
                maxDate={dateMax}
                unity={unity}
                loading={loading}
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
            >
                <Box className={classes.chart} width={1}>
                    {[...indicators].length !== 0 && [...indicators].length !== 0 &&
                        <Line data={chartData} options={options} />
                    }
                </Box>
            </ChartContainer>
        </React.Fragment>
    )
}