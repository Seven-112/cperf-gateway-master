import { Backdrop, Button, Card, CardContent, CardHeader, CircularProgress, Fab, Grid, IconButton, makeStyles, Modal, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { translate, Translate } from "react-jhipster";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { createEntity } from 'app/entities/microproject/project-calendar/project-calendar.reducer';
import { IProjectCalendar } from "app/shared/model/microproject/project-calendar.model";
import { IProject } from "app/shared/model/microproject/project.model";
import { TimePicker } from "@material-ui/pickers";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
    },
    card:{
        width: '30%',
        [theme.breakpoints.down('sm')]:{
            width: '96%',
        }
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: '1px',
        paddingBottom: '1px',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%',
    },
}))

interface ProjectCalendarCreateProps extends StateProps, DispatchProps{
    dayNumber: number,
    project: IProject,
    open: boolean,
    onCreated: Function,
    onClose: Function,
}
const ProjectCalendarCreate = (props: ProjectCalendarCreateProps) =>{
    const {dayNumber, open, project} = props;
    
    const defaultEntity : IProjectCalendar = {
        dayNumber: props.dayNumber || props.dayNumber === 0 ? props.dayNumber : new Date().getDay(),
        startTime: new Date().toISOString(),
        endTime: new Date().toString(),
}

    const [entity, setEntity] = useState<IProjectCalendar>({...defaultEntity})

    const [forwareSaved, setForwareSaved] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setEntity({...defaultEntity});
    }, [props.dayNumber])

    useEffect(() =>{
        setEntity({dayNumber});
        if(forwareSaved){
            props.onCreated(props.savedEntity);
            setForwareSaved(false);
        }
    }, [props.updateSuccess])

    const handleClose = () =>{
        props.onClose();
    }

    const handleChangeStartTime = (newValue: Date | null) => {
        setEntity({...entity, startTime: newValue ? newValue.toISOString() : new Date().toISOString() });
    };

    const handleChangeEndTime = (newValue: Date | null) => {
        setEntity({...entity, endTime: newValue ? newValue.toISOString() : new Date().toISOString() });
    };
    
    const onSave = (e) =>{
        e.preventDefault();
        const entityToSave: IProjectCalendar={
            ...entity,
            projectId: project ? project.id : null,
        }
        if((entityToSave.dayNumber || entityToSave.dayNumber === 0) && entityToSave.endTime && entityToSave.startTime){
            props.createEntity(entityToSave);
            setForwareSaved(true);
        }
    }
    
    return <React.Fragment>
        <Modal
            aria-labelledby="edit-department-modal-title"
            aria-describedby="edit-department-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}>
            <Card className={classes.card}>
                <CardHeader
                  title={<Translate contentKey={"microgatewayApp.workCalender.isoDay."+dayNumber}>Day Name</Translate>}
                  action={
                      <IconButton onClick={handleClose} color="inherit">
                         <CloseIcon />
                      </IconButton>
                  }
                  titleTypographyProps={{
                      variant:"h4"
                  }}
                  classes={{ root: classes.cardHeader }}
                 />
                 <CardContent>
                    <form onSubmit={onSave}>
                        <Grid container spacing={2}>
                            {props.updating && <Grid item xs={12} className="text-center">
                                <CircularProgress color="inherit" />
                            </Grid>}
                            <Grid item xs={12} md={6}>
                                <TimePicker
                                    id="time"
                                    label={translate("microgatewayApp.workCalender.startTime")}
                                    className={classes.textField}
                                    value={new Date(entity.startTime)}
                                    InputLabelProps={{ shrink: true, }}
                                    onChange={handleChangeStartTime}                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TimePicker
                                    id="time"
                                    label={translate('microgatewayApp.workCalender.endTime')}
                                    name="endTime"
                                    value={new Date(entity.endTime)}
                                    className={classes.textField}
                                    InputLabelProps={{ shrink: true, }}
                                    onChange={handleChangeEndTime}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <SaveButton type="submit"
                                    disabled={!entity.startTime || !entity.endTime } 
                                    style={{ width: '100%' }}
                                    className="text-capitalize" />
                            </Grid>
                        </Grid>
                    </form>
                 </CardContent>
            </Card>
        </Modal>
    </React.Fragment>
}

const mapStateToProps = (storeState: IRootState) => ({
    updating: storeState.projectCalendar.updating,
    updateSuccess: storeState.projectCalendar.updateSuccess,
    savedEntity: storeState.projectCalendar.entity,
  });

const mapDispatchToProps = {
  createEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCalendarCreate);