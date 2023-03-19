import { Badge, IconButton, Toolbar, Typography, Menu, MenuItem, colors, Avatar, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction, Tooltip, makeStyles, fade } from '@material-ui/core';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Storage, translate, Translate } from 'react-jhipster';
import { useHistory } from 'react-router-dom';
import { CustomLocalMenu } from '../menus';
import { API_URIS, deleteUserExtraPhoto, formateBase64Src } from 'app/shared/util/helpers';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import axios from 'axios';
import { INotification } from 'app/shared/model/notification.model';
import { NotifType } from 'app/shared/model/enumerations/notif-type.model';
import { CheckCircle, Info, Message, ReportProblem, Visibility, Warning } from '@material-ui/icons';
import store from 'app/config/full-accessible-store';
import { ACTION_TYPES as NOTIFS_ACTIONS_TYPES } from 'app/entities/notification/notification.reducer';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import theme from 'app/theme';
import CustomAvatar from 'app/shared/component/custom-avatar';
import NotificationMenu from './notification-menu';
const drawerWidth = 240;

const useStyles = makeStyles({
 /*  menuButton: {
    marginRight: 36,
  }, */
  hide: {
    display: 'none',
  },
//   complet barr style

grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  logo:{
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  appName:{
    // cursor: 'pointer',
    '& :hover':{
      color:colors.blueGrey[600],
    }
  },
  loggedName:{
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    marginLeft: theme.spacing(3),
    color: theme.palette.grey[300],
    borderLeft: '2px solid',
    borderColor: theme.palette.grey[600],
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  headerNotifMenuItem:{
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
    fontWeight: 'bold',
  },
  notSeenText:{
    fontWeight: 'bold', 
  },
  primary:{
    fontSize: '14px',
  },
  secondary:{
    fontSize: '13px',
  }
});

export interface ICustomAppBarProps {
    isAuthenticated: boolean;
    isAdmin: boolean;
    ribbonEnv: string;
    isInProduction: boolean;
    isSwaggerEnabled: boolean;
    currentLocale: string;
    onLocaleChange: Function;
    notifications: INotification[],
    open: boolean;
    acount: any,
    openDrawer: Function,
    closeDrawer: Function,
  }

const CustomAppBar = (props: ICustomAppBarProps) =>{
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [messages, setMessages] = useState<INotification[]>([]);

    const [seenNotits, setSeenNotifs] =  useState<INotification[]>([]);

    const [notificationsEl, setNotificationsEl] = useState(null);

    const [messagesEl, setMessagesEl] = useState(null);

    const history = useHistory();
  
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isMessagesOpen = Boolean(messagesEl);

    const noSeenNotifs = [...props.notifications].filter(n => !n.seen && n.type !== NotifType.MESSAGE);

    useEffect(() =>{
        if(props.acount){
          axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.acount.id}`).then(res =>{
            if(res.data){
              setUserExtra({...res.data});
            }
            else{
              setUserExtra({id: props.acount.id, user: {...props.acount}});
            }
          }).catch(() =>{})
        }
    }, [props.acount])

    useEffect(() =>{
        if(props.notifications && props.notifications.length){
          setMessages(props.notifications.filter(note => note.type === NotifType.MESSAGE && !note.seen))
        }
    }, [props.notifications])
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = (path: string) => {
      setAnchorEl(null);
      handleMobileMenuClose();
      history.push(path);
    };
  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleOpenNotificationMenu = (event) => {
      setNotificationsEl(event.currentTarget);
    }

    const handleCloseNotificationsMenu = () =>{
       setNotificationsEl(null);
    }

    const handleLocaleChange = (langKey) => {
      Storage.session.set('locale', langKey);
      props.onLocaleChange(langKey);
    };
    
    const menuId = 'primary-search-account-menu';

   const closeOrHideDrawer = event => {
       event.preventDefault();
       if(props.open)
        props.closeDrawer();
      else
        props.openDrawer();
    }

    const loggedName = () =>{
      if(userExtra && userExtra.employee) 
        return userExtra.employee.firstName + ' '+userExtra.employee.lastName;
      if(userExtra && userExtra.user) 
        return userExtra.user.firstName + ' '+userExtra.user.lastName;
      return translate('global.menu.account.main');
    } 
      const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem  key={'costumappbarMenu4'} onClick={ () => {handleMenuClose('/account/settings')}}>Profile</MenuItem>
          <MenuItem  key={'costumappbarMenu5'} onClick={() => { handleMenuClose('/logout') }}>
              <Translate contentKey="global.menu.account.logout">Sign out</Translate>
          </MenuItem>
        </Menu>
      );
    
      const mobileMenuId = 'primary-search-account-menu-mobile';
      const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <CustomLocalMenu currentLocale={props.currentLocale} onClick={(e) =>handleLocaleChange(e)}/>
          {/* <MenuItem key={'costumappbarMenu1'}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={messages.length} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem> */}
          <MenuItem  key={'costumappbarMenu2'} onClick={handleOpenNotificationMenu}>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={noSeenNotifs.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem  key={'costumappbarMenu3'} onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
            {(userExtra && userExtra.employee && userExtra.employee.photoId) &&
              <CustomAvatar 
                alt=""
                photoId={userExtra.employee.photoId}
                onDelete={() => deleteUserExtraPhoto(userExtra)}
                avatarProps={{
                  className: classes.small
                }}
              />
            }
            {(!userExtra || !userExtra.employee || !userExtra.employee.photoId) && <AccountCircle /> } 
            </IconButton>
            <p style={{ marginTop: '10px' }}>{ loggedName() }</p>
          </MenuItem>
        </Menu>
      );
    
   return (
      <React.Fragment>
        <NotificationMenu 
          anchorEl={notificationsEl}
          onClose={handleCloseNotificationsMenu}
        />
        <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={closeOrHideDrawer}
          className={clsx({ [classes.menuButton]: true, [classes.hide]: props.open })}
        >
          <MenuIcon />
        </IconButton>
        {/* <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          /> 
        </div> */}
        <div className={clsx(classes.appName,{[classes.hide]: props.open})}>
        <img src="../../../content/images/logo.png" alt="" className={classes.logo}/> 
          <Typography variant="h5" display="inline" className={"ml-3 text-white"}> C&apos;PERF </Typography>
        </div>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          <CustomLocalMenu currentLocale={props.currentLocale} onClick={(e) =>handleLocaleChange(e)}/>
          {/* <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={messages.length} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton> */}
          <IconButton aria-label="show 17 new notifications" color="inherit" onClick={handleOpenNotificationMenu}>
            <Badge badgeContent={noSeenNotifs.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography display="inline" variant="caption" className={classes.loggedName}>{ loggedName()  }</Typography>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {(userExtra && userExtra.employee && userExtra.employee.photoId) &&
              <CustomAvatar 
                photoId={userExtra.employee.photoId}
                onDelete={() => deleteUserExtraPhoto(userExtra.employee)}
                avatarProps={{
                  className: classes.small
                }}
              />
            }
            {(!userExtra || !userExtra.employee || !userExtra.employee.photoId) &&  <AccountCircle /> }
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
        
        {renderMobileMenu}
        {renderMenu}
      </Toolbar>
    </React.Fragment>
   );
}

export default CustomAppBar;