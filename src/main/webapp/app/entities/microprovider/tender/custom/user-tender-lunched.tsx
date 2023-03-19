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
import { Delete, Edit, Explore, Visibility, VisibilityOff } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faLock } from "@fortawesome/free-solid-svg-icons";
import TenderUpdate from "./tender-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { ITenderFile } from "app/shared/model/microprovider/tender-file.model";
import { TenderFile } from "app/entities/microprovider/tender-file/custom/tender-file";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { useHistory } from "react-router-dom";
import TenderFieldList from "./tender-field-list";
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import TenderPublish from "./tender-publish";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

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

const UserTenderLunchedRowItem = (props:{tender: ITender, onUpdate?:Function, onDelete?:Function, account:any, onPublished?: Function}) =>{
    const { tender,account } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [answerCount, setAnswerCount] = useState(0);
    const [dynamicFieldCount, setDynamicFieldCount] = useState(0);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
    const [openFields, setOpenFields] = useState(false);
    const [filesSize, setFilesSize] = useState(0);
    const [loadingFilesSize, setLoadingFilesSize] = useState(false);
    const [openFiles, setOpenFiles] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const history = useHistory();

    const countAnswers = () =>{
        if(tender && tender.id){
            setLoadingAnswers(true)
            let requestUri = `${API_URIS.tenderAnswerApiUir}/?tenderId.equals=${tender.id}`;
            requestUri = `${requestUri}&page=${0}&size=${1}`;
            axios.get<ITenderAnswer[]>(requestUri)
            .then(res => setAnswerCount(parseInt(res.headers['x-total-count'],10)))
            .catch(e => console.log(e)).finally(() => setLoadingAnswers(false))
        }
    }

    const countDynamicFields = () =>{
        if(tender && tender.id){
            let requestUri = `${API_URIS.dynamicFieldApiUri}/?entityId.equals=${tender.id}&tag.equals=${DynamicFieldTag.TENDER}`;
            requestUri = `${requestUri}&page=${0}&size=${1}`;
            axios.get<IDynamicField[]>(requestUri)
            .then(res => setDynamicFieldCount(parseInt(res.headers['x-total-count'],10)))
            .catch(e => console.log(e)).finally(() => {})
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
        countAnswers();
        countDynamicFields();
        countFiles();
    }, [props.tender])

    const handleOpenFields = () => setOpenFields(true);

    const handlCloseFields = () =>  setOpenFields(false);

    const handleCloseFiles = (fSize?: number) => {
        if(fSize || fSize === 0)
            setFilesSize(fSize);
        setOpenFiles(false)
    }

    const handleUpdate = () =>{
        if(props.onUpdate)
            props.onUpdate(tender, answerCount > 0 ? true : false);
    }

    const handleDelete = () => {
        if(props.onDelete)
            props.onDelete(tender);
    }

    const showResponses = () =>{
        if(answerCount > 0 && tender.id)
            history.push(`/tender/answer/${tender.id}`)
    }

    const openDynamicFieldsResponses = () =>{
        if(answerCount > 0 && tender.id && dynamicFieldCount >0)
            history.push(`/tender/answer-field/${tender.id}`)
    }

    const onPublish = (saved?: ITender) =>{
        if(saved){
            setPublishing(false)
            if(props.onPublished)
                props.onPublished(saved);
        }
    }

    const canUpdate = (account && hasPrivileges({ entities: ["Tender"], actions: [PrivilegeAction.UPDATE]},account.authorities))

    return (
        <React.Fragment>
            {tender && <>
                <TenderFieldList
                    tender={tender}
                    open={openFields}
                    onClose={handlCloseFields}
                    locked={true}
                     />
                 <TenderFile tender={tender} open={openFiles} 
                    onClose={handleCloseFiles} readonly={!canUpdate}/>

                    <TenderPublish open={publishing} tender={tender} 
                        onClose={() => setPublishing(false)} onSave={onPublish}/>
                </>
            }
            <TableRow>
                <TableCell>
                    <Box width={1} display="flex" alignItems="center">
                        <Typography display="block" className={classes.truncate}>{tender.object}</Typography>
                        {tender.object && <IconButton 
                            color="primary"
                            className="ml-3"
                            size="small"
                            title={open ? translate("_global.label.hide") : translate("_global.label.view")}
                            onClick={() => setOpen(!open)}>
                                {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton> }
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" alignItems="flex-start" justifyContent="center">
                        <MyCustomPureHtmlRender 
                            className={classes.truncate} 
                            body={tender.content} renderInSpan
                        />
                        {tender.content && <IconButton 
                            color="primary"
                            className="ml-3 p-0"
                            size="small"
                            title={open ? translate("_global.label.hide") : translate("_global.label.view")}
                            onClick={() => setOpen(!open)}>
                                {open ? <Visibility /> : <VisibilityOff />}
                        </IconButton> }
                    </Box>
                </TableCell>
                <TableCell align="center">
                    {tender.createdAt ? (
                        <TextFormat type="date"
                         value={convertDateTimeToServer(tender.createdAt)}
                         format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                    ): '...'}
                </TableCell>
                <TableCell align="center">
                    {tender.expireAt ? (
                        <TextFormat type="date"
                         value={convertDateTimeToServer(tender.expireAt)}
                         format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                    ): '...'}
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                        <Typography className="mr-2">{filesSize}</Typography>
                        <IconButton
                            color="primary" 
                            className="mr-2"
                            title={translate("_global.label.view")}
                            onClick={() => setOpenFiles(true)}>
                            <Visibility />
                        </IconButton>
                        {loadingFilesSize && <CircularProgress style={{width:15, height:15}}/>}
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                        <IconButton
                            color="primary" 
                            className="mr-2"
                            title={translate("_global.label.view")}
                            onClick={handleOpenFields}>
                            <Visibility />
                        </IconButton>
                        {(dynamicFieldCount >0 && answerCount > 0) &&
                        <IconButton
                            color="primary" 
                            className="mr-2"
                            title={translate("_global.label.response")+'s'}
                            onClick={openDynamicFieldsResponses}>
                            <Explore />
                        </IconButton>
                        }
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                    <Typography className="text-lowercase">
                        {translate(`_global.label.${(tender && tender.published) ? 'yes' : 'no'}`)}
                    </Typography>
                    {(!tender.published && canUpdate) &&
                     <IconButton onClick={() => setPublishing(true)}
                        color="primary" 
                        className="ml-2"
                        title={translate("_global.label.publish")}>
                        <FontAwesomeIcon icon={faBullhorn} size="sm"/>
                    </IconButton> }
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                    {answerCount !== 0 && <IconButton onClick={showResponses}
                        color="primary" 
                        className="mr-2">
                        <Visibility />
                    </IconButton> }
                    {loadingAnswers && <CircularProgress style={{width:15, height:15}}/>}
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                        {answerCount <= 0 ? (
                            <>
                            {(account && hasPrivileges({ entities: ["Tender"], actions: [PrivilegeAction.UPDATE]},account.authorities)) && 
                                <Tooltip 
                                    onClick={handleUpdate}
                                    placement="right"
                                    title={translate("entity.action.edit")}
                                    classes={{
                                        tooltip: 'bg-white text-primary font-weight-bold',
                                    }}>
                                    <IconButton color="primary" className="mr-2"><Edit /></IconButton>
                                </Tooltip>
                            }
                            {(account && hasPrivileges({ entities: ["Tender"], actions: [PrivilegeAction.DELETE]},account.authorities)) && 
                                <Tooltip 
                                    onClick={handleDelete}
                                    placement="left"
                                    title={translate("entity.action.delete")}
                                    classes={{
                                        tooltip: 'bg-white text-danger font-weight-bold',
                                    }}>
                                    <IconButton color="secondary"><Delete /></IconButton>
                                </Tooltip>
                            }
                            </>
                        ): (
                            <FontAwesomeIcon icon={faLock} />
                        )}
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
                                        <Typography>{tender.object}</Typography>
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

interface UserTenderLunchedProps{
    userId: any
    account: any,
    openCreateModal?:boolean,
    onCreateModalClose?: Function,
}

export const UserTenderLunched = (props: UserTenderLunchedProps) =>{
    const { account } = props;
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
    const classes = useStyles();

    const getTenders = () =>{
        if(userId){
            setLoading(true)
            axios.get<ITender[]>(`${API_URIS.tenderApiUri}/?page=${activePage}&size=${itemsPerPage}&sort=id,desc`)
                .then(res =>{
                    if(res.data){
                        setTenders([...res.data]);
                        setTotalItems(parseInt(res.headers["x-total-count"],10))
                    }
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        setUserId(props.userId);
        getTenders();
    }, [props.userId])

    useEffect(() =>{
        getTenders();
    }, [activePage, userId])

    useEffect(() =>{
        if(props.openCreateModal){
            setTender(null);
            setOpen(true);
        }
    }, [props.openCreateModal])

    const handleClose = () => {
        setTender(null)
        setOpen(false)
        if(props.onCreateModalClose)
            props.onCreateModalClose();
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
    }

    const handlePublish = (published?: ITender) =>{
        if(published && published.published){
            setTenders(tenders.map(t => t.id === published.id ? published : t));
        }
    }

    const items = tenders.map(t => (<UserTenderLunchedRowItem key={t.id} tender={t} account={account} 
                        onUpdate={handleUpdate} onDelete={hadleDeleting} onPublished={handlePublish}/>))

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
                            <TableCell align="center">{translate("microgatewayApp.microproviderTender.createdAt")}</TableCell>
                            <TableCell align="center">{translate("microgatewayApp.microproviderTender.expireAt")}</TableCell>
                            <TableCell align="center">{translate("_tender.files")}</TableCell>
                            <TableCell align="center">Questionnaire</TableCell>
                            <TableCell align="center">{translate("microgatewayApp.microproviderTender.published")}</TableCell>
                            <TableCell align="center">{translate("_global.label.submition")+'s'}</TableCell>
                            <TableCell align="center">Actions</TableCell>
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

export default UserTenderLunched;

