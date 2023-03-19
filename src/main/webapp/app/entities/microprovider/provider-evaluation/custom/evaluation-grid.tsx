import { Box, makeStyles, Typography } from "@material-ui/core";
import { IUserExtra } from "app/shared/model/user-extra.model";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { IProviderEvaluation } from "app/shared/model/microprovider/provider-evaluation.model";
import { IPartenerCategoryEvaluator } from "app/shared/model/micropartener/partener-category-evaluator.model";
import UserEvaluation from "./user-evalution";
import PartenerVisualizer from "app/entities/micropartener/partener/custom/partener-visualizer";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles(theme =>({
    card:{
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
    cardcontent:{
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
}))


export interface IEvaluatorMoy{
    userId:any,
    moy: number,
}

interface UserEvaluationGridProps{
    answer: ITenderAnswer,
    open?:boolean,
    readonly?:boolean,
    account:any,
    onAnswerChange?:Function,
    onClose?:Function,
}

export const EvaluationGrid = (props: UserEvaluationGridProps) =>{
    const { open, readonly } = props;
    const [evaluators, setEvaluators] = useState<IUserExtra[]>([]);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<ITenderAnswer>(props.answer);

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
        setAnswer(props.answer)
        getEvaluators();
    }, [])

    const handleClose = () => props.onClose();

    const handleEvaluationSave = (saved?: IProviderEvaluation) =>{
        if(saved && saved.answer){
            setAnswer(saved.answer);
            if(props.onAnswerChange)
                props.onAnswerChange(saved.answer);
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
                        <Typography>{<PartenerVisualizer id={answer ? answer.providerId : null} />}</Typography>
                </Box>}
                subheader={<Box textAlign="center" width={1} className="text-white">
                    <Typography variant="h4">                            
                        {(answer && answer.average) ? `${answer.average.toFixed(2)}` : 'N/A'}
                    </Typography>
                </Box>}
            >
                <Box width={1} className={classes.cardcontent}>
                    {loading && <Box textAlign="center" width={1}>Loading...</Box>}
                    {(!loading &&  evaluators.length === 0 ) &&
                        <Box width={1} textAlign="center">
                            {translate("microgatewayApp.micropartenerPartenerCategoryEvaluator.home.notFound")}
                        </Box>
                    }
                    {evaluators.length !== 0 && 
                        <Box width={1} display="flex" flexDirection="column" flexWrap="wrap" overflow="auto">
                        {evaluators.map((ev, index) =>(
                            <UserEvaluation key={index} evaluator={ev} 
                                answer={answer} account={props.account}
                                providerId={answer ? answer.providerId : null} 
                                readonly={readonly}
                                onSave={handleEvaluationSave}/>
                        ))}
                    </Box>}
                </Box>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default EvaluationGrid;