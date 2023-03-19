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
import { ITenderProviderSelectionValidation } from "app/shared/model/microprovider/tender-provider-selection-validation.model";
import { ITenderProviderSelection } from "app/shared/model/microprovider/tender-provider-selection.model";
import { IPartenerCategoryValidator } from "app/shared/model/micropartener/partener-category-validator.model";
import { SaveButton } from "app/shared/component/custom-button";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        boxShadow: 'none',
        border: 'none',
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
    validation: ITenderProviderSelectionValidation,
    onUpdateSelection?: Function,
    open?:boolean,
    onClose:Function,
    onSave?:Function,
}

export const SelectionValidationUpdate = (props: EvaluationUpdateProps) =>{
    const { open } = props;
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

    const checkValidated = () =>{
        if(validation && validation.selection){
            const selection = validation.selection;
            const tender = selection.tender;
            if(tender && selection){
                setLoading(true)
                // find validator
                const requestUri = `${API_URIS.partenerCategoryValidatorApiUri}/?categoryId.equals=${tender.targetCategoryId}`;
                axios.get<IPartenerCategoryValidator[]>(requestUri).then(result =>{
                    if(result.data){
                        let apiUri = `${API_URIS.tenderProviderSelectionApiUri}/autoValid/${selection.id}`;
                        apiUri = `${apiUri}/?approvied=${validation.approved}&validatorIds=${[...result.data].map(v => v.userId).join(',')}`;
                        console.log(apiUri)
                        setLoading(true)
                        // auto toogle selection validated attribute
                        axios.get<ITenderProviderSelection>(apiUri)
                            .then(res =>{
                                console.log(res.data);
                                if(res.data && props.onUpdateSelection){
                                    props.onUpdateSelection(res.data);
                                }
                            }).catch(e => console.log(e))
                               .finally(() => setLoading(false))  
                    }
                }).catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })
            }
         }
    }

    const formIsValid = validation && validation.validatorId

    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        setLoading(true)
        if(formIsValid){
            const request = isNew ? axios.post<ITenderProviderSelectionValidation>(`${API_URIS.providerSelectionValidationApiUri}`, cleanEntity(validation))
                    : axios.put<ITenderProviderSelectionValidation>(`${API_URIS.providerSelectionValidationApiUri}`, cleanEntity(validation))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    checkValidated();
                    if(props.onSave)
                        props.onSave(res.data, isNew);
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
                title={translate("microgatewayApp.microproviderTenderProviderSelectionValidation.home.createOrEditLabel")}
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
                                        {translate("microgatewayApp.microproviderTenderProviderSelectionValidation.approved")}
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
                                label={translate("microgatewayApp.microproviderProviderEvaluation.justification")}
                                InputLabelProps={{ shrink: true}}
                                value={validation.justification}
                                onChange={(e) => setValidation({...validation, justification: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                <SaveButton type="submit" disabled={!formIsValid} />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default SelectionValidationUpdate;