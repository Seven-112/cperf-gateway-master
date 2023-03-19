import React from "react"
import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import { Box, BoxProps, makeStyles, MenuItem, Select, Typography, TypographyProps } from "@material-ui/core"
import { translate } from "react-jhipster"
import theme from "app/theme";
import clsx from "clsx";

const useStyles = makeStyles({
    catSelect:{
        fontSize:12,
        marginLeft: 5,
        color: theme.palette.primary.main,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
    catSelectMenuItemList:{
        background: theme.palette.primary.dark,
        color: 'white',
    },
    icon:{
        color: theme.palette.primary.main,
    },
});

export const DEFAULT_PERF_INDICATOR_UNITY = PerfIndicatorUnity.WEEK;

export interface PerfUnitySelectorProps{
    selected?: PerfIndicatorUnity,
    handleChangeUnity?: Function,
    selectClassName?: string,
    selectIconClassName?: string,
    hideLabel?: boolean,
    labelProps?: TypographyProps,
    unitySelectorRootBoxProps?: BoxProps,
}
export const PerfUnitySelector = (props: PerfUnitySelectorProps) =>{

    const classes = useStyles();

    const handleChange = (e) =>{
        if(props.handleChangeUnity){
            props.handleChangeUnity(e.target.value);
        }
    }

    const unitykeys = Object.keys(PerfIndicatorUnity).filter(key => isNaN(Number(PerfIndicatorUnity[key])));

    return (
        <React.Fragment>
            <Box display="flex" justifyContent="flex-end"
                alignItems="center" flexWrap="wrap" 
                {...props.unitySelectorRootBoxProps}>
                {!props.hideLabel && <Typography variant="body2" {...props.labelProps}>Unity&nbsp;:&nbsp;</Typography>}
                <Select 
                    value={props.selected}
                    MenuProps={{
                        classes: {
                            // list: classes.catSelectMenuItemList,
                        }
                    }}
                    classes={{
                        icon: clsx(classes.icon,{[props.selectIconClassName] : props.selectClassName})
                    }}
                    className={clsx(classes.catSelect, {[props.selectClassName] : props.selectClassName})} 
                    onChange={handleChange}>
                    {[...unitykeys].map((uk, index) =>(
                        <MenuItem key={index} value={PerfIndicatorUnity[uk]}>
                            {translate(`perfIndicatorUnity.${uk}`)}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </React.Fragment>
    )
}