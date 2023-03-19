import { IRootState } from "app/shared/reducers";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from "react-redux";
import { useEffect } from "react";
import { Helmet } from 'react-helmet'
import { translate } from "react-jhipster";
import { useState } from "react";
import { ITender } from "app/shared/model/microprovider/tender.model";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Box, Card, CardContent, CardHeader, Collapse, Divider, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { Visibility } from "@material-ui/icons";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";
import EvaluationGrid from "../../provider-evaluation/custom/evaluation-grid";
import { ITenderProviderSelection } from "app/shared/model/microprovider/tender-provider-selection.model";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import clsx from "clsx";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model";
import FieldNameVisualizer from "app/entities/dynamic-field/custom/fields/field-name-visualizer";
import TenderAnswerFieldValueVisualizer from "./tener-answer-field-value-visualize";
import PartenerVisualizer from "app/entities/micropartener/partener/custom/partener-visualizer";

const useStyles = makeStyles(theme =>({
    card:{
        width: '100%',
        background: 'transparent',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
        background: 'white',
        minHeight: theme.spacing(5),
        borderTop: 'none',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    truncate:{
        maxWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
}))

const TenderAnswerRowItem = (props: {
    answer: ITenderAnswer,
    dFileds: IDynamicField[]
    account: any, 
    onSelectChange?:Function, 
    onAnswerChange?:Function,
    selected?: ITenderAnswer,
 }) =>{
    const { account, dFileds } = props
    const [answer, setAnswer] = useState(props.answer)
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState<IPartenerField[]>([])
    const [providerLoading, setProviderLoading] = useState(false);
    const [category, setCategory] = useState<IPartenerCategory>({});
    const [openEvaluation, setOpenEvaluation] = useState(false)
    const classes = useStyles();

    const getCategory = () =>{
        if(answer && answer.tender && answer.tender.targetCategoryId){
            axios.get<IPartener>(`${API_URIS.partenerCategoryApiUri}/${answer.tender.targetCategoryId}`)
                .then(res =>{
                    setCategory(res.data);
                }).catch(e => console.log(e))
        }else{
            setCategory(null)
        }
    }

    const getParetenerFields = () =>{
        if(answer && answer.providerId){
            setProviderLoading(true);
            axios.get<IPartenerField[]>(`${API_URIS.partenerFiledApiUri}/?partenerId.equals=${answer.providerId}`)
                .then(res =>{
                    setFields([...res.data]);
                }).catch(e => console.log(e))
                .finally(() => setProviderLoading(false))
        }
    }
    
    useEffect(() =>{
        setAnswer(props.answer);
        getParetenerFields();
        getCategory();
    }, [props.answer])

    const formatExecutionDelay = () =>{
        if(!answer.executionDeley){
            if(!answer.tender || !answer.tender.executionDeleyRequired)
                return translate("_global.label.notRequested")
            return translate("_global.label.unspecified")
        }
        return `${answer.executionDeley} ${translate(`_global.deleyUnit.${answer.executionDeleyUnity ? answer.executionDeleyUnity.toString(): "DAY"}`)}(s)`;
    }

    const handleAnswerChange = (newAnswer?: ITenderAnswer) =>{
        if(newAnswer){
            setAnswer(newAnswer);
            if(props.onAnswerChange)
                props.onAnswerChange(newAnswer);
        }
    }

    const average = (answer && answer.average )? `${answer.average}/${(category && category.noteMax) ? category.noteMax : 20}`: 'N/A';

    const getNotePurcentage = (note: number) =>{
        if(note){
            const noteMax = (category && category.noteMax) ? category.noteMax : 20;
            return (note * 100)/noteMax;
        }
        return 0;
    }

    return (
        <React.Fragment>
            {answer && 
                <EvaluationGrid answer={answer} open={openEvaluation} account={account}
                    onClose={() => setOpenEvaluation(false)}
                    readonly={answer.finishedAt ? true: false}
                    onAnswerChange={handleAnswerChange}
                    />
            }
            <TableRow>
                <TableCell>
                    {providerLoading ? (
                        <Typography variant="caption">Loading...</Typography>
                    ):(
                        <Typography>{<PartenerVisualizer id={answer ? answer.providerId : null}/>}</Typography>
                    )}
                </TableCell>
               {/*  <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center">
                        <Typography display="block" className={classes.truncate}>{answer.content || ''}</Typography>
                        <IconButton 
                            color="primary"
                            className="ml-3"
                            size="small"
                            onClick={() => setOpen(!open)}>
                                {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </Box>
                </TableCell> */}
                <TableCell align="center"> 
                    <Typography className="text-lowercase">{formatExecutionDelay()}</Typography>
                </TableCell>
                {[...dFileds].map((df, index) =>(
                    <TableCell key={index} align="center"> 
                        <TenderAnswerFieldValueVisualizer answer={answer} field={df} />
                    </TableCell>
                ))}
                <TableCell align="center"> 
                    <IconButton 
                        color="primary"
                        className="ml-3"
                        size="small"
                        title={translate("entity.action.view")}
                        onClick={() => setOpenEvaluation(true)}>
                            <Visibility /> 
                    </IconButton>
                </TableCell>
                <TableCell align="center"> 
                    {(answer && answer.average) ? (
                        <Typography variant="h4">
                            <span className={clsx("badge", {
                                'badge-success': (answer && getNotePurcentage(answer.average)>75),
                                'badge-warning': (answer && getNotePurcentage(answer.average)>=50 && getNotePurcentage(answer.average)<=75),
                                'badge-danger': (!answer || getNotePurcentage(answer.average)<50),
                            })}>
                                {average}
                            </span>
                        </Typography>
                    ): 'N/A'}
                </TableCell>
            </TableRow>
            <TableRow>
               <TableCell colSpan={10} className="border-0 m-0 p-0">
                    <Collapse in={open}
                        unmountOnExit
                        timeout={300}>
                                <Box width="98%" display="flex" flexDirection="column" 
                                    flexWrap="wrap" overflow="auto"
                                     boxShadow={5} borderRadius={7} m={1} p={3}>
                                    <Typography variant="h3" color="secondary">
                                        {translate("microgatewayApp.microproviderTender.content")}
                                    </Typography>
                                    <Divider  className="mb-2"/>
                                    <Typography>{answer.content }</Typography>
                                </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

interface TenderAnswerFieldProps extends StateProps, DispatchProps, RouteComponentProps<{tenderId: string}>{}

export const TenderAnswerField = (props: TenderAnswerFieldProps) =>{
    const { account } = props;
    const [tender, setTender] = useState<ITender>();
    const [answers, setAnswers] = useState<ITenderAnswer[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [selected, setSelected] = useState<ITenderAnswer>(null);
    const [totlaItems, setTotalItems] = useState(0);
    const [tenderFields, setTenderFields] = useState<IDynamicField[]>([]);
    const [loading, setLoading] = useState(false)
    const classes = useStyles();

    const getSelected = () =>{
        if(props.match.params.tenderId){
            let requestUri = `${API_URIS.tenderProviderSelectionApiUri}/?tenderId.equals=${Number(props.match.params.tenderId)}`;
            requestUri = `${requestUri}&page=${0}&size=${1}`;
            axios.get<ITenderProviderSelection[]>(requestUri)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        //  finding selected Answer
                        requestUri = `${API_URIS.tenderAnswerApiUir}/?providerId.equals=${res.data[0].providerId}`;
                        requestUri = `${requestUri}&page=${0}&size=${1}`;
                        axios.get<ITenderAnswer[]>(requestUri)
                            .then(result => {
                                if(result && result.data.length !== 0)
                                    setSelected(result.data[0]);
                            })
                            .catch(err => console.log(err))
                            .finally(() => setLoading(false))
                    }else{
                        setSelected(null);
                    }
                }).catch(e => console.log(e))
        }else{
            setSelected(null)
        }
    }

    const getAnswers = () =>{
        if(tender){
            setLoading(true)
            let requestUri = `${API_URIS.tenderAnswerApiUir}/?tenderId.equals=${tender.id}`;
            requestUri = `${requestUri}&page=${activePage}&size=${itemsPerPage}&sort=average,asc`;
            axios.get<ITenderAnswer[]>(requestUri)
                .then(res => {
                    setAnswers([...res.data])
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }else{
            setAnswers([])
        }
    }

    const getTenderFields = (tenderId) =>{
        if(tenderId){
            setLoading(true);
            axios.get<IDynamicField[]>(`${API_URIS.dynamicFieldApiUri}/?entityId.equals=${tenderId}&tag.equals=${DynamicFieldTag.TENDER}`)
                .then(res =>{
                    if(res.data)
                        setTenderFields([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    const getTender = () =>{
        setLoading(true);
        axios.get<ITender>(`${API_URIS.tenderApiUri}/${Number(props.match.params.tenderId)}`)
            .then(res =>{
                setTender(res.data);
                if(res.data)
                    getTenderFields(res.data.id)
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
        getSelected();
        getTender();
    }, [])

    useEffect(() =>{
        getAnswers();
    }, [tender,activePage])


    const handleSelectionChange = (newSelected?: ITenderAnswer) =>{
        setSelected(newSelected)
    }
    
    const handleAnswerChange = (changed?: ITenderAnswer) =>{
        if(changed){
            setAnswers([...answers].map(a => a.id === changed.id ? changed : a))
        }
    }

    const sortAnswers = (a?:number, b?:number) =>{
        // asc = négative: desc = positif, normal= 0
        if(!a || !b)
            return 0;
        else if(a > b)
            return -1;
        else 
            return 1;
    }

    const selectedItem = selected ? 
        <TenderAnswerRowItem selected={selected}
            answer={selected} account={account}
            dFileds={[...tenderFields]}
            onSelectChange={handleSelectionChange} 
            onAnswerChange={handleAnswerChange}/>
        : <></>; 

    const unSelectedItems = [...answers]
        .sort((a, b) => sortAnswers(a.average, b.average))
        .map((a, index) =>{
            if(selected && a.id === selected.id)
                return <></>
            return (
                <TenderAnswerRowItem key={index} 
                    answer={a}
                    account={account}
                    dFileds={[...tenderFields]}
                    selected={selected}
                    onSelectChange={handleSelectionChange} 
                    onAnswerChange={handleAnswerChange}/>
            )
        }
    )

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("_global.label.callTender")}`}</title>
            </Helmet>
            <Box width={1} display="flex" flexWrap="wrap" overflow="auto" boxShadow="-1px -1px 7px">
                <Card className={classes.card}>
                    <CardHeader 
                        title={`Questionnaire : ${translate("_global.label.response")+'s'}`}
                        titleTypographyProps={{ variant: 'h4' }}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Table>
                            <TableHead>
                                <TableRow className={classes.theadRow}>
                                    <TableCell>{translate("_global.label.provider")+'s'}</TableCell>
                                    {/* <TableCell align="center">
                                        {translate("microgatewayApp.microproviderTenderAnswer.content")}
                                    </TableCell> */}
                                    <TableCell align="center">
                                        {translate("microgatewayApp.microproviderTenderAnswer.executionDeley")}
                                    </TableCell>
                                    {[...tenderFields].map((f, index) => (
                                        <TableCell key={index} align="center">
                                            <FieldNameVisualizer field={f} typographyProps={{
                                                variant: 'caption'
                                            }}/>
                                        </TableCell>)
                                    )}
                                    <TableCell align="center" className="text-capitalize">
                                        {translate("_global.label.evaluation")}
                                    </TableCell>
                                    <TableCell align="center" className="text-capitalize">
                                        {translate("microgatewayApp.microproviderTenderAnswer.average")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading &&
                                    <TableRow>
                                        <TableCell align="center" colSpan={10}>
                                            <Typography variant="h5" color="primary">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>
                                    }
                                    {selectedItem}
                                    {unSelectedItems}
                                    {!loading && !answers || answers.length <= 0 &&
                                        <TableRow>
                                            <TableCell align="center" colSpan={10}>
                                                <Typography variant="h5">
                                                    {translate("microgatewayApp.microproviderTenderAnswer.home.notFound")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } : IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    getSession
}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswerField);