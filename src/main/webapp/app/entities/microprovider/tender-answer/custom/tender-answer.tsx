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
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { Box, Card, CardActions, CardContent, CardHeader, Collapse, Divider, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import TenderAnswerDoc from "./tender-answer-doc";
import EvaluationGrid from "../../provider-evaluation/custom/evaluation-grid";
import { ITenderProviderSelection } from "app/shared/model/microprovider/tender-provider-selection.model";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import TenderAnswerSelectionExecutionTools from "./tender-answer-selection-execution-tools";
import clsx from "clsx";
import PartenerVisualizer from "app/entities/micropartener/partener/custom/partener-visualizer";
import TenderQnswerQuestionnaireValuesPisualizer from "./tender-answer-questionnaire-values-visualizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";

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
        maxHeight:25,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
    paginationBox:{
        borderTop: 'none',
        paddingTop:0,
        paddingBottom:0,
    },
    pagination:{
     padding:0,
     color: theme.palette.primary.dark,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
}))

const TenderAnswerRowItem = (props: {
    answer: ITenderAnswer,
    account: any, 
    onSelectChange?:Function, 
    onAnswerChange?:Function,
    selected?: ITenderAnswer,
 }) =>{
    const { account } = props
    const [answer, setAnswer] = useState(props.answer)
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState<IPartener>(null);
    const [providerLoading, setProviderLoading] = useState(false);
    const [openDocs, setOpenDocs] = useState(false)
    const [category, setCategory] = useState<IPartenerCategory>({});
    const [openEvaluation, setOpenEvaluation] = useState(false)
    const [openQResponses, setOpenQresponses] = useState(false);
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

    const getProvider = () =>{
        if(answer && answer.providerId){
            setProviderLoading(true);
            axios.get<IPartener>(`${API_URIS.partenerApiUri}/${answer.providerId}`)
                .then(res =>{
                    setProvider(res.data);
                }).catch(e => console.log(e))
                .finally(() => setProviderLoading(false))
        }
    }
    
    useEffect(() =>{
        setAnswer(props.answer);
        getProvider();
        // getFields();
        getCategory();
    }, [props.answer])


    useEffect(() =>{
        getSelection();
    }, [provider])


    const providerName = provider ? provider.name || provider.email : '...';

    const formatExecutionDelay = () =>{
        if(!answer.executionDeley){
            if(!answer.tender || !answer.tender.executionDeleyRequired)
                return translate("_global.label.notRequested")
            return translate("_global.label.unspecified")
        }
        return `${answer.executionDeley} ${translate(`_global.deleyUnit.${answer.executionDeleyUnity ? answer.executionDeleyUnity.toString(): "DAY"}`)}(s)`;
    }

    const handleUpdateSelection = (status?: boolean) =>{
        props.onSelectChange(status ? answer : null)
    }

    const handleAnswerChange = (newAnswer?: ITenderAnswer) =>{
        if(newAnswer){
            setAnswer(newAnswer);
            if(props.onAnswerChange)
                props.onAnswerChange(newAnswer);
        }
    }

    const handleExecutionAverageChange = (newAverage) => setAnswer({...answer, executionAverage: newAverage});

    const average = (answer && answer.average )? `${answer.average.toFixed(2)}/${(category && category.noteMax) ? category.noteMax : 20}`: 'N/A';

    const getNotePurcentage = (note: number) =>{
        if(note){
            const noteMax = (category && category.noteMax) ? category.noteMax : 20;
            return (note * 100)/noteMax;
        }
        return 0;
    }

    return (
        <React.Fragment>
            <TenderAnswerDoc answer={answer} open={openDocs} onClose={() => setOpenDocs(false)}/>
            {answer && 
                <>
                <EvaluationGrid answer={answer} open={openEvaluation} account={account}
                    onClose={() => setOpenEvaluation(false)}
                    readonly={answer.finishedAt ? true: false}
                    onAnswerChange={handleAnswerChange}
                    />
                    <TenderQnswerQuestionnaireValuesPisualizer 
                        answer={answer} open={openQResponses} 
                        onClose={() => setOpenQresponses(false)} />
                </>
            }
            <TableRow>
                <TableCell>
                    {providerLoading ? (
                        <Typography variant="caption">Loading...</Typography>
                    ):(
                        <PartenerVisualizer id={provider ? provider.id : null} />
                    )}
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center">
                        <MyCustomPureHtmlRender 
                            body={answer.content} 
                            renderInSpan className={classes.truncate}/>
                        <IconButton 
                            color="primary"
                            className="ml-3"
                            size="small"
                            onClick={() => setOpen(!open)}>
                                {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </Box>
                </TableCell>
                <TableCell align="center"> 
                    <IconButton 
                        color="primary"
                        className="ml-3"
                        size="small"
                        title={translate("entity.action.view")}
                        onClick={() => setOpenDocs(true)}>
                            <Visibility /> 
                    </IconButton>
                </TableCell>
                <TableCell align="center"> 
                    <IconButton 
                        color="primary"
                        className="ml-3"
                        size="small"
                        title={translate("entity.action.view")}
                        onClick={() => setOpenQresponses(true)}>
                            <Visibility /> 
                    </IconButton>
                </TableCell>
                <TableCell align="center"> 
                    <Typography className="text-lowercase">{formatExecutionDelay()}</Typography>
                </TableCell>
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
                <TableCell align="center">
                    <TenderAnswerSelectionExecutionTools
                        account={account}
                        answer={answer}
                        selectedAnswer={props.selected}
                        provider={provider}
                        providerName={providerName}
                        onExecutionAverageChange={handleExecutionAverageChange}
                        onSelectChange={handleUpdateSelection}
                     />
                </TableCell>
                <TableCell align="center">
                        {answer && answer.executionAverage ? (
                            <Typography variant="h5">
                                <span className={clsx("badge", {
                                    'badge-success': getNotePurcentage(answer.executionAverage)>75,
                                    'badge-warning': getNotePurcentage(answer.executionAverage)>=50 && getNotePurcentage(answer.executionAverage)<=75,
                                    'badge-danger': getNotePurcentage(answer.executionAverage)<50,
                                })}>
                                    {answer.executionAverage}
                                </span>
                            </Typography>
                        ): (
                             'N/A'
                        )}
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
                                    <MyCustomPureHtmlRender body={answer.content} renderInSpan />
                                </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

interface TenderAnswerProps extends StateProps, DispatchProps, RouteComponentProps<{tenderId: string}>{}

export const TenderAnswer = (props: TenderAnswerProps) =>{
    const { account } = props;
    const [tender, setTender] = useState<ITender>(null);
    const [answers, setAnswers] = useState<ITenderAnswer[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [selected, setSelected] = useState<ITenderAnswer>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false)
    const classes = useStyles();

    const getSelected = () =>{
        if(tender){
            let requestUri = `${API_URIS.tenderProviderSelectionApiUri}/?tenderId.equals=${tender.id}`;
            requestUri = `${requestUri}&page=${0}&size=${1}`;
            axios.get<ITenderProviderSelection[]>(requestUri)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        //  finding selected Answer
                        requestUri = `${API_URIS.tenderAnswerApiUir}/?providerId.equals=${res.data[0].providerId}`;
                        requestUri = `${requestUri}&tenderId.equals=${tender.id}&page=${0}&size=${1}`;
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

    const getAnswers = (pge?: number) =>{
        if(tender){
            const p = pge || activePage;
            setLoading(true)
            let requestUri = `${API_URIS.tenderAnswerApiUir}/?tenderId.equals=${tender.id}`;
            requestUri = `${requestUri}&page=${p}&size=${itemsPerPage}&sort=average,asc`;
            axios.get<ITenderAnswer[]>(requestUri)
                .then(res => {
                    setAnswers([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }else{
            setAnswers([])
        }
    }

    const getTender = () =>{
        if(props.match.params.tenderId){
            setLoading(true);
            axios.get<ITender>(`${API_URIS.tenderApiUri}/${Number(props.match.params.tenderId)}`)
                .then(res =>{
                    setTender(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
        getTender();
    }, [])

    useEffect(() =>{
        getSelected();
        getAnswers();
    }, [tender])


    const handleSelectionChange = (newSelected?: ITenderAnswer) =>{
        setSelected(newSelected)
    }
    
    const handleAnswerChange = (changed?: ITenderAnswer) =>{
        if(changed){
            setAnswers([...answers].map(a => a.id === changed.id ? changed : a))
        }
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getAnswers(newPage)
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
                    selected={selected}
                    onSelectChange={handleSelectionChange} 
                    onAnswerChange={handleAnswerChange}/>
            )
        }
    )
    const handleBack = () =>{
        props.history.push('/tender');
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("_global.label.callTender")}`}</title>
            </Helmet>
            <Box width={1} display="flex" flexWrap="wrap" overflow="auto" boxShadow="-1px -1px 7px">
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" alignItems="center">
                        <IconButton aria-label="back" 
                          title="go to back"
                          color="inherit"
                           onClick={handleBack}>
                           <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                        </IconButton>
                         <Typography variant="h4" color="inherit">
                             {translate("_global.label.submition")+'s'}
                        </Typography>
                        </Box>
                        }
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Table>
                            <TableHead>
                                <TableRow className={classes.theadRow}>
                                    <TableCell>{translate("_global.label.provider")+'s'}</TableCell>
                                    <TableCell align="center">
                                        {translate("microgatewayApp.microproviderTenderAnswer.content")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {translate("_tender.responseDocs")}
                                    </TableCell>
                                    <TableCell align="center">
                                        Questionnaire
                                    </TableCell>
                                    <TableCell align="center">
                                        {translate("microgatewayApp.microproviderTenderAnswer.executionDeley")}
                                    </TableCell>
                                    <TableCell align="center" className="text-capitalize">
                                        {translate("_global.label.evaluation")}
                                    </TableCell>
                                    <TableCell align="center" className="text-capitalize">
                                        {translate("microgatewayApp.microproviderTenderAnswer.average")}
                                    </TableCell>
                                    <TableCell align="center" className="text-capitalize">
                                        {`${translate("_global.label.selection")} & ${translate("_global.label.execution")}`}
                                    </TableCell>
                                    <TableCell align="center" className="">
                                        {translate("microgatewayApp.microproviderTenderAnswer.executionAverage")}
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
                    <CardActions className={classes.paginationBox}>
                        <TablePagination className={answers && answers.length > 0 ? '' : 'd-none'}
                            component="div"
                            count={totalItems}
                            page={activePage}
                            onPageChange={handleChangePage}
                            rowsPerPage={itemsPerPage}
                            onChangeRowsPerPage={() =>{}}
                            rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                            labelRowsPerPage=""
                            labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, itemsPerPage)}`}
                            classes={{ 
                                root: classes.pagination,
                                input: classes.paginationInput,
                                selectIcon: classes.paginationSelectIcon,
                        }}/>
                    </CardActions>
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderAnswer);