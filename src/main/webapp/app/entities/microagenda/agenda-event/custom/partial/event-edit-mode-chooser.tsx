import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, makeStyles, Radio, RadioGroup, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    dialog:{
        '& .MuiDialog-paper': {
            with: '80%',
            [theme.breakpoints.down("sm")]:{
                with: '80%',
            },
        }
    },
}))

interface EventEditModeChooserProps{
    open?: boolean,
    title?: string,
    loading?: boolean,
    isPeriodiqueEvent?: boolean,
    onClose:Function,
    onConfirm: Function,
}

export const EventEditModeChooser = (props: EventEditModeChooserProps) =>{
    const { open, isPeriodiqueEvent, loading} = props;
    const [onceDeleteMode, setOnceDeleteMode] = useState(true);

    const classes = useStyles();


    const handleClose = () => props.onClose();

    const handleOk = () =>{
        props.onConfirm(onceDeleteMode);
    }

    return (
        <React.Fragment>
        <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick
            className={classes.dialog}
        >
            <DialogTitle>
                <Typography variant="h5" className="">
                    {translate(`_calendar.label.delete.${isPeriodiqueEvent ? 'pTitle' :'title'}`)}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {loading && 
                    <Box width={1} mt={1} mb={3} display="flex" 
                            justifyContent="center" alignItems="center" flexWrap="wrap">
                        <CircularProgress style={{ height:20, width:20}} color="secondary"/>
                        <Typography className="ml-2" color="secondary">loading...</Typography>    
                    </Box>
                }
                {isPeriodiqueEvent && <>
                    <RadioGroup
                        value={onceDeleteMode}
                        onChange={() => setOnceDeleteMode(!onceDeleteMode)}
                    >
                        <FormControlLabel
                            value={true}
                            control={<Radio color="primary"/>}
                            label={translate(`_calendar.label.delete.this`)}
                         />
                         <FormControlLabel
                             value={false}
                             control={<Radio color="primary"/>}
                             label={translate(`_calendar.label.delete.all`)}
                          />
                    </RadioGroup>
                </>}
            </DialogContent>
            <DialogActions>
                <Button className="text-capitalize" onClick={handleClose}>
                    {translate("_global.label.cancel")}
                </Button>
                <Button color="primary" onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    )
}
  
export default EventEditModeChooser;
