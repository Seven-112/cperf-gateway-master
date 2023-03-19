import { Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Modal, TablePagination, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { CheckCircle, Close } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { IQueryClient } from "app/shared/model/qmanager/query-client.model";

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

interface QueryClientFinderProps{
    preSelected?: IQueryClient[],
    multiple?:boolean,
    onSave?: Function,
    open?: boolean,
    onClose: Function,
}

export const QueryClientFinder = (props: QueryClientFinderProps) =>{
    const { open, multiple } = props;
    
    const [searchValue, setSearchValue] = useState('')

    const [clients, setClients] = useState<IQueryClient[]>([]);

    const [selected, setSelected] = useState([...props.preSelected]);

    const [loading, setLoading] = useState(false);

    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();

    const getAllEntities = (p?: number, rows?: number) => {
      setLoading(true);
      const page = p || p === 0 ? p : activePage;
      const size = rows || itemsPerPage;
      const requestUri =`${API_URIS.queryClientApiUri}/?disabled.specified=false&page=${page}&size=${size}`;
      axios.get<IQueryClient[]>(requestUri)
        .then(res => {
          setTotalItems(parseInt(res.headers['x-total-count'], 10));
          setClients([...res.data])
          setLoading(false);
        }).catch((e) =>{
          setLoading(false);
          /* eslint-disable no-console */
          console.log(e);
        });
    };

  useEffect(() =>{
    getAllEntities();
    setSelected([...props.preSelected]);
  }, [])

  const handleClose = () => props.onClose();

  const handleSave = () =>{
      if(props.onSave){
          props.onSave([...selected]);
      }
  }

  const select = (client?: IQueryClient) =>{
       if(client){
           if(multiple)
               setSelected([...selected, client])
           else
               setSelected([client]);
       }
  }

  const unSelect = (client?: IQueryClient) =>{
      if(client)
       setSelected([...selected].filter(item => item.id !== client.id))
  }

  const toogleSelect = (client?: IQueryClient) =>{
      if(client){
          if([...selected].some(s => s.id === client.id))
            unSelect(client);
        else
            select(client)
      }
  }

  const getListItems = (items: IQueryClient[]) => (
    [...items].sort((a,b) =>b.id-a.id).filter(client =>(
            client.name && client.name.toLowerCase().includes(searchValue.toLowerCase())
        )
       ).map((client, index) =>(
            <ListItem key={index} button onClick={() => toogleSelect(client)}>
                <ListItemText
                    primary={client.name}
                    secondary={client.type ? client.type.name : ''}
                />
                <ListItemSecondaryAction onClick={() => toogleSelect(client)}>
                    <Checkbox color="primary" checked={[...selected].some(s => s.id === client.id)}/>
                </ListItemSecondaryAction>
            </ListItem>
       ))
  )

   const handleSearchChange = (e) =>{
     setSearchValue(e.target.value);
   }
 
   const handleChangeItemsPerpage = (event) =>{
     setItemsPerPage(parseInt(event.target.value, 10));
     getAllEntities(0, parseInt(event.target.value, 10));
   }
 
   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getAllEntities(newPage);
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
                                {/* <AccountTree  className="mr-3"/> */}
                                <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.title">Clients</Translate>
                                <CardSubHeaderInlineSearchBar
                                    onChange = {handleSearchChange}
                                />
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
                                    // Unselected clients
                                    getListItems([...clients].filter(p => ![...selected].some(s => s.id === p.id)))
                                }
                                {(!loading && [...clients].length ===0 && [...selected].length ===0) && <ListItem>
                                    <Box width={1} textAlign="center">
                                        <Typography variant="body1">
                                            <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.notFound">No clients found</Translate>
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

export default QueryClientFinder;