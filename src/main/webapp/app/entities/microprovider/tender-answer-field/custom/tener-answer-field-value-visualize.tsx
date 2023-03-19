import { Typography } from "@material-ui/core";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { ITenderAnswerField } from "app/shared/model/microprovider/tender-answer-field.model";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import DynamicFieldWrapper from "app/entities/dynamic-field/custom/fields/dynamic-field-wrapper";
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model";

export interface TenderAnswerFieldValueVisualizerProps{
    field: IDynamicField,
    answer: ITenderAnswer,
}

export const TenderAnswerFieldValueVisualizer = (props: TenderAnswerFieldValueVisualizerProps) =>{
    const {field, answer} = props;
    const [values, setValues] = useState<ITenderAnswerField[]>([]);
    const [loading, setLoading] = useState(false)
    
    const getValues = () =>{
        if(answer && field && field.id){
            setLoading(true);
            axios.get<ITenderAnswerField[]>(`${API_URIS.tenderAnswerFieldApiUri}/?answerId.equals=${answer.id}&fieldId.equals=${field.id}`)
                .then(res =>{
                    if(res.data)
                        setValues([...res.data]);
                }).catch((e) => console.log(e))
                .finally(() =>{
                    setLoading(false);
                })
        }
    }

    useEffect(() =>{
        getValues();
    }, [])

    const value = values && values.length !== 0 && field.type !== DynamicFieldType.FILE ? values[0].val : null;
    const fileItems = field.type === DynamicFieldType.FILE ?
                        [...values].map(item =>({
                            name: item.fileName,
                            mshzFileId: item.fileId,
                        })) : [];

    return (
        <React.Fragment>
            {loading && <Typography variant="caption" className="mr-2">Loading...</Typography>}
            {(field && answer && (value || fileItems.length)) ? <>
                <DynamicFieldWrapper 
                    readonly
                    dynamicField={field}
                    value={value}
                 />
                </> : ''
            }
        </React.Fragment>
    )
}

export default TenderAnswerFieldValueVisualizer;