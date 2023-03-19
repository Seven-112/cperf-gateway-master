import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Chip, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { translate, Translate } from 'react-jhipster';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { convertDateFromServer, convertDateTimeToServer, formateDate } from 'app/shared/util/date-utils';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import DeleteIcon from '@material-ui/icons/Delete';
import { IProjectCalendar } from 'app/shared/model/microproject/project-calendar.model';
import { IProjectPublicHoliday } from 'app/shared/model/microproject/project-public-holiday.model';
import { IProject } from 'app/shared/model/microproject/project.model';
import ProjectPublicHolidayUpdate from '../../project-public-holiday/custom/project-public-holiday-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import ProjectCalendarCreate from './project-calendar-create';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles(theme =>({
    card:{
        background: 'transparent',
        width: '100%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    title:{
    },
    subheader:{
        textAlign: 'center',
    },
    accordion:{
        borderRadius: '20px 20px 0 0',
        background: 'transparent',
        padding: 0,
        boxShadow: 'none',
    },
    accordionSummary:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        boxShadow: '-1px -1px 7px',
        borderRadius: '20px 20px 0 0',
    }
}))

const CalendarItemRow = (props: {dayNumber: number, dayCaleners: IProjectCalendar[], handleAdd: Function, handleDelete: Function}) =>{

     const { dayNumber, dayCaleners } = props;
     const classes = useStyles();
     const [open, setOpen] = useState(false);


     useEffect(() =>{
        const dayOfWeek = (new Date()).getUTCDay();
        if((props.dayNumber === dayOfWeek) || (props.dayNumber === 7 && dayOfWeek === 0))
            setOpen(true)
        else
            setOpen(false);
     }, [])

     const formateCalanderTime = (calender: IProjectCalendar): string =>{
        let time = "";
        const startDate: Date = convertDateTimeToServer(calender.startTime);
        const endDate: Date = convertDateTimeToServer(calender.endTime);
        if(startDate && endDate){
            // formate start time
            const startHour = ((startDate.getHours() < 10) ? ("0"+startDate.getHours().toString() )
                    : startDate.getHours().toString()) + translate('_global.label.h')+ " : ";
            const startMinutes = (startDate.getMinutes() < 10) ? "0"+startDate.getMinutes().toString() : startDate.getMinutes().toString();

            time = startHour + startMinutes + " " + translate('_global.label.to') + " ";

            // formate end time
            const endHour = ((endDate.getHours() < 10) ? ("0"+endDate.getHours().toString() )
                    : endDate.getHours().toString()) + translate('_global.label.h')+ " : ";
            const endMinutes = (endDate.getMinutes() < 10) ? "0"+endDate.getMinutes().toString() : startDate.getMinutes().toString();

            time = time + endHour + endMinutes;
        }
        return time;
     }
     return(
        <Accordion expanded={open} onChange={() =>setOpen(!open)}>
            <AccordionSummary className={classes.accordionSummary}
                expandIcon={<ExpandMoreIcon color="inherit" />}
            >
                <Typography>
                    {<Translate contentKey={"microgatewayApp.workCalender.isoDay."+dayNumber}>Day Name</Translate>}
                </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ boxShadow: 'none', border: 'none'}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} className="text-center">
                        {dayCaleners &&
                            dayCaleners.map(dc =>(
                                <Chip key={dc.id}
                                    label={formateCalanderTime(dc)}
                                    onDelete={() => props.handleDelete(dc)}
                                    color="primary"
                                    variant="outlined"
                                    className="m-1"
                                />
                            ))
                        }
                    </Grid>
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <IconButton color="primary" title="add" onClick={() => props.handleAdd(dayNumber)}><AddIcon /></IconButton>
            </AccordionActions>
        </Accordion>
     );
}

export interface IProjectCalendarProps{
    project: IProject
    onClose?: Function,
}

