import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useState } from "react";
import { Box, FormControlLabel, makeStyles, Switch, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
}))

interface DynamicBooleanFieldProps{
    field: IDynamicField,
    val?: boolean,
    readonly?: boolean,
    onChange?: Function,
    onSave?: Function
}

export const DynamicBooleanField = (props: DynamicBooleanFieldProps) =>{
    const {readonly, field} = props;
    const [val, setVal] = useState(props.val);

    const classes = useStyles();

    const handleChange = () =>{
           const newVal = !val;
           setVal(newVal);
            if(props.onChange)
                props.onChange(newVal.toString(), field);
            if(props.onSave)
                props.onSave(newVal.toString(), field)
    }

    return (
        <React.Fragment>
          {field &&
            <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                {readonly && <Typography>
                    {val ? translate("_global.label.yes") : translate("_global.label.no")}
                </Typography>}
                {!readonly && 
                    <FormControlLabel 
                        control={<Switch checked={val} color="primary" onChange={handleChange}/>}
                        label={val ? translate("_global.label.yes") : translate("_global.label.no")}
                        labelPlacement="end"
                    />
                }
            </Box>
            }
        </React.Fragment>
    )
}

export default DynamicBooleanField;