import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { IChrono, defaultValue as defaultChrono } from "app/shared/util/chrono.model";
import { getChrono, getChronoText } from "app/shared/util/helpers";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";

interface IAuditChornoProps{
    audit: IAudit
}
const AuditChrono = (props: IAuditChornoProps) =>{
    const [chrono, setChrono] = useState<IChrono>({...defaultChrono});

    const previewEndDate = props.audit &&  props.audit.endDate ? new Date(props.audit.endDate) : null;

    const endDate = props.audit && props.audit.executedAt ? new Date(props.audit.executedAt) : null;

    const isChronometable = props.audit.startDate && props.audit && [AuditStatus.STARTED, AuditStatus.EXECUTED,
                 AuditStatus.SUBMITTED, AuditStatus.COMPLETED].some(stat => stat = props.audit.status);

    const calclulChrono = () =>{
        if(props.audit){
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
    }, [props.audit])
    

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

export default AuditChrono;