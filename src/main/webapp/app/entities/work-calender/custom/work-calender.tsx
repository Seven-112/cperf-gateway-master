import { IRootState } from 'app/shared/reducers';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { IWorkCalender } from 'app/shared/model/work-calender.model';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Box, Card, CardContent, CardHeader, Chip, Fab, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { translate, Translate } from 'react-jhipster';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import WorkCalenderCreate from './work-calender-create';
import { convertDateFromServer, convertDateTimeToServer, convertDateToServer } from 'app/shared/util/date-utils';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { IPublicHoliday } from 'app/shared/model/public-holiday.model';
import PublicHolidayUpdate from 'app/entities/public-holiday/custom/public-holiday-update';
import DeleteIcon from '@material-ui/icons/Delete';
import HolidayDeleteDialog  from './holiday-delete-dialog';

const useStyles = makeStyles(theme =>({
    card:{
        boxShadow: "-1px -1px 7px",
        color: theme.palette.primary.dark,
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
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

const WorkCalanderItemRow = (props: {dayNumber: number, dayCaleners: IWorkCalender[], handleAdd: Function, handleDelete: Function}) =>{

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

     const formateCalanderTime = (calender: IWorkCalender): string =>{
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

export interface IWorkCalenderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WorkCalender = (props: IWorkCalenderProps) =>{

    const [calenders, setCalenders] = useState<IWorkCalender[]>([]);

    const [open, setOpen] = useState(false);

    const [activDayNumber, setActivDayNumber] = useState<number>(null);

    const [deletingDC, setDeletingDc] = useState<IWorkCalender>(null)

    const [calenderLoading, setCalenerLoading] = useState(false);

    const [publicHolidays, setPublicHolidays] = useState<IPublicHoliday[]>([]);

    const [holidaysLoading, setHolidaysLoading] = useState(false);

    const [selectedHoliday, setSelectedHoliday] = useState<IPublicHoliday>({});
    const [openHolidayModalEditor, setOpenHolidayModalEditor] = useState(false);

    const [deteletingHolidayId, SetDeteletingHolidayId] = useState(null);

    const classes = useStyles();
    
    const history = useHistory();

    const getPublicHolidays = () =>{
        const currentDate = new Date();
        const startDate = convertDateFromServer(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
        const endDate = convertDateFromServer(new Date(currentDate.getFullYear(), currentDate.getMonth() +1, 0));
        setHolidaysLoading(true);
        axios.get<IPublicHoliday[]>(`${API_URIS.publicHolidyApiUri}/between/?dateMin=${startDate}&dateMax=${endDate}`)
        .then(response =>{
            if(response.data){
                setPublicHolidays([...response.data]);
                setHolidaysLoading(false);
            }
        }).catch(error =>{
            /* eslint-disable no-console */
            console.log(error);
        }).finally(() => setHolidaysLoading(false))
    }

    useEffect(() => {
      setCalenerLoading(true);
      axios.get<IWorkCalender[]>(`${API_URIS.workCalenderApiUri}`)
      .then(res =>{
            setCalenders([...res.data]);
            setCalenerLoading(false);
      }).catch((e) =>console.log(e))
      .finally(() => setCalenerLoading(false))
      getPublicHolidays();
    }, []);

    useEffect(() =>{
        if(deletingDC){
            const cldrs = calenders.filter(cldr => cldr.id !== deletingDC.id);
            setCalenders([...cldrs]);
            setDeletingDc(null);
        }
    }, [props.deleteSuccess])

    const handleAdd = (dayNumber: number) =>{
        if(dayNumber || dayNumber ===0){
            setActivDayNumber(dayNumber);
            setOpen(true);
        }
    }

    const onWorkCalenderCreated = (wkCalender: IWorkCalender) =>{
        if(wkCalender){
            const newCalenders = [...calenders];
            newCalenders.unshift(wkCalender);
            setCalenders([...newCalenders]);
            setOpen(false);
        }
    }
    
    const onCreateWorkClanderClose = () => setOpen(false);

    const handleDelete = (dCalender: IWorkCalender) =>{
        if(dCalender){
            setDeletingDc(dCalender);
            history.push('/work-calender/'+dCalender.id+'/delete');
        }
    }

    const daysCaleners = [1,2,3,4,5,6,7].map(dayNumber => {
        const dayCaleners = calenders.filter(c => c.dayNumber === dayNumber);
        return <WorkCalanderItemRow key={dayNumber} dayNumber={dayNumber}
             dayCaleners={dayCaleners} handleAdd={handleAdd} handleDelete={handleDelete} />;
    })

    const handleHolidayUpdated = (updated: IPublicHoliday, savingOp?: boolean) =>{
        if(updated){
            if(savingOp){
                const newHolidays = [...publicHolidays];
                newHolidays.push(updated);
                setPublicHolidays([...newHolidays]);
            }else{
                const newHolidays = publicHolidays.map(ph =>{
                    if(ph.id === updated.id)
                        return updated;
                    return ph;
                });
                setPublicHolidays([...newHolidays]);
            }
        }
    }

    const handleCloseHolidayUpdateModal = () =>{
        setOpenHolidayModalEditor(false);
    }

    const handleEditHoliday = (entity?: IPublicHoliday) =>{
        if(entity)
            setSelectedHoliday(entity);
        else
            setSelectedHoliday({});
        setOpenHolidayModalEditor(true);
    }

    const handleDeletePublicHoliday = (element: IPublicHoliday) =>{
        SetDeteletingHolidayId(element.id);
    }

    const handleCloseDeleteHolidayModal = (deletedId?: any) =>{
        SetDeteletingHolidayId(null);
        if(deletedId){
            const holidays = publicHolidays.filter(el => el.id !==deletedId);
            setPublicHolidays([...holidays]);
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Cperf | Calender</title>
            </Helmet>
             <WorkCalenderCreate dayNumber={activDayNumber} open={open} 
                onCreated={onWorkCalenderCreated} onClose={onCreateWorkClanderClose} />
            <PublicHolidayUpdate open={openHolidayModalEditor} entity={selectedHoliday}
                onUpdate={handleHolidayUpdated} onClose={handleCloseHolidayUpdateModal} />
            {(deteletingHolidayId) && <HolidayDeleteDialog id={deteletingHolidayId} onClose={handleCloseDeleteHolidayModal} />}
            <Card className={classes.card}>
                <CardHeader
                    title={<Box display="flex" alignItems="center">
                        <ScheduleIcon />
                        <Typography className="ml-3" variant="h4">
                            <Translate contentKey="microgatewayApp.workCalender.detail.title">Calender</Translate>
                        </Typography>
                    </Box>
                    }
                    titleTypographyProps={{
                        variant: 'h4',
                    }}
                    className={classes.cardHeader}
                 />
                 <CardContent>
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
                                            onClick={() =>handleEditHoliday({})}>
                                            <AddIcon />
                                        </IconButton>
                                    }
                                    className={classes.cardHeader}
                                 />
                                <CardContent>
                                    <List>
                                        {publicHolidays.map(pbh =>(
                                            <ListItem key={pbh.id} dense button onClick={() =>handleEditHoliday(pbh)}>
                                                <ListItemText primary={convertDateFromServer(pbh.ofDate)}
                                                    secondary={pbh.name} />
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
        </React.Fragment>
    )
}

const mapStateToProps = ({ workCalender, publicHoliday }: IRootState) => ({
  deleteSuccess: workCalender.updateSuccess,
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkCalender);