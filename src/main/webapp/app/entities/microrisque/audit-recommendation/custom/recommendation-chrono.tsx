import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { IChrono, defaultValue as defaultChrono } from "app/shared/util/chrono.model";
import { getChrono, getChronoText } from "app/shared/util/helpers";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";

interface IRecommendationChronoProps{
    recom: IAuditRecommendation
}
const RecommendationChrono = (props: IRecommendationChronoProps) =>{
    const [chrono, setChrono] = useState<IChrono>({...defaultChrono});

    const previewEndDate = props.recom &&  props.recom.dateLimit ? new Date(props.recom.dateLimit) : null;

    const endDate = props.recom && props.recom.executedAt ? new Date(props.recom.executedAt) : null;

    const isChronometable = props.recom.editAt && props.recom && [AuditStatus.STARTED, AuditStatus.EXECUTED,
                 AuditStatus.SUBMITTED, AuditStatus.COMPLETED].some(stat => stat = props.recom.status);

    const calclulChrono = () =>{
        if(props.recom){
            if(isChronometable && previewEndDate){
                if(endDate){
                    setChrono({...getChrono(endDate, previewEndDate)})
                }
                else{
                    setChrono({...getChrono(new Date(), previewEndDate)});
                } 
            }else{
                setChrono({...defaultChrono});
            }
        }
    }

    useEffect(() =>{
        setTimeout(() => calclulChrono(), 1000);
    }, [chrono])

    useEffect(() =>{
        calclulChrono();
    }, [props.recom])
    

    return (
        <React.Fragment>
            {(isChronometable && chrono) ? (
                <>
                {!endDate ? (
                    <span className={clsx({
                            'badge badge-pill badge-info': !chrono.exceeced,
                            'badge badge-pill badge-warning': chrono.exceeced,
                    })}>{getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'remaining'))}</span>
                 ):(
                    <span className={clsx({
                            'badge badge-pill badge-success': !chrono.exceeced,
                            'badge badge-pill badge-danger': chrono.exceeced,
                    })}>{ getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'gained'))}</span>
                 )
                }
                </>
            ): '...'}
        </React.Fragment>
    )
}

export default RecommendationChrono;