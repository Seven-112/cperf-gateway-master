import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react"
import { Handle, Position } from "react-flow-renderer";

const useStyles = makeStyles((theme) =>({
    box:{
        padding: '5px',
        background: 'transparent',
        backgroundColor: 'transparent',
    },
    condNode:{
        transform: "rotate(45deg) scale(0.6)",
        height: theme.spacing(4.5),
        width: theme.spacing(4.5),
        overflow: 'hidden',
        borderColor: theme.palette.primary.dark,
    },
    condNodeLabelContainer:{
        transform: "rotate(-45deg)",
        fontSize: 10,
        marginLeft: theme.spacing(-0.5),
        marginTop: theme.spacing(0.3),
    },
    subAcvNodeLabelContainer:{
        margin:'-6px -1px',
        padding: '5.5px',
        textAlign: 'center',
        // borderLeft: '2px solid white',
        // borderRight: '2px solid white',
    },
    /** handles css */
    target:{
        height: theme.spacing(0.6),
        width: theme.spacing(0.6),
        background: theme.palette.warning.dark,
        borderRadius:0,
    },
    source:{
        height: theme.spacing(0.6),
        width: theme.spacing(0.6),
        background: theme.palette.primary.light,
        borderRadius:0,
    },

    topTCondtargetHandle:{
        height: theme.spacing(1.2),
        width: theme.spacing(1.2),
        top: '-7%',
        left: '5%',
        background: theme.palette.warning.dark,
    },
    letfCondTargetHandle:{
        height: theme.spacing(1.2),
        width: theme.spacing(1.2),
        left: '-7%',
        top: '95%',
        background: theme.palette.warning.dark,
    },
    rightTCondSourceHandle:{
        height: theme.spacing(1.2),
        width: theme.spacing(1.2),
        right: '-7%',
        top: '5%',
        background: theme.palette.primary.dark,
    },
    bottomCondSourceHandle:{
        height: theme.spacing(1.2),
        width: theme.spacing(1.2),
        bottom: '-5%',
        left: '95%',
        background: theme.palette.primary.dark,
    }
}))

export const StartNode = ({data}) =>{
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <Box className={classes.box} boxShadow={3} title={data.title || ''}>
                <div>{data.label}</div>
                 {/** right-handle */}
                 <Handle type="source" position={Position.Right} id="rh" 
                  className={classes.source}  style={{ marginRight: '-3px', }}/>

                 {/** bottom-handle */}
                <Handle type="source" position={Position.Bottom} id="bh"
                 className={classes.source}  style={{ marginBottom: '-3px', }}/>
            </Box>
        </React.Fragment>
    )
}

export const AcitivityNode = ({data}) =>{
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <Box className={ classes.box } width={1} boxShadow={3} title={data.title || ''}>
                {/** Top-handle */}
                <Handle type="target" position={Position.Top} id="th"
                 className={classes.target} style={{ marginTop: '-3px', }}/>

                {/** left handle */}
                <Handle type="target" position={Position.Left} id="lh" 
                    className={classes.target} style={{ marginLeft: '-3px', }}/>

                <div>{data.label}</div>

                {/** right handle  */}
                <Handle type="source" position={Position.Right} id="rh"
                 className={classes.source} style={{ marginRight: '-3px', }}/>

                 {/** bottom handle */}
                <Handle type="source" position={Position.Bottom} id="bh"
                 className={classes.source} style={{ marginBottom: '-3px', }}/>
            </Box>
        </React.Fragment>
    )
}

export const SubAcitivityNode = ({data}) =>{
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <Box className={ classes.box } boxShadow={3} title={data.title || ''}>
                 {/** Top-handle */}
                <Handle type="target" position={Position.Top} id="th"
                 className={classes.target} style={{ marginTop: '-3px', }}/>
                
                {/** left handle */}
                <Handle type="target" position={Position.Left} id="lh"
                  className={classes.target}  style={{ marginLeft: '-3px', }}/>

                <div className={classes.subAcvNodeLabelContainer}>{data.label}</div>

                 {/** right-handle */}
                <Handle type="source" position={Position.Right} id="rh"
                   className={classes.source}  style={{ marginRight: '-3px', }}/>

                  {/** bottom-handle */}
                <Handle type="source" position={Position.Bottom}  id="bh"
                 className={classes.source}  style={{ marginBottom: '-3px', }}/>
            </Box>
        </React.Fragment>
    )
}

export const DocNode = ({data}) =>{
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <Box className={ classes.box } boxShadow={3} title={data.title || ''}>
                 {/** Top-handle */}
                <Handle type="target" position={Position.Top} id="th"
                 className={classes.target}  style={{ marginTop: '-3px', }}/>

                 {/** left-handle */}
                <Handle type="target" position={Position.Left} id="lh"
                 className={classes.target} style={{ marginLeft: '-3px', }}/>

                <div>{data.label}</div>

                 {/** right-handle */}
                <Handle type="source" position={Position.Right} id="rh"
                 className={classes.source} style={{ marginRight: '-3px', }} />

                  {/** bottom-handle */}
                <Handle type="source" position={Position.Bottom} id="bh"
                 className={classes.source}  style={{ marginBottom: '-3px', }}/>
            </Box>
        </React.Fragment>
    )
}

export const CondNode = ({data}) =>{
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <Box className={ classes.box + ' '+ classes.condNode} width={1} style={{ height: '100%'}} boxShadow={3}>
                 {/** Top-handle */}
                <Handle type="target" position={Position.Top} className={classes.topTCondtargetHandle}
                    style={{  }} id="th"/>

                 {/** left-handle */}
                <Handle type="target" position={Position.Left} id="lh" className={classes.letfCondTargetHandle}
                    style={{  }} />

                
                <div className={classes.condNodeLabelContainer}>{data.label}</div>

                 {/** right-handle */}
                <Handle type="source" position={Position.Right} id="rh" className={classes.rightTCondSourceHandle}
                 style={{  }} />

                 {/** bottom-handle */}
                <Handle type="source" position={Position.Bottom} id="bh"  className={classes.bottomCondSourceHandle} />
            </Box>
        </React.Fragment>
    )
}

export const EndNode = ({data}) =>{
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box className={classes.box} boxShadow={3} title={data.title || ''}>
                 {/** Top-handle */}
                <Handle type="target" position={Position.Top} id="th"
                 className={classes.target}  style={{ marginTop: '-3px', }}/>

                <div>{data.label}</div>

                 {/** right-handle */}
                <Handle type="target" position={Position.Left} id="rh"
                 className={classes.target} style={{ marginLeft: '-3px', }} />
            </Box>
        </React.Fragment>
    )
}

export const DraggableCond = ({data}) =>{
    const classes = useStyles();

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('project/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <React.Fragment>
            <Box className={clsx({[classes.box] : true, [classes.condNode] : true, [data.className]: data.className})}
             boxShadow={1} draggable onDragStart={(event) => onDragStart(event, 'cond')}>
                <div className={classes.condNodeLabelContainer}>{data.label}</div>
            </Box>
        </React.Fragment>
    )
}
