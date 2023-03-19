import { Avatar, Backdrop, Box, Card, CardContent, CardHeader, colors, IconButton, makeStyles, Modal, Typography } from "@material-ui/core";
import { Receipt } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { IControl } from "app/shared/model/microrisque/control.model";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import RiskUpdate from "app/entities/microrisque/risk/custom/risk-update";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
        background: 'transparent',
        marginTop: theme.spacing(7),
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        paddingBottom:2,
        paddingTop:2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        borderRadius: '7px 7px 0 0',
    },
    cardAvatar:{
        background: theme.palette.primary.light,
        color: theme.palette.background.paper,
    },
    cardcontent:{
        minHeight: '10%',
        maxHeight: '80%',
        background: theme.palette.background.paper,
    },
    cardactions:{
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '0 0 7px 7px',
        padding: 2,
        textAlign: 'center',
        background: theme.palette.primary.main,
        color: theme.palette.background.paper,
    },
    searchBox:{
        width: '80%',
        border: `1px solid ${colors.grey[300]}`,
        borderTop: 'none',
        marginLeft: theme.spacing(5),
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]:{
            width: '90%',
        },
        '&:hover':{
            border: `1px solid ${colors.grey[300]}`,
        }
    },
    listItem:{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '15px',
        marginBottom:theme.spacing(1),
        boxShadow: '0 0 5px grey',
    },
    pagination:{
     padding:0,
     color: theme.palette.background.paper,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.background.paper,
       display: 'none',
   },
}))
interface TaskRiskEditorModalProps{
    task: IProjectTask,
    open?:boolean,
    onClose: Function,
}

export const ProjectTaskRiskEditorModal = (props: TaskRiskEditorModalProps) =>{
    const {open} = props;
    const [risk, setRisk] = useState<IRisk>({});
    const [task, setTask] = useState(props.task);
    

    const [loading, setLoading] = useState(false);
    const [enableChooseRiskMode, setEnableChooseRiskMode] = useState(false);
    const [controlToUpdate, setControlToUpdate] = useState<IControl>({});
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [enableEdit, setEnableEdit] = useState(true);

    const classes = useStyles();

    const getRisk = () =>{
        if(task && task.riskId){
            setLoading(true);
            axios.get<IRisk>(`${API_URIS.riskApiUri}/${task.riskId}`)
                .then(res => {
                    if(res.data)
                        setEnableEdit(false)
                    else
                        setEnableEdit(true)
                    setRisk(res.data)
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        setTask(props.task);
        getRisk();
    }, [props.task])

    const handleClose = () => props.onClose(task);

    const handleSave = (saved?: IRisk, isNew?:boolean) =>{
        if(saved){
            if(isNew){
                setLoading(false);
                const entity:IProjectTask ={
                    ...task,
                    riskId: saved.id
                }
                axios.put<IProjectTask>(`${API_URIS.taskApiUri}`, cleanEntity(entity))
                    .then(res =>{
                        if(res.data)
                            setTask(res.data)
                    }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
            }
            setRisk(saved);
        }
    }

    return(
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout:200
                }}
                onClose={handleClose}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader
                        title={
                            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                <Avatar className={classes.cardAvatar}> <Receipt /></Avatar>
                                <Typography variant="h4" className="mr-2 ml-2">{translate('microgatewayApp.microrisqueRisk.detail.title')}</Typography>
                                <Box flexGrow={1} m={0} p={0} textAlign="center">
                                    <Typography variant="caption">{translate("microgatewayApp.microprocessTask.detail.title")}</Typography>
                                    &nbsp;:&nbsp;<Typography variant="caption">{task.name}</Typography>
                                </Box>
                            </Box>
                        }
                        action={
                            <IconButton color="inherit" onClick={handleClose}>
                                <Close />
                            </IconButton>
                        }
                        className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {!enableChooseRiskMode && (
                                <RiskUpdate enableEdit={enableEdit} risk={risk} onSave={handleSave}/>
                            )}
                        </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default ProjectTaskRiskEditorModal;