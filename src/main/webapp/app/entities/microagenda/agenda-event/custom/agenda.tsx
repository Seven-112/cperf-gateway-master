import { IUserExtra } from "app/shared/model/user-extra.model";
import { IRootState } from "app/shared/reducers";
import { getSession } from "app/shared/reducers/authentication";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { translate } from "react-jhipster";
import { Box, Button, Card, CardContent, CardHeader, FormControl, IconButton, makeStyles, MenuItem, Select, Tooltip, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AgendaDalayOptions } from "app/shared/model/enumerations/agenda-delay-option";
import moment from "moment";
import { DatePicker } from "@material-ui/pickers";
import clsx from "clsx";
import UserCalendar from "./user-calener";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

const sideBarWidth=320;

const useStyles = makeStyles(theme =>({
    card:{
        width: '100%'
    },
    cardContent:{
    },
    rootBox:{
        flexDirection: 'row',
        [theme.breakpoints.down("sm")]:{
            flexDirection: 'column',
        }
    },
    mainBox:{
        overflow: "auto",
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
    },
    mainBoxOpen:{
        width: `calc(100% - ${sideBarWidth}px)`,
        [theme.breakpoints.down("sm")]:{
            width: '100%',
        }
    },
    mainBoxClose:{
        width: '100%',
    },
    sidebarBox:{
        overflow: 'auto',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
    },
    sidebarOpen:{
        width: sideBarWidth,
        [theme.breakpoints.down("sm")]:{
            width: '100%',
        }
    },
    sidebarClose:{
        width: 0,
    },
}))


interface AgendaProps extends StateProps, DispatchProps{}

export const Agenda = (props: AgendaProps) =>{
    const [userExra, setUserExtra] = useState<IUserExtra>(null);
    const [loading, setLoading] =  useState(false);
    const [delay, setDelay] = useState(AgendaDalayOptions.FOUR_DAYS);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openSidebar, setOpenSidebar] = useState(true);

    const classes = useStyles();

    const getFirstAndLastDate = () =>{
            const _moment = selectedDate ? moment(selectedDate) : moment();
            let dMin= new Date();
            let dMax = new Date();
            if(delay === AgendaDalayOptions.ONE_DAY){
                dMin =_moment.toDate();
                dMax = _moment.toDate();
            }else if(delay === AgendaDalayOptions.WEEK){
                dMin = _moment.startOf("week").toDate();
                dMax = _moment.endOf("week").toDate();
            }else if(delay === AgendaDalayOptions.MONTH){
                dMin = _moment.startOf("month").toDate();
                dMax = _moment.endOf("month").toDate();
            }else if(delay === AgendaDalayOptions.YEAR){
                dMin = _moment.startOf("year").toDate();
                dMax = _moment.endOf("year").toDate();
            }else{
                dMin = _moment.toDate();
                dMax = _moment.add(3, "days").toDate();
            }
            dMin.setHours(0, 0, 0);
            dMax.setHours(23,59,59);
            setStartDate(dMin);
            setEndDate(dMax);
    }

    const getUserExtra = () =>{
        if(props.account && props.account.id){
            setLoading(true);
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.account.id}`)
                .then(res => setUserExtra(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        if(!props.account)
         props.getSession();
    }, [])

    useEffect(() =>{
        getUserExtra();
    }, [props.account])

    useEffect(() =>{
        getFirstAndLastDate();
    }, [delay, selectedDate, selectedDate])

    const handleChangeDeley = (e) =>{
        setDelay(e.target.value);
    }

    const handleChangeDate = (newDate) =>{
        setSelectedDate(newDate);
    }

    const handleDateClick = (dte) =>{
        if(dte){
            setSelectedDate(dte);
        }
    }

    const handleNextInterval = () =>{
        setSelectedDate(moment(endDate).add(1, 'day').toDate());
    }

    const handleBackInterval = () =>{
        if(delay === AgendaDalayOptions.ONE_DAY){
            setSelectedDate(moment(startDate).subtract(1, 'day').toDate());
        }else if(delay === AgendaDalayOptions.WEEK){
            setSelectedDate(moment(startDate).subtract(1, 'week').toDate());
        }else if(delay === AgendaDalayOptions.MONTH){
            setSelectedDate(moment(startDate).subtract(1, 'month').toDate());
        }else if(delay === AgendaDalayOptions.YEAR){
            setSelectedDate(moment(startDate).subtract(1, 'year').toDate());
        }else{
            setSelectedDate(moment(startDate).subtract(2, 'day').toDate());
        }
    }

    return (
        <React.Fragment>
            <Helmet><title>{`${translate("_global.appName")} | ${translate("_global.label.agenda")}`}</title></Helmet>
            <Box>
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap"
                                justifyContent="space-between"alignItems="center">
                                <Box display="flex" alignItems="center">
                                    <IconButton className=""
                                        onClick={() => setOpenSidebar(!openSidebar)}>
                                        <FontAwesomeIcon icon={faBars} />
                                    </IconButton>
                                    <Button 
                                        className="text-capitalize" 
                                        variant="outlined"
                                        onClick={() => setSelectedDate(new Date())}>
                                        {translate("_global.label.today")}
                                    </Button>
                                    {selectedDate && <>
                                        <Tooltip title={translate("_calendar.label.prevPeriod")} placement="bottom">
                                                <IconButton className="p-1 ml-2" onClick={handleBackInterval}>
                                                    <ChevronLeft />
                                                </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate("_calendar.label.nextPeriod")} placement="bottom">
                                            <IconButton className="p-1 mr-2" onClick={handleNextInterval}>
                                                <ChevronRight />
                                            </IconButton>
                                        </Tooltip>
                                        <Typography variant="h4">
                                            {`${translate("_calendar.month."+selectedDate.getMonth())} ${selectedDate.getFullYear()}`}
                                        </Typography>
                                    </>}
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <FormControl size="small"  variant="outlined">
                                        <Select value={delay} onChange={handleChangeDeley}>
                                            <MenuItem value={AgendaDalayOptions.FOUR_DAYS}>
                                                {translate("_global.label.fourDays")}
                                            </MenuItem>
                                            <MenuItem value={AgendaDalayOptions.WEEK}>
                                                {translate("_global.label.week")}
                                            </MenuItem>
                                            {/* <MenuItem value={AgendaDalayOptions.MONTH}>
                                                {translate("_global.label.month")}
                                            </MenuItem>
                                            <MenuItem value={AgendaDalayOptions.YEAR}>
                                                {translate("_global.label.year")}
                                            </MenuItem> */}
                                            <MenuItem value={AgendaDalayOptions.ONE_DAY}>
                                                {translate("_global.label.oneDay")}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                        </Box>}
                    />
                    <CardContent className={classes.cardContent}>
                        <Box display="flex" className={classes.rootBox}>
                            <Box className={clsx(classes.sidebarBox, {
                                [classes.sidebarOpen] : openSidebar,
                                [classes.sidebarClose]: !openSidebar,
                            })}>
                                <Box width={1} p={0} m={0} overflow="auto"
                                    display="flex" justifyContent="center"
                                    order={1}>
                                    <DatePicker 
                                        value={selectedDate}
                                        onChange={handleChangeDate}
                                        variant="static"
                                        disableToolbar
                                    />
                                </Box>
                            </Box>
                            <Box className={clsx(classes.mainBox,{
                                [classes.mainBoxOpen] : openSidebar,
                                [classes.mainBoxClose]: !openSidebar,
                            })}>
                                <UserCalendar 
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectedDate={selectedDate}
                                    userExtra={userExra}
                                    onDateClick={handleDateClick}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
