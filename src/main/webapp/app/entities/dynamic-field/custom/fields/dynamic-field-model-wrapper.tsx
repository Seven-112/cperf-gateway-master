import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, {  } from "react";
import { IconButton, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFile, faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>({
    root: {
        "& .MuiFormLabel-root": {
          color: theme.palette.primary.dark,
          textTransform: "capitalize",
        }
      }
}))

interface DynamicFieldModalWrapperProps{
    dynamicField: IDynamicField,
    readonly?:boolean,
    onUpdate?: Function,
    onOpenFile?: Function,
    onDelete?: Function,
}

export const DynamicFieldModalWrapper = (props: DynamicFieldModalWrapperProps) =>{
    const {dynamicField, readonly} = props;

    const classes = useStyles();

    const handleUpdate = () =>{
        if(props.onUpdate && !readonly)
            props.onUpdate(dynamicField);
    }

    const handleOpenFile = () =>{
        if(props.onOpenFile)
            props.onOpenFile(dynamicField)
    }

    const handleDelete = () =>{
        if(props.onDelete && !readonly)
            props.onDelete(dynamicField)
    }

    return (
        <React.Fragment>
            {dynamicField && <>
                <TextField 
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        label={`${translate("microgatewayApp.DynamicFieldType."+dynamicField.type.toString())} ${dynamicField.required ? ' *' : ''}`}
                        placeholder={`${dynamicField.name}`}
                        value=""
                        onChange={e =>{e.preventDefault()}}
                        className={classes.root}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                {dynamicField.docId && props.onOpenFile &&
                                <IconButton size="small" onClick={handleOpenFile}>
                                    <FontAwesomeIcon icon={faFile} />
                                </IconButton>}
                                {props.onUpdate && !readonly &&
                                <IconButton size="small" color="primary"
                                 className="ml-2" onClick={handleUpdate}>
                                    <FontAwesomeIcon icon={faPen} />
                                </IconButton>}
                                {props.onDelete && !readonly &&
                                <IconButton size="small" color="secondary" 
                                    className="ml-2" onClick={handleDelete}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </IconButton>}
                            </InputAdornment>
                        }}
                    />
              </>
            }
        </React.Fragment>
    )
}

export default DynamicFieldModalWrapper;