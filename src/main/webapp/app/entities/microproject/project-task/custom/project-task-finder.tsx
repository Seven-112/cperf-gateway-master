import { Box, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Typography } from "@material-ui/core";
import { IProjectTask } from "app/shared/model/microproject/project-task.model";
import { IProject } from "app/shared/model/microproject/project.model";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import MyCustomModal from "app/shared/component/my-custom-modal";
import { Assignment } from "@material-ui/icons";
import { translate } from "react-jhipster";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    cardActions:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 15px 15px',
    },
    input: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 0,
      color: theme.palette.primary.dark,
      border: 'none',
      borderRadius: 15,
      '&:hover':{
        border: `1px solid ${theme.palette.primary.dark}`,
      }
    },
    fileIllustattionAvatar:{
        width: 50,
        height: 50,
        fontSize: theme.spacing(6),
    },
    fileIllustattionBox:{
        cursor: 'pointer',
        '&:hover':{
            border: `1px solid ${theme.palette.secondary.dark}`,
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
    catSelect:{
        height:theme.spacing(3),
        fontSize:15,
        color: theme.palette.primary.dark,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
}))

interface ProjectTaskFinderProps{
    project: IProject,
    excludedProjectIds?: any[],
    preSelected?: IProjectTask[],
    multiple?:boolean,
    onSelectChange?: Function,
    loading?: boolean,
    open?: boolean,
    onClose: Function,
}

export const ProjectTaskFinder = (props: ProjectTaskFinderProps) =>{
    const { open, multiple } = props;

    const [searchValue, setSearchValue] = useState('')

    const [tasks, setTasks] = useState<IProjectTask[]>([]);

    const [selected, setSelected] = useState([...props.preSelected]);

    const [loading, setLoading] = useState(props.loading);

    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();

    const getTasks = (p?: number, rows?: number) => {
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        let requestUri = `${API_URIS.projectTaskApiUri}`;
        if(props.project && props.project.id)
            requestUri = `${requestUri}/?valid.equals=${true}&processId.equals=${props.project.id}&`;
        else
            requestUri = `${requestUri}/getByProjectIdNotIn/?ids=${[...props.excludedProjectIds].join(',')}`;
        requestUri = `${requestUri}&page=${page}&siz=${size}`;
        axios.get<IProjectTask[]>(requestUri)
        .then(res =>{
            setTasks(res.data);
            setTotalItems(parseInt(res.headers['x-total-count'], 10))
        }).catch(e => console.log(e))
        .finally(() => setLoading(false))
    }

    useEffect(() =>{
        getTasks();
    }, [props.project])

    useEffect(() =>{
        setSelected(props.preSelected);
    }, [props.preSelected])

    useEffect(() =>{
        setLoading(props.loading)
    }, [props.loading])
    

    const handleSearchChange = (e) =>{
        setSearchValue(e.target.value);
    }

    const handleChangeItemsPerpage = (event) =>{
        setItemsPerPage(parseInt(event.target.value, 10));
        getTasks(0, parseInt(event.target.value, 10));
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getTasks(newPage);
    }


    const toogleSelect = (t?: IProjectTask) =>{
        if(t){
            if([...selected].some(s => s.id === t.id)){
                setSelected(selected.filter(s => s.id !== t.id))
                if(props.onSelectChange)
                    props.onSelectChange(t, false);
            }
            else{
                setSelected([...selected, t]);
                if(props.onSelectChange)
                    props.onSelectChange(t, true);
            }
        }
    }

 const handleClose = () => props.onClose();


  const getListItems = (items: IProjectTask[]) => (
       [...items].filter(t => t.name && t.name.toLowerCase().includes(searchValue.toLowerCase()))
       .map((task, index) =>(
            <ListItem key={index} button onClick={() => toogleSelect(task)}>
                <ListItemText
                    primary={task.name}
                />
                <ListItemSecondaryAction onClick={() => toogleSelect(task)}>
                    <Checkbox color="primary" checked={[...selected].some(s => s.id === task.id)}/>
                </ListItemSecondaryAction>
            </ListItem>
       ))
  )

    return (
        <React.Fragment>
        <MyCustomModal open={open} onClose={handleClose}>
            <Card className={classes.card}
                title={translate("microgatewayApp.microprojectProjectTask.home.title")}
            >
                <CardHeader
                        title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Assignment  className="mr-3"/>
                            {props.project && <Typography>
                                {`${translate("microgatewayApp.microprojectProject.detail.title")} : ${props.project.label}` }
                            </Typography> }
                            <CardSubHeaderInlineSearchBar
                                onChange = {handleSearchChange}
                            />
                        </Box>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                    <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                    <Typography className="ml-2">loading...</Typography>
                        </Box>}
                        <List>
                            {
                                // selected processs
                                getListItems([...selected])
                            }
                            {
                                // Unselected processes
                                getListItems([...tasks].filter(t => ![...selected].some(s => s.id === t.id)))
                            }
                            {!loading && ([...tasks].length ===0 && [...selected].length ===0) && <ListItem>
                                <Box width={1} textAlign="center">
                                    <Typography variant="body1">{translate("microgatewayApp.microprojectProjectTask.home.notFound")}</Typography>
                                </Box>
                            </ListItem>}
                        </List>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        {totalItems > 0 &&
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
                        }
                    </CardActions>
                </Card>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default ProjectTaskFinder;