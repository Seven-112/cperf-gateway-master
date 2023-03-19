import { IEmployee } from "app/shared/model/employee.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, calculObjectifPercent, expiredObjectif, getTaskChronoData } from "app/shared/util/helpers";
import { Bar, Doughnut } from "react-chartjs-2";
import { Box, colors, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { IIndicator } from "app/shared/model/indicator.model";
import { IObjectif } from "app/shared/model/objectif.model";
import { IObjectifStatsUtils } from "../objectif-stats";

interface IEmployeeObjectifStatisticsProps{
    objectifs: IObjectif[],
}

export const EmployeeObjectifStatistics = (props: IEmployeeObjectifStatisticsProps) =>{
    const {objectifs} = props;

    const [loading, setLoading] = useState(false);

    const [indicators, setIndicators] = useState<IIndicator[]>([]);

    const getObjectifsIndicators = () =>{
        if(objectifs && objectifs.length !== 0){
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
                        colors.cyan.A200,
                        colors.lightBlue.A200,
                        colors.brown[500],
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
            {loading && <Typography display="block">Loading...</Typography>}
            <Doughnut data={data()} />
        </React.Fragment>
    )
}

export default EmployeeObjectifStatistics;