import { Backdrop, Box, makeStyles, Modal, Slide } from "@material-ui/core";
import { IProject } from "app/shared/model/microproject/project.model";
import React from "react";
import ProjectCalendar from "./project-calendar";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    box:{
        width: '70%',
        borderRadius: '15px',
        overflow: 'auto',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
}))

interface IProjectCalendarModalProps{
    project: IProject,
    open: boolean,
    onClose: Function,
}

export const ProjectCalendarModal = (props: IProjectCalendarModalProps) =>{
    const { project, open } = props;

    const classes = useStyles();

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Slide in={open}>
                    <Box p={0} m={0} display="flex" justifyContent="center" className={classes.box}>
                        {project && <ProjectCalendar
                            project={project}
                            onClose={handleClose}
                         />}
                    </Box>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default ProjectCalendarModal;