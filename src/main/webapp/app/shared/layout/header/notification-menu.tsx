import { Box, colors, Divider, IconButton, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, MenuProps, Tooltip, Typography } from "@material-ui/core"
import { CheckCircle, Info, Message, ReportProblem, Visibility, Warning } from "@material-ui/icons";
import Notifications from "@material-ui/icons/Notifications";
import { getUserNotifications, updateEntity as updateNotification, seenAllUserNotifications } from "app/entities/notification/notification.reducer";
import { NotifType } from "app/shared/model/enumerations/notif-type.model";
import { INotification } from "app/shared/model/notification.model";
import { IRootState } from "app/shared/reducers";
import theme from "app/theme";
import clsx from "clsx";
import React, { useEffect } from "react";
import { TextFormat, translate } from "react-jhipster";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
    paper:{
        maxHeight: '70vh',
        maxWidth: '20vw',
        [theme.breakpoints.down('sm')]:{
            maxWidth: '85%',
        },
        marginTop: theme.spacing(2),
        position: 'absolute',
        zIndex: 5000,
    },
    bodyMenuContent:{
        maxHeight: '60vh',
    },
    list:{
        margin: '0',
        marginTop: theme.spacing(-1),
      },
      headerItem:{
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        boxShadow:'0 0 5px',
        background: colors.lightBlue[200],
        '&:hover':{
          background:  colors.lightBlue[300],
        }
      },
      headerNotifMenuItemButton:{
        '&:hover':{
          color: theme.palette.secondary.dark,
        }
      },
      seenText:{
        fontWeight: 'normal',
        wordWrap: 'break-word'
      },
      notSeenText:{
        fontWeight: 'bold',
        wordWrap: 'break-word' 
      },
      primary:{
        fontSize: '14px',
        wordWrap: 'break-word'
      },
      secondary:{
        fontSize: '13px',
        wordWrap: 'break-word'
      }
})

export const NotificationItem = (props: {notification: INotification, onClick?: Function}) =>{
    const { notification } = props;
  
    const classes = useStyles();
    
  
    const handleClick = () =>{
      if(props.onClick)
        props.onClick(notification);
    }

    const renderTitleBox = (title) =>(
      <Box width={1} display="flex" 
        justifyContent={"space-between"}
        alignItems={"center"}
        flexWrap="wrap" whiteSpace="normal">
            <Typography className="">{title}</Typography>
            {notification && 
              <Typography className="ml-2" variant="caption">
                <TextFormat type="date" value={notification.createdAt || (new Date())} 
                format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`}/>
              </Typography>
            }
      </Box>
    )

    const renderTextBox = (text: string) =>( <>
        <Box width={1} display="flex" alignItems={"center"} 
          flexWrap="wrap" whiteSpace="normal">
            {text}
        </Box>
      </>
    )
    
    return (
    <React.Fragment>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          {
            notification.type === NotifType.TOAST ?
            <Warning fontSize="small"  style={{ color: notification.seen ? colors.grey[500] : colors.yellow[800]}} /> :
            notification.type === NotifType.MESSAGE ?
            <Message fontSize="small" color={notification.seen ? "disabled": "primary"} /> :
            <Info fontSize="small" color={notification.seen ? "disabled": "primary"} />
          }
        </ListItemIcon>
        <ListItemText primary={renderTitleBox(notification.title)} 
          secondary={renderTextBox(notification.note ? notification.note : notification.title)}
          classes={{ 
            primary: clsx(classes.primary,{[classes.seenText] : notification.seen, [classes.notSeenText] : !notification.seen }), 
            secondary: clsx(classes.secondary,{[classes.seenText] : notification.seen, [classes.notSeenText] : !notification.seen })
           }}
          />
      </MenuItem>
    </React.Fragment>);
  }

export interface NotificationMenuProps extends StateProps, DispatchProps{
    id?:any,
    anchorEl: any,
    onClose: Function,
}

export const NotificationMenu = (props: NotificationMenuProps) =>{

    const { notifications, anchorEl, id  } = props;
    
    const open = Boolean(anchorEl);
  
    const history = useHistory();

    const classes = useStyles();

    const getNotificaions = () =>{
      if(!props.notifications || props.notifications.length === 0)
          props.getUserNotifications();
    }

    useEffect(() =>{
      getNotificaions();
    }, [])

    const changeAllNotificationsToSeen = () => props.seenAllUserNotifications();

    const handleClick = (notif: INotification) =>{
        if(notif){
          if(!notif.seen && notif.id){
            const entity: INotification = {...notif, seen: true};
            props.updateNotification(entity);
          }
          
          if(notif.link){
            history.push(notif.link);
            props.onClose();
          }
        }
    }

    const handleClose = () => props.onClose();

    const mySort = (a: INotification, b: INotification) =>{
       const id1 = a ? a.id : null;
       const id2 = b ? b.id : null;
       if(id1 === id2)
          return 0;
       else if(id1 > id2)
          return -1;
       else
        return 1;
    }

    const noSeenNotifs = [...notifications]
                .filter(note => !note.seen)
                .sort((a,b) =>mySort(a,b))
                .map((note, index) => <NotificationItem key={index}
                     notification={note} onClick={handleClick} />);

    const seenNotifs = [...notifications]
        .filter(note => note.seen)
        .sort((a,b) =>mySort(a,b))
        .map((note, index) => (
            <>
                {noSeenNotifs.length !== 0 && index === 0 && <Divider />} 
                <NotificationItem key={index} notification={note} onClick={handleClick} />
            </>
        ));

    return (
        <React.Fragment>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={id}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.paper, list: classes.list}}
        >
          <MenuItem className={classes.headerItem}>
            <ListItemIcon>
              <Notifications color="primary" fontSize="large"/>
            </ListItemIcon>
            <ListItemText primary={translate("microgatewayApp.notification.home.title")} />
            {[...noSeenNotifs].length > 0 && 
              <ListItemSecondaryAction>
                <Tooltip title={translate("_global.notification.markAllAsRead")}>
                  <IconButton size="small" color="primary"
                    onClick={changeAllNotificationsToSeen}
                  className={classes.headerNotifMenuItemButton}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction> 
            }
          </MenuItem>
          <Box width={1} overflow="auto" className={classes.bodyMenuContent}>
            {[...notifications].length === 0 && 
                <MenuItem>
                    <ListItemText primary={""} 
                        secondary={translate("microgatewayApp.notification.home.notFound")}
                        classes={{ 
                            primary: classes.seenText, 
                            secondary: classes.seenText,
                        }}
                    />
                </MenuItem>
            }
            {noSeenNotifs}
            {seenNotifs}
          </Box>
        </Menu>
        </React.Fragment>
    )
}

const mapStateToProps = ({ notification }: IRootState) => ({
    notifications: notification.entities,
    loading: notification.loading,
  });
  
  const mapDispatchToProps = {
    getUserNotifications,
    updateNotification,
    seenAllUserNotifications
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(NotificationMenu);