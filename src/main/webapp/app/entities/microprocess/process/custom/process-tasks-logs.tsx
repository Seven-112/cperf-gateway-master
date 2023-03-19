import { IProcess } from "app/shared/model/microprocess/process.model"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { ITask } from "app/shared/model/microprocess/task.model";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { Box, CardHeader, CircularProgress, Collapse, colors, List, ListItem, ListItemText, makeStyles, TablePagination, Typography } from "@material-ui/core";
import { TaskStatusTraking } from "../../task-status-traking/custom/task-status-traking";
import { ITaskUser } from "app/shared/model/microprocess/task-user.model";
import { VArrowToogleButton } from "app/shared/component/custom-button";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { translate } from "react-jhipster";
import clsx from "clsx";

const useStyles = makeStyles(theme =>({
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    listItem:{
        boxShadow: `0px 1px 2px ${theme.palette.primary.dark}`,
        marginBottom: 7,
        padding: 0,
        borderRadius: `7px 7px 0 0`,
        "&:hover":{
            background: colors.grey[100],
        },
    },
    openList:{
        background: colors.grey[100],
    },
    pagination:{
     padding:0,
     color: theme.palette.primary.dark,
   },
   input:{
       width: theme.spacing(10),
       display: 'none',
   },
   selectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
   justificationCard:{
       width: '44%',
       [theme.breakpoints.down("sm")]:{
           width: '90%',
       },
   }
}))

interface ProcessTasksLogsProps extends StateProps{
    processId: any,
}

const TaskLogsListItem = ({task, account } : {task: ITask, account: any}) =>{
    const [open, setOpen] = useState(false);
    const [taskUserRoles, setTaskUsersRole] = useState<ITaskUser[]>([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const getTaskUsers = () =>{
        if(account && account.id && task && task.id && open){
            setLoading(true)
            axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${task.id}&userId.equals=${account.id}`)
                .then(res =>{
                    setTaskUsersRole([...res.data]);
                }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getTaskUsers();
    }, [account])
    
    return (
        <>
          {task && <ListItem className={clsx(classes.listItem, {[classes.openList]: open})}>
                <ListItemText
                    primary={<CardHeader
                    title={
                        <Typography variant="h6" color="primary">
                            {`${translate("microgatewayApp.microprocessTask.detail.title")} : ${task.name}`}
                        </Typography>
                    }
                    action={<VArrowToogleButton down={open}
                         onClick={() => setOpen(!open)} 
                         btnProps={{
                            color: 'default'
                         }}
                    />}
                    subheader={<Collapse in={open}>
                        <TaskStatusTraking 
                            account={account} 
                            task={task}
                            userTaskRoles={[...taskUserRoles].map(tur => tur.role)} />
                    </Collapse>}
                 />}
                />
            </ListItem>}
        </>
    )
}

export const ProcessTasksLogs = (props: ProcessTasksLogsProps)=>{
    const { account } = props;
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState((ITEMS_PER_PAGE/2));
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getTasks = (p?:number, rows?: number) =>{
        if(props.processId && serviceIsOnline(SetupService.PROCESS)){
            const page = p || p===0 ? p : activePage;
            const size = rows || itemsPerPage;
            setLoading(true);
            let apiUri = `${API_URIS.taskApiUri}?processId.equals=${props.processId}&valid.equals=true`;
            apiUri = `${apiUri}&page=${page}&size=${size}`;
            axios.get<ITask[]>(apiUri).then(res =>{
                setTasks([...res.data]);
                setTotalItems(parseInt(res.headers["x-total-count"], 10))
            }).catch(e =>{
                console.log(e)
            }).finally(()=> {
                setLoading(false)
            })
        }
    }

    const handlePagination =( event, newPage) => {
        setActivePage(newPage);
        getTasks(newPage);
    }
  
    const handleChangeItemPerPage = (e) =>{
        const value = parseInt(e.target.value, 10);
        setItemsPerPage(value);
        getTasks(value);
    }

    useEffect(() =>{
        getTasks();
    }, [props.processId])

    return (
        <React.Fragment>
            {loading && 
                <Box width={1} display="flex" justifyContent="center" alignItems="center"
                    flexWrap="wrap" overflow="auto" p={2}>
                        <CircularProgress style={{ width:30, height:30 }}/> <Typography className="ml-3">Loading...</Typography>
                </Box>
            }
            <Box width={1}>
                <List>
                    {[...tasks].map((t, index) =>(
                        <TaskLogsListItem key={index} task={t} account={account} />
                    ))}
                </List>
            </Box>
            {totalItems > 0 && <Box width={1}>
                    <TablePagination className={(tasks && tasks.length !== 0)? '' : 'd-none'}
                        component="div"
                        count={totalItems}
                        page={activePage}
                        onPageChange={handlePagination}
                        rowsPerPage={itemsPerPage}
                        onChangeRowsPerPage={handleChangeItemPerPage}
                        rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                        labelRowsPerPage=""
                        labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                        classes={{ 
                            root: classes.pagination,
                            input: classes.input,
                            selectIcon: classes.selectIcon,
                    }}/>
            </Box>}
        </React.Fragment>
    )
}

interface ProcessTasksLogsModalProps extends ProcessTasksLogsProps{
    open?: boolean,
    process?: IProcess
    onClose?: Function
}

export const ProcessTasksLogsModal = (props: ProcessTasksLogsModalProps) =>{
    const { open, processId, process, account } = props;

    const classes = useStyles();

    const handleClose = () => props.onClose();

    return (
        <>
            <MyCustomModal 
                open={open}
                onClose={handleClose}
                title={`${translate("_global.label.processAllTasksLogs", {name: process ? process.label : ""})}`}
                rootCardClassName={classes.card}
            >
                <ProcessTasksLogs account={account} processId={processId} />
            </MyCustomModal>
        </>
    )
}

const mapStateToProps = ({ authentication  }: IRootState) =>({
    account: authentication.account,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ProcessTasksLogs);