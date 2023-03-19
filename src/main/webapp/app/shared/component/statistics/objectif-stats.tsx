import { Box, Card, CardContent, CardHeader, colors, Grid, LinearProgress, makeStyles, TextField, Typography } from "@material-ui/core";
import { Pie } from "react-chartjs-2";
import { IIndicator } from "app/shared/model/indicator.model";
import { IObjectif } from "app/shared/model/objectif.model";
import { API_URIS, calculObjectifPercent, expiredObjectif, groupBy } from "app/shared/util/helpers";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";


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
        '& .MuiInput-root':{
            color: 'white',
            '&:before':{
                borderBottomColor: 'white',
            },
            '&:hover':{
                '&:before':{
                    borderBottomColor: 'white',
                },
            }
        },
        '& .Mui-focused':{
            color: 'white',
            '&:before':{
                borderBottomColor: 'white',
            },
        },
    }
}))

export interface IObjectifStatsUtils{
    objectif: IObjectif,
    expired: boolean,
    percent: number,
}

interface IObjectifStatsProps{
    objectifs: IObjectif[];
}

export const ObjectifStats = (props: IObjectifStatsProps) =>{
    const { objectifs } = props;

    const [loading, setLoading] = useState(false);

    const [indicators, setIndicators] = useState<IIndicator[]>([]);

    const getObjectifsIndicators = () =>{
        if(objectifs && objectifs.length !== 0 && serviceIsOnline(SetupService.OBJECTIF)){
            setLoading(true);
            const objIds = objectifs.map(obj => obj.id);
            axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?objectifId.in=${objIds}`)
                .then(res =>{
                    setIndicators([...res.data]);
                }).catch(() =>{}).finally(() => setLoading(false));
        }

    }

    useEffect(() =>{
        getObjectifsIndicators();
    }, [props.objectifs])

    const classes = useStyles();

    const data = () =>{
        const objPercents: IObjectifStatsUtils[] = [];
        if(indicators && objectifs && objectifs.length !== 0){
            for(let i=0; i< objectifs.length; i++){
                const obj = objectifs[i];
                const objIndicators = indicators.filter(ind => ind.objectif && ind.objectif.id=== obj.id);
                objPercents.push({
                            objectif: obj, 
                            expired: expiredObjectif(obj),
                            percent: calculObjectifPercent(obj, objIndicators)
                        })
            }
        }
        return  {
            labels: [translate('_global.statistics.objectifCompleted'),
                    translate('_global.statistics.objectifNoCompleted'),
                    translate('_global.statistics.objectifNoCompletedExpired')],
            datasets:[
                {
                    data: [
                        objPercents.filter(el => el.percent >= 100).length,
                        objPercents.filter(el => el.percent < 100 && !el.expired).length,
                        objPercents.filter(el => el.percent < 100 && el.expired).length,
                    ],
                    fill: false,
                    backgroundColor: [
                        colors.green[500],
                        colors.red[800],
                        colors.blueGrey[500],
                    ],
                    borderColor: colors.teal[400],
                }
            ]
        };
    }

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
            {serviceIsOnline(SetupService.OBJECTIF) &&
            <Box width={1} boxShadow={2} display="flex" justifyContent="center" p={2}>
                <Grid container spacing={2}>
                    {loading && <Grid item xs={12}> Loading...</Grid>}
                    <Grid xs={12} className="text-center">
                        {translate('microgatewayApp.objectif.home.title')}
                    </Grid>
                    <Grid item xs={12}>
                            <Pie data={data()}/>
                    </Grid>
                </Grid>
            </Box>
            }
        </React.Fragment>
    )
}

export default ObjectifStats;