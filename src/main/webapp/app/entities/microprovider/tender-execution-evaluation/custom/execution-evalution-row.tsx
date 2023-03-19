import { Box, Collapse, Divider, IconButton, makeStyles, TableCell, TableRow, Typography } from "@material-ui/core";
import { IUserExtra } from "app/shared/model/user-extra.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { translate } from "react-jhipster";
import { Edit, Visibility, VisibilityOff } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { IEvaluatorMoy } from "./execution-evaluation";
import { ITenderExecutionEvaluation } from "app/shared/model/microprovider/tender-execution-evaluation.model";
import { ITenderAnswerExecution } from "app/shared/model/microprovider/tender-answer-execution.model";
import ExecutionEvaluationUpdate from "./execution-evaluation-update";
import { IPartener } from "app/shared/model/micropartener/partener.model";

const useStyles = makeStyles(theme =>({
    card:{
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    cardheader:{
        background: theme.palette.primary.dark,
        color: 'white',
        borderRadius: '15px 15px 0 0',
        paddingTop: 5,
        paddingBottom: 5,
    },
    cardcontent:{
    },
}))

interface ExecutionEvaluationRowProps{
     execution: ITenderAnswerExecution,
     evaluator: IUserExtra,
     provider: IPartener,
     providerName?:string,
     userId:any,
     readonly?:boolean,
     onSave?:Function,
}


export const ExecutionEvaluationRow = (props: ExecutionEvaluationRowProps) =>{
    const {evaluator, provider, userId, execution, providerName, readonly} = props;
    const [evaluation, setEvaluation] = useState<ITenderExecutionEvaluation>(null);
    const [evaluationForm, setEvaluationForm] = useState<ITenderExecutionEvaluation>(null);
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    const userFullName = evaluator ? evaluator.employee ? `${evaluator.employee.firstName || ''} ${evaluator.employee.lastName || ''}`
                                            : `${evaluator.user.firstName || ''} ${evaluator.user.lastName || ''}` : '';

    const getEvaluation = () =>{
        if(execution){
            let requestUri = `${API_URIS.tenderExecutionEvaluationApiUri}`;
            requestUri = `${requestUri}/?userId.equals=${evaluator.id}&executionId.equals=${execution.id}`;
            axios.get<ITenderExecutionEvaluation[]>(requestUri)
            .then(res =>{
                console.log(res.data)
                if(res.data && res.data.length !==0){
                    setEvaluation(res.data[0])
                }else{
                    setEvaluation(null);
                }
            }).catch((e) =>{
                console.log(e);
                setEvaluation(null)
            }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getEvaluation();
    }, [])

    const handleEdit = () =>{
        if(!readonly){
            if(evaluation){
                setEvaluationForm(evaluation);
            }else{
                setEvaluationForm({execution, userId, userFullName, ponderation:1})
            }
            setOpenForm(true);
        }
    }

    const handleSave = (saved?:ITenderExecutionEvaluation, isNew?:boolean) =>{
        if(saved){
            setEvaluation(saved);
            setOpenForm(false);
            if(props.onSave)
                props.onSave(saved, isNew);
        }
    }

    const canEdit = (evaluator && userId === evaluator.id && !readonly)

    return (
        <>
        {(canEdit && evaluationForm) &&
            <ExecutionEvaluationUpdate 
                evaluation={evaluationForm}
                provider={provider}
                open={openForm}
                providerName={providerName}
                userFullName={userFullName}
                onSave={handleSave}
                onClose={() => setOpenForm(false)}
             />
        }
        <TableRow >
            {loading ? (
                <TableCell align="center" colSpan={10}>
                    <Typography variant="caption">Loading...</Typography>
                </TableCell>
            ):(
            <>
                <TableCell align="center">{userFullName || '...'}</TableCell>
                <TableCell align="center">
                    {(evaluation && (evaluation.note  || evaluation.note === 0)) ? `${evaluation.note}/${evaluation.scale}` : 'N/A'}
                </TableCell>
                <TableCell align="center">
                    {(evaluation && evaluation.justification) ? (
                        <IconButton onClick={() => setOpen(!open)}>
                            {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    ):'N/A'}
                </TableCell>
                <TableCell align="center">
                    {canEdit ? (
                        <IconButton 
                            color="primary"
                            title={translate("entity.action.edit")}
                            onClick={handleEdit}
                            >
                            <Edit />
                        </IconButton>
                    )
                    :(
                        <FontAwesomeIcon icon={faLock} />
                    )}
                </TableCell>
             </>
            )}
        </TableRow>
        {(evaluation && evaluation.justification) && <TableRow>
        <TableCell colSpan={10} className="border-0 m-0 p-0">
                <Collapse in={open}
                    unmountOnExit
                    timeout={300}>
                            <Box width="98%" display="flex" flexDirection="column" 
                                flexWrap="wrap" overflow="auto"
                                boxShadow={5} borderRadius={7} m={1} p={3}>
                                <Typography variant="h3" color="secondary">
                                    {translate("microgatewayApp.microproviderProviderEvaluation.justification")}
                                </Typography>
                                <Divider  className="mb-2"/>
                                <Typography>{evaluation.justification}</Typography>
                            </Box>
                </Collapse>
            </TableCell>
        </TableRow>}
        </>
    )
}

export default ExecutionEvaluationRow;