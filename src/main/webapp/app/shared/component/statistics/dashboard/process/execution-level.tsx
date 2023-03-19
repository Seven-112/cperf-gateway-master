import React, {  } from "react"

import { CountWidget } from "../count-widget";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBooth } from "@fortawesome/free-solid-svg-icons";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { KpiCountWidgetProps } from "./no-started-task";

export const ExecutionLevel = (props : KpiCountWidgetProps) =>{

    const { kpi, loading } = props;

    const data = kpi && kpi.executionLevel ? (kpi.executionLevel * 100) : 0;
    
    const modalTitle = translate("_global.stats.executionLevel");

    const handleOpenChart = () =>{
        if(props.onClick)
            props.onClick(modalTitle, "executionLevel");
    }

    return (
        <React.Fragment>
            <CountWidget 
                data={data}
                rate={kpi.executionLevelRate}
                description={translate("_global.stats.short.executionLevel")}
                avatarClassName={"bg-info"}
                icon={<FontAwesomeIcon icon={faPersonBooth} />}
                loading={loading}
                isPercentData
                handleOpenChart={handleOpenChart}
            />
        </React.Fragment>
    )
}