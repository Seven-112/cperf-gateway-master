import { API_URIS } from 'app/shared/util/helpers';
import React, { useEffect, useState } from 'react';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { PrivilegeAction, PrivilegeEntity } from 'app/shared/model/enumerations/privilege-action.model';
import { hasPrivileges } from 'app/shared/auth/helper';
import { IChronoUtil } from 'app/shared/util/chrono-util.model';
import axios from 'axios';
import ChronoVisualizer from 'app/shared/component/chrono-visualizer';

interface IProcessChronoProps extends StateProps, DispatchProps{
    process: IProcess,
    loading?: boolean,
    chronoUtil?: IChronoUtil,
    chronoLoadingOnOutMode?: boolean,
    onPlayOrPause?: Function,
    onCallBack?: Function
}

export const ProcessChrono = (props: IProcessChronoProps) =>{
    const { account } = props;
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(props.chronoUtil);
    const [loading, setLoading] = useState(props.loading);

    const getChronoUtil = () =>{
        if(props.process && props.process.id && !props.chronoLoadingOnOutMode){
            setLoading(true)
            axios.get<IChronoUtil>(`${API_URIS.processApiUri}/getChronoUtil/${props.process.id}`)
                .then(res =>{
                    setChronoUtil(res.data);
                    if(props.onCallBack)
                        props.onCallBack(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        getChronoUtil();
        setChronoUtil(props.chronoUtil)
    }, [props.process, props.chronoUtil])

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])
    
    const handlePlayPause = () =>{
        if(props.onPlayOrPause)
            props.onPlayOrPause(chronoUtil);
    }

    const canPlayOrPause = props.onPlayOrPause && account && hasPrivileges({ 
        entities: [PrivilegeEntity.Task, PrivilegeEntity.Process], 
        actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]
        }, account.authorities);

    return (
        <React.Fragment>
            <ChronoVisualizer chronoUtil={chronoUtil} loading={loading}
                onPlay={(chronoUtil && chronoUtil.status === TaskStatus.ON_PAUSE && canPlayOrPause) ? handlePlayPause : null}
                onPause={(chronoUtil && chronoUtil.status === TaskStatus.STARTED && canPlayOrPause) ? handlePlayPause : null}
             />
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } :IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    getSession
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessChrono);