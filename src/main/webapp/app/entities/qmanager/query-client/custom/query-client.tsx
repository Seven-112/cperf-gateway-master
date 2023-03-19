import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { Add, Delete, Edit } from '@material-ui/icons';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import QueryClientUpdate from './query-client-update';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow: '-1px -1px 10px',
  },
  cardHeader: {
    paddingTop:2,
    paddingBottom:2,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.dark,
    // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
  },
  cardContent:{
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
  },
  thead:{
    border:'none',
    color: 'white',
  },
  theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
    }
  },
  tasksFab:{
    boxShadow: 'none',
    background: 'transparent',
    color: theme.palette.success.dark,
    '& :disabled':{
      background: 'transparent',
    }
  },
  procedureFileIllustration:{
     height: theme.spacing(4),
     width: theme.spacing(5),
     fontSize: theme.spacing(6),
     cursor: 'pointer',
     marginTop:'1px',
     '&:hover':{
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

const ItemRow = (props: {qClient: IQueryClient, onUpdate?: Function, onDelete?: Function}) =>{
  const { qClient } = props

  const classes = useStyles()

  const handleDelete = () =>{
    if(props.onDelete)
      props.onDelete(qClient);
  }

  const handleUpdate = () =>{
    if(props.onUpdate)
      props.onUpdate(qClient);
  }

  return (
    <React.Fragment>
     {qClient && <>
        <TableRow hover>
          <TableCell align="left">{qClient.name}</TableCell>
          <TableCell align="center">{qClient.accountNum}</TableCell>
          <TableCell align="center">{qClient.type ? qClient.type.name || '...' : '...'}</TableCell>
          <TableCell align="center">
            <Box display='flex' width={1} alignItems='center' justifyContent='flex-end'>
            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.UPDATE]}) && props.onUpdate && 
              <IconButton edge="start" aria-label="Edit" onClick={handleUpdate}
                size="small" className="mr-2">
                <Edit color="primary" titleAccess="Edit"/>
              </IconButton>
            }
            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.DELETE]}) &&
            <IconButton edge="end" aria-label="Delete" onClick={handleDelete} size="small">
              <Delete color="error" titleAccess="Delete"/>
            </IconButton>}
          </Box>
          </TableCell>
        </TableRow>
      </>}
    </React.Fragment>
  )
}

export const QueryClient = (props) => {
  
  const [searchValue, setSearchValue] = useState('')
  const [clients, setClients] = useState<IQueryClient[]>([]);
  const [clientToDelete, setClientToDelete] = useState<IQueryClient>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState<IQueryClient>(null);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const getTypes = (p?: number, rows?: number) => {
    setLoading(true);
    const page = p || p === 0 ? p : activePage;
    const size = rows || itemsPerPage; 
    const requestUri =`${API_URIS.queryClientApiUri}/?page=${page}&size=${size}`;
    axios.get<IQueryClient[]>(requestUri)
      .then(res => {
        setTotalItems(parseInt(res.headers['x-total-count'], 10));
        setClients(res.data)
        setLoading(false);
      }).catch((e) =>{
        setLoading(false);
        /* eslint-disable no-console */
        console.log(e);
      });
  };

  useEffect(() =>{
      getTypes();
  }, [])


  const handleUpdate = (c?: IQueryClient) =>{
    setClientToUpdate(c);
    setOpen(true);
  }

  const onUpdate = (updated: IQueryClient, isNew?: boolean) =>{
     if(updated){
       if(isNew){
        setClients([updated, ...clients]);
        setOpen(false);
       }else{
         setClients([...clients].map(c => c.id === updated.id ? updated : c));
       }
     }
  }

  const handleDelete = (c?: IQueryClient) =>{
    if(c){
      setClientToDelete(c);
      setOpenDelete(true);
    }
  }

  const onDelete = (deleted?: number) =>{
    if(deleted){
      setClients([...clients].filter(c => c.id !==deleted));
      setOpenDelete(false)
      setClientToDelete(null);
    }
  }

  const items = [...clients].sort((a,b) =>b.id-a.id).filter(c =>
      (
        (c.name && c.name.toLowerCase().includes(searchValue.toLowerCase()))
        || (c.accountNum && c.accountNum.toLowerCase().includes(searchValue.toLowerCase()))
      )
     ).map((client, index) =>(
       <ItemRow key={index} qClient={client} onUpdate={handleUpdate} onDelete={handleDelete}/>
    ))

  const handleSearchChange = (e) =>{
    setSearchValue(e.target.value);
  }

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getTypes(0, parseInt(event.target.value, 10))
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getTypes(newPage)
  }
  
  return (
    <React.Fragment>
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQueryClient.home.title")}`}</title></Helmet>
        {clientToDelete && <EntityDeleterModal
            open={openDelete}
            entityId={clientToDelete.id}
            urlWithoutEntityId={API_URIS.queryClientApiUri}
            onDelete={onDelete} onClose={() => setOpenDelete(false)}
            question={translate("microgatewayApp.qmanagerQueryClient.delete.question", { id: clientToDelete.name})}
            />}
        <QueryClientUpdate 
          open={open}
          client={clientToUpdate}
          onSave={onUpdate}
          onClose={() => setOpen(false)}
        />
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="mr-3" variant="h4">
                        <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.title">Types</Translate>
                    </Typography>
                    <CardSubHeaderInlineSearchBar
                      onChange = {handleSearchChange}
                     />
                     {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                       <IconButton aria-label="add" 
                        onClick={() => handleUpdate({id: null, name: '', accountNum:'', type: null})}
                        color="primary" className="ml-3">
                         <Add style={{ fontSize: 30 }} />
                       </IconButton>
                     }
                </Box>}
                className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left">
                                {translate('microgatewayApp.qmanagerQueryClient.name')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryClient.accountNum')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryClient.type')}
                              </TableCell>
                              <TableCell align="right">{'Actions'}</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {(loading || items.length <=0) && <TableRow>
                          <TableCell align="center" colSpan={20}>
                            {loading && 'loading...'}
                            {(!loading && items.length<=0) &&
                              <Typography variant="body1">
                                <Translate contentKey="microgatewayApp.qmanagerQueryClient.home.notFound">No Query client types found</Translate>
                              </Typography>
                            }
                          </TableCell>
                        </TableRow>}
                          {items}
                      </TableBody>
                  </Table>
                </CardContent>
               {totalItems > 0 &&
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
              }
        </Card>
    </React.Fragment>
  );
};
export default QueryClient;
