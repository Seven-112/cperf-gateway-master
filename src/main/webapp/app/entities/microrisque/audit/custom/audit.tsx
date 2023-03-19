import React, { useEffect, useState } from "react"
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { translate } from "react-jhipster";
import { makeStyles } from "@material-ui/core";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import { API_URIS } from "app/shared/util/helpers";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { getSession } from "app/shared/reducers/authentication";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import AuditList from "./audit-list";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { IAuditCycle } from "app/shared/model/microrisque/audit-cycle.model";
import { AuditType } from "app/shared/model/enumerations/audit-type.model";
import { AuditRiskLevel } from "app/shared/model/enumerations/audit-risk-level.model";

const useStyles = makeStyles({

});

interface AuditProps extends StateProps, DispatchProps{}

export const Audit = (props:AuditProps) =>{

    const { account } = props;
    
    const [audits, setAudits] = useState<IAudit[]>([]);

    const [activeStatus, setActiveStatus] = useState<AuditStatus>(null);
  
    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);

    const [loading, setLoading] = useState(false);
    
    const [activeCycle, setActiveCycle] = useState<IAuditCycle>(null);
    const [activeType, setActiveType] = useState<AuditType>(null);
    const [activeCtegoryId, setActiveCategoryId] = useState(null);
    const [activeRiskLevel, setActifRiskLevel] = useState<AuditRiskLevel>(null);

    const classes = useStyles()

    const canCreate = account && hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.CREATE] })
    const canUpdate = account && hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.UPDATE] })
    const canDelete = account && hasPrivileges({ entities: ['Audit'], actions: [PrivilegeAction.DELETE] })

    const getAudites = (p?: number, rows?: number, status?: AuditStatus,
         cycle?: IAuditCycle, catId?: number, type?: AuditType, riskLevel?: AuditRiskLevel ) =>{
        const page = p || p===0 ? p : activePage;
        const size = rows || itemsPerPage;
        let  apiUri = `${API_URIS.auditApiUri}/?page=${page}&size=${size}`;
        if(status)
            apiUri = `${apiUri}&status.equals=${status.toString()}`;
        if(cycle && cycle.id)
            apiUri = `${apiUri}&cycleId.equals=${cycle.id}`;
        if(catId)
            apiUri = `${apiUri}&processCategoryId.equals=${catId}`;
        if(type)
            apiUri = `${apiUri}&type.equals=${type.toString()}`;
        if(riskLevel)
            apiUri = `${apiUri}&riskLevel.equals=${riskLevel.toString()}`;
        setLoading(true);
        axios.get<IAudit[]>(apiUri)
            .then(res =>{
                setAudits([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'],10))
            }).catch(e => console.log(e))
            .finally(() => setLoading(false));
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
        getAudites();
    }, [])

    const handleChangeItemsPerpage = (size) =>{
      setItemsPerPage(size);
      getAudites(0,size, activeStatus, activeCycle, activeCtegoryId,activeType,activeRiskLevel);
    }
  
    const handleChangePage = (newPage) =>{
      setActivePage(newPage);
      getAudites(newPage);
    }

    const onSelectProcess = (selected?: IProcess, audit?: IAudit) =>{
        if(audit){
            setLoading(true);
            const entity: IAudit = {
                ...audit,
                processId: selected ? selected.id : null,
                processName: selected ? selected.label : null,
                processCategoryId: (selected && selected.category) ? selected.category.id : null,
                processCategoryName: (selected && selected.category) ? selected.category.name : null,
            }
            const request = !entity.id ? axios.post<IAudit>(API_URIS.auditApiUri, cleanEntity(entity))
                                      : axios.put<IAudit>(API_URIS.auditApiUri, cleanEntity(entity));
            request.then(res =>{
                if(res.data){
                    if(!entity.id)
                        setAudits([res.data, ...audits]);
                    else
                        setAudits(audits.map(a => a.id === res.data.id ? res.data : a));
                }
            }).catch(e => console.log(e))
             .finally(() =>{
                 setLoading(false);
             })
        }
    }

    const onDelete = (deleteId) =>{
        if(deleteId){
            setAudits(audits.filter(a => a.id !== deleteId));
        }
    }
    

    const onSave = (saved?: IAudit, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setAudits([saved, ...audits]);
            else
                setAudits(audits.map(a => a.id === saved.id ? saved : a));
        }
    }

    const handleChangeStatus = (newStatus?: AuditStatus) =>{
        setActivePage(0);
        setActiveStatus(newStatus);
        getAudites(0,null, newStatus, activeCycle, activeCtegoryId,activeType,activeRiskLevel);
    }

    const handleChangeCycle = (newCycle?: IAuditCycle) =>{
        setActivePage(0);
        setActiveCycle(newCycle);
        getAudites(0,null, activeStatus, newCycle, activeCtegoryId,activeType,activeRiskLevel);
    }

    const handleChanageCategory = (catId?: number) =>{
        setActivePage(0);
        setActiveCategoryId(catId);
        getAudites(0,null, activeStatus, activeCycle, catId,activeType,activeRiskLevel);
    }

    const handleChangeType = (newType?: AuditType) =>{
        setActivePage(0);
        setActiveType(newType);
        getAudites(0,null, activeStatus, activeCycle, activeCtegoryId,newType,activeRiskLevel);
    }

    const handleChangeRiskLevel = (riskLevel?: AuditRiskLevel) =>{
        setActivePage(0);
        setActifRiskLevel(riskLevel);
        getAudites(0,null, activeStatus, activeCycle, activeCtegoryId,activeType,riskLevel);
    }

    return(
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("_global.label.controls.plan")}`}</title>
            </Helmet>
            <AuditList
                audits={[...audits]}
                activePage={activePage}
                canAdd={canCreate}
                canDelete={canDelete}
                canUpdate={canUpdate}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                loading={loading}
                status={activeStatus}
                onChangeItemsPerPage={handleChangeItemsPerpage}
                onChangePage={handleChangePage}
                onDelete={onDelete}
                onSave={onSave}
                onSelectProcess={onSelectProcess}
                onChangeStatus={handleChangeStatus}
                cycle={activeCycle}
                onChangeCycle={handleChangeCycle}
                riskLevel={activeRiskLevel}
                onChangeRiskLevel={handleChangeRiskLevel}
                type={activeType}
                onChangeType={handleChangeType}
                categoryId={activeCtegoryId}
                onChangeCategory={handleChanageCategory}
            />
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Audit);