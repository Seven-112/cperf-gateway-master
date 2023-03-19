import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../model-entity.reducer';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Fab, IconButton, InputBase, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Storage } from '@material-ui/icons';
import { getTotalPages } from 'app/shared/util/helpers';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';

const useStyles = makeStyles(theme =>({
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

export interface IModelEntityProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ModelEntity = (props: IModelEntityProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const [activePage, setActivePage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [searchValue, setSearchValue] = useState('');

  const getAllEntities = () => {
    props.getEntities(activePage, itemsPerPage, `${paginationState.sort},${paginationState.order}`);
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
  }, [activePage, itemsPerPage, paginationState.order, paginationState.sort]);

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
    
  const handleChangePage = (event, newPage) => {
    setActivePage(newPage);
  };

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    setActivePage(0);
  }

  const { modelEntityList, match, loading } = props;

  const classes = useStyles();
  return (
      <React.Fragment>
          <Card className="mt-3">
              <CardHeader
                 avatar={<Avatar><Storage color="primary" /></Avatar>}
                 title={
                 <Box display="flex" justifyContent="space-between">
                     <Typography display="inline" variant="h4" className="mr-3">
                        <Translate contentKey="microgatewayApp.modelEntity.home.title">Model Entities</Translate>
                     </Typography>
                     <Box flexGrow={1}>
                        <InputBase fullWidth placeholder="search.." 
                         type="search" className="border text-white pl-2 pr-2"
                         value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                         style={{ borderRadius: '5px' }}/>
                     </Box>
                 </Box>
                 }
                 action={
                     <Fab onClick={() => { props.history.push(`${match.url}/new`) }} 
                        color="primary" title="add" size="small" className="ml-3 mt-1">
                         <Add />
                     </Fab>
                 }
                 classes={{ root: 'pt-2 pb-2 bg-primary text-white' }}
               />
               <CardContent>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell align="left">
                                    <Translate contentKey="microgatewayApp.modelEntity.entity">Entity</Translate>
                               </TableCell>
                               <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.modelEntity.name">Name</Translate>
                               </TableCell>
                               <TableCell align="center">Actions</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                        {modelEntityList && modelEntityList.length > 0 ? (
                            modelEntityList.filter(item =>{
                                if(searchValue){
                                    if(item.entity.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || 
                                        (item.name && item.name.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())))
                                        return true;
                                    else
                                     return false;
                                }
                                return true;
                            }).map(item =>(
                                <TableRow key={item.id}>
                                    <TableCell align="left">{item.entity}</TableCell>
                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" className="mr-3"
                                             onClick={() => {props.history.push(`${match.url}/${item.id}/edit`)}}>
                                            <Edit color="primary"/>
                                        </IconButton>
                                        <IconButton size="small"
                                            onClick={() => {props.history.push(`${match.url}/${item.id}/delete`)}}>
                                            <Delete color="secondary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ):(
                            <TableRow>
                                <TableCell colSpan={10} rowSpan={2} align="center">
                                {!loading ? (
                                <Translate contentKey="microgatewayApp.modelEntity.home.notFound">No Model Entities found</Translate>
                                ): ('loading ... ')
                                }
                                </TableCell>
                            </TableRow>
                        )}
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
                        rowsPerPage={itemsPerPage}
                        onChangeRowsPerPage={handleChangeItemsPerpage}
                        rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                        labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
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

const mapStateToProps = ({ modelEntity }: IRootState) => ({
  modelEntityList: modelEntity.entities,
  loading: modelEntity.loading,
  totalItems: modelEntity.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ModelEntity);
