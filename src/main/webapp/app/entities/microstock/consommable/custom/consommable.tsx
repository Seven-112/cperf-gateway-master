import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Box, Card, CardActions, CardContent,Collapse, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit, ExpandLess, ExpandMore } from '@material-ui/icons';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { IConsommable } from 'app/shared/model/microstock/consommable.model';
import ConsommableUpdate from './consommable-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import ConsommableChildren from './consommable-children';
import axios from 'axios';
import approvisionnement from 'app/entities/microstock/approvisionnement/approvisionnement';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow:'-1px -1px 7px',
  },
  cardHeader:{
    background: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
  },
  cardTitle:{
    color: theme.palette.primary.dark
  },
  theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
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
}))

const ItemRow = (props: {consommable:IConsommable, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const consommable = props.consommable;
    const handleChangeValid = () => props.onChangeValid(consommable);
    
  const [consommables, setConsommables] = useState<IConsommable[]>([]);
  const [displayChildren, setDisplayChildren] = useState(false);

  const [loading, setLoading] = useState(false);
    
    const handleUpdate = () => props.handleUpdate(consommable);
    const handleUpdateapp = () => props.handleUpdate(approvisionnement);

    const handleDelete = () => props.handleDelete(consommable);

    const getConsommables = () => {
     if(consommable){
      setLoading(true);
      const requestUri =`${API_URIS.consommableApi}/?composantDeId.equals=${consommable.id}&sort=id,desc`;
      axios.get<IConsommable[]>(requestUri)
        .then(res => {
          setConsommables([...res.data])
        }).catch((e) =>{
          console.log(e);
        }).finally(() =>{
            setLoading(false);
        });
    }
  }

useEffect(() => {
    getConsommables();
  }, [props.consommable]);


  const onChildDelete = (deletedId?: any) =>{
    console.log("chdeid", deletedId)
    if(deletedId){
        setConsommables([...consommables].filter(c => c.id !== deletedId));
    }
}

const onChildSave = (saved?: IConsommable, isNew?: boolean) =>{
    if(saved){
        if(isNew)
            setConsommables([...consommables, saved])
        else
            setConsommables([...consommables].map(c => c.id === saved.id ? saved : c));
            setDisplayChildren(false);
    }
}
    return (
    <React.Fragment>
        <TableRow>
        <TableCell align="left">{ consommable.nom}</TableCell> 
        <TableCell align="left">{ consommable.quantite}</TableCell> 
            <TableCell align="center">{ consommable.description  }</TableCell>
            <TableCell align="center">{ consommable.dateAjout}</TableCell>
            <TableCell align="center">{ consommable.dateRemplacement}</TableCell>
            <TableCell align="center">{ consommable.composantDe ? consommable.composantDe.nom:''}</TableCell> 
            <TableCell align="center">
            <IconButton
                        className="p-0"
                        color="primary"
                        size="small"
                        disabled={(!consommables || consommables.length ===0 )}
                        onClick={() => setDisplayChildren(!displayChildren)}>
                        {displayChildren ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>

                <IconButton onClick={handleUpdate} color="primary" className="mr-2" >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={handleUpdate} color="primary" className="mr-2" >
                    <Add fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDelete} color="secondary" >
                    <Delete fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
        {consommable && consommables && consommables.length !== 0 && <TableRow>
                <TableCell colSpan={20} className="p-0 m-0 border-0">
                    <Collapse 
                        in={displayChildren}
                        timeout={300}
                        unmountOnExit
                        >
                        <ConsommableChildren 
                            consommable={consommable} 
                            level={1} 
                            consommables={[...consommables]}
                            onUpdate={onChildSave}
                            onDelete={onChildDelete} />
                    </Collapse>
                </TableCell>
            </TableRow>}
    </React.Fragment>
    );
}


export const Consommable = (props) => {
  
  const [activePage, setActivePage] = useState(0);

  const [consommables, setConsommables] = useState<IConsommable[]>([]);

  const [consommableToUpdate, setConsommableToUpdate] = useState<IConsommable>(null);
  const [loading, setLoading] = useState(false);
  
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const classes = useStyles();

  const getConsommables = (p?: number, rows?: number) => {
    setLoading(true);
    const page = p || p === 0 ? p : activePage;
    const size = rows || itemsPerPage; 
    const requestUri =`${API_URIS.consommableApi}/?composantDeId.specified=false&page=${page}&size=${size}&sort=id,desc`;
    axios.get<IConsommable[]>(requestUri)
      .then(res => {
        setTotalItems(parseInt(res.headers['x-total-count'], 10));
        setConsommables([...res.data])
      }).catch((e) =>{
        console.log(e);
      }).finally(() =>{
          setLoading(false);
      });
  };




  useEffect(() => {
    getConsommables();
  }, []);

  

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getConsommables(0, parseInt(event.target.value, 10))
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getConsommables(newPage)
  }

  const handleUpdateConsommables = (entity?:IConsommable) =>{
        setConsommableToUpdate(entity);
        setOpen(true);
  }
  const handleDeleteConsommable
 = (entity: IConsommable) =>{  
    if(entity){
      setConsommableToUpdate(entity);
      setOpenDelete(true);
    }
      
  }
/*
export interface IConsommableProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Consommable = (props:IConsommableProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  
  const [activePage, setActivePage] = useState(0);

  const [consommables, setConsommables] = useState<IConsommable[]>([]);

  const [consommableToUpdate, setConsommableToUpdate] = useState<IConsommable>(null);
  
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  
  const classes = useStyles();

  const getAllEntities = () => {
    props.getEntities(activePage, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [activePage, paginationState.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  useEffect(() =>{
        if(props.consommables && props.consommables.length)
            setConsommables([...props.consommables]);
  }, [props.consommables])



  const handleChangePage = (e, newPage) => setActivePage(newPage);
  
  const handleChangeItemPerPage = (e) =>{
      setPaginationState({
          ...paginationState,
          itemsPerPage: parseInt(e.target.value, 10)
      })
  }

  const handleUpdateConsommable = (entity?:IConsommable) =>{
        setConsommableToUpdate(entity);
        setOpen(true);
  }

  const handleDeleteConsommable = (entity:IConsommable) =>{  
    if(entity){
      setConsommableToUpdate(entity);
      setOpenDelete(true);
    }
      
  }

  const handleChangeValid = (entity:IConsommable) =>{
      if(entity){
        entity.valid = !entity.valid
        const els = typeObjectis.map(to => {
            if(to.id === entity.id)
              return entity
            return to;
        })
        setTypeObjectifs([...els].sort(() => -1));
        axios.put<IConsommable>(API_URIS.typeObjectifApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
      }
  } */

  const items = consommables.sort(() =>-1).map(co =>(
    <ItemRow key={co.id} consommable={co} handleUpdate={handleUpdateConsommables}
           handleDelete={handleDeleteConsommable} onChangeValid={()=>{}} />
))

 const onSave = (entity:IConsommable, isNew: boolean) =>{
      if(entity){
        if(isNew){
         setConsommables([entity,...consommables])

        }else{
          setConsommables([...consommables].map(co =>co.id ===entity.id ? entity:co ))

       }
       setOpen(false);
      }
  } 

  const onDelete = (deletedId) =>{
    if(deletedId){
        setConsommables([...consommables].filter(co =>co.id !==deletedId))
        setOpenDelete(false);
    }
}


   const onClose = () => setOpen(false); 

  return (

    <React.Fragment>
    <Helmet><title>{`${translate('_global.appName')} | ${translate('microgatewayApp.microstockConsommable.home.title')}`}Consommable</title></Helmet>
    <ConsommableUpdate open={open} consommable={consommableToUpdate} onSave={onSave} onClose={onClose} />
      {consommableToUpdate && 
          <EntityDeleterModal 
            open={openDelete}
            entityId={consommableToUpdate.id}
            urlWithoutEntityId={API_URIS.consommableApi}
            onDelete={onDelete}
            onClose={()=>{setOpenDelete(false)}}

          />
      }
    <Card className={classes.card}>
        <CardHeader classes={{ root: classes.cardHeader, title: classes.cardTitle }}
          title={
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faBullseye} size="1x"/>
              <Typography className="ml-2" variant="h4">
                  <Translate contentKey="microgatewayApp.microstockConsommable.home.title">consommable</Translate>
              </Typography>
            </Box>
          }
          titleTypographyProps={{
            variant: 'h4'
          }}
          action={
            <IconButton title="Add" color="primary" onClick={() => handleUpdateConsommables(null)}>
                <Add />
            </IconButton>
          }/>
        <CardContent>
         <Table>
             <TableHead>
                 <TableRow className={classes.theadRow}>
                 <TableCell align="left">
                          <Translate contentKey="microgatewayApp.microstockConsommable.nom">Nom</Translate>
                      </TableCell>
                     
                 <TableCell align="center">
                          <Translate contentKey="microgatewayApp.microstockConsommable.quantite">Nom</Translate>
                      </TableCell>
                     
                     <TableCell align="center">
                          <Translate contentKey="microgatewayApp.microstockConsommable.description">Descripition</Translate>
                      </TableCell>
                     
                    
                     <TableCell align="center">
                          <Translate contentKey="microgatewayApp.microstockConsommable.dateAjout">dateAjout</Translate>
                      </TableCell>

                      <TableCell align="center">
                          <Translate contentKey="microgatewayApp.microstockConsommable.dateRemplacement">dateRemplacement</Translate>
                      </TableCell>

                      <TableCell align="center">
                      </TableCell>
                     
                     <TableCell align="center">Actions</TableCell>
                 </TableRow>
             </TableHead>
             <TableBody>
              {consommables && consommables.length > 0 ? (
                  items
               ) : (
                  !loading && (
                      <TableRow>
                          <TableCell align="center" colSpan={10}>
                              <Translate contentKey="microgatewayApp.microstockConsommable.home.notFound">No consommable found</Translate>
                          </TableCell>
                      </TableRow>
                  ))
                  }
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
      
  )
};


export default Consommable;
