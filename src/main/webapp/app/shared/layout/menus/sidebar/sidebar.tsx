import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ILinkItem, SIDEBAR_LINK_ITEMS } from './link-items';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Collapse, List, ListItem, ListItemSecondaryAction, Typography } from '@material-ui/core';
import { ExpandLess,ChevronRight } from '@material-ui/icons';
import { hasAuthorities, hasPrivileges } from 'app/shared/auth/helper';
import { connect } from 'react-redux';
import { serviceIsOnline } from 'app/config/service-setup-config';
import { IRootState } from 'app/shared/reducers';

const useStyles = makeStyles((theme) =>({
  hasFocus: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
  },
  listitem:{
    color: theme.palette.background.paper,
    '&:hover':{
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.dark,
    }
  },
  listitemIcon:{
    color: theme.palette.grey[400],
    marginRight:-25,
  },
  listItemText:{
    marginRight:10,
  },
  collapseIcon:{
    color: theme.palette.grey[400],
    '&:hover':{
      color: 'white',
    }
  },
  listCollapse:{
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  listItemChirld:{
    boxShadow: '-1px 1px 1px white',
    borderRadius: '0 0 5px 5px',
    padding:'1px 3px',
    color: theme.palette.grey[200],
    '&:hover':{
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.dark,
    }
  },
  active:{
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  }
}))

interface ICustomizedMenusProps extends DispatchProps, StateProps{}

export const CustomizedMenus = (props: ICustomizedMenusProps) =>{
  const classes = useStyles();

  const [useInitFocus, setUseInitFocus] = React.useState(true);

  const history = useHistory();

  const isValidItem = (item: ILinkItem) =>{
     return (((item.hasAuthorities && hasAuthorities(item.hasAuthorities, props.account.authorities))
          || (item.hasPrivileges  && hasPrivileges(item.hasPrivileges, props.account.authorities))
          || (!item.hasAuthorities && !item.hasPrivileges)) && ((item.apiService && serviceIsOnline(item.apiService)) || !item.apiService))
  }

  const itemHasChilds = (item: ILinkItem) =>{
    return item && item.childs && item.childs.length >0;
  }

  const renderMenuText = (item: ILinkItem) =>{
      return (
        <>
          <Typography variant='body2' 
            component="span"
            style={{
              overflowWrap: 'break-word',
              whiteSpace: 'break-spaces',
            }}>
            {item.translateLabelName ? 
              <Translate contentKey={item.translateLabelName}>{item.label}</Translate>
              : item.label
            }
          </Typography>
        </>
      )
  }

  const renderMenu = (item: ILinkItem, isChildItem?: boolean) =>{
    const [open, setOpen] = useState(false)

    const handleToggleOpen = () =>{
      setOpen(!open)
    }
    const handleClick = (path) =>{
      history.push(path);
    }

    const isActive = (linkItem: ILinkItem) => linkItem && linkItem.activePaths
         && history
         && history.location
         && history.location.pathname 
         && linkItem.activePaths.some(p => p.toLowerCase() === history.location.pathname.toLowerCase() 
          || history.location.pathname.toLowerCase().startsWith(p.toLowerCase())
          || p.toLowerCase() === '/'+history.location.pathname.toLowerCase()
          || ('/'+history.location.pathname.toLowerCase()).startsWith(p.toLowerCase())
         );

    if(isValidItem(item)){
      if(itemHasChilds(item)){
        return (
          <React.Fragment>
            <ListItem button onClick={handleToggleOpen}
               className={clsx(classes.listitem,{
                [classes.listItemChirld] : isChildItem,
                [classes.active]: isActive(item),
               }) }>
                <ListItemIcon className={ classes.listitemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  className={classes.listItemText}
                  primary={renderMenuText(item)} 
                />
                <ListItemSecondaryAction>
                  <span className={classes.collapseIcon}>{open ? <ExpandLess /> : <ChevronRight />}</span>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List className={classes.listCollapse}>
                    {item.childs.map((child) => renderMenu(child, true))}
                </List>
            </Collapse>
          </React.Fragment>
        )
      }else{
        return (
          <ListItem button onClick={() =>handleClick(item.path)} className={clsx({
            [classes.listitem] : true,
            [classes.listItemChirld] : isChildItem,
            [classes.active]: isActive(item),
          })}>
              <ListItemIcon className={ classes.listitemIcon}>{item.icon}</ListItemIcon>
              <ListItemText  
                className={classes.listItemText}
                primary={renderMenuText(item)} />
          </ListItem>
        )
      }
    }else{
      return <React.Fragment></React.Fragment>
    }
  }

  return (
    <List>
        {SIDEBAR_LINK_ITEMS.filter(item => isValidItem(item)).map(item =>( renderMenu(item, false) ))} 
    </List>
  );
}

const mapStateToProps = (storeState : IRootState) => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = {
  // changeTaskOnPause,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedMenus);
