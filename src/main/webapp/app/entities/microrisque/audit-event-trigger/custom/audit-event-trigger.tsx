import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Modal, Slide, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { AccessAlarms, Add, Close, Delete, Edit, Visibility } from "@material-ui/icons";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import TextContentManager from "app/shared/component/text-content-manager";
import { AuditEventRecurrence } from "app/shared/model/enumerations/audit-event-recurrence.model";
import { IAuditEventTrigger } from "app/shared/model/microrisque/audit-event-trigger.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { IRootState } from "app/shared/reducers";
import { formateDate, getEventOccurenceLabel } from "app/shared/util/date-utils";
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import EventTriggerUpdate from "./audit-event-trigger-update";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '37%',
        maxWidth: '70%',
        [theme.breakpoints.down("sm")]:{
            minWidth: '50%',
            maxWidth: '90%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
      background: 'white',
      minHeight: '20vh',
      maxHeight: '70vh',
      overflow: 'auto', 
    },
    cardActions:{
     background: 'white',
      paddingTop:0,
      paddingBottom:0,
      borderRadius: '0 0 15px 15px', 
    },
    thead:{
      border:'none',
      color: 'white',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    truncate:{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }
}))

const AuditEventTriggerRow = (props: {event?: IAuditEventTrigger, onUpdate?:Function, onDelete?: Function}) =>{
    const { event } = props;
    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const handleUpdate = () =>{
        props.onUpdate(event);
    }

    const handleDelete = () => {
        if(props.onDelete)
            props.onDelete(event);
    }
    const date = (event && event.nextStartAt) ? (new Date(event.nextStartAt)) : null;
    const hour = date ? `${date.getHours() < 10 ? '0'+date.getHours() : date.getHours()}` : '';
    const minute = date ? `${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}` : '';

    const startDate = event ? event.firstStartedAt ? new Date(event.firstStartedAt) : event.nextStartAt ? new Date(event.nextStartAt) : null : null;
    
    const dateTime = event ? event.nextStartAt ? new Date(event.nextStartAt) : event.firstStartedAt ? new Date(event.firstStartedAt) : null : null;

    const dayName = dateTime ? translate("_calendar.day."+dateTime.getDay()) : '';
    const dateAndMonthName = dateTime ? `${dateTime.getDate()} ${translate("_calendar.month."+dateTime.getMonth())}` : '';

    return (
        <React.Fragment>
            {event && <>
                <TextContentManager 
                    value={event.name}
                    title={translate("_global.instance.folder")}
                    readonly={true}
                    open={open}
                    onClose={() => setOpen(false)}
                />
                <TableRow>
                    <TableCell>
                        {startDate ? `${translate(`_calendar.day.short.${startDate.getDay()}`)} ${formateDate(startDate, `DD/MM/YYYY`)}` : '..'}
                    </TableCell>
                    <TableCell align="center">
                        {event.nextStartAt ? `${translate(`_calendar.day.short.${new Date(event.nextStartAt).getDay()}`)} ${formateDate(new Date(event.nextStartAt), `DD/MM/YYYY`)}` : '..'}
                    </TableCell>
                    <TableCell align="center">
                        {event.name && 
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                            <Box width="50%">
                                <Typography className={classes.truncate}>{event.name}</Typography>
                            </Box>
                            <IconButton
                                color="primary"
                                title={translate("entity.action.view")}
                                className="p-0 ml-3"
                                onClick={() => setOpen(true)}
                            >
                                <Visibility />
                            </IconButton>
                        </Box>
                        }
                    </TableCell>
                    <TableCell align="center">{event.editorName}</TableCell>
                    <TableCell align="center">
                        {getEventOccurenceLabel(event.nextStartAt ? new Date(event.nextStartAt) : null, event.recurrence)}
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            color="primary"
                            title={translate("entity.action.edit")}
                            className="p-0"
                            onClick={handleUpdate}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            title={translate("entity.action.edit")}
                            className="p-0 ml-2"
                            onClick={handleDelete}
                        >
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </>}
        </React.Fragment>
    )
}

interface EventTriggerProps extends StateProps, DispatchProps{
    audit: IAudit,
    open?: boolean,
    onClose: Function,
}

export const AuditEventTrigger = (props: EventTriggerProps) =>{
    const { open } = props;
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [entity, setEntity] = useState<IAudit>(props.audit);
    const [events, setEvents] = useState<IAuditEventTrigger[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IAuditEventTrigger>(null);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getUserExtra = () =>{
        if(props.account){
            setLoading(true);
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.account.id}`)
                .then(res => setUserExtra(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    const getEvents = (p?: number, rows?:number) =>{
        if(entity){
            setLoading(true);
            const page = (p || p===0) ? p : activePage;
            const size = rows || itemsPerPage;
            let apiUri = `${API_URIS.auditEventTriggerApiUri}/?auditId.equals=${entity.id}`;
            apiUri = `${apiUri}&page=${page}&size=${size}&sort=id,desc`;

            axios.get<IAuditEventTrigger[]>(apiUri)
                .then(res => {
                    setEvents([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        getUserExtra();
    },[props.account])

    useEffect(() =>{
        setEntity(props.audit)
        getEvents();
    }, [props.audit])


    const handleChangeItemsPerpage = (event) =>{
        setItemsPerPage(parseInt(event.target.value, 10));
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
    }

    const handleClose = () => props.onClose();

    const handleUpdate = (ev?: IAuditEventTrigger) =>{
        if(ev){
            setSelectedEvent(ev);
        }else{
            const date = new Date();
            setSelectedEvent({
                audit: entity, 
                recurrence: AuditEventRecurrence.ONCE,
                editorId: userExtra.id,
                editorName: getUserExtraFullName(userExtra),
                nextStartAt: date.toISOString()
            })
        }

        setOpenToUpdate(true);
    }

    const handleDelete = (ev?:IAuditEventTrigger) =>{
        if(ev){
            setSelectedEvent(ev);
            setOpenToDelete(true);
        }
    }

    const onSave = (saved?: IAuditEventTrigger, isNew?:boolean) =>{
        if(saved){
            if(isNew)
                setEvents([saved, ...events])
            else
                setEvents(events.map(ev => ev.id === saved.id ? saved : ev))
            setOpenToUpdate(false);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setEvents(events.filter(ev => ev.id !== deletedId))
            setOpenToDelete(false)
            setSelectedEvent(null)
        }
    }

    const items = [...events].map((e, index) =>(
        <AuditEventTriggerRow key={index} event={e} onUpdate={handleUpdate} onDelete={handleDelete}/>
    ))

    return (
        <React.Fragment>
        {selectedEvent && <>
        <EventTriggerUpdate 
            open={openToUpdate}
            entity={selectedEvent}
            onSave={onSave}
            onClose={() => setOpenToUpdate(false)}
        />
        <EntityDeleterModal 
            open={openToDelete}
            entityId={selectedEvent.id}
            urlWithoutEntityId={API_URIS.auditEventTriggerApiUri}
            onDelete={onDelete}
            onClose={() => setOpenToDelete(false)}
            question={translate("microgatewayApp.microprocessEventTrigger.delete.question", {id: ''})}
        />
        </>}
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
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center">
                                    <AccessAlarms />
                                    <Typography variant="h4" className="ml-3">
                                        {translate("microgatewayApp.microprocessEventTrigger.home.title")}
                                    </Typography>
                                </Box>
                            }
                            action={
                                <Box display="flex" alignItems="center">
                                <IconButton 
                                    color="inherit"
                                    className="mr-3"
                                    onClick={() => handleUpdate(null)}>
                                    <Add />
                                </IconButton>
                                <IconButton 
                                    color="inherit"
                                    onClick={handleClose}>
                                    <Close />
                                </IconButton>
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <Table>
                                <TableHead className={classes.thead}>
                                    <TableRow className={classes.theadRow}>
                                        <TableCell align="left">{translate('microgatewayApp.microprocessEventTrigger.firstStartedAt')}</TableCell>
                                        <TableCell align="left">{translate('microgatewayApp.microprocessEventTrigger.sheduledOn')}</TableCell>
                                        <TableCell align="center">{translate('_global.instance.folder')}</TableCell>
                                        <TableCell align="center">{translate('microgatewayApp.microprocessEventTrigger.editorName')}</TableCell>
                                        <TableCell align="center">{translate('microgatewayApp.microprocessEventTrigger.recurrence')}</TableCell>
                                        <TableCell align="center">{'Actions'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(loading || [...events].length <=0) && <TableRow>
                                    <TableCell align="center" colSpan={20}>
                                        {loading && <Box width={1} mt={1} mb={3} display="flex" 
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                            <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                            <Typography className="ml-2" color="secondary">Loading...</Typography>    
                                        </Box>}
                                        {(!loading && [...events].length<=0) &&
                                        <Typography variant="body1">
                                            {translate("microgatewayApp.microprocessEventTrigger.home.notFound")}
                                        </Typography>
                                        }
                                    </TableCell>
                                    </TableRow>}
                                    {items}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <TablePagination 
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={handleChangeItemsPerpage}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage={translate("_global.label.rowsPerPage")}
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                            }}/>
                        </CardActions>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}
const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
});
  
  const mapDispatchToProps = { };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(AuditEventTrigger);
