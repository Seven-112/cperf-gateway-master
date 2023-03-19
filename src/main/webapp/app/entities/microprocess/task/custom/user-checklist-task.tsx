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

interface IUserChecklistTaskProps extends StateProps, DispatchProps{
    status?:TaskStatus;
    inTodoList?:boolean,
}

export const UserChecklistTask = (props: IUserChecklistTaskProps) =>{
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
        const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;
        if(userId){
            let requestUri = `${API_URIS.taskApiUri}/getCheckableTasksByUserIdAndStatus/${userId}/?page=${page}&size=${size}`;
            if(taskStatus)
                requestUri = `${requestUri}&status=${taskStatus}`;
            // return a spring boot page
            axios.get(requestUri).then(res =>{
                    if(res.data){
                        setTotalItems(res.data.totalElements);
                        setTasksProcesses(res.data.content);
                    }
                 }).catch(e =>{
                     /* eslint-disable no-console */
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
    }, [props.todoUserId, taskStatus, props.account])


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
        console.log(newStatus);
        setTaskStatus(newStatus)
  }
  return (
      <React.Fragment>
          <Helmet><title>Cperf | Your-Tasks</title></Helmet>
          {loading && <div className="text-center mt-3 pt-3">loading...</div>}
          {!loading && <Box width={1} overflow="auto"> 
            <TaskList tasksProcesses={tasksProcesss} withProcessColumn
             taskStatus={taskStatus} onChangeTaskStatus={handleTaskStatusChange}
             title={translate("_global.label.checkList")}
             checkingOnly inTodoList={props.inTodoList}
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

const mapStateToProps = ({ appUtils, authentication }: IRootState) => ({
  account: authentication.account,
  todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserChecklistTask);

