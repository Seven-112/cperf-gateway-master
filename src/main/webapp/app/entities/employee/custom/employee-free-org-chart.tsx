import React, { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardActions, CardHeader, CircularProgress, Collapse, colors, IconButton, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, Tooltip, Typography } from '@material-ui/core';
import { API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src } from 'app/shared/util/helpers';
import axios from 'axios'
import { IEmployee } from 'app/shared/model/employee.model'
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Tree, TreeNode } from 'react-organizational-chart';
import { translate } from 'react-jhipster';
import { APP_LOGO_URI } from 'app/shared/util/constantes';

import { useDrag, useDrop } from 'react-dnd'
import clsx from 'clsx';
import { Add, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, More, MoreVert, Visibility } from '@material-ui/icons';
import EmployeeUpdateModal from './employee-update-modal';
import EmployeeDetail from './employee-detail';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import CustomAvatar from 'app/shared/component/custom-avatar';

const useStyles = makeStyles(theme =>({
    cardNodRoot:{
        // border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: `none`,
        borderRadius: '25px',
    },
    active:{
        border: `3px solid yellow`
    },
    cardActions:{
        padding:0,
        margin:0,
    },
    root:{
        height: '93vh',
        width: '102%',
        background: colors.blueGrey[50],
        marginTop: theme.spacing(-2),
        marginLeft: theme.spacing(-2),
    },
    collapsedRootNode:{
        '&+ul':{
            display: 'none',
        }
    },
    collapsedNode:{
        display: 'none',
    },
    collapsedTreeNode:{ // vertical link hidden style
        '&+ul':{
            '&::before':{
                display: 'none',
            },
            '&::after':{
                display: 'none',
            }
        }
    }
}))

const DraggableType = 'EmpChartNode';

const EmpChartNodeRootNode = (props: { 
    loading?: boolean, collpsed?: boolean,
    handleAdd?: Function, handleCollapse?: Function
}) =>{
    const classes = useStyles();

    const handleCollapse = () =>{
        if(props.handleCollapse)
            props.handleCollapse();
    }

    const handleAdd = () =>{
        if(props.handleAdd)
            props.handleAdd();
    }

    return (
        <Box display={"flex"} justifyContent={"center"} 
            className={clsx({ [classes.collapsedRootNode] : props.collpsed})}>
            <Card className={classes.cardNodRoot}>
                <CardHeader className=''
                    title={translate("_global.appName")}
                    avatar={<Avatar alt='' src={APP_LOGO_URI} />}
                    subheader={ props.loading ?
                    <Box mt={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <CircularProgress style={{ width: 15, height: 15, }}/>
                        <Typography variant='caption' className='ml-2'>Loading...</Typography>
                    </Box> : <></>}
                    action={
                        props.handleAdd ?
                            <Tooltip title={translate("_global.label.add")}>
                                <IconButton size="small" onClick={handleAdd}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        : <></>
                    }
                />
                <CardActions className={classes.cardActions}>
                    <Box width={1} m={0} p={0} display={"flex"} 
                        justifyContent={"center"} alignItems={"center"}>
                        {props.handleCollapse && !props.loading &&
                            <IconButton size='small' className='p-0' onClick={handleCollapse}>
                                {props.collpsed ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        }
                    </Box>
                </CardActions>
            </Card>
        </Box>
    )
}

const EmpChartNode = ( props : {emp: IEmployee, isActive?:boolean, 
        loading?: boolean, collpsed?: boolean,
        onDragged?: Function, 
        handleUpdate?: Function, handleCollapse?: Function,
        handleViewDetail?: Function, handleDelete?: Function}) =>{
    const { emp, isActive } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const classes = useStyles();
    
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: "NoDraggableType",
        item: emp,
       /*  end: () =>{
            if(props.onDragged)
                props.onDragged(emp);
        }, */
    }))

    const handleUpdate = (isNew?: boolean) =>{
        if(props.handleUpdate)
            props.handleUpdate(isNew);
        handleClose();
    }

    const handleViewDetail = () =>{
        if(props.handleViewDetail)
            props.handleViewDetail(emp);
        handleClose();
    }

    const handleDelete = () =>{
        if(props.handleDelete)
            props.handleDelete(emp);
        handleClose();
    }

    const handleCollapse = () =>{
        if(props.handleCollapse)
            props.handleCollapse();
    }


    return (
        <React.Fragment>
            <Box display={"flex"} justifyContent={"center"}>
                <Card className={clsx(classes.cardNodRoot, { [classes.active]: isActive })} ref={drag}>
                    <CardHeader className=''
                        title={`${emp.firstName} ${emp.lastName}`}
                        titleTypographyProps={{ variant: 'h5' }}
                        avatar={<CustomAvatar alt={emp.photoName} photoId={emp.photoId} />}
                        subheader={<Box width={1} display={"flex"} justifyContent={"center"} 
                            alignItems={"center"} flexDirection={"column"} flexWrap={"wrap"} overflow={"hidden"}>
                            {emp.department && <Typography variant='caption' className='text-info'>{emp.department.name}</Typography>}
                            {emp.fonction && <Typography variant='caption' className='text-primary'>{`${emp.fonction.name}`}</Typography>}
                            {props.loading && <Box mt={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <CircularProgress style={{ width: 15, height: 15, }}/>
                                <Typography variant='caption' className='ml-2'>Loading...</Typography>
                            </Box>}
                        </Box>}
                        action={
                            props.handleUpdate || props.handleViewDetail || props.handleDelete ?
                                <IconButton size="small" onClick={handleClick}>
                                <MoreVert />
                                </IconButton>
                            : <></>
                        }
                    />
                    <CardActions className={classes.cardActions}>
                        <Box width={1} m={0} p={0} display={"flex"} 
                            justifyContent={"center"} alignItems={"center"}>
                            {props.handleCollapse && !props.loading &&
                                <IconButton size='small' className='p-0' onClick={handleCollapse}>
                                    {props.collpsed ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            }
                        </Box>
                    </CardActions>
                    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
                        {props.handleViewDetail &&
                        <MenuItem onClick={handleViewDetail}>
                            <ListItemIcon>
                                <Visibility color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={translate("entity.action.view")} />
                        </MenuItem>}
                        {props.handleUpdate && <>
                        <MenuItem onClick={() => handleUpdate(false)}>
                            <ListItemIcon>
                                <Edit color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={translate("entity.action.edit")} />
                        </MenuItem>
                        <MenuItem onClick={() => handleUpdate(true)}>
                            <ListItemIcon>
                                <Add color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={translate("_global.label.add")} />
                        </MenuItem>
                        </>}
                        {props.handleDelete && !props.loading &&
                        <MenuItem onClick={handleDelete}>
                            <ListItemIcon>
                                <Delete color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={translate("entity.action.delete")} />
                        </MenuItem>}
                    </Menu>
                </Card>
            </Box>
        </React.Fragment>
    )
}


const EmpNode = (props: {emp: IEmployee, collapsed?: boolean,
    onChildDragged?: Function, onChildDelete?: Function}) =>{
    const [emp, setEmp] = useState(props.emp);
    const [children, setChildren] = useState<IEmployee[]>([]);
    const [loading, setLoading] = useState(false);
    const [openToUpdate, setOpenToUpdate] = useState(false)
    const [empToUpdate, setEmpToUpdate] = useState<IEmployee>(props.emp);
    const [openDetail, setOpenDetail] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const classes = useStyles();

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: DraggableType,
        // drop: (item: IEmployee, monitor) => {
        //     if (item && item.id && ![...children].some(c => c.id === item.id) && emp && item.id !== emp.id) {
        //         setLoading(true)
        //         const entity: IEmployee = { ...item, managerId: emp.id}
        //         axios.put<IEmployee>(`${API_URIS.employeeApiUri}/updateManager/${item.id}/${emp.id}`)
        //         .then(res =>{
        //             if(res.data)
        //                 setChildren([...children, item]);
        //         }).catch((e) => console.log(e))
        //         .finally(() => setLoading(false))
        //     }
        //     return emp;
        // },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const isActive = canDrop && isOver;

    const getChildreen = () =>{
        if(props.emp && props.emp.id)
        setLoading(true)
        axios.get<IEmployee[]>(`${API_URIS.employeeApiUri}/?managerId.equals=${props.emp.id}`)
            .then(res =>{
                setChildren(res.data);
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    useEffect(() =>{
        setEmp(props.emp)
        setEmpToUpdate(props.emp);
        getChildreen();
    }, [props.emp]);

    const onDragged = (daggedEmp?: IEmployee) =>{
        if(daggedEmp){
            setChildren([...children].filter(c => c.id !==daggedEmp.id))
        }
    }

    const handleUpdate = (isNew?: boolean) =>{
        if(emp){
            if(isNew)
                setEmpToUpdate({ id:null,department: emp.department, managerId: emp.id });
            else
                setEmpToUpdate(emp);
            setOpenToUpdate(true)
        }
    }

    const handleCloseUpdateModal = () =>{
        setEmpToUpdate({});
        setOpenToUpdate(false);
    }

    const onSave = (saved?: IEmployee, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setChildren([...children, saved])
            else
                setEmp(saved);
            setOpenToUpdate(false);
        }
    }

    const handleOpenDetail = () => setOpenDetail(true);

    const handleDelete = (empToDelete?: IEmployee) =>{
        if(empToDelete){
            setEmpToUpdate(empToDelete);
            setOpenToDelete(true);
        }
    }

    const onChildDelete = (deletedId) =>{
        if(deletedId)
            setChildren(children.filter(c => c.id !== deletedId));
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            if(props.onChildDelete)
                props.onChildDelete(deletedId);
            setOpenDetail(false);
        }
    }

    const handleCollapse = () => setCollapsed(!collapsed);

    const childrenNodes = [...children].map((child, index) =>(
        <EmpNode key={index} emp={child} collapsed={props.collapsed ||  collapsed} 
             onChildDragged={onDragged} onChildDelete={onChildDelete} /> ));
    

    return (
        <React.Fragment>
            {emp && <>
                <EmployeeUpdateModal 
                    open={openToUpdate} employee={empToUpdate}
                    onClose={handleCloseUpdateModal} onSave={onSave} />
                <EmployeeDetail open={openDetail} employee={emp} onClose={() => setOpenDetail(false)} />
                {empToUpdate && <EntityDeleterModal 
                    open={openToDelete}
                    entityId={empToUpdate.id}
                    urlWithoutEntityId={API_URIS.employeeApiUri}
                    onClose={() => setOpenToDelete(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.micropeopleEmployee.delete.question",
                                             {id: `${empToUpdate.firstName} ${empToUpdate.lastName}`})}
                />}
                <TreeNode label={<div ref={drop}
                     className={clsx({ 
                         [classes.collapsedTreeNode] : collapsed || props.collapsed,
                         [classes.collapsedNode] : props.collapsed
                     })}>
                    <EmpChartNode 
                        emp={emp} 
                        isActive={isActive} 
                        loading={loading} 
                        collpsed={collapsed} 
                        handleCollapse={children && children.length !== 0 ? handleCollapse : null}
                        handleUpdate={handleUpdate} handleViewDetail={handleOpenDetail}
                        handleDelete={!children || children.length === 0 ? handleDelete : null}
                        onDragged={props.onChildDragged ? (val) => props.onChildDragged(val) : null} />
                    </div>}>
                    {childrenNodes}
                </TreeNode>
            </>
            }
        </React.Fragment>
    )
}

interface IEmployeeFreeChartProps extends StateProps, DispatchProps{}

export const EmployeeFreeOrgChart = (props: IEmployeeFreeChartProps) =>{
    const classes = useStyles()
    const [managers, setManagers] = useState<IEmployee[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    
    const getManagers = () =>{
        setLoading(true)
        axios.get<IEmployee[]>(`${API_URIS.employeeApiUri}/?managerId.specified=false`)
            .then(res =>{
                setManagers(res.data);
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    const onDragged = (daggedEmp?: IEmployee) =>{
        if(daggedEmp && managers && managers.length > 1){
            setManagers([...managers].filter(c => c.id !==daggedEmp.id))
        }
    }

    useEffect(() =>{
        getManagers();
    }, []);

    const handleCollapse = () => setCollapsed(!collapsed);

    const handleAdd = () => setOpen(true);

    const onSave = (saved?: IEmployee, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setManagers([...managers, saved])
            else
                setManagers(managers.map(m => m.id === saved.id ? saved : m));
            setOpen(false);
        }
    }

    return (
        <React.Fragment>
            <Helmet><title>{`${translate("_global.appName")} | ${translate("_global.logigram.title")}`}</title></Helmet>
                <EmployeeUpdateModal 
                    open={open} employee={{}}
                    onClose={() => setOpen(false)} onSave={onSave} />
            <Box width={1} height={1} overflow={"auto"} 
                className={classes.root} display={"flex"}
                 justifyContent={"center"} alignItems={"center"}>
                <Tree  label={<EmpChartNodeRootNode
                        loading={loading}
                        collpsed={collapsed}
                        handleAdd={handleAdd}
                        handleCollapse={managers && managers.length !== 0 ? handleCollapse : null}
                        />}
                    lineBorderRadius='15px'
                    lineWidth='2px' lineColor={colors.lightBlue[900]}>
                    {[...managers].map((emp, index) =><EmpNode key={index} emp={emp} onChildDragged={onDragged} collapsed={collapsed} />) }
                </Tree> 
            </Box>
        </React.Fragment>
      )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
  });
  
  const mapDispatchToProps = {};
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(EmployeeFreeOrgChart);
