import { Box, Button, CircularProgress, Grid, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { IEvaluationCriteria } from "app/shared/model/micropartener/evaluation-criteria.model";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { IProviderEvaluation } from "app/shared/model/microprovider/provider-evaluation.model";
import { Alert } from "@material-ui/lab";
import { cleanEntity } from "app/shared/util/entity-utils";
import PartenerVisualizer from "app/entities/micropartener/partener/custom/partener-visualizer";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
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
      minHeight: '35vh',
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
    evaluation: IProviderEvaluation,
    criteria: IEvaluationCriteria,
    userFullName?: string,
    open?:boolean,
    providerId?:any,
    onClose:Function,
    onSave?:Function,
}

export const EvaluationUpdate = (props: EvaluationUpdateProps) =>{
    const { open, criteria, providerId } = props;
    const [evaluation, setEvaluation] = useState(props.evaluation);
    const [isNew, setIsNew] = useState(!props.evaluation.id)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setEvaluation(props.evaluation);
        setIsNew(!props.evaluation.id)
    }, [props.evaluation])

    const handleClose = () => {
        props.onClose();
    }

    const category = criteria.category || {};

    const norMalizeNote = (value: number) =>{
        if(value){
            const noteMax = category.noteMax || 20;
            const noteMin = category.noteMin || 0;
            return value < noteMin ? noteMin : value > noteMax ? noteMax : value ;
        }
        return 0;
    }

    const handleChageNote = (e) =>{
        setEvaluation({...evaluation,note: norMalizeNote(Number(e.target.value))});
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        setLoading(true)
        if(evaluation && evaluation.answer && evaluation.criteriaId && evaluation.note && evaluation.userId){
            const entity: IProviderEvaluation = {
                ...evaluation,
                storeAt: isNew? (new Date()).toISOString() : evaluation.storeAt,
                updateAt: (new Date()).toISOString(),
                note: norMalizeNote(evaluation.note),
                scale: (category && category.noteMax ) ? category.noteMax : 20,
                userFullName: props.userFullName || '',
                ponderation: criteria.ponderation
            }

            const request = isNew ? axios.post<IProviderEvaluation>(`${API_URIS.providerEvaluationApiUri}`, cleanEntity(entity))
                    : axios.put<IProviderEvaluation>(`${API_URIS.providerEvaluationApiUri}`, cleanEntity(entity))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    if(props.onSave){
                        props.onSave(res.data, isNew);
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
                title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                        <Typography variant="h4" className="mr-2">{translate("_global.label.provider")}&nbsp;&nbsp;:</Typography>
                        <Typography>{<PartenerVisualizer id={providerId} />}</Typography>
                </Box>}
                subheader={
                    <Box width={1} textAlign="center">
                        <Typography variant="h4" className="mr-5 text-capitalize">
                            {translate("_global.label.evaluation")}
                        </Typography>
                    </Box>
                }
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
                            <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                boxShadow={1} className={classes.catBox} borderLeft={10} borderRadius={3} p={1}>
                                <Typography className="mr-3">
                                    {translate("microgatewayApp.micropartenerPartenerCategory.detail.title")}
                                </Typography>
                                <Typography>{category.name || ''}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" alignItems="center"
                                boxShadow={1} className={classes.criteriaBox} borderRight={10} borderRadius={3} p={1}>
                                <Typography className="mr-3">
                                    {translate("microgatewayApp.micropartenerEvaluationCriteria.detail.title")}
                                </Typography>
                                <Typography>{criteria.name}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" alignItems="center"
                                boxShadow={1} className={classes.ponderationBox} borderLeft={10} borderRadius={3} p={1}>
                                <Typography className="mr-3">
                                    {translate("microgatewayApp.micropartenerEvaluationCriteria.ponderation")}
                                </Typography>
                                <Typography>{criteria.ponderation}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                name="note"
                                type="number"
                                value={evaluation.note}
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label={translate("microgatewayApp.microproviderProviderEvaluation.note")}
                                placeholder={translate("_global.label.giveScoreBetween",
                                    {n1: category.noteMin || 0, n2: category.noteMax || 20})}
                                onChange={handleChageNote}
                            />
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
                                value={evaluation.justification}
                                onChange={(e) => setEvaluation({...evaluation, justification: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                <Button type="submit" variant="text" color="primary" className="text-capitalize"
                                    disabled={!evaluation || !evaluation.note || !evaluation.answer || !evaluation.criteriaId}>
                                    {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default EvaluationUpdate;