import { Box, Button, Checkbox, makeStyles, Radio, Typography } from "@material-ui/core";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";
import { ITaskStatusTraking } from "app/shared/model/microprocess/task-status-traking.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import React, { useState } from "react"
import MyCustomModal from "app/shared/component/my-custom-modal";
import { Check } from "@material-ui/icons";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    taskItemBox:{
        cursor: 'pointer',
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover':{
            border: `1px solid ${theme.palette.info.main}`,
        }
    },
    justificationCard:{
        width: '44%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
    }
}))

const TaskWidget = (props: {task: ITask, selected?: boolean, multiple?: boolean, onSelectChange: Function}) =>{
    const {task, selected, multiple} = props;

    const classes = useStyles();
    
    const handleSelectChange = () => props.onSelectChange(task, !selected);

    return (
        <React.Fragment>
            {task && <Box m={1} 
                 onClick={handleSelectChange}
                 boxShadow={5} 
                 borderRadius={15} p={2}
                 display="flex" justifyContent="center" 
                 overflow="auto" flexWrap="wrap"
                flexDirection="column" alignItems="center"
                className={classes.taskItemBox}>
                <Typography>{task.name}</Typography>
                <Typography variant="caption" className="mt-2 mb-2 bgdge badge-primary badge-pill">
                    {translate('microgatewayApp.TaskStatus.'+task.status.toString())}
                </Typography>
                {multiple ? <Checkbox color="primary" checked={selected} />
                         : <Radio color="primary" checked={selected} /> }
            </Box>}
        </React.Fragment>
    )
}

interface TaskWidgetChooserProps{
    open?:boolean,
    title?: string,
    tasks: ITask[],
    onChoiceValid?:Function,
    onClose:Function,
    multiple?: boolean,
}

export const TaskWidgetChooser = (props: TaskWidgetChooserProps) =>{
    const { open,tasks, title, multiple } = props;
    const [selectedTasks, setSelectedTasks] = useState<ITask[]>([]);
    const classes = useStyles();

    const handleSelect = (t?: ITask, selected?:boolean) =>{
        if(t){
            if(multiple){
                if(selected)
                    setSelectedTasks([...selectedTasks, t]);
                else
                    setSelectedTasks([...selectedTasks].filter(item => item.id !== t.id));
            }else{
                if(selected)
                    setSelectedTasks([t])
                else
                    setSelectedTasks([]);
            }
        }
    }

    const handleValidChoice = () =>{
        if(props.onChoiceValid)
            props.onChoiceValid(multiple ? selectedTasks : [...selectedTasks][0]);
    }

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                title={title}
                onClose={() => props.onClose()}
                footer={<Box width={1} textAlign="right">
                    <Button color="primary" endIcon={<Check />} className="text-capitalize"
                        onClick={handleValidChoice}>
                        {translate("_global.label.confirm")}
                    </Button> 
                </Box>}
            >
                <Box width={1} display="flex" justifyContent="center" alignItems="center"
                    flexWrap="wrap">
                    {[...tasks].map((t, index) =><TaskWidget 
                            key={index} task={t}
                            selected={[...selectedTasks].some(s => s.id === t.id)}
                            multiple={multiple}
                            onSelectChange={handleSelect} 
                        />
                    )}
                </Box>
            </MyCustomModal>
        </React.Fragment>
    )
}


export default TaskWidgetChooser;
