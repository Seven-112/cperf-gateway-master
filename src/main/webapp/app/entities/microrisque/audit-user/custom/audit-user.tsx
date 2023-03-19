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
import { HowToReg, Person, TouchApp } from "@material-ui/icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import axios from 'axios';
import { IAuditUser } from "app/shared/model/microrisque/audit-user.model";
import AsyncHorizontalTabLinkWrapper, { AsyncTabLinkProps } from "app/shared/component/async-tab-link";
import AuditUserTab from "./audit-user-tab";
import CustomAvatar from "app/shared/component/custom-avatar";
import { cleanEntity } from "app/shared/util/entity-utils";

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

interface AuditUserProps extends StateProps, DispatchProps{
    open?: boolean,
    audit: IAudit,
    previewUsers?: boolean,
    notFoundMessage?: string,
    previwWithRole?: boolean,
    onClose: Function,
}

export const AuditUser = (props: AuditUserProps) =>{
    const { account, open } = props;

    const [users, setUsers] = useState<IUserExtra[]>([]);

    const [aUsers, setAusers] = useState<IAuditUser[]>([]);

    const [role, setRole] = useState(AuditUserRole.EXECUTOR);
    
    const [loading, setLoading] = useState(false);

    const [userManageLoading, setUserManageLoading] = useState(false);

    const classes = useStyles();

    const canUpdate = account && hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.UPDATE]}, account.authorities);
    const canDelete = account && hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.DELETE]}, account.authorities);

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
 
    const getAuditUsers = () =>{
        if(props.audit && serviceIsOnline(SetupService.AUDIT)){
         setLoading(true);
         axios.get<IAuditUser[]>(`${API_URIS.auditUserApiUri}/?auditId.equals=${props.audit.id}`)
              .then(res =>{
                  setAusers(res.data);
                  if(res.data && res.data.length !== 0)
                     getUsers(res.data.map(u => u.userId));
              }).catch(() =>{}).finally(() =>{
                  setLoading(false);
              })
        }
    }
    
    useEffect(() =>{
        getAuditUsers();
    }, [props.audit.id])

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
            let toDelete = [...aUsers].find(au => au.userId === user.id && au.role === role);
            if(toDelete && toDelete.id){
                setUserManageLoading(true);
                axios.delete(`${API_URIS.auditUserApiUri}/${toDelete.id}`)
                    .then(() => {
                        setAusers([...aUsers].filter(au => au.id !== toDelete.id))
                        toDelete = null;
                    }).catch(e => console.log(e))
                    .finally(() => setUserManageLoading(false));
            }
        }
    }
    const handleSelect = (user: IUserExtra) =>{
        if(user && role && props.audit && props.audit.id){
            if(![...aUsers].some(u => u.userId === user.id && u.role === role)){
                setUserManageLoading(true);
                const entity: IAuditUser = {
                    auditId: props.audit.id,
                    role,
                    userId: user.id,
                    userEmail: getUserExtraEmail(user),
                    userFullName: getUserExtraFullName(user),
                }
                axios.post<IAuditUser>(API_URIS.auditUserApiUri, cleanEntity(entity))
                    .then(res => {
                        if(res.data){
                            setAusers([...aUsers, res.data])
                            if(![...users].some(u => u.id === user.id))
                                setUsers([...users, user]);
                        }
                    }).catch(e => console.log(e))
                    .finally(() => setUserManageLoading(false))
            }
        }
    }

    const roleUsers = [...users].filter(u => [...aUsers].some(au => au.userId === u.id && au.role === role));

    const PreviewUserItem = ({ u }: {u: IUserExtra}) => {
        const getRoles = () =>{
            const uRoles = u && props.previwWithRole ? [...aUsers].filter(au => au.userId === u.id) : [];
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
                title={translate(`microgatewayApp.microrisqueAuditUser.home.title`)}
                footer={
                    props.audit ?
                    <Box display="flex" justifyContent="center" textAlign="center" width={1}>
                        <Typography variant="caption" 
                        style={{ fontSize: '10px'}}>
                            {props.audit.title}
                        </Typography>
                    </Box>
                    : <></>
                }
                foolterClassName={props.audit ? classes.cardActions : null}
            >
                
                {serviceIsOnline(SetupService.AUDIT) ? <>
                    <AsyncHorizontalTabLinkWrapper 
                        linkBtns={[...tabsLinks]}
                        activeIndex={role === AuditUserRole.SUBMITOR ? 1 : role === AuditUserRole.VALIDATOR ? 2 : 0 }
                    />
                    <Box width={1}>
                        <AuditUserTab 
                            audit={props.audit}
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
                    {[...users].filter(u => [...aUsers].some(au => au.userId === u.id))
                    .map((u, index) => <PreviewUserItem key={index} u={u}/>)}
                    {!users || [...users].filter(u => [...aUsers].some(au => au.userId === u.id)).length === 0 && <>
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

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditUser);