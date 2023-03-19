import { Avatar, Backdrop, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Modal, TablePagination, Typography } from "@material-ui/core";
import { IEmployee } from "app/shared/model/employee.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src, getTotalPages } from "app/shared/util/helpers";
import React from "react";
import { Close, Person } from "@material-ui/icons";
import { Translate } from "react-jhipster";
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
        background: theme.palette.primary.dark,
        color: 'white',
    },
    cardContent:{
        height: '85%',
        overflow: 'auto',
        background: theme.palette.background.paper,
    },
    cardActions:{
        background: theme.palette.primary.dark,
        color: 'white',
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
      padding: 1,
      border: `1px solid ${theme.palette.grey[500]}`,
      cursor: 'pointer',
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

interface ITaskUserGroupUserModalProps{
    task: ITask,
    open: boolean,
    onClose: Function,
}

export const TaskGroupUserModal = (props: ITaskUserGroupUserModalProps) =>{

   const [activePage, setActivePage] = useState(0);

   const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

   const [totalItems, setTotalItems] = useState(0);
   
   const [emps, setEmps] = useState<IEmployee[]>([]);

   const [loading, setLoading] = useState(false);

   const getEmployes = () =>{
       setLoading(true);
        const requestUri = `${API_URIS.employeeApiUri}/?departmentId.equals=${props.task.groupId}&page=${activePage}&size=${itemsPerPage}`;
            
        /* eslint-disable no-console */
        console.log(requestUri);
        axios.get<IEmployee[]>(`${requestUri}`).then(res =>{
                setEmps([...res.data]);
                setTotalItems(parseInt(res.headers['x-total-count'],10));
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
   }

   useEffect(() =>{
        getEmployes();
   }, [props.task, activePage]);
  
   const handleClose = () =>{
       props.onClose();
   }

   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
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
                        classes={{
                            root: classes.cardheader,
                        }}
                        action={
                            <IconButton onClick={handleClose} color="inherit">
                                <Close />
                            </IconButton>
                        }
                        avatar={
                            <Avatar>
                                 <Person />
                            </Avatar>
                        }
                        title={
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" className="">
                                    <Translate contentKey="_global.label.users">Users</Translate>&nbsp;
                                    <Translate contentKey="_global.label.in">IN</Translate>&nbsp;
                                    <Translate contentKey="_global.label.le">the</Translate>&nbsp;
                                    <Translate contentKey="_global.label.group">group</Translate>&nbsp;
                                </Typography>
                            </Box>
                        }
                     />
                    <CardContent className={classes.cardContent}>
                        {loading && <Box width={1} textAlign="center">Loading...</Box>}
                        <Grid container spacing={1} justify="center" alignItems="flex-end">
                            {emps.map((emp) => {
                                const labelId = `checkbox-list-secondary-label-${emp.id}`;
                                return (
                                    <Grid key={emp.id} item xs={6} md={4} lg={3}>
                                        <Box width={1} boxShadow={5} className={classes.employeItemBox}>
                                          <List dense className={classes.list}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                <CustomAvatar
                                                    alt={`${emp.firstName + ' '+emp.lastName}`}
                                                    photoId={emp.photoId}
                                                />
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary={`${emp.firstName ? emp.firstName : ' '} ${emp.lastName ? emp.lastName : ' '}`} 
                                                    secondary={`${emp.fonction ? emp.fonction.name : ''}
                                                    ${emp.department && emp.department.name ?  emp.fonction ? ' - ' + emp.department.name : emp.department.name : ''}`}
                                                    classes={{
                                                        secondary: classes.listeItemTextSecondary,
                                                        primary: classes.listeItemTextPrimary,
                                                    }}/>
                                                </ListItem>
                                            </List>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        {!loading && (!emps || !emps.length) && 
                                  <Typography color="primary" variant="h6" className="w-100 text-center">
                                    <Translate contentKey="microgatewayApp.micropeopleEmployee.home.notFound">No Employees found</Translate>
                                  </Typography>}
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Box display="flex" justifyContent="space-around" textAlign="center" width={1}>
                            <TablePagination className={emps && emps.length > 0 ? 'p-0 m-0' : 'd-none'}
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

export default TaskGroupUserModal;