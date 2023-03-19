import React, {  } from "react"

import { CountWidget } from "../count-widget";
import { translate } from "react-jhipster";
import { ShowChart } from "@material-ui/icons";
import { KpiCountWidgetProps } from "./no-started-task";

export const StartedTask = (props : KpiCountWidgetProps) =>{

    const { kpi, loading, exceceed, icon } = props;
    
    const modalTitle = translate(`_global.stats.${exceceed ? 'execeedStartedTasks' : 'startedTasks'}`);

    const handleOpenChart = () =>{
        if(props.onClick)
            props.onClick(modalTitle, exceceed ? "startedLate" : "totalStarted");
    }

    return (
        <React.Fragment>
            <CountWidget 
                data={exceceed ? kpi.startedLate : kpi.totalStarted}
                rate={exceceed ? kpi.startedLateRate : kpi.totalStartedRate}
                title={translate("microgatewayApp.microprocessTask.home.title")}
                description={translate(`_global.stats.short.${exceceed ? 'execeedStartedTasks' : 'startedTasks'}`)}
                avatarClassName={exceceed ? "bg-danger" : "bg-warning"}
                icon={icon || <ShowChart />}
                loading={loading}
                handleOpenChart={handleOpenChart}
            />
        </React.Fragment>
    )
}