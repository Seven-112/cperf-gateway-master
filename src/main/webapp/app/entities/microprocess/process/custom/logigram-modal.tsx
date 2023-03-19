import { IProcess } from "app/shared/model/microprocess/process.model";
import { ITask } from "app/shared/model/microprocess/task.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { makeStyles } from "@material-ui/core";
import { Helmet } from 'react-helmet';
import React from "react";
import Logigram from "./logigram";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles((theme) =>({
    card:{
        width: '90%',
        [theme.breakpoints.down('sm')]:{
            width: '90%',
        }
    },
}))

interface ILogigramModalProps{
    process: IProcess,
    open: boolean,
    onClose: Function,
    title?: any,
}

export const LogigramModal = (props: ILogigramModalProps) =>{
    const {process, open} = props;
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();
    
    const getTasks = () =>{
        if(process){
            setLoading(true)
            axios.get<ITask[]>(`${API_URIS.taskApiUri}/getByProcessId/${process.id}`).then(res =>{
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
        getTasks();
    }, [])

    const handleClose = () => props.onClose();

    return(
    <React.Fragment>
        <Helmet><title>Cperf | Process | Logigram</title></Helmet>
        <MyCustomModal
            open={open} onClose={handleClose}
            avatarIcon={<FontAwesomeIcon icon={faSitemap} />}
            title={props.title || translate("_global.logigram.title")}
            rootCardClassName={classes.card}
        >
            {loading && 'loading...'}
            {!loading &&
                <Logigram process={process} tasks={tasks} withoutBackButton={true}/>
            }
        </MyCustomModal>
    </React.Fragment>
    );
}