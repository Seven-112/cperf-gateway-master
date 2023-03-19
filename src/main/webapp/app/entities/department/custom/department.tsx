import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getSortState, Translate } from 'react-jhipster';
import AddIcon from '@material-ui/icons/Add';
import DomainIcon from '@material-ui/icons/Domain';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../department.reducer';
import { IDepartment } from 'app/shared/model/department.model';
import { Box, Card, CardActions, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Typography } from '@material-ui/core';
import  DepartmentUpdate  from './department-update';
import { Helmet } from 'react-helmet';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { getTotalPages } from 'app/shared/util/helpers';
import { myHasAyPrivileges } from 'app/shared/auth/private-route';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';

const useStyles = makeStyles((theme) => ({
  card:{
      border: '1px solid '+ theme.palette.primary.main,
      boxShadow: '0 0 7px '+theme.palette.grey[900],
  },
  cardHeader: {
    paddingTop:2,
    paddingBottom:2,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.dark,
  },
  avatar: {
  },
  cardContent:{

  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
  pagination:{
   padding:0,
   color: theme.palette.primary.dark,
 },
 paginationInput:{
     width: theme.spacing(10),
     display: 'none',
 },
 paginationSelectIcon:{
     color: theme.palette.primary.dark,
     display: 'none',
 },
}));

export interface IDepartmentProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Department = (props: IDepartmentProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [activePage, setActivePage] = useState(0);

  const getAllEntities = () =>{
    props.getEntities(activePage, paginationState.itemsPerPage,  `${paginationState.sort},${paginationState.order}`);
  }

  useEffect(() => {
    getAllEntities();
  }, []); 
  
  useEffect(() => {
    getAllEntities();
  }, [activePage]);

  const editModalRef = useRef(null);

  const classes = useStyles();

  const { departmentList, loading } = props;
  const lastIndex = departmentList.length -1;
 
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [modalTile, setModalTile] = useState(null);
  const [open, setOpen] = useState(false);

  const history = useHistory();

  const handleEditListner = (dept: IDepartment) =>{
    setSelectedDepartement(dept);
    setOpen(true);
  }

  const handleAddListner = () =>{
      setSelectedDepartement(null);
      setOpen(true);
  }

  const handleDeleteListner = (id: number) =>{
     history.push('/department/'+id+'/delete');
  }

  const modalHandleClose = () =>{
    setOpen(false);
    getAllEntities();
  }

  const handleSaved = () =>{
    getAllEntities();
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
  }

  return (
      <>
      <Helmet><title>Cperf | Departments</title></Helmet>
      <DepartmentUpdate open={open}  handleClose = {modalHandleClose} 
        department={selectedDepartement ? selectedDepartement : {}} onSaved={handleSaved}/>
      <Card className={classes.card}>
          <CardHeader 
              avatar={
                <DomainIcon />
              }
              action={
                <React.Fragment>
                  {myHasAyPrivileges({ entities: ["Department"], actions: [PrivilegeAction.CREATE]}, props.account.authorities) && 
                    <IconButton aria-label="add"
                      color="inherit"
                     onClick={ () => handleAddListner()}>
                    <AddIcon style={{ fontSize: 30 }}/>
                  </IconButton>}
                </React.Fragment>
              }
              title={<Translate contentKey="microgatewayApp.micropeopleDepartment.home.title">Departments</Translate>}
              titleTypographyProps={{ variant: 'h4' }}
              className={classes.cardHeader}
        />
        <CardContent className={ classes.cardContent}>
          {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
              <Typography  color="primary">Loading...</Typography>
          </Box>}
          {departmentList && departmentList.length > 0 ? ( 
              <List>
                  {departmentList.map((dept,index) =>(
                    <>
                      <ListItem key={index+dept.id} role={undefined} dense button>
                            <ListItemText style={{ padding:10 }}>
                              <Typography variant="h6">{dept.name}</Typography>
                            </ListItemText>
                            <ListItemSecondaryAction>
                            {myHasAyPrivileges({ entities: ["Department"], actions: [PrivilegeAction.UPDATE]}, props.account.authorities) &&
                            <IconButton edge="start" aria-label="Edit" onClick={() =>handleEditListner(dept)}>
                              <EditIcon color="primary" titleAccess="Edit"/>
                            </IconButton>
                            }
                            {myHasAyPrivileges({ entities: ["Department"], actions: [PrivilegeAction.DELETE]}, props.account.authorities) &&
                            <IconButton edge="end" aria-label="Delete" onClick={() =>handleDeleteListner(dept.id)}>
                              <DeleteIcon color="error" titleAccess="Delete"/>
                            </IconButton>
                           }
                          </ListItemSecondaryAction>
                      </ListItem>
                      {(lastIndex > index) && <Divider/> }
                    </>
                  ))}
              </List>
           ): ( 
            !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="microgatewayApp.micropeopleDepartment.home.notFound">No Departments found</Translate>
              </div>
            ) )}
        </CardContent>
        {(props.totalItems > 0) &&
            <CardActions>
                <TablePagination className={props.departmentList && props.departmentList.length > 0 ? '' : 'd-none'}
                  component="div"
                  count={props.totalItems}
                  page={activePage}
                  onPageChange={handleChangePage}
                  rowsPerPage={paginationState.itemsPerPage}
                  onChangeRowsPerPage={() =>{}}
                  rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                  labelRowsPerPage=""
                  labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, paginationState.itemsPerPage)}`}
                  classes={{ 
                      root: classes.pagination,
                      input: classes.paginationInput,
                      selectIcon: classes.paginationSelectIcon,
                }}/>
            </CardActions>}
      </Card>
      </>
  );
};

const mapStateToProps = ({ department, authentication }: IRootState) => ({
  departmentList: department.entities,
  loading: department.loading,
  totalItems: department.totalItems,
  account: authentication.account,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Department);
