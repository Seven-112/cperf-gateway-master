import { Box, makeStyles, MenuItem, Select, TableCell, TableCellProps, TableRow } from "@material-ui/core";
import { hasPrivileges } from "app/shared/auth/helper";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import theme from "app/theme";
import React, { useEffect } from "react";
import { useState } from "react";
import { TextFormat, translate } from "react-jhipster";
import axios from 'axios';
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import AuditRecommendationUpdate from "./audit-recommendation-update";
import MyCustomTable from "app/shared/component/my-custom-table";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import ModalFileManager from "app/shared/component/modal-file-manager";
import MyCustomPureHtmlRender, { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import AuditRecomUser from "../../audit-recom-user/custom/audit-recom-user";
import AuditRecommendationControl from "./audit-recommendation-control";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import RecommendationChrono from "./recommendation-chrono";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { getSession } from "app/shared/reducers/authentication";
import { getEntity as getUserExtra } from "app/entities/user-extra/user-extra.reducer";
import AuditDetailModal from "../../audit/custom/audit-detail-modal";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { DeleteIconButton, EditIconButton, VisibilityIconButton } from "app/shared/component/custom-button";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { ISearchCriteria } from "app/shared/layout/search-forms/card-subheader-inline-searchbar";

const useStyles = makeStyles({
    trancate:{
        maxWidth: 250,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    catSelect:{
        fontSize:12,
        marginLeft: 5,
        color: theme.palette.grey[300],
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
    catSelectMenuItemList:{
        background: theme.palette.primary.dark,
        color: 'white',
    }
})

const enum SearchCriteriaVal{
    auditor = 'auditor',
    responsable = 'responsable',
    entity = 'entity',
}
interface AllRecommendationProps extends StateProps, DispatchProps{
    inTodo?: boolean,
}

export const AllRecommendation = (props: AllRecommendationProps) =>{
    
    const { account, userExtra, inTodo } = props;

    const [recoms, setRecoms] = useState<IAuditRecommendation[]>([]);

    const [recom, setRecom] = useState<IAuditRecommendation>(null);
    const [status, setStatus] = useState<AuditStatus>(null);

    const [loanding, setLoading] = useState(false);

    const [openToUpdate, setOpenToUpdate] = useState(false);

    const [openToDelete, setOpenToDelete] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);

    const [openFiles, setOpenFiles] = useState(false);

    const [openContent, setOpenContent] = useState(false);

    const [files, setFiles] = useState<IMshzFile[]>([]);

    const [loadingFiles, setLoadingFiles] = useState(false);

    const [openAudit, setOpenAudit] = useState(false);

    const classes = useStyles();
    
    const fileTag = FileEntityTag.auditRecom

    const userIsAuditManager = account && hasPrivileges({ entities: ['audit'], actions: [PrivilegeAction.ALL] });

    
    const canDelUpdateRec = (rec: IAuditRecommendation) =>{
        return (rec && rec.id && userExtra && !rec.executedAt && (userIsAuditManager ||  rec.auditId === userExtra.id));
    }

    const getRecoms = (p?: number, rows?: number, stat?: AuditStatus, searchVal?: string, searchCriteria?: SearchCriteriaVal) =>{
        const page = p || p=== 0 ? p : activePage;
        const size = rows || itemsPerPage;
        let apiUri = `${API_URIS.auditRecommendationApiUri}/?id.specified=true`;
        const finalStatus = stat || status;
        if(finalStatus)
            apiUri = `${apiUri}&status.equals=${finalStatus.toString()}`;
        if(searchVal && searchCriteria){
            if(searchCriteria === SearchCriteriaVal.auditor)
                apiUri = `${apiUri}&auditorName.contains=${searchVal}`;
            else if(searchCriteria === SearchCriteriaVal.entity)
                apiUri = `${apiUri}&entiyName.contains=${searchVal}`;
            else
                apiUri = `${apiUri}&responsableName.contains=${searchVal}`;
                
        }
        apiUri = `${apiUri}&page=${page}&size=${size}&sort=auditId,desc`;
        setLoading(true);
        axios.get<IAuditRecommendation[]>(apiUri)
            .then(res => {
                setRecoms(res.data) 
                setTotalItems(parseInt(res.headers['x-total-count'],10));
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    useEffect(() =>{
        getSession();
        getRecoms();
    }, [])

    useEffect(() =>{
        if(props.account && props.account.id)
            props.getUserExtra(props.account.id);
    }, [props.account])


    const handleUpdate = (rec?: IAuditRecommendation) =>{
        if(userIsAuditManager && rec && rec.id){
            setRecom(rec);
            setOpenToUpdate(true);
        }
    }

    const onSave = (saved?: IAuditRecommendation, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setRecoms([saved, ...recoms])
            else
                setRecoms(recoms.map(r => r.id === saved.id ? saved : r));
            setOpenToUpdate(false);
        }
    }

    const handleOpenFiles = (rec?: IAuditRecommendation) =>{
        if(rec && rec.id){
            setRecom(rec);
            setOpenFiles(true);
            setLoadingFiles(true);
            getMshzFileByEntityIdAndEntityTag(rec.id,fileTag)
                .then(res => setFiles([...res.data]))
                .catch(e =>{
                   console.log(e)
                }).finally(() => {
                    setLoadingFiles(false);
                })
        }
    }

    const handleOpenContent = (rec?: IAuditRecommendation) =>{
        if(rec){
            setRecom(rec);
            setOpenContent(true);
        }
    }

    const handleDelete = (rec?: IAuditRecommendation) =>{
        if(rec && userIsAuditManager){
            setRecom(rec);
            setOpenToDelete(true);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setRecoms(recoms.filter(r => r.id !== deletedId));
            setOpenToDelete(false);
        }
    }

    const handleChangeItemsPerpage = (size) =>{
      setItemsPerPage(size);
      getRecoms(null, size);
    }
  
    const handleChangePage = (newPage) =>{
      setActivePage(newPage);
      getRecoms(newPage);
    }
    
    const handleChangeStatus = (e) =>{
        const newStatus = e.target.value;
        setStatus(newStatus);
        getRecoms(null, null, newStatus);
    }

    const onSaveFiles = (saved: IMshzFile[]) =>{
        if(saved && saved.length !==0 && recom){
            setFiles([...saved, ...files]);
        }
    }

    const onRemoveFile = (removedId) =>{
        if(removedId){
            setFiles(files.filter(f => f.id !== removedId));
        }
    }

    const handleOpenAudit = (rec: IAuditRecommendation) =>{
        if(rec && rec.auditId){
            setRecom(rec);
            setOpenAudit(true)
        }
    }

    const onSubmitSearch = (searchVal, criteriaVal) =>{
        if(searchVal && criteriaVal){
            setRecoms([]);
            getRecoms(0,null,null,searchVal,criteriaVal);
        }else{
            getRecoms(0,null,null);
        }
    }

    const headColumns: TableCellProps[] = [
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.auditorName"),
            align: 'left',
        },
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.editAt"),
            align: 'center',
        },
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.dateLimit"),
            align: 'center',
        },
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.content"),
            align: 'center',
        },
        {   
            children: translate("_global.label.files"),
            align: 'center',
        },
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.entiyName"),
            align: 'center',
        },
        {   
            children: translate("microgatewayApp.microrisqueAuditRecommendation.responsableName"),
            align: 'center',
        },
        {
            children: translate("userManagement.home.title"),
            align: 'center'
        },
        {
            children: <>
            {translate("microgatewayApp.microrisqueAudit.status")}
            <Select
                style={{fontSize: '12px',}}
                value={status}
                onChange={handleChangeStatus}
                MenuProps={{
                    classes: {
                        list: classes.catSelectMenuItemList,
                    }
                }}
                classes={{
                    icon: 'text-white'
                }}
                className={classes.catSelect}
                
            >
                <MenuItem value={AuditStatus.STARTED}>{translate('microgatewayApp.TaskStatus.STARTED')}</MenuItem>
                <MenuItem value={AuditStatus.EXECUTED}>{translate('microgatewayApp.TaskStatus.EXECUTED')}</MenuItem>
                <MenuItem value={AuditStatus.SUBMITTED}>{translate('microgatewayApp.TaskStatus.SUBMITTED')}</MenuItem>
                <MenuItem value={AuditStatus.COMPLETED}>{translate('microgatewayApp.TaskStatus.COMPLETED')}</MenuItem>
                <MenuItem value={AuditStatus.CANCELED}>{translate('microgatewayApp.TaskStatus.CANCELED')}</MenuItem>
                {/* <MenuItem value="ON_PAUSE">{translate('microgatewayApp.TaskStatus.ON_PAUSE')}</MenuItem> */}
                <MenuItem value={AuditStatus.INITIAL}>{translate('microgatewayApp.TaskStatus.VALID')}</MenuItem>
                <MenuItem selected={!status} value="">{translate('_global.label.all')}</MenuItem>
            </Select>
            </>,
            align: 'center'
        },
        {
            children: translate("microgatewayApp.microrisqueAudit.detail.title"),
            align: 'center',
        },
        {
            children: translate("_global.label.chrono"),
            align: 'center'
        },
        {
            children: 'Actions',
            align: 'center',
        }
    ];

    const TRow = ({ rec } : { rec: IAuditRecommendation}) => {

        const [recoAudit, setRecoAudit] = useState<IAudit>(null);
        const [loadingRecoAudit, setLoadingRecoAudit] = useState(false);

        const [openUsers, setOpenUsers] = useState(false);

        const getRecoAudit = () =>{
            setRecoAudit(null);
            if(rec.auditId){
                setLoadingRecoAudit(true);
                axios.get<IAudit>(`${API_URIS.auditApiUri}/${rec.auditId}`)
                    .then(res => setRecoAudit(res.data))
                    .catch(e => console.log(e))
                    .finally(() => setLoadingRecoAudit(false));
            }
        }
        
        useEffect(() =>{
            getRecoAudit();
        }, [rec.auditId])
        
        return (
        <TableRow>
            <TableCell>{rec.auditorName || '...'}</TableCell>
            <TableCell align="center">
                {rec.editAt ?  <TextFormat type="date"
                    value={convertDateTimeToServer(rec.editAt)}
                    format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                    : '....'}
            </TableCell>
            <TableCell align="center">
                {rec.dateLimit ?  <TextFormat type="date"
                    value={convertDateTimeToServer(rec.dateLimit)}
                    format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                    : '....'}
            </TableCell>
            <TableCell align="center">
                {rec.content ?
                    <MyCustomPureHtmlRender
                        body={rec.content}
                        renderInSpan
                    />
                    : '....'}
            </TableCell>
            <TableCell align="center">
                <VisibilityIconButton onClick={() => handleOpenFiles(rec)}/>
            </TableCell>
            <TableCell align="center">
                {rec.entiyName || '....'}
            </TableCell>
            <TableCell align="center">
                {rec.responsableName || '....'}
            </TableCell>
            <TableCell align="center">
                <Box width={1} p={0} m={0} display="flex" 
                 flexDirection="column" justifyContent="center" alignItems="center">
                    <EditIconButton onClick={() => setOpenUsers(true)}/>
                    <AuditRecomUser 
                        open={openUsers}
                        recom={rec}
                        previewUsers
                        previewUsersWithRole
                        notFoundMessage="..."
                        onClose={() => setOpenUsers(false)}
                    /> 
                 </Box>
            </TableCell>
            <TableCell align="center">
                {rec.status ? translate(`microgatewayApp.AuditStatus.${rec.status.toString()}`) : '...'}
            </TableCell>
            <TableCell align="center">
                <VisibilityIconButton onClick={() => handleOpenAudit(rec)} />
            </TableCell>
            <TableCell align="center">
                <RecommendationChrono recom={rec} />
            </TableCell>
            <TableCell align="center">
                <AuditRecommendationControl 
                    recom={rec}
                    iconProps={{ icon: null, size: "xs" }}
                    onUpdate={onSave} />
                {canDelUpdateRec(rec) && <>
                    <EditIconButton onClick={() => handleUpdate(rec)} />
                    <DeleteIconButton onClick={() => handleDelete(rec)} />
                </>}
            </TableCell>
        </TableRow>
    )}

    const tRows = [...recoms].map((rec, index) => <TRow key={index} rec={rec} />)

    const serachCriteriaItems: ISearchCriteria[] = [
        { value: SearchCriteriaVal.auditor, label: translate("microgatewayApp.microrisqueAuditRecommendation.auditorName")},
        { value: SearchCriteriaVal.responsable, label: translate("microgatewayApp.microrisqueAuditRecommendation.responsableName")},
        { value: SearchCriteriaVal.entity, label: translate("microgatewayApp.microrisqueAuditRecommendation.entiyName")},
    ]

    return (
        <React.Fragment>
            {recom && <>
            {!inTodo && <>
               {recom.id && <>
                 <AuditDetailModal 
                    open={openAudit}
                    auditId={recom.auditId}
                    onClose={() => setOpenAudit(false)}
                 />
                 </>}
                <AuditRecommendationUpdate 
                    open={openToUpdate}
                    recommendation={recom}
                    onClose={() => setOpenToUpdate(false)}
                    onSave={onSave}
                />
            </>}
            <MyCustomPureHtmlRenderModal 
                open={openContent}
                body={recom.content}
                onClose={() => setOpenContent(false)}
                title={translate("microgatewayApp.microrisqueAuditRecommendation.content")}
            />
            {recom.id && <>
                <ModalFileManager 
                    open={openFiles}
                    files={[...files]}
                    title={translate("_global.label.files")}
                    selectMultiple
                    loading={loadingFiles}
                    onClose={() => setOpenFiles(false)}
                    notFound={translate("_global.fileManager.home.notFound")}
                    entityId={recom.id}
                    entityTagName={fileTag}
                    onSave={onSaveFiles}
                    onRemove={onRemoveFile}
                />
                <EntityDeleterModal 
                    entityId={recom.id}
                    urlWithoutEntityId={API_URIS.auditRecommendationApiUri}
                    open={openToDelete}
                    onClose={() => setOpenToDelete(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microrisqueAuditRecommendation.delete.question", {id:""})}
                />
            </>}
            </> }
            <MyCustomTable
                title={translate('microgatewayApp.microrisqueAuditRecommendation.home.title')}
                tHeadColums={headColumns}
                tRows={tRows}
                loading={loanding}
                notFound={translate('microgatewayApp.microrisqueAuditRecommendation.home.notFound')}
                activePage={activePage}
                totalItems={totalItems}
                rowsPerPage={itemsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeItemsPerpage}
                cardIcon={faFlag}
                enableSearch
                searchCritarias={serachCriteriaItems}
                handleSubmitSearch={onSubmitSearch}
            />
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication, userExtra }: IRootState) => ({
  account: authentication.account,
  userExtra: userExtra.entity,
});

const mapDispatchToProps = {
    getSession,
    getUserExtra,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AllRecommendation);