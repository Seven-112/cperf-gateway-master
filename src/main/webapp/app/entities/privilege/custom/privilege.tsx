import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from '../privilege.reducer';
import { IPrivilege } from 'app/shared/model/privilege.model';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, IconButton, InputBase, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';

import { Helmet } from 'react-helmet';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Add, Delete, Edit } from '@material-ui/icons';
import { getTotalPages } from 'app/shared/util/helpers';
import PrivilegeUpdate from './privilege-update';
import { PRIVILEGE_ACTIONS_SEPARATOR } from 'app/shared/util/constantes';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';

const useStyles = makeStyles(theme =>({
    card:{
      border: '1px solid '+ theme.palette.primary.main,
      boxShadow: '0 0 7px '+theme.palette.grey[900],
    },
    cardHeader: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
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

export interface IPrivilegeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Privilege = (props: IPrivilegeProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const [activePage, setActivePage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [privilegeToUpdate, setPrivilegeToUpdate] = useState<IPrivilege>({});

  const [privileges, setPrivileges] = useState<IPrivilege[]>([...props.privilegeList]);

  const [open, setOpen] = useState(false);

  const [role, setRole] = useState('');

  const getAllEntities = () => {
    props.getEntities(activePage, itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  useEffect(() => {
    getAllEntities();
  }, [activePage, itemsPerPage, paginationState.order, paginationState.sort]);

  useEffect(() =>{
      setPrivileges([...props.privilegeList]);
  },[props.privilegeList])

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

  const handleClose = () =>{
    setOpen(false);
    setPrivilegeToUpdate({});
  }

  const handleSave = (saved:IPrivilege, isNew: boolean) =>{
    if(saved){
      if(isNew){
        const els = [saved, ...privileges];
        setPrivileges([...els]);
      }else{
         const els = privileges.map(pv => pv.id === saved.id ? saved : pv);
         setPrivileges([...els]);
      }
      setOpen(false);
    }
  }

  const translateAction = (actions: string) =>{
    if(actions){
      const split = actions.split(PRIVILEGE_ACTIONS_SEPARATOR);
      if(split && split.length > 0){
        const joinable: string[] = [];
        for(let i=0; i< split.length; i++){
          joinable.push(translate('microgatewayApp.PrivilegeAction.'+split[i]));
        }
        return joinable.join(PRIVILEGE_ACTIONS_SEPARATOR);
      }else{
        return translate('microgatewayApp.PrivilegeAction.'+actions);
      }
    }
    return "";
  }

  const { match, loading, totalItems } = props;
  
  const classes = useStyles();
  return (
      <React.Fragment>
          <Helmet><title>Cperf | Privileges</title></Helmet>
          {privilegeToUpdate && <PrivilegeUpdate
           privilege={privilegeToUpdate} open={open} onSave={handleSave} onClose={handleClose}/>}
          <Card className={classes.card}>
              <CardHeader 
                 title={
                    <Box display="flex" width="95%">
                       <FontAwesomeIcon icon={faUserShield} className="mr-3" color="inherit"/>
                        <Typography variant="h4">
                            <Translate contentKey="microgatewayApp.privilege.home.title">Privileges</Translate>
                        </Typography>
                      <Box flexGrow={1} className="ml-3 mr-3">
                        <CardSubHeaderInlineSearchBar 
                          onChange = {(e) => setRole(e.target.value)}
                          />
                      </Box>
                    </Box>
                 }
                 action={
                     <IconButton color="inherit" title="add" 
                      onClick={() => { setPrivilegeToUpdate({}); setOpen(true) } }>
                         <Add />
                     </IconButton>
                 }
                 className={classes.cardHeader}
              />
              <CardContent style={{ padding:0 }}>
                  <Table>
                      <TableHead>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left">
                                  <Translate contentKey="microgatewayApp.privilege.authority">authority</Translate>
                              </TableCell>
                              <TableCell align="center">
                                  <Translate contentKey="microgatewayApp.privilege.entity">entity</Translate>
                              </TableCell>
                              <TableCell align="center">
                                  <Translate contentKey="microgatewayApp.privilege.home.title">Privileges</Translate>
                              </TableCell>
                              <TableCell align="center">Action</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {privileges && privileges.length > 0 ? (
                            privileges.filter(
                                pv =>(role &&  pv.authority.toLocaleLowerCase()
                                    .includes(role.toLocaleLowerCase())) || !role).map(pv =>(
                              <TableRow key={pv.id}>
                                  <TableCell align="left">{pv.authority}</TableCell>
                                  <TableCell align="center">{pv.entity}</TableCell>
                                  <TableCell align="center">{translateAction(pv.action)}</TableCell>
                                  <TableCell align="center">
                                     <IconButton className="mr-3" color="primary" title="Update" size="small"
                                        onClick={() =>{ setPrivilegeToUpdate(pv); setOpen(true) }}>
                                         <Edit />
                                     </IconButton>
                                     <IconButton color="secondary" title="Delete" size="small"
                                        onClick={() =>props.history.push(`${match.url}/${pv.id}/delete`)}>
                                         <Delete />
                                     </IconButton>
                                  </TableCell>
                              </TableRow>
                           ))
                          ):(
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    {loading ? 'loading ...' : 
                                        <Translate contentKey="microgatewayApp.privilege.home.notFound">No Privileges found</Translate>}
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
                    count={totalItems}
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

const mapStateToProps = ({ privilege }: IRootState) => ({
  privilegeList: privilege.entities,
  loading: privilege.loading,
  totalItems: privilege.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Privilege);
