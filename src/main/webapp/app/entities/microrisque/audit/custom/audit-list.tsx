import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import { Box, IconButton, makeStyles, MenuItem, Select, TableCell, TableCellProps, TableRow, Tooltip } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import ProcessSelector from "app/entities/microprocess/process/custom/sub-components/process-selector";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import MyCustomTable from "app/shared/component/my-custom-table";
import TextContentManager from "app/shared/component/text-content-manager";
import { AuditRiskLevel } from "app/shared/model/enumerations/audit-risk-level.model";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { AuditType } from "app/shared/model/enumerations/audit-type.model";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { IAuditCycle } from "app/shared/model/microrisque/audit-cycle.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import { API_URIS } from "app/shared/util/helpers";
import theme from "app/theme";
import React, { useEffect, useState } from "react";
import { TextFormat, translate } from "react-jhipster";
import AuditChrono from "./audit-chrono";
import AuditControl from "./audit-control";
import AuditUpdate from "./audit-update";
import axios from 'axios';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { AddIconButton, DeleteIconButton, EditIconButton } from "app/shared/component/custom-button";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";
import AuditUser from "app/entities/microrisque/audit-user/custom/audit-user";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";

const useStyles = makeStyles({

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
    },
    truncate:{
        width: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
});

interface IAuditListProps extends StateProps{
    audits: IAudit[],
    title?: string,
    hideTitle?: boolean,
    loading?: boolean,
    inTodo?: boolean,
    canUpdate?: boolean,
    canAdd?: boolean,
    canDelete?: boolean,
    enableSearch?: boolean,
    totalItems?: number,
    itemsPerPage?: number,
    activePage?: number,
    onChangePage?: Function,
    onChangeItemsPerPage?: Function,
    onSave?: Function,
    onDelete?: Function,
    onSelectProcess?: Function,
    rootClassName?: string,
    onChangeStatus?: Function,
    status?: AuditStatus,
    onChangeCycle?: Function,
    cycle?: IAuditCycle,
    categoryId?: number,
    onChangeCategory?: Function
    type?: AuditType,
    onChangeType?: Function,
    riskLevel?: AuditRiskLevel,
    onChangeRiskLevel?: Function,
}

export const AuditList = (props: IAuditListProps) =>{
    const { 
            audits,title, canAdd,canDelete, 
            enableSearch, canUpdate,
            inTodo, activePage, itemsPerPage,totalItems 
        } = props;

    const [audit, setAudit] = useState<IAudit>(null);

    const [openToUpdate, setOpenToUpdate] = useState(false);

    const [loading, setLoading] = useState(props.loading);

    const [searchTerm, setSearchTerm] = useState('');

    const [openToEditProcess, setOpenToEditProcess] = useState(false);

    const [openToDelete, setOpenToDelete] = useState(false);

    const [openTitle, setOpenTitle] = useState(false);

    const [cycles, setCycles] = useState<IAuditCycle[]>([]);

    const [cats, setCats] = useState<IProcessCategory[]>([]);


    const classes = useStyles();

    const todoUserIsCurrentLogged = props.account && (props.account.id === props.todoUserId || !props.todoUserId)

    const getCycles = () =>{
        axios.get<IAuditCycle[]>(`${API_URIS.auditCycleApiUri}/?sort=id,desc`)
            .then(res =>{
                setCycles(res.data);
            }).catch(e => console.log(e))
    }
    
    const getCategories = () =>{
        if(serviceIsOnline(SetupService.PROCESS) && props.onChangeCategory){
            const apiUri = `${API_URIS.processCategoryApiUri}/all`;
            axios.get<IProcessCategory[]>(apiUri)
                .then(res =>{
                    setCats(res.data)
                }).catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
      }

    useEffect(() =>{
        getCycles();
        getCategories();
    }, [])

    useEffect(() =>{
        setLoading(props.loading);
    }, [props.loading])
    
    const handleUpdate = (entity?: IAudit) =>{
        if(entity){
            setAudit(entity)
        }else{
               const startDate = new Date();
               startDate.setHours(0, 0, 0);
               const endDate = new Date(startDate.getTime());
               endDate.setHours(23,59,59);
               endDate.setDate(endDate.getDate() + 1); // start date + 1

               const newAudit: IAudit = {
                    type: AuditType.INTERNAL, 
                    riskLevel: AuditRiskLevel.MINOR,
                    startDate: startDate.toDateString(),
                    endDate: endDate.toDateString()
               }
               setAudit(newAudit);
        }
        setOpenToUpdate(true)
    }

    const onSave = (saved?: IAudit, isNew?: boolean) =>{
        if(saved){
            if(props.onSave)
                props.onSave(saved, isNew);
            setOpenToUpdate(false);
        }
    }
    
    const handleSelectProcess = (a: IAudit) =>{
        setAudit(a);
        setOpenToEditProcess(true);
    }

    const onSelectProcess = (selected?: IProcess) =>{
        if(props.onSelectProcess && audit)
            props.onSelectProcess(selected, audit);
        setOpenToEditProcess(false);
    }

    const handleDelete = (entity?: IAudit) =>{
        if(entity){
            setAudit(entity);
            setOpenToDelete(true);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setOpenToDelete(false);
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    const handleChangeItemsPerpage = (size) =>{
        if(props.onChangeItemsPerPage)
            props.onChangeItemsPerPage(size);
    }
  
    const handleChangePage = (newPage) =>{
        if(props.onChangePage)
            props.onChangePage(newPage);
    }

    const handleChangeStatus = (e) =>{
        const newStatus = e.target.value;
        if(props.onChangeStatus)
            props.onChangeStatus(newStatus);

    }

    const handleChanageCategory = (e) =>{
        const catId = e.target.value;
        if(props.onChangeCategory)
            props.onChangeCategory(catId);
    }

    const handleOpenTitle = (a: IAudit) =>{
        if(a && a.title){
            setAudit(a);
            setOpenTitle(true);
        }
    }

    const handleChangeCycle = (e) =>{
        if(props.onChangeCycle){
            const selected = [...cycles].find(c => c.id === e.target.value);
            props.onChangeCycle(selected);
        }
    }

    const headColumns: TableCellProps[] = [
        {
            children: translate("microgatewayApp.microrisqueAudit.title"),
            align: 'left'
        },
        {
            children: translate("microgatewayApp.microrisqueAudit.startDate"),
            align: 'center'
        },
        {
            children: translate("microgatewayApp.microrisqueAudit.endDate"),
            align: 'center'
        },
        {
            children:<>
            {translate("microgatewayApp.microrisqueAudit.cycle")}
            {(props.onChangeCycle) && 
                <Select
                    style={{fontSize: '12px',}}
                    value={props.cycle ? props.cycle.id : null}
                    onChange={handleChangeCycle}
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
                    {[...cycles].map((c, index) =>(
                        <MenuItem key={index} value={c.id}
                            selected={props.cycle && props.cycle.id === c.id}>{c.name}</MenuItem>
                    ))}
                    <MenuItem selected={!props.cycle} value="">{translate('_global.label.all')}</MenuItem>
                </Select>
            }
            </>,
            align: 'center'
        },
        {
            children: translate("microgatewayApp.microrisqueAudit.riskName"),
            align: 'center'
        },
        {
            children: <>
                {translate("microgatewayApp.microrisqueAudit.riskLevel")}
                {(props.onChangeRiskLevel) && 
                    <Select
                        style={{fontSize: '12px',}}
                        value={props.type}
                        onChange={(e) => props.onChangeRiskLevel(e.target.value)}
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
                        <MenuItem value={AuditRiskLevel.MAJOR}>{translate('microgatewayApp.AuditRiskLevel.MAJOR')}</MenuItem>
                        <MenuItem value={AuditRiskLevel.MEDIUM}>{translate('microgatewayApp.AuditRiskLevel.MEDIUM')}</MenuItem>
                        <MenuItem value={AuditRiskLevel.MINOR}>{translate('microgatewayApp.AuditRiskLevel.MINOR')}</MenuItem>
                        <MenuItem selected={!props.riskLevel}>{translate('_global.label.all')}</MenuItem>
                    </Select>
                }
                </>,
            align: 'center'
        },
        {
            children: <>
            {translate("microgatewayApp.microrisqueAudit.type")}
            {(props.onChangeType) && 
                <Select
                    style={{fontSize: '12px',}}
                    value={props.type}
                    onChange={(e) => props.onChangeType(e.target.value)}
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
                    <MenuItem value={AuditType.PERMANENT}>{translate('microgatewayApp.AuditType.PERMANENT')}</MenuItem>
                    <MenuItem value={AuditType.QUALITY}>{translate('microgatewayApp.AuditType.QUALITY')}</MenuItem>
                    <MenuItem value={AuditType.INTERNAL}>{translate('microgatewayApp.AuditType.INTERNAL')}</MenuItem>
                    <MenuItem selected={!props.type}>{translate('_global.label.all')}</MenuItem>
                </Select>
            }
             </>,
            align: 'center'
        },
        {
            children: <>
            {translate("microgatewayApp.microprocessProcessCategory.detail.title")}
            {(props.onChangeCategory) && 
                <Select
                    style={{fontSize: '12px',}}
                    value={props.categoryId}
                    onChange={handleChanageCategory}
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
                    {[...cats].map((c, index) => (
                        <MenuItem key={index} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                    <MenuItem selected={!props.categoryId} value="">{translate('_global.label.all')}</MenuItem>
                </Select>
            }
            </>,
            align: 'center'
        },
        {
            children: translate("microgatewayApp.microprocessProcess.detail.title"),
            align: 'center'
        },
        {
            children: translate("userManagement.home.title"),
            align: 'center'
        },
        {
            children: <>
            {translate("microgatewayApp.microrisqueAudit.status")}
            {(props.onChangeCycle) && 
                <Select
                    style={{fontSize: '12px',}}
                    value={props.status}
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
                    {/* <MenuItem value={AuditStatus.EXECUTED}>{translate('microgatewayApp.TaskStatus.EXECUTED')}</MenuItem>
                    <MenuItem value={AuditStatus.SUBMITTED}>{translate('microgatewayApp.TaskStatus.SUBMITTED')}</MenuItem> */}
                    <MenuItem value={AuditStatus.COMPLETED}>{translate('microgatewayApp.TaskStatus.COMPLETED')}</MenuItem>
                    <MenuItem value={AuditStatus.CANCELED}>{translate('microgatewayApp.TaskStatus.CANCELED')}</MenuItem>
                    {/* <MenuItem value="ON_PAUSE">{translate('microgatewayApp.TaskStatus.ON_PAUSE')}</MenuItem> */}
                    <MenuItem value={AuditStatus.INITIAL}>{translate('microgatewayApp.TaskStatus.VALID')}</MenuItem>
                    <MenuItem selected={!props.status} value="">{translate('_global.label.all')}</MenuItem>
                </Select>
            }
            </>,
            align: 'center'
        },
        {
            children: translate("_global.label.chrono"),
            align: 'center'
        },
        {
            children: "Actions",
            align: 'center'
        },
    ];
    
    const serachFilter = (a: IAudit) =>{
        if(a){
            if(enableSearch && a.title){
                const term = searchTerm || '';
                return a.title.toLowerCase().includes(term.toLowerCase())
            }
            return true;
        }
        return false;
    }

    const TRow = ({ a }: {a: IAudit}) =>{
        const [openAUsers, setOpenAUsers] = useState(false);
        return (
            <>
                <TableRow>
                    <TableCell>{a.title}</TableCell>
                    <TableCell align="center">
                        {a.startDate ? 
                            <TextFormat type="date"
                                value={convertDateTimeToServer(a.startDate)}
                                format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                                : '....'
                        }
                    </TableCell>
                    <TableCell align="center">
                        {a.endDate ? 
                            <TextFormat type="date"
                                value={convertDateTimeToServer(a.endDate)}
                                format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                                : '....' }
                    </TableCell>
                    <TableCell align="center">
                        {a.cycle ? a.cycle.name : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {a.riskName || '...'}
                    </TableCell>
                    <TableCell align="center">
                        {a.riskLevel ? translate(`microgatewayApp.AuditRiskLevel.${a.riskLevel.toString()}`) : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {a.type ? translate(`microgatewayApp.AuditType.${a.type.toString()}`) : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {a.processCategoryName ? a.processCategoryName : '...'}
                    </TableCell>
                    <TableCell align="center"> 
                        <Box display={"flex"} justifyContent={"center"} 
                            alignItems={"center"} flexWrap={"wrap"}>
                            {a.processName ? <MyCustomPureHtmlRender body={a.processName} renderInSpan /> : '...'}
                            {(canUpdate && serviceIsOnline(SetupService.PROCESS) && !inTodo) && <Tooltip title={translate("entity.action.edit")}
                                onClick={() => handleSelectProcess(a)}>
                                <IconButton size="small" className="ml-2 p-0"><Edit /></IconButton>
                            </Tooltip>}
                        </Box>
                    </TableCell>
                    <TableCell align="center">
                        {!inTodo && a.id && (canUpdate || canAdd || canDelete) ?
                         <Box width={1} display="flex" flexDirection="column"
                            justifyContent="center" alignItems="center" flexWrap="wrap">
                            {(canUpdate || canAdd || canDelete) && 
                                <EditIconButton 
                                    onClick={() => setOpenAUsers(true)}
                                    btnProps={{
                                        classes: "p-0 m-0 mb-1"
                                    }}
                                />}
                            <AuditUser
                                open={openAUsers}
                                onClose={() => setOpenAUsers(false)}
                                notFoundMessage="..."
                                audit={a}
                                previewUsers
                                previwWithRole
                            />
                        </Box> : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {a.status ? translate(`microgatewayApp.AuditStatus.${a.status.toString()}`) : '...'}
                    </TableCell>
                    <TableCell align="center">
                        <AuditChrono audit={a} />
                    </TableCell>
                    <TableCell align="center">
                        {(canUpdate && !inTodo && props.onSave) && 
                        <EditIconButton onClick={() => handleUpdate(a)} />}
                        {todoUserIsCurrentLogged &&
                            <AuditControl
                            audit={a}
                            iconProps={{ icon: null, size: "xs" }}
                            onUpdate={onSave}
                        />}
                        {(canDelete && !inTodo && props.onDelete) && 
                        <DeleteIconButton onClick={() => handleDelete(a)} />}
                    </TableCell>
                </TableRow>
            </>
        )
    }

    const tRows = [...audits].filter(a => serachFilter(a)).map((a, index) =><TRow key={index} a={a}/>)

    return (
        <React.Fragment>
        {audit&& <>
            <TextContentManager 
                title={translate("microgatewayApp.microrisqueAudit.title")}
                readonly
                open={openTitle}
                value={audit.title}
                onClose={() => setOpenTitle(false)}
            />
            {!inTodo && <>
            {serviceIsOnline(SetupService.PROCESS) && 
            <ProcessSelector
                open={openToEditProcess}
                onClose={() => setOpenToEditProcess(false)}
                onSelect={onSelectProcess}
                specialLoading={loading}
             />
            }
            {audit.id && <>
                <EntityDeleterModal
                    open={openToDelete}
                    entityId={audit.id}
                    urlWithoutEntityId={API_URIS.auditApiUri}
                    onClose={() => setOpenToDelete(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.microrisqueAudit.delete.question", { id: audit.title})}
                />
             </>
            }
          </>}
        </>}
        {!inTodo && 
        <AuditUpdate
            audit={audit}
            open={openToUpdate}
            onClose={() => setOpenToUpdate(false)}
            onSave={onSave}
         />
        }
        <MyCustomTable 
            loading={loading}
            tHeadColums={headColumns}
            tRows={tRows}
            notFound={title || translate("microgatewayApp.microrisqueAudit.home.notFound")}
            handleSearch={(e) => setSearchTerm(e.target.value)}
            enableSearch={enableSearch}
            cardIcon={faGlasses}
            title={props.hideTitle ? '' : translate("microgatewayApp.microrisqueAudit.home.title")}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeItemsPerpage}
            activePage={activePage}
            rowsPerPage={itemsPerPage}
            totalItems={totalItems}
            handleCreate={(canAdd && !inTodo && props.onSave) ? () =>handleUpdate(null) : null}
            rootCustomClassName={props.rootClassName}
        />
        </React.Fragment>
    )
}

AuditList.defaultProps={
    enableSearch: true,
}

const mapStateToProps = ({ authentication, appUtils }: IRootState) => ({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
});

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps, null)(AuditList);