import { Box, BoxProps, colors, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { List } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Translate } from "react-jhipster";
import axios from 'axios';
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getUserExtraFullName } from "app/shared/util/helpers";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    root:{
        width: 200,
        backgroundCo: 'transparent',
    },
    avatar:{
        width: '25',
        height: '25',
        fontSize: theme.spacing(6),
    },
}))

export interface IUserIdRole{
    id: any,
    role?: string,
}

interface UserExtraTooltipListProps{
    userIds: IUserIdRole[],
    rootBoxProps?: BoxProps,
    loading?: boolean,
}

export const UserExtraTooltipList = (props: UserExtraTooltipListProps) =>{
   const { rootBoxProps } = props;
   const [localLoading, setLocalLoading] = useState(props.loading);

   const [users, setUsers] = useState<IUserExtra[]>([]);

   const getUsers = () =>{
       if(props.userIds){
            const ids = props.userIds.map(ur => ur.id);
            setLocalLoading(true);
            let apiUri = `${API_URIS.userExtraApiUri}/?id.in=${ids.join(',')}`;
            apiUri = `${apiUri}&&size=${ids.length}`;
            axios.get<IUserExtra[]>(apiUri)
                .then(res =>{
                    setUsers(res.data);
                }).catch((e) =>{ 
                    console.log(e)
                })
                .finally(() =>{
                    setLocalLoading(false);
                })
       }
   }

   useEffect(() =>{
        getUsers();
        console.log("userids", props.userIds)
   }, [props.userIds])


   const classes = useStyles();

   const getRole = (id) => {
      const finded = [...props.userIds].find(item => item.id === id)
      if(finded && finded.role)
        return finded.role;
      return "";
   }

   const loading = localLoading || props.loading;

   return (
       <React.Fragment>
            <Box className={classes.root} {...rootBoxProps}>
            {(users && users.length !== 0) &&
                <List>
                    {[...users].map((user, index) =>(
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <CustomAvatar alt='' 
                                    photoId={user.employee ? user.employee.photoId : null}
                                    avatarProps={{
                                        className: classes.avatar,
                                    }} 
                                />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={getUserExtraFullName(user) + 'fdfglkkdflk'}
                                secondary={getRole(user.id)}
                                primaryTypographyProps={{
                                    variant: 'h4',
                                    color: 'error',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            }
            {!loading && (!users || users.length ===0) &&
                <Typography color="primary" variant="h6" className="w-100 text-center">
                    <Translate contentKey="microgatewayApp.userExtra.home.notFound">No user found</Translate>
                </Typography>
            }
            </Box>
       </React.Fragment>
   );
}

export default UserExtraTooltipList;