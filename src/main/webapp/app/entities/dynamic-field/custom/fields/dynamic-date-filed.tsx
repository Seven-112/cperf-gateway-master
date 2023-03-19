import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useState } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { TextFormat, translate } from "react-jhipster";
import { convertDateTimeToServer } from "app/shared/util/date-utils";

const useStyles = makeStyles(theme =>({
}))

interface DynamicDateFieldProps{
    field: IDynamicField,
    val?: Date,
    readonly?: boolean,
    onChange?: Function,
    onSave?: Function
}

export const DynamicDateField = (props: DynamicDateFieldProps) =>{
    const {readonly, field} = props;
    const [val, setVal] = useState(props.val);

    const classes = useStyles();

    const handleChange = (newDate?: Date) =>{
        setVal(newDate)
        if(props.onChange && newDate)
            props.onChange(newDate.toString(), field);
        if(props.onSave && newDate){
            props.onSave(newDate.toString(), field)
        }
    }

    return (
        <React.Fragment>
          {field && 
            <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                {(readonly && val) && <TextFormat type="date" value={val} format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />}
                {!readonly && <>
                    <KeyboardDatePicker
                        value={val}
                        onChange={handleChange}
                        fullWidth
                        placeholder={field.name || ''}
                        inputProps={{ 'aria-label': field.name || '' }}
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        size="small"
                    />
                </>
                }
            </Box>
            }
        </React.Fragment>
    )
}

export default DynamicDateField;