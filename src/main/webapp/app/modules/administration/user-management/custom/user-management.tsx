import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, TextFormat, JhiPagination, JhiItemCount, getSortState, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getUsers, updateUser } from '../user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { Avatar, Badge, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { Delete, Edit } from '@material-ui/icons';
import { hasAuthorities, hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { IUser } from 'app/shared/model/user.model';
import UserUpdate from './user-update';
import { CardSubHeaderInlineSearchBar } from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';

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
}))

export interface IUserManagementProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const UserManagement = (props: IUserManagementProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const [userToUpdate, setUserToUpdate] = useState<IUser>(null);
  
  const [open, setOpen] = useState(false);

  const [search,setSearch] = useState("");

  const classes = useStyles();

  useEffect(() => {
    props.getUsers(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const toggleActive = user => () =>{
    if(hasPrivileges({ entities: ['User'], actions: [PrivilegeAction.UPDATE, PrivilegeAction.CREATE]}) || hasAuthorities([AUTHORITIES.ADMIN])){
      props.updateUser({
        ...user,
        activated: !user.activated,
      });
    }
  }

  const handleUpdate = (u: IUser) =>{
    setUserToUpdate(u);
    setOpen(true);
  }

  const handleSave = (saved?: IUser) =>{
      if(saved){
        setOpen(false);
        props.getUsers(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
      }
  }

  const filter = (user: IUser) =>{
      if(search && user)
         return (
                (user.firstName && user.firstName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) )
                || (user.lastName  && user.lastName.toLocaleUpperCase().includes(search.toLocaleUpperCase()))
          );
      return true;
  }

  const handleSearchChange = (e) =>{
    setSearch(e.target.value);
  }


  const { users, account, match, totalItems } = props;
  return (
    <React.Fragment>
        <UserUpdate open={open} account={account} user={userToUpdate}
          onSave={handleSave} onClose={() => setOpen(false)} />
        <Card className={classes.card}>
            <CardHeader
              avatar={
                <FontAwesomeIcon icon={faUsersCog} className="text-primary"/>
              }
              title={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                <Translate contentKey="userManagement.home.title">Users</Translate>
                <CardSubHeaderInlineSearchBar
                  onChange = {handleSearchChange}
                />
                </Box>
              }
              titleTypographyProps={{
                variant: 'h4'
              }}
              className={classes.cardHeader}
            />
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow className={classes.theadRow}>
                            <TableCell align="left">
                                <Translate contentKey="userManagement.firstName">firstName</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.lastName">lastName</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.login">Login</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.email">Email</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="_global.label.status">Status</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.langKey">Lang Key</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.profiles">Profiles</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.createdDate">Created Date</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users.length !==0 ? (
                          [...users].filter(u => filter(u))
                           .map(user =>(
                            <TableRow key={user.id}>
                              <TableCell align="left">{user.firstName}</TableCell>
                              <TableCell align="center">{user.lastName}</TableCell>
                                <TableCell align="center">{user.login}</TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">
                                    {user.activated ? (
                                      <Button color="primary" onClick={toggleActive(user)} variant="contained" size="small">
                                        <Translate contentKey="userManagement.activated">Activated</Translate>
                                      </Button>
                                    ) : (
                                      <Button color="secondary" onClick={toggleActive(user)} variant="contained" size="small">
                                        <Translate contentKey="userManagement.deactivated">Deactivated</Translate>
                                      </Button>
                                    )}
                                </TableCell>
                                <TableCell align="center">{user.langKey}</TableCell>
                                <TableCell align="center">
                                  {user.authorities
                                    ? user.authorities.map((authority, j) => (
                                        <div key={`user-auth-${authority}-${j}`}>
                                          <Badge color="primary">{authority}</Badge>
                                        </div>
                                      ))
                                    : ''}
                                </TableCell>
                                <TableCell align="center">
                                  {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                                </TableCell>
                                <TableCell align="center">
                                  {user.lastModifiedBy}
                                </TableCell>
                                <TableCell align="center">
                                  {user.createdDate ? <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                                </TableCell>
                                <TableCell align="center">
                                      {hasPrivileges({ entities: ['User'], actions: [PrivilegeAction.UPDATE]}, account.authorities) && 
                                      <IconButton color="primary" size="small" className="mr-3"
                                        onClick={() =>{handleUpdate(user)}}>
                                          <Edit />
                                      </IconButton>}
                                      {/* hasPrivileges({ entities: ['User'], actions: [PrivilegeAction.DELETE]},  account.authorities) && 
                                      <IconButton color="secondary" size="small" disabled={account.login === user.login}
                                        onClick={() =>{props.history.push(`${match.url}/${user.login}/delete`)}}>
                                          <Delete />
                                    </IconButton> */}
                                </TableCell>
                            </TableRow>
                          ))
                         ):(
                          ''
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardActions>  
                {props.totalItems ? (
                  <div className={users && users.length > 0 ? '' : 'd-none'}>
                    <Box className="justify-content-center">
                      <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
                    </Box>
                    <Box className="justify-content-center">
                      <JhiPagination
                        activePage={pagination.activePage}
                        onSelect={handlePagination}
                        maxButtons={5}
                        itemsPerPage={pagination.itemsPerPage}
                        totalItems={props.totalItems}
                      />
                    </Box>
                  </div>
                ) : (
                  ''
                )}
            </CardActions>
        </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { getUsers, updateUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
