import { Box, Button, ButtonGroup, makeStyles, Typography } from "@material-ui/core";
import { IProject } from "app/shared/model/microproject/project.model";
import React, { useEffect, useState } from "react";
import MyCustomModal from "app/shared/component/my-custom-modal";
import  { ViewMode } from 'frappe-gantt-react';
import ProjectGantt from "./project-gantt";
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    card:{
        background: 'transparent',
        width: '60%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardContent:{
        height: '70vh'
    },
    ganttRoot:{
        "& .gantt-container" : {
            height: "67vh",
        }
    }
}))

interface IProjectGanttModalProps{
    project: IProject,
    open?: boolean,
    onClose: Function,
}

export const ProjectGanttModal = (props: IProjectGanttModalProps) =>{
    const { project, open } = props;
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week);
    const [relaod, setRelaod] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setRelaod(!relaod);
    }, [props.open])
    
    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={'D.Gantt'}
                rootCardClassName={classes.card}
                customCardContentClassName={classes.cardContent}
                customActionButtons={<Box display="flex" justifyContent="flex-end" 
                alignItems="center" flexWrap="wrap">
                    <Typography variant="h4"  className="mr-2">Mode:</Typography>
                    <ButtonGroup variant="contained" size="small">
                        <Button
                             style={{ textTransform: 'none'}}
                             color={viewMode === ViewMode.HalfDay ? 'primary' : 'default'}
                             onClick={() => setViewMode(ViewMode.HalfDay)}>
                                 {translate("_global.label.halfDay")}
                             </Button>
                        <Button
                            style={{ textTransform: 'none'}} 
                            color={viewMode === ViewMode.Day ? 'primary' : 'default'}
                            onClick={() => setViewMode(ViewMode.Day)}>
                                {translate("_global.label.day")}
                            </Button>
                        <Button
                          style={{ textTransform: 'none'}}
                          color={viewMode === ViewMode.Week ? 'primary' : 'default'}
                          onClick={() => setViewMode(ViewMode.Week)}>
                            {translate("_global.label.week")}
                          </Button>
                        <Button
                            style={{ textTransform: 'none'}}
                            color={viewMode === ViewMode.Month ? 'primary' : 'default'}
                            onClick={() => setViewMode(ViewMode.Month)}>
                                {translate("_global.label.month")}
                            </Button>
                    </ButtonGroup>
                </Box>}
                footer={
                    project ?
                    <Box width={1} display="flex" 
                         justifyContent={"center"}
                         alignItems="center" flexWrap={"wrap"}
                         textAlign="center"
                         maxHeight={40} overflow="auto" m={0} pl={2} pr={2}>
                         <Typography color="primary" variant="caption">{project.label}</Typography>
                    </Box>
                    : <></>
                }
            >
                <ProjectGantt project={project} viewMode={viewMode}
                     reload={relaod} className={classes.ganttRoot} />
            </MyCustomModal>
        </React.Fragment>
    )
}

export default ProjectGanttModal;