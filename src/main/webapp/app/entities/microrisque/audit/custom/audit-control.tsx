import { Box, BoxProps, CircularProgress, IconButton, IconButtonProps, makeStyles, Tooltip, TooltipProps } from "@material-ui/core";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faClock, faFlag, faHistory, faPaperPlane, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction, PrivilegeEntity } from "app/shared/model/enumerations/privilege-action.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { IAuditUser } from "app/shared/model/microrisque/audit-user.model";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import AuditStatusTraking from "../../audit-status-traking/custom/audit-status-traking";
import AuditStatusTrakingUpdate from "../../audit-status-traking/custom/audit-status-traking-update";
import { IAuditStatusTraking } from "app/shared/model/microrisque/audit-status-traking.model";
import AuditRecommendation from "../../audit-recommendation/custom/audit-recommendation";
import AuditEventTrigger from "../../audit-event-trigger/custom/audit-event-trigger";

const useStyles = makeStyles(theme =>({

}))

interface TaskControlProps extends StateProps, DispatchProps{
    audit: IAudit,
    realod?:boolean,
    rootBoxProps?: BoxProps,
    iconProps?: FontAwesomeIconProps,
    iconButtonProps?: IconButtonProps,
    toolTipProps?: TooltipProps,
    onUpdate?: Function,
    inTodoList?:boolean,
}

export const AuditControl = (props: TaskControlProps) =>{
    const { rootBoxProps, account, iconProps, iconButtonProps,toolTipProps } = props;
    const [audit, setAudit] = useState(props.audit);
    const [loading, setLoading] = useState(false);
    const [auditUserRoles, setAuditUsersRole] = useState<IAuditUser[]>([]);
    const [action, setAction] = useState<AuditStatus>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [openTaskTacks, setOpenTaskTracks] = useState(false);
    const [taskHasSubmitorOrValidator, setAuditHasValidatorOrSubmotor] = useState(false);
    const [openRecommendations, setOpenRecommendations] = useState(false);

    const [openEventes, setOpenEvents] = useState(false);

    const classes = useStyles();

    const getAuditUsers = () =>{
        if(userExtra && audit && audit.id){
            setLoading(true)
            axios.get<IAuditUser[]>(`${API_URIS.auditUserApiUri}/?auditId.equals=${audit.id}&userId.equals=${userExtra.id}`)
                .then(res =>{
                    setAuditUsersRole(res.data)
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }
    
    const getUserExtra = () =>{
        if(account && account.id){
            setLoading(true)
            axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?userId.equals=${account.id}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setUserExtra(res.data[0]);
                    }
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }

    const checkTaskHasSubmitorOrValidator = () =>{
        if(audit && audit.id){
            const roles = [AuditUserRole.SUBMITOR, AuditUserRole.VALIDATOR];
            axios.get<IAuditUser[]>(`${API_URIS.auditUserApiUri}/?auditId.equals=${audit.id}&role.in=${[roles].join(',')}&page=${0}&size=${1}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0)
                        setAuditHasValidatorOrSubmotor(true);
                    else
                        setAuditHasValidatorOrSubmotor(false)
                }).catch(e => console.log(e))
        }else{
            setAuditHasValidatorOrSubmotor(false);
        }
    }

    useEffect(() =>{
        getUserExtra();
    }, [])

    useEffect(() =>{
        setAudit(props.audit);
        getAuditUsers();
        checkTaskHasSubmitorOrValidator();
    }, [props.audit, props.realod])

    useEffect(() =>{
        getAuditUsers();
    }, [userExtra])

    
   // const handleSaveTraking = (saved?: IAuditStatusTraking, isNew?: boolean) =>{}

    const handleSave = (saved?: IAudit) =>{
        if(saved){
            setAudit(saved)
            if(props.onUpdate)
                props.onUpdate(saved);
        }
    }

    const handleSaveTraking = (saved?: IAuditStatusTraking, isNew?: boolean) =>{}

    const handleCloseConfirm = () =>{
        setOpenConfirm(false);
        setAction(null);
    }


    const userIsSubmitor = [...auditUserRoles].find(item => item.role === AuditUserRole.SUBMITOR) ? true : false;
    const userIsValidator = [...auditUserRoles].find(item => item.role === AuditUserRole.VALIDATOR) ? true : false;
    const userIsExecutor = [...auditUserRoles].find(item => item.role === AuditUserRole.EXECUTOR) ? true : false;
    const hasAuditEditingPrivilege = account && hasPrivileges({ entities: [PrivilegeEntity.Task, 'Audit'], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);

    const canCancel =  false; // !props.inTodoList && audit.status !== AuditStatus.CANCELED && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canExecute = audit.status === AuditStatus.STARTED && userIsExecutor && taskHasSubmitorOrValidator;
    const canSubmit =  audit.status === AuditStatus.EXECUTED && userIsSubmitor;
    const canFinish = (audit.status === AuditStatus.SUBMITTED && userIsValidator) || ([AuditStatus.STARTED, AuditStatus.EXECUTED, AuditStatus.SUBMITTED].some(ts => ts === audit.status) && !taskHasSubmitorOrValidator && userIsExecutor);
    const canMangeHystory = [...auditUserRoles].length !== 0 || hasPrivileges({entities: ["Process", 'Task', 'Audit'], actions: [PrivilegeAction.ALL]}, account.authorities);


    return (
        <React.Fragment>
            {loading && <CircularProgress style={{ width:15, height:15}}/>}
            {(audit) && <>
                <AuditStatusTraking
                     open={openTaskTacks} 
                     entity={audit} 
                     account={props.account}
                     userAuditRoles={[...auditUserRoles].map(aur => aur.role)}
                     onClose={() => setOpenTaskTracks(false)} />
                <AuditStatusTrakingUpdate
                    open={openConfirm}
                    auditOrRecommendation={audit} 
                    newStatus={action} 
                    onClose={handleCloseConfirm}
                    onChangeStatus={handleSave}
                    onSavedTraking={handleSaveTraking}/>

                <AuditRecommendation 
                    open={openRecommendations}
                    account={account}
                    audit={audit}
                    userExtra={userExtra}
                    roles={[...auditUserRoles].map(aur => aur.role)}
                    onClose={() => setOpenRecommendations(false)}
                />
                <AuditEventTrigger open={openEventes} 
                    audit={audit} onClose={() => setOpenEvents(false)}/>

                <Box
                    display="flex" justifyContent="center"
                    alignItems="center" {...rootBoxProps}
                >
                <Tooltip 
                    {...toolTipProps}
                    title={translate("microgatewayApp.microrisqueAuditRecommendation.home.title")}>
                    <IconButton
                        {...iconButtonProps}
                        onClick={() =>{ setOpenRecommendations(true)}}
                        className="text-info ml-3" >
                            <FontAwesomeIcon 
                                {...iconProps}
                                icon={faFlag} />
                    </IconButton>
                </Tooltip>
                {hasAuditEditingPrivilege && 
                    <Tooltip 
                        {...toolTipProps}
                        title={translate("microgatewayApp.microprocessEventTrigger.home.title")}>
                        <IconButton
                            {...iconButtonProps}
                            onClick={() =>{ setOpenEvents(true)}}
                            className="text-primary" >
                                <FontAwesomeIcon 
                                    {...iconProps}
                                    icon={faClock} />
                        </IconButton>
                    </Tooltip>
                }
                {canMangeHystory && 
                    <Tooltip 
                        {...toolTipProps}
                        title={translate("microgatewayApp.microprocessTaskStatusTraking.detail.title")}>
                        <IconButton
                            {...iconButtonProps}
                            onClick={() =>{ setOpenTaskTracks(true)}}
                            className="text-secondary" >
                                <FontAwesomeIcon 
                                    {...iconProps}
                                    icon={faHistory} />
                        </IconButton>
                    </Tooltip>
                }
                {canFinish &&
                    <Tooltip 
                        {...toolTipProps}
                        title={translate(`_global.label.validate`)}>
                        <IconButton
                            {...iconButtonProps}
                            onClick={() =>{
                                setAction(AuditStatus.COMPLETED);
                                setOpenConfirm(true)
                            }}
                            className="text-success ml-3" >
                                <FontAwesomeIcon 
                                    {...iconProps}
                                    icon={faCheckCircle} />
                        </IconButton>
                    </Tooltip>
                }

                {canExecute &&
                    <Tooltip 
                        {...toolTipProps}
                        title={translate(`_global.label.execute`)}>
                        <IconButton
                            {...iconButtonProps}
                            color="primary"
                            onClick={() =>{
                                setAction(AuditStatus.EXECUTED);
                                setOpenConfirm(true)
                            }}>
                                <FontAwesomeIcon 
                                    {...iconProps}
                                    icon={faShieldAlt} />
                        </IconButton>
                    </Tooltip>
                }

                {canSubmit &&
                    <Tooltip 
                        {...toolTipProps}
                        title={translate(`_global.label.submit`)}>
                        <IconButton
                            {...iconButtonProps}
                            color="primary"
                            onClick={() =>{
                                setAction(AuditStatus.SUBMITTED);
                                setOpenConfirm(true)
                            }}>
                                <FontAwesomeIcon 
                                    {...iconProps}
                                    icon={faPaperPlane} />
                        </IconButton>
                    </Tooltip>
                    }

                    {canCancel &&
                        <Tooltip 
                            {...toolTipProps}
                            title={translate(`_global.label.cancel`)}>
                            <IconButton
                                {...iconButtonProps}
                                color="secondary"
                                onClick={() =>{
                                    setAction(AuditStatus.CANCELED);
                                    setOpenConfirm(true)
                                }}>
                                    <FontAwesomeIcon 
                                        {...iconProps}
                                        icon={faBan} />
                            </IconButton>
                        </Tooltip>
                    } 
                </Box>
            </>
            }
        </React.Fragment>
    )

}

const mapStateToProps = ({ authentication }: IRootState) =>({
    account: authentication.account
});

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditControl);