import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { API_URIS } from "app/shared/util/helpers";
import { IAuditRecomUser } from "app/shared/model/microrisque/audit-recom-user.model";
import UserExtraTooltipList, { IUserIdRole } from "app/entities/user-extra/custom/user-extra-tooltip-list";

const useStyles = makeStyles(theme =>({
    
}))

interface IAuditRecomUserListProps{
    recom: IAuditRecommendation,
}

export const AuditRecomUserList = (props: IAuditRecomUserListProps) =>{
   const [loading, setLoading] = useState(false);

   const [recomUsers, setRecomUsers] = useState<IAuditRecomUser[]>([]);

   const getUsers = () =>{
       if(props.recom){
        setLoading(true);
        axios.get<IAuditRecomUser[]>(`${API_URIS.auditRecomUserApiUri}/?recomId.equals=${props.recom.id}`)
             .then(res =>{
                console.log("res.data",res.data)
                setRecomUsers([...res.data]);
             }).catch((e) =>{
                console.log(e)
             }).finally(() =>{
                 setLoading(false);
             })
       }
   }

   useEffect(() =>{
        getUsers();
   }, [props.recom])


   const classes = useStyles();

   const getUserAndRoles = [...recomUsers]
        .filter(ru => ru.userId)
        .map(ru =>{
            const uidRole: IUserIdRole = {
                id: ru.userId,
                role: `${ru.role ? translate(`microgatewayApp.AuditUserRole.${ru.role.toString()}`) : null}`,
            }
            return uidRole;
        })

   return (
       <React.Fragment>
            <UserExtraTooltipList 
                userIds={[...getUserAndRoles]}
                loading={loading}
            />
       </React.Fragment>
   );
}

export default AuditRecomUserList;