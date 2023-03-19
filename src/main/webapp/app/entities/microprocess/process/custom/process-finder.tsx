import { Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Modal, Select, TablePagination, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { AccountTree, CheckCircle, Close } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";

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

interface ProcessFinderProps{
    preSelected?: IProcess[],
    multiple?:boolean,
    onSave?: Function,
    open?: boolean,
    onClose: Function,
}

export const ProcessFinder = (props: ProcessFinderProps) =>{
    const { open, multiple } = props;
    
    const [searchValue, setSearchValue] = useState('')

    const [processes, setProcesses] = useState<IProcess[]>([]);

    const [selected, setSelected] = useState([...props.preSelected]);

    const [loading, setLoading] = useState(false);

    const [cats, setCats] = useState<IProcessCategory[]>([]);

    const [cat, setCat] = useState<IProcessCategory>(null);
    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();

    const getCategoies = () =>{
        if(serviceIsOnline(SetupService.PROCESS)){
            axios.get<IProcessCategory[]>(`${API_URIS.processCategoryApiUri}`)
            .then(res =>{
              if(res.data)
                setCats([...res.data])
              else
                setCats([]);
            }).catch(e => console.log(e));
        }
    }

    const getAllEntities = (catId?: any, p?: number, rows?: number) => {
      if(serviceIsOnline(SetupService.PROCESS)){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        const categoryId = catId || catId ===0 ? catId : cat ? cat.id : null;
        let requestUri =`${API_URIS.processApiUri}/?valid.equals=${true}&modelId.specified=false&page=${page}&size=${size}`;
        if(categoryId)
            requestUri = `${requestUri}&categoryId.equals=${categoryId}`;
        axios.get<IProcess[]>(requestUri)
            .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setProcesses(res.data)
            setLoading(false);
            }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
            });
      }
    };

  useEffect(() =>{
    getCategoies();
    getAllEntities();
    setSelected([...props.preSelected]);
  }, [])

  const handleClose = () => props.onClose();

  const handleSave = () =>{
      if(props.onSave){
          props.onSave([...selected]);
      }
  }

  const select = (p?: IProcess) =>{
       if(p){
           if(multiple)
               setSelected([...selected, p])
           else
               setSelected([p]);
       }
  }

  const unSelect = (p?: IProcess) =>{
      if(p)
       setSelected([...selected].filter(item => item.id !== p.id))
  }

  const toogleSelect = (p?: IProcess) =>{
      if(p){
          if([...selected].some(s => s.id === p.id))
            unSelect(p);
        else
            select(p)
      }
  }

  const getListItems = (items: IProcess[]) => (
    [...items].sort((a,b) =>b.id-a.id).filter(p => 
        p.valid && !p.modelId && (
         (p.label && p.label.toLowerCase().includes(searchValue.toLowerCase()))
         || (p.description && p.description.toLowerCase().includes(searchValue.toLowerCase()))
        )
       ).map((process, index) =>(
            <ListItem key={index} button onClick={() => toogleSelect(process)}>
                <ListItemText
                    primary={<MyCustomPureHtmlRender body={process.label} renderInSpan />}
                    secondary={process.category ? process.category.name : ''}
                />
                <ListItemSecondaryAction onClick={() => toogleSelect(process)}>
                    <Checkbox color="primary" checked={[...selected].some(s => s.id === process.id)}/>
                </ListItemSecondaryAction>
            </ListItem>
       ))
  )

   const handleSearchChange = (e) =>{
     setSearchValue(e.target.value);
   }
 
   const handleChangeItemsPerpage = (event) =>{
     setItemsPerPage(parseInt(event.target.value, 10));
     getAllEntities(null, 0, parseInt(event.target.value, 10));
   }
 
   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getAllEntities(null, newPage);
   }
 
   const handleChange = (e) =>{
       const value = e.target.value;
       if(value === 0){
        setCat(null)
        getAllEntities(0);
       }else{
           setCat([...cats].find(c => c.id.toString() === value.toString()))
           getAllEntities(value);
       }
   }

    return (
        <React.Fragment>
        <Modal open={open} onClose={handleClose}
             closeAfterTransition
             BackdropComponent={Backdrop}
             BackdropProps={{
             timeout: 500,
         }}
         disableBackdropClick
         className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                            title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                <AccountTree  className="mr-3"/>
                                <Translate contentKey="microgatewayApp.microprocessProcess.home.title">Process</Translate>
                                <CardSubHeaderInlineSearchBar
                                    onChange = {handleSearchChange}
                                />
                                <Box display="flex" justifyContent="flex-end" alignItems="center">
                                    <Typography variant="body2" className="mr-2">
                                        {translate("microgatewayApp.micropartenerPartener.category")}&nbsp;:
                                    </Typography>
                                    <Select value={cat && cat.id ? cat.id:  0} onChange={handleChange}
                                        fullWidth margin="none"
                                        variant="standard"
                                        className={classes.catSelect}
                                        >
                                            <MenuItem value={0}>{translate('_global.label.all')}</MenuItem>
                                            {[...cats].map((c, index) =>(
                                            <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                                            ))}
                                    </Select>
                                </Box>
                                <IconButton color="inherit" onClick={handleClose} className="ml-3"><Close /></IconButton>
                            </Box>}
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                        <Typography className="ml-2">loading...</Typography>
                            </Box>}
                            <List>
                                {[...selected].length !== 0 && <ListItem>
                                    <ListItemText 
                                        primary={<Box width={1} textAlign="center">
                                            <Button
                                                variant="text"
                                                color="primary"
                                                className="text-capitalize"
                                                onClick={handleSave}
                                            >
                                                <Translate contentKey="entity.action.save">Save</Translate>&nbsp;
                                                <CheckCircle />
                                            </Button>
                                        </Box>}
                                    />
                                </ListItem>
                                }
                                {
                                    // selected processs
                                    getListItems([...selected])
                                }
                                {
                                    // Unselected processes
                                    getListItems([...processes].filter(p => ![...selected].some(s => s.id === p.id)))
                                }
                                {!loading && ([...processes].length ===0 && [...selected].length ===0) && <ListItem>
                                    <Box width={1} textAlign="center">
                                        <Typography variant="body1">
                                            <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
                                        </Typography>
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
            </Modal>
        </React.Fragment>
    )
}

export default ProcessFinder;