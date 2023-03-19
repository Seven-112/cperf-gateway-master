import { Box, CircularProgress, Collapse, Divider, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core"
import { ITender } from "app/shared/model/microprovider/tender.model";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React from "react"
import { useEffect } from "react";
import { useState } from "react";
import { TextFormat, translate } from "react-jhipster";
import axios from 'axios'
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import TenderUpdate from "./tender-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { ITenderFile } from "app/shared/model/microprovider/tender-file.model";
import { TenderFile } from "app/entities/microprovider/tender-file/custom/tender-file";
import TenderReplay from "./tender-replay";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import TenderFieldList from "./tender-field-list";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";

const useStyles = makeStyles(theme =>({
    truncate:{
        maxWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    paginationBox:{
        border: `1px  solid ${theme.palette.primary.main}`,
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

const ProviderTenderRowItem = (props:{tender: ITender, provider:IPartener, onUpdate?:Function, onDelete?:Function}) =>{
    const { tender, provider } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [answer, setAnswer] = useState<ITenderAnswer>(null);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [openTenderFields, setOpenTenderFields] = useState(false);
    const [filesSize, setFilesSize] = useState(0);
    const [loadingFilesSize, setLoadingFilesSize] = useState(false);
    const [openFiles, setOpenFiles] = useState(false);
    const [openReplay, setOpenReplay] = useState(false);

    const getAnswer = () =>{
        if(tender && tender.id && provider && provider.id){
            setLoadingAnswers(true)
            let requestUri = `${API_URIS.tenderAnswerApiUir}/?tenderId.equals=${tender.id}&providerId.equals=${provider.id}`;
            requestUri = `${requestUri}&page=${0}&size=${1}`;
            axios.get<ITenderAnswer[]>(requestUri)
            .then(res => {
                if(res.data && res.data.length){
                    setAnswer(res.data[0])
                }else{
                    setAnswer({providerId: provider.id, tender})
                }
            })
            .catch(e => console.log(e)).finally(() => setLoadingAnswers(false))
        }
    }

    const countFiles = () =>{
        if(tender && tender.id && serviceIsOnline(SetupService.FILEMANAGER)){
            setLoadingFilesSize(true)
            let requestUri = `${API_URIS.mshzFileApiUri}/?entityId.equals=${tender.id}`;
            requestUri = `${requestUri}&entityTagName.equals=${FileEntityTag.tender}&page=${0}&size=${1}`
            axios.get<IMshzFile[]>(requestUri)
            .then(res => setFilesSize(parseInt(res.headers['x-total-count'],10)))
            .catch(e => console.log(e)).finally(() => setLoadingFilesSize(false))
        }
    }

    useEffect(() =>{
        countFiles();
    }, [props.tender])

    useEffect(() =>{
        getAnswer();
    }, [props.provider])

    const isExpired = tender ? (tender.expireAt && (new Date()) > convertDateTimeToServer(tender.expireAt)) : true;

    const handleOpenTenderFields = () => setOpenTenderFields(true);
    const handleCloseTenderFields = () => setOpenTenderFields(false);

    const handleCloseFiles = (fSize?: number) => {
        if(fSize || fSize === 0)
            setFilesSize(fSize);
        setOpenFiles(false)
    }
   
    const handleCloseAnswer = () => setOpenReplay(false);

    const handleSaveAnswer = (saved?: ITenderAnswer, isNew?:boolean) =>{
        if(saved)
            setAnswer(saved)
    }

    return (
        <React.Fragment>
            {tender && <TenderFieldList tender={tender} locked={true} open={openTenderFields} onClose={handleCloseTenderFields}/>}
            {tender && <TenderFile tender={tender} open={openFiles} onClose={handleCloseFiles} readonly/>}
            {answer && <TenderReplay answer={answer} open={openReplay} onClose={handleCloseAnswer} onSave={handleSaveAnswer}  />}
            <TableRow>
                <TableCell>
                    <Typography display="block" className={classes.truncate}>{tender.object || ''}</Typography>
                    {tender.object && <IconButton 
                        color="primary"
                        className="ml-3"
                        size="small"
                        onClick={() => setOpen(!open)}>
                            {open ? <Visibility /> : <VisibilityOff />}
                    </IconButton>}
                </TableCell>
                <TableCell align="center">
                    <Box width={1}
                         display="flex" 
                         alignItems="flex-end" 
                         justifyContent="center">
                        <MyCustomPureHtmlRender 
                             className={classes.truncate}
                             body={tender.content} renderInSpan/>
                       {tender.content && <IconButton 
                            color="primary"
                            className="ml-3 p-0"
                            size="small"
                            onClick={() => setOpen(!open)}>
                                {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton>}
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                        <Typography className="mr-2">{filesSize || ''}</Typography>
                        {filesSize ? (
                            <IconButton
                                color="primary" 
                                className="mr-2"
                                onClick={() => setOpenFiles(true)}>
                                <Visibility />
                            </IconButton>
                        ):(
                            "..."
                        )}
                        {loadingFilesSize && <CircularProgress style={{width:15, height:15}}/>}
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <IconButton
                        color="primary" 
                        className="mr-2"
                        onClick={handleOpenTenderFields}>
                        <Visibility />
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <Box display="flex" flexDirection="column" justifyContent="center" flexWrap="wrap" alignItems="center">
                        {tender.expireAt ? (
                            <TextFormat type="date"
                            value={convertDateTimeToServer(tender.expireAt)}
                            format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                        ): '...'}
                        {isExpired && <Typography variant="body2">
                            <span className="badge badge-danger badge-sm">
                                {translate("_tender.expired")}
                            </span>
                        </Typography>}
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                    {answer && answer.id && <IconButton
                        color="primary" 
                        className="mr-2"
                        onClick={() => setOpenReplay(true)}
                        >
                        <Visibility />
                    </IconButton> }
                    {(!isExpired  && (!answer || !answer.id) && provider && tender.published) && <Tooltip 
                            title={translate("_global.label.replay")}
                            onClick={() => setOpenReplay(true)}>
                            <IconButton color="primary">
                                <FontAwesomeIcon icon={faReply} />
                            </IconButton>
                        </Tooltip>}
                    {(isExpired && (!answer || (answer && !answer.id))) &&
                         <Typography variant="body1"><span className="badge badge-warning">{translate("_tender.noAnswer")}</span></Typography>}
                    {loadingAnswers && <CircularProgress style={{width:15, height:15, marginLeft: 3,}}/>}
                    </Box>
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
                                    <Box width={1}>
                                        <Typography>{tender.object || ''}</Typography>
                                    </Box>
                                    <Typography variant="h3" color="secondary">
                                        {translate("microgatewayApp.microproviderTender.content")}
                                    </Typography>
                                    <Divider  className="mb-2"/>
                                    <Typography>
                                        <MyCustomPureHtmlRender body={tender.content} renderInSpan/>
                                    </Typography>
                                </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

interface ProviderTenderProps{
    userId: any
}

export const ProviderTender = (props: ProviderTenderProps) =>{
    const [userId, setUserId] = useState(props.userId);
    const [tenders, setTenders] = useState<ITender[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemPerPage] = useState(ITEMS_PER_PAGE);
    const [tender, setTender] = useState<ITender>(null);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [tenderDocsLocked, setTenderDocsLocked] = useState(false);
    const [provider, setProvider] = useState<IPartener>(null)

    const classes = useStyles();

    const getTenders = (p?:IPartener, pge?: number) =>{
        const _porvider = p || provider;
        const page = (pge || pge === 0) ? p : activePage;
        if(_porvider){
            setLoading(true)
            let requestUri = `${API_URIS.tenderApiUri}/provider/?providerId=${_porvider.id}&providerEmail=${_porvider.email}`;
            requestUri = `${requestUri}&categoryId=${_porvider.category.id}&page=${page}&size=${itemsPerPage}&sort=id,desc`;
            axios.get<ITender[]>(requestUri)
                .then(res =>{
                    if(res.data){
                        setTenders([...res.data]);
                        setTotalItems(parseInt(res.headers["x-total-count"],10))
                    }
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const getProvider = () =>{
        if(userId){
            setLoading(true)
            axios.get<IPartener[]>(`${API_URIS.partenerApiUri}/?userId.equals=${userId}`)
                .then(res =>{
                    console.log("errr", res);
                    if(res.data && res.data.length){
                        setProvider(res.data[0]);
                        if(!tenders || tenders.length <= 0)
                            getTenders(res.data[0]);
                    }
                }).catch(e => {
                    console.log(e)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    useEffect(() =>{
        setUserId(props.userId);
        getProvider();
    }, [props.userId])

    const handleClose = () => {
        setTender(null)
        setOpen(false)
    };


    const handleUpdate = (td?: ITender, locked?: boolean) =>{
        setTender(td || null);
        setTenderDocsLocked(locked);
        setOpen(true);
    } 

    const handleSave = (saved?: ITender, isNew?:boolean) =>{
        if(saved){
            if(isNew)
                setTenders([saved, ...tenders]);
            else
                setTenders(tenders.map(t => t.id === saved.id ? saved : t));
        }
    }
  
    const hadleDeleting = (td?:ITender) =>{
        setTender(td);
        setOpenDeleteModal(true);
    }

    const handleDelete = (deletedId?: any) =>{
        if(deletedId){
            setTenders(tenders.filter(td => td.id !== deletedId))
            setTender(null);
        }
        setOpenDeleteModal(false);
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getTenders(null, newPage)
      }

    const items = tenders.map(t => (<ProviderTenderRowItem key={t.id}
                         tender={t} provider={provider} onUpdate={handleUpdate} onDelete={hadleDeleting}/>))

    return (
        <React.Fragment>
            <TenderUpdate open={open} tender={tender} onSave={handleSave} onClose={handleClose} locked={tenderDocsLocked}/>
            {tender && <EntityDeleterModal 
                    open={openDeleteModal}
                    entityId={tender.id}
                    urlWithoutEntityId={API_URIS.tenderApiUri}
                    onClose={() => setOpenDeleteModal(false)}
                    onDelete={handleDelete}
                    question={translate("microgatewayApp.microproviderTender.delete.question", {id: ""})}
            />}
            <Box width={1}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.theadRow}>
                            <TableCell>{translate("microgatewayApp.microproviderTender.object")}</TableCell>
                            <TableCell align="center">{translate("microgatewayApp.microproviderTender.content")}</TableCell>
                            <TableCell align="center">{translate("_tender.files")}</TableCell>
                            <TableCell align="center">Questionaire</TableCell>
                            <TableCell align="center">{translate("microgatewayApp.microproviderTender.expireAt")}</TableCell>
                            <TableCell align="center">{translate("_global.label.response")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Typography variant="h5" color="primary">Loading...</Typography>
                                </TableCell>
                            </TableRow>
                        ): (
                            <>
                                {items}
                                {!tenders || tenders.length <= 0 &&
                                    <TableRow>
                                        <TableCell align="center" colSpan={10}>
                                            <Typography variant="h5">
                                                {translate("microgatewayApp.microproviderTender.home.notFound")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }
                            </>
                        )}
                    </TableBody>
                </Table>
            </Box>
        {totalItems > 0 && getTotalPages(totalItems, itemsPerPage) > 1 &&
            <Box width={1} className={classes.paginationBox} 
                borderRadius={10} boxShadow={7} mt={2}>
                <TablePagination className={tenders && tenders.length > 0 ? '' : 'd-none'}
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
            </Box>}
        </React.Fragment>
    )
}

export default ProviderTender;

