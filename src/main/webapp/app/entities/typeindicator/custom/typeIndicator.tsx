import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState, translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../typeindicator.reducer';
import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { cleanEntity, overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Card, CardActions, CardContent, CardHeader, colors, FormControlLabel, IconButton, makeStyles, Switch, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Add, Delete, Edit, SettingsInputAntenna } from '@material-ui/icons';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import TypeindicatorUpdate  from './typeindicator-update';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme =>({
    card:{
      border: '1px solid',
    },
    cardHeader:{
      background: theme.palette.background.paper,
      color: theme.palette.primary.dark,
    },
    cardTitle:{
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
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    switchBase: {
        color:theme.palette.primary.dark,
        '&$checked': {
          color:theme.palette.primary.dark,
        },
        '&$checked + $track': {
          backgroundColor:theme.palette.primary.dark,
        },
      },
  }))

const ItemRow = (props: {typeIndicator: ITypeindicator, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const typeIndicator = props.typeIndicator;

    const handleChangeValid = () => props.onChangeValid(typeIndicator);
    
    const handleUpdate = () => props.handleUpdate(typeIndicator);

    const handleDelete = () => props.handleDelete(typeIndicator);


    return (
    <React.Fragment>
        <TableRow>
            <TableCell align="left">{ typeIndicator.name }</TableCell>
            <TableCell align="center">
                <Translate contentKey={typeIndicator.measurable ? "_global.label.yes" : "_global.label.no"}>Yes/No</Translate>
            </TableCell>
            <TableCell align="center">
                <FormControlLabel
                    control={
                    <Switch
                        checked={typeIndicator.valid}
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

export interface ITypeindicatorProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Typeindicator = (props: ITypeindicatorProps) => {
    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
      );
      
      const [activePage, setActivePage] = useState(0);
    
      const [typeIndicators, setTypeIndicators] = useState<ITypeindicator[]>([]);
    
      const [typeindicatorToUpdate, setTypeIndicatorToUpdate] = useState<ITypeindicator>(null);
      
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
            if(props.typeindicatorList && props.typeindicatorList.length)
                setTypeIndicators([...props.typeindicatorList]);
      }, [props.typeindicatorList])
    
    
    
      const handleChangePage = (e, newPage) => setActivePage(newPage);
      
      const handleChangeItemPerPage = (e) =>{
          setPaginationState({
              ...paginationState,
              itemsPerPage: parseInt(e.target.value, 10)
          })
      }
    
      const handleUpdateIndicator = (entity: ITypeindicator) =>{
          if(entity)
            setTypeIndicatorToUpdate(entity);
      }
    
      const handleDeleteIndicator = (entity: ITypeindicator) =>{  
        if(entity)
            props.history.push(`/typeindicator/${entity.id}/delete`);
      }
    
      const handleChangeValid = (entity: ITypeindicator) =>{
          if(entity){
            entity.valid = !entity.valid
            const els = typeIndicators.map(ti => {
                if(ti.id === entity.id)
                  return entity
                return ti;
            })
            setTypeIndicators([...els].sort(() =>-1));
            axios.put<ITypeindicator>(API_URIS.typeindicatorApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
          }
      }
    
      const items = typeIndicators.sort(() =>-1).map(ti =>(
          <ItemRow key={ti.id} typeIndicator={ti} handleUpdate={handleUpdateIndicator}
                 handleDelete={handleDeleteIndicator} onChangeValid={handleChangeValid} />
      ))
    
      const { loading } = props;
      
      const onSave = (entity: ITypeindicator, isNew: boolean) =>{
          if(entity){
            if(isNew){
              const els = [...typeIndicators];
              els.push(entity);
              setTypeIndicators([...els]);
            }else{
              const els = typeIndicators.map(to => to.id === entity.id ? entity : to);
              setTypeIndicators([...els]);
            }
          }
      }
    
      const onClose = () => setTypeIndicatorToUpdate(null);
  return (
    <React.Fragment>
        <Helmet><title>Cperf | Type indicators</title></Helmet>
        {typeindicatorToUpdate && 
          <TypeindicatorUpdate open={true} typeindicator={typeindicatorToUpdate} onSave={onSave} onClose={onClose} />
        }
        <Card className={classes.card}>
            <CardHeader classes={{ root: classes.cardHeader, title: classes.cardTitle }}
              title={<Translate contentKey="microgatewayApp.typeindicator.home.title">Type indicators</Translate>}
              titleTypographyProps={{
                variant: 'h4'
              }}
              avatar={
                <FontAwesomeIcon icon={faChartPie}/>
              }
              action={
                <IconButton title="Add" color="inherit"
                  onClick={() => setTypeIndicatorToUpdate({})}>
                    <Add />
                </IconButton>
              }/>
            <CardContent>
             <Table>
                 <TableHead>
                     <TableRow className={classes.theadRow}>
                         <TableCell align="left">
                              <Translate contentKey="microgatewayApp.typeindicator.name">Name</Translate>
                          </TableCell>
                         <TableCell align="center">
                              <Translate contentKey="microgatewayApp.typeindicator.measurable">Mesurable</Translate>
                          </TableCell>
                         <TableCell align="center">
                              <Translate contentKey="microgatewayApp.typeindicator.valid">Actif</Translate>
                          </TableCell>
                         <TableCell align="center">
                             Actions
                          </TableCell>
                     </TableRow>
                 </TableHead>
                 <TableBody>
                  {typeIndicators && typeIndicators.length > 0 ? (
                      items
                   ) : (
                      !loading && (
                          <TableRow>
                              <TableCell align="center" colSpan={10}>
                                  <Translate contentKey="microgatewayApp.typeindicator.home.notFound">No Type Objectifs found</Translate>
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
    </React.Fragment>)
};

const mapStateToProps = ({ typeindicator }: IRootState) => ({
  typeindicatorList: typeindicator.entities,
  loading: typeindicator.loading,
  totalItems: typeindicator.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Typeindicator);
