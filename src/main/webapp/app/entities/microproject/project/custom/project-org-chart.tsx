import { Box, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, IconButton, makeStyles, Radio, RadioGroup, TablePagination, TextField, Tooltip, Typography } from "@material-ui/core";
import { IProject } from "app/shared/model/microproject/project.model";
import { IRootState } from "app/shared/reducers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux";
import { getSession } from "app/shared/reducers/authentication";
import { getEntity as getUserExtra} from 'app/entities/user-extra/user-extra.reducer';
import { Helmet } from 'react-helmet';
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { useHistory } from "react-router-dom";
import OrganizationChart from "@dabeng/react-orgchart";
import ProjectChartNode from "./project-chart-node";
import clsx from "clsx";

const useStyles = makeStyles(theme =>({
    rootBox:{
        width: '97.5vw',
    },
    rootBoxShift:{
        width: `84.5vw`,
    },
    card:{
        boxShadow: 'none',
        border: 'none',
    },
    cardHeader: {
      paddingTop:2,
      paddingBottom:5,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
      borderBottom: `2px solid ${theme.palette.primary.dark}`,
      // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
    },
    searchBox:{
      flex: 1,
      marginRight: theme.spacing(5),
      marginLeft: theme.spacing(5),
      borderRadius: '10px',
      boxShadow:'none',
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.down('sm')]:{
       marginRight: theme.spacing(2),
       marginLeft: theme.spacing(2),
      },
      '&:hover':{
        border: '1px solid',
      }
    },
    cardContent:{
        padding:0,
    },
    treeRoot:{
        height: '81vh',
        // border: `1px solid ${theme.palette.primary.dark}`,
        // borderRadius: 5,
    },
    tree:{
        '& .rst__rowWrapper':{
            // border: '1px solid',
        },
        '& .rst__rowContents':{
            background: theme.palette.primary.dark,
            color: 'white',
            border: 'none',
            borderRadius: '0 10px 10px 0',
        },
        '& .rst__moveHandle':{
            // background: theme.palette.secondary.dark,
            // color: 'white',
            marginRight:0,
            border: 'none',
            height: '98,5%',
            borderRadius: 'none',
        },
        //  lienes block horizontal (links)
        '& .rst__lineBlock::before':{
                border: `1px solid ${theme.palette.primary.dark}`,
        },
        // lines blocks verticals(links)
        '& .rst__lineBlock::after':{
            border: `1px solid ${theme.palette.primary.dark}`,
        }
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    cardActions:{
      paddingTop:0,
      paddingBottom:0,
    },
    btn:{
        color: theme.palette.grey[300],
        padding:0,
        marginRight:10,
    },
    deleteBtn:{
        padding:0,
        marginRightt:10,
        color: theme.palette.secondary.main,
    },
    chart:{
        background: 'white',
        '& .oc-hierarchy::before':{
            borderColor: theme.palette.primary.main,
        },
        '& .oc-hierarchy> .oc-node::before':{
            background: theme.palette.primary.main,
        },
        '& .oc-hierarchy> .oc-node:not(:only-child)::after':{
            background: theme.palette.primary.main,
        }
    },
}))

interface ProjectOrgChartProps extends StateProps, DispatchProps{}

