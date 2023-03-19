import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React from "react";
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model";
import DynamicTextField from "./dynamic-text-filed";
import DynamicNumberField from "./dynamic-number-filed";
import DynamicBooleanField from "./dynamic-boolean-field";
import DynamicDateField from "./dynamic-date-filed";
import DynamicDatetimeField from "./dynamic-datetime-filed";
import DynamicFileField from "./dynamic-file-filed";

interface DynamicFieldWrapperProps{
    dynamicField: IDynamicField,
    value?: string,
    readonly?: boolean,
    fileFiledEntityId?: any,
    onChange?: Function,
    onSave?: Function,
}

export const DynamicFieldWrapper = (props: DynamicFieldWrapperProps) =>{
    const {dynamicField, readonly, value} = props;

    const handleSave = (saved) =>{
        if(props.onSave)
            props.onSave(saved, dynamicField)
    }

    const handleChange = (newVal) =>{
        if(props.onChange)
            props.onChange(newVal, dynamicField);
    }

    return (
        <React.Fragment>
            {dynamicField && <>
                {(!dynamicField.type || dynamicField.type === DynamicFieldType.TEXT) && 
                    <DynamicTextField 
                        field={dynamicField}
                        val={value}
                        readonly={readonly}
                        onSave={props.onSave ? handleSave : null}
                        onChange={props.onChange ? handleChange : null}
                    />
                }
                {dynamicField.type === DynamicFieldType.DATETIME && 
                    <DynamicDatetimeField 
                        field={dynamicField}
                        val={value ? new Date(value) : null}
                        readonly={readonly}
                        onSave={props.onSave ? handleSave : null}
                        onChange={props.onChange ? handleChange : null}
                    />
                }
                {dynamicField.type === DynamicFieldType.DATE && 
                    <DynamicDateField 
                        field={dynamicField}
                        val={value ? new Date(value) : null}
                        readonly={readonly}
                        onSave={props.onSave ? handleSave : null}
                        onChange={props.onChange ? handleChange : null}
                    />
                }
                {dynamicField.type === DynamicFieldType.NUMBER && 
                    <DynamicNumberField 
                        field={dynamicField}
                        val={value ? Number(value) : null}
                        readonly={readonly}
                        onSave={props.onSave ? handleSave : null}
                        onChange={props.onChange ? handleChange : null}
                    />
                }
                {dynamicField.type === DynamicFieldType.BOOLEAN && 
                    <DynamicBooleanField 
                        field={dynamicField}
                        val={(!value || value === 'false' || value === '0') ? false : true}
                        readonly={readonly}
                        onSave={props.onSave ? handleSave : null}
                        onChange={props.onChange ? handleChange : null}
                />}
                {dynamicField.type === DynamicFieldType.FILE && 
                    <DynamicFileField 
                        field={dynamicField}
                        readonly={readonly}
                        fileEntityId={props.fileFiledEntityId}
                        onSave={props.onSave ? handleSave : null}
                />}
              </>
            }
        </React.Fragment>
    )
}

export default DynamicFieldWrapper;