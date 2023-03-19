import { Box, BoxProps, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useEffect, useState } from "react";
import { translate, Translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { ITaskUser } from "app/shared/model/microprocess/task-user.model";
import { TaskUserRole } from "app/shared/model/enumerations/task-user-role.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { cleanEntity } from "app/shared/util/entity-utils";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '100%',
        boxShadow: 'none',
        background: 'transparent',
        marginTop: theme.spacing(3),
    },
    cardheader:{
        padding: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
    },
    cardContent:{
        background: 'white',
        minHeight: '38vh',
        maxHeight: '80vh',
        overflow: 'auto',
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 5px 5px',
    },
    userItemBox:{
        '&:hover':{
            background: theme.palette.grey[50],
        }
    },
    avatar:{
        height: 35,
        width: 35,
    },
}))


export const TaskUserItem = (props: {tUser: ITaskUser,deleteError?: boolean,
     rootBoxProps?: BoxProps, onDelete?: Function}) =>{
    const { tUser, deleteError, rootBoxProps } = props;
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getUserExtra = () =>{
        if(props.tUser && props.tUser.userId){
            setLoading(true);
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.tUser.userId}`)
                .then(res =>setUserExtra(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }
    
    useEffect(() => {
        getUserExtra();
    }, [props.tUser])

    const userFullName = userExtra ? getUserExtraFullName(userExtra) : tUser ? tUser.userFullName : '';

    const userEmail = userExtra ? getUserExtraEmail(userExtra) : tUser ? tUser.userEmail : '';

    const photoId = userExtra && userExtra.employee ? userExtra.employee.photoId : null;

    return (
        <React.Fragment>
            {tUser && <Box margin={2} p={0} boxShadow={5}
             borderRadius={20} className={classes.userItemBox} {...rootBoxProps}>
               <CardHeader 
                    title={
                        <Box display="flex" justifyContent={"center"} alignItems="flex-start"
                            flexWrap={"wrap"} overflow="auto">
                                <CustomAvatar alt=''
                                    photoId={photoId}
                                    avatarProps={{ 
                                        className: classes.avatar,
                                    }} />
                                <Box ml={2} display={"flex"} justifyContent="center" flexDirection="column" flexWrap="wrap">
                                    {loading && <Box width={1} display="flex" justifyContent={"center"}>
                                        <CircularProgress color="primary" style={{ width:30, height:30, }} />
                                    </Box>}
                                    <Box width={1} display="flex" justifyContent="center" flexWrap="wrap">
                                        <Typography variant="h5" className="ml-2">{userFullName}</Typography>
                                    </Box>
                                    <Box width={1} display="flex" justifyContent="center" flexWrap="wrap">
                                        <Typography variant="caption">{userEmail}</Typography>
                                    </Box>
                                    {deleteError && 
                                        <Box width={1} display="flex" justifyContent="center" flexWrap="wrap">
                                            <Typography variant="body2" color="secondary">
                                                {translate("_global.flash.message.failed")}
                                            </Typography>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                    }
                    action={props.onDelete ? <Tooltip 
                            title={translate("entity.action.delete")}
                            onClick={() =>props.onDelete(tUser)}>
                        <IconButton color="secondary" className=""><Close /></IconButton>
                        </Tooltip> : <></>
                    }
               />
            </Box>}
        </React.Fragment>
    )
}

interface ITaskUserTabProps{
    task: ITask,
    role: TaskUserRole,
    canDelete?: boolean,
    canAdd?: boolean,
    hideTitle?:boolean,
}

export const TaskUserTab = (props: ITaskUserTabProps) =>{
   const { hideTitle, canAdd, canDelete } = props;
   const [loading, setLoading] = useState(false);

   const [tUsers, setTUsers] = useState<ITaskUser[]>([]);

   const [openUserSelectorModal, setOpenUserSelectorModal] = useState(false);

   const [activeUser, setActiveUser] = useState<ITaskUser>(null);

   const [error, setError] = useState(false);

   const getUsers = () =>{
       if(props.task && props.role){
        setLoading(true);
        setActiveUser(null);
        axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${props.task.id}&role.equals=${props.role}`)
             .then(res =>{
                    setTUsers(res.data);
             }).catch((e) =>{
                 setError(true);
             }).finally(() =>{
                 setLoading(false);
             })
       }
   }

   const hideError = () => setError(false);

   useEffect(() =>{
        getUsers();
   }, [props.task, props.role])

   useEffect(() =>{
       if(error)
            setTimeout(hideError, 1000);
   }, [error])

   const handleOpenSelector = () =>{
       setOpenUserSelectorModal(true);
   }

   const handleCloseModalSelector = (selectedUsers: IUserExtra[]) =>{
       setOpenUserSelectorModal(false);
       if(selectedUsers && selectedUsers.length !==0)
        setTUsers([...selectedUsers]);
   }

   const handleRemoveUser = (tUser: ITaskUser) =>{
       if(tUser && tUser.id && props.task && props.role){
           setLoading(true);
           setError(false);
           setActiveUser(tUser);
           axios.delete(`${API_URIS.taskUserApiUri}/${tUser.id}`)
           .then((res) =>{
               if(res.status >= 200 && res.status <= 205)
                setTUsers([...tUsers.filter(u => u.id !== tUser.id)]);
            }).catch((e) =>{
                console.log(e);
                setError(true);
            }).finally(() => setLoading(false))
       }
   }
   
   const classes = useStyles();

   const unSelectableIds = [...tUsers].map(tu => tu.id);

   const selectUser = (userToSelect: IUserExtra) =>{
     setActiveUser(null);
     if(userToSelect){
        setLoading(true);
        setError(false);
        const entity: ITaskUser = {
            role: props.role,
            task: props.task,
            userId: userToSelect.id,
            userFullName: getUserExtraFullName(userToSelect),
            userEmail: getUserExtraEmail(userToSelect)
        }
        axios.post<ITaskUser>(`${API_URIS.taskUserApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    setTUsers([...tUsers, res.data])
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
                setError(true)
            }).finally(() =>{
                setLoading(false);
            })
        }
    }

    const unSelectUser = (user: IUserExtra) =>{
        if(user && props.role){
            const tUserToDelete = [...tUsers].find(tu => tu.userId === user.id && tu.role === props.role);
            if(tUserToDelete && tUserToDelete.id){
                setLoading(true);
                setError(false);
                setActiveUser(tUserToDelete);
                axios.delete(`${API_URIS.taskUserApiUri}/${tUserToDelete.id}`)
                .then((res) =>{
                    if(res.status >= 200 && res.status <= 205)
                        setTUsers([...tUsers].filter(tu => tu.userId !== user.id));
                }).catch(er =>{
                    /* eslint-disable no-console */
                    console.log(er);
                    setError(true);
                }).finally(() =>{
                    setLoading(false);
                })
            }
        }
    }

   const handleSelectChange = (ue?: IUserExtra, isSelecting?: boolean) =>{
       if(ue){
           if(isSelecting)
            selectUser(ue);
           else
            unSelectUser(ue);
       }
   }

   return (
       <React.Fragment>
           {openUserSelectorModal && props.task && props.role && 
            <UserExtraFinder2 
                open={openUserSelectorModal}
                unSelectableIds={unSelectableIds}
                multiple
                onSelectChange={handleSelectChange}
                onClose={handleCloseModalSelector} 
            />}
            <Card className={classes.card}>
                <CardHeader
                    className={classes.cardheader}
                    avatar={
                        <>
                           {canAdd &&
                            <IconButton className="" color="primary" title="Add"
                                onClick={handleOpenSelector}>
                                <Add />
                            </IconButton>}
                        </>
                    }
                    title={
                        <Box display="flex" justifyContent="space-between">
                            {!hideTitle && 
                                <Typography variant="h4" className="mr-3">
                                    <span className="text-capitalize">{translate(`microgatewayApp.TaskUserRole.${props.role.toString()}`) + 's'}</span>
                                </Typography>
                            }
                        </Box>
                    }
                    />
                <CardContent className={classes.cardContent}>
                    {loading && <Box width={1} textAlign="center">Loading...</Box>}
                    {(error && !activeUser) && <Box width={1} textAlign="center">
                        <Typography variant="body2" color="secondary">
                            {translate("_global.flash.message.failed")}
                        </Typography>
                    </Box>}
                    <Box display="flex" justifyContent="center" alignItems="center"
                        flexWrap="wrap" overflow="auto">
                        {[...tUsers].map((tUser, index) =>(
                            <TaskUserItem key={index} tUser={tUser}
                                deleteError={(activeUser && activeUser.id === tUser.id && error)}
                                onDelete={canDelete ? (tu) => handleRemoveUser(tu) : null}/>
                        ))}
                    </Box>
                    {!loading && (!tUsers || tUsers.length ===0) && <Box marginTop={10}>
                        <Typography color="primary" variant="h6" className="w-100 text-center">
                            <Translate contentKey="microgatewayApp.userExtra.home.notFound">No user found</Translate>
                        </Typography>
                    </Box>}
                </CardContent>
                <CardActions className={classes.cardActions}>
                </CardActions>
            </Card>
       </React.Fragment>
   );
}

export default TaskUserTab;