export const ProjectCalendar = (props: IProjectCalendarProps) =>{

    const { project } = props;

    const [calenders, setCalenders] = useState<IProjectCalendar[]>([]);

    const [open, setOpen] = useState(false);

    const [activDayNumber, setActivDayNumber] = useState<number>(null);

    const [dayCalendarToDelete, setDayCalendarToDelete] = useState<IProjectCalendar>(null)

    const [calenderLoading, setCalenerLoading] = useState(false);

    const [publicHolidays, setPublicHolidays] = useState<IProjectPublicHoliday[]>([]);

    const [holidaysLoading, setHolidaysLoading] = useState(false);

    const [selectedHoliday, setSelectedHoliday] = useState<IProjectPublicHoliday>(null);
    const [openHolidayModalEditor, setOpenHolidayModalEditor] = useState(false);

    const [holidayToDalete, setHolidayToDelete] = useState<IProjectPublicHoliday>(null);
    const [openToDeleteHoliday, setOpenToDeleteHoliday] = useState(false);
    const [openToDeleteDayCalendar, setOpenToDeleteDayCalendar] = useState(false);

    const classes = useStyles();

    const getDayCalendars = () =>{
        setCalenerLoading(true);
        let apiUri = `${API_URIS.projectCalendarApiUri}/`;
        if(project && project.id)
            apiUri = `${apiUri}?projectId.equals=${project.id}`;
        else
            apiUri = `${apiUri}?projectId.specified=false`;
        axios.get<IProjectCalendar[]>(apiUri)
            .then(res =>{
                setCalenders([...res.data]);
                setCalenerLoading(false);
        }).catch((e) => console.log(e))
        .finally(() =>setCalenerLoading(false));
    }

    const getPublicHolidays = () =>{
        const date = new Date();
        // on defini une intervall de 2 ans
        const startDate = new Date(date.setFullYear(date.getFullYear() -1));
        const endDate = new Date(date.setFullYear(date.getFullYear()+2));
        setHolidaysLoading(true);
        let apiUri = `${API_URIS.projectPublicHolidayApiUri}/`;
        if(project && project.id)
            apiUri = `${apiUri}?processId.equals=${project.id}`;
        else
            apiUri = `${apiUri}?processId.specified=false`;
        apiUri = `${apiUri}&date.greaterThanOrEqual=${convertDateFromServer(startDate)}`;
        apiUri = `${apiUri}&date.lessThanOrEqual=${convertDateFromServer(endDate)}`;
        axios.get<IProjectPublicHoliday[]>(apiUri)
        .then(response =>{
            if(response.data){
                setPublicHolidays([...response.data]);
                setHolidaysLoading(false);
            }
        }).catch(error =>{
            /* eslint-disable no-console */
            console.log(error);
        }).finally(() =>setHolidaysLoading(false));
    }

    useEffect(() => {
      getDayCalendars();
      getPublicHolidays();
    }, [props.project]);

    const handleAdd = (dayNumber: number) =>{
        if(dayNumber || dayNumber ===0){
            setActivDayNumber(dayNumber);
            setOpen(true);
        }
    }

    const onCalenderCreated = (calendar: IProjectCalendar) =>{
        if(calendar){
            setCalenders([...calenders, calendar]);
        }
        setOpen(false)
    }
    
    const handleCreateClendarClose = () =>{
        setOpen(false);
    }

    const handleDelete = (dCalender: IProjectCalendar) =>{
        if(dCalender){
            setDayCalendarToDelete(dCalender);
            setOpenToDeleteDayCalendar(true);
        }
    }

    const daysCaleners = [1,2,3,4,5,6,7].map(dayNumber => {
        const dayCaleners = calenders.filter(c => c.dayNumber === dayNumber);
        return <CalendarItemRow key={dayNumber} dayNumber={dayNumber}
             dayCaleners={dayCaleners} handleAdd={handleAdd} handleDelete={handleDelete} />;
    })

    const handleHolidayUpdated = (saved: IProjectPublicHoliday, isNew?: boolean) =>{
        if(saved){
            if(isNew){
                setPublicHolidays([saved,...publicHolidays]);
            }else{
                setPublicHolidays(publicHolidays.map(ph => ph.id === saved.id ? saved : ph));
            }
            setSelectedHoliday(null);
        }
    }

    const handleCloseHolidayUpdateModal = () =>{
        setOpenHolidayModalEditor(false);
    }

    const handleEditHoliday = (entity?: IProjectPublicHoliday) =>{
        if(entity)
            setSelectedHoliday(entity);
        else
            setSelectedHoliday({});
        setOpenHolidayModalEditor(true);
    }

    const handleDeletePublicHoliday = (element: IProjectPublicHoliday) =>{
        setHolidayToDelete(element);
        setOpenToDeleteHoliday(true);
    }

    const handleCloseDeleteHolidayModal = () => setOpenToDeleteHoliday(false)

    const onDeletePublicHoliday = (deletedId) =>{
        if(deletedId){
            setPublicHolidays(publicHolidays.filter(ph => ph.id !== deletedId))
            setOpenToDeleteHoliday(false);
        }
    }

    const onDeleteDayCalendar = (deletedId) =>{
        if(deletedId){
            setCalenders(calenders.filter(c => c.id !== deletedId));
            setOpenToDeleteDayCalendar(false)
        }
    }

    const handleClose = () =>{
        if(props.onClose)
            props.onClose();
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("microgatewayApp.microprojectProjectCalendar.detail.title")}`}</title>
            </Helmet>
            {(activDayNumber || activDayNumber === 0 && project) &&
                <ProjectCalendarCreate 
                    project={project}
                    dayNumber={activDayNumber} open={open} 
                    onCreated={onCalenderCreated} 
                    onClose={handleCreateClendarClose} /> 
            }
            {selectedHoliday && 
                <ProjectPublicHolidayUpdate open={openHolidayModalEditor} entity={selectedHoliday}
                    onUpdate={handleHolidayUpdated} onClose={handleCloseHolidayUpdateModal} />
            }
            {dayCalendarToDelete && 
                <EntityDeleterModal open={openToDeleteDayCalendar}
                    entityId={dayCalendarToDelete.id}
                    urlWithoutEntityId={API_URIS.projectCalendarApiUri}
                    onClose={() => setOpenToDeleteDayCalendar(false)}
                    onDelete={onDeleteDayCalendar}
                    question={translate("microgatewayApp.workCalender.delete.question", {id: '' })}
                />
            }
            {holidayToDalete && 
                <EntityDeleterModal open={openToDeleteHoliday}
                    entityId={holidayToDalete.id}
                    urlWithoutEntityId={API_URIS.projectPublicHolidayApiUri}
                    onClose={handleCloseDeleteHolidayModal}
                    onDelete={onDeletePublicHoliday}
                    question={translate("microgatewayApp.publicHoliday.delete.question", {id: holidayToDalete.name })}
                />
            }
            <Box width={1} boxShadow={13}> 
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" alignItems="center">
                            <ScheduleIcon />
                            <Typography className="ml-3" variant="h4">
                                {`${translate("microgatewayApp.workCalender.detail.title")} `}
                            </Typography>
                        </Box>
                        }
                        subheader={
                        <Box width={1} display="flex" justifyContent="center"
                            alignItems="center" flexWrap="wrap">
                                {project && <>
                                    <Typography variant='h5' color="primary">
                                        {`${translate("microgatewayApp.microprojectProject.detail.title")} : ${project.label}`}
                                    </Typography>
                                </>}
                        </Box>}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={props.onClose ? (
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton> 
                        ) : ''}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Grid container spacing={3}>
                            {/** work calender container */}
                            <Grid item xs={12} sm={6}>
                                {calenderLoading && <Grid item xs={12} className="text-center">loading...</Grid>}
                                { daysCaleners }
                            </Grid>
                            {/** public holidays content */}
                            <Grid item xs={12} sm={6}>
                                {holidaysLoading && <Grid item xs={12} className="text-center">loading...</Grid>}
                                <Card className={classes.card}>
                                    <CardHeader
                                        title={
                                            <Translate contentKey="microgatewayApp.publicHoliday.holidaysOfMonth">public holidays</Translate>
                                        }
                                        titleTypographyProps={{
                                            variant:'h5',
                                            className: 'ml-2',
                                        }}
                                        action={
                                            <IconButton color="inherit" 
                                                onClick={() =>handleEditHoliday(null)}>
                                                <AddIcon />
                                            </IconButton>
                                        }
                                        className={classes.cardheader}
                                    />
                                    <CardContent>
                                        <List>
                                            {publicHolidays.map(pbh =>(
                                                <ListItem key={pbh.id} dense button onClick={() =>handleEditHoliday(pbh)}>
                                                    <ListItemText primary={pbh.name}
                                                        secondary={formateDate(new Date(pbh.date), 'DD/MM/YYYY')} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton color="secondary" onClick={() =>handleDeletePublicHoliday(pbh)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default ProjectCalendar;