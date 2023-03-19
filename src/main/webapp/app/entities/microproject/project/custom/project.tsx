import { faPlus, faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TablePagination, Tooltip, Typography } from "@material-ui/core";
import { hasPrivileges } from "app/shared/auth/helper";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IRootState } from "app/shared/reducers";
import { getSession } from "app/shared/reducers/authentication";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import { IProject } from "app/shared/model/microproject/project.model";
import axios from 'axios';
import { AccountTree, ChevronRight, ExpandMore } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { TreeView } from "@material-ui/lab";
import ProjectTreeItem from "./project-tree-item";
import ProjectUpdate from "./project-update";

const useStyles = makeStyles(theme =>({
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
    cardContent:{
        padding:0,
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

    treeView:{
        // background: '#458785',
    }
}))

interface PropjectProps extends StateProps, DispatchProps{}

export const Project = (props: PropjectProps) =>{
    const { account } =  props;
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage]= useState(ITEMS_PER_PAGE);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [totalItems, setTotalItems] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false);

    const [openToUpdate, setOpenToUpdate] = useState(false);

    const canUpdate = account && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.UPDATE]}, account.authorities);

    const classes = useStyles();

    const history = useHistory();


    const getParentProjects = (p?: number, rows?:number) =>{
        const page = (p || p === 0) ? p : activePage;
        const size = rows || itemsPerPage;
        setLoading(true)
        axios.get<IProject[]>(`${API_URIS.projectApiUri}/?valid.equals=${true}&parentId.specified=false&page=${page}&size=${size}&sort=path`)
            .then(res =>{
                setProjects([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'], 10))
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false);
            })
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
        getParentProjects();
    }, [])

    const handleSearchChange = (e) =>{
      setSearchValue(e.target.value);
    }
  
    const handleChangeItemsPerpage = (event) =>{
      setItemsPerPage(parseInt(event.target.value, 10));
      getParentProjects(null, parseInt(event.target.value, 10));
    }
  
    const handleChangePage = (event, newPage) =>{
      setActivePage(newPage);
      getParentProjects(newPage);
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setProjects([...projects].filter(p => p.id !== deletedId))
        }
    }

    const onUpdate = (saved?: IProject, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setProjects([saved,...projects])
            else
                setProjects(projects.map(p => p.id === saved.id ? saved : p));
            setOpenToUpdate(false);
        }
    }

    const searchFilter = (p?: IProject) =>{
        if(p){
            const term = !searchValue ? '' : searchValue.toLowerCase();
            return (!p.label || p.label.toLowerCase().includes(term));
        }
        return false;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("_global.label.projects")}`}</title>
            </Helmet>
            <ProjectUpdate
                open={openToUpdate}
                project={{}}
                onClose={() => setOpenToUpdate(false)}
                onSave={onUpdate}
            />
            <Box width={1} boxShadow={3}>
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" justifyContent="space-between" alignItems="center">
                            <FontAwesomeIcon icon={faTasks}  className="mr-3"/>
                            <Typography variant="h4">{translate("_global.label.projects")}</Typography>
                            <CardSubHeaderInlineSearchBar
                                onChange = {handleSearchChange}
                            />
                        </Box>}
                        action={<>
                            {account && hasPrivileges({ entities: ['Project'], actions: [PrivilegeAction.CREATE]}, account.authorities) &&
                               <Box display="flex" alignItems="center" flexWrap="wrap" pt={1}>
                               <Tooltip 
                                    placement="left"
                                    title={translate("microgatewayApp.microprojectProject.home.createOrEditLabel")}
                                    classes={{
                                        tooltip: "bg-primary"
                                    }}
                                    onClick={() =>setOpenToUpdate(true)}>
                                    <IconButton 
                                        color="primary"
                                        className="">
                                        <FontAwesomeIcon icon={faPlus} />
                                </IconButton>
                               </Tooltip>
                                {/* <Tooltip 
                                    placement="left"
                                    title={translate("_global.employeeOrg.menu.index")}
                                    classes={{
                                        tooltip: "bg-primary"
                                    }}
                                    onClick={() => history.push(`/project/org`)}>
                                        <IconButton 
                                            color="primary"
                                            className="">
                                            <AccountTree />
                                    </IconButton>
                                </Tooltip> */}
                               </Box>
                            }
                        </>}
                        className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                        <Box width={1} p={1}>
                            {projects && projects.length !== 0 ? (
                                <TreeView 
                                    aria-label="Project tree"
                                    defaultCollapseIcon={<ExpandMore />}
                                    defaultExpandIcon={<ChevronRight />}
                                    className={classes.treeView}>
                                    {[...projects].filter(p =>searchFilter(p)).map((p, index) =>(
                                        <ProjectTreeItem 
                                         key={index}
                                         project={p}
                                         searchTerm={searchValue}
                                         account={props.account} 
                                         onUpdate={onUpdate}
                                         onDelete={onDelete}
                                        />
                                    ))}
                                </TreeView>
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

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Project);