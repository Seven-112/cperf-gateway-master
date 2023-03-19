import React from "react"
import { useState } from "react"
import { Box, Collapse, colors, Grid, IconButton, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core"
import { translate } from "react-jhipster"
import { Close } from "@material-ui/icons"
import { useEffect } from "react"
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers"
import { IDynamicField } from "app/shared/model/dynamic-field.model"
import { connect } from "react-redux"
import { IRootState } from "app/shared/reducers"
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model"
import DynamicFieldWrapper from "app/entities/dynamic-field/custom/fields/dynamic-field-wrapper"
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model"
import { cleanEntity } from "app/shared/util/entity-utils"
import FieldNameVisualizer from "app/entities/dynamic-field/custom/fields/field-name-visualizer"
import { IQueryInstance } from "app/shared/model/qmanager/query-instance.model"
import { IQueryFieldResponse } from "app/shared/model/qmanager/query-field-response.model"
import { Alert } from "@material-ui/lab"
import { IQueryClient } from "app/shared/model/qmanager/query-client.model"
import { serviceIsOnline, SetupService } from "app/config/service-setup-config"
import { IProcess } from "app/shared/model/microprocess/process.model"
import { IQueryUserValidator } from "app/shared/model/qmanager/query-user-validator.model"
import { IQPonctualTaskInfo } from "app/shared/model/qmanager/q-ponctual-task-info.model"
import { IProcessPonctualTaskUtil } from "app/shared/model/microprocess/ponctual-task-util"
import { SaveButton } from "app/shared/component/custom-button"
import { upldateEntityId } from 'app/shared/reducers/file-upload-reducer';
import MyCustomModal from "app/shared/component/my-custom-modal"
import DynamicTextField from "app/entities/dynamic-field/custom/fields/dynamic-text-filed"

const useStyles = makeStyles(theme =>({
    card:{
        minWidth: '35%',
        maxWidth: '35%',
        [theme.breakpoints.down("sm")]:{
            maxWidth: '97%',
        },
    },
}))

interface QueryInstanceUpdateProps extends StateProps, DispatchProps{
    instance:IQueryInstance,
    locked?:boolean,
    open?: boolean,
    onClose: Function,
    onSave?: Function,
}

interface IFieldCheck{
    dynamicFiledId: any,
    renseigned?: boolean,
}


export const QueryInstanceUpdate = (props: QueryInstanceUpdateProps) =>{
    const { account, locked, open } = props;
    const [isNew] = useState(!props.instance || !props.instance.id)
    const [instance, setInstance] = useState(props.instance);
    const [object, setObject] = useState('');
    const [error, setError] = useState(false);
    const [taskData, setTaskData] = useState<IQPonctualTaskInfo>({});
    const [loading, setLoading] = useState(false);
    const [queryFields, setQueryFields] = useState<IDynamicField[]>([]);
    const [instanceFields, setInstanceFields] = useState<IQueryFieldResponse[]>([]);
    const [clients, setClients] = useState<IQueryClient[]>([]);
    const [totalValidators, setTotalValidators] = useState(0);

    const [fieldChecks, setFieldChecks] = useState<IFieldCheck[]>([]);

    const classes = useStyles();

    const requiredFileFieldsRenseigned = [...queryFields].length === 0 ||
            ([...queryFields].filter(qf => qf.required && qf.type !== DynamicFieldType.FILE)
                .map(qf => qf.id).every(dfId => [...fieldChecks]
                    .some(fc => fc.dynamicFiledId === dfId && fc.renseigned)));


    const formIsValid = ((instance && instance.name) || object) && requiredFileFieldsRenseigned;

    const countValidators = () =>{
        if(props.instance && props.instance.query && props.instance.query.id && account && account.id){
            let apiUri = `${API_URIS.queryUserValidatorsApiUri}/getValidatorsByUserIdAndQueryId`;
            apiUri = `${apiUri}/${account.id}/${props.instance.query.id}/?page=${0}&size=${1}`;
            setLoading(true)
            axios.get<IQueryUserValidator[]>(apiUri)
                .then(res => {
                    setTotalValidators(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    const getQueryFields = () =>{
        if(props.instance && props.instance.query && props.instance.query.id){
            setLoading(true);
            axios.get<IDynamicField[]>(`${API_URIS.dynamicFieldApiUri}/?entityId.equals=${props.instance.query.id}&tag.equals=${DynamicFieldTag.QUERY}`)
                .then(res =>{
                    if(res.data)
                        setQueryFields([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    const getClients = () =>{
        if(props.instance && props.instance.query && props.instance.query.clientType){
            const typeId = props.instance.query.clientType.id;
            setLoading(true);
            axios.get<IQueryClient[]>(`${API_URIS.queryClientApiUri}/?typeId.equals=${typeId}`)
                .then(res =>{
                    if(res.data)
                        setClients([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    const getinstanceFields = () =>{
        if(props.instance && props.instance.id){
            setLoading(true);
            axios.get<IQueryFieldResponse[]>(`${API_URIS.queryResponseField}/?instanceId.equals=${props.instance.id}`)
                .then(res =>{
                    if(res.data){
                        setInstanceFields([...res.data]);
                    }
                }).catch((e) => console.log(e))
                .finally(() =>{
                    setLoading(false)
                })
        }
    }

    useEffect(() =>{
        if(props.open){
            setInstance(props.instance)
            setTaskData({})
            getQueryFields();
            getinstanceFields();
            getClients();
            countValidators();
        }
    }, [props.open])

    const updatePonctualTaskExecutionTime = (porcessInstanceId, execTime: IQPonctualTaskInfo) =>{
        if(porcessInstanceId && execTime && serviceIsOnline(SetupService.PROCESS)){
            const processPonctualTaskUtil: IProcessPonctualTaskUtil = {
                nbMinutes: execTime.nbMinutes,
                nbHours: execTime.nbHours,
                nbDays: execTime.nbDays,
                nbMonths: execTime.nbMonths,
                nbYears: execTime.nbYears,
                instanceId: porcessInstanceId,
            }
            axios.put(`${API_URIS.processApiUri}/updatePonctualTaskExecTime`, cleanEntity(processPonctualTaskUtil))
                .then(() => {})
                .catch(e => console.log(e))
        }
    }
    
    const saveTaskData = (ps: IProcess) =>{
        if(ps && isNew && ps.id && ps.queryId && taskData 
            && (taskData.nbMinutes || taskData.nbHours 
                || taskData.nbDays || taskData.nbMonths || taskData.nbYears)){
            const taskInfoEntity: IQPonctualTaskInfo = {
                ...taskData,
                qInstanceId: ps.queryId,
            }
            axios.post<IQPonctualTaskInfo>(`${API_URIS.queryPonctualTaskInfoApiUri}`, cleanEntity(taskInfoEntity))
                .then(() =>{})
                .catch(e => console.log(e))
                .finally(() =>{
                    updatePonctualTaskExecutionTime(ps.id, taskInfoEntity);
                })
        }
    }

    const createProcessInstance = (inst?: IQueryInstance) =>{
        if(inst && inst.name && inst.query && !totalValidators
                && inst.query.processId && serviceIsOnline(SetupService.PROCESS)){
            setLoading(true);
            const entity: IProcess = {
                modelId: inst.query.processId,
                id: null,
                label: inst.name,
                // runnableProcessId: runnableProcess ? runnableProcess.id : null
                runnableProcessId: null,
                queryId: inst.id,
            }
            axios.post<IProcess>(API_URIS.processApiUri, cleanEntity(entity))
            .then(res =>{
                console.log('process instance created')
                saveTaskData(res.data);
            }).catch(e =>{
                console.log(e);
            }).finally(() => setLoading(false));
        }
    }

    const handleSaveFieldResponse = (saved: any, f:IDynamicField) =>{
        if(saved !== null && saved !== undefined && f && f.id){
            const finded = [...instanceFields].find(instf => instf.fieldId === instf.id);
            const entity:IQueryFieldResponse = {
                ...finded,
                instance,
                fieldId: f.id,
                val: f.type !== DynamicFieldType.FILE ? saved : null,
            }
            if(f.type !== DynamicFieldType.FILE){
                if(finded){
                    if(instance){
                        const req = entity.id ? axios.put<IQueryFieldResponse>(`${API_URIS.queryResponseField}`, cleanEntity(entity))
                                              : axios.post<IQueryFieldResponse>(`${API_URIS.queryResponseField}`, cleanEntity(entity));
                        req.then(res =>{
                            if(res.data){
                                if(!entity.id)
                                    setInstanceFields([res.data, ...instanceFields])
                                else
                                    setInstanceFields(instanceFields.map(instf => instf.id === res.data.id ? res.data : instf));
                            }
                        }).catch(e => console.log(e))
                    }
                }else{
                    setInstanceFields([...instanceFields, entity]);
                }
            }else{
                setInstanceFields([...instanceFields, entity]); // will saved after insace saved
            }
        }
        // saving resigned history
        if(f && f.id){
            const checkFinded = [...fieldChecks].find(fc => fc.dynamicFiledId === f.id);
            const newCheck: IFieldCheck={
                dynamicFiledId: f.id,
                renseigned: (saved || (f.type === DynamicFieldType.NUMBER && saved === 0) ) ? true : false
            }
            if(checkFinded)
                setFieldChecks(fieldChecks.map(fc => fc.dynamicFiledId === f.id ? newCheck : fc))
            else
                setFieldChecks([...fieldChecks, newCheck]);
        }
    }

    const FormRow = ({ label, children }) =>( <Grid item xs={12}>
            <Box p={1} border={1} borderColor={colors.grey[300]} borderRadius={5}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                        <Box width={1} display="flex" flexWrap="wrap">{label}</Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box width={1} display="flex" flexWrap="wrap">{children}</Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )

    const instanceNameRowItem = <FormRow label={
        <Typography>{`${translate("microgatewayApp.qmanagerQueryInstance.name")} *`}</Typography>
        }>
            <DynamicTextField 
                field={{
                    name: translate("microgatewayApp.qmanagerQueryInstance.name"),
                    required: true,
                }}
                readonly={locked}
                val={object || instance.name}
                onSave={val => setObject(val)}
            />
    </FormRow>

    const rowItems = [...queryFields].map((tf, index) =>{
        const instanceField = [...instanceFields].find(af => af.fieldId===tf.id);
        return <FormRow key={index} label={<FieldNameVisualizer field={tf} />}>
                    <DynamicFieldWrapper dynamicField={tf} 
                        value={instanceField ? instanceField.val : null}
                        readonly={locked} 
                        fileFiledEntityId={instanceField ? instanceField.id : null}
                        onSave={handleSaveFieldResponse}
                        />
            </FormRow>
    })

    const handleClose=() => {
        props.onClose();
        setInstance({});
        setObject('');
        setError(false);
        setTaskData({});
        setLoading(false);
        setQueryFields([]);
        setInstanceFields([]);
        setClients([]);
        setTotalValidators(0);
    };

    const handleSave = (inst?: IQueryInstance) =>{
        setLoading(false);
        if(isNew){
            setInstanceFields([]);
        }
        if(props.onSave)
            props.onSave(inst || instance, isNew);
    }

    const saveUnsavedResponseFields = (savedInstance) =>{
        if(savedInstance && savedInstance.id){
            const unsaved = [...instanceFields].filter(instf => !instf.id);
            if(unsaved && unsaved.length !== 0){
                setLoading(true);
                const saved: IQueryFieldResponse[] = [];
                unsaved.map(async (el, index) =>{
                    const isFileField = [...queryFields].some(qf => qf.id === el.fieldId && qf.type === DynamicFieldType.FILE)
                    const entity: IQueryFieldResponse = {
                        ...el,
                        instance: savedInstance,
                    }
                    try {
                        const res = await axios.post<IQueryFieldResponse>(`${API_URIS.queryResponseField}`, cleanEntity(entity));
                        if(res.data){
                            if(account && isFileField)
                                props.upldateEntityId(res.data.fieldId, res.data.id, account.id);
                            saved.push(res.data);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    if(index === unsaved.length -1){
                        setInstanceFields([...[...instanceFields].filter(instf => instf.id), ...saved]);
                        handleSave(savedInstance);
                    }
                })
            }else{
                handleSave(savedInstance);
            }
        }else{
            handleSave(null);
        }
    }

    const onSave = (event) =>{
        event.preventDefault();
        setError(false);
        if(formIsValid){
            setLoading(true)
            const entity: IQueryInstance = {
                ...instance,
                name: object || instance.name,
                userId: instance.userId || account.id,
                startAt: instance.startAt || new Date().toISOString(),
                ponctual: instance.query && instance.query.ponctual,
            }
            const req = isNew ? axios.post<IQueryInstance>(`${API_URIS.queryInstanceApiUri}`, cleanEntity(entity))
                              : axios.put<IQueryInstance>(`${API_URIS.queryInstanceApiUri}`, cleanEntity(entity));
            req.then(res =>{
                if(res.data){
                    if(isNew)
                        createProcessInstance(res.data);
                    saveUnsavedResponseFields(res.data);
                }else{
                    setError(true);
                    setLoading(false)
                }
            }).catch(e => {
                console.log(e);
                setError(true)
                setLoading(false)
            })
        }
    }

    const handleSelectClient = (e) =>{
        const id = e.target.value;
        setInstance({...instance, client: [...clients].find(c => c.id === id)})
    }

    const handleChangeTaskData = (e) =>{
        const { name, value } = e.target;
        setTaskData({...taskData, [name]: value})
    }

    return (
        <React.Fragment> 
            <MyCustomModal
                open={open}
                onClose={handleClose}
                rootCardClassName={classes.card}
                title={locked ? translate("_global.label.form") :
                translate("microgatewayApp.qmanagerQueryInstance.home.createOrEditLabel")}
                footer={!locked ?
                    <Box width={1} textAlign="right">
                        <SaveButton disabled={!formIsValid || props.fileSaving} onClick={onSave} />
                    </Box> : <></>}
            >  
                <Grid container spacing={1}>
                    {loading && <Grid item xs={12}>
                        <Box width={1} textAlign="center">Loading...</Box>
                    </Grid>}
                    {error && <Grid item xs={12}>
                        <Collapse in={true}>
                            <Alert severity="error"
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => setError(false) }
                                >
                                    <Close fontSize="inherit" />
                                </IconButton>}
                            >
                                {translate("_global.flash.message.failed")}
                            </Alert>
                        </Collapse>
                    </Grid>}
                    {instanceNameRowItem}
                    {(clients && clients.length !== 0) && 
                        <FormRow label={
                            <Typography>{translate("microgatewayApp.qmanagerQueryInstance.client")}</Typography>
                        }>
                            <Select
                                value={instance.client ? instance.client.id : 0}
                                fullWidth
                                onChange={handleSelectClient}
                            >
                                <MenuItem value={0}>---Select---</MenuItem>
                                {clients.map((c, index) =>(
                                    <MenuItem key={index} value={c.id}>
                                        {`${c.name}${c.accountNum ? ' (' + c.accountNum +')' : ''}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormRow>
                    }
                    {rowItems}
                    {(instance && instance.query && instance.query.ponctual && isNew) && 
                     <FormRow label={<Typography variant="h5">{translate("_global.label.executionTime")}</Typography>}>
                        <Grid container justifyContent="center" spacing={2} alignItems="center">
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbMinutes")}
                                    name="nbMinutes"
                                    type="number"
                                    value={taskData.nbMinutes}
                                    onChange={handleChangeTaskData}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbHours")}
                                    name="nbHours"
                                    type="number"
                                    value={taskData.nbHours}
                                    onChange={handleChangeTaskData}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbDays")}
                                    name="nbDays"
                                    type="number"
                                    value={taskData.nbDays}
                                    onChange={handleChangeTaskData}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbMonths")}
                                    name="nbMonths"
                                    type="number"
                                    value={taskData.nbMonths}
                                    onChange={handleChangeTaskData}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <TextField fullWidth variant="outlined" size="small"
                                    label={translate("microgatewayApp.qmanagerQPonctualTaskInfo.nbYears")}
                                    name="nbYears"
                                    type="number"
                                    value={taskData.nbYears}
                                    onChange={handleChangeTaskData}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </FormRow>
                  }
                </Grid>
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateProps = ({ authentication, fileUpload }: IRootState) =>({
    account: authentication.account,
    fileSaving: fileUpload.saving,
})

const mapDispatchToProps={
    upldateEntityId,
}

type StateProps = ReturnType<typeof mapStateProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateProps, mapDispatchToProps)(QueryInstanceUpdate);