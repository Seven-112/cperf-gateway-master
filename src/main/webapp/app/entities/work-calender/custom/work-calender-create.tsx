import { Backdrop, Button, Card, CardContent, CardHeader, CircularProgress, Fab, Grid, IconButton, makeStyles, Modal, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { translate, Translate } from "react-jhipster";
import CloseIcon from '@material-ui/icons/Close';
import { IWorkCalender } from "app/shared/model/work-calender.model";
import SaveIcon from '@material-ui/icons/Save';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { createEntity } from 'app/entities/work-calender/work-calender.reducer';
import { TimePicker } from "@material-ui/pickers";

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

interface WorkCalenderCreateProps extends StateProps, DispatchProps{
    dayNumber: number,
    open: boolean,
    onCreated: Function,
    onClose: Function,
}
const WorkCalenderCreate = (props: WorkCalenderCreateProps) =>{
    const { open } = props

    const defaultEntity : IWorkCalender = {
            dayNumber: props.dayNumber || props.dayNumber === 0 ? props.dayNumber : new Date().getDay(),
            startTime: new Date().toISOString(),
            endTime: new Date().toString(),
    }

    const [entity, setEntity] = useState<IWorkCalender>({...defaultEntity})

    const [forwareSaved, setForwareSaved] = useState(false);

    const classes = useStyles();

    const date = new Date();

    useEffect(() =>{
        setEntity({...defaultEntity})
    }, [props.dayNumber])

    useEffect(() =>{
        if(forwareSaved){
            props.onCreated(props.savedEntity);
            setForwareSaved(false);
        }
    }, [props.updateSuccess])

    const handleClose = () => props.onClose();

    const handleChangeStartTime = (newValue: Date | null) => {
        setEntity({...entity, startTime: newValue ? newValue.toISOString() : new Date().toISOString() });
    };

    const handleChangeEndTime = (newValue: Date | null) => {
        setEntity({...entity, endTime: newValue ? newValue.toISOString() : new Date().toISOString() });
    };
    
    const onSave = (e) =>{
        e.preventDefault();
        if((entity.dayNumber || entity.dayNumber === 0) && entity.endTime && entity.startTime){
            props.createEntity(entity);
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
                  title={<Translate contentKey={"microgatewayApp.workCalender.isoDay."+entity.dayNumber}>Day Name</Translate>}
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
                                <Button type="submit" variant="text" color="primary"
                                    disabled={!entity.startTime || !entity.endTime } 
                                    style={{ width: '100%' }}
                                    className="text-capitalize">
                                    <SaveIcon />&nbsp;&nbsp;
                                    {<Translate contentKey={"entity.action.save"}>Save</Translate>}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                 </CardContent>
            </Card>
        </Modal>
    </React.Fragment>
}

const mapStateToProps = (storeState: IRootState) => ({
    updating: storeState.workCalender.updating,
    updateSuccess: storeState.workCalender.updateSuccess,
    savedEntity: storeState.workCalender.entity,
  });

const mapDispatchToProps = {
  createEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkCalenderCreate);