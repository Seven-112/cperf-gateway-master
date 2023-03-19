import { CircularProgress, IconButton, makeStyles, TableCell, TableCellProps, TableRow, Tooltip } from "@material-ui/core";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import theme from "app/theme";
import React, { useEffect } from "react";
import { useState } from "react";
import { TextFormat, translate } from "react-jhipster";
import axios from 'axios';
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { Visibility } from "@material-ui/icons";
import MyCustomTable from "app/shared/component/my-custom-table";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import { connect } from "react-redux";
import { getSession } from "app/shared/reducers/authentication";
import { IRootState } from "app/shared/reducers";
import AuditRecommendationControl from "./audit-recommendation-control";
import RecommendationChrono from "./recommendation-chrono";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";

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

interface UserAuditRecommendationProps extends StateProps, DispatchProps{
    role?: AuditUserRole,
    title?: any,
    status?: AuditStatus,
    hideTitile?: boolean,
    rootBoxClassName?: string,
}

export const UserAuditRecommendation = (props: UserAuditRecommendationProps) =>{
    
    const { status } = props;

    const [recoms, setRecoms] = useState<IAuditRecommendation[]>([]);

    const [recom, setRecom] = useState<IAuditRecommendation>(null);

    const [loanding, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);

    const [openFiles, setOpenFiles] = useState(false);

    const [openContent, setOpenContent] = useState(false);

    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loaidingFiles, setLoadingFiles] = useState(false);

    const classes = useStyles();

    const todoUserIsCurrentLogged = props.account && (props.account.id === props.todoUserId || !props.todoUserId)

    const getAllEntities = (p?:number, rows?: number) =>{
        setLoading(true);
        const page = (p || p===0) ? p : activePage;
        const size = rows || itemsPerPage;
        const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;
        setTotalItems(0);
        setRecoms([]);
        if(userId){
            let requestUri = `${API_URIS.auditRecommendationApiUri}`;
            if(status){
                   if(props.role){
                    requestUri = `${requestUri}/findByUserIdAndRoleAndStatus/?userId=${userId}`;
                    requestUri = `${requestUri}&status=${status}&role=${props.role}&page=${page}&size=${size}`;
                   }else{
                    requestUri = `${API_URIS.auditRecommendationApiUri}/findByUserIdAndStatus/?userId=${userId}&status=${status}&page=${page}&size=${size}`;
                   }
            }else{
                requestUri = `${API_URIS.auditRecommendationApiUri}/findByUserId/?userId=${userId}&page=${page}&size=${size}`;
            }
            // return a spring boot page
            axios.get(requestUri).then(res =>{
                    if(res.data){
                        setTotalItems(parseInt(res.headers['x-total-count'], 10));
                        setRecoms(res.data);
                    }
                 }).catch(e =>{
                     /* eslint-disable no-console */
                     console.log(e);
                 }).finally(() => setLoading(false))
        }else{
            setLoading(false);
        }
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        getAllEntities();
    }, [props.account, props.todoUserId])


    const handleOpenFiles = (rec?: IAuditRecommendation) =>{
        if(rec && rec.id){
            setOpenFiles(true);
            setRecom(rec);
            setLoadingFiles(true);
            getMshzFileByEntityIdAndEntityTag(rec.id, FileEntityTag.auditRecom)
                .then(res => setFiles(res.data))
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

    const handleChangeItemsPerpage = (size) =>{
      setItemsPerPage(size);
      getAllEntities(null, size);
    }
  
    const handleChangePage = (newPage) =>{
      setActivePage(newPage);
      getAllEntities(newPage);
    }

    const onSave = (saved?: IAuditRecommendation, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setRecoms([saved,...recoms])
            else
                setRecoms(recoms.map(r => r.id === saved.id ? saved : r))
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
            children: translate("microgatewayApp.microrisqueAudit.status"),
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

    const MyTableRow = ({ rec } : { rec: IAuditRecommendation }) => (
        <TableRow>
            <TableCell align="left">
                { rec.auditorName || '...' }
            </TableCell>
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
                    <Tooltip 
                        title={translate("entity.action.view")}
                        onClick={() => handleOpenContent(rec)}>
                        <IconButton color='primary' size="small" className="p-0"><Visibility /></IconButton>
                    </Tooltip>
                    : '....'
                }
            </TableCell>
            <TableCell align="center">
                <Tooltip 
                    title={translate("entity.action.view")}
                    onClick={(e) => { e.preventDefault(), handleOpenFiles(rec)}}>
                    <IconButton color='primary' size="small" className="p-0"><Visibility /></IconButton>
                </Tooltip>
            </TableCell>
            <TableCell align="center">
                {rec.status ? translate(`microgatewayApp.AuditStatus.${rec.status.toString()}`) : '...'}
            </TableCell>
            <TableCell align="center">
                <RecommendationChrono recom={rec} />
            </TableCell>
            <TableCell align="center">
                {todoUserIsCurrentLogged &&
                    <AuditRecommendationControl 
                    recom={rec}
                    inTodoList
                    iconProps={{ icon: null, size: "xs" }}
                    onUpdate={onSave}
                />}
            </TableCell>
        </TableRow>
    )

    const tRows = [...recoms].map((rec, index) =>(<MyTableRow  key={index} rec={rec} />))

    return (
        <React.Fragment>
            {recom && <>
            <MyCustomPureHtmlRenderModal 
                open={openContent}
                body={recom.content}
                onClose={() => setOpenContent(false)}
                title={translate("microgatewayApp.microrisqueAuditRecommendation.content")}
            />
            {recom.id && 
                <ModalFileManager 
                    open={openFiles}
                    files={[...files]}
                    entityId={recom.id}
                    entityTagName={FileEntityTag.auditRecom}
                    title={translate("_global.label.files")}
                    readonly
                    loading={loaidingFiles}
                    onClose={() => setOpenFiles(false)}
                    notFound={translate("_global.fileManager.home.notFound")}
                />}
            </>}
            <MyCustomTable
                tHeadColums={headColumns}
                title={props.title || ''}
                loading={loanding}
                notFound={translate('microgatewayApp.microrisqueAuditRecommendation.home.notFound')}
                activePage={activePage}
                totalItems={totalItems}
                rowsPerPage={itemsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeItemsPerpage}
                rootCustomClassName={props.rootBoxClassName}
                tRows={tRows}
                />
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication,appUtils }: IRootState) => ({
  account: authentication.account,
  todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAuditRecommendation);