import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState, translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../type-objectif.reducer';
import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { cleanEntity, overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Box, Card, CardActions, CardContent, CardHeader, FormControlLabel, IconButton, makeStyles, Switch, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Explore } from '@material-ui/icons';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import TypeObjectifUpdate from './type-objectif-update';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

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

const ItemRow = (props: {typeObjectif: ITypeObjectif, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const typeobjectif = props.typeObjectif;

    const handleChangeValid = () => props.onChangeValid(typeobjectif);
    
    const handleUpdate = () => props.handleUpdate(typeobjectif);

    const handleDelete = () => props.handleDelete(typeobjectif);

    return (
    <React.Fragment>
        <TableRow>
            <TableCell align="left">{ typeobjectif.name }</TableCell>
            <TableCell align="center">
                <Translate contentKey={"microgatewayApp.ObjectifTypeEvaluationUnity."+typeobjectif.evalutationUnity}>{typeobjectif.evalutationUnity }</Translate>
            </TableCell>
            <TableCell align="center">
                <FormControlLabel
                    control={
                    <Switch
                        checked={typeobjectif.valid}
                        onChange={handleChangeValid}
                        color="primary"
                    />
                    }
                    label=""
                />
            </TableCell>
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

export interface ITypeObjectifProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TypeObjectif = (props: ITypeObjectifProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  
  const [activePage, setActivePage] = useState(0);

  const [typeObjectis, setTypeObjectifs] = useState<ITypeObjectif[]>([]);

  const [typeObjectifToUpdate, setTypeObjectifToUpdate] = useState<ITypeObjectif>(null);
  
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
        if(props.typeObjectifList && props.typeObjectifList.length)
            setTypeObjectifs([...props.typeObjectifList]);
  }, [props.typeObjectifList])



  const handleChangePage = (e, newPage) => setActivePage(newPage);
  
  const handleChangeItemPerPage = (e) =>{
      setPaginationState({
          ...paginationState,
          itemsPerPage: parseInt(e.target.value, 10)
      })
  }

  const handleUpdateObjectif = (entity: ITypeObjectif) =>{
      if(entity)
        setTypeObjectifToUpdate(entity);
  }

  const handleDeleteObjectif = (entity: ITypeObjectif) =>{  
    if(entity)
        props.history.push(`/type-objectif/${entity.id}/delete`);
  }

  const handleChangeValid = (entity: ITypeObjectif) =>{
      if(entity){
        entity.valid = !entity.valid
        const els = typeObjectis.map(to => {
            if(to.id === entity.id)
              return entity
            return to;
        })
        setTypeObjectifs([...els].sort(() => -1));
        axios.put<ITypeObjectif>(API_URIS.typeObjectifApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
      }
  }

  const items = typeObjectis.sort(() =>-1).map(to =>(
      <ItemRow key={to.id} typeObjectif={to} handleUpdate={handleUpdateObjectif}
             handleDelete={handleDeleteObjectif} onChangeValid={handleChangeValid} />
  ))

  const { loading } = props;
  
  const onSave = (entity: ITypeObjectif, isNew: boolean) =>{
      if(entity){
        if(isNew){
          const els = [...typeObjectis];
          els.push(entity);
          setTypeObjectifs([...els]);
        }else{
          const els = typeObjectis.map(to => to.id === entity.id ? entity : to);
          setTypeObjectifs([...els]);
        }
      }
  }

  const onClose = () => setTypeObjectifToUpdate(null);

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Type objectifs</title></Helmet>
          {typeObjectifToUpdate && 
            <TypeObjectifUpdate open={true} typeObjectif={typeObjectifToUpdate} onSave={onSave} onClose={onClose} />
          }
          <Card className={classes.card}>
              <CardHeader classes={{ root: classes.cardHeader, title: classes.cardTitle }}
                title={
                  <Box display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faBullseye} size="1x"/>
                    <Typography className="ml-2" variant="h4">
                        <Translate contentKey="microgatewayApp.typeObjectif.home.title">Type Objectifs</Translate>
                    </Typography>
                  </Box>
                }
                titleTypographyProps={{
                  variant: 'h4'
                }}
                action={
                  <IconButton title="Add" color="primary" onClick={() => setTypeObjectifToUpdate({})}>
                      <Add />
                  </IconButton>
                }/>
              <CardContent>
               <Table>
                   <TableHead>
                       <TableRow className={classes.theadRow}>
                           <TableCell align="left">
                                <Translate contentKey="microgatewayApp.typeObjectif.name">Name</Translate>
                            </TableCell>
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.typeObjectif.evalutationUnity">Evaluation Unity</Translate>
                            </TableCell>
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.typeObjectif.valid">Valid</Translate>
                            </TableCell>
                           <TableCell align="center">Actions</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                    {typeObjectis && typeObjectis.length > 0 ? (
                        items
                     ) : (
                        !loading && (
                            <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Translate contentKey="microgatewayApp.typeObjectif.home.notFound">No Type Objectifs found</Translate>
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

const mapStateToProps = ({ typeObjectif }: IRootState) => ({
  typeObjectifList: typeObjectif.entities,
  loading: typeObjectif.loading,
  totalItems: typeObjectif.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeObjectif);
