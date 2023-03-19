import React, {  } from "react"

import { CountWidget } from "../count-widget";
import { translate } from "react-jhipster";
import { Timeline } from "@material-ui/icons";
import { colors, IconProps, makeStyles } from "@material-ui/core";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { KpiCountWidgetProps } from "./no-started-task";

const useStyles = makeStyles({
    avatar:{
        background: colors.deepPurple[700],
    }
})

export const CompletedTask = (props : KpiCountWidgetProps) =>{
    
    const { kpi, loading, exceceed, icon } = props;
    
    const modalTitle = translate(`_global.stats.${exceceed ? 'execeedCompletedTasks' : 'completedTasks'}`);

    const handleOpenChart = () =>{
        if(props.onClick)
            props.onClick(modalTitle, exceceed ? "executedLate" : "totalExecuted");
    }
    
    const classes = useStyles();

    return (
        <React.Fragment>
            <CountWidget 
                data={exceceed ? kpi.executedLate : kpi.totalExecuted}
                rate={exceceed ? kpi.executedLateRate : kpi.totalExecutedRate}
                title={translate("microgatewayApp.microprocessTask.home.title")} 
                description={translate(`_global.stats.short.${exceceed ? 'execeedCompletedTasks' : 'completedTasks'}`)}
                avatarClassName={exceceed ? classes.avatar : "bg-success"}
                icon={icon || <Timeline />}
                withRate={false}
                loading={loading}
                handleOpenChart={handleOpenChart}
            />
        </React.Fragment>
    )
}