export const ProjectOrgChart = (props: ProjectOrgChartProps) =>{
    const { account, mainSideBarOpen } =  props;

    const orgchart = useRef<OrganizationChart>();

    const [treeData, setTreeData] = useState({});
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage]= useState(ITEMS_PER_PAGE);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [reloadProjects, setReloadProjects] = useState(false);
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(false);
    const [exportFileExtension, setexportFileExtension] = useState("png");
    const [exportFileName, setExportFileName] = useState(translate("_global.appName"))
    

    const classes = useStyles();

    const history = useHistory();
    

    const getTreeNotFromProject = (p: IProject) =>{
        return {
            id: p.id.toString(),
            title: p.label,
            project:p,
            children: [...projects].filter(item => item.parentId === p.id)
                     .sort((a, b) => a.id - b.id)
                     .map(child => getTreeNotFromProject(child))
        }
    }

    const loadTreeData = () =>{
        const parentProjects = [...projects].filter(p => !p.parentId);
        if(parentProjects && parentProjects.length !== 0){
          const data = {
            id: null,
            title: `${translate("_global.appName")}`,
            children: parentProjects.map(p =>getTreeNotFromProject(p))
          }
           setTreeData(data)
        }
    }

    const getChildrenProjects = (parents: IProject[]) =>{
        setReloadProjects(!reloadProjects)
        if(parents && parents.length !== 0){
            const parentIds = parents.map(p => p.id);
            // loading childreen
            axios.get<IProject[]>(`${API_URIS.projectApiUri}/?valid.equals=${true}&parentId.in=${parentIds}&sort=id`)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setProjects([...projects,...res.data])
                        getChildrenProjects([...res.data]);
                    }
                }).catch(e => console.log(e))
                .finally(() =>{
                    setLoading(false);
                    setReloadProjects(!reloadProjects)
                })
        }
    }

    const getParentProjects = (p?: number, rows?:number) =>{
        const page = (p || p === 0) ? p : activePage;
        const size = rows || itemsPerPage;
        setLoading(true)
        axios.get<IProject[]>(`${API_URIS.projectApiUri}/?valid.equals=${true}&parentId.spcified=false&page=${page}&size=${size}&sort=id,desc`)
            .then(res =>{
                if(res.data && res.data.length !== 0){
                    setProjects([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                    getChildrenProjects([...res.data])
                }else{
                    setProjects([])
                }
                setTotalItems(0)
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false);
                setReloadProjects(!reloadProjects)
            })
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
        getParentProjects();
    }, [])

    useEffect(() =>{
        loadTreeData();
    }, [reloadProjects])
  
    const handleChangeItemsPerpage = (event) =>{
        setItemsPerPage(parseInt(event.target.value, 10));
        getParentProjects(null, parseInt(event.target.value, 10));
      }
    
      const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getParentProjects(newPage);
      }

    const exportTo = () =>{
        if(orgchart && orgchart.current && orgchart.current.exportTo)
            orgchart.current.exportTo(exportFileName || translate("_global.appName"), exportFileExtension);
    }

    return (
        <React.Fragment>
        <Helmet>
            <title>{`${translate("_global.appName")} | ${translate("_global.label.projects")}`}</title>
        </Helmet>
            <Box boxShadow={10}
             className={clsx({ 
                [classes.rootBox]: !mainSideBarOpen, 
                [classes.rootBoxShift]: mainSideBarOpen 
            })}>
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" alignItems="center">
                            <IconButton 
                                aria-label="back" 
                                color="inherit"
                                className="mr-3"
                                onClick={() =>{ history.push('/project')}} 
                                title={translate("_global.label.projects")} style={{ padding: 0}}>
                            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                            </IconButton>
                            <Typography variant="h4">{translate("_global.label.projects")}</Typography>
                        </Box>}
                        action={
                               <Box display="flex" alignItems="center" flexWrap="wrap" pt={1}>
                                    <TextField
                                        value={exportFileName}
                                        onChange={(e) => setExportFileName(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        className="mr-3"
                                    />
                                    <FormControl variant="outlined" size="small">
                                        <RadioGroup
                                            aria-label="gender"
                                            value={exportFileExtension}
                                            name="radio-buttons-group"
                                            className="pt-2"
                                            row
                                            onChange={(e) => setexportFileExtension(e.target.value)}
                                        >
                                            <FormControlLabel value="png" control={<Radio color="primary"/>} label="PNG" />
                                            <FormControlLabel value="pdf" control={<Radio color="primary"/>} label="PDF" />
                                        </RadioGroup>
                                    </FormControl>
                                    <Tooltip 
                                            placement="left"
                                            title="export"
                                            classes={{
                                                tooltip: "bg-primary"
                                            }}
                                            onClick={exportTo}
                                            >
                                            <IconButton 
                                                color="primary"
                                                className="">
                                                <FontAwesomeIcon icon={faDownload} />
                                        </IconButton>
                                    </Tooltip>
                               </Box>
                            }
                        className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                        <Box width={1} p={1} className={classes.treeRoot}>
                            {treeData && [...projects].length !== 0 ? (
                                <OrganizationChart
                                    datasource={treeData}
                                    NodeTemplate={ProjectChartNode}
                                    ref={orgchart}
                                    chartClass={classes.chart}
                                    containerClass="border-0"
                                    zoom={true}
                                    pan={true}
                                />
                            ) : (
                                <Box width={1} height={1} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" color="primary">
                                        {loading ? 'loading...' : translate("microgatewayApp.microprojectProject.home.notFound")}
                                    </Typography>
                                </Box>
                            )
                            }
                        </Box>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <TablePagination 
                        component="div"
                        count={totalItems}
                        page={activePage}
                        onPageChange={handleChangePage}
                        rowsPerPage={itemsPerPage}
                        onChangeRowsPerPage={handleChangeItemsPerpage}
                        rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                        labelRowsPerPage={translate("_global.label.rowsPerPage")}
                        labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                        classes={{ 
                            root: classes.pagination,
                            input: classes.paginationInput,
                            selectIcon: classes.paginationSelectIcon,
                    }}/>
                    </CardActions>
                </Card>
            </Box>
        </React.Fragment>
    )
}

const mapStateToProps = ({ userExtra, authentication, drawer }: IRootState) => ({
    extraUser: userExtra.entity,
    account: authentication.account,
    mainSideBarOpen: drawer.mainSidebarOpen,
  });
  
  const mapDispatchToProps = {
    getSession,
    getUserExtra,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProjectOrgChart);