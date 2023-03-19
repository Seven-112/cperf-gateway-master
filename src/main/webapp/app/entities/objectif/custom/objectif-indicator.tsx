import { IEmployee } from "app/shared/model/employee.model";
import { ObjectifCategorie } from "app/shared/model/enumerations/objectif-categorie.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { getEntities as getEmployees } from 'app/entities/employee/employee.reducer';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from "react-redux";
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, colors, Grid, makeStyles, MenuItem, Select, TablePagination, TextField, Typography } from "@material-ui/core";
import { IObjectif } from "app/shared/model/objectif.model";

import axios from 'axios';
import { API_URIS, calculIndicatorDataPercent, getTotalPages, isIndicatorDataEditable } from "app/shared/util/helpers";
import { IIndicator } from "app/shared/model/indicator.model";
import IndicatorProgress from "app/entities/indicator/custom/indicator-progress";
import { translate, Translate } from "react-jhipster";
import IndicatorDataEditor from "app/entities/indicator/custom/indicator-data-editor";
import { RouteComponentProps } from "react-router-dom";
import { Explore, Remove, SettingsInputAntenna } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Helmet } from 'react-helmet';
import { IUserExtra } from "app/shared/model/user-extra.model";
import { getEntity as getUserExtra } from 'app/entities/user-extra/user-extra.reducer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>({
    card:{
    },
    cardContent:{
        height: theme.spacing(60),
        overflow: 'auto',
    },
    cardHeader:{
        background: theme.palette.primary.dark,
        color: 'white',
        padding:theme.spacing(1),
    },
    subheader:{
        color: 'white',
    },
    avatar:{
        background: theme.palette.primary.light,
        boxShadow: '-1px -1px 3px',
    },
    categorieSelect:{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        color: theme.palette.background.paper,
        '&:before': {
            borderColor: theme.palette.primary.dark,
        },
        '&:after': {
            borderColor: theme.palette.primary.dark,
        }
    },
    categorieSelectIcon:{
        fill: theme.palette.background.paper,
        color: theme.palette.background.paper,
    },
    headerInput:{
        '& .MuiInput-root':{
            color: 'white',
            '&:before':{
                borderBottomColor: 'white',
            },
            '&:hover':{
                '&:before':{
                    borderBottomColor: 'white',
                },
            }
        },
        '& .Mui-focused':{
            color: 'white',
            '&:before':{
                borderBottomColor: 'white',
            },
        },
    },
    headerInputIcon:{
        fill: 'white',
    },
    clearIndicator:{
        color: 'white',
    },
    popupIndicator:{
        color: 'white',
    },
    datePickerAndornment:{
        '& .MuiIconButton-root':{
            color:'white',
        }
    },
    cardActions:{
        paddingTop:0,
        paddingBottom:0,
        background: colors.lightBlue[50],
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
}))

export const ObjectifIndidicators = (props: {objectif: IObjectif}) =>{

    const {objectif} = props;

    const [indicators, setIndicators] = useState<IIndicator[]>([]);

    const [indicatorToUpdate, setIndicatorToUpdate] = useState<IIndicator>(null);

    const getIndicators = () =>{
        if(objectif){
            axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?objectifId.equals=${objectif.id}`)
            .then(res =>{
                setIndicators([...res.data])
               // setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch((e) =>{
                /* eslint-disable no-console */
                console.log(e)
            }).finally(() => {})
        }
    }

    useEffect(() =>{
        getIndicators();
    },[])

    const onUpdateIndicator = (indicator?: IIndicator) =>{
        if(indicator){
            const els = indicators.map(i => i.id === indicator.id ? indicator : i);
            setIndicators([...els]);
        }
        setIndicatorToUpdate(null);
    }

    const displayIndicator = (indicator: IIndicator) =>{
        const chirlds = indicators.filter(ind => ind.parent && ind.parent.id === indicator.id);
        return (<React.Fragment>
            <IndicatorProgress indicator={indicator} boxShadow={10}
                percent={calculIndicatorDataPercent(indicator, indicators)} m={1} p={1} 
                dataEditable={isIndicatorDataEditable(indicator, indicators)}
                onClick={() => isIndicatorDataEditable(indicator, indicators) ? setIndicatorToUpdate(indicator) : null}/>
            {(chirlds && chirlds.length > 0) && <React.Fragment>{chirlds.map(ind => displayIndicator(ind))}<br/></React.Fragment>}
        </React.Fragment>)
    }

    return (<React.Fragment>
        {indicatorToUpdate && <IndicatorDataEditor indicator={indicatorToUpdate} open={true} onClose={onUpdateIndicator}/> }
        {indicators.filter(ind => !ind.parent).map(ind =>(displayIndicator(ind)))}
    </React.Fragment>)
}

export interface IObjectifDatshbordProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }>  {}

export const ObjectifIndicator = (props: IObjectifDatshbordProps) =>{

    const [employee, setEmployee] = useState<IEmployee>(null);

    const [autoComplteIputValue, setAutoComplteInputValue] = useState('');

    const [categorie, setCategorie] = useState<ObjectifCategorie>(ObjectifCategorie.INDIVIDUAL);

    const [objectifs, setObjectifs] = useState<IObjectif[]>([]);

    const [activePage, setActivePage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(4);

    const [totalItems, setTotalItems] = useState(0);

    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState<Date>(null);

    const [endDate, setEndDate] = useState(new Date());

    const getStartDateFromEndDate = () =>{
        if(endDate){
            const startDateFormEndDate = new Date(endDate.toISOString());
            startDateFormEndDate.setMonth(startDateFormEndDate.getMonth()-3);
            /* eslint-disable no-console */
            console.log(startDateFormEndDate.toISOString());
            return startDateFormEndDate;
        }
        return new Date();
    }

    
    const loadConnectedEmployee = () =>{
        if(props.userExtraEntity && props.userExtraEntity.employee && !employee){
            axios.get<IEmployee>(`${API_URIS.employeeApiUri}/${props.userExtraEntity.employee.id}`).then(res =>{
                if(res.data)
                    setEmployee(res.data);
            }).catch(() =>{});
        }
    }

    const getObjectifs = () =>{
        let requestUri = `${API_URIS.objectifApiUri}/?page=${activePage}&size=${itemsPerPage}`;
        if(employee){
            requestUri = `${requestUri}&employeeId.equals=${employee.id}`;
                /* if(categorie){
                    if(categorie === ObjectifCategorie.INDIVIDUAL)
                        requestUri = `${requestUri}&employeeId.equals=${employee.id}`;
                    else if(categorie === ObjectifCategorie.FONCTIONAL && employee && employee.fonction)
                        requestUri = `${requestUri}&fonctionId'=${employee.fonction.id}`;
                    else if(categorie === ObjectifCategorie.COLLECTIVE && employee && employee.department)
                        requestUri = `${requestUri}&departmentId'=${employee.department.id}`;
                } */

            if(endDate){
                // normalize data
                const sDate = startDate ? startDate <= endDate ? startDate : endDate : getStartDateFromEndDate();
                const eDate = sDate > endDate ? sDate : endDate;
                requestUri = `${requestUri}&createdAt.greaterOrEqualThan=${sDate.toISOString()}&createdAt.lessOrEqualThan=${eDate.toISOString()}`;
            }

            setLoading(true);
            axios.get<IObjectif[]>(requestUri).then(res =>{
                setObjectifs([...res.data]);
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false));
        }else{
            setLoading(false);
        }
    }

    useEffect(() =>{
        props.getEmployees();
        if(!props.account)
            props.getSession();
        const params = new URLSearchParams(props.location.search);
        const empId = params.get('emp');
        if(empId){
            setEmployee(props.employees.find(emp => emp.id.toString() === empId.toString()));
        }
        const cat = params.get('cat');
        if(cat){
            if(cat.toString().toLocaleLowerCase().startsWith('c'))
                setCategorie(ObjectifCategorie.COLLECTIVE);
            else if(cat.toString().toLocaleLowerCase().startsWith('i'))
                setCategorie(ObjectifCategorie.INDIVIDUAL);
            else
                setCategorie(ObjectifCategorie.FONCTIONAL);
        }else{
            if(empId)
                setCategorie(ObjectifCategorie.INDIVIDUAL);
            else
                setCategorie(ObjectifCategorie.FONCTIONAL);
        }
    }, []); 

    useEffect(() =>{
        if(props.account && props.account.id)
            props.getUserExtra(props.account.id);
    }, [props.account])

    useEffect(() =>{
        loadConnectedEmployee();
    }, [props.userExtraEntity])

    useEffect(() =>{
        getObjectifs();
    }, [activePage, itemsPerPage, employee, startDate, endDate])
    
    const handleComboChange = (e, selectedEmp: IEmployee) => {
        if(selectedEmp){
            setEmployee(props.employees.find(emp => emp.id === selectedEmp.id));
            setAutoComplteInputValue(`${selectedEmp.firstName} ${selectedEmp.lastName}`)
        }else{
            setEmployee(null);
        }
        setActivePage(0);
    }

    const handleChangeCategorie = (e) => {
        setCategorie(e.target.value);
        setActivePage(0);
    };

    const handleChangeStartDate = (date) => setStartDate(date);

    const handleChangeEndDate = (date) => setEndDate(date);

    const handleChangePage = (e, newPage) => setActivePage(newPage);

    const handleChangeItemsPerPage = (e) => setItemsPerPage(parseInt(e.target.value, 10));

    const classes = useStyles();

    return (<React.Fragment> 
            <Helmet>
                <title>Cperf | Indicators </title>
            </Helmet>
            <Card className={classes.card}>
                <CardHeader 
                     classes={{ root: classes.cardHeader, subheader: classes.subheader }}
                     title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <FontAwesomeIcon icon={faChartPie} className="mr-3"/>
                            <Box display="flex-inline">
                                <Typography variant="h4">
                                    <Translate contentKey="microgatewayApp.objectif.home.title">Objectifs</Translate>
                                    <Remove fontSize="small" />
                                    <Translate contentKey="microgatewayApp.indicator.home.title">Indicators</Translate>
                                </Typography>
                            </Box>
                            <Box display="inline-flex" flexGrow={1}>
                                <Autocomplete size="small"
                                    id="employees-combo" fullWidth
                                    inputValue ={autoComplteIputValue}
                                    options={[...props.employees]}
                                    getOptionLabel={(option) => option.firstName+ ' '+option.lastName}
                                    onChange={handleComboChange}
                                    onInputChange={(event, newInputValue) => {
                                        setAutoComplteInputValue(newInputValue);
                                    }}
                                    renderInput={(params) => <TextField className={classes.headerInput}
                                        {...params} placeholder={`${translate("_global.label.searchAndChooseEmp")} ...`} variant="standard" />}
                                    classes={{ 
                                        root: 'mr-2 ml-3 mt-1',
                                        clearIndicator: classes.clearIndicator, 
                                        popupIndicator: classes.popupIndicator,
                                    }}
                                    />
                            </Box>
                            {/* employee && <div className="d-inline-block">
                                <Select value={categorie ? categorie : ObjectifCategorie.INDIVIDUAL} className={classes.categorieSelect}
                                    onChange={handleChangeCategorie}
                                    label={<Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate>}
                                    inputProps={{
                                        classes:{
                                            icon:classes.categorieSelectIcon
                                        }
                                    }}>
                                    <MenuItem value={ObjectifCategorie.FONCTIONAL}>
                                        <Translate contentKey="microgatewayApp.ObjectifCategorie.FONCTIONAL">FONCTIONAL</Translate>
                                    </MenuItem>
                                    <MenuItem value={ObjectifCategorie.COLLECTIVE}>
                                        <Translate contentKey="microgatewayApp.ObjectifCategorie.COLLECTIVE">Collective</Translate>
                                    </MenuItem>
                                    <MenuItem value={ObjectifCategorie.INDIVIDUAL}>
                                        <Translate contentKey="microgatewayApp.ObjectifCategorie.INDIVIDUAL">INDIVIDUAL</Translate>
                                    </MenuItem>
                                </Select>
                            </div>
                                */}
                            <Box display="inline-flex">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        value={startDate ? startDate : getStartDateFromEndDate() ? getStartDateFromEndDate() : new Date()}
                                        onChange={handleChangeStartDate}
                                        className={ classes.headerInput + ' mr-2' }
                                        InputAdornmentProps={{
                                            className: classes.datePickerAndornment,
                                        }}
                                    />
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        value={endDate ? endDate : new Date()}
                                        onChange={handleChangeEndDate}
                                        className={ classes.headerInput }
                                        InputAdornmentProps={{
                                            className: classes.datePickerAndornment,
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Box>
                        </Box>
                        }
                        subheader={
                        <Box display="flex" justifyContent="space-between" alignContent="center">
                            {/* <Box display="inline-flex" flexGrow={1}>
                                <Autocomplete size="small"
                                    id="employees-combo" fullWidth
                                    inputValue ={autoComplteIputValue}
                                    options={[...props.employees]}
                                    getOptionLabel={(option) => option.firstName+ ' '+option.lastName}
                                    onChange={handleComboChange}
                                    onInputChange={(event, newInputValue) => {
                                        setAutoComplteInputValue(newInputValue);
                                    }}
                                    renderInput={(params) => <TextField className={classes.headerInput}
                                        {...params} placeholder={`${translate("_global.label.searchAndChooseEmp")} ...`} variant="standard" />}
                                    classes={{ 
                                        root: 'mt-2',
                                        clearIndicator: classes.clearIndicator, 
                                        popupIndicator: classes.popupIndicator,
                                    }}
                                    />
                                </Box> */}
                        </Box> }/>
                <CardContent className={classes.cardContent}>
                    {loading && <Box display="flex" justifyContent="center">Loaging...</Box>}
                    {!loading && objectifs && objectifs.length>0 &&
                         <Grid container alignContent="center" justify="center" spacing={4}>
                            {objectifs.map(objectif =>(
                                <React.Fragment key={objectif.id}>
                                    <Grid item xs={12} md={6} xl={4}>
                                        <Card>
                                            <CardHeader title={
                                                <React.Fragment>
                                                    {<Translate contentKey="microgatewayApp.objectif.detail.title">Objectif</Translate>}
                                                    &nbsp;:&nbsp;{objectif.name}
                                                </React.Fragment>
                                            }
                                            titleTypographyProps={{ variant: 'h5' }}/>
                                            <CardContent style={{ textAlign: "center", overflow:'auto', }}>
                                                <ObjectifIndidicators objectif={objectif} />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>}
                        {!loading && (!objectifs || !objectifs.length) && <Box textAlign="center" p={3}>
                                <Typography className="text-info" variant="h5">
                                    <Translate contentKey="microgatewayApp.objectif.home.notFound">No Objectifs found</Translate>
                                </Typography>
                        </Box>}
                </CardContent>
               {totalItems > 0 &&
                <CardActions color="primary" className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={totalItems}
                    page={activePage}
                    onPageChange={handleChangePage}
                    rowsPerPage={itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemsPerPage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                    classes={{ 
                        root: classes.pagination,
                        input: classes.paginationInput,
                        selectIcon: classes.paginationSelectIcon,
                  }}/>
                </CardActions>
              }
            </Card>
    </React.Fragment>)
}

const mapStateToProps = ({ employee, authentication, userExtra }: IRootState) => ({
  employees: employee.entities,
  account: authentication.account,
  userExtraEntity: userExtra.entity,
});

const mapDispatchToProps = {
  getEmployees, getUserExtra, getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ObjectifIndicator)