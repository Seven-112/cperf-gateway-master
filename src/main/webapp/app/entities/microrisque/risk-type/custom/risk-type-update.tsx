import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IRiskType } from "app/shared/model/microrisque/risk-type.model";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
    modal:{
        display:'flex',
        justifyContent:'center',
    },
    card:{
        width: '35%',
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        marginTop: theme.spacing(15),
    },
    cardHeader:{
        background: theme.palette.info.dark,
        color: theme.palette.background.paper,
        borderRadius: '5px 5px 0 0',
        paddingTop:1,
        paddingBottom:1,
    },
    cardContent:{
        background: theme.palette.background.paper,
        maxHeight: '80%',
        overflow: 'auto',
    }
}))

interface RiskTypeUpdateProp{
    riskType?:IRiskType,
    open?:boolean,
    onClose:Function,
    onSave:Function
}

export const RiskTypeUpdate = (props: RiskTypeUpdateProp) =>{
    const {open, riskType} = props;
    const [name, setName] = useState(props.riskType ? props.riskType.name : null);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const handleClose = () => props.onClose();

    const handleSave = () =>{
        if(name){
            setLoading(true);
            const entity: IRiskType = {
                ...riskType,
                name
            }

            const request = entity.id ? axios.put<IRiskType>(`${API_URIS.riskTypeApiUri}`, cleanEntity(entity))
                                      : axios.post<IRiskType>(`${API_URIS.riskTypeApiUri}`, cleanEntity(entity));
            request.then(res =>{
                props.onSave(res.data);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false));
        }
    }

    return (
        <React.Fragment>
            <Modal 
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout:100,
                }}
                disableBackdropClick
                onClose={handleClose}
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={translate(`microgatewayApp.microrisqueRiskType.home.${riskType && riskType.id ? 'createOrEditLabel' : 'createLabel'}`)}
                        className={classes.cardHeader}
                        action={
                            <IconButton onClick={handleClose} color="inherit"><Close /></IconButton>
                        }
                    />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            {loading && <Grid item xs={12}>
                                <Box textAlign="center">
                                    <CircularProgress />
                                </Box>
                                <Typography display="block" className="font-weight-bold text-center">Loading...</Typography>
                            </Grid>}
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    value={name}
                                    label={translate('microgatewayApp.microrisqueRiskType.name')}
                                    size="small"
                                    variant="outlined"
                                    onChange={(e) => { setName(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button size="small" color="primary"
                                    variant="contained" disabled={!name}
                                    onClick={handleSave}>
                                    {translate('entity.action.save')}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default RiskTypeUpdate;