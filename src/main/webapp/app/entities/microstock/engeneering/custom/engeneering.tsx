import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/microstock/engeneering/engeneering.reducer';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import EngeneeringUpdate from './engeneering-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import { IEngeneering } from 'app/shared/model/microstock/engeneering.model';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow:'-1px -1px 7px',
  },
  cardHeader:{
    background: theme.palette.background.paper,
    color: theme.palette.primary.dark,
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

const ItemRow = (props: {engeneering: IEngeneering, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const engeneering = props.engeneering;

    const handleChangeValid = () => props.onChangeValid(engeneering);
    
    const handleUpdate = () => props.handleUpdate(engeneering);

    const handleDelete = () => props.handleDelete(engeneering);

    return (
    <React.Fragment>
        <TableRow>
            <TableCell align="left">{ engeneering.equipement ? engeneering.equipement.nom:''}</TableCell>
            <TableCell align="center">{ engeneering.commentaire }</TableCell>
            <TableCell align="center">{ engeneering.expertise }</TableCell>
            <TableCell align="center">
                <IconButton onClick={handleUpdate} color="primary" className="mr-2" >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDelete} color="secondary" >
                    <Delete fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    </React.Fragment>
    );
}

export interface IEngeneeringProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Engeneering = (props: IEngeneeringProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  
  const [activePage, setActivePage] = useState(0);

  const [engeneerings, setEngeneerings] = useState<IEngeneering[]>([]);

  const [engeneeringToUpdate, setEngeneeringToUpdate] = useState<IEngeneering>(null);
  
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
        if(props.engeneerings && props.engeneerings.length)
            setEngeneerings([...props.engeneerings]);
  }, [props.engeneerings])



  const handleChangePage = (e, newPage) => setActivePage(newPage);
  
  const handleChangeItemPerPage = (e) =>{
      setPaginationState({
          ...paginationState,
          itemsPerPage: parseInt(e.target.value, 10)
      })
  }

  const handleUpdateEngeneering = (entity?:IEngeneering) =>{
        setEngeneeringToUpdate(entity);
        setOpen(true);
  }

  const handleDeleteEngeneering = (entity: IEngeneering) =>{  
    if(entity){
      setEngeneeringToUpdate(entity);
      setOpenDelete(true);
    }
      
  }

 /* const handleChangeValid = (entity: Iengeneering) =>{
      if(entity){
        entity.valid = !entity.valid
        const els = typeObjectis.map(to => {
            if(to.id === entity.id)
              return entity
            return to;
        })
        setTypeObjectifs([...els].sort(() => -1));
        axios.put<Iengeneering>(API_URIS.typeObjectifApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
      }
  } */

  const items = engeneerings.sort(() =>-1).map(co =>(
      <ItemRow key={co.id} engeneering={co} handleUpdate={handleUpdateEngeneering}
             handleDelete={handleDeleteEngeneering} onChangeValid={()=>{}} />
  ))

  const { loading } = props;
  
 const onSave = (entity: IEngeneering, isNew: boolean) =>{
      if(entity){
        if(isNew){
         setEngeneerings([entity,...engeneerings])

        }else{
          setEngeneerings([...engeneerings].map(co =>co.id ===entity.id ? entity:co ))

       }
       setOpen(false);
      }
  } 

  const onDelete = (deletedId) =>{
    if(deletedId){
        setEngeneerings([...engeneerings].filter(co =>co.id !==deletedId))
        setOpenDelete(false);
    }
}


   const onClose = () => setOpen(false); 

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Type objectifs</title></Helmet>
            <EngeneeringUpdate open={open} engeneering={engeneeringToUpdate} onSave={onSave} onClose={onClose} />
            {engeneeringToUpdate && 
                <EntityDeleterModal 
                  open={openDelete}
                  entityId={engeneeringToUpdate.id}
                  urlWithoutEntityId={API_URIS.engeneeringApi}
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
                        <Translate contentKey="microgatewayApp.engeneering.home.title">engeneering</Translate>
                    </Typography>
                  </Box>
                }
                titleTypographyProps={{
                  variant: 'h4'
                }}
                action={
                  <IconButton title="Add" color="primary" onClick={() => handleUpdateEngeneering(null)}>
                      <Add />
                  </IconButton>
                }/>
              <CardContent>
               <Table>
                   <TableHead>
                       <TableRow className={classes.theadRow}>
                           <TableCell align="left">
                                <Translate contentKey="microgatewayApp.engeneering.equipement">Equipement</Translate>
                            </TableCell>
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.engeneering.commentaire">commentaire</Translate>
                            </TableCell>
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.engeneering.expertise">expertise</Translate>
                            </TableCell>
                            
                           <TableCell align="center">Actions</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                    {engeneerings && engeneerings.length > 0 ? (
                        items
                     ) : (
                        !loading && (
                            <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Translate contentKey="microgatewayApp.engeneering.home.notFound">No Type Objectifs found</Translate>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                   </TableBody>
               </Table>
              </CardContent>
                {props.totalItems > 0 &&
                  <CardActions className="pt-0 pb-0">
                      <TablePagination 
                      component="div"
                      count={props.totalItems}
                      page={activePage}
                      onPageChange={handleChangePage}
                      rowsPerPage={paginationState.itemsPerPage}
                      onChangeRowsPerPage={handleChangeItemPerPage}
                      rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                      labelRowsPerPage={translate("_global.label.rowsPerPage")}
                      labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,paginationState.itemsPerPage)}`}
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

const mapStateToProps = ({ engeneering }: IRootState) => ({
    engeneerings: engeneering.entities,
  loading: engeneering.loading,
  totalItems: engeneering.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Engeneering);
