import { Box, colors, Grid, makeStyles } from "@material-ui/core";
import { IProcess } from "app/shared/model/microprocess/process.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Line } from 'react-chartjs-2';
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { IChronoUtil } from "app/shared/util/chrono-util.model";

const useStyles = makeStyles(theme =>({
    cardheader:{
        boxShadow: '0 0 1px',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: '5px 5px 0 0',
        backgroundColor: colors.lightBlue[50],
    },
    input:{
        width: theme.spacing(13),
        padding: 0,
    }
}))

interface IProcessStatsProps{
    instances: IProcess[];
}

export const ProcessStats = (props: IProcessStatsProps) =>{
    const { instances } = props;

    const [loading, setLoading] = useState(false);

    const [instancesChronoUtils, setInstancesChronoUtils] = useState<IChronoUtil[]>([]);

    const getInstancesUtils = () =>{
        if(instances && instances.length !== 0 && serviceIsOnline(SetupService.PROCESS)){
            const instancesIds = [...instances].map(item => item.id);
            setLoading(true)
            // finding instances tasks
           axios.get<IChronoUtil[]>(`${API_URIS.processApiUri}/getProcessesChronoUtils/?pIds=${instancesIds.join(',')}`)
                .then(res =>{
                    if(res && res.data && res.data.length !== 0)
                        setInstancesChronoUtils(res.data);
                }).catch((e) =>{
                    console.log('in process-stats component line 47 ', e);
                }).finally(() => setLoading(false))
        }else{
            setInstancesChronoUtils([])
        }
    }

    useEffect(() =>{
        getInstancesUtils();
    }, [props.instances])

    const classes = useStyles();

    const getData =  () => ({
        labels: [translate('microgatewayApp.TaskStatus.VALID')+'s',translate('microgatewayApp.TaskStatus.STARTED')+'s',
                 translate('microgatewayApp.TaskStatus.COMPLETED')+'s', translate('microgatewayApp.TaskStatus.CANCELED')+'s'],
        datasets:[
            {
                label: translate('_global.statistics.numberOfInstances'),
                data: [[...instancesChronoUtils].filter(iu => iu.status === TaskStatus.VALID).length,
                        [...instancesChronoUtils].filter(iu => iu.status === TaskStatus.STARTED).length,
                        [...instancesChronoUtils].filter(iu => iu.status === TaskStatus.COMPLETED).length,
                        [...instancesChronoUtils].filter(iu => iu.status === TaskStatus.CANCELED).length
                    ],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: colors.teal[400],
            }
        ]
    });



    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    }

    return (
        <React.Fragment>
            {serviceIsOnline(SetupService.PROCESS) && 
            <Box width={1} boxShadow={2} display="flex" justifyContent="center" p={2}>
                <Grid container spacing={2}>
                    {loading && <Grid item xs={12}>Loading....</Grid>}
                    <Grid item xs={12}>
                         <Line data={getData()}/>
                    </Grid>
                </Grid>
            </Box>
            }
        </React.Fragment>
    )
}

export default ProcessStats;