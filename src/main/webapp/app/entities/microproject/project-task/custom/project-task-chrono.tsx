import { Box, CircularProgress, IconButton } from '@material-ui/core';
import { IChrono } from 'app/shared/util/chrono.model';
import { getChronoText, getTaskChronoData, API_URIS, getChronoData } from 'app/shared/util/helpers';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { JustifcationReason } from 'app/shared/model/enumerations/justifcation-reason.model';
import { Autorenew } from '@material-ui/icons';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction, PrivilegeEntity } from 'app/shared/model/enumerations/privilege-action.model';
import { IProject } from 'app/shared/model/microproject/project.model';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { ProjectTaskStatus } from 'app/shared/model/enumerations/project-task-status.model';
import ProjectTaskStatusTrakingUpdate from '../../project-task-status-traking/custom/project-task-status-traking-update';
import { IChronoUtil } from 'app/shared/util/chrono-util.model';
import ChronoVisualizer from 'app/shared/component/chrono-visualizer';

interface IProjectTaskChronoProps extends StateProps, DispatchProps{
    task: IProjectTask,
    hideActionButton?: boolean,
    onPlayOrPause?: Function,
    blankText?: string,
}

export const PorjectTaskChrono = (props: IProjectTaskChronoProps) =>{
    const { account } = props;
    const [task, setTask] = useState(props.task);
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(null);
    const [loading, setLoading] = useState(false);
    const [nextStatus, setNextStatus] = useState<ProjectTaskStatus>(null);
    const [openTaskSatausManager, setOpenTaskSatatusManager] = useState(false);

    const getChronoUtil = () =>{
        if(props.task && props.task.id){
            setLoading(true);
            axios.get<IChronoUtil>(`${API_URIS.projectTaskApiUri}/getChronoUtil/${props.task.id}`)
                .then(res =>{
                    setChronoUtil(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        setTask(props.task);
        getChronoUtil();
    }, [props.task]);

    
    const handleManualPause = () =>{
        setNextStatus(ProjectTaskStatus.ON_PAUSE);
        setOpenTaskSatatusManager(true);
    }


    const handlePlayChrono = () =>{
        if(task.status === ProjectTaskStatus.ON_PAUSE){
            setNextStatus(ProjectTaskStatus.STARTED);
            setOpenTaskSatatusManager(true);
        }
    }

    const handleStatusChange = (saved?: IProjectTask) =>{
        if(saved){
            setTask(saved);
            setNextStatus(saved.status);
            if(props.onPlayOrPause)
                props.onPlayOrPause(saved);

        }
    }

    const handleDisableManualMode = () =>{
        if(task){
            const entity: IProjectTask = {
                ...task, 
                manualMode: false,
            }
            setLoading(true)
            axios.put<IProjectTask>(`${API_URIS.projectTaskApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data)
                        setTask({...res.data})
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const hasTaskEditingPrivilege = account && hasPrivileges({ entities: ['Project', 'ProjectTask'], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const hasProcessEditingPrivileges = account && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);
    const canControl = hasProcessEditingPrivileges || hasTaskEditingPrivilege;

    return (
        <React.Fragment>
            <ProjectTaskStatusTrakingUpdate
                open={openTaskSatausManager}
                newStatus={nextStatus}
                task={task}
                onChangeStatus={handleStatusChange}
                onClose={() => setOpenTaskSatatusManager(false)}
            />
            <ChronoVisualizer chronoUtil={chronoUtil} loading={loading} 
                onPlay={(!props.hideActionButton && task && task.status === ProjectTaskStatus.ON_PAUSE && canControl) ? handlePlayChrono : null}
                onPause={(!props.hideActionButton && task && task.status === ProjectTaskStatus.STARTED && canControl) ? handleManualPause : null}
                onDisableManualMode={(!props.hideActionButton && task && task.manualMode &&  task.status !== ProjectTaskStatus.ON_PAUSE && canControl) ? handleDisableManualMode : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(PorjectTaskChrono);