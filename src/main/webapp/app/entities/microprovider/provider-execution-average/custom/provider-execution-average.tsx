import { IProviderExecutionAverage } from "app/shared/model/microprovider/provider-execution-average.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { IProviderExecutionAverageProjection } from "app/shared/model/microprovider/projection/provider-execution-average-projection";
import { API_URIS } from "app/shared/util/helpers";
import { Box, Card, CardContent, CardHeader, Collapse, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Helmet } from 'react-helmet';
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { translate, Translate } from "react-jhipster";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { convertDateFromServer } from "app/shared/util/date-utils";
import PartenerVisualizer from "app/entities/micropartener/partener/custom/partener-visualizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    card:{
    },
    cardHeader: {
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
    },
    avatar: {
    },
    cardContent:{
  
    },
  date: { 
      background: 'white !important',
      borderRadius: '7px',
      maxWidth: 170,

  },
  }));

  const sorting = (a:IProviderExecutionAverageProjection, b:IProviderExecutionAverageProjection) =>{
          if(a && b && a.average && b.average){
              return b.average - a.average;
          }
      return 0;
  }

const ProviderExecutionAverageRowItem = (props: { entity: IProviderExecutionAverageProjection }) =>{
    const { entity } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            {entity && <>
                <TableRow>
                    <TableCell style={{width: 3}}>
                        <IconButton onClick={() => setOpen(!open)}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" className="font-weight-bold">
                            <PartenerVisualizer id={entity.providerId} />
                        </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="body2" className="font-weight-bold">
                            {entity.average ? `${entity.average.toFixed(2)}/20` : 'N/A'}
                        </Typography>
                    </TableCell>
                </TableRow>
                {(entity.executionAverages && entity.executionAverages.length !== 0 )&& 
                    <TableRow>
                    <TableCell colSpan={10} className="border-0 m-0 p-0">
                            <Collapse in={open}
                                unmountOnExit
                                timeout={300}>
                                        <Box width="98%" display="flex" flexDirection="column" 
                                            flexWrap="wrap" overflow="auto"
                                            boxShadow={5} borderRadius={7} m={1} p={3} pt={0} pb={0}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography color="secondary">
                                                                {translate("microgatewayApp.microproviderTender.detail.title")}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography color="secondary">
                                                            {translate("_tender.executionAverage")}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {entity.executionAverages
                                                        .sort((a, b) => sorting(a,b)).map((item, index) =>(
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {(item.answer && item.answer.tender) ?
                                                                        item.answer.tender.object || ''
                                                                        : '...'
                                                                    }
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {entity.average ? `${item.average.toFixed(2)}` : 'N/A'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>

                                                </Table>
                                        </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                }
            </>}
        </React.Fragment>
    )
}

export const ProviderExecutionAverage = (props) =>{
    const [minDate, setMinDate] = useState(new Date());
    const  [maxDate, setMaxDate] = useState(new Date());
    const [data, setData] = useState<IProviderExecutionAverage[]>([]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();
    
    const getData = (dateMin?: Date, dateMax?: Date) =>{
        let d1 = dateMin ? dateMin : minDate || new Date();
        let d2 = dateMax ? dateMax : maxDate || new Date();
        if(d1 > d2){
            const d = d2;
            d2 = d1;
            d1 = d;
            setMinDate(d1);
            setMaxDate(d2);
        }
        console.log(d1, d2);
        let requestUri = `${API_URIS.providerExecutionAverageApiUri}/interval/`;
        requestUri = `${requestUri}?dateMin=${convertDateFromServer(d1)}&dateMax=${convertDateFromServer(d2)}`;
        setLoading(true);
        axios.get<IProviderExecutionAverageProjection[]>(requestUri)
            .then(res => {
                if(res.data)
                    setData([...res.data])
            }).catch(e => console.log(e)).finally(() => setLoading(false))
    }

    useEffect(() =>{
        getData();
    }, [])

    const handleChangeMinDate = (date?: Date) =>{
        setMinDate(date);
        getData(date);
    }
    const handleChangeMaxDate = (date?: Date) =>{
        setMaxDate(date);
        getData(minDate, date);
    }

    const items = [...data]
        .sort((a, b) => sorting(a,b))
        .map((item, index) => (
            <ProviderExecutionAverageRowItem key={index} entity={item} />
        ));

    return (
    <React.Fragment>
        <Helmet><title>Cperf | {`${translate("microgatewayApp.microproviderProviderExecutionAverage.home.title")}`}</title></Helmet>
        <Box width={1} m={0} overflow="auto" boxShadow="-1px -1px 7px">
            <Card className={classes.card}>
                <CardHeader 
                    avatar={
                            <FontAwesomeIcon icon={faTachometerAlt} size="2x"/>
                    }
                    action={
                        <Box display="flex" justifyItems="center" flexWrap="wrap" m={0} mt={1}>
                            <KeyboardDatePicker 
                                value={minDate}
                                onChange={handleChangeMinDate}
                                format="dd/MM/yyyy"
                                disableToolbar
                                variant="inline"
                                autoOk
                                inputVariant="standard"
                                size="small"
                                label={translate("_global.label.dateMin")}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputAdornmentProps={{
                                    style: { margin: 0}
                                }}
                                className={classes.date}
                            />
                            <KeyboardDatePicker 
                                value={maxDate}
                                onChange={handleChangeMaxDate}
                                format="dd/MM/yyyy"
                                disableToolbar
                                variant="inline"
                                autoOk
                                inputVariant="standard"
                                size="small"
                                label={translate("_global.label.dateMax")}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputAdornmentProps={{
                                    style: { margin: 0}
                                }}
                                className={classes.date + ' ml-3'}
                            />
                        </Box>
                    }
                    title={<Translate contentKey="microgatewayApp.microproviderProviderExecutionAverage.home.title">Execution</Translate>}
                    titleTypographyProps={{ variant: 'h4' }}
                    className={classes.cardHeader}
                />
                <CardContent className={ classes.cardContent}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>
                                    <Typography variant="h5" className="font-weight-bold">
                                        {translate("_global.label.provider")}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h5" className="font-weight-bold">
                                        {translate("_tender.executionAverage")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        <Typography variant="h5" color="primary">Loading...</Typography>
                                    </TableCell>
                            </TableRow>}
                            {items}
                            {(!loading && (!data || data.length === 0)) && <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        <Typography>No data content</Typography>
                                    </TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Box>
    </React.Fragment>
    )
}

export default ProviderExecutionAverage;