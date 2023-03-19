import { Box, BoxProps, CircularProgress, IconButton, IconButtonProps, makeStyles, Tooltip, TooltipProps } from "@material-ui/core";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faHistory, faPaperPlane, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction, PrivilegeEntity } from "app/shared/model/enumerations/privilege-action.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import AuditStatusTraking from "../../audit-status-traking/custom/audit-status-traking";
import { IAuditStatusTraking } from "app/shared/model/microrisque/audit-status-traking.model";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { IAuditRecomUser } from "app/shared/model/microrisque/audit-recom-user.model";
import AuditStatusTrakingUpdate from "../../audit-status-traking/custom/audit-status-traking-update";

const useStyles = makeStyles(theme =>({

}))

interface AuditRecommendationControlProps extends StateProps, DispatchProps{
    recom: IAuditRecommendation,
    realod?:boolean,
    rootBoxProps?: BoxProps,
    iconProps?: FontAwesomeIconProps,
    iconButtonProps?: IconButtonProps,
    toolTipProps?: TooltipProps,
    onUpdate?: Function,
    inTodoList?:boolean,
}

export const AuditRecommendationControl = (props: AuditRecommendationControlProps) =>{
    const { rootBoxProps, account, iconProps, iconButtonProps,toolTipProps, inTodoList } = props;
    const [recom, setRecom] = useState(props.recom);
    const [loading, setLoading] = useState(false);
    const [recomUserRoles, setRecomUsersRole] = useState<IAuditRecomUser[]>([]);
    const [action, setAction] = useState<AuditStatus>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [openTaskTacks, setOpenTaskTracks] = useState(false);
    const [taskHasSubmitorOrValidator, setRecomHasValidatorOrSubmotor] = useState(false);

    const classes = useStyles();

    const getAuditUsers = () =>{
        if(userExtra && props.recom && props.recom.id){
            setLoading(true)
            axios.get<IAuditRecomUser[]>(`${API_URIS.auditRecomUserApiUri}/?recomId.equals=${props.recom.id}&userId.equals=${userExtra.id}`)
                .then(res =>{
                    setRecomUsersRole(res.data)
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
        if(recom && recom.id){
            const roles = [AuditUserRole.SUBMITOR, AuditUserRole.VALIDATOR];
            axios.get<IAuditRecomUser[]>(`${API_URIS.auditRecomUserApiUri}/?recomId.equals=${recom.id}&role.in=${[roles].join(',')}&page=${0}&size=${1}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0)
                        setRecomHasValidatorOrSubmotor(true);
                    else
                        setRecomHasValidatorOrSubmotor(false)
                }).catch(e => console.log(e))
        }else{
            setRecomHasValidatorOrSubmotor(false);
        }
    }

    useEffect(() =>{
        getUserExtra();
    }, [])

    useEffect(() =>{
        setRecom(props.recom);
        getAuditUsers();
        checkTaskHasSubmitorOrValidator();
    }, [props.recom, props.realod])

    useEffect(() =>{
        getAuditUsers();
    }, [userExtra])

    
   // const handleSaveTraking = (saved?: IAuditStatusTraking, isNew?: boolean) =>{}

    const handleSave = (saved?: IAuditRecomUser) =>{
        if(saved){
            setRecom(saved)
            if(props.onUpdate)
                props.onUpdate(saved);
        }
    }

    const handleSaveTraking = (saved?: IAuditStatusTraking, isNew?: boolean) =>{}

    const handleCloseConfirm = () =>{
        setOpenConfirm(false);
        setAction(null);
    }


    const userIsSubmitor = [...recomUserRoles].find(item => item.role === AuditUserRole.SUBMITOR) ? true : false;
    const userIsValidator = [...recomUserRoles].find(item => item.role === AuditUserRole.VALIDATOR) ? true : false;
    const userIsExecutor = [...recomUserRoles].find(item => item.role === AuditUserRole.EXECUTOR) ? true : false;
    const hasAuditEditingPrivilege = account && hasPrivileges({ entities: [PrivilegeEntity.Task], actions: [PrivilegeAction.CREATE, PrivilegeAction.DELETE, PrivilegeAction.CREATE]}, account.authorities);

    const canCancel =  false; // !props.inTodoList && recom.status !== AuditStatus.CANCELED && (hasTaskEditingPrivilege || hasProcessEditingPrivileges);
    const canExecute = inTodoList && recom.status === AuditStatus.STARTED && userIsExecutor && taskHasSubmitorOrValidator;
    const canSubmit =  inTodoList && recom.status === AuditStatus.EXECUTED && userIsSubmitor;
    const canFinish = inTodoList && (recom.status === AuditStatus.SUBMITTED && userIsValidator) || ([AuditStatus.STARTED, AuditStatus.EXECUTED, AuditStatus.SUBMITTED].some(ts => ts === recom.status) && !taskHasSubmitorOrValidator && userIsExecutor);
    const canMangeHystory = [...recomUserRoles].length !== 0 || hasPrivileges({entities: ["Process", 'Task'], actions: [PrivilegeAction.ALL]}, account.authorities);


    return (
        <React.Fragment>
            {loading && <CircularProgress style={{ width:15, height:15}}/>}
            {(recom) && <>
                <AuditStatusTraking
                     open={openTaskTacks} 
                     entity={recom} 
                     account={props.account}
                     isRecom
                     userAuditRoles={[...recomUserRoles].map(aur => aur.role)}
                     onClose={() => setOpenTaskTracks(false)} />
                     <AuditStatusTrakingUpdate
                         open={openConfirm}
                         auditOrRecommendation={recom}
                         isRecomendation={true} 
                         newStatus={action} 
                         onClose={handleCloseConfirm}
                         onChangeStatus={handleSave}
                         onSavedTraking={handleSaveTraking}/>

                <Box
                    display="flex" justifyContent="center"
                    alignItems="center" {...rootBoxProps}
                >
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

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationControl);