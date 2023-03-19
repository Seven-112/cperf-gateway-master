import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import React, { useEffect, useState } from "react";
import { IDashBoard } from "../dashbord-model";
import { DashBoardSectionContener } from "../dashboard-section-contener";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { translate } from "react-jhipster";
import theme from "app/theme";
import { NoStartedTask } from "./no-started-task";
import { StartedTask } from "./started-task";
import { ExecutionLevel } from "./execution-level";
import { CompletedTask } from "./completed-task";
import { TaskExecutionTrakingChart } from "./task-execution-traking-chart";
import { DeleyRespectRateChart } from "./delay-respect-rate-chart";
import { IRootState } from "app/shared/reducers";
import { getOne, getAll } from "./dashbord-reducer";
import { connect } from "react-redux";
import ModalChartPreviewer from "../modal-chart-previewer";
import { getStartDateFromEndDateByUnity } from "../date-interval-selector";
import { DEFAULT_PERF_INDICATOR_UNITY } from "../unity-selector";
import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model";
import { IKPI } from "app/shared/model/microprocess/kpi.model";
import { removeToDate } from "app/shared/util/date-utils";

const useStyles = makeStyles({
    ribbon:{
        backgroundColor: theme.palette.success.dark,
        // color: 'green',
    }
})

interface ProcessDashbordProps extends IDashBoard, StateProps, DispathProps {}

const now = new Date();

export const ProcessDashbord = (props: ProcessDashbordProps) =>{
    // tâche à exécuter

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [dataKey, setDataKey] = useState("noStarted");

    const [isPercentData, setIsPercentData] = useState(false);

    const [modalTitle, setModalTite] = useState("");

    const [dateMax, setDateMax] = useState(now);

    const [dateMin, setDateMin] = useState(getStartDateFromEndDateByUnity(now,DEFAULT_PERF_INDICATOR_UNITY));

    const [unity, setUnity] = useState(DEFAULT_PERF_INDICATOR_UNITY);


    const getKpis = (dteMin?: Date, dteMax?: Date, paramUnity?: PerfIndicatorUnity ) =>{
        if(dteMin) 
            setDateMin(dateMin) 
        else 
            dteMin = dateMin;
        if(dteMax) 
            setDateMax(dteMax)
        else
            dteMax = dateMax;
        if(paramUnity)
            setUnity(paramUnity)
        else
            paramUnity = unity;
        
        props.getAll(props.userIds, dteMin, dteMax, paramUnity);
        
    }

    useEffect(() =>{
        if(serviceIsOnline(SetupService.PROCESS)){
            const dte = new Date();
            props.getOne(props.userIds, dte);
            getKpis();
        }
    }, [props.userIds])

    const handleChangeDates = (startDate?: Date, endDate?: Date) => {
        if(startDate)
            setDateMin(startDate)
        if(endDate)
            setDateMax(endDate);
    }

    const handleChangeUnity = (newUniy?: PerfIndicatorUnity) =>{
        setUnity(newUniy);
    }

    const handleSearch = () =>{
        getKpis();
    }

    const handleOpenModal = (title, keyData, percentData) =>{
        setModalTite(title);
        setDataKey(keyData);
        setIsPercentData(percentData);
        setOpen(true);
    }

    const mySorter = (f1?: string, f2?: string) =>{
        let d1 = new Date(f1);
        let d2 = new Date(f2);
        if(d1 > d2){
            d1 = null;
            d2 = null;
            return 1;
        }
        return 0;
    }

    // modal data constructor utils

    const sortedData = [...props.kpis].sort((a, b) => mySorter(a.dte, b.dte));

    const getLabelFromDate = (date: Date) =>{
        const dayOfMonth = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();
        return `${translate(`_calendar.day.short.${date.getDay()}`)} ${dayOfMonth} ${translate(`_calendar.month.short.${date.getMonth()}`)} ${date.getFullYear()}`;
    }

    const chartLabels = sortedData.length === 1 ? [
        getLabelFromDate(removeToDate(new Date(sortedData[0].dte), {nbDays: 1})),
        getLabelFromDate(new Date(sortedData[0].dte))
    ] : sortedData.map((i) =>getLabelFromDate(new Date(i.dte)));


    const formateData = (kpiParam: IKPI) =>{
         if(kpiParam){
            let startVal = `${kpiParam[dataKey]}`;
            if(startVal.includes(",") || startVal.includes("."))
                startVal = kpiParam[dataKey].toFixed(2);
            const value = Number(startVal);
            if(isPercentData)
                return value * 100;
            return value;
         }
         return 0;
    }

    const data = sortedData.length !== 0 
        ? sortedData.map(i => formateData(i))
        : [0,0,1,2,3,4,5,6,7,8,9,10]

    return (
        <React.Fragment>
            <ModalChartPreviewer
                title={modalTitle}
                open={open}
                dateMax={dateMax}
                dateMin={dateMin}
                unity={unity}
                chartData={data}
                loading={props.listLoading}
                chartLables={chartLabels}
                isPercentData={isPercentData}
                onChangeDates={handleChangeDates}
                onChangeUnity={handleChangeUnity}
                onSearch={handleSearch}
                onClose={() => setOpen(false)}
            />
            <DashBoardSectionContener
                title={translate("microgatewayApp.microprocessProcess.home.title")}
                ribbonBoxClassName={classes.ribbon}
            >
            <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                {/** no started task */}
                <Grid item xs={6} sm={4} md={2}>
                    <NoStartedTask kpi={props.kpi} 
                        loading={props.loading}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, false)}
                        />
                </Grid>
                {/** all started task */}
                <Grid item xs={6} sm={4} md={2}>
                    <StartedTask kpi={props.kpi} loading={props.loading}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, false)} />
                </Grid>
                {/** execution level */}
                <Grid item xs={6} sm={4} md={2}>
                    <ExecutionLevel kpi={props.kpi} loading={props.loading}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, true)} />
                </Grid>
                {/** started and exceceed task  */}
                <Grid item xs={6} sm={4} md={2}>
                    <StartedTask kpi={props.kpi} loading={props.loading} exceceed={true}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, false)} />
                </Grid>
                {/** completed in deley en retard  */}
                <Grid item xs={6} sm={4} md={2}>
                    <CompletedTask kpi={props.kpi} loading={props.loading}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, false)} />
                </Grid>
                {/** completed exceceed  */}
                <Grid item xs={6} sm={4} md={2}>
                    <CompletedTask kpi={props.kpi} loading={props.loading} exceceed={true}
                        onClick={(title, keyData) =>handleOpenModal(title, keyData, false)} />
                </Grid>
            </Grid>
            {/* evaluations dashbord content */}
            <Box width={1} mt={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TaskExecutionTrakingChart 
                            kpis={[...props.kpis]} 
                            loading={props.listLoading}
                            dateMin={dateMin}
                            dateMax={dateMax}
                            unity={unity}
                            onSearch={handleSearch} 
                            onChangeDates={handleChangeDates}
                            onChangeUnity={handleChangeUnity} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DeleyRespectRateChart 
                            kpis={[...props.kpis]} 
                            loading={props.listLoading}
                            dateMin={dateMin}
                            dateMax={dateMax}
                            unity={unity}
                            onSearch={handleSearch} 
                            onChangeDates={handleChangeDates}
                            onChangeUnity={handleChangeUnity} />
                    </Grid>
                </Grid>
            </Box>
            </DashBoardSectionContener>
        </React.Fragment>
    )
}

const mapStateToProps = ({ processKPI } : IRootState) =>({
    kpi: processKPI.entity,
    kpis: processKPI.entities,
    loading: processKPI.loading,
    listLoading: processKPI.listLoading,
});

const mapDispatchToProps = {
    getOne,
    getAll
}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispathProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessDashbord);