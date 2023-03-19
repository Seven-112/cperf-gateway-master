import { Box, CircularProgress, colors, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { IProject } from "app/shared/model/microproject/project.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import  { FrappeGantt as FGantt, Task as FGanttTask, ViewMode } from 'frappe-gantt-react';
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getChronoTextWithSuffix } from "app/shared/util/helpers";
import clsx from "clsx";
import theme from "app/theme";
import { ReactFrappeGanttTaskUtil } from "app/shared/util/react-frappe-gantt-task-util";
import ProjectTaskDetailModal from "../../project-task/custom/project-task-detail.modal";
import { ProjectTaskStatus } from "app/shared/model/enumerations/project-task-status.model";
import { Moment } from "moment";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { TaskStatus } from "app/shared/model/enumerations/task-status.model";

const useStyles = makeStyles({
    ganttRoot:{
        "& > div" : {
            overflow: "hidden !important"
        },
        "& .gantt-container" : {
            // height: "67vh",
            border: "1px solid #a8a3a36a",
            padding:"0 2px"
        }
    },

    finishTask: {
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `${theme.palette.success.main} !important`,
        }
    },
    finishLaterTask: {
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `${theme.palette.secondary.main} !important`,
        }
    },
    unFinishLaterTask: {
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `${colors.orange[500]} !important`,
        }
    },
    unFinishTask: {
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `${theme.palette.primary.main} !important`,
        }
    },
    canceldTask: {
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `${colors.brown[500]} !important`,
        }
    },
    normalTask:{
        '& .bar':{
            // fill: `${theme.palette.success.main} !important`,
        },
        '& .bar-progress':{
            fill: `#b8c2cc !important`,
        }
    }
});

interface IProjectGanttProps extends StateProps{
    project: IProject,
    reload?: boolean,
    viewMode?: ViewMode,
    showProjectLabel?: boolean,
    className?: string,
}

export const ProjectGantt = (props: IProjectGanttProps) =>{
    const { project } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<FGanttTask[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>(props.viewMode || ViewMode.Week);
    const [open, setOpen] = useState(false);
    const [taskId, setTaskId] = useState(null);

    const classes = useStyles();

    const getGFTaskCustomClassName = (rfgUtil: ReactFrappeGanttTaskUtil) =>{
        let className = "";
        if(rfgUtil){
            const { task, chronoUtil, editable, isProject } = rfgUtil;
            const status = (chronoUtil && chronoUtil.status) ? chronoUtil.status.toString()
                             : task && task.status ? task.status.toString() : null;
            if(editable)
                className = `${className} editable`;
            if(isProject)
                className = `${className} is_project`;
            if([ProjectTaskStatus.CANCELED.toString(), TaskStatus.CANCELED.toString()].includes(status))
                return `${className} ${classes.canceldTask}`;
            if([ProjectTaskStatus.COMPLETED.toString(), TaskStatus.COMPLETED.toString()].includes(status)){
                if(chronoUtil && chronoUtil.execeed)
                    return `${className} ${classes.finishLaterTask}`;
                return `${className} ${classes.finishTask}`;
            }
            if([ProjectTaskStatus.VALID.toString(), TaskStatus.VALID.toString()].includes(status)){
                if(chronoUtil && chronoUtil.execeed)
                    return `${className} ${classes.unFinishLaterTask}`;
                return `${className} ${classes.unFinishTask}`;
            }
        }
        return `${className} ${classes.normalTask}`;
    }

    const getFGTaskFromEntity = (entity: ReactFrappeGanttTaskUtil) =>{
        if(entity){
            const { task, chronoUtil, isProject } = entity;
            const chronoText = (isProject && chronoUtil && chronoUtil.execeed) ? `[ ${getChronoTextWithSuffix(chronoUtil)} ]` : '';
            const fgTask = new FGanttTask();
            fgTask.id = `${entity.id ? entity.id : task ? task.id : entity.project ? entity.project.id : ''}`;
            fgTask.name = `${task ? task.name : entity.project ? entity.project.label : ''} ${chronoText}`;
            fgTask.start = `${entity.startDate}`;
            fgTask.end = `${entity.endDate}`;
            fgTask.progress = entity.progress || 0;
            fgTask.custom_class = `${getGFTaskCustomClassName(entity)}`;
            if(entity.depends && entity.depends.length !== 0)
                 fgTask.setDependencies(entity.depends.map(id => `${id}`))
            return fgTask;
        }
        return null;
    }

    const initalizeData = (entities: ReactFrappeGanttTaskUtil[]) =>{
        const fGData = [...entities]
            .filter(entity => entity.task || entity.project)
            .map(entity => getFGTaskFromEntity(entity))
        setData([...fGData]);
        setLoading(false);
    }
    
    const getData = () =>{
        if(props.project && props.project.id){
            setLoading(true)
            const apiUri = `${API_URIS.projectApiUri}/getGanntData/${props.project.id}`;
            axios.get<ReactFrappeGanttTaskUtil[]>(apiUri)
                .then(res =>{
                    if(res.data && res.data.length !== 0)
                        initalizeData(res.data);
                    else
                        setLoading(false);
                }).catch(e => {
                    console.log(e)
                    setLoading(false);
                })
        }
    }

    const translateGanttDatesMonths = () =>{
       const elements = document.querySelectorAll(".date .upper-text, .date .lower-text");
       for(let i=0; i< elements.length; i++){
           const el = elements[i];
           if(el.innerHTML !== null && el.innerHTML !== undefined){
               const translated = el.innerHTML
                    .replace(/January|Janvier/i, translate("_calendar.month.0"))
                    .replace(/February|Février/i, translate("_calendar.month.1"))
                    .replace(/March|Mars/i, translate("_calendar.month.2"))
                    .replace(/April|Avril/i, translate("_calendar.month.3"))
                    .replace(/May|Mai/i, translate("_calendar.month.4"))
                    .replace(/June|Juin/i, translate("_calendar.month.5"))
                    .replace(/July|Juillet/i, translate("_calendar.month.6"))
                    .replace(/August|Août/i, translate("_calendar.month.7"))
                    .replace(/September|Septembre/i, translate("_calendar.month.8"))
                    .replace(/October|Octobre/i, translate("_calendar.month.9"))
                    .replace(/November|Novembre/i, translate("_calendar.month.10"))
                    .replace(/December|Décembre/i, translate("_calendar.month.11"));
               el.innerHTML = translated;
           }
       }
    }

    useEffect(() =>{
        translateGanttDatesMonths();
    })

    useEffect(() =>{
        getData();
    }, [props.project, props.reload])


    useEffect(() =>{
        setViewMode(props.viewMode || ViewMode.Week);
    }, [props.viewMode])

    const handleDatesChange = (t: FGanttTask, start: Moment, end: Moment) =>{
        setData([...data]);
        /* if(t && t.id && start && end && t.custom_class && t.custom_class.includes("editable")){
            setLoading(true)
            let apiUri = `${API_URIS.projectTaskApiUri}/updateSheduledStartDate/${t.id}/`;
            apiUri = `${apiUri}?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
            axios.get<IProjectTask>(apiUri).then(res =>{
                if(res.data){
                    axios.get<ReactFrappeGanttTaskUtil>(`${API_URIS.projectTaskApiUri}/getGanntData/${res.data.id}`)
                        .then(resp =>{
                            if(resp.data){
                                setData([...data].map(d => d.id === resp.data.id.toString() ? getFGTaskFromEntity(resp.data) : d));
                            }
                        }).catch(error => console.log(error))
                        .finally(() => setLoading(false))
                }else{
                    setLoading(false)
                }
            }).catch(e => {
                console.log(e);
                setLoading(false)
            }) 
        } */
    }

    const handleOpen = (fgt: FGanttTask) =>{
        if(fgt && fgt.id && (!fgt.custom_class || !fgt.custom_class.includes("is_project"))){
            setTaskId(parseInt(fgt.id, 10))
            setOpen(true);
        }
    }

    const onProjectTaskUpdate = (entity?: IProjectTask) =>{
        if(entity && entity.id){
            setLoading(true);
            axios.get<ReactFrappeGanttTaskUtil>(`${API_URIS.projectTaskApiUri}/getGanntData/${entity.id}`)
                .then(resp =>{
                    if(resp.data){
                        setData([...data].map(d => d.id === resp.data.id.toString() ? getFGTaskFromEntity(resp.data) : d));
                    }
                }).catch(error => console.log(error))
                .finally(() => setLoading(false))
        }
    }
    
    return (
        <React.Fragment>
            {taskId && <ProjectTaskDetailModal open={open}
             taskId={taskId} 
             onUpdate={onProjectTaskUpdate}
             onClose={() => setOpen(false)} /> }
            {project && props.showProjectLabel && 
                <Box width={1} display="flex" justifyContent={"center"} alignItems="center" flexWrap={"wrap"}>
                    <Typography>{project.label}</Typography>
                </Box>
            }
            {(loading && [...data].length !== 0) && <Box width={1}><LinearProgress /></Box>}
            {([...data].length === 0) ? (
                <Box width={1} height={1} display="flex"
                    justifyContent="center" alignItems={"center"} flexWrap="wrap">
                    {loading ? (
                        <>
                            <CircularProgress style={{ width:50, height:50 }} />
                            <Typography className="ml-2">Loading...</Typography>
                        </>
                    ) : (
                        <Typography className="ml-2">{translate("microgatewayApp.microprocessTask.home.notFound")}</Typography>
                    ) }
                </Box>
            ) : (
                <Box width={1} height={1} 
                    overflow="hidden" p={0}
                    className={clsx(classes.ganttRoot, { [props.className] : props.className })}>
                    <FGantt
                        tasks={data}
                        viewMode={viewMode}
                        onClick={handleOpen}
                        onDateChange={handleDatesChange}
                        onProgressChange={(task, progress) => console.log(task, progress)}
                        // onTasksChange={tasks => console.log(tasks)}
                        /* customPopupHtml={custom_popup_html} */
                    />
                    {/* <Box width={1} border={1} borderColor="red"></Box> */}
                </Box>
            )}
        </React.Fragment>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    langKey: locale.currentLocale
});


type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ProjectGantt);