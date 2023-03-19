import { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React from "react";
import { Helmet } from 'react-helmet';
import { Box, Button, makeStyles, TablePagination, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { IUserExtra } from "app/shared/model/user-extra.model";
import UserExtraFinder from "app/entities/user-extra/custom/user-extra-finder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import ProjectTaskList from "./project-task-list";
import { ITaskProject } from "app/shared/model/projection/task-project.model";

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

export const ProjectEmployeeTask = (props) =>{
    const [tasksProjects, setTasksProcesses] = useState<ITaskProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);

    const [rowPerPage, setRowPerPage] = useState(ITEMS_PER_PAGE);

    const [user, setUser] = useState<IUserExtra>(null);

    const [taskStatus, setTaskStatus] = useState<ProjectTaskStatus>(ProjectTaskStatus.STARTED);

    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const getAllEntities = (p?:number, rows?:number) =>{
        setLoading(true);
        const page = (p || p === 0) ? p : activePage;
        const size = rows || rowPerPage;
        if(user){
            const requestUri = !taskStatus ? `${API_URIS.taskApiUri}/by-employee/${user.id}/?page=${page}&size=${size}`:
                         `${API_URIS.taskApiUri}/by-employee-and-status/${user.id}/?status=${taskStatus}&page=${page}&size=${size}`;
            // return a spring boot page
            axios.get(requestUri)
                 .then(res =>{
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
        getAllEntities();
    }, [user,taskStatus])

   const handleChangeRowPerpage = (e) =>{
      setRowPerPage(parseInt(e.target.value,10));
      setActivePage(0);
      getAllEntities(0, parseInt(e.target.value,10));
   }

   const handleChangePage = (event, newPage) => {
    setActivePage(newPage);
    getAllEntities(newPage);
  };
  
  const handleTaskStatusChange = (newStatus?: ProjectTaskStatus) =>{
        setTaskStatus(newStatus)
  }

  const handleUserFinded = (fined?: IUserExtra) => setUser(fined);

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Emloyees-Tasks</title></Helmet>
            {loading || props.empLoading && <div className="text-center mt-3 pt-3">loading...</div>}
            <UserExtraFinder open={open} onFinded={handleUserFinded} onClose={() => setOpen(false)}/>
            <Box display="flex" width={1} justifyContent="center" alignItems="center" overflow="aurto" flexWrap="wrap">
                    <Button variant="text" color="primary" className="text-capitalize" onClick={() => setOpen(true)}>
                    <Typography className="mr-3">{translate('microgatewayApp.employee.home.title')}</Typography>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
            </Box>
            <Box width={1} overflow="auto" boxShadow={"1px 1px 10px"}>
                <ProjectTaskList tasksProjects={tasksProjects} withprojectColumn
                taskStatus={taskStatus} onChangeTaskStatus={handleTaskStatusChange}
                title={`${getUserExtraFullName(user)}`}
                footer={
                    <Box p={0} m={0} width={1} display="flex" justifyContent="space-between" alignItems="center" overflow="auto">
                        <TablePagination 
                        component="div"
                        count={totalItems}
                        page={activePage}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowPerPage}
                        onChangeRowsPerPage={handleChangeRowPerpage}
                        rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                        labelRowsPerPage={translate("_global.label.rowsPerPage")}
                        labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,rowPerPage)}`}
                        classes={{ 
                            root: classes.pagination,
                            input: classes.input,
                            selectIcon: classes.selectIcon,
                    }}/>
                </Box>
                }
                style={{ width: '100%', marginTop: '5px', }}
                headerStyle={{  borderRadius:0, }}
                footerStyle={{  borderRadius:0, }}/>
            </Box>
      </React.Fragment>
  )
}

export default ProjectEmployeeTask;

