import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { BoxProps, IconProps } from "@material-ui/core";
import { IPerfIndicator, StatCategory } from "app/shared/model/perf-indicator.model";
import { API_URIS } from "app/shared/util/helpers";
import { AxiosResponse } from "axios";
import React, {useEffect, useState } from "react"
import { CountWidgetProps } from "../count-widget";
import { ModalChartPreviewer } from "../modal-chart-previewer";

interface UniqueIndicatorWrapperProps extends CountWidgetProps{
    getData?: getDataFn,
    userIds?: any[],
    chartApiBaseUri?: string,
    chartModalTitle?: string,
    dispalyChartAvg?: boolean,
}

export const oneIndicatorHOC = (WrappedComponent) => 
    (props: UniqueIndicatorWrapperProps) => {
    const [loading, setLoading] = useState(false);
    const [indicator,setIndicator] = useState<IPerfIndicator>(null);
    const [openChart, setOpenChart] = useState(false);

    const { getData, chartApiBaseUri, chartModalTitle, dispalyChartAvg } = props;


    const getIndicator = () =>{
        if(getData){
            setLoading(true)
            getData(props.userIds)
                .then(res =>{
                    setIndicator(res.data);
                }).catch(e =>{
                    console.log(e)
                }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getIndicator();
    }, [props.userIds])

    const handleOpenChart = chartApiBaseUri ? () => setOpenChart(true) : null;

    return (<React.Fragment>
        {/* (openChart && chartApiBaseUri) && 
         <ModalChartPreviewer
            title={chartModalTitle}
            apiBaseUri={chartApiBaseUri}
            displayAvg={dispalyChartAvg}
            userIds={props.userIds}
            open={openChart}
            onClose={() => setOpenChart(false)}
    />v */}
        <WrappedComponent  {...props} 
            loading={loading} indicator={indicator}
            handleOpenChart={handleOpenChart} />
    </React.Fragment>)
}

type getDataFn = (userIds?: any[]) => Promise<AxiosResponse<IPerfIndicator>>