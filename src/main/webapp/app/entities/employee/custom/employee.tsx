import React, { useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { TextFormat, translate, Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Box, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, makeStyles, Switch, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { APP_DATE_FORMAT } from 'app/config/constants';
import theme from 'app/theme';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { IEmployee } from 'app/shared/model/employee.model';
import { API_URIS, deleteUserExtraPhoto, getTotalPages } from 'app/shared/util/helpers';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { IUser } from 'app/shared/model/user.model';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import PersonalDashbord from 'app/shared/component/personal-dashbord';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import UserFile from 'app/entities/user-file/custom/user-file';
import CustomAvatar from 'app/shared/component/custom-avatar';
import { getSession } from 'app/shared/reducers/authentication';

export interface IEmployeeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
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
  theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
    }
  },
  // switch styles
    
  shiwtchRoot: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.error.main,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
  // end swhitch styles
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
});


const IOSSwitch = (props) => {
  const classes = useStyles();
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.shiwtchRoot,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
};
function Row(props: {emp: IEmployee,
   authorities: string[], 
   logged?: IUser,manager?: IEmployee,
   onUpdate: Function,onDelete: Function,onShowFiles?: Function}){

  const [open, setOpen] = useState(false);

  const {emp} = props;

  const manager = props?.manager

  const [empAccount, setEmpAccount] = useState<IUser>(null);

  useEffect(() =>{
    if(props.emp && props.emp.id){
      // find emp account
      axios.get<IUser>(`${API_URIS.userExtraApiUri}/employee-account/${props.emp.id}`).then(res =>{
        if(res.data){
          setEmpAccount(res.data);
        }
      }).catch(e =>{
        /* eslint-disable no-console */
        console.log(e);
      })
    }
  }, [props.emp])

  const canUpdateAccount = empAccount && (!props.logged || props.logged.id !== empAccount.id) && 
                            hasPrivileges({ entities: ["User","Employee"], 
                            actions: [PrivilegeAction.UPDATE, PrivilegeAction.CREATE]}, props.authorities);

  const changeAccountActiveStatus = () =>{
     if(canUpdateAccount){
       const entity: IUser= {...empAccount, activated: !empAccount.activated}
       axios.put<IUser>(API_URIS.userApiUri, cleanEntity(entity)).then(response =>{
        setEmpAccount({...response.data});
       }).catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      }) 
     }
  }

  const handleShowFiles = () =>{
    if(props.onShowFiles && props.emp){
      const ue: IUserExtra = {id : empAccount ? empAccount.id : null, user: empAccount, employee : props.emp}
      props.onShowFiles(ue);
    }
  }

  const canShowFiles = (hasPrivileges({entities: ["Employee"], actions: [PrivilegeAction.ALL] }, props.authorities) 
                      || (props.logged && empAccount && props.logged.id === empAccount.id)) && props.onShowFiles;

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell width={20}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        <TableCell align="left">
          <CustomAvatar alt={emp.photoName} photoId={emp.photoId} 
            onDelete={() => deleteUserExtraPhoto({employee:emp})}
          />
        </TableCell>
        <TableCell align='center'> {emp.firstName}</TableCell>
        <TableCell align='center'>{emp.lastName}</TableCell>
        <TableCell align='center'>{emp.email}</TableCell>
        <TableCell align='center'>{emp.phoneNumber}</TableCell>
        <TableCell align='center'>{emp.fonction ? emp.fonction.name : '...'}</TableCell>
        {/* <TableCell align='center'>{emp.salary}</TableCell> */}
        <TableCell>
          <Box display='flex' alignItems='center' justifyContent='center'>
          {hasPrivileges({entities: ["Employee"], actions: [PrivilegeAction.UPDATE] }, props.authorities) && 
            <IconButton edge="start" aria-label="Edit" onClick={(e) => props.onUpdate(e,emp)}>
              <EditIcon color="primary" titleAccess="Edit"/>
            </IconButton>
          }
          {canShowFiles && 
            <IconButton edge="start" aria-label="files" title="files" onClick={handleShowFiles}>
              <FontAwesomeIcon icon={faCopy} size='sm' />
            </IconButton>
          }
          {((!empAccount || !props.logged || (empAccount && props.logged && empAccount.id !== props.logged.id)) &&
              hasPrivileges({entities: ["Employee"], actions: [PrivilegeAction.DELETE] }, props.authorities))  &&
          <IconButton edge="end" aria-label="Delete" onClick={(e) => props.onDelete(e,emp)}>
            <DeleteIcon color="error" titleAccess="Delete"/>
          </IconButton>}
        </Box>
        </TableCell>
        </TableRow>
        { /* collapsing row */}
        <TableRow>
         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
           <Collapse in={open} timeout="auto" unmountOnExit>
             <Box margin={1}>
                <Typography  variant='h5' style={{paddingBottom:5}}>
                <Translate contentKey="global.words.details">Details</Translate>
                </Typography>
                <Table size='small' aria-label='user details'>
                  <TableHead>
                      <TableRow>
                      <TableCell align='left'>
                        {translate("microgatewayApp.micropeopleEmployee.managerId")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.department")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.hireDate")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.userId")}
                      </TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                        <TableCell>{manager ? manager.firstName + ' '+manager.lastName : ''}</TableCell>
                        <TableCell align='center'>{emp.department ? emp.department.name : ''}</TableCell>
                        <TableCell align='center'>{emp.hireDate ? <TextFormat type="date" value={emp.hireDate} format={APP_DATE_FORMAT} /> : null}</TableCell>
                        <TableCell align='center'>
                            {canUpdateAccount && empAccount && <React.Fragment>
                               <IOSSwitch checked={empAccount.activated} onChange={changeAccountActiveStatus}/>
                            <small>&nbsp;
                              <Translate contentKey={empAccount.activated ? 'userManagement.activated': 'userManagement.deactivated'}>..</Translate>
                              </small> </React.Fragment>
                            }
                            {!canUpdateAccount &&  <Translate contentKey={empAccount && empAccount.activated ? 'userManagement.activated': 'userManagement.deactivated'}>..</Translate>}
                        </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
             </Box>
           </Collapse>
         </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const Employee = (props: IEmployeeProps) => {
    const { connectedAccount } = props;

    const classes = useStyles();
  
    const [searchValue, setSearchValue] = useState('');
    const [userExtra, setUserExtra] = useState<IUserExtra>(null);
    const [openFiles, setOpenFiles] = useState(false);
    const history = useHistory();

    const [employee, setEmployee] = useState<IEmployee>(null);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);


    const getAllEntities = (p?: number, rows?: number) => {
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        setLoading(true);
        axios.get<IEmployee[]>(`${API_URIS.employeeApiUri}/?page=${page}&size=${size}&sort=id,asc`)
          .then(res => {
            setEmployees(res.data);
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
          }).catch(e => console.log(e)).finally(() => setLoading(false))
    };
  
    useEffect(() => {
      if(!props.connectedAccount)
        props.getSession();
      getAllEntities(); 
    }, []);
    
    const handleChangePage = (event, newPage) => {
      setActivePage(newPage);
      getAllEntities(newPage)
    };

    const handleChangeRowsPerPage = (event) => {
      setItemsPerPage(parseInt(event.target.value, 10));
      getAllEntities(0, parseInt(event.target.value, 10));
    }

    const handleSearchOnChange = (e) =>{
       setSearchValue(e.target.value);
    }
    
    const handleUpdate = (e: Event, emp: IEmployee) =>{
      history.push('/employee/'+emp.id+'/edit');
    }
    
    const handleDelete = (e: Event, emp: IEmployee) =>{
      history.push('/employee/'+emp.id+'/delete');
    }
    const handleCreate = () =>{
      history.push('/employee/new');
    }

    const handleShowFiles = (ue?: IUserExtra) =>{
       if(ue){
         setUserExtra(ue);
         setOpenFiles(true);
       }
    }
    const items = [...employees].filter(emp =>
      (emp.firstName.toLowerCase().includes(searchValue.toLowerCase()) 
      || emp.lastName.toLowerCase().includes(searchValue.toLowerCase()))
      ).map((emp,index) =>(
      <Row key={index} emp={emp}
         authorities={props.connectedAccount.authorities}
        logged={props.connectedAccount as IUser}
        manager={[...employees].find(em => em.id === emp.managerId)}
        onUpdate={handleUpdate} onDelete={handleDelete}
        onShowFiles={handleShowFiles}
         />
    ));

    return(
     <React.Fragment>
        <Helmet>
          <title>{`${translate("_global.appName")} | Employees`}</title>
        </Helmet>
        <Card className={classes.card}>
          <CardHeader
            action={
              <React.Fragment>
                {hasPrivileges({ entities: ['Employee'], actions: [PrivilegeAction.CREATE] }, props.connectedAccount.authorities) &&
                    <IconButton aria-label="add" onClick={handleCreate} color="inherit">
                    <AddIcon style={{ fontSize: 30 }}/>
                  </IconButton>
                }
              </React.Fragment>
            }
            title={<Box display="flex" justifyContent="space-between" alignItems="center">
              <PeopleIcon className="mr-3"/>
              <Translate contentKey="microgatewayApp.micropeopleEmployee.home.title">Employees</Translate>
              <CardSubHeaderInlineSearchBar onChange = {handleSearchOnChange}/>
            </Box>}
            titleTypographyProps={{ variant: 'h4', style:{ } }}
              classes={{ root: classes.cardHeader }}/>
          <CardContent style={ { padding:0}}>
              <Table aria-label="employees table">
                <TableHead>
                    <TableRow className={classes.theadRow}>
                      <TableCell align='left' width={20}></TableCell>
                      <TableCell align='left'>
                        {translate("microgatewayApp.micropeopleEmployee.photo")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.firstName")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.lastName")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.email")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.phoneNumber")}
                      </TableCell>
                      <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.fonction")}
                      </TableCell>
                      {/* <TableCell align='center'>
                        {translate("microgatewayApp.micropeopleEmployee.salary")}
                      </TableCell> */}
                      <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {loading && <TableRow>
                      <TableCell align="center" colSpan={10}>
                        <Typography color="primary">Loading...</Typography>
                      </TableCell>
                  </TableRow>}
                    {items}
                    {(!employees || employees.length === 0) && !loading && 
                      <TableRow>
                        <TableCell align="center" colSpan={20} className="p-2">
                            <Typography color="primary" variant="h6">
                              <Translate contentKey="microgatewayApp.micropeopleEmployee.home.notFound">No Employees found</Translate>
                            </Typography>
                        </TableCell>
                      </TableRow>
                    }
                </TableBody>
              </Table>
          </CardContent>
          {totalItems > 0 &&
            <CardActions className="pt-0 pb-0">
                <TablePagination 
                component="div"
                count={totalItems}
                page={activePage}
                onPageChange={handleChangePage}
                rowsPerPage={itemsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                labelRowsPerPage={translate("_global.label.rowsPerPage")}
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
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    connectedAccount: authentication.account,
  });
  
  const mapDispatchToProps = {
    getSession,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(Employee);