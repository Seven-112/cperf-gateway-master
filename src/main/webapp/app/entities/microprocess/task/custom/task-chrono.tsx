import { ITask } from 'app/shared/model/microprocess/task.model';
import { API_URIS } from 'app/shared/util/helpers';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction, PrivilegeEntity } from 'app/shared/model/enumerations/privilege-action.model';
import TaskStatusTrakingUpdate from '../../task-status-traking/custom/task-status-traking-update';
import { IChronoUtil } from 'app/shared/util/chrono-util.model';
import ChronoVisualizer from 'app/shared/component/chrono-visualizer';

interface ITaskChronoProps extends StateProps, DispatchProps{
    task: ITask,
    process?: IProcess,
    hideActionButton?: boolean,
    onPlayOrPause?: Function,
    blankText?: string,
}

export const TaskChrono = (props: ITaskChronoProps) =>{
    const { account } = props;
    const [task, setTask] = useState(props.task);
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(null);
    const [loading, setLoading] = useState(false);
    const [nextStatus, setNextStatus] = useState<TaskStatus>(null);
    const [openTaskSatausManager, setOpenTaskSatatusManager] = useState(false);

    const getChronoUtil = () =>{
        if(task && task.id){
            setLoading(true);
            axios.get<IChronoUtil>(`${API_URIS.taskApiUri}/getChronoUtil/${task.id}`)
                .then(res =>{
                    setChronoUtil(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        setTask(props.task);
    }, [props.task]);


    useEffect(() =>{
        getChronoUtil();
    }, [task]);
    
    const handleManualPause = () =>{
        setNextStatus(TaskStatus.ON_PAUSE);
        setOpenTaskSatatusManager(true);
    }


    const handlePlayChrono = () =>{
        if(task.status === TaskStatus.ON_PAUSE){
            setNextStatus(TaskStatus.STARTED);
            setOpenTaskSatatusManager(true);
        }
    }

    const handleStatusChange = (saved?: ITask) =>{
        if(saved){
            setTask(saved);
            setNextStatus(saved.status);
            if(props.onPlayOrPause)
                props.onPlayOrPause(saved);

        }
    }

    const handleDisableManualMode = () =>{
        if(task){
            const entity: ITask = {
                ...task, 
                manualMode: false,
            }
            setLoading(true)
            axios.put<ITask>(`${API_URIS.taskApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data)
                        setTask({...res.data})
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const hasTaskEditingPrivilege = account && hasPrivileges({ entities: [PrivilegeEntity.Task], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const hasProcessEditingPrivileges = account && hasPrivileges({ entities: [PrivilegeEntity.Process], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const canControl = hasProcessEditingPrivileges || hasTaskEditingPrivilege;

    return (
        <React.Fragment>
        <TaskStatusTrakingUpdate
            open={openTaskSatausManager}
            newStatus={nextStatus}
            task={task}
            onChangeStatus={handleStatusChange}
            onClose={() => setOpenTaskSatatusManager(false)}
         />
         <ChronoVisualizer chronoUtil={chronoUtil} loading={loading} 
            onPlay={(!props.hideActionButton && task && task.status === TaskStatus.ON_PAUSE && canControl) ? handlePlayChrono : null}
            onPause={(!props.hideActionButton && task && task.status === TaskStatus.STARTED && canControl) ? handleManualPause : null}
            onDisableManualMode={(!props.hideActionButton && task && task.manualMode &&  task.status !== TaskStatus.ON_PAUSE && canControl) ? handleDisableManualMode : null}
         />
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } : IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskChrono);