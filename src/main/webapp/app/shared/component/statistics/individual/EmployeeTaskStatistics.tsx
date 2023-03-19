import { IEmployee } from "app/shared/model/employee.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTaskChronoData } from "app/shared/util/helpers";
import { Bar } from "react-chartjs-2";
import { Box, colors, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";

interface ITaskStatisticsProps{
    employee: IEmployee,
    startDate: Date,
    endDate: Date,
}

export const EmployeeTaskStatistics = (props: ITaskStatisticsProps) =>{
    const {startDate, endDate, employee} = props;

    const [tasks, setTasks] = useState<ITask[]>([]);

    const [loading, setLoading] = useState(false);
    
    const getTasks = () =>{
        if(employee){
            setLoading(true);
            const requestUri = `${API_URIS.taskApiUri}/by-employee-created-between/${employee.id}/?startAt=${startDate.toISOString()}&endAt=${endDate.toISOString()}`;
            axios.get<ITask[]>(requestUri).then(res =>{
                setTasks([...res.data]);
            }).catch(() =>{}).finally(() => setLoading(false))
        }else{
            setTasks([])
        }
    }

    useEffect(() =>{
        getTasks();
    }, [props.startDate, props.endDate, props.employee])

    const data = {
        labels: [translate('microgatewayApp.TaskStatus.VALID'),translate('microgatewayApp.TaskStatus.STARTED'),
                translate('microgatewayApp.TaskStatus.COMPLETED'),translate('_global.statistics.taskFinishedLate'),
                translate('_global.statistics.taskUnfinishedLate')],
        datasets: [
          {
              label: translate('microgatewayApp.microprocessTask.home.title'),
              backgroundColor: colors.deepPurple[500],
              borderColor: colors.deepPurple[300],
              borderWidth: 1,
              hoverBackgroundColor: colors.deepPurple[400],
              hoverBorderColor: colors.deepPurple[500],
              data: [tasks.filter(task => task.status === TaskStatus.VALID).length,
                     tasks.filter(task => task.status === TaskStatus.STARTED && !getTaskChronoData(task).exceeced).length,
                     tasks.filter(task => task.status === TaskStatus.COMPLETED && !getTaskChronoData(task).exceeced).length,
                     tasks.filter(task => task.status === TaskStatus.COMPLETED && getTaskChronoData(task).exceeced).length,
                     tasks.filter(task => task.status === TaskStatus.STARTED && getTaskChronoData(task).exceeced).length] 
          }
        ]
      };

    return (
        <React.Fragment>
            {loading && <Typography display="block">Loading...</Typography>}
            <Bar data={data} />
        </React.Fragment>
    )
}

export default EmployeeTaskStatistics;