import { Box, makeStyles } from "@material-ui/core";
import { IIndicator } from "app/shared/model/indicator.model";
import { groupBy } from "lodash";
import React from "react";
import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, ReactFlowProvider } from "react-flow-renderer";
import { IndicatorNode } from "./indicator-node";

const useStyles = makeStyles((theme) =>({
    node:{
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        textAlign: 'center',
        background: theme.palette.background.paper,
    }
}))

const nodeTypes = {
    valid: IndicatorNode,
}
interface INode{
    id:number,
    label:any,
    parentId:number,
}

interface IndicatorLogigramProps{
    indicators: IIndicator[];
    posX:number,
    posY: number,
}

export const IndicatorLogigram = (props: IndicatorLogigramProps) =>{

    const {indicators, posX, posY} = props;

    const [elements, setElements] = useState([]);

    const classes = useStyles();
    
    const initializeElements = () =>{
        const nodes = [];
        const edges = [];
        // grouped element
        const groupedElements = groupBy(indicators.sort((a,b) => a.id - b.id), 'parent');
        
        /* 
        for(const property in groupedElements){
            eslint-disable no-console 
            console.log(property);
        } */

        for(let i=0; i <indicators.length; i++){
            const indicator =indicators[i];
            const x = i===0 ? posX : i%2===0 ? posX-(posX/2)-i : posX+(posX/2)+i;
            const y = i===0 ? posY: posY * i;
            const node = {
                id: indicator.id.toString(),
                type: 'valid',
                data: {label: indicator.label, indicator},
                position:{x, y},
                className: classes.node,
            }

            nodes.push(node);

            if(indicator.parent){
                const edge = {
                        id: `e${indicator.parent.id}-${indicator.id}`,
                            source: indicator.parent.id.toString(),
                        target: indicator.id.toString()
                    }
                edges.push(edge);
            }
        }
          
        setElements([...nodes, ...edges]);
    }

    useEffect(() =>{
        initializeElements();
    }, [props.indicators])

    const onLoad = (reactFlowInstance) => {
        reactFlowInstance.fitView();
      };

    return (
        <React.Fragment>
            <Box style={{ height: 300}} boxShadow={1}>
                <ReactFlowProvider>
                    <ReactFlow elements={elements} nodeTypes={nodeTypes} onLoad={onLoad}>
                    </ReactFlow>
                </ReactFlowProvider>
            </Box>
        </React.Fragment>
        )

}