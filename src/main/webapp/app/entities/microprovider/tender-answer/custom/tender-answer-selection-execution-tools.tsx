import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, CircularProgress, IconButton, makeStyles, Slide, Switch } from "@material-ui/core";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { ITenderProviderSelection } from "app/shared/model/microprovider/tender-provider-selection.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import TenderAnswerChrono from "./tender-answer-chrono";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import SelectionValidation from "../../tender-provider-selection-validation/custom/selection-validation";
import { ITenderAnswerExecution } from "app/shared/model/microprovider/tender-answer-execution.model";
import ExecutionValidation from "../../execution-validation/custom/execution-validation";
import { faCheckCircle, faDolly, faEnvelope, faLock, faPlay, faTasks } from "@fortawesome/free-solid-svg-icons";
import { cleanEntity } from "app/shared/util/entity-utils";
import TenderAnswerExecutionUpdate from "../../tender-answer-execution/custom/tender-answer-execution-update";
import ExectuionEvaluation from "../../tender-execution-evaluation/custom/execution-evaluation";
import ProviderExpeditionUpdate  from "../../provider-expedition/custom/provider-expedition-update";
import { IProviderExpedition } from "app/shared/model/microprovider/provider-expedition.model";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction, PrivilegeEntity } from "app/shared/model/enumerations/privilege-action.model";
import MyToast from "app/shared/component/my-toast";

const useStyles = makeStyles(theme => ({
    
}))

interface ITenderAnswerSelectionExecutionToolsProps{
    answer: ITenderAnswer,
    selectedAnswer:ITenderAnswer,
    provider: IPartener,
    providerName?:string,
    account:any,
    onSelectChange?:Function,
    onExecutionAverageChange?: Function,
    rootBoxProps?: BoxProps
}

export const TenderAnswerSelectionExecutionTools = (props: ITenderAnswerSelectionExecutionToolsProps) =>{
    const {provider, account, rootBoxProps, providerName} = props;
    const [answer, setAnswer] = useState(props.answer);
    const [selection, setSelection] = useState<ITenderProviderSelection>(null);
    const [selectChanging, setSelectChanging] = useState(false);
    const [openValidation, setOpenValidation] = useState(false);
    const [openExecution, setOpenExecution] = useState(false);
    const [openExecutionValidation, setOpenExecutionValidation] = useState(false)
    const [openExecutionEvaluation, setOpenExecutionEvaluation] = useState(false)
    const [execution, setExecution] = useState<ITenderAnswerExecution>(null);
    const [openExpedition, setOpenExpedition] = useState(false);
    const [expedition, setExpedition] = useState<IProviderExpedition>();
    const [emailSending, setEmailSending] = useState(false);
    const classes = useStyles();

    const getSelection = () =>{
        if(answer && provider){
            let requestUri = `${API_URIS.tenderProviderSelectionApiUri}/?tenderId.equals=${answer.tender.id}`;
            requestUri = `${requestUri}&providerId.equals=${provider.id}&page=${0}&size=${1}`;
            axios.get<ITenderProviderSelection[]>(requestUri)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setSelection(res.data[0])
                    }else{
                        setSelection(null);
                    }
                    console.log("selection",res.data)
                }).catch(e => console.log(e))
        }else{
            setSelection(null)
        }
    }
    
    const getExecution = () =>{
        if(answer){
             axios.get<ITenderAnswerExecution[]>(`${API_URIS.tenderExecutionApiUri}/?answerId.equals=${answer.id}`)
                .then(res =>{
                if(res.data && res.data.length !== 0){
                    setExecution(res.data[res.data.length-1]);
                }else{
                    setExecution({});
                }
            }).catch(e =>{
                console.log(e)
            }).finally(() => {})
        }
    }

    const getExepedition = () =>{
        if(answer){
             axios.get<IProviderExpedition[]>(`${API_URIS.providerExpeditionApiUri}/?answerId.equals=${answer.id}`)
                .then(res =>{
                if(res.data && res.data.length !== 0){
                    setExpedition(res.data[0]);
                }else{
                    setExpedition({});
                }
            }).catch(e =>{
                console.log(e)
            }).finally(() => {})
        }
    }

    useEffect(() =>{
        setAnswer(props.answer);
        getExecution();
        getExepedition();
    }, [])

    useEffect(() =>{
        getSelection();
    }, [props.provider])

    const toogleSelect = () =>{
        if(!execution || !execution.id){
            if(selection && selection.id){
                setSelectChanging(true);
                axios.delete(`${API_URIS.tenderProviderSelectionApiUri}/${selection.id}`)
                    .then(res =>{
                        setSelection(null);
                        if(props.onSelectChange)
                            props.onSelectChange(false);
                    }).catch(e => console.log(e))
                    .finally(() => setSelectChanging(false))
            }else{
                if(provider && answer && answer.tender){
                    setSelectChanging(true);
                    setSelectChanging(true);
                    const entity : ITenderProviderSelection = {
                        providerId: provider.id,
                        tender: answer.tender,
                        userId: account ? account.id : null,
                    }
                    axios.post(`${API_URIS.tenderProviderSelectionApiUri}`, cleanEntity(entity))
                        .then(res =>{
                            setSelection(res.data);
                            if(props.onSelectChange && res.data)
                                props.onSelectChange(true);
                        }).catch(e => console.log(e))
                            .finally(() => setSelectChanging(false))
                }
            }
        }
    }
    
    const sendEmail = ()=>{
        if(provider && provider.email){
            let uriRequest = `api/send-email-to-tender-selected-provider/`;
            uriRequest = `${uriRequest}?object=${answer.tender ? answer.tender.object : ''}`
            uriRequest = `${uriRequest}&email=${provider.email}`;
            axios.get(uriRequest)
                .then(() =>{
                    setEmailSending(true)
                    setAnswer({...answer, confirmSelectMailSent: true});
                    const entity:ITenderAnswer={
                        ...answer,
                        confirmSelectMailSent: true,
                    }
                    axios.put<ITenderAnswer>(`${API_URIS.tenderAnswerApiUir}`, cleanEntity(entity))
                        .then(res =>{
                            if(res.data)
                                setAnswer(res.data);
                        }).catch(e => console.log(e))
                }).catch(err => console.log(err))
        }
    }


    const handleConfirmSelection = () =>{
        if(selection && selection.id){
            const entity : ITenderProviderSelection = {
                ...selection,
                valid: true
            }
            axios.put(`${API_URIS.tenderProviderSelectionApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data){
                        sendEmail();
                       setSelection(res.data);
                        if(props.onSelectChange)
                            props.onSelectChange(true); 
                    }
                }).catch(e => console.log(e))
                    .finally(() => setSelectChanging(false))
        }
    }

    const handleUpdateSelection = (select?: ITenderProviderSelection) =>{
        if(select){
            setSelection(select)
        }
    }
    
    const handleExecutionUpdated = (ex?:ITenderAnswerExecution) =>{
        if(ex)
            setExecution(ex);
    }
    
    const handleStartExecution = () =>{
        if(answer && answer.id){
            const entity: ITenderAnswer = {
                ...answer,
                finishedAt: null,
                starterId: account ? account.id : null,
            }
            setSelectChanging(true);
            axios.put<ITenderAnswer>(`${API_URIS.tenderAnswerApiUir}/startExecution`, cleanEntity(entity))
                .then(res =>{
                    setAnswer(res.data);
                }).catch(e => console.log(e))
                .finally(() => setSelectChanging(false))
        }
    }

    const handleFinishExecution = (ex?: ITenderAnswerExecution) =>{
        if(ex)
            setExecution(ex);
        if(answer && answer.id && answer.startedAt && !answer.finishedAt){
            const entity: ITenderAnswer = {
                ...answer,
                finishedAt: (new Date()).toISOString(),
                finisherId: account ? account.id : null
            }
            setSelectChanging(true);
            axios.put<ITenderAnswer>(`${API_URIS.tenderAnswerApiUir}`, cleanEntity(entity))
                .then(res =>{
                    setAnswer(res.data);
                }).catch(e => console.log(e))
                .finally(() => setSelectChanging(false))
        }
    }

    const handleExecutionAverageChange = (average) =>{
        if(props.onExecutionAverageChange)
            props.onExecutionAverageChange(average);
    }

    const handleSaveExpedition = (saved?: IProviderExpedition) =>{
        if(saved)
            setExpedition(saved);
    }   

    const selected = props.selectedAnswer  && selection && selection.providerId === props.selectedAnswer.providerId

    const canEditExpedition = account && hasPrivileges({
            entities: ["ProviderExpedition"],
            actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}, account.authorities)
    
    const handleCloseToast = () =>{
        setEmailSending(false);
    }

    return(
        <React.Fragment>
            <MyToast 
             open={emailSending}
             snackBarProps={{
                 autoHideDuration: 6000,
                 anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
                 TransitionComponent: Slide,
                 TransitionProps: {

                 },
                 onClose: handleCloseToast,
             }}
             alertProps={{
                 onClose: handleCloseToast,
             }}
             message={translate("_tender.sendingSelectionEmailToProvider")}
             />
            {answer && <>
                {/* utils modals section */}
                    {selected && <SelectionValidation 
                        open={openValidation}
                        selection={selection}
                        tender={answer.tender}
                        account={account}
                        onClose={() => {
                            setOpenValidation(false)
                        }}
                        readonly={(answer !== null && answer.startedAt !== null)}
                        onUpdateSelection={handleUpdateSelection}
                    />}
                    
                    {execution && <ExecutionValidation
                        account={account}
                        execution={execution}
                        open={openExecutionValidation}
                        tender={answer.tender}
                        onClose={() => setOpenExecutionValidation(false)}
                        onUpdateExecution={handleExecutionUpdated}
                        readonly={execution.validated}
                     />} 
                     {(selected && answer.startedAt) && <>
                        <TenderAnswerExecutionUpdate open={openExecution}
                            answer={answer} userId={account ? account.id : null}
                            onClose={() => setOpenExecution(false)} 
                            onExecute={handleFinishExecution}
                            readonly={answer.finishedAt ? true : false} />
                    </>}
                    {(execution && execution.validated) &&
                        <ExectuionEvaluation account={account} answer={answer}
                            execution={execution} open={openExecutionEvaluation}
                            providerFullName={providerName || ''} readonly={false}
                            provider={provider}
                            onAverageChage={handleExecutionAverageChange}
                            onClose={() => setOpenExecutionEvaluation(false)}
                          />
                     }
                     {selected &&
                        <ProviderExpeditionUpdate
                                 open={openExpedition}
                                 account={account}
                                 readonly={canEditExpedition ? false : true}
                                 expedition={{...expedition, answer}} 
                                 onSave={handleSaveExpedition} onClose={() => setOpenExpedition(false)} />
                     }
                {/* end utils modals section */}
                <Box display="flex" justifyContent="center" 
                    alignItems="center" flexWrap="wrap" overflow="auto" {...rootBoxProps}>
                        {(!answer.startedAt && !answer.finishedAt && (!props.selectedAnswer || selected)) &&
                            <Switch checked={selected} 
                             color="primary"
                             onChange={toogleSelect}/>
                        }
                        {selectChanging && <CircularProgress style={{ width: 10, height:10}}/>}
                        {selected && <>
                            <IconButton
                                className="ml-3"
                                    title={translate("_global.label.selectionValidation")}
                                    onClick={() =>setOpenValidation(true)}>
                                <FontAwesomeIcon icon={faCheckCircle} className="text-primary"/>
                            </IconButton>
                            {(selection.validated && !answer.confirmSelectMailSent && hasPrivileges({entities: [PrivilegeEntity.Tender],
                             actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}, account.authorities)) &&
                                <IconButton 
                                    title={translate("_global.label.notify")}
                                    onClick={handleConfirmSelection}>
                                    <FontAwesomeIcon icon={faEnvelope} className='text-success'/>
                                </IconButton>
                            }
                            {(selected && answer.confirmSelectMailSent && !answer.startedAt && !answer.finishedAt) && hasPrivileges({entities: [PrivilegeEntity.Tender], 
                                actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE]}, account.authorities) && <>
                                <IconButton
                                    className="ml-3"
                                    title={translate("_tender.startExecution")}
                                    onClick={handleStartExecution}>
                                    <FontAwesomeIcon icon={faPlay} className="text-primary"/>
                                </IconButton>
                            </>}
                            {(answer.startedAt || answer.finishedAt) && <>
                                <TenderAnswerChrono answer={answer} />
                            </>}
                            {(selected && answer.startedAt) && <>
                                <IconButton
                                    className="ml-1"
                                    title={translate(`${answer.finishedAt ? '_global.label.execution' : '_tender.finishExecution'}`)}
                                    onClick={() => setOpenExecution(true)}>
                                    <FontAwesomeIcon icon={faCheckCircle} className={answer.finishedAt ? 'text-secondary': 'text-info'}/>
                                </IconButton>
                            </>}
                            {(execution && execution.id) && <>
                                <IconButton
                                    className="ml-1"
                                    title={translate('_tender.executionValidation')}
                                    onClick={() => setOpenExecutionValidation(true)}>
                                    <FontAwesomeIcon icon={faCheckCircle} className={execution.validated ? 'text-info': 'text-success'}/>
                                </IconButton>
                            </>}
                            {(execution && execution.id && execution.validated) && <>
                                <IconButton
                                    className="ml-1"
                                    title={translate('_tender.executionEvaluation')}
                                    onClick={() => setOpenExecutionEvaluation(true)}>
                                    <FontAwesomeIcon icon={faTasks} className={"text-warning"}/>
                                </IconButton>
                            </>}
                            {selected &&
                                <IconButton
                                    className="ml-3"
                                        title={translate("microgatewayApp.microproviderProviderExpedition.detail.title")}
                                        onClick={() =>setOpenExpedition(true)}>
                                    <FontAwesomeIcon icon={faDolly} className="text-info"/>
                                </IconButton>
                            }
                            {(execution && execution.validated) && <>
                                    <FontAwesomeIcon icon={faLock} className="ml-2"/>
                            </>}
                            </>
                        }
                </Box>
            </>}
        </React.Fragment>
    )
}

export default TenderAnswerSelectionExecutionTools;