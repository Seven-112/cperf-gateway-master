import { TaskType } from 'app/shared/model/enumerations/task-type.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { ITask } from 'app/shared/model/microprocess/task.model';
import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { addEdge, Controls,
                   MiniMap, ReactFlowProvider, removeElements } from 'react-flow-renderer';
import { AcitivityNode, CondNode, DocNode, DraggableCond, EndNode, StartNode, SubAcitivityNode } from './logigram-node';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Backdrop, Box, CircularProgress, colors, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Translate, translate } from 'react-jhipster';
import { IEdgeInfo } from 'app/shared/model/microprocess/edge-info.model';
import { ICondNode } from 'app/shared/model/microprocess/cond-node.model';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';
import { API_URIS } from 'app/shared/util/helpers';
import { useHistory } from 'react-router-dom';
import TaskDetailModal from '../../task/custom/task-detail.modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { hasPrivileges } from 'app/shared/auth/helper';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';

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
  backButton:{
    color: theme.palette.primary.dark,
    padding: 0,
  },
  draggableCond:{
    position:'absolute',
    width: theme.spacing(3),
    height: theme.spacing(3),
    right: theme.spacing(3),
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

const taskApiUrl = 'services/microprocess/api/tasks';
const edgeApiUri =   'services/microprocess/api/edge-infos';
const condNodeApiUri = 'services/microprocess/api/cond-nodes';

const nodeTypes = {
    start: StartNode,
    activity: AcitivityNode,
    doc: DocNode,
    subactivity: SubAcitivityNode,
    cond: CondNode,
    end: EndNode,
}
export interface ILogigramProps extends StateProps, DispatchProps{
    process: IProcess,
    tasks: ITask[],
    readonly?: boolean,
    withoutBackButton?: boolean,
}

export const Logigram = (props: ILogigramProps) =>{
   const {process , account, readonly } = props;

   const [tasks, setTasks] = useState<ITask[]>(props.tasks);

   const [elements, setElements] = useState([]);

   const reactFlowWrapper = useRef(null);
   
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

   const classes = useStyles();

   const [open, setOpen] = useState(false);
  
   const [openBackdrop, setOpenBackdrop] = useState(false);

   const [clickedElement, setClickedElement] = useState(null);

   const canUpdate = !readonly && account && hasPrivileges({entities: ['Process','Task'], actions: [PrivilegeAction.UPDATE]}, account.authorities);
   const canDelete = !readonly && account && hasPrivileges({entities: ['Process','Task'], actions: [PrivilegeAction.DELETE]}, account.authorities);

   const history = useHistory();

   const getNodeCustomClassName = (task: ITask): string =>{
      if(task){
          const classNameByType = task.type === TaskType.DOC ? classes.docNode :
                task.type === TaskType.SUBACTIVITY ? classes.subActivityNode : 
                task.type === TaskType.START ? classes.startNode : 
                task.type === TaskType.END ? classes.endNode : classes.activityNode;
          if(process && process.modelId){
            if(task.status === TaskStatus.STARTED)
              return classes.node+ ' '+ classNameByType+' '+classes.statedNode;
            if(task.status === TaskStatus.COMPLETED)
              return classes.node+ ' '+ classNameByType+' '+classes.compltedNode;
            if(task.status === TaskStatus.CANCELED)
              return classes.node+ ' '+ classNameByType+' '+classes.canceledNode;
            if(task.status === TaskStatus.EXECUTED)
              return classes.node+ ' '+ classNameByType+' '+classes.executedNode;
            if(task.status === TaskStatus.SUBMITTED)
              return classes.node+ ' '+ classNameByType+' '+classes.submitteddNode;
              if(task.status === TaskStatus.ON_PAUSE)
                return classes.node+ ' '+ classNameByType+' '+classes.pausedNode;
            return classes.node+ ' '+ classNameByType+' '+classes.validNode;
          }
          return classes.node+ ' '+ classNameByType+' '+classes.validNode;
      }
      return classes.node+' '+classes.validNode;
   }

   const setNode = (task: ITask) =>{
    return {
       id: task.id.toString(),
       type: task.type ? task.type.toString().toLowerCase() : 'activity',
       data: {label: task.name, title: translate(`microgatewayApp.TaskStatus.${task.status.toString()}`)},
       position: { x:task.logigramPosX, y: task.logigramPosY },
       className: getNodeCustomClassName(task),
    }
 }

 const loadDynamicCondNodes = () =>{
    axios.get<ICondNode[]>(`${condNodeApiUri}/?processId.equals=${process.id}`).then(cndresp =>{
      if(cndresp.data && cndresp.data.length){
        const condNodes = [];
        for(let l=0; l<cndresp.data.length; l++){
          const condNode = cndresp.data[l];
          const cNode = {
              id: "cond"+condNode.id,
              type: 'cond',
              position: {x: condNode.logigramPosX, y: condNode.logigramPosY},
              data: { label: '' },
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
   axios.get<IEdgeInfo[]>(`${edgeApiUri}/?processId.equals=${process.id}&valid.equals=true`)
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
    if(props.tasks && props.tasks.length){
        const nodes = []
        props.tasks.forEach(task =>{
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

    const updateTask = (taskToUpdate: ITask) =>{
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
       if(canUpdate){
          const edge: IEdgeInfo = {...params, processId: process.id, valid: true};
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
        if(clickedElement && canDelete){
          // deleting edges with source or target equals cliecked element id
          axios.delete(`${edgeApiUri}/bySourceOrTarget?source=${clickedElement.id}&target=${clickedElement.id}`)
          .then(() =>{}).catch((e) =>{ console.log(e)});
        }
    }

    const onLoad = (_reactFlowInstance) => {
      setReactFlowInstance(_reactFlowInstance);
    };

    const onNodeDragStop = (event, node) => {
      if(node && node.id){
        const nodePos = {x: Number(node.position.x), y: Number(node.position.y)}
        if(!node.id.includes("cond")){
          const task: ITask = tasks.find(t => t.id.toString() === node.id.toString());
          if(task){
             task.logigramPosX = nodePos.x,
             task.logigramPosY = nodePos.y,
             axios.put(taskApiUrl, cleanEntity(task));
          }
        }else{ 
          // update cond pos
          const condId = node.id.substring(4, node.id.length);
          if(condId){
            const nodeCond : ICondNode = {
                id: Number(condId),
                logigramPosX: nodePos.x,
                logigramPosY: nodePos.y,
                processId: process.id,
            }
            axios.put(condNodeApiUri, cleanEntity(nodeCond));
          }
        } 
      }
    }

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
      event.preventDefault();
      if(canUpdate){
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const condNode: ICondNode = {
          logigramPosX: position.x,
          logigramPosY: position.y,
          processId: process.id,
        }

        axios.post<ICondNode>(condNodeApiUri, cleanEntity(condNode)).then(rsp =>{
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

    const updateElementByTask = (refTask: ITask) =>{
        const elmnts = elements.filter(elItem => elItem.id !== refTask.id.toString());
        elmnts.push(setNode(refTask));
        setElements([...elmnts])

    }

     // gets called after end of edge gets dragged to another source or target
        const onEdgeUpdate = (oldEdge, newConnection) =>{

          /* eslint-disable no-console */
          console.log(oldEdge);
          
          /* eslint-disable no-console */
          console.log(newConnection);
        }
        
       const onConnect = (params) => {
         if(canUpdate){
          params.label = getConEdgeLabel(params.source, params.sourceHandle);
          setElements((els) => addEdge(params, els));
          saveLinks(params);
         }
       }

       const onElementsRemove = (elementsToRemove) =>{
         if(clickedElement && canDelete){
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
       

       const updateDependStartupTaskNodes = (task: ITask) =>{
          // update statup depnd tasks
         /* getTaskDependeciesByTag(task, Tag.TASKSTARTING).then(res =>{
              if(res.data && res.data.length){
                const ids = res.data.map(stk => stk.dependencyId);
                axios.get<ITask[]>(`${API_URIS.taskApiUri}/?id.in=${ids}`).then(response =>{
                  const tsks: ITask[] = response.data;
                  if(tsks && tsks.length){
                    setElements((els) => els.map(el =>{
                        const finedTask = tsks.find(tsk => tsk.id.toString() === el.id);
                        if(finedTask){
                          if(finedTask.status && finedTask.status === TaskStatus.VALID)
                            finedTask.status = TaskStatus.STARTED;
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

       const updateChildsTaskNodes = (task: ITask) =>{
        axios.get<ITask[]>(`${API_URIS.taskApiUri}/?parentId.equals=${task.id}`).then(response =>{
          const tsks: ITask[] = response.data;
          if(tsks && tsks.length){
            setElements((els) => els.map(el =>{
                const finedTask = tsks.find(tsk => tsk.id.toString() === el.id);
                if(finedTask){
                  if(finedTask.status && finedTask.status === TaskStatus.VALID)
                    finedTask.status = TaskStatus.STARTED;
                  updateTask(finedTask)
                  el.className = getNodeCustomClassName(finedTask);
                }
               return el; 
            }))
          }
        }).catch(() =>{})
       }

       const handleCloseTaskDetailModal  = (editedTask?: ITask) =>{
          if(editedTask)
            updateTask(editedTask);
          setOpen(false);
       }

       const handleBack = () =>{
        /*  if(process && process.modelId)
           history.push('/instance/'+process.modelId);
         else
            history.push('/process'); */
          history.goBack();
       }

       const handleTaskUpdate = (updated?: ITask) =>{
          if(updated && updated.id){
            setTasks(tasks.map(t => t.id === updated.id ? updated : t));
            setElements(elements.map(el => el.id === updated.id.toString() ? setNode(updated) : el))
          }
       }

    return (
        <React.Fragment>
                {<TaskDetailModal open={open} taskId={clickedElement ? clickedElement.id : null} 
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
                          {process.modelId ? 'Instance' : translate('microgatewayApp.microprocessProcess.detail.title')}&nbsp;:&nbsp;{<MyCustomPureHtmlRender body={process.label} renderInSpan />}
                      </Typography>
                      <Box>
                        {(tasks && tasks.length > 0 && canUpdate) && <DraggableCond 
                          data={{ label: '', className: classes.draggableCond }}/> }
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

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logigram)