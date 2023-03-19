import { Box, BoxProps, Button, ButtonProps, IconButton, makeStyles, Typography, TypographyProps } from "@material-ui/core"
import { Check } from "@material-ui/icons"
import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model"
import React from "react"
import { DashBoardDateSelectorProps, DashbordIntervalSelector } from "./date-interval-selector"
import { PerfUnitySelector, PerfUnitySelectorProps } from "./unity-selector"

interface ChartContainerProps extends DashBoardDateSelectorProps, PerfUnitySelectorProps{
    unity: PerfIndicatorUnity,
    loading?: boolean,
    children?: any,
    rootBoxProps?: BoxProps,
    controlsContentBoxPrpos?: BoxProps,
    loadingTypographyProps?: TypographyProps,
    validBtnProps?: ButtonProps,
}

export const ChartContainer = (props: ChartContainerProps) =>{

    const handleDatesChange = (minDate, maxDate) =>{
         if(props.handleDatesChange)
            props.handleDatesChange(minDate, maxDate);
    }

    const handleChangeUnity = (newUnity) =>{
        if(props.handleChangeUnity)
            props.handleChangeUnity(newUnity)
    }

    return (
        <React.Fragment>
            <Box width={1} p={2} borderRadius={7} {...props.rootBoxProps}>
                <Box width={1} display="flex" 
                        justifyContent={props.loading ? "space-between" : "flex-end"}
                        alignItems="center" flexWrap="wrap" {...props.controlsContentBoxPrpos}>
                    {props.loading && <Typography {...props.loadingTypographyProps}>Loading...</Typography>}
                    <DashbordIntervalSelector
                        minDate={props.minDate}
                        maxDate={props.maxDate}
                        handleDatesChange={handleDatesChange}
                        dateSelectorRootBoxProps={props.dateSelectorRootBoxProps}
                        dateInputFieldClassName={props.dateInputFieldClassName}
                        datesSeperator={props.datesSeperator}
                        iconClassName={props.iconClassName}
                        />
                    <PerfUnitySelector selected={props.unity}
                        hideLabel
                        labelProps={props.labelProps}
                        unitySelectorRootBoxProps={props.unitySelectorRootBoxProps}
                        selectClassName={props.selectClassName}
                        selectIconClassName={props.selectIconClassName}
                        handleChangeUnity={handleChangeUnity} />
                    {props.validBtnProps && <Button startIcon={<Check /> } {...props.validBtnProps}/>}
                </Box>
                {props.children}
            </Box>
        </React.Fragment>
    )
}