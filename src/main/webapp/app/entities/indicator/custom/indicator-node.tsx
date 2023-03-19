import { Box } from "@material-ui/core"
import { IIndicator } from "app/shared/model/indicator.model";
import React from "react"
import { Handle, Position } from "react-flow-renderer";

export const IndicatorNode = (props) =>{
    const {indicator, label} = props.data;
    return (<React.Fragment>
        <div className={props.className}>
            {label}
            <Handle position={Position.Top} type="target"/>
            <Handle position={Position.Bottom} type="source"/>
        </div>
    </React.Fragment>)
}
