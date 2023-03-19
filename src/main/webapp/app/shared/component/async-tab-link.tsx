import { Box, BoxProps, Button, ButtonProps, colors, makeStyles, Paper } from "@material-ui/core"
import theme from "app/theme";
import clsx from "clsx";
import React, {  } from "react"

const useStyles = makeStyles({
    linRootBox:{
        cursor: 'pointer',
        '&:hover':{
            color: theme.palette.primary.main,
        }
    },
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
    },
    btnActive: {
        color: theme.palette.primary.main,
    }
});

export interface AsyncTabLinkProps{
    label: string,
    index: any,
    active?: boolean,
    className?: string,
    hidden?: boolean,
    btnProps?: ButtonProps,
    icon?: any,
    boxProps?: BoxProps,
    onClick?: Function,
}

export const AsyncTabLink = (props: AsyncTabLinkProps) =>{
    const { label  } = props
    const classes = useStyles();

    const handleClick = () =>{
        if(props.onClick)
            props.onClick();
    }

    return (
        <React.Fragment>
            <Box display={"flex"} alignItems="center"
                 flexDirection={"column"} flexWrap="wrap"
                 className={clsx(classes.linRootBox,{
                    [classes.active] : props.active,
                 })}
                 p={0}
                 onClick={handleClick} {...props.boxProps}
                 role="button">
                {props.icon}
                <Button className={clsx(classes.linkBtn, {
                        [props.className] : props.className,
                        [classes.btnActive] : props.active,
                    })} {...props.btnProps}
                    >
                    {label}
                </Button>
            </Box>
        </React.Fragment>
    )
}

interface HorizontalTabLinkWrapperPorps{
    linkBtns: AsyncTabLinkProps[], 
    boxProps?: BoxProps,
    activeIndex: number,
    activeClassName?: string,
    onLinkClick?: Function,
}

export const AsyncHorizontalTabLinkWrapper = (props: HorizontalTabLinkWrapperPorps ) =>{

    const  { linkBtns, boxProps, activeIndex } = props;

    return (
        <React.Fragment>
            {(linkBtns && linkBtns.length !== 0) && 
                <Paper style={{ width: '100%', padding:7, margin: 0}}>
                    <Box width={1} display="flex" 
                        justifyContent={"flex-start"} 
                        alignItems="center" 
                        flexWrap={"wrap"}
                    { ...boxProps}
                    >
                    {linkBtns.map((linkProps, index) => <AsyncTabLink
                         key={index} active={linkProps.index === activeIndex}
                         {...linkProps}
                          />
                        )}
                    </Box>
                </Paper>
            }
        </React.Fragment>
    )
}

export default AsyncHorizontalTabLinkWrapper;