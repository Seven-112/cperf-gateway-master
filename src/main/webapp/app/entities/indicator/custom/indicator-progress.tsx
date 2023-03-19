import { Box, CircularProgress, colors, makeStyles, Typography } from "@material-ui/core";
import { IIndicator } from "app/shared/model/indicator.model";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) =>({
    box:{
        background: colors.grey[500],
        borderRadius: '5px',
        boxShadow: 'none',
    },

    labelInBox:{
        color: colors.grey[100],
        fontWeight: 'bold',
    },
    dataEditable:{
        borderRadius: '20px',
        cursor: 'pointer',
        '&:hover':{
            background: theme.palette.primary.light,
        }
    },

    labelInDataEditableBox:{
        '&:hover':{
            color: 'white',
        }
    },
    progressPrimary:{
        color: theme.palette.primary.dark,
    },
    progressSecondary:{
        color: theme.palette.secondary.dark,
    },
    progressSuccess:{
        color: theme.palette.success.light,
    },
    progressHightSuccess:{
        color: theme.palette.success.dark,
    },
}))

export const IndicatorProgress = (props) =>{

    const percent: number = props.percent;
    const indicator: IIndicator = props.indicator;

    const classes = useStyles();

    return (
        <React.Fragment>
          <Box position="relative" display="inline-flex" {...props} title="Edit data"
            className={clsx({ [classes.box]: !props.dataEditable, [classes.dataEditable]: props.dataEditable })}>
            <CircularProgress variant="determinate" value={percent > 100 ? 100 : percent}
             size={props.size ? props.size: '50px'} className={clsx({
                 [classes.progressHightSuccess]: percent > 100,
                 [classes.progressSuccess]: percent === 100,
                 [classes.progressSecondary]: percent <50,
                 [classes.progressPrimary]: percent >=50 && percent<100,
             })} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                className={clsx({ [classes.labelInDataEditableBox]: props.dataEditable })} 
            >
                <Typography variant="caption" component="div" color="textSecondary" align="center"
                    className={clsx({ 
                        [classes.labelInDataEditableBox]: props.dataEditable,
                        [classes.labelInBox] : !props.dataEditable
                     })}>
                    {indicator.label}<br/>
                    {`${Math.floor(percent)}%`}
                </Typography>
            </Box>
            </Box>
        </React.Fragment>
    )

}

export default IndicatorProgress;