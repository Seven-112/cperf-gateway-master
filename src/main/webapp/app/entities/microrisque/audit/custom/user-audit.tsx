import { IRootState } from "app/shared/reducers";
import { useEffect, useState } from "react"
import { connect } from "react-redux";
import { getSession } from 'app/shared/reducers/authentication';
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import React from "react";
import { Helmet } from 'react-helmet';
import { makeStyles } from "@material-ui/core";
import { translate } from "react-jhipster";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import AuditList from "./audit-list";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";

const useStyles = makeStyles({
})

interface IUserAuditProps extends StateProps, DispatchProps{
    status?: AuditStatus,
    role?: AuditUserRole,
    disableStatusChange?: boolean,
    title?: any,
    hideTitile?: boolean,
    inTodoList?:boolean,
    rootBoxClassName?: string,
}

export const UserAudit = (props: IUserAuditProps) =>{
    const { inTodoList } = props;
    const [audits, setAudits] = useState<IAudit[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(ITEMS_PER_PAGE);
    const [auditStatus, setAuditStatus] = useState<AuditStatus>(props.status);

    const classes = useStyles();

    const getAllEntities = (p?:number, rows?: number) =>{
        setLoading(true);
        const page = (p || p===0) ? p : activePage;
        const size = rows || rowPerPage;
        const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;

        if(userId){
            let requestUri = `${API_URIS.auditApiUri}`;
            if(auditStatus){
                   if(props.role){
                    requestUri = `${requestUri}/findByUserIdAndRoleAndStatus/?userId=${userId}`;
                    requestUri = `${requestUri}&status=${auditStatus}&role=${props.role}&page=${page}&size=${size}`;
                   }else{
                    requestUri = `${API_URIS.auditApiUri}/findByUserIdAndStatus/?userId=${userId}&status=${auditStatus}&page=${page}&size=${size}`;
                   }
            }else{
                requestUri = `${API_URIS.auditApiUri}/findByUserId/?userId=${userId}&page=${page}&size=${size}`;
            }
            // return a spring boot page
            axios.get(requestUri).then(res =>{
                    if(res.data){
                        setTotalItems(parseInt(res.headers['x-total-count'], 10));
                        setAudits(res.data);
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
    }, [props.todoUserId, auditStatus, props.account])
    

   const handleChangeRowPerpage = (rows) =>{
      setRowPerPage(rows);
      setActivePage(0);
      getAllEntities(0, rows);
   }
   const handleChangePage = (newPage) => {
    setActivePage(newPage);
    getAllEntities(newPage);
  };
  
  const handleauditStatusChange = (newStatus?: AuditStatus) =>{
        console.log(newStatus);
        setAuditStatus(newStatus)
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

  return (
      <React.Fragment>
        <Helmet>
            <title>{`${translate("_global.appName")} | ${translate("_global.label.controls.plan")}`}</title>
        </Helmet>
            <AuditList
                audits={[...audits]}
                activePage={activePage}
                itemsPerPage={rowPerPage}
                totalItems={totalItems}
                loading={loading}
                onChangeItemsPerPage={handleChangeRowPerpage}
                onChangePage={handleChangePage}
                rootClassName={props.rootBoxClassName}
                hideTitle={props.hideTitile}
                title={props.title}
                inTodo={props.inTodoList}
                onSave={onSave}
                onDelete={onDelete}
            />
      </React.Fragment>
  )
}

const mapStateToProps = ({ authentication, appUtils }: IRootState) => ({
  account: authentication.account,
  todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserAudit);

