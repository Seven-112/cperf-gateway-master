import { Box, IconButton, makeStyles, MenuItem, Select, TableCell, TableCellProps, TableRow, Tooltip } from "@material-ui/core";
import { hasPrivileges } from "app/shared/auth/helper";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import theme from "app/theme";
import React, { useEffect } from "react";
import { useState } from "react";
import { TextFormat, translate } from "react-jhipster";
import axios from 'axios';
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { Add } from "@material-ui/icons";
import AuditRecommendationUpdate from "./audit-recommendation-update";
import MyCustomTable from "app/shared/component/my-custom-table";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import AuditRecomUser from "../../audit-recom-user/custom/audit-recom-user";
import AuditRecommendationControl from "./audit-recommendation-control";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import RecommendationChrono from "./recommendation-chrono";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { DeleteIconButton, EditIconButton, VisibilityIconButton } from "app/shared/component/custom-button";

const useStyles = makeStyles({
    modal:{
        width: '80%',
        [theme.breakpoints.down('sm')] :{
            width: '95%',
        }
    },
    trancate:{
        maxWidth: 250,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    tableContainer:{
        boxShadow: 'none',
        marginTop: -50,
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

interface AuditRecommendationProps{
    open?: boolean,
    inTodo?: boolean,
    audit?: IAudit,
    account: any,
    userExtra: IUserExtra,
    roles: AuditUserRole[],
    onClose: Function,
}

export const AuditRecommendation = (props: AuditRecommendationProps) =>{
    
    const { open, audit,account, userExtra, roles, inTodo } = props;

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

    const classes = useStyles();
    
    const userIsAuditManager = account && hasPrivileges({ entities: ['audit'], actions: [PrivilegeAction.ALL] });

    const recEditableWithAuditStatus = audit && [AuditStatus.STARTED, AuditStatus.EXECUTED, AuditStatus.SUBMITTED].some(st => st === audit.status);

    const canAdd = recEditableWithAuditStatus && (userIsAuditManager 
                || (audit.status === AuditStatus.STARTED && [...roles].some(role => AuditUserRole.EXECUTOR))
                || (audit.status === AuditStatus.EXECUTED && [...roles].some(role => AuditUserRole.SUBMITOR))
                || (audit.status === AuditStatus.SUBMITTED && [...roles].some(role => AuditUserRole.VALIDATOR))
            ); 
    
    const canDelUpdateRec = (rec: IAuditRecommendation) =>{
        return (rec && rec.id && recEditableWithAuditStatus && userExtra 
                    && !rec.executedAt && (userIsAuditManager ||  rec.auditId === userExtra.id));
    }

    const handleClose = () => props.onClose();

    const getRecoms = (p?: number, rows?: number, stat?: AuditStatus) =>{
        if(props.audit && props.audit.id){
            const page = p || p=== 0 ? p : activePage;
            const size = rows || itemsPerPage;
            let apiUri = `${API_URIS.auditRecommendationApiUri}/?auditId.equals=${props.audit.id}`;
            const finalStatus = stat || status;
            /* if(!userIsAuditManager)
                apiUri = `${apiUri}&auditorId.equals=${props.userExtra.id}`; */
            if(finalStatus)
                apiUri = `${apiUri}&status.equals=${finalStatus.toString()}`;
            apiUri = `${apiUri}&page=${page}&size=${size}&sort=id,desc`;
            setLoading(true);
            axios.get<IAuditRecommendation[]>(apiUri)
                .then(res => setRecoms(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }else{
            setRecoms([]);
        }
    }

    useEffect(() =>{
        getRecoms();
    }, [props.audit, props.userExtra])


    const handleUpdate = (rec?: IAuditRecommendation) =>{
        if(userExtra && recEditableWithAuditStatus){
            if(rec){
                setRecom(rec);
            }else{
                const newRec: IAuditRecommendation = {
                    auditId: audit.id,
                    auditorId: userExtra.id,
                    auditorEmail: getUserExtraEmail(userExtra),
                    auditorName: getUserExtraFullName(userExtra),
                }
                setRecom(newRec);
            }

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
            getMshzFileByEntityIdAndEntityTag(rec.id, FileEntityTag.auditRecom)
                .then(res => setFiles(res.data))
                .catch(e =>console.log(e))
                .finally(() => setLoadingFiles(false))
        }
    }

    const handleOpenContent = (rec?: IAuditRecommendation) =>{
        if(rec){
            setRecom(rec);
            setOpenContent(true);
        }
    }

    const handleDelete = (rec?: IAuditRecommendation) =>{
        if(rec && recEditableWithAuditStatus){
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
        console.log("newStatus", newStatus)
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
            children: translate("_global.label.chrono"),
            align: 'center'
        },
        {
            children: 'Actions',
            align: 'center',
        }
    ];

    const TRow = ({ rec } : { rec : IAuditRecommendation }) =>{

      const [openUsers, setOpenUsers] = useState(false);

       return (
        <TableRow>
            <TableCell>{rec.auditorName || '...'}</TableCell>
            <TableCell align="center">
                {rec.editAt ?  <TextFormat type="date"
                    value={convertDateTimeToServer(rec.editAt)}
                    format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                    : '....'
                }
            </TableCell>
            <TableCell align="center">
                {rec.dateLimit ?  <TextFormat type="date"
                        value={convertDateTimeToServer(rec.dateLimit)}
                        format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                        : '....'
                }
            </TableCell>
            <TableCell align="center">
                {rec.content ? <VisibilityIconButton onClick={() => handleOpenContent(rec)}/> : '...'}
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
                {!inTodo ? 
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
                 : '...'}
            </TableCell>
            <TableCell align="center">
                {rec.status ? translate(`microgatewayApp.AuditStatus.${rec.status.toString()}`) : '...'}
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

    return (
        <React.Fragment>
            {recom && <>
            {!inTodo && <>
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
                    entityId={recom.id}
                    entityTagName={FileEntityTag.auditRecom}
                    selectMultiple
                    loading={loadingFiles}
                    onClose={() => setOpenFiles(false)}
                    notFound={translate("_global.fileManager.home.notFound")}
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
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={translate('microgatewayApp.microrisqueAuditRecommendation.home.title')}
                rootCardClassName={classes.modal}
                customActionButtons={canAdd ? <Tooltip
                    title={translate('_global.label.add')}
                    onClick={() => handleUpdate(null)}>
                    <IconButton><Add /></IconButton>
                </Tooltip> : <></>}
                avatarIcon={<FontAwesomeIcon icon={faFlag} />}
            >
                <MyCustomTable
                    tHeadColums={headColumns}
                    tRows={tRows}
                    loading={loanding}
                    notFound={translate('microgatewayApp.microrisqueAuditRecommendation.home.notFound')}
                    activePage={activePage}
                    totalItems={totalItems}
                    rowsPerPage={itemsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeItemsPerpage}
                    rootCustomClassName={classes.tableContainer}
                 />
            </MyCustomModal>
        </React.Fragment>
    )
}

export default AuditRecommendation;