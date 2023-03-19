import { makeStyles } from "@material-ui/core";
import theme from "app/theme";
import clsx from "clsx";
import React from "react";
import MyCustomModal from "./my-custom-modal";
import MyCustomRTE, { IMyCustomRTE } from "./my-custom-rte";

const useStyles = makeStyles({
    modal:{
        width: '50%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
    },
    cardHeader:{
        borderRadius: '5px 5px 0 0',
    },
    cardFooter:{
        borderRadius: '0 0 5px 5px',
    }
})

export interface MyCustomRTEModalProps extends IMyCustomRTE{
    open?: boolean,
    title?: string,
    cardClassName?: string,
    onClose: Function,
}

export const MyCustomRTEModal = (props: MyCustomRTEModalProps) =>{
    
    const { open, label, title, readonly } = props;

    const classes = useStyles();

    const onSave = (newContent) =>{
        if(!readonly && props.onSave)
            props.onSave(newContent);
    }

    const handleClose = () =>{
        if(props.onClose)
            props.onClose();
    }

    return (
        <React.Fragment>
            <MyCustomModal open={open} onClose={handleClose}
                title={title || `${label || ''}` } 
                headerClassName={classes.cardHeader}
                foolterClassName={classes.cardFooter}
                rootCardClassName={clsx(classes.modal, { [props.cardClassName] : props.cardClassName})}>
                  <MyCustomRTE 
                    content={props.content}
                    editorMaxHeight={props.editorMaxHeight}
                    editorMinHeight={props.editorMinHeight}
                    readonly={readonly}
                    label={label}
                    labelProps={props.labelProps}
                    onSave={onSave}
                    rootBoxProps={props.rootBoxProps}
                  />
            </MyCustomModal>
        </React.Fragment>
    );
}

export default MyCustomRTEModal;