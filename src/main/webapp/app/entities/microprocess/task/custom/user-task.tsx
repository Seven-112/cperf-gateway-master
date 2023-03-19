import { ITaskProcess } from "app/shared/model/projection/task-process.model"
import { IRootState } from "app/shared/reducers";
import { useEffect, useState } from "react"
import { connect } from "react-redux";
import { getSession } from 'app/shared/reducers/authentication';
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React from "react";
import { Helmet } from 'react-helmet';
import TaskList from "./task-list";
import { Box, makeStyles, TablePagination } from "@material-ui/core";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { translate } from "react-jhipster";
import { TaskUserRole } from "app/shared/model/enumerations/task-user-role.model";

const useStyles = makeStyles(theme =>({
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    input:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    selectIcon:{
        color:theme.palette.primary.dark,
    },
}))

interface ILoggedTaskProps extends StateProps, DispatchProps{
    status?: TaskStatus,
    role?: TaskUserRole,
    disableStatusChange?: boolean,
    title?: any,
    hideTitile?: boolean,
    inTodoList?:boolean,
}

export const UserTask = (props: ILoggedTaskProps) =>{
    const [tasksProcesss, setTasksProcesses] = useState<ITaskProcess[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(ITEMS_PER_PAGE);
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(props.status);

    const classes = useStyles();

    const getAllEntities = (p?:number, rows?: number) =>{
        setLoading(true);
        const page = (p || p===0) ? p : activePage;
        const size = rows || rowPerPage;
        setTotalItems(0);
        setTasksProcesses([]);
        const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null ;
        if(userId){
            let requestUri = `${API_URIS.taskApiUri}`;
            if(taskStatus){
                   if(props.role){
                    const status = [taskStatus];
                    if(taskStatus !== TaskStatus.ON_PAUSE)
                        status.push(TaskStatus.ON_PAUSE);
                    requestUri = `${requestUri}/findByUserIdAndRoleAndTaskStatusIn/?userId=${userId}`;
                    requestUri = `${requestUri}&status=${status.join(",")}&role=${props.role}&page=${page}&size=${size}`;
                   }else{
                    requestUri = `${API_URIS.taskApiUri}/by-employee-and-status/${userId}/?status=${taskStatus}&page=${page}&size=${size}`;
                   }
            }else{
                requestUri = `${API_URIS.taskApiUri}/by-employee/${userId}/?page=${page}&size=${size}`;
            }
            // return a spring boot page
            axios.get(requestUri).then(res =>{
                    if(res.data){
                        setTotalItems(res.data.totalElements);
                        setTasksProcesses(res.data.content);
                    }
                 }).catch(e =>{
                     console.log(e);
                 }).finally(() => setLoading(false))
        }else{
            setLoading(false);
        }
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        getAllEntities();
    }, [props.todoUserId,taskStatus,props.account])

   const handleChangeRowPerpage = (e) =>{
      setRowPerPage(parseInt(e.target.value,10));
      setActivePage(0);
      getAllEntities(0, parseInt(e.target.value,10));
   }
   const handleChangePage = (event, newPage) => {
    setActivePage(newPage);
    getAllEntities(newPage);
  };
  
  const handleTaskStatusChange = (newStatus?: TaskStatus) =>{
        setTaskStatus(newStatus)
  }
  return (
      <React.Fragment>
          <Helmet><title>Cperf | Your-Tasks</title></Helmet>
          {loading && <div className="text-center mt-3 pt-3">loading...</div>}
          {!loading && <Box width={1} overflow="auto"> 
            <TaskList tasksProcesses={tasksProcesss} withProcessColumn
             taskStatus={taskStatus} onChangeTaskStatus={handleTaskStatusChange}
             title={props.title || translate("_global.label.yourTasks")}
             disableStatusChange={props.disableStatusChange}
             hideTitile={props.hideTitile} inTodoList={props.inTodoList}
            footer={
                <TablePagination 
                component="div"
                count={totalItems}
                page={activePage}
                onPageChange={handleChangePage}
                rowsPerPage={rowPerPage}
                onChangeRowsPerPage={handleChangeRowPerpage}
                labelRowsPerPage={translate("_global.label.rowsPerPage")}
                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,rowPerPage)}`}
                classes={{ 
                    root: classes.pagination,
                    input: classes.input,
                    selectIcon: classes.selectIcon,
              }}/>
            }
            style={{ width: '100%', marginTop: '5px', }}
            headerStyle={{  borderRadius:0, }}
            footerStyle={{  borderRadius:0, }}/>
          </Box>}
      </React.Fragment>
  )
}

const mapStateToProps = ({ authentication, appUtils }: IRootState) => ({
  account: authentication.account,
  todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserTask);

