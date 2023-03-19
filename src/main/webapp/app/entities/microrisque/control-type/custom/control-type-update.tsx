import { Avatar, Backdrop, Box, Card, CardContent, CardHeader, Fab, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core"
import { AcUnit, Save } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { IControlType } from "app/shared/model/microrisque/control-type.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { API_URIS } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme => ({
    modal: {
        display: "flex",
        justifyContent: "center"
    },
    card: {
        width: "35%",
        marginTop: theme.spacing(7),
        background: "transparent",
        boxShadow: "none",
    },
    cardHeader:{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        paddingTop:3,
        paddingBottom:3,
        borderRadius:"10px 10px 0 0"
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
        maxHeight: "80%",
        minHeight: "20%",
        overflow: "auto",
        borderRadius:"0 0 10px 10px"
    },
}))

interface ControlTypeUpdateProps{
    open?:boolean,
    type?:IControlType,
    onClose:Function,
    onSave:Function,
}

export const ControlTypeUpdate = (props:ControlTypeUpdateProps) => {
    const {open} = props;
    const classes = useStyles()
    const [typeCtrl, setTypeCtrl]= useState<IControlType>(props.type)
    const [isNew, setIsNew] = useState(!props.type || !props.type.id)

    const handleClose = () => props.onClose()
    
    const handleChange= (e) => {
        const {value, name} = e.target;
        setTypeCtrl({...typeCtrl, [name]: value})
    }

    useEffect(()=> {
        setTypeCtrl(props.type)
        setIsNew(!props.type || !props.type.id)
    }, [props.type])

    const onSave = (event) =>{
        event.preventDefault();
        if(typeCtrl.type){
           const request= isNew ? axios.post<IControlType>(API_URIS.riskControlTypeApiUri, cleanEntity(typeCtrl))
                                 :axios.put<IControlType>(API_URIS.riskControlTypeApiUri, cleanEntity(typeCtrl))
           request.then((res)=>{
            props.onSave(res.data, isNew)
        })
        
        }
        
       
    }

    return (
    <React.Fragment>
        <Modal 
         open={open}
         onClose={handleClose}
         disableBackdropClick
         BackdropComponent={Backdrop}
         BackdropProps={{
             timeout:300
         }}
         closeAfterTransition
         className={classes.modal}
        >
            <Card className={classes.card}>
                <CardHeader
                    title={ 
                        <Typography variant="h4" className="mr-3">
                            {translate("microgatewayApp.microrisqueControlType.home.createOrEditLabel")}
                        </Typography>
                    }
                    avatar = {
                        <Avatar>
                            <AcUnit/>
                        </Avatar>
                    }
                    action = {
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close/>
                        </IconButton>
                    }
                    className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                    <Box>
                        <form onSubmit={onSave}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField value={typeCtrl.type} 
                                    name="type" 
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label={translate("microgatewayApp.microrisqueControlType.type")}
                                    onChange={handleChange}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Fab type="submit" variant="extended" size="small"
                                        color="primary" className="float-right" disabled={!typeCtrl.type}>
                                        <Typography>{translate("entity.action.save")}</Typography>&nbsp;
                                        <Save />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Modal>
    </React.Fragment>)
}

ControlTypeUpdate.defaultProps= {
    type: {}
}
export default ControlTypeUpdate;
