import clsx from "clsx";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { IChrono } from "../util/chrono.model";
import { getChrono, getChronoText } from "../util/helpers";

interface ChronoDiffrentePrivisualizerProps{
    startDate: Date,
    endDate: Date,
    clearTime?:boolean
}

export const ChronoDiffrentePrivisualizer = (props: ChronoDiffrentePrivisualizerProps) =>{
    const {startDate, endDate, clearTime} = props;
    const [chrono, setChrono] = useState<IChrono>(null);

    useEffect(() =>{
        if(startDate && endDate){
            if(clearTime){
                endDate.setHours(0);
                endDate.setMinutes(0);
                endDate.setSeconds(0);
                endDate.setMilliseconds(0);
    
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);
                startDate.setMilliseconds(0);
            }
        }
        setChrono(getChrono(endDate,startDate));
    }, [])
    
    return (
        <React.Fragment>
        {chrono ? (
            <span className={clsx({
                    'badge badge-pill badge-success': !chrono.exceeced,
                    'badge badge-pill badge-danger': chrono.exceeced,
                })}>
                    { getChronoText(chrono)}&nbsp;
                    {translate('_global.label.'+(chrono.exceeced ? 'lost': 'gained'))}
                </span>
            ): '...'}
        </React.Fragment>
    )
}

export default ChronoDiffrentePrivisualizer;