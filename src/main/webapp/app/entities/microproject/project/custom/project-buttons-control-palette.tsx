import { Box, BoxProps, ButtonGroup, ButtonGroupProps, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Add, Comment, Delete, Edit, List, Visibility } from "@material-ui/icons";
import { IProject } from "app/shared/model/microproject/project.model";
import { IRootState } from "app/shared/reducers";
import { VHORIENTATION } from "app/shared/util/constantes";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import ProjectUpdate from "./project-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { ProjectTasksModal } from "./project-tasks-modal";
import { ProjectLogigramModal } from "./project-logigram-modal";
import ProjectCalendarModal from "../../project-calendar/custom/project-calendar-modal";
import  { faCalendarDay, faSitemap, faStream } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectComment from "../../project-comment/custom/project-comment";
import ProjectGanttModal from "./project-gantt-modal";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";

const useStyles = makeStyles(theme =>({
    root:{

    },
    btn:{

    }
}))

interface ProjectButtonsControlPaletteProps extends StateProps, DispatchProps{
    project: IProject,
    orientation?: 'horizontal' | 'vertical',
    buttonGroupProps?: ButtonGroupProps,
    readonly?: boolean,
    rootBoxProps?: BoxProps,
    btnClassName?: string,
    onUpdate?: Function,
    onSaveChildren?: Function,
    onDelete?: Function;
}

export const ProjectButtonsControlPalette = (props: ProjectButtonsControlPaletteProps) =>{
    const {orientation, account, readonly, rootBoxProps, buttonGroupProps, btnClassName } = props;
    const [project, setProject] = useState(props.project);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete,setOpenToDelete] = useState(false);
    const [openTasks, setOpenTasks] = useState(false);
    const [openLogigram, setOpenLogigram] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openGantt, setOpenGantt] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState(props.project);
    const [openDesc, setOpenDesc] = useState(false);

    const [childrenSize, setChildrenSize] = useState(0);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const countChildren  = () =>{
        if(props.project){
            // loading childreen
            axios.get<IProject[]>(`${API_URIS.projectApiUri}/?valid.equals=${true}&parentId.equals=${props.project.id}&page=${0}&size=${1}`)
                .then(res =>{
                    if(res.headers)
                        setChildrenSize(parseInt(res.headers['x-total-count'], 10))
                    else
                        setChildrenSize(0)
                }).catch(e => console.log(e))
                .finally(() =>{
                    setLoading(false);
                })
        }
    }

    useEffect(() =>{
        setProject(props.project)
        setProjectToUpdate(props.project);
        countChildren();
    }, [props.project])
    

    const canUpdate = account && !readonly && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.UPDATE]}, account.authorities) && !readonly;
    const canDelete = account && !readonly &&  hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.DELETE]}, account.authorities) && childrenSize===0 && !readonly;
    const canCreate = account && !readonly && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.CREATE]}, account.authorities) && !readonly;

    const onSave = (saved?: IProject) =>{
        if(saved){
            setProjectToUpdate(saved)
            if(saved.id === project.id){
                setProject(saved);
                if(props.onUpdate)
                    props.onUpdate(saved, false); // false for is not new
            }else{
                setChildrenSize(childrenSize + 1);
                if(props.onSaveChildren)
                    props.onSaveChildren(saved, true) // true for is new
            }
            setOpenToUpdate(false);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setOpenToDelete(false);
            if(props.onDelete)
                props.onDelete(deletedId);
            setProject(null);
        }
    }

    const handleUpdate = () =>{
        setProjectToUpdate(project);
        setOpenToUpdate(true);
    }

    const handleClickAddChild = () =>{
        if(project && project.id){
            setProjectToUpdate({ 
                categoryId: project.categoryId,
                parentId: project.id,
                priorityLevel: project.priorityLevel
            })
            setOpenToUpdate(true);
        }
    }

    return (
        <React.Fragment>
            {project && <> 
                 <MyCustomPureHtmlRenderModal
                    open={openDesc}
                    body={project.description} 
                    title={translate("microgatewayApp.microprojectProject.description")}
                    onClose={() => setOpenDesc(false)}
                 />
                {!readonly && <>
                    <ProjectUpdate
                        open={openToUpdate}
                        project={projectToUpdate}
                        onClose={() => setOpenToUpdate(false)}
                        onSave={onSave}
                    />
                    <EntityDeleterModal 
                        open={openToDelete}  
                        entityId={project.id}
                        urlWithoutEntityId={API_URIS.projectApiUri}
                        onClose={() => setOpenToDelete(false)}
                        onDelete={onDelete}
                        question={translate("microgatewayApp.microprojectProject.delete.question", {id: project.label})}
                    />
                </>}
                <ProjectTasksModal 
                    project={project}
                    open={openTasks}
                    readonly={readonly}
                    onClose={() =>{setOpenTasks(false)}}
                    onCreate={() =>{}} // force adding button display
                />
                <ProjectLogigramModal 
                    open={openLogigram}
                    project={project}
                    onClose={() => setOpenLogigram(false)}
                />
                <ProjectCalendarModal
                    project={project}
                    open={openCalendar}
                    onClose={() => setOpenCalendar(false)}
                />
                <ProjectComment
                    open={openComments}
                    project={project}
                    onClose={() => setOpenComments(false)}
                 />
                 <ProjectGanttModal 
                    project={project}
                    open={openGantt}
                    onClose={() => setOpenGantt(false)}
                 />
            </>}
            <Box className={classes.root} {...rootBoxProps}>
                <ButtonGroup orientation={orientation} {...buttonGroupProps}>
                    <Tooltip 
                        title={translate("microgatewayApp.microprojectProject.description")}
                        onClick={() => setOpenDesc(true)}>
                        <IconButton className={classes.btn}>
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title={translate("microgatewayApp.microprojectProjectComment.home.title")}
                        onClick={() => setOpenComments(true)}>
                        <IconButton className={classes.btn}>
                            <Comment />
                        </IconButton>
                    </Tooltip>
                    {canUpdate && <>
                        <Tooltip title={translate("entity.action.edit")} onClick={handleUpdate}>
                            <IconButton className={btnClassName || classes.btn} ><Edit /></IconButton>
                        </Tooltip>
                        </>
                    }
                    {canCreate &&
                        <Tooltip title={translate("_global.label.add")} onClick={handleClickAddChild}>
                            <IconButton className={classes.btn}><Add /></IconButton>
                        </Tooltip>   
                    }
                    <Tooltip onClick={() => setOpenLogigram(true)}
                        title={translate("_global.logigram.title")}>
                        <IconButton className={classes.btn}>
                            <FontAwesomeIcon icon={faSitemap} style={{ fontSize:15, }}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip onClick={() => setOpenTasks(true)}
                        title={translate("microgatewayApp.microprojectProjectTask.home.title")}>
                        <IconButton className={classes.btn}><List /></IconButton>
                    </Tooltip>
                    {/* <Tooltip onClick={() => setOpenCalendar(true)}
                        title={translate("microgatewayApp.workCalender.detail.title")}>
                        <IconButton className={classes.btn}>
                            <FontAwesomeIcon icon={faCalendarDay} style={{ fontSize:16, }}/>
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip 
                        placement="left"
                        title={'D. Gantt'}
                        classes={{
                            tooltip: "bg-primary"
                        }}
                        onClick={() => setOpenGantt(true)}>
                        <IconButton className={classes.btn}>
                            <FontAwesomeIcon icon={faStream} style={{ fontSize:16, }}/>
                        </IconButton>
                    </Tooltip>
                    {canDelete && 
                        <Tooltip title={translate("entity.action.delete")} onClick={() =>setOpenToDelete(true)}>
                            <IconButton color="secondary"><Delete /></IconButton>
                        </Tooltip>  
                    }
                </ButtonGroup>
            </Box>
        </React.Fragment>
    )
}

ProjectButtonsControlPalette.defaultProps={
    orientation: VHORIENTATION.horizontal,
}

const mapStateToProps = ({ authentication }: IRootState) =>({
    account : authentication.account,
});

const mapDispatchToProps = {}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectButtonsControlPalette);
