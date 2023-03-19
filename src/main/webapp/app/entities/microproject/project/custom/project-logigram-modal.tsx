import { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Avatar, Backdrop, Card, CardContent, CardHeader, IconButton, makeStyles, Modal, Slide } from "@material-ui/core";
import { Helmet } from 'react-helmet';
import React from "react";
import Logigram from "./project-logigram";
import { Close } from "@material-ui/icons";
import { Translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import { IProject } from "app/shared/model/microproject/project.model";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";

const useStyles = makeStyles((theme) =>({
    modal:{
      display: 'flex',
      justifyContent: 'center',
      background: 'transparent',
      boxShadow: 'none',
    },
    card:{
        width: '85%',
        height: '95vh',
        marginTop: theme.spacing(2),
        overflow: 'auto',
    },
    cardHeader:{
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: 'white',
        color: theme.palette.primary.main,
        borderRadius: '15px 15px 0 0',
        borderBottom: `3px solid ${theme.palette.primary.dark}`,
    },
    CardContent:{
        height: '90%',
        overflow: 'auto',
        background: theme.palette.background.paper,
    }
}))

interface ILogigramModalProps{
    project: IProject,
    open: boolean,
    onClose: Function,
    title?: any,
    readonly?: boolean,
}

export const ProjectLogigramModal = (props: ILogigramModalProps) =>{
    const {project, open} = props;
    const [tasks, setTasks] = useState<IProjectTask[]>([]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();
    
    const getTasks = () =>{
        if(props.project){
            setLoading(true)
            axios.get<IProjectTask[]>(`${API_URIS.projectTaskApiUri}/?processId.equals=${props.project.id}`).then(res =>{
                if(res.data){
                    setTasks([...res.data]);
                }
                setLoading(false);
            }).catch(e => {
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        if(props.open)
            getTasks();
    }, [props.project, props.open])

    const handleClose = () => props.onClose();

    return(
    <React.Fragment>
        <Helmet><title>Cperf | Process | Logigram</title></Helmet>
        <Modal open={open} onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
        }}
        disableBackdropClick
        className={classes.modal}>
        <Slide in={open}>
            <Card className={classes.card}>
                <CardHeader classes={{ root: classes.cardHeader }}
                    avatar={
                        <Avatar>
                            <FontAwesomeIcon icon={faSitemap} />
                        </Avatar>
                    }
                    title={props.title ? props.title : <Translate contentKey="_global.logigram.title">Logigram</Translate>}
                    action={<IconButton color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>} 
                    titleTypographyProps={{ variant: 'h4' }}
                />
                <CardContent className={classes.CardContent}>
                    {loading && 'loading...'}
                    {!loading &&
                        <Logigram project={project} tasks={tasks} withoutBackButton={true} readonly={props.readonly}/>
                    }
                </CardContent>
            </Card>
        </Slide>
        </Modal>
    </React.Fragment>
    );
}