import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import React, { useEffect, useState } from "react"
import axios  from 'axios';
import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import { DEFAULT_PERF_INDICATOR_UNITY } from "./unity-selector";
import { getStartDateFromEndDateByUnity } from "./date-interval-selector";
import { Line } from "react-chartjs-2";
import { translate } from "react-jhipster";
import { getAll } from "./process/dashbord-reducer";
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
import { ChartContainer } from "./chart-container";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { Close } from "@material-ui/icons";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { API_URIS } from "app/shared/util/helpers";
import { convertDateFromServer, removeToDate } from "app/shared/util/date-utils";
import { MultiDataPreviewerChartProps } from "./process/task-execution-traking-chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartBgColor = '#111827';
const haderBgColor = '#2a2b3d';
const borderColor = '#6B7280';
const chartLineColor = '#FF8A00';

const useStyles = makeStyles({
    root:{
    },
    chart:{
        '&> canvas':{
            padding: 3,
        }
    },
    modal:{
        width: '65%',
        borderRadius: 'none',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        }
    },
    cardContent:{
        background: chartBgColor,
    },
    cardHeader:{
        background: haderBgColor,
        color: 'white',
        padding: "0 15px",
        borderRadius: '10px 10px 0 0',
    },
    cardAction:{
        borderRadius: 0,
        background: chartBgColor,
    },
})

interface ModalChartPreviewerProps extends MultiDataPreviewerChartProps{
    open?: boolean,
    chartData: number[],
    chartLables: string[],
    title?: string,
    isPercentData?: boolean,
    onClose: Function,
}

export const ModalChartPreviewer = (props: ModalChartPreviewerProps) =>{
    const { open } = props;
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

    const handleClose = () => {
        props.onClose();
        setCanSubmitSearch(false);
    }


    const chartData: ChartData<"line"> = {
        labels: [...props.chartLables],
        datasets: [
            {
                data: props.chartData.length === 1 ? [0, ...props.chartData] : props.chartData,
                label: props.title,
                borderColor: chartLineColor,
                borderWidth: 2,
                backgroundColor: chartLineColor,
                // fill: true,
            }
        ],
    }

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                title={<Box width={1} p={0} display="flex" 
                    justifyContent="space-around" 
                    alignItems="center" flexWrap="wrap">
                    <Typography className="mr-2">{`${props.title} ${props.loading ? 'Loading...' : ''}`}</Typography>
                    <Box flexGrow={1}>
                        <ChartContainer
                            minDate={props.dateMin}
                            maxDate={props.dateMax}
                            unity={props.unity}
                            handleDatesChange={handleDatesChange}
                            handleChangeUnity={handleChangeUnity}
                            controlsContentBoxPrpos={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: 'wrap',
                            }}
                            dateInputFieldClassName="text-white"
                            iconClassName="text-white"
                            loadingTypographyProps={{
                                className: 'text-white',
                            }}
                            selectClassName="text-white"
                            selectIconClassName="text-white"
                            validBtnProps={{
                                children: 'valider',
                                size: "small",
                                variant: "contained",
                                onClick: handleSubmitSearch,
                                className: `${((!props.dateMax && !props.dateMax) || !canSubmitSearch) ? 'd-none' : ''} p-0 pl-2 pr-2 ml-2 text-capitalize text-white bg-success`
                            }}
                        />
                    </Box>
                    <IconButton onClick={handleClose} className="p-0 ml-2 text-white"><Close /></IconButton>
                </Box>
                }
                rootCardClassName={classes.modal}
                headerClassName={classes.cardHeader}
                customCardContentClassName={classes.cardContent}
                foolterClassName={classes.cardAction}
            >
                <Box className={classes.chart} width={1}>
                    <Line data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins:{
                            legend:{
                                display: false,
                            }
                        },
                        scales:{
                            x:{
                                beginAtZero: true,
                                grid:{
                                    display: false,
                                    borderWidth: 2,
                                    borderColor,
                                },
                                ticks:{
                                    display: false,
                                }
                            },
                            y:{
                                beginAtZero: true,
                                grid:{
                                    display: false,
                                    borderWidth: 2,
                                    borderColor,
                                },
                                ticks:{
                                    color: borderColor
                                }
                            }
                        }
                    }} />
                </Box>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default ModalChartPreviewer;