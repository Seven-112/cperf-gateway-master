import { Snackbar, SnackbarProps } from "@material-ui/core"
import { Alert, AlertProps } from "@material-ui/lab";
import React from "react"

interface MyToastProps{
    snackBarProps?: SnackbarProps,
    alertProps?: AlertProps,
    open?: boolean
    message?: any,
}

const MyToast = (props:MyToastProps) =>{
    const {snackBarProps, alertProps, open, message} = props;
    return (
        <React.Fragment>
            <Snackbar open={open} {...snackBarProps} style={{ width: '100%'}}>
                <Alert variant="filled" {...alertProps}>
                    {message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export default MyToast;