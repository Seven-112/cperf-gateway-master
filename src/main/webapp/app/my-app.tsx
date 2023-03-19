import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import Footer from 'app/shared/layout/footer/footer';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import { AppBar, colors, CssBaseline, Divider, Drawer, IconButton, List, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import CustomAppBar from './shared/layout/header/custom-app-bar';
import Sidebar from './shared/layout/menus/sidebar/sidebar';
import { useLocation } from 'react-router-dom';
import { INotification } from './shared/model/notification.model';
import { IRootState } from './shared/reducers';
import { connect } from 'react-redux';
import { toggleSideBarOpen } from './shared/reducers/drawer';

export const mainDrawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[900],
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftWithDrowerOpen: {
    width: `calc(100% - ${mainDrawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: mainDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      width: mainDrawerWidth,
      flexShrink: 0,
    },
  },
  drawerOpen: {
    width: mainDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // boxShadow: '0 0 2px 2px '+ colors.blueGrey["300"],
    [theme.breakpoints.between('xs','sm')]:{
      // boxShadow: '0 0 100px 10px #cfcfcf',
      zIndex:10000,
    }
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0, //  theme.spacing(7) + 1
    [theme.breakpoints.up('sm')]: {
      width:0,
    },
    // boxShadow: '0 0 0 0 '+ colors.cyan["800"],
  },
  paper:{
    background: colors.grey["200"],
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[900],
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px white',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: "#0d47a1", // 'rgba(0,0,0,.1)',
      outline: '1px solid #e1f5fe',
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },
  divider:{
    background: colors.cyan[800],
    height:0.7,
    marginTop:7,
  },
  drawerAppName:{
    color: colors.blueGrey[300],
    position: 'absolute',
    left: (mainDrawerWidth/3)+10,
  },
  drawerLogo:{
    width: theme.spacing(5),
    height: theme.spacing(5),
    position: 'absolute',
    left: mainDrawerWidth/6,
  },
  sidebarContainer:{
  }
}));

export interface IMyAppProps extends StateProps, DispatchProps{
    currentLocale: string,
    isAdmin: boolean,
    isAuthenticated:boolean,
    isInProduction: boolean,
    isSwaggerEnabled: boolean,
    ribbonEnv: string,
    setLocale: Function,
    account: any,
    notifications: INotification[],
}

export const MyApp = (props: IMyAppProps) => {
  const { open } = props;
  const location = useLocation();
  const paddingTop = '60px';
  const classes = useStyles();

  const handleCloseDrawer = () => props.toggleSideBarOpen();
  
  const handleOpenDrawer = () => props.toggleSideBarOpen();

  const isNoTempletingRoute = (): boolean =>{
    if(location.pathname.toLocaleLowerCase().includes('/file-viewer'))
        return true;
    return false;
  }

  return (
    <React.Fragment>
      {isNoTempletingRoute() &&
            <ErrorBoundary>
                <AppRoutes />
            </ErrorBoundary>
       }
      {!isNoTempletingRoute() && <div className="app-container" style={{ paddingTop }}>
       {props.isAuthenticated &&
          <div className={classes.root}>
            <CssBaseline />
           <AppBar position="fixed" 
              className={clsx(classes.appBar, {
                [classes.appBarShift]: !open,
                [classes.appBarShiftWithDrowerOpen]: open,
              })}
            >
              <CustomAppBar 
                  isAuthenticated={props.isAuthenticated}
                  isAdmin={props.isAdmin}
                  currentLocale={props.currentLocale}
                  onLocaleChange={props.setLocale}
                  ribbonEnv={props.ribbonEnv}
                  isInProduction={props.isInProduction}
                  isSwaggerEnabled={props.isSwaggerEnabled}
                  open = {open}
                  acount = {props.account}
                  notifications = {props.notifications}
                  openDrawer={handleOpenDrawer} closeDrawer={handleCloseDrawer}/>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }, classes.paper),
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            anchor="left"
          >
          <div className={classes.toolbar}>
              <img src="../../../content/images/logo.png" alt="" className={classes.drawerLogo}/>
              <Typography variant="h5" display="inline" className={classes.drawerAppName}> C&apos;PERF</Typography>
            <IconButton onClick={handleCloseDrawer} className={clsx({[classes.hide] : !open})}>
              <CloseIcon style={{ color: colors.blueGrey[100] }}/>
            </IconButton>
          </div>
            <Divider classes={{ root: classes.divider}}/>
            <List> <Sidebar /></List>
          </Drawer>
          <main className={classes.content}>
            <div className="container-fluid view-container" id="app-view-container">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              <Footer />
            </div>
          </main>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
        </div>
         }
          {!props.isAuthenticated &&
            <div className="container-fluid" id="app-view-container">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              {/* <Footer /> */}
                <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
            </div>
          }
      </div>}
    </React.Fragment>
  );
};

const mapStateToProps = ({ drawer }: IRootState) =>({
    open: drawer.mainSidebarOpen,
})

const mapDispatchToProps = {
  toggleSideBarOpen
}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MyApp);
