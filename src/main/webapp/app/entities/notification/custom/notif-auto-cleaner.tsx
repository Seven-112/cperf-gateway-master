import { NotifTag } from "app/shared/model/enumerations/notif-tag-modal"
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { seenUserNotificationByTags } from 'app/entities/notification/notification.reducer'
import { IRootState } from "app/shared/reducers";
import { getSession } from "app/shared/reducers/authentication";

interface NotifAutoCleanerProps extends DispatchProps, StateProps{
    tags: NotifTag[]
}

const NotifAutoCleaner = (props: NotifAutoCleanerProps) =>{

    const checkAndSeenNotifis = () =>{
        if(props.tags && props.account && (props.account.id === props.todoUserId || !props.todoUserId))
            props.seenUserNotificationByTags(props.tags);
    }

    useEffect(() =>{
        getSession();
    }, [])

    useEffect(() =>{
        checkAndSeenNotifis();
    }, [props.account])

    return (<React.Fragment></React.Fragment>);
}

const mapStateToProps = ({ authentication, appUtils } : IRootState) => ({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
})
  
const mapDispatchToProps = {
    seenUserNotificationByTags,
    getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;
  
export default connect(mapStateToProps, mapDispatchToProps)(NotifAutoCleaner)