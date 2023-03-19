import { Backdrop, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import { Close } from "@material-ui/icons";
import { translate, Translate } from "react-jhipster";
import { DeleyUnity } from "../model/enumerations/deley-unity.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '25%',
        [theme.breakpoints.down("sm")]:{
            width: '60%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
}))

interface DeleyManagerProps{
    title?:string,
    delay?: number,
    unity?: DeleyUnity,
    readonly?: boolean,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const DeleyManager = (props: DeleyManagerProps) =>{
    const { open, title, readonly } = props;

    const [delay, setDelay] = useState(props.delay);

    const [unity, setUnity] = useState(props.unity || DeleyUnity.MINUTE);

    const classes = useStyles();

    useEffect(() =>{
        setDelay(props.delay);
        setUnity(props.unity || DeleyUnity.MINUTE)
    }, [])

    const handleClose = () => props.onClose();

    const handleChangeDeley = (e) =>{
        if(!readonly){
            const value = e.target.value;
            setDelay(value);
        }
    }

    const handleChangeUnity = (e) =>{
        if(!readonly){
            const value = e.target.value;
            setUnity(value);
        }
    }

    const handleSave = (e) =>{
        e.preventDefault();
        if(props.onSave && !readonly){
            props.onSave(delay, unity);
        }
    }

    return (
        <React.Fragment>
        <Modal open={open} onClose={handleClose}
             closeAfterTransition
             BackdropComponent={Backdrop}
             BackdropProps={{
             timeout: 500,
         }}
         disableBackdropClick
         className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="h4">
                                {title || <Typography className="text-capitalize">{translate("_global.label.delay")}</Typography>}
                            </Typography>
                            <IconButton color="inherit" onClick={handleClose} className="ml-2"><Close /></IconButton>
                        </Box>}
                        className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField 
                                        type="number"
                                        value={delay}
                                        fullWidth
                                        onChange={handleChangeDeley}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <Select value={unity} onChange={handleChangeUnity}>
                                                    <MenuItem value={DeleyUnity.MINUTE}>
                                                        {translate("_global.deleyUnit.MINUTE")}
                                                    </MenuItem>
                                                    <MenuItem value={DeleyUnity.HOUR}>
                                                        {translate("_global.deleyUnit.HOUR")}
                                                    </MenuItem>
                                                    <MenuItem value={DeleyUnity.DAY}>
                                                        {translate("_global.deleyUnit.DAY")}
                                                    </MenuItem>
                                                    <MenuItem value={DeleyUnity.MONTH}>
                                                        {translate("_global.deleyUnit.MONTH")}
                                                    </MenuItem>
                                                    <MenuItem value={DeleyUnity.YEAR}>
                                                        {translate("_global.deleyUnit.YEAR")}
                                                    </MenuItem>
                                                </Select>
                                            </InputAdornment>
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                        <Button 
                                             color="primary" 
                                             variant="text"
                                             disabled={readonly}
                                             onClick={handleSave}
                                             className="float-right text-capitalize">
                                            {translate("entity.action.save")}&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faSave} />
                                        </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
            </Modal>
        </React.Fragment>
    )
}

export default DeleyManager;