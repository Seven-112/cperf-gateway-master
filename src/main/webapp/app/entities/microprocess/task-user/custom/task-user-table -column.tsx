import { Box, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import { ITaskUser } from "app/shared/model/microprocess/task-user.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getUserExtraFullName } from "app/shared/util/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react"

interface TaskUserTableColumnProps{
    taskId?: any,
    emtyText?: string,
}

export const TaskUserTableColumn = ({ taskId,emtyText } : TaskUserTableColumnProps) => {

    const [tUsers, setTUsers] = useState<IUserExtra[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    const getTaskUsers = () =>{
        if(taskId && serviceIsOnline(SetupService.PROCESS)){
         setLoading(true);
         axios.get<ITaskUser[]>(`${API_URIS.taskUserApiUri}/?taskId.equals=${taskId}`)
              .then(res =>{
                    if(res.data){
                        const usersIds = res.data.filter(ud => ud.userId).map(ud => ud.userId);
                        if(usersIds && usersIds.length !== 0){
                            axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.in=${usersIds.join(',')}`)
                                .then(resp =>{
                                    setTUsers(resp.data);
                                }).catch(err =>{
                                    console.log(err)
                                    setError(true)
                                }).finally(() =>{
                                    setLoading(false);
                                })
                        }else{
                          setLoading(false);
                        }
                    }else{
                        setLoading(false);
                    }
              }).catch((e) =>{
                  console.log(e)
                  setError(true);
                  setLoading(false);
              })
        }
    }

    useEffect(() =>{
        getTaskUsers();
    }, [taskId])

    return (
        <React.Fragment>
            <Box textAlign="center" p={0} m={1} display="flex" 
                justifyContent="center" alignItems="center" flexWrap="wrap">
                 {loading && <Typography variant="caption">loading...</Typography>}
                 {tUsers && tUsers.map(tu => <Typography variant="body2" key={tu.id} style={{ marginLeft: 2 }}>{getUserExtraFullName(tu)}</Typography>) }
                 {!loading && (!tUsers || tUsers.length === 0 ) && <Typography variant="body2">{emtyText}</Typography>}
            </Box>
        </React.Fragment>
    )
}

TaskUserTableColumn.defaultProps = {
    emtyText : '',
}

export default TaskUserTableColumn;