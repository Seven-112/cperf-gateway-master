import { Box, makeStyles, Tooltip } from "@material-ui/core";
import theme from "app/theme";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement  } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { translate } from "react-jhipster";

const useStyles = makeStyles({
    root:{
        cursor: 'pointer',
        '&> canvas':{
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
            '&:hover':{
                boxShadow: `0px 0px 1px`,
                transform: "scale(1.3,1)",
            },
        }
    },
    tooltip:{
        background: 'transparent',
        color: theme.palette.primary.dark,
        margin: -5,
    },
})

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
);

export enum BtnChartDirection{
    up = "up",
    down = 'down',
    upDown = 'upDown',
    downUp = 'downUp',
    constant = 'constant'
}

export interface MyChartIconButtonProps{
    indicator?: number,
    negativeRateIsSuccess?: boolean,
    fill?:boolean,
    onClick?: Function,
}

export const MyChartIconButton = (props : MyChartIconButtonProps) =>{
    const { indicator, negativeRateIsSuccess } = props;
    
    const classes = useStyles();

    const handleClick = () =>{
        if(props.onClick)
            props.onClick();
    }

    const upData = [0, 5, 8, 10, 15];

    const downData = [15, 10, 8, 5, 0];

    const downUpData = [11, 9,13, 15, 11];

    const upDownData = [15, 11,13, 9, 11];

    const constantData = [0, 0, 0, 0, 0];

    const colorIsSuccess = () : 'POSITIVE' | 'NEGATIVE' | 'NEUTER' => {
        if(indicator && indicator > 0 && !negativeRateIsSuccess)
            return 'POSITIVE';

        if(indicator && indicator <0 && negativeRateIsSuccess)
            return 'NEGATIVE';
        return 'NEUTER';
    }

    const getChartData = () =>{
        const stat = colorIsSuccess();
        if(stat === 'POSITIVE')
            return upDownData;
        if(stat === 'NEGATIVE')
            return downUpData;
        return constantData;
    }


    const borderColor = colorIsSuccess() === 'POSITIVE' ? theme.palette.success.main
        : colorIsSuccess() === 'NEGATIVE' ? theme.palette.secondary.main
         : theme.palette.grey[400];

    const backgroundColor = colorIsSuccess() === 'POSITIVE' ? theme.palette.success.light
    : colorIsSuccess() === 'NEGATIVE' ? theme.palette.secondary.light
     : theme.palette.grey[200];

    return (
        <React.Fragment>
            <Tooltip 
                title={translate("_global.label.clickToViewDetails")}
                classes={{
                    tooltip: classes.tooltip,
                }}
                onClick={handleClick}>
                <Box width={1} p={1}
                    className={classes.root}>
                    <Line data={{
                        labels: ["a", "b", "c", "d", "e"],
                        datasets:[{
                            data: getChartData(),
                            borderColor,
                            backgroundColor,
                            fill: props.fill,
                            borderWidth: 3,
                            pointBorderColor: 'transparent',
                            pointBorderWidth: 0,
                            pointRadius: 0.5,
                        }],
                    }} 
                    options={{
                        maintainAspectRatio: true,
                        scales:{
                            x:{
                                beginAtZero: true,
                                ticks:{
                                    display: false,
                                },
                                grid:{
                                    display: false,
                                    borderWidth: 0,
                                    borderColor: theme.palette.primary.dark,
                                },
                            },
                            y:{
                                beginAtZero: true,
                                ticks:{
                                    display: false,
                                },
                                grid:{
                                    display: false,
                                    borderWidth: 0,
                                    borderColor: theme.palette.primary.dark,
                                },
                            }
                        },
                        plugins:{
                            legend: {
                                display: false,
                            },
                            tooltip:{
                                enabled: false,
                            }
                        }
                    }}
                    />
                </Box>
            </Tooltip>
        </React.Fragment>
    )
}