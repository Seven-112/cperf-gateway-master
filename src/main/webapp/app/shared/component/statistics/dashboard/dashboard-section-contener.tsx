import { Box, BoxProps, Card, CardContent, CardHeader, CardProps, Collapse, colors, makeStyles, Typography } from "@material-ui/core"
import theme from "app/theme";
import clsx from "clsx";
import React, { useState } from "react"
import { VisibilityIconButton } from "../../custom-button";

const useStyles = makeStyles({
    ribbon: {
        backgroundColor: 'skyblue',
        position: "absolute",
        color: 'white',
        minWidth: 130,
        zIndex: 3,
        textAlign: 'center',
        textTransform: 'uppercase',
        padding: 5,
        font: 'Lato',
        '&::before': {
            position: "absolute",
            zIndex: -1,
            content: '',
            display: 'block',
            border: '5px solid #2980b9',
        },
        '&::after': {
            position: "absolute",
            zIndex: -1,
            content: '',
            display: 'block',
            border: '5px solid #2980b9',
        },
        /* transform: 'rotate(0deg)', */
        marginLeft: -7,
        marginTop: 5,
        borderRadius: '0 25px 25px 0',
    },
    card:{
        background: 'transparent',
        boxShadow: `0px 0px 5px ${theme.palette.grey[300]}`,
    },
    cardHeader:{
        // boxShadow: `0 0 2px`,
    },
    cardContent:{
        background: 'transparent',
    }
})

interface DashBoardSectionContenerProps{
    title?: string,
    handleDisplayByUserChange?: Function,
    children?: any,
    rootBoxProps?: BoxProps,
    cardProps?: CardProps,
    open?: boolean,
    ribbonBoxClassName?: string,
    ribbonTitleClassName?: string,
}

export const DashBoardSectionContener = (props: DashBoardSectionContenerProps) =>{

    const { children, rootBoxProps, cardProps, title } = props;

    const [open, setOpen] = useState(props.open);

    const classes = useStyles();

    return (
        <React.Fragment>
            <Box width={1} {...rootBoxProps}>
                <Box className={clsx(classes.ribbon, {[props.ribbonBoxClassName] : true})}>
                    <Typography className={props.ribbonTitleClassName}>{title || ''}</Typography>
                </Box>
                <Card className={classes.card} {...cardProps}>
                    <CardHeader 
                        action={<VisibilityIconButton 
                            isOff={!open}
                            onClick={() => setOpen(!open)}
                            btnProps={{ className: "p-0"}}/>
                        }
                        className={classes.cardHeader}
                    />
                    <Collapse in={open} unmountOnExit>
                        <CardContent className={classes.cardContent}>
                            {children}
                        </CardContent>
                    </Collapse>
                </Card>
            </Box>
        </React.Fragment>
    )
}

DashBoardSectionContener.defaultProps={
    open: true,
}