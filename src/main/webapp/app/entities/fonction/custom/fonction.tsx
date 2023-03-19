import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../fonction.reducer';
import { IFonction } from 'app/shared/model/fonction.model';
import { Helmet } from 'react-helmet';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Add, Delete, Edit, NaturePeople } from '@material-ui/icons';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { getTotalPages } from 'app/shared/util/helpers';
import FonctionUpdate from './fonction-update';

const useStyles = makeStyles(theme =>({
    card:{
     border: '1px solid '+ theme.palette.primary.main,
     boxShadow: '0 0 7px '+theme.palette.grey[900],
   },
   container: {
     maxHeight: 650,
     padding:0,
   },
   cardHeader: {
     paddingTop:2,
     paddingBottom:2,
     backgroundColor: theme.palette.common.white,
     color: theme.palette.primary.dark,
   },
   subheader:{
     marginLeft: theme.spacing(45),
     marginTop: '-25px',
     width:400,
     [theme.breakpoints.down('sm')]: {
       width:200,
       marginLeft: theme.spacing(20),
     },
     backgroundColor: theme.palette.secondary.dark,
     padding:2,
     borderRadius:5,
   },
   theadRow:{
     backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
     color: 'white',
     '&>th':{
       color: 'white',
     }
   },
   fileIllustation:{
     width: theme.spacing(4),
     height: theme.spacing(4),
     fontSize: theme.spacing(10),
     marginRight: theme.spacing(1),
     cursor: 'pointer',
     '&:hover':{
     }
   },
   pagination:{
    padding:0,
    color: theme.palette.primary.dark,
  },
  input:{
      width: theme.spacing(10),
      display: 'none',
  },
  selectIcon:{
      color: theme.palette.primary.dark,
      display: 'none',
  },
}))

export interface IFonctionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Fonction = (props: IFonctionProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const [activePage, setActivePage] = useState(0);

  const [searchValue, setSearchValue] = useState('');

  const [fonctionToUpdate, setFonctionToUpdate] = useState<IFonction>(null);

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
  }, [activePage, paginationState.order, paginationState.sort]);

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

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination =( event, newPage) => setActivePage(newPage);

  const handleChangeItemPerPage = (e) =>{
      setPaginationState({
          ...paginationState,
          itemsPerPage: parseInt(e.target.value, 10),
      })
  }

  const onSaved = (saved: IFonction, isNew: boolean) => getAllEntities();

  const onClose = () => setFonctionToUpdate(null);

  const handleSearchOnChange = (e) => setSearchValue(e.target.value);

  const { fonctionList, match, loading, totalItems, } = props;
  // microgatewayApp.fonction.home.title

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Functions</title></Helmet>
            {fonctionToUpdate && <FonctionUpdate open={true} fonction={fonctionToUpdate} onClose={onClose} onSaved={onSaved} />}
            <Card className={classes.card}>
                <CardHeader
                    action={
                    <IconButton aria-label="add" color="inherit"
                        onClick={() => setFonctionToUpdate({})} title="add">
                        <Add style={{ fontSize: 30, }}/>
                    </IconButton>
                    }
                    title={<Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                          <NaturePeople color="inherit" className="mr-3"/>
                          <Translate contentKey="microgatewayApp.fonction.home.title">Procedures</Translate>
                      </Box>
                      <CardSubHeaderInlineSearchBar onChange = {handleSearchOnChange} />
                    </Box>}
                    titleTypographyProps={{ variant: 'h4', style:{ } }}
                    classes={{ root: classes.cardHeader }}/>
                <CardContent style={ { padding:0}}>
                    <Table stickyHeader aria-label="procdures table">
                        <TableHead>
                        <TableRow className={classes.theadRow}>
                            <TableCell align='left'>
                                <Translate contentKey="microgatewayApp.fonction.name">Name</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="microgatewayApp.fonction.description">Desctiption</Translate>
                            </TableCell>
                            <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {(!loading && fonctionList && fonctionList.length ) &&
                                [...fonctionList].filter(fonc => searchValue ? fonc.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()): fonc)
                                  .sort(() => -1).map(fonc =>(
                                    <TableRow key={fonc.id}>
                                        <TableCell align="left">{fonc.name}</TableCell>
                                        <TableCell align="center">{fonc.description}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" className="mr-2"
                                                onClick={() => setFonctionToUpdate(fonc)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="secondary" className=""
                                                onClick={() => props.history.push(`/fonction/${fonc.id}/delete`)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                             }
                            {!fonctionList || !fonctionList.length && 
                                <TableRow>
                                    <TableCell colSpan={20} align="center">
                                        {!loading && <Translate contentKey="microgatewayApp.fonction.home.notFound">No Employees found</Translate>}
                                        {loading && 'laoding'}
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardActions>
                {props.totalItems > 0 &&
                    <TablePagination className={props.fonctionList && props.fonctionList.length ? '' : 'd-none'}
                    component="div"
                    count={props.totalItems}
                    page={activePage}
                    onPageChange={handlePagination}
                    rowsPerPage={paginationState.itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemPerPage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelRowsPerPage=""
                    labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, paginationState.itemsPerPage)}`}
                    classes={{ 
                        root: classes.pagination,
                        input: classes.input,
                        selectIcon: classes.selectIcon,
                    }}/>}
                </CardActions>
            </Card>
      </React.Fragment>
  )
};

const mapStateToProps = ({ fonction }: IRootState) => ({
  fonctionList: fonction.entities,
  loading: fonction.loading,
  totalItems: fonction.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Fonction);
