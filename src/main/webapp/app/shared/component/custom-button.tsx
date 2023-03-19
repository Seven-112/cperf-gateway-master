import { Button, ButtonProps, IconButton, IconButtonProps, makeStyles, Tooltip, TooltipProps } from "@material-ui/core";
import { Add, AttachFile, Attachment, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, Save, Visibility, VisibilityOff } from "@material-ui/icons";
import React, {  } from "react";
import { translate, Translate } from "react-jhipster";

const useStyles = makeStyles({

});

export const SaveButton = (props: ButtonProps) =>{
    const classes = useStyles();

    return (
        <React.Fragment>
            <Button variant="text" 
                color="primary"
                className="text-capitalize"
                endIcon={<Save />}
                 {...props}>
                <Translate contentKey="entity.action.save">save</Translate>&nbsp;
            </Button>
        </React.Fragment>
    )
}

export const EditIconButton = ({ btnProps, tooltipProps, onClick } : {  btnProps?: IconButtonProps, tooltipProps?: TooltipProps, onClick: Function  }) =>{
    const classes = useStyles();

    return (
        <React.Fragment>
            <Tooltip onClick={() => onClick()}
                title={<Translate contentKey="entity.action.edit">edit</Translate>}
                {...tooltipProps}>
                <IconButton color="primary" {...btnProps}>
                    <Edit />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export const AddIconButton = ({ btnProps, tooltipProps, onClick } : {  btnProps?: IconButtonProps, tooltipProps?: TooltipProps, onClick: Function  }) =>{
    const classes = useStyles();

    return (
        <React.Fragment>
            <Tooltip onClick={() => onClick()}
                title={<Translate contentKey="_global.label.add">Add</Translate>}
                {...tooltipProps}>
                <IconButton color="primary" {...btnProps}>
                    <Add />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export const DeleteIconButton = ({ btnProps, tooltipProps, onClick } : {btnProps?: IconButtonProps, tooltipProps?: TooltipProps, onClick: Function }) =>{
    const classes = useStyles();
    return (
    <React.Fragment>
        <Tooltip onClick={() => onClick()}
            title={<Translate contentKey="entity.action.delete">edit</Translate>}
            {...tooltipProps}>
            <IconButton color="secondary" {...btnProps}>
                <Delete />
            </IconButton>
        </Tooltip>
    </React.Fragment>
    )
}

export const VisibilityIconButton = ({ btnProps, tooltipProps, isOff, onClick } : {btnProps?: IconButtonProps, tooltipProps?: TooltipProps, isOff?: boolean, onClick: Function }) =>{
    const classes = useStyles();
    return (
    <React.Fragment>
        <Tooltip onClick={() => onClick()}
            title={<Translate contentKey="entity.action.view">edit</Translate>}
            {...tooltipProps}>
            <IconButton color="primary" {...btnProps}>
                {isOff ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </Tooltip>
    </React.Fragment>
    )
}
export const VArrowToogleButton = ({ 
    btnProps, 
    tooltipProps,
    down, 
    downText,
    upText,
    onClick 
    } : 
    {btnProps?: IconButtonProps, 
        tooltipProps?: TooltipProps, 
        down?: boolean,
        downText?: string,
        upText?: string,
        onClick: Function }) =>{
    const localDownText = downText || translate("_global.label.reduce");
    const localUpText =  upText || translate("entity.action.view");
    const classes = useStyles();

    return (
    <React.Fragment>
        <Tooltip onClick={() => onClick()}
            title={down ? localDownText : localUpText}
            {...tooltipProps}>
            <IconButton color="primary" {...btnProps}>
                {down ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
        </Tooltip>
    </React.Fragment>
    )
}

export const FileAttachmentButton = ({ btnProps, tooltipProps, horizontal, onClick } : {btnProps?: IconButtonProps, tooltipProps?: TooltipProps, horizontal?: boolean, onClick: Function }) =>{
    const classes = useStyles();
    return (
    <React.Fragment>
        <Tooltip onClick={() => onClick()}
            title={''}
            {...tooltipProps}>
            <IconButton color="primary" {...btnProps}>
                {horizontal ? <Attachment /> : <AttachFile />}
            </IconButton>
        </Tooltip>
    </React.Fragment>
    )
}
