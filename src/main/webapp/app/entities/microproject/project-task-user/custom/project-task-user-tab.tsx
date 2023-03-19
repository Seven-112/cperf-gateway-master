import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, Fab, IconButton, makeStyles, Popover, Tooltip, Typography } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { translate, Translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { IEmployee } from "app/shared/model/employee.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { IProjectTaskUser } from "app/shared/model/microproject/project-task-user.model";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
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

interface ProjectTaskUserTabProps{
    task: IProjectTask,
    role: ProjectTaskUserRole,
    canDelete?: boolean,
    canAdd?: boolean,
    hideTitle?:boolean,
}



const TaskUserWidget = (props: { ue: IUserExtra, deleteError?: boolean, loading?: boolean,  handleRemove?: Function, }) =>{
    const { ue, deleteError, loading } = props;
    const photoId = ue && ue.employee ? ue.employee.photoId : null;

    const classes = useStyles();

    return (
       <React.Fragment>
           {ue && <Box margin={2} p={0} boxShadow={5}
           borderRadius={20} className={classes.userItemBox}>
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
                                       <Typography variant="h5" className="ml-2">{getUserExtraFullName(ue)}</Typography>
                                   </Box>
                                   <Box width={1} display="flex" justifyContent="center" flexWrap="wrap">
                                       <Typography variant="caption">{getUserExtraEmail(ue)}</Typography>
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
                   action={props.handleRemove ? <Tooltip 
                           title={translate("entity.action.delete")}
                           onClick={() =>props.handleRemove(ue)}>
                       <IconButton color="secondary" className=""><Close /></IconButton>
                       </Tooltip> : <></>
                   }
           />
           </Box>}
       </React.Fragment>
    )
  }

export const ProjectTaskUserTab = (props: ProjectTaskUserTabProps) =>{
   const { hideTitle, canAdd, canDelete } = props;
   const [loading, setLoading] = useState(false);

   const [tUsers, setTUsers] = useState<IUserExtra[]>([]);

   const [openUserSelectorModal, setOpenUserSelectorModal] = useState(false);

   const [activeUser, setActiveUser] = useState<IUserExtra>(null);
   const [deleteError, setDeleteError] = useState(false);

   const getTaskUsers = (usersIds: number[]) =>{
       const uIds = [...usersIds].filter(id => ![...tUsers].some(tu => tu.id === id));
        if(uIds && uIds.length !==0){
            setLoading(true);
            axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.in=${uIds.join(",")}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setTUsers([...tUsers, ...res.data]);
                    }
                }).catch(e =>{
                    /* eslint-disable no-console */
                    console.log(e);
                }).finally(()=>{
                    setLoading(false);
                })
        }
   }

   const getUsers = () =>{
       if(props.task && props.role){
        setLoading(true);
        axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?taskId.equals=${props.task.id}&role.equals=${props.role}`)
             .then(res =>{
                 if(res.data && res.data.length !== 0)
                    getTaskUsers(res.data.map(u => u.userId));
             }).catch(() =>{}).finally(() =>{
                 setLoading(false);
             })
       }
   }

   useEffect(() =>{
        getUsers();
   }, [props.task, props.role])

   const handleOpenSelector = () => setOpenUserSelectorModal(true);

   const handleCloseModalSelector = (selectedUsers: IUserExtra[]) =>{
       setOpenUserSelectorModal(false);
       if(selectedUsers && selectedUsers.length !==0)
        setTUsers([...selectedUsers]);
   }

   const handleRemoveUser = (user: IUserExtra) =>{
       if(user && user.id && props.task && props.task.id){
            setActiveUser(user);
            // deleting task user id
            setLoading(true);
            setDeleteError(false);  
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?taskId.equals=${props.task.id}&userId.equals=${user.id}&role.equals=${props.role}`)
                .then(resp =>{
                    resp.data.forEach(item =>{
                        setLoading(true);
                        axios.delete(`${API_URIS.projectTaskUserApiUri}/${item.id}`)
                            .then((res) =>{
                                if(res.status >= 200 && res.status <= 205){
                                    setTUsers([...tUsers.filter(u => u.id !== user.id)]);
                                    setDeleteError(false)
                                }else{
                                    setDeleteError(true)
                                }
                                }).catch((e) =>{
                                    console.log(e);
                                    setDeleteError(true);
                                }).finally(() =>  setLoading(false))
                    })
                }).catch(() =>{
                    setDeleteError(true)
                    setLoading(false);
                })
       }
   }
   
   const classes = useStyles();

   const unSelectableIds = [...tUsers].map(tu => tu.id);

   const selectUser = (userToSelect: IUserExtra) =>{
     if(userToSelect && props.task){
        setLoading(true);
        const entity: IProjectTaskUser = {
            role: props.role,
            taskId:props.task.id,
            userId: userToSelect.id,
            userEmail: getUserExtraEmail(userToSelect),
            userName: getUserExtraFullName(userToSelect),
        }
        axios.post<IProjectTaskUser>(`${API_URIS.projectTaskUserApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    setTUsers([...tUsers, userToSelect])
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
        }
    }

    const unSelectUser = (user: IUserExtra) =>{
        if(user){
            setLoading(true);
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?userId.equals=${user.id}&taskId.equals=${props.task.id}&role.equals=${props.role}`)
                 .then(res =>{
                    if(res.data && res.data.length !==0){
                        res.data.forEach(itu =>{
                            setLoading(true);
                            axios.delete(`${API_URIS.projectTaskUserApiUri}/${itu.id}`)
                            .then(() =>{
                                setTUsers([...tUsers].filter(tu => tu.user && tu.user.id !== user.id));
                            }).catch(er =>{
                                /* eslint-disable no-console */
                                console.log(er);
                            }).finally(() =>{
                                setLoading(false);
                            })
                        });
                    }
                 }).catch((e) =>{
                     /* eslint-disable no-console */
                     console.log(e);
                 }).finally(() =>{
                     setLoading(false);
                 })
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
                                    <span className="text-capitalize">{translate(`microgatewayApp.ProjectTaskUserRole.${props.role.toString()}`) + 's'}</span>
                                </Typography>
                            }
                        </Box>
                    }
                    />
                <CardContent className={classes.cardContent}>
                    {loading && <Box width={1} textAlign="center">Loading...</Box>}
                    <Box display="flex" justifyContent="center" flexWrap={"wrap"}>
                        {tUsers.map(user =>( 
                            <TaskUserWidget key={user.id} ue={user} 
                                handleRemove={canDelete ? handleRemoveUser : null}
                                loading={loading && activeUser && activeUser.id === user.id}
                                deleteError={deleteError && activeUser && activeUser.id === user.id}
                             />
                        ))}
                    </Box>
                    {!loading && (!tUsers || tUsers.length ===0) && <Box marginTop={10}>
                        <Typography color="primary" variant="h6" className="w-100 text-center">
                            <Translate contentKey="microgatewayApp.userExtra.home.notFound">No user found</Translate>
                        </Typography>
                    </Box>}
                </CardContent>
            </Card>
       </React.Fragment>
   );
}

export default ProjectTaskUserTab;