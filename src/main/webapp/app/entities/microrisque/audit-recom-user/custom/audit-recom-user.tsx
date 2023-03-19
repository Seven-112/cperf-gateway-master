import { Box, Chip, makeStyles, Typography } from "@material-ui/core";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import theme from "app/theme";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import { translate } from "react-jhipster";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import AsyncHorizontalTabLinkWrapper, { AsyncTabLinkProps } from "app/shared/component/async-tab-link";
import { HowToReg, Person, TouchApp } from "@material-ui/icons";
import AuditRecomUserTab from "./audit-recomusertab";
import { IAuditRecomUser } from "app/shared/model/microrisque/audit-recom-user.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import axios from 'axios';
import { API_URIS, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles({
    card:{
        width: '45%',
        [theme.breakpoints.down("sm")] : {
            width: '85%',
        }
    },
    tabAppBar:{
        boxShadow: 'none',
    },
    tabIndicator:{
        color: theme.palette.primary.dark,
        background: theme.palette.primary.dark,
    },
    tab:{
        /* borderRadius:'15px 15px 0 0',
        border: `1px solid ${theme.palette.primary.dark}`,
        borderBottom: 'none',
        borderLeft: 'none', */
        textTransform: 'none',
    },
    selectedTab:{
        // background: theme.palette.primary.main,
        color: theme.palette.primary.dark,
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 15px 15px',
    },
    previwUserAvatar:{
        height: 25,
        width: 25,
    },
})

interface AuditRecomUserProps extends StateProps{
    open?: boolean,
    recom: IAuditRecommendation,
    previewUsers?: boolean,
    previewUsersWithRole?: boolean,
    notFoundMessage?: string,
    onClose: Function,
}

export const AuditRecomUser = (props: AuditRecomUserProps) =>{
    const { account, open, previewUsers, previewUsersWithRole } = props;
    
    const [users, setUsers] = useState<IUserExtra[]>([]);

    const [recomUsers, setRecomUsers] = useState<IAuditRecomUser[]>([]);

    const [role, setRole] = useState(AuditUserRole.EXECUTOR);
    
    const [loading, setLoading] = useState(false);

    const [userManageLoading, setUserManageLoading] = useState(false);

    const classes = useStyles();
    
    const userIsRecomAuditor = account && props.recom && props.recom.auditorId === account.id
    const userIsRecomResposanble = account && props.recom && props.recom.responsableId === account.id
    const canUpdate = account && (hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.UPDATE]}, account.authorities) || userIsRecomAuditor || userIsRecomResposanble);
    const canDelete = account && (hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.DELETE]}, account.authorities) || userIsRecomAuditor || userIsRecomResposanble);

    const getUsers = (usersIds: number[]) =>{
        const uIds = [...usersIds].filter(id => ![...users].some(tu => tu.id === id));
         if(uIds && uIds.length !==0){
             setLoading(true);
             axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.in=${uIds.join(",")}`)
                 .then(res =>{
                     if(res.data && res.data.length !== 0){
                         setUsers([...users, ...res.data]);
                     }
                 }).catch(e =>{
                     /* eslint-disable no-console */
                     console.log(e);
                 }).finally(()=>{
                     setLoading(false);
                 })
         }
    }
 
    const getRecomUsers = () =>{
        if(props.recom && serviceIsOnline(SetupService.AUDIT)){
         setLoading(true);
         axios.get<IAuditRecomUser[]>(`${API_URIS.auditRecomUserApiUri}/?recomId.equals=${props.recom.id}`)
              .then(res =>{
                  setRecomUsers(res.data);
                  if(res.data && res.data.length !== 0)
                     getUsers(res.data.map(u => u.userId));
              }).catch(() =>{}).finally(() =>{
                  setLoading(false);
              })
        }
    }
    
    useEffect(() =>{
        getRecomUsers();
    }, [props.recom.id])

    const handleClose = () =>props.onClose(); 

    const tabsLinks: AsyncTabLinkProps[] = [
        {
            index:0,
            label: `${translate(`microgatewayApp.AuditUserRole.${AuditUserRole.EXECUTOR.toString()}`) + 's'}`,
            active: role === AuditUserRole.EXECUTOR,
            icon: <Person />,
            onClick: () => setRole(AuditUserRole.EXECUTOR),
        },
        {
            index:1,
            label: `${translate(`microgatewayApp.AuditUserRole.${AuditUserRole.SUBMITOR.toString()}`) + 's'}`,
            active: role === AuditUserRole.SUBMITOR,
            icon: <TouchApp />,
            onClick: () => setRole(AuditUserRole.SUBMITOR),
        },
        {
            index:2,
            label: `${translate(`microgatewayApp.AuditUserRole.${AuditUserRole.VALIDATOR.toString()}`) + 's'}`,
            active: role === AuditUserRole.VALIDATOR,
            icon: <HowToReg />,
            onClick: () => setRole(AuditUserRole.VALIDATOR),
        }
    ];
    const handleDelete = (user: IUserExtra) =>{
        if(user && role){
            let toDelete = [...recomUsers].find(au => au.userId === user.id && au.role === role);
            if(toDelete && toDelete.id){
                setUserManageLoading(true);
                axios.delete(`${API_URIS.auditRecomUserApiUri}/${toDelete.id}`)
                    .then(() => {
                        setRecomUsers([...recomUsers].filter(au => au.id !== toDelete.id))
                        toDelete = null;
                    }).catch(e => console.log(e))
                    .finally(() => setUserManageLoading(false));
            }
        }
    }

    const handleSelect = (user: IUserExtra) =>{
        if(user && role && props.recom && props.recom.id){
            if(![...recomUsers].some(u => u.userId === user.id && u.role === role)){
                setUserManageLoading(true);
                const entity: IAuditRecomUser = {
                    recomId: props.recom.id,
                    role,
                    userId: user.id,
                    userEmail: getUserExtraEmail(user),
                    userFullName: getUserExtraFullName(user),
                }
                axios.post<IAuditRecomUser>(API_URIS.auditRecomUserApiUri, cleanEntity(entity))
                    .then(res => {
                        if(res.data){
                            setRecomUsers([...recomUsers, res.data])
                            if(![...users].some(u => u.id === user.id))
                                setUsers([...users, user]);
                        }
                    }).catch(e => console.log(e))
                    .finally(() => setUserManageLoading(false))
            }
        }
    }

    const roleUsers = [...users].filter(u => [...recomUsers].some(au => au.userId === u.id && au.role === role));

    const PreviewUserItem = ({ u }: {u: IUserExtra}) => {
        const getRoles = () =>{
            const uRoles = u && props.previewUsersWithRole ? [...recomUsers].filter(au => au.userId === u.id) : [];
            const joinedRoles = uRoles.map(ur => translate(`microgatewayApp.AuditUserRole.${ur.role.toString()}`)).join(",")
            return uRoles && uRoles.length !== 0 ? `( ${joinedRoles} )` : "";
        }

        return (
            <React.Fragment>
                <Chip 
                  avatar={<CustomAvatar 
                     alt=""
                     photoId={u.photoId}
                     loadingSize={15}
                     avatarProps={{
                        className: classes.previwUserAvatar,
                     }}
                   />} 
                  clickable={false}
                  label={`${getUserExtraFullName(u)}${getRoles()}`}
                  className="mb-1 ml-1 bg-white border"
                />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <MyCustomModal
                open={open} 
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faUsers} />}
                title={translate(`microgatewayApp.microrisqueAuditRecomUser.home.title`)}
            >
                {serviceIsOnline(SetupService.AUDIT) ? <>
                    <AsyncHorizontalTabLinkWrapper 
                        linkBtns={[...tabsLinks]}
                        activeIndex={role === AuditUserRole.SUBMITOR ? 1 : role === AuditUserRole.VALIDATOR ? 2 : 0 }
                    />
                    <Box width={1}>
                        <AuditRecomUserTab
                            recom={props.recom}
                            roleUsers={[...roleUsers]}
                            role={role}
                            canAdd={canUpdate}
                            canDelete={canDelete}
                            handleDelete={handleDelete}
                            handleSelect={handleSelect}
                            loading={userManageLoading}
                            hideTitle
                        />
                    </Box>
                </>
                :
                <Box width={1} display="flex" justifyContent="center" flexWrap="wrap"
                    alignItems="flex-end" mt={5} mb={5}>
                    <FontAwesomeIcon  icon={faExclamationTriangle} size="3x" className="text-warning"/>
                    <Typography variant="h3" className="ml-3 mr-3 text-warning">
                        {translate("_global.label.nnavailableService")+' !'}
                    </Typography>
                </Box> 
                }
            </MyCustomModal>
            {props.previewUsers && <>
                {loading ?  'loading...' : <>
                    {[...users].filter(u => [...recomUsers].some(au => au.userId === u.id))
                    .map((u, index) => <PreviewUserItem key={index} u={u}/>)}
                    {!users || [...users].filter(u => [...recomUsers].some(au => au.userId === u.id)).length === 0 && <>
                        {props.notFoundMessage || translate("microgatewayApp.userExtra.home.notFound") }
                    </>}
                </>}
            </>}
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(AuditRecomUser);