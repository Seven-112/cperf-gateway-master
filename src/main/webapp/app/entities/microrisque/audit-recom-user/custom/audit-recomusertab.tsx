import { Box, Card, CardActions, CardContent, CardHeader, Chip, IconButton, makeStyles, Slide, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { translate, Translate } from "react-jhipster";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { AuditUserRole } from "app/shared/model/enumerations/audit-user-role.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { getUserExtraFullName } from "app/shared/util/helpers";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '100%',
        boxShadow: 'none',
        background: 'transparent',
        marginTop: theme.spacing(3),
    },
    cardheader:{
        padding: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
    },
    cardContent:{
        background: 'white',
        minHeight: '38vh',
        maxHeight: '80vh',
        overflow: 'auto',
    },
    cardActions:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 5px 5px',
    },
    fileIllustattionBox:{
        height: theme.spacing(7),
        width: theme.spacing(7),
        display: 'inline-block',
        borderRadius:theme.spacing(2),
    },
    fileIllustattionIconBtn:{
        position: 'absolute',
        zIndex:3,
        marginTop:theme.spacing(-4),
        marginLeft:theme.spacing(-3),
    },
    fileIllustattionAvatar:{
        width: '100%',
        height: '100%',
        fontSize: theme.spacing(6),
        cursor: 'pointer',
    },
    previwUserAvatar:{
        maxHeight: 50,
        maxWidth: 50,
    },
}))

interface IAuditRecomUserTabProps{
    recom: IAuditRecommendation,
    role: AuditUserRole,
    roleUsers: IUserExtra[],
    canDelete?: boolean,
    canAdd?: boolean,
    hideTitle?:boolean,
    loading?: boolean,
    handleDelete?: Function,
    handleSelect?: Function,
}

export const AuditRecomUserTab = (props: IAuditRecomUserTabProps) =>{
    const { hideTitle, canAdd, canDelete, loading } = props;
 
    const [users, setUsers] = useState([...props.roleUsers]);
 
    const [openUserSelectorModal, setOpenUserSelectorModal] = useState(false);
 
    const [showTransition, setShowTransition] = useState(true);
 
    useEffect(() =>{
       setShowTransition(false);
       setTimeout(() =>{
         setShowTransition(true);
       },50)
    }, [props.role])
 
    useEffect(() =>{
         setUsers([...props.roleUsers])
    }, [props.roleUsers])
 
    const handleOpenSelector = () =>{
        setOpenUserSelectorModal(true);
    }
 
    const handleCloseModalSelector = (selectedUsers: IUserExtra[]) =>{
        setOpenUserSelectorModal(false);
    }
 
    const handleRemoveUser = (user: IUserExtra) =>{
        if(user && user.id && props.handleDelete){
           props.handleDelete(user);
        }
    }
    
    const classes = useStyles();
 
    const unSelectableIds = [...users].map(tu => tu.id);
 
 
    const selectUser = (userToSelect: IUserExtra) =>{
      if(userToSelect && props.handleSelect){
         props.handleSelect(userToSelect);
      }
     }
 
     const unSelectUser = (user: IUserExtra) =>{
         if(user && props.handleDelete){
             props.handleDelete(user);
         }
     }
 
    const handleSelectChange = (ue?: IUserExtra, isSelecting?: boolean) =>{
        if(ue){
            if(isSelecting)
             selectUser(ue);
            else
             unSelectUser(ue);
        }
    }
 
    return (
        <React.Fragment>
            {openUserSelectorModal && props.recom && props.role && 
             <UserExtraFinder2 
                 open={openUserSelectorModal}
                 unSelectableIds={unSelectableIds}
                 multiple
                 onSelectChange={handleSelectChange}
                 onClose={handleCloseModalSelector} 
             />}
             <Slide direction="left" in={showTransition}
                 timeout={{
                     appear: 300,
                     enter: 300,
                     exit:0,
                 }}>
                 <Card className={classes.card}>
                     <CardHeader
                         className={classes.cardheader}
                         avatar={
                             <>
                             {canAdd &&
                                 <IconButton className="" color="primary" title="Add"
                                     onClick={handleOpenSelector}>
                                     <Add />
                                 </IconButton>}
                             </>
                         }
                         title={
                             <>
                                 {!hideTitle && 
                                     <Typography variant="h4" className="mr-3">
                                         <span className="text-capitalize">{translate(`microgatewayApp.AuditUserRole.${props.role.toString()}`) + 's'}</span>
                                     </Typography>
                                 }
                             </>
                         }
                         subheader={
                             <React.Fragment>
                             </React.Fragment>
                         }
                         />
                     <CardContent className={classes.cardContent}>
                         {loading && <Box width={1} textAlign="center">Loading...</Box>}
                         <Box display="flex" justifyContent="center">
                             {[...users].map((user,index) =>(
                                 <Chip 
                                     key={index}
                                     avatar={<CustomAvatar 
                                         alt=""
                                         photoId={user.photoId}
                                         loadingSize={15}
                                         avatarProps={{
                                             className: classes.previwUserAvatar,
                                         }}
                                     />} 
                                     label={<Typography variant="h5">{getUserExtraFullName(user)}</Typography>}
                                     className="m-1 bg-white border"
                                     classes={{
                                         deleteIcon: 'text-danger'
                                     }}
                                     onDelete={(canDelete && props.handleDelete) ? () => handleRemoveUser(user) : null}
                                 />
                             ))}
                         </Box>
                         {!loading && (!users || users.length ===0) && <Box marginTop={10}>
                             <Typography color="primary" variant="h6" className="w-100 text-center">
                                 <Translate contentKey="microgatewayApp.userExtra.home.notFound">No user found</Translate>
                             </Typography>
                         </Box>}
                     </CardContent>
                     <CardActions className={classes.cardActions}>
                     </CardActions>
                 </Card>
             </Slide>
        </React.Fragment>
    );
}

export default AuditRecomUserTab;