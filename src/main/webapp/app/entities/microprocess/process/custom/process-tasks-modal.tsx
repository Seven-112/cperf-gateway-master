import { Backdrop, Box, makeStyles, Modal, TablePagination, Typography } from '@material-ui/core';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { ITaskProcess } from 'app/shared/model/projection/task-process.model';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import TaskList from '../../task/custom/task-list';
import axios from 'axios';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { translate } from 'react-jhipster';

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
    process: IProcess,
    open?: boolean,
    onClose?: Function,
    closeUriOnEdit?: string,
    onUpdate?: Function,
    onTaskDelete?: Function,
}

export const ProcessTasksModal = (props: IProcessTasksModalProps) =>{
   
    const { process } = props

    const [tasks, setTasks] = useState<ITask[]>([]);

    const [loading, setLoading] = useState(false);

    const [activePage, setActivePage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)

    const [totalItems, setTotalItems] = useState(0);

    const classes = useStyles()

    const getTasks = () =>{
        if(process){
            setLoading(true);
            axios.get<ITask[]>(`${API_URIS.taskApiUri}/?page=${activePage}&size=${itemsPerPage}&processId.equals=${process.id}&valid.equals=${true}`).then(res =>{
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
        getTasks();
    }, [activePage, itemsPerPage]);

    const handleClose = () =>{
        if(props.onClose)
          props.onClose()
    }
    const getTaskWithProcess = (): ITaskProcess[] =>{
        const tasksProcesses: ITaskProcess[] = tasks.map(task => {
            const tp: ITaskProcess = {task, process}
            return tp;
        })
        return tasksProcesses;
    }

    const handleChangePage = (e, newPage) => setActivePage(newPage);

    const handleChangeItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setActivePage(0);
    };

    const handleTaskUpdate = (updated?: ITask) =>{
        if(props.onUpdate && updated)
            props.onUpdate(updated);
    }

    const handleDelete = (deletedId) =>{
        if(deletedId){
            setTasks(tasks.filter(t => t.id !== deletedId))
            if(props.onTaskDelete){
                props.onTaskDelete(deletedId);
            }
        }
    }

    return(
        <React.Fragment>
            <Helmet><title>Cperf | Process | Tasks</title></Helmet>
            <Modal open={props.open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick
            className={classes.modal}>
            <TaskList tasksProcesses={getTaskWithProcess()}
             process={process} laoding={loading} closeUriOnEdit={props.closeUriOnEdit} 
             style={{ width: '80%' }} withProcessColumn sortById showUsersInColumn
             onUpdate={handleTaskUpdate} onClose={handleClose} onDelete={handleDelete}
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
                {process && <Typography className="mr-4">{ 'Process : '+process.label }</Typography> }
              </Box> 
            }/>
        </Modal>
     </React.Fragment>
    )
}