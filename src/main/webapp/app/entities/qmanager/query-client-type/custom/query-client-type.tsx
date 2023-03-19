import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

import { Box, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add'
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { Edit, Delete, AccountTree, Add } from '@material-ui/icons';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import QueryClientTypeUpdate from './query-client-type-update';

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

const ItemRow = (props: {qcType: IQueryClientType, onUpdate?: Function, onDelete?: Function}) =>{
  const { qcType } = props
  const [open, setOpen] = useState(false);

  const classes = useStyles()

  const handleDelete = () =>{
    if(props.onDelete)
      props.onDelete(qcType);
  }

  const handleUpdate = () =>{
    if(props.onUpdate)
      props.onUpdate(qcType);
  }

  return (
    <React.Fragment>
     {qcType && <>
      <TableRow hover>
        <TableCell align="left" style={{width: 10}}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        <TableCell align="left">{qcType.name}</TableCell>
        <TableCell align="right">
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
      {qcType.description && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse unmountOnExit in={open} timeout="auto">
              <Box margin={1}>
                  <Typography  variant='h5' style={{paddingBottom:5}}>
                    <Translate contentKey="microgatewayApp.microprocessProcess.description">Description</Translate>
                  </Typography>
                  <Typography  variant='body2' style={{marginLeft:3,}}>{qcType.description}</Typography>
              </Box>
          </Collapse>
          </TableCell>
      </TableRow>}
      </>}
    </React.Fragment>
  )
}

export const QueryClientType = (props) => {
  
  const [searchValue, setSearchValue] = useState('')
  const [types, setTypes] = useState<IQueryClientType[]>([]);
  const [typeToDelete, setTypeToDelete] = useState<IQueryClientType>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeToUpdate, setTypeToUpdate] = useState<IQueryClientType>(null);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const getTypes = (p?: number, rows?: number) => {
    setLoading(true);
    const page = p || p === 0 ? p : activePage;
    const size = rows || itemsPerPage; 
    const requestUri =`${API_URIS.queryClientTypeApiUri}/?page=${page}&size=${size}`;
    axios.get<IQueryClientType[]>(requestUri)
      .then(res => {
        setTotalItems(parseInt(res.headers['x-total-count'], 10));
        setTypes(res.data)
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


  const handleUpdate = (ct?: IQueryClientType) =>{
    setTypeToUpdate(ct);
    setOpen(true);
  }

  const onUpdate = (updated: IQueryClientType, isNew?: boolean) =>{
     if(updated){
       if(isNew){
        setTypes([updated, ...types]);
        setOpen(false);
       }else{
         setTypes([...types].map(ct => ct.id === updated.id ? updated : ct));
       }
     }
  }

  const handleDelete = (qct?: IQueryClientType) =>{
    if(qct){
      setTypeToDelete(qct);
      setOpenDelete(true);
    }
  }

  const onDelete = (deleted?: number) =>{
    if(deleted){
      setTypes([...types].filter(qct => qct.id !==deleted));
      setOpenDelete(false)
      setTypeToDelete(null);
    }
  }

  const items = [...types].sort((a,b) =>b.id-a.id).filter(qct =>
      (qct.name && qct.name.toLowerCase().includes(searchValue.toLowerCase()))
     ).map((qct, index) =>(
       <ItemRow key={index} qcType={qct} onUpdate={handleUpdate} onDelete={handleDelete}/>
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
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQueryClientType.home.title")}`}</title></Helmet>
        {typeToDelete && <EntityDeleterModal
            open={openDelete}
            entityId={typeToDelete.id}
            urlWithoutEntityId={API_URIS.queryClientTypeApiUri}
            onDelete={onDelete} onClose={() => setOpenDelete(false)}
            question={translate("microgatewayApp.qmanagerQueryClientType.delete.question", { id: typeToDelete.name})}
            />}
        <QueryClientTypeUpdate 
            open={open}
            type={typeToUpdate}
            onClose={() => setOpen(false)}
            onSave={onUpdate}
        />
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="mr-3" variant="h4">
                        <Translate contentKey="microgatewayApp.qmanagerQueryClientType.home.title">Types</Translate>
                    </Typography>
                    <CardSubHeaderInlineSearchBar
                      onChange = {handleSearchChange}
                     />
                     {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                       <IconButton aria-label="add" 
                        onClick={() => handleUpdate({id: null, name: '', description:''})}
                        color="primary" className="ml-3">
                         <AddIcon style={{ fontSize: 30 }} />
                       </IconButton>
                     }
                </Box>}
                className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left"  style={{width: 10}}></TableCell>
                              <TableCell align="left">
                                {translate('microgatewayApp.qmanagerQueryClientType.name')}</TableCell>
                              <TableCell align="right">{'Actions'}</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {(loading || items.length <=0) && <TableRow>
                          <TableCell align="center" colSpan={20}>
                            {loading && 'loading...'}
                            {(!loading && items.length<=0) &&
                              <Typography variant="body1">
                                <Translate contentKey="microgatewayApp.qmanagerQueryClientType.home.notFound">No Query client types found</Translate>
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
export default QueryClientType;
