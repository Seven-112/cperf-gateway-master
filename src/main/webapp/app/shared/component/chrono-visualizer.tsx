import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { Autorenew, PauseCircleFilled, PlayCircleFilledOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { TaskStatus } from "../model/enumerations/task-status.model";
import { IChronoUtil } from "../util/chrono-util.model";
import { IChrono } from "../util/chrono.model";
import { getChronoData, getChronoText } from "../util/helpers";

interface IChronoVisualizer{
    chronoUtil?: IChronoUtil,
    loading?: boolean,
    noValidChronoText?: any,
    onPlay?: Function,
    onPause?: Function,
    onDisableManualMode?: Function,
}

export const ChronoVisualizer = (props: IChronoVisualizer) =>{
    const { loading, noValidChronoText } = props;
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(props.chronoUtil);
    const [chrono, setChrono] = useState<IChrono>(null);

    useEffect(() =>{
        setChronoUtil(props.chronoUtil);
    }, [props.chronoUtil])

    useEffect(() =>{
        setTimeout(() => {
            setChrono({...getChronoData(chronoUtil)});
        }, 1000);
    }, [chrono]);

    const handlePlay = () =>{
        if(props.onPlay)
            props.onPlay();
    }

    const handlePause = () =>{
        if(props.onPause)
            props.onPause();
    }

    const handleDisableManualMode = () =>{
        if(props.onDisableManualMode)
            props.onDisableManualMode();
    }

    return (
        <React.Fragment>
            <Box display="flex" justifyContent={"center"} alignItems="center" flexWrap={"wrap"}>
                {loading && <CircularProgress style={{ height:15, width:15 }} className="mr-2"/>}
                {chrono && chronoUtil &&  <Box className="p-0 center-align">
                    {[TaskStatus.STARTED, TaskStatus.EXECUTED, TaskStatus.SUBMITTED].includes(chronoUtil.status) && <>
                        <span className={clsx({
                                'badge badge-pill badge-info': !chrono.exceeced,
                                'badge badge-pill badge-danger': chrono.exceeced,
                            })}>{ getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'remaining'))}</span>
                            {props.onPause && <IconButton title="pause" onClick={handlePause}><PauseCircleFilled /></IconButton>}
                        </>}
                        {chronoUtil.status === TaskStatus.ON_PAUSE && <>
                            <span className={clsx({
                                'badge badge-pill badge-primary': !chrono.exceeced,
                                'badge badge-pill badge-danger': chrono.exceeced,
                            })}>{ getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'remaining'))}&nbsp;:&nbsp;{
                                translate("_global.label.onPause")
                            }</span>
                            {props.onPlay && <IconButton title="play" onClick={handlePlay}><PlayCircleFilledOutlined /></IconButton>}
                        </>}
                        {chronoUtil.status === TaskStatus.CANCELED && <>
                            <span className="badge badge-pill badge-secondary">
                                {getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'remaining'))}&nbsp;:&nbsp;
                                {translate("microgatewayApp.TaskStatus.CANCELED")
                            }</span>
                        </>}
                        {chronoUtil.status === TaskStatus.COMPLETED && <>
                        <span className={clsx({
                                'badge badge-pill badge-success': !chrono.exceeced,
                                'badge badge-pill badge-danger': chrono.exceeced,
                            })}>
                                { getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'gained'))}
                            </span>
                        </>}
                        {props.onDisableManualMode && <Tooltip 
                            title={translate('_global.label.disableManualMode')}
                            onClick={handleDisableManualMode}> 
                            <IconButton onClick={handleDisableManualMode}
                                aria-label="disable manual mode" size="small" className={"ml-1"}>
                                <Autorenew color="primary" />
                            </IconButton>
                        </Tooltip>}
                    </Box>
                }
                {(!chrono || !chronoUtil || chronoUtil.status === TaskStatus.VALID) && noValidChronoText}
        </Box>
        </React.Fragment>
    )
}

ChronoVisualizer.defaultProps={
    noValidChronoText: '...'
}

export default ChronoVisualizer;