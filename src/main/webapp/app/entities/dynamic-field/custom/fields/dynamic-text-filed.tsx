import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useState } from "react";
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles } from "@material-ui/core";
import { Edit, Replay, Visibility, VisibilityOff } from "@material-ui/icons";
import MyCustomRTEModal from "app/shared/component/my-custom-rte-modal";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";
import MyCustomRTE from "app/shared/component/my-custom-rte";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    truncate:{
        maxWidth: 100,
        maxHeight:10,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
    editorRootBox:{
        width: '25vw',
        [theme.breakpoints.down('sm')]:{
            width: '85vw',
        }
    },
}))

interface DynamicTextFieldProps{
    field: IDynamicField,
    val?: string,
    readonly?: boolean,
    onChange?: Function,
    onSave?: Function
}

export const DynamicTextField = (props: DynamicTextFieldProps) =>{
    const {readonly, field} = props;
    const [val, setVal] = useState(props.val);
    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const handleSave = (saved) =>{
        setVal(saved)
        setOpen(false)
        if(props.onSave)
            props.onSave(saved ? saved.toString() : saved);
    }

    const handleChange = (newVal) =>{
        setVal(newVal)
        if(props.onChange)
            props.onChange(field, newVal);
    }

    return (
        <React.Fragment>
          {field && <> 
            <MyCustomRTEModal 
                title={field.name}
                open={open}
                onSave={(!readonly && props.onSave) ? handleSave : null}
                onClose={() => setOpen(false)}
                content={val}
                readonly={readonly}
                editorMinHeight={200}
                cardClassName={classes.editorRootBox}
            />
            <Box width={1} display="flex" 
                justifyContent="center" alignItems="center" flexWrap="wrap">
                <List>
                    <ListItem>
                        <ListItemText 
                            primary={<MyCustomPureHtmlRender body={val} renderInSpan />}
                        />
                        <ListItemSecondaryAction>
                            {!readonly && 
                                <IconButton size="small" color="primary"
                                    title={translate("entity.action.edit")}
                                    onClick={() => setOpen(true)}>
                                <Edit />
                            </IconButton>}
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Box>
            </>}
        </React.Fragment>
    )
}

export default DynamicTextField;