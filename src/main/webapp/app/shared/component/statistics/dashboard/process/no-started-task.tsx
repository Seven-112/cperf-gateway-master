import React, { useEffect } from "react"

import { CountWidget } from "../count-widget";
import { translate } from "react-jhipster";
import { Equalizer } from "@material-ui/icons";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { IconProps } from "@material-ui/core";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export interface KpiCountWidgetProps{
    kpi: IKPI, 
    loading?: boolean,
    exceceed?: boolean,
    onClick?: Function,
    icon?: IconProps | FontAwesomeIconProps
}

export const NoStartedTask = (props: KpiCountWidgetProps) =>{
    const {kpi, loading } = props;
    
    const modalTitle = translate("_global.stats.noStartedTasks");

    const handleOpenChart = () =>{
        if(props.onClick)
            props.onClick(modalTitle, "noStarted");
    }

    return (
        <React.Fragment>
            <CountWidget 
                title={translate("microgatewayApp.microprocessTask.home.title")} 
                description={translate("_global.stats.short.noStartedTasks")}
                avatarClassName={"bg-primary"}
                icon={<Equalizer />}
                data={kpi.noStarted}
                rate={kpi.noStartedRate}
                loading={loading}
                handleOpenChart={handleOpenChart}
            />
        </React.Fragment>
    )
}