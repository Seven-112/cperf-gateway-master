import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { addEdge, Controls,
                   MiniMap, ReactFlowProvider, removeElements } from 'react-flow-renderer';
import { AcitivityNode, CondNode, DocNode, DraggableCond, EndNode, StartNode, SubAcitivityNode } from 'app/entities/microprocess/process/custom/logigram-node';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Backdrop, Box, CircularProgress, colors, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Translate, translate } from 'react-jhipster';
import { API_URIS } from 'app/shared/util/helpers';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';
import { IProject } from 'app/shared/model/microproject/project.model';
import { ProjectTaskType } from 'app/shared/model/enumerations/project-task-type.model';
import { ProjectTaskStatus } from 'app/shared/model/enumerations/project-task-status.model';
import { IProjectEdgeInfo } from 'app/shared/model/microproject/project-edge-info.model';
import { IProjectCondNode } from 'app/shared/model/microproject/project-cond-node.model';
import ProjectTaskDetailModal from '../../project-task/custom/project-task-detail.modal';

const useStyles = makeStyles(theme => ({
  root:{
  },
  flowContainer:{
    flexGrow: 1,
    borderColor: theme.palette.primary.dark,
    borderRadius: '0 0 5px 5px',
    background: theme.palette.background.paper,
  },
  flowtopBar:{
    color: theme.palette.primary.dark,
    background: theme.palette.background.paper,
  },
  flowCanvas:{
  },
  backButton:{
    color: theme.palette.primary.dark,
    padding: 0,
  },
  draggableCond:{
    // position:'absolute',
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(-1.5),
    textAlign: 'center',
    cursor: 'move',
    border: '5px solid',
    borderColor: theme.palette.primary.dark,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  hiddenSidebar:{
    width: '1px',
  },
  sidebar:{
      width: theme.spacing(30),
  },
  // nodes styles
    node:{
      padding: 0,
      maxWidth: theme.spacing(15),
      maxHeight: theme.spacing(10),
      // border: '1px solid',
      fontSize: '7px',
  },
  startNode:{
      borderRadius: theme.spacing(50),
  },
  activityNode:{
      borderRadius: 0,
  },
  subActivityNode:{
      borderRadius: 0,
  },
  docNode:{
    borderRadius: '5px 0 7px 0',
  },
  endNode:{
      borderRadius: theme.spacing(50),
  },
  condNode:{
      maxWidth: theme.spacing(40),
      maxHeight: theme.spacing(10),
      transform: "rotate(45deg)",
      height: theme.spacing(4.5),
      width: theme.spacing(4.5),
      padding: 0,
  },
  validNode:{
      backgroundColor: colors.grey[300],
      color: theme.palette.primary.main,
      borderColor: colors.blueGrey[500],
  },
  statedNode:{
      background: colors.yellow[500],
      borderColor: colors.orange[500],
      color: theme.palette.primary.dark,
  },
  pausedNode:{
    background: colors.blueGrey[300],
    borderColor: colors.blueGrey[300],
    color: theme.palette.primary.dark,
  },
  executedNode:{
    background: theme.palette.primary.main,
    borderColor: theme.palette.primary.dark,
    color: theme.palette.background.paper,
  },
  submitteddNode:{
    background: colors.cyan[300],
    borderColor: colors.cyan[100],
    color: theme.palette.background.paper,
  },
  compltedNode:{
    background: colors.green.A400,
    borderColor: colors.green[500],
    color: theme.palette.background.paper,
  },
  canceledNode:{
    background: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.dark,
    color: theme.palette.background.paper,
  },
}))

const taskApiUrl = API_URIS.projectTaskApiUri;
const edgeApiUri =  API_URIS.projectEdgeInfoApiUri;
const condNodeApiUri = API_URIS.projectCondNodeApiUri;

const nodeTypes = {
    start: StartNode,
    activity: AcitivityNode,
    doc: DocNode,
    subactivity: SubAcitivityNode,
    cond: CondNode,
    end: EndNode,
}
export interface ILogigramProps{
    project: IProject,
    tasks: IProjectTask[],
    withoutBackButton?: boolean,
    readonly?:boolean,
}

export const ProjectLogigram = (props: ILogigramProps) =>{
   const {project, readonly } = props;

   const [tasks, setTasks] = useState<IProjectTask[]>(props.tasks);

   const [elements, setElements] = useState([]);

   const reactFlowWrapper = useRef(null);
   
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

   const classes = useStyles();

   const [open, setOpen] = useState(false);
  
   const [openBackdrop, setOpenBackdrop] = useState(false);

   const [clickedElement, setClickedElement] = useState(null);

   const history = useHistory();

   const getNodeCustomClassName = (task: IProjectTask): string =>{
      if(task){
          const classNameByType = task.type === ProjectTaskType.DOC ? classes.docNode :
                task.type === ProjectTaskType.SUBACTIVITY ? classes.subActivityNode : 
                task.type === ProjectTaskType.START ? classes.startNode : 
                task.type === ProjectTaskType.END ? classes.endNode : classes.activityNode;
          if(project && project.valid){
            if(task.status === ProjectTaskStatus.STARTED)
              return classes.node+ ' '+ classNameByType+' '+classes.statedNode;
            if(task.status === ProjectTaskStatus.EXECUTED)
              return classes.node+ ' '+ classNameByType+' '+classes.executedNode;
            if(task.status === ProjectTaskStatus.SUBMITTED)
              return classes.node+ ' '+ classNameByType+' '+classes.submitteddNode;
            if(task.status === ProjectTaskStatus.COMPLETED)
              return classes.node+ ' '+ classNameByType+' '+classes.compltedNode;
            if(task.status === ProjectTaskStatus.CANCELED)
              return classes.node+ ' '+ classNameByType+' '+classes.canceledNode;
            if(task.status === ProjectTaskStatus.ON_PAUSE)
              return classes.node+ ' '+ classNameByType+' '+classes.pausedNode;
            return classes.node+ ' '+ classNameByType+' '+classes.validNode;
          }
          return classes.node+ ' '+ classNameByType+' '+classes.validNode;
      }
      return classes.node+' '+classes.validNode;
   }

   const setNode = (task: IProjectTask) =>{
    return {
       id: task.id.toString(),
       type: task.type ? task.type.toString().toLowerCase() : 'activity',
       data: {label: task.name},
       position: { x:task.logigramPosX, y: task.logigramPosY },
       className: getNodeCustomClassName(task),
    }
 }

 const loadDynamicCondNodes = () =>{
    axios.get<IProjectCondNode[]>(`${condNodeApiUri}/?projectId.equals=${project.id}`).then(cndresp =>{
      if(cndresp.data && cndresp.data.length){
        const condNodes = [];
        for(let l=0; l<cndresp.data.length; l++){
          const condNode = cndresp.data[l];
          const cNode = {
              id: "cond"+condNode.id,
              type: 'cond',
              position: {x: condNode.logigramPosX, y: condNode.logigramPosY},
              data: { label: 'cond' },
              className: classes.condNode,
          }
          condNodes.push(cNode);
        }
        setElements((els) => els.concat(condNodes));
      }
    }).catch(e =>{
      /* eslint-disable no-console */
       console.log(e);
    })
 }

 const getConEdgeLabel = (source: string, sourceHandle: string) =>{
    /* if(source && source.toLowerCase().includes("cond") && sourceHandle){
      if(sourceHandle === 'rh')
        return translate("_global.label.no");
      if(sourceHandle === 'bh')
      return translate("_global.label.yes");
    } */
    return null;
 }

 const laodDynamicEdges = () =>{
   axios.get<IProjectEdgeInfo[]>(`${edgeApiUri}/?processId.equals=${project.id}&valid.equals=true`)
      .then(resp =>{
          if(resp.data && resp.data.length){
            const edges = [];
            for(let k=0; k<resp.data.length; k++){
              const edgeIfo = resp.data[k];
              const edge = { ... edgeIfo, 
                 id: edgeIfo.id.toString(),
                 type: 'step',
                 label: getConEdgeLabel(edgeIfo.source,edgeIfo.sourceHandle),
                 animated: false,
                 labelBgPadding:[0, 0],
                 labelStyle: {fontSize: '6px'}
                };
               delete edge.processId;
               delete edge.valid;
               edges.push(edge);
            }
            setElements((els) => els.concat(edges));
          }
      }).catch(e =>{
        /* eslint-disable no-console */
          console.log(e);
      })
 }

 const initializeElements = () =>{
  /* eslint-disable no-console */
    console.log("in initializeElements");
    if(tasks && tasks.length){
        const nodes = []
        tasks.forEach(task =>{
            nodes.push(setNode(task));
          })
       setElements([...nodes]);
       loadDynamicCondNodes();
       laodDynamicEdges();
    }
 }
   
    useEffect(() =>{
      setTasks(props.tasks);
      initializeElements();
    }, [props.tasks])

    useEffect(() =>{
          if(reactFlowInstance)
            reactFlowInstance.fitView();
    }, [reactFlowInstance])

    const updateTask = (taskToUpdate: IProjectTask) =>{
      const updatedTasks = tasks.map(taskItem =>{
         if(taskItem.id === taskToUpdate.id)
          return taskToUpdate;
         return taskItem;
      })
      setTasks([...updatedTasks]);
    }
    
    const getElementCategorie =(element) =>{
      if(element)
        return (element.source || element.target) ? 'edge' : element.type === 'cond' ? 'cond': 'task';
      return null;
    }

    const saveLinks = (params) =>{
        if(!readonly){
        const edge: IProjectEdgeInfo = {...params, processId: project.id, valid: true};
        axios.post(edgeApiUri, cleanEntity(edge))
          .then((res) =>{
             if(res.data){
                params.label = getConEdgeLabel(params.source, params.sourceHandle);
                setElements((els) => addEdge(params, els));
             }
             setOpenBackdrop(false); 
          }).catch(e =>{
               console.log(e);
               setOpenBackdrop(false);
          });
        }
    }
    
    const deletClieckElementEdgesOnDB = () =>{
        if(clickedElement && !readonly){
          // deleting edges with source or target equals cliecked element id
          axios.delete(`${edgeApiUri}/bySourceOrTarget?source=${clickedElement.id}&target=${clickedElement.id}`)
          .then(() =>{}).catch((e) =>{ console.log(e)});
        }
    }

    const onLoad = (_reactFlowInstance) => {
      setReactFlowInstance(_reactFlowInstance);
    };

    const onNodeDragStop = (event, node) => {
      if(!readonly){
        if(node && node.id){
          const nodePos = {x: Number(node.position.x), y: Number(node.position.y)}
          if(!node.id.includes("cond")){
            const task: IProjectTask = tasks.find(t => t.id.toString() === node.id.toString());
            if(task){
               task.logigramPosX = nodePos.x,
               task.logigramPosY = nodePos.y,
               axios.put(taskApiUrl, cleanEntity(task));
            }
          }else{ 
            // update cond pos
            const condId = node.id.substring(4, node.id.length);
            if(condId){
              const nodeCond : IProjectCondNode = {
                  id: Number(condId),
                  logigramPosX: nodePos.x,
                  logigramPosY: nodePos.y,
                  projectId: project.id,
              }
              axios.put(condNodeApiUri, cleanEntity(nodeCond));
            }
          } 
        }
      }else{
        event.preventDefault();
      }
    }

    const onDragOver = (event) => {
      event.preventDefault();
      if(!readonly)
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
      event.preventDefault();
      if(!readonly){
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('project/reactflow');
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const condNode: IProjectCondNode = {
          logigramPosX: position.x,
          logigramPosY: position.y,
          projectId: project.id,
        }

        axios.post<IProjectCondNode>(condNodeApiUri, cleanEntity(condNode)).then(rsp =>{
            if(rsp.data){
              const newNode = {
                id: "cond"+rsp.data.id,
                type,
                position,
                data: {label: 'cond'},
                className: classes.condNode,
              };
              setElements((es) => es.concat(newNode))
            }
        }).catch(e =>{
          /* eslint-disable no-console */
          console.log(e);
        })
      }
    };

    const updateElementByTask = (refTask: IProjectTask) =>{
       if(!readonly){
        const elmnts = elements.filter(elItem => elItem.id !== refTask.id.toString());
        elmnts.push(setNode(refTask));
        setElements([...elmnts])
       }
    }

     // gets called after end of edge gets dragged to another source or target
        const onEdgeUpdate = (oldEdge, newConnection) =>{

          /* eslint-disable no-console */
          console.log(oldEdge);
          
          /* eslint-disable no-console */
          console.log(newConnection);
        }
        
       const onConnect = (params) => {
         if(!readonly){
          params.label = getConEdgeLabel(params.source, params.sourceHandle);
          setElements((els) => addEdge(params, els));
          saveLinks(params);
         }
       }

       const onElementsRemove = (elementsToRemove) =>{
         if(clickedElement && !readonly){
            const catElement = (clickedElement.source || clickedElement.target) ? 'edge' : clickedElement.type==="cond" ? "cond" : "task";
            // console.log(clickedElement);
            if(catElement !== "task"){
              // proceced to remove
              setElements((els) => removeElements(elementsToRemove, els));
              if(catElement === 'cond'){
                const elementsToRemoveId = clickedElement.id.substring(4, clickedElement.id.length);
                axios.delete(`${condNodeApiUri}/${elementsToRemoveId}`).then(() =>{}).catch(() =>{});
                deletClieckElementEdgesOnDB();
              }
              else{
                axios.delete(`${edgeApiUri}/${clickedElement.id}`).then(() =>{}).catch(() =>{});
              }
              setClickedElement(null);
            }
         }
       }

       const onElementClick = (event, element) => {
          setClickedElement(element);
          setOpen(true);
       };
       

       const updateDependStartupTaskNodes = (task: IProjectTask) =>{
          // update statup depnd tasks
         /* getTaskDependeciesByTag(task, Tag.TASKSTARTING).then(res =>{
              if(res.data && res.data.length){
                const ids = res.data.map(stk => stk.dependencyId);
                axios.get<IProjectTask[]>(`${API_URIS.taskApiUri}/?id.in=${ids}`).then(response =>{
                  const tsks: IProjectTask[] = response.data;
                  if(tsks && tsks.length){
                    setElements((els) => els.map(el =>{
                        const finedTask = tsks.find(tsk => tsk.id.toString() === el.id);
                        if(finedTask){
                          if(finedTask.status && finedTask.status === ProjectTaskStatus.VALID)
                            finedTask.status = ProjectTaskStatus.STARTED;
                          updateTask(finedTask);
                          el.className = getNodeCustomClassName(finedTask);
                        }
                       return el; 
                    }))
                  }
                }).catch(() =>{})
             }
          }).catch((e) =>{
            /* eslint-disable no-console 
            console.log('deer',e);
          }) */
       }

       const updateChildsTaskNodes = (task: IProjectTask) =>{
        axios.get<IProjectTask[]>(`${API_URIS.taskApiUri}/?parentId.equals=${task.id}`).then(response =>{
          const tsks: IProjectTask[] = response.data;
          if(tsks && tsks.length){
            setElements((els) => els.map(el =>{
                const finedTask = tsks.find(tsk => tsk.id.toString() === el.id);
                if(finedTask){
                  if(finedTask.status && finedTask.status === ProjectTaskStatus.VALID)
                    finedTask.status = ProjectTaskStatus.STARTED;
                  updateTask(finedTask)
                  el.className = getNodeCustomClassName(finedTask);
                }
               return el; 
            }))
          }
        }).catch(() =>{})
       }

       const handleCloseTaskDetailModal  = (editedTask?: IProjectTask) =>{
          if(editedTask)
            updateTask(editedTask);
          setOpen(false);
       }

       const handleBack = () =>{
            history.push('/project');
       }

       const handleTaskUpdate = (updated?: IProjectTask) =>{
          if(updated && updated.id){
            setTasks(tasks.map(t => t.id === updated.id ? updated : t));
            setElements(elements.map(el => el.id === updated.id.toString() ? setNode(updated) : el))
          }
       }

    return (
        <React.Fragment>
                {<ProjectTaskDetailModal open={open} taskId={clickedElement ? clickedElement.id : null} 
                  onClose={handleCloseTaskDetailModal} onUpdate={handleTaskUpdate} />}
             <Box width={1} display="flex" flexDirection="column" height="90vh" overflow="auto"
              boxShadow="-1px -1px 7px">
                  <ReactFlowProvider>
                  <Box width={1}
                    display="flex" 
                    justifyContent="space-between"
                    overflow="auto"
                    alignItems="center"
                    border="none"
                    borderBottom='none'
                    boxShadow={3}
                    p={1}
                    borderRadius="5px 5px 0 0"
                    className={classes.flowtopBar}>
                    {!props.withoutBackButton &&
                    <IconButton aria-label="back" 
                      title="go to back"
                       onClick={handleBack}
                       className={classes.backButton}>
                       <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </IconButton>}
                      <Typography color="inherit" variant="h4">
                          {translate('microgatewayApp.microprojectProject.detail.title')}&nbsp;:&nbsp;{project.label}
                      </Typography>
                      <Box>
                        {(tasks && tasks.length !== 0 && !readonly) && <DraggableCond 
                          data={{ label: 'cond', className: classes.draggableCond }}/> }
                      </Box>
                    </Box>
                    <Box className={classes.flowContainer} boxShadow={3}>
                      {(!tasks || !tasks.length) && 
                          <Typography color="primary" variant="h3" className="mt-5 text-info text-center">
                            <Translate contentKey="microgatewayApp.microprocessTask.home.notFound">No Tasks found</Translate>
                        </Typography>
                      }
                      <div style={{ height: 600, overflow:'auto', }} ref={reactFlowWrapper}>
                      <Backdrop className={classes.backdrop} open={openBackdrop}>
                        <CircularProgress color="inherit" />
                      </Backdrop>
                        <ReactFlow elements={elements} 
                              nodeTypes={nodeTypes}
                              onLoad={onLoad}
                              onEdgeUpdate={onEdgeUpdate}
                              onConnect={onConnect}
                              onNodeDragStop={onNodeDragStop}
                              onDrop={onDrop}
                              onDragOver={onDragOver}
                              onElementsRemove={onElementsRemove}
                              onElementClick={onElementClick}
                              className={classes.flowCanvas}
                              >
                            <Controls/>
                            <MiniMap
                                nodeColor={(node) => {
                                    switch (node.type) {
                                    case 'activity': return 'blue';
                                    case 'subactivity': return '#00ff00';
                                    case 'doc': return 'rgb(255,0,255)';
                                    case 'start': return 'rgb(255,255,0)';
                                    case 'end': return 'rgb(255,0,0)';
                                    default: return 'grey';
                                    }
                                }}
                                />
                        </ReactFlow>
                      </div>
                    </Box>
                  </ReactFlowProvider>
             </Box>
        </React.Fragment>
    );
}

export default ProjectLogigram;