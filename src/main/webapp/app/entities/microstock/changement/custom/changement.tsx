import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState, translate} from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/microstock/changement/changement.reducer';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Visibility } from '@material-ui/icons';
import { API_URIS, formateBase64Src,getTotalPages, navigateToBlankTab } from 'app/shared/util/helpers';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import ChangementUpdate from './changement-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import { IChangement } from 'app/shared/model/microstock/changement.model';

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

const ItemRow = (props: {changement: IChangement, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const changement = props.changement;

    const handleChangeValid = () => props.onChangeValid(changement);
    
    const handleUpdate = () => props.handleUpdate(changement);

    const handleDelete = () => props.handleDelete(changement);

    const openFile = () =>{
      navigateToBlankTab('file-viewer/'+changement.fileId)
    }

    return (
    <React.Fragment>
        <TableRow>
            {/* <TableCell align="center">{ changement.consommable ? changement.consommable.nom:''}</TableCell> */}
            <TableCell align="center">{ changement.equipement ? changement.equipement.nom:''}</TableCell>
            <TableCell align="center">
            {changement.fileId && 
            <IconButton onClick={openFile}>
              <Visibility/>
            </IconButton> }

            </TableCell>
            <TableCell align="center">{ changement.motif }</TableCell>
            <TableCell align="center">{ changement.commentaire }</TableCell>
            <TableCell align="center">{ changement.etat }</TableCell>
            <TableCell align="center">{ changement.date }</TableCell>
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

export interface IChangementProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Changement = (props: IChangementProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  
  const [activePage, setActivePage] = useState(0);

  const [changements, setChangements] = useState<IChangement[]>([]);

  const [changementToUpdate, setChangementToUpdate] = useState<IChangement>(null);
  
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
        if(props.changements && props.changements.length)
            setChangements([...props.changements]);
  }, [props.changements])



  const handleChangePage = (e, newPage) => setActivePage(newPage);
  
  const handleChangeItemPerPage = (e) =>{
      setPaginationState({
          ...paginationState,
          itemsPerPage: parseInt(e.target.value, 10)
      })
  }

  const handleUpdateChangement = (entity?:IChangement) =>{
        setChangementToUpdate(entity);
        setOpen(true);
  }

  const handleDeleteChangement = (entity: IChangement) =>{  
    if(entity){
      setChangementToUpdate(entity);
      setOpenDelete(true);
    }
      
  }

 /* const handleChangeValid = (entity: Ichangement) =>{
      if(entity){
        entity.valid = !entity.valid
        const els = typeObjectis.map(to => {
            if(to.id === entity.id)
              return entity
            return to;
        })
        setTypeObjectifs([...els].sort(() => -1));
        axios.put<Ichangement>(API_URIS.typeObjectifApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
      }
  } */

  const items = changements.sort(() =>-1).map(co =>(
      <ItemRow key={co.id} changement={co} handleUpdate={handleUpdateChangement}
             handleDelete={handleDeleteChangement} onChangeValid={()=>{}} />
  ))

  const { loading } = props;
  
 const onSave = (entity: IChangement, isNew: boolean) =>{
      if(entity){
        if(isNew){
         setChangements([entity,...changements])

        }else{
          setChangements([...changements].map(co =>co.id ===entity.id ? entity:co ))

       }
       setOpen(false);
      }
  } 

  const onDelete = (deletedId) =>{
    if(deletedId){
        setChangements([...changements].filter(co =>co.id !==deletedId))
        setOpenDelete(false);
    }
}


   const onClose = () => setOpen(false); 

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Type objectifs</title></Helmet>
            <ChangementUpdate open={open} changement={changementToUpdate} onSave={onSave} onClose={onClose} />
            {changementToUpdate && 
                <EntityDeleterModal 
                  open={openDelete}
                  entityId={changementToUpdate.id}
                  urlWithoutEntityId={API_URIS.changementApi}
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
                        <Translate contentKey="microgatewayApp.microstockChangement.home.title">changement</Translate>
                    </Typography>
                  </Box>
                }
                titleTypographyProps={{
                  variant: 'h4'
                }}
                action={
                  <IconButton title="Add" color="primary" onClick={() => handleUpdateChangement(null)}>
                      <Add />
                  </IconButton>
                }/>
              <CardContent>
               <Table>
                   <TableHead>
                       <TableRow className={classes.theadRow}>
                       
                           {/* <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.consommable">consommable</Translate>
                            </TableCell> */}
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.equipement">equipement</Translate>
                            </TableCell>
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.fileName">fileName</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.motif">motif</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.commentaire">commentaire</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.etat">etat</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockChangement.date">date</Translate>
                            </TableCell>
                           <TableCell align="center">Actions</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                    {changements && changements.length > 0 ? (
                        items
                     ) : (
                        !loading && (
                            <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Translate contentKey="microgatewayApp.microstockChangement.home.notFound">No Type Objectifs found</Translate>
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

const mapStateToProps = ({ changement }: IRootState) => ({
    changements: changement.entities,
  loading: changement.loading,
  totalItems: changement.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Changement);
