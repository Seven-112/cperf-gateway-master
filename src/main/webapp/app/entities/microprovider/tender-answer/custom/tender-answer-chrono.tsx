import { DeleyUnity } from "app/shared/model/enumerations/deley-unity.model";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { IChrono } from "app/shared/util/chrono.model";
import { addToDate } from "app/shared/util/date-utils";
import { getChrono, getChronoText } from "app/shared/util/helpers";
import clsx from "clsx";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";

interface TenderAnswerChronoProps{
    answer?: ITenderAnswer,
}

const TenderAnswerFinishedChrono = (props: {finishAt:Date, previewFinishedAt: Date}) =>{
    const { finishAt, previewFinishedAt } = props;
    const [chrono, setChrono] = useState<IChrono>(null);

    useEffect(() =>{
        if(finishAt && previewFinishedAt){
            setChrono({...getChrono(finishAt,previewFinishedAt)})
        }
    }, [finishAt, previewFinishedAt])

    return (
        <React.Fragment>
        {chrono ? ( <>
         <span className={clsx({
                 'badge badge-pill badge-success': !chrono.exceeced,
                 'badge badge-pill badge-danger': chrono.exceeced,
             })}>
                 {getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'lost': 'gained'))}
             </span>
         </>):(
            <span className='badge badge-pill badge-info'>
                {`chrono ${translate("_global.label.invalid")}`}
            </span>
         )}
        </React.Fragment>
    )
}

const TenderAnswerUnfinshedChrono = (props: {finishAt:Date, previewFinishedAt: Date}) =>{
    const { finishAt, previewFinishedAt } = props;
    const [chrono, setChrono] = useState<IChrono>(null);

    useEffect(() =>{
        if(!finishAt && previewFinishedAt){
            setTimeout(() =>{
                    setChrono({...getChrono(new Date(),previewFinishedAt)})
            }, 1000)
        }
    }, [chrono, finishAt, previewFinishedAt])

    return (
        <React.Fragment>
        {chrono ? ( <>
         <span className={clsx({
                 'badge badge-pill badge-success': !chrono.exceeced,
                 'badge badge-pill badge-danger': chrono.exceeced,
             })}>
                 {getChronoText(chrono)}&nbsp;{translate('_global.label.'+(chrono.exceeced ? 'exceeded': 'remaining'))}
             </span>
         </>):(
            <span className='badge badge-pill badge-info'>
                {`chrono ${translate("_global.label.invalid")}`}
            </span>
         )}
        </React.Fragment>
    )
}   

export const TenderAnswerChrono = (props:TenderAnswerChronoProps) =>{
    const {answer} = props;
    const [startedAt, setStartedAt] = useState<Date>(null);
    const [finishedAt, setFinishedAt] = useState<Date>(null);
    const [previewFinishAt, setPreviwFinishAt] = useState<Date>(null);
    
    useEffect(() =>{
        setStartedAt(answer.startedAt ?  new Date(answer.startedAt): null);
        setFinishedAt(answer.finishedAt ?  new Date(answer.finishedAt): null);
    }, [props.answer])
    
    useEffect(() =>{
        setPreviwFinishAt((startedAt && answer.executionDeley ) ? addToDate(startedAt,{
            exceeced:false,
            nbMinutes: (answer.executionDeleyUnity === DeleyUnity.MINUTE && answer.executionDeley) ? answer.executionDeley : 0,
            nbHours: (answer.executionDeleyUnity === DeleyUnity.MINUTE && answer.executionDeley) ? answer.executionDeley : 0,
            nbDays: (answer.executionDeleyUnity === DeleyUnity.DAY && answer.executionDeley) ? answer.executionDeley : 0,
            nbMonths: (answer.executionDeleyUnity === DeleyUnity.MONTH && answer.executionDeley) ? answer.executionDeley : 0,
            nbYears: (answer.executionDeleyUnity === DeleyUnity.YEAR && answer.executionDeley) ? answer.executionDeley : 0
        }): null);
    }, [startedAt])
    
    return (
        <React.Fragment>
            {(startedAt && previewFinishAt) ? ( <>
                    {finishedAt ? (
                        <TenderAnswerFinishedChrono finishAt={finishedAt} previewFinishedAt={previewFinishAt} />
                    ):(
                        <TenderAnswerUnfinshedChrono finishAt={finishedAt} previewFinishedAt={previewFinishAt}/>
                    )}
                </>
                ) : (
                    <span className='badge badge-pill badge-info'>
                        {`chrono ${translate("_global.label.invalid")}`}
                    </span>
                )
            }
        </React.Fragment>
    )
}

export default TenderAnswerChrono;
