import { Box, BoxProps, Button, ButtonProps, makeStyles, Paper } from "@material-ui/core"
import theme from "app/theme";
import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react"
import { INotification } from "../model/notification.model";
import { getUserNotifications } from 'app/entities/notification/notification.reducer';
import { connect } from "react-redux";
import { IRootState } from "../reducers";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    linkBtn: {
        borderRadius: 0,
        margin: "0 15px",
        paddingLeft: "15px",
        paddingRight: "15px",
        '&:hover':{
            color: theme.palette.primary.main,
        }
    },
    active:{
        borderBottom: `3px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
    }
});

export interface TabLinkProps{
    label: string,
    value: string,
    active?: boolean,
    activeClassName?: string,
    className?: string,
    hidden?: boolean,
    btnProps?: ButtonProps,
    onClick?: Function,
    notifTags?: string[],
    notis?: INotification[],
}

export const TabLink = (props: TabLinkProps) =>{
    const { label, value  } = props
    const classes = useStyles();
    const [noSeenNotifsCount, setNotSeenNotifsCount] = useState(0);

    const [active, setActive] = useState(false);

    const history = useHistory();

    const autoActiveWithBrowerUri = () =>{
        if(value){
            setActive(history.location.pathname.includes(value));
        }
    }

    const countNotifs = () =>{
        if(props.notifTags && props.notis){
            const size = [...props.notis].filter(note => !note.seen 
                && [...props.notifTags].some(tag => tag.toString() === note.tag)
            ).length;
            setNotSeenNotifsCount(size);
        }
    }

    useEffect(() =>{
        countNotifs();
    }, [props.notis])

    useEffect(() =>{
        autoActiveWithBrowerUri();
    }, [props.active])

    const handleClick = () =>{
        if(props.onClick)
            props.onClick(props.value);
    }

    const renderBadge = () =>(
        noSeenNotifsCount ? 
         <span className="badge badge-danger badge-pill">{noSeenNotifsCount}</span> 
        : ''
    )

    return (
        <React.Fragment>
            <Button className={clsx(classes.linkBtn, {
                    [props.activeClassName || classes.active] : props.active || active,
                    [props.className] : props.className,
                })} {...props.btnProps}
                onClick={handleClick}
                >
                 {label}&nbsp;{renderBadge()}
             </Button>
        </React.Fragment>
    )
}

interface HorizontalTabLinkWrapperPorps extends StateProps, DispatchProps{
    linkBtns: TabLinkProps[], 
    rootBoxProps?: BoxProps,
    boxProps?: BoxProps,
    activePath?: string, 
    activeClassName?: string,
    onLinkClick?: Function,
    action?: ReactNode,
}

export const HorizontalTabLinkWrapper = (props: HorizontalTabLinkWrapperPorps ) =>{

    const  { linkBtns, boxProps, activePath} = props;
    
    const handleClick = (value) =>{
        if(props.onLinkClick)
            props.onLinkClick(value);
    }

    useEffect(() =>{
        if(!props.notifs || props.notifs.length === 0)
            props.getUserNotifications();
    }, [])

    return (
        <React.Fragment>
            {(linkBtns && linkBtns.length !== 0) && 
                <Paper style={{ width: '100%', padding:7, margin: 0}}>
                    <Box width={1} display="flex"
                         justifyContent="space-between" 
                        alignItems="center" flexWrap="wrap">
                        <Box display="flex" 
                            justifyContent={"flex-start"} 
                            alignItems="center" 
                            flexWrap={"wrap"}
                        { ...boxProps}
                        >
                        {linkBtns.map((linkProps, index) => <TabLink
                                key={index}
                                active={linkProps.value && activePath && linkProps.value.includes(activePath)}
                                {...linkProps} 
                                notis={[...props.notifs]}
                                activeClassName={props.activeClassName}
                                onClick={handleClick}
                            />
                            )}
                        </Box>
                        {props.action}
                    </Box>
                </Paper>
            }
        </React.Fragment>
    )
}

const mapStateToProps = ({ notification }: IRootState) => ({
    notifs: notification.entities,
    loading: notification.loading,
  });
  
  const mapDispatchToProps = {
    getUserNotifications,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(HorizontalTabLinkWrapper);