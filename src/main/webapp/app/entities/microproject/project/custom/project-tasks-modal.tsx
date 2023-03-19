import { Backdrop, Box, makeStyles, Modal, Slide, TablePagination, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { translate } from 'react-jhipster';
import { IProject } from 'app/shared/model/microproject/project.model';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { ITaskProject } from 'app/shared/model/projection/task-project.model';
import ProjectTaskList from '../../project-task/custom/project-task-list';

const useStyles = makeStyles((theme) =>({
    modal:{
      display: 'flex',
      justifyContent: 'center',
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
}))

interface IProcessTasksModalProps{
    project: IProject,
    open?: boolean,
    readonly?: boolean,
    onClose?: Function,
    closeUriOnEdit?: string,
    onUpdate?: Function,
    onTaskDelete?: Function,
    onCreate?: Function,
    onProjectUpdate?: Function,
}

export const ProjectTasksModal = (props: IProcessTasksModalProps) =>{
   
    const {open, readonly } = props

    const [project, setProject] = useState(props.project);

    const [tasks, setTasks] = useState<IProjectTask[]>([]);

    const [loading, setLoading] = useState(false);

    const [activePage, setActivePage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)

    const [totalItems, setTotalItems] = useState(0);

    const classes = useStyles()

    const getTasks = (p?: number, rows?:number) =>{
        setTasks([])
        if(project){
            const page = (p || p === 0) ? p : activePage;
            const size = rows || itemsPerPage;
            setLoading(true);
            let apiUri = `${API_URIS.projectTaskApiUri}/?page=${page}&size=${size}`;
            apiUri = `${apiUri}&processId.equals=${project.id}&valid.equals=${true}`
            axios.get<IProjectTask[]>(apiUri)
            .then(res =>{
               if(res.data)
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
                setTasks([...res.data]);
            }).catch(e =>{
              /* eslint-disable no-console */
              console.log(e)
            }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        if(props.open){
            setProject(props.project);
            getTasks();
        }
    }, [project, props.open]);

    const handleClose = () =>{
        if(props.onClose)
          props.onClose()
    }
    const getTaskWithProcess = (): ITaskProject[] =>{
        const tasksProjects: ITaskProject[] = tasks.map(task => {
            const tp: ITaskProject = {task, project}
            return tp;
        })
        return tasksProjects;
    }

    const handleChangePage = (e, newPage) => {
        setActivePage(newPage);
        getTasks(newPage)
    }

    const handleChangeItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        getTasks(null, parseInt(e.target.value, 10))
    };

    const handleTaskUpdate = (updated?: IProjectTask) =>{
        if(updated){
            setTasks(tasks.map(t => t.id === updated.id ? updated : t))
            if(props.onUpdate)
                props.onUpdate(updated);
        }
    }

    const handleDelete = (deletedId) =>{
        if(deletedId){
            setTasks(tasks.filter(t => t.id !== deletedId))
            if(props.onTaskDelete){
                props.onTaskDelete(deletedId);
            }
        }
    }

    const handleCreate = (saved?: IProjectTask, isNew?: boolean) =>{
        if(saved){
            if(props.onCreate)
                props.onCreate(saved, isNew);
            if(isNew)
                setTasks([saved, ...tasks]);
            else
                setTasks(tasks.map(t => t.id === saved.id ? saved : t))
        }
    }

    const handleProjectUpdate = (p?: IProject) =>{
        if(p && props.onProjectUpdate)
            props.onProjectUpdate(p, false);
    }

    return(
        <React.Fragment>
            <Helmet><title>Cperf | Process | Tasks</title></Helmet>
            <Modal open={open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
            <Slide in={open} unmountOnExit>
                <Box width={1} display="flex" justifyContent="center" p={0} m={0}>
                    <ProjectTaskList tasksProjects={getTaskWithProcess()} project={project} laoding={loading}
                        closeUriOnEdit={props.closeUriOnEdit} style={{ width: '80%' }}
                        withprojectColumn readonly={readonly}
                        onUpdate={handleTaskUpdate} onClose={handleClose} onDelete={handleDelete}
                        onCreate={props.onCreate ? handleCreate : null}
                        onProjectUpdate={handleProjectUpdate}
                    footer={
                        <Box p={0} m={0} width={1} display="flex" justifyContent="space-between" alignItems="center" overflow="auto">
                            <TablePagination 
                            component="div"
                            count={totalItems}
                            page={activePage}
                            onPageChange={handleChangePage}
                            rowsPerPage={itemsPerPage}
                            onChangeRowsPerPage={handleChangeItemsPerPage}
                            rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                            labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                            labelRowsPerPage={translate("_global.label.rowsPerPage")}
                            classes={{ 
                                root: classes.pagination,
                                input: classes.paginationInput,
                                selectIcon: classes.paginationSelectIcon,
                        }}/> 
                        {process && <Typography className="mr-4">{`${translate("microgatewayApp.microprojectProject.detail.title")}: ${project.label}`}</Typography> }
                    </Box> 
                    }/>
                </Box>
            </Slide>
        </Modal>
     </React.Fragment>
    )
}