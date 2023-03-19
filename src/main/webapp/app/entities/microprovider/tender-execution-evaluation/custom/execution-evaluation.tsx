import { Backdrop, Box, Card, CardContent, CardHeader, IconButton, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IUserExtra } from "app/shared/model/user-extra.model";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { IPartenerCategoryEvaluator } from "app/shared/model/micropartener/partener-category-evaluator.model";
import ExecutionEvaluationRow from "./execution-evalution-row";
import { cleanEntity } from "app/shared/util/entity-utils";
import { ITenderAnswerExecution } from "app/shared/model/microprovider/tender-answer-execution.model";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { ITenderExecutionEvaluation } from "app/shared/model/microprovider/tender-execution-evaluation.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
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
}))


export interface IEvaluatorMoy{
    userId:any,
    moy: number,
}

interface UserEvaluationProps{
    execution: ITenderAnswerExecution,
    answer:ITenderAnswer,
    open?:boolean,
    readonly?:boolean,
    providerFullName?:string,
    provider: IPartener,
    account:any,
    onAverageChage?:Function,
    onClose?:Function,
}

export const ExectuionEvaluation = (props: UserEvaluationProps) =>{
    const { open, readonly, account, execution, answer, providerFullName, provider } = props;
    const [evaluators, setEvaluators] = useState<IUserExtra[]>([]);
    const [loading, setLoading] = useState(false);
    const [moy, setMoy] = useState<number>(null);

    const classes = useStyles();


    const getUserExtras = (userIds: number[]) =>{
        if(userIds && userIds.length !== 0){
            setLoading(true)
            const requestUri = `${API_URIS.userExtraApiUri}/?userId.in=${userIds.join(',')}`;
            axios.get<IUserExtra[]>(requestUri)
            .then(res =>{
                setEvaluators([...res.data])
            }).catch((e) =>{
                console.log(e);
            }).finally(() => setLoading(false))
        }else{
            setEvaluators([]);
        }
    }

    const getEvaluators = () =>{
        if(answer && answer.tender && answer.tender.targetCategoryId){
            setLoading(true);
            const requestUri = `${API_URIS.partenerCategoryEvaluatorApiUri}/?categoryId.equals=${answer.tender.targetCategoryId}`;
            axios.get<IPartenerCategoryEvaluator[]>(requestUri)
                .then(res =>{
                    const userIds = res.data.map(pce => pce.userId)
                    getUserExtras(userIds);
                }).catch((e) =>{
                    console.log(e);
                }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getEvaluators();
        if(props.answer)
            setMoy(props.answer.executionAverage)
    }, [])

    const handleClose = () => props.onClose();

    const handleSave = (saved?:ITenderExecutionEvaluation, isNew?:boolean) =>{
        if(saved && saved.execution && saved.execution.answer){
            if(props.onAverageChage)
                props.onAverageChage(saved.execution.answer.executionAverage);
            else
                setMoy(saved.execution.answer.executionAverage)

        }
    }

    const items = [...evaluators].map(ev =>(
        <ExecutionEvaluationRow key={ev.id} evaluator={ev} execution={execution}
                 userId={account ? account.id: null} readonly={readonly}
                 provider={provider} providerName={providerFullName} onSave={handleSave} /> 
    ))

    return (
        <React.Fragment>  
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                                <Typography variant="h4">
                                    {`${translate("_tender.executionEvaluation")} (${providerFullName})`}
                                </Typography>
                        </Box>}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                        subheader={<Box textAlign="center" width={1} className="text-white">
                            <Typography variant="h4">                            
                                {moy ? `${moy.toFixed(2)}` : 'N/A'}
                            </Typography>
                        </Box>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                         <Box width={1} display="flex" flexDirection="column" flexWrap="wrap" overflow="auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">{translate("_global.label.evaluator")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.microproviderProviderEvaluation.note")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.microproviderProviderEvaluation.justification")}</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell align="center" colSpan={10}>
                                                <Typography variant="caption">Loading...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ):(
                                        evaluators.length !== 0 ? (
                                            items
                                        ):(
                                            <TableRow>
                                                <TableCell align="center" colSpan={10}>
                                                    <Typography variant="caption">
                                                        {translate("microgatewayApp.micropartenerEvaluationCriteria.home.notFound")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default ExectuionEvaluation;