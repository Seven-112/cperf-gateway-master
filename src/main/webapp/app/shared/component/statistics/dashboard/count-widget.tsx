import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Avatar, Box, BoxProps, CardHeader, CircularProgress, IconButton, IconProps, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles({
    title:{
        marginLeft: 3,
    },
    avartBtn:{},
});

export interface CountWidgetProps{
    title?: string
    description?: string,
    rootBoxProps?: BoxProps,
    data?: number,
    rate?: number,
    loading?: boolean,
    icon?: IconProps | FontAwesomeIconProps,
    avatarClassName?: string,
    withRate?: boolean,
    handleOpenChart?: Function,
    isPercentData?: boolean,
}

export const CountWidget = (props: CountWidgetProps) =>{

    const { 
        title,
        description,
        rootBoxProps, 
        loading,
        data,
        rate,
        withRate,
        avatarClassName,
        isPercentData
    } = props;

    const handleClick = (e) =>{
        e.preventDefault();
        if(props.handleOpenChart)
            props.handleOpenChart();
    }

    const classes = useStyles();
    
    const icon = props.icon || `${title}`.substring(0,1).toUpperCase();

    const getFormatedData = () =>{
        if(data){
            if(isPercentData){
                if(`${data}`.includes(",") || `${data}`.includes("."))
                    return `${data.toFixed(2)}%`;
                return `${data}%`;
            }
            return data;
        }
        return isPercentData ? "0%" : "0";
    }

    return (
       <React.Fragment>
            <Box display="flex"
                    justifyContent="center" 
                    alignItems="center"
                    flexWrap="wrap"
                    boxShadow={2} 
                    height={1}
                    borderRadius={5} 
                    {...rootBoxProps}>
                <CardHeader 
                    avatar={<Avatar

                        style={{
                        width: 56, 
                        height: 56 
                    }} 
                    className={avatarClassName} 
                    onClick={handleClick}
                    >
                        {props.handleOpenChart ? (
                        <IconButton 
                            title={translate("_global.label.clickToViewDetails")}
                            style={{ color: 'white' }} >
                            {icon}
                        </IconButton>
                        ): (icon)}
                    </Avatar>}
                    title={<Box display={"flex"} alignItems="center">
                            {loading ? <CircularProgress style={{ width: 15, height: 15 }} /> : 
                                <Typography variant="h1">{getFormatedData()}</Typography>
                            }
                            {title && <Typography variant="h5" className={classes.title}>{title}</Typography>}
                        </Box>}
                    
                    subheader={(description || withRate) && <Box>
                        {description && <Typography variant="caption">{description}</Typography>}    
                    </Box>}
                    action={<>
                        {withRate && <Typography variant="caption"
                            className={clsx("font-weight-bold text-primary",{
                            "text-success" : (rate && rate > 0),
                            'text-danger' : (rate && rate < 0)
                            })}>{rate}</Typography>}
                    </>}
                />
            </Box>
       </React.Fragment>
    )
}