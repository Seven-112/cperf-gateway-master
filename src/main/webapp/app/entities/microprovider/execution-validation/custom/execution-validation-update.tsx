import { Box, CircularProgress, FormControlLabel, Grid, IconButton, makeStyles, Switch, TextField, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IExecutionValidation } from "app/shared/model/microprovider/execution-validation.model";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { IPartenerCategoryValidator } from "app/shared/model/micropartener/partener-category-validator.model";
import { ITenderAnswerExecution } from "app/shared/model/microprovider/tender-answer-execution.model";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardcontent:{
      minHeight: '25vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    catBox:{
        borderColor: theme.palette.info.dark,
    },
    criteriaBox:{
        borderColor: theme.palette.success.dark,
    },
    ponderationBox:{
        borderColor: theme.palette.primary.dark,
    },
}))

interface EvaluationUpdateProps{
    validation: IExecutionValidation,
    tender: ITender,
    open?:boolean,
    onClose:Function,
    onSave?:Function,
    onUpdateExecution?:Function
}

export const ExecutionValidationUpdate = (props: EvaluationUpdateProps) =>{
    const { open, tender } = props;
    const [validation, setValidation] = useState(props.validation);
    const [isNew, setIsNew] = useState(!props.validation.id)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setValidation(props.validation);
        setIsNew(!props.validation.id)
    }, [props.validation])

    const handleClose = () => {
        props.onClose();
    }

    const formIsValid = validation && validation.userId


    const setExecutionValidated = (validated?:boolean) =>{
        if(validation && validation.execution && validation.execution.validated !== validated){
            const entity: ITenderAnswerExecution={
                ...validation.execution,
                validated,
            }
            axios.put<ITenderAnswerExecution>(`${API_URIS.tenderExecutionApiUri}`, cleanEntity(entity))
                .then((res) => {
                    if(res.data && props.onUpdateExecution)
                        props.onUpdateExecution(res.data);
                }).catch(e => console.log(e))
        }
    }

    const checkValidated = () =>{
        if(validation && validation.execution && tender){
            const requestUri = `${API_URIS.partenerCategoryValidatorApiUri}/?categoryId.equals=${tender.targetCategoryId}`;
            axios.get<IPartenerCategoryValidator[]>(requestUri).then(result =>{
                if(result.data && result.data.length !== 0){
                    let uri = `${API_URIS.tenderExecutionValidationApiUri}/?userId.in=${[...result.data].map(v => v.userId).join(',')}`;
                     uri = `${uri}&executionId.equals=${validation.execution.id}&approved.equals=${true}`;
                    axios.get<IExecutionValidation[]>(uri)
                        .then(res =>{
                            setExecutionValidated(!([...result.data].some(v1 => ![...res.data].some(v2 => v2.userId === v1.userId))))
                        }).catch(e => {
                            console.log(e)
                        })
                        .finally(() => {})
                }
            }).catch(err => {
                console.log(err)
            })
            .finally(() => {})
        }
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        setLoading(true)
        if(formIsValid){
            const request = isNew ? axios.post<IExecutionValidation>(`${API_URIS.tenderExecutionValidationApiUri}`, cleanEntity(validation))
                    : axios.put<IExecutionValidation>(`${API_URIS.tenderExecutionValidationApiUri}`, cleanEntity(validation))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    if(props.onSave){
                        props.onSave(res.data, isNew);
                        checkValidated();
                    }
                    if(!isNew)
                        setShowMessage(true)
                }else{
                    setSuccess(false);
                }
            }).catch(e =>{
                setSuccess(false);
                setShowMessage(true);
            }).finally(() => setLoading(false))
        }
    }

    return (
        <React.Fragment>  
            <MyCustomModal
                open={open}
                onClose={handleClose}
                rootCardClassName={classes.card}
                customCardContentClassName={classes.cardcontent}
                title={translate("microgatewayApp.microproviderExecutionValidation.home.createOrEditLabel")}
            >
                <form onSubmit={handleSave}>
                {showMessage && <Grid item xs={12}>
                        <Alert severity={success? "success" : "error"} 
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setShowMessage(false);
                                }}
                                >
                                <Close fontSize="inherit" />
                                </IconButton>}
                            >
                                {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                        </Alert>
                    </Grid>
                    }
                    <Grid container spacing={2}>
                        {loading && 
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                boxShadow={1} className={classes.catBox} borderLeft={10} borderRadius={3} p={1}>
                                <CircularProgress />
                                <Typography className="ml-3">Loading</Typography>
                            </Box>
                        </Grid>
                        }
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="center" 
                                alignItems="center" flexWrap="wrap">
                                    <Typography variant="h4" className="mr-5">
                                        {translate("microgatewayApp.microproviderExecutionValidation.approved")}
                                    </Typography>
                                    <FormControlLabel 
                                        control={
                                        <Switch checked={validation.approved}
                                            onChange={() => setValidation({...validation, approved: !validation.approved})}/>
                                        }
                                        label={translate(`_global.label.${validation.approved ? 'yes' : 'no'}`)}
                                        labelPlacement="end"
                                    />
                                </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth
                                multiline
                                name="justification"
                                margin="dense"
                                variant="outlined"
                                size="small"
                                label={translate("microgatewayApp.microproviderExecutionValidation.justification")}
                                InputLabelProps={{ shrink: true}}
                                value={validation.justification}
                                onChange={(e) => setValidation({...validation, justification: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                <SaveButton 
                                    type="submit" 
                                    className="text-success text-capitalize"
                                    disabled={!formIsValid}
                                 />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default ExecutionValidationUpdate;