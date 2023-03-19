import { Avatar, Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Modal, TablePagination, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import React from "react";
import { Close, HowToReg, Person, TouchApp } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { ProjectTaskUserRole } from "app/shared/model/enumerations/project-task-user-role.model";
import { IProjectTaskUser } from "app/shared/model/microproject/project-task-user.model";
import theme from "app/theme";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '50%',
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
        minHeight: '30vh',
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
    pagination:{
     padding: 0,
     color: theme.palette.background.paper,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.background.paper,
       display: 'none',
   },
   employeItemBox:{
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: '5px',
   },
   list: {
       width: '100%',
       backgroundColor: theme.palette.background.paper,
       '&:hover':{
            backgroundColor: theme.palette.background.default,
       }
   },
   listeItemTextPrimary:{
       color: theme.palette.primary.dark,
       fontWeight: 'bold',
   },
   listeItemTextSecondary:{
        fontSize: '10px',
        color: theme.palette.info.light,
   },
})

interface IProjectTaskUserSelectorModalProps{
    taskUsers: IUserExtra[],
    open: boolean,
    onClose: Function,
    task: IProjectTask,
    role: ProjectTaskUserRole,
}

export const ProjectTaskUserSelectorModal = (props: IProjectTaskUserSelectorModalProps) =>{

    const [taskUsers, setTaskUsers] = useState([...props.taskUsers]);

   const [activePage, setActivePage] = useState(0);

   const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

   const [totalItems, setTotalItems] = useState(0);
   
   const [users, setUsers] = useState<IUserExtra[]>([]);

   const [loading, setLoading] = useState(false);

   const [managingUser, setManagingUser] = useState<IUserExtra>(null);

   const [waiting, setWaiting] = useState(false);


   const userIsAssociatedToTaskByGroup = (user: IUserExtra) =>{
       return (user && props.task && user.employee && user.employee.department && user.employee.department.id === props.task.groupId);
   }

   const getUsers = (page?: number) =>{
        const p = page || page === 0 ? page : activePage;
        setLoading(true);
        console.log("page",p);
        const ids = [...taskUsers].map(tu => tu.id).join(",");
        let requestUri = `${API_URIS.userExtraApiUri}/id-not-in/?ids=${ids}`;
        requestUri = `${requestUri}&page=${p}&size=${itemsPerPage}`;
             
        axios.get<IUserExtra[]>(`${requestUri}`).then(res =>{
                setUsers([...res.data]);
                setTotalItems(parseInt(res.headers['x-total-count'],10));
        }).catch(e =>{
            /* eslint-disable no-console */
            console.log(e);
        }).finally(() =>{
            setLoading(false);
        })
   }

   

   useEffect(() =>{
        getUsers();
   }, [props.role, props.taskUsers]);

   const selectUser = (userToSelect: IUserExtra) =>{
    setManagingUser(userToSelect)
     if(userToSelect){
        setWaiting(true);
        const entity: IProjectTaskUser = {
            role: props.role,
            taskId: props.task ? props.task.id: null,
            userId: userToSelect.id,
            userEmail: userToSelect.user && userToSelect.user.email ? userToSelect.user.email 
                        : userToSelect.employee && userToSelect.employee.email ? userToSelect.employee.email : null,
            userName: getUserExtraFullName(userToSelect),
        }
        axios.post<IProjectTaskUser>(`${API_URIS.projectTaskUserApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    setTaskUsers([...taskUsers, userToSelect])
                    setUsers([...users].filter(u => u.id !== userToSelect.id));
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setWaiting(false);
            })
        }
    }

    const unSelectUser = (user: IUserExtra) =>{
        setManagingUser(user);
        if(user && !userIsAssociatedToTaskByGroup(user)){
            setWaiting(true);
            axios.get<IProjectTaskUser[]>(`${API_URIS.projectTaskUserApiUri}/?userId.equals=${user.id}&taskId.equals=${props.task.id}&role.equals=${props.role}`)
                 .then(res =>{
                    if(res.data && res.data.length !==0){
                        res.data.forEach(itu =>{
                            setWaiting(true);
                            axios.delete(`${API_URIS.projectTaskUserApiUri}/${itu.id}`)
                            .then(() =>{
                                setTaskUsers([...taskUsers].filter(tu => tu.user && tu.user.id !== user.id));
                                setUsers([...users, user]);
                            }).catch(er =>{
                                /* eslint-disable no-console */
                                console.log(er);
                            }).finally(() =>{
                                setWaiting(false);
                            })
                        });
                    }
                 }).catch((e) =>{
                     /* eslint-disable no-console */
                     console.log(e);
                 }).finally(() =>{
                     setWaiting(false);
                 })
        }
    }
  
   const handleClose = () =>{
       props.onClose(taskUsers);
   }

   
   const handleToggle = (user: IUserExtra) =>{
        if(user){
            if([...taskUsers].some(tu => tu.id === user.id))
                unSelectUser(user);
            else
                selectUser(user);
        }
   }

   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getUsers(newPage);
   }

   const classes = useStyles();
   
   return (
       <React.Fragment>
           <Modal open={props.open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.cardheader}
                        action={
                            <IconButton onClick={handleClose} color="inherit">
                                <Close />
                            </IconButton>
                        }
                        avatar={
                            <>
                                {props.role === ProjectTaskUserRole.SUBMITOR && <TouchApp />}
                                {props.role === ProjectTaskUserRole.VALIDATOR && <HowToReg />}
                                {props.role === ProjectTaskUserRole.EXCEUTOR && <Person />}
                            </>
                        }
                        title={
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h4" className="">
                                    <span className="text-capitalize">{translate(`microgatewayApp.TaskUserRole.${props.role.toString()}`) + 's'}</span>
                                </Typography>
                            </Box>
                        }
                     />
                     <CardContent className={classes.cardContent}>
                         {loading && <Box width={1} textAlign="center">Loading...</Box>}
                         <Box width={1} display="flex" justifyContent="center" alignItems="flex-start" flexWrap="wrap">
                             {[...users].filter(u => !userIsAssociatedToTaskByGroup(u)).map((user) => {
                                 const emp = user.employee;
                                 const labelId = `checkbox-list-secondary-label-${user.id}`;
                                 return (
                                    <Box key={user.id} boxShadow={5} className={classes.employeItemBox} m={3}>
                                        <Card>
                                            <CardHeader  
                                                avatar={
                                                    <CustomAvatar
                                                        alt={getUserExtraFullName(user)}
                                                        photoId={(user && user.employee)? user.employee.photoId : null}
                                                    />
                                                }
                                                title={getUserExtraFullName(user)}
                                                titleTypographyProps={{
                                                    className: classes.listeItemTextPrimary,
                                                }}

                                                subheader={
                                                    <Typography className={classes.listeItemTextSecondary}>
                                                        {`${(emp && emp.fonction) ? emp.fonction.name : 'fonction'}
                                                        ${emp && emp.department && emp.department.name ?  emp.fonction ? ' - ' + emp.department.name : emp.department.name : 'dpetartment'}`}
                                                    </Typography>
                                                }
                                            />
                                            <CardContent>
                                                <Box display="flex" flexWrap="wrap" overflow="auto" justifyContent="center" alignItems="center">
                                                {waiting && managingUser && managingUser.id === user.id && <CircularProgress size={15}/>}
                                                    {[...taskUsers].some(sem => sem.id === user.id) ? 
                                                        <IconButton onClick={() =>handleToggle(user)} color="secondary">
                                                            <FontAwesomeIcon icon={faWindowClose} />
                                                        </IconButton>
                                                        :
                                                        <IconButton onClick={() =>handleToggle(user)} className="text-success">
                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                        </IconButton>
                                                    }
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                 );
                             })}
                         </Box>
                         {!loading && (!users || !users.length) && 
                                   <Typography color="primary" variant="h6" className="w-100 text-center">
                                     <Translate contentKey="microgatewayApp.userExtra.home.notFound">No user found</Translate>
                                   </Typography>}
                     </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Box display="flex" justifyContent="space-around" textAlign="center" width={1}>
                            <TablePagination className={users && users.length > 0 ? 'p-0 m-0' : 'd-none'}
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={() =>{}}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage=""
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                                }}/>
                            <Typography variant="caption" display="block" className="pt-3">{props.task.name}</Typography>
                        </Box>
                    </CardActions>
                </Card>
           </Modal>
       </React.Fragment>
   )
}

export default ProjectTaskUserSelectorModal;