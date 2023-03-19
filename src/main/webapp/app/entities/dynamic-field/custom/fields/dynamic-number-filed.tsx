import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useState } from "react";
import { Box, InputBase, makeStyles, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme =>({
}))

interface DynamicNumberFieldProps{
    field: IDynamicField,
    val?: number,
    readonly?: boolean,
    onChange?: Function,
    onSave?: Function
}

export const DynamicNumberField = (props: DynamicNumberFieldProps) =>{
    const {readonly, field} = props;
    const [val, setVal] = useState(props.val);
    const [updated, setUpdated] = useState(false);

    const classes = useStyles();

    const handleSave = () =>{
        setUpdated(false)
        if(props.onSave && val){
            props.onSave(val.toString(), field)
        }
    }

    const handleChange = (e) =>{
        const newVal = e.target.value;
        setVal(newVal)
        setUpdated(true)
        if(props.onChange && newVal)
            props.onChange(newVal.toString(), field);
    }

    return (
        <React.Fragment>
          {field && 
                <Box width={1} display="flex" justifyContent="center" 
                    alignItems="center" flexWrap="wrap">
                    {readonly && <Typography variant="body2" >{val || ''}</Typography>}
                    {!readonly && <>
                        <Box flexGrow={1}>
                            <TextField
                                type="number"
                                value={val}
                                onChange={handleChange}
                                onBlur={handleSave}
                                fullWidth
                                placeholder={field.name || ''}
                                inputProps={{ 'aria-label': field.name || '' }}
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </>
                    }
                </Box>
                }
        </React.Fragment>
    )
}

export default DynamicNumberField;