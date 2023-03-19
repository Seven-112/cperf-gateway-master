import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';

import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, MenuItem, Select, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages, getUserExtraFullName } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Visibility } from '@material-ui/icons';
import TextContentManager from 'app/shared/component/text-content-manager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import IQueryInstanceValidationUpdate from '../../query-instance-validation/custom/query-instance-validation-update';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import QueryInstanceValidationChrono from '../../query-instance-validation/custom/query-instance-validation-chrono';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import QueryInstanceDetail from '../../query-instance/custom/query-instance-detail';
import QueryInstanceValidation from '../../query-instance-validation/custom/query-instance-validation';
import { QueryInstanceStatus } from 'app/shared/model/enumerations/query-instance-status.model';
import clsx from 'clsx';
import { NotifTag } from 'app/shared/model/enumerations/notif-tag-modal';
import NotifAutoCleaner from 'app/entities/notification/custom/notif-auto-cleaner';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow: 'none',
  },
  cardHeader: {
    paddingTop:2,
    paddingBottom:2,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.dark,
    // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
  },
  cardContent:{
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
  },
  thead:{
    border:'none',
    color: 'white',
  },
  theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
    }
  },
  tasksFab:{
    boxShadow: 'none',
    background: 'transparent',
    color: theme.palette.success.dark,
    '& :disabled':{
      background: 'transparent',
    }
  },
  procedureFileIllustration:{
     height: theme.spacing(4),
     width: theme.spacing(5),
     fontSize: theme.spacing(6),
     cursor: 'pointer',
     marginTop:'1px',
     '&:hover':{
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
  truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
  },
  catSelect:{
      fontSize:12,
      marginLeft: 5,
      color: theme.palette.grey[300],
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
      // borderBottom: '1px solid white',
  },
  catSelectMenuItemList:{
      background: theme.palette.primary.dark,
      color: 'white',
  }
}))

const ItemRow = (props: {
   instance: IQueryInstance, 
   userId:number,
   todoUserIsCurrentLogged: boolean,
   onChangeValidated?: Function, 
   onShowQuery?: Function,
   handleOpenValidations?: Function}) =>{
  const { instance, userId } = props

  const enum ShowableText{name='name'}

  const [luncher, setLuncher] = useState<IUserExtra>(null);
  const [loadingLuncher, setLondingLuncher] = useState(false);

  const [showText, setShowText] = useState(false);
  const [textToShow, setTextToShow] = useState<ShowableText>(ShowableText.name);
  const classes = useStyles()

  const getLuncher = () =>{
      if(instance && instance.userId){
          setLondingLuncher(true);
          axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${instance.userId}`)
            .then(res => setLuncher(res.data))
            .catch(e => console.log(e))
            .finally(() => setLondingLuncher(false))
      }
  }

  useEffect(() =>{
    getLuncher();
  }, [])

  const handleShowText = (tag: ShowableText) =>{
    if(tag){
      setTextToShow(tag)
      setShowText(true);
    }
  }
  
  const handleValidate = () =>{
      if(props.onChangeValidated)
        props.onChangeValidated(instance);
  }

  const handleShowQuery = () =>{
    if(props.onShowQuery)
      props.onShowQuery(instance);
  }

  const textManagerTitle = textToShow === ShowableText.name ? 'name' : 'name';

  return (
    <React.Fragment>
    <NotifAutoCleaner 
      tags={[NotifTag.Q_INSTANCE_TO_POST_VALIDATE, NotifTag.Q_INSTANCE_TO_VALIDE]} />
     {instance && <>
        <TextContentManager
            title={translate('microgatewayApp.qmanagerQuery.'+textManagerTitle)} 
            value={textToShow === ShowableText.name ? instance.name : instance.name}
            readonly
            open={showText}
            onClose={() => setShowText(false)}
        />
        <TableRow hover>
          <TableCell align="left">
            <MyCustomPureHtmlRender body={instance.name} renderInSpan />
          </TableCell>
          <TableCell align="center">
                {instance.startAt ?
                 <TextFormat type="date" value={convertDateTimeToServer(instance.startAt)} format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`}  /> 
                 : '...'}
          </TableCell>
          <TableCell align="center">
              {loadingLuncher ? 'loading...' : getUserExtraFullName(luncher)}
          </TableCell>
          <TableCell align="center">
              {instance.query ? (
                <Tooltip title={instance.query.name} 
                  placement="left" onClick={handleShowQuery}>
                    <IconButton color="primary" className="p-0"><Visibility /></IconButton>
                </Tooltip>
              ): '...'}
          </TableCell>
          <TableCell align="center">
              {instance.query && instance.query.category ? (
                instance.query.category.name
              ): '...'}
          </TableCell>
          <TableCell align="center">
                <QueryInstanceValidationChrono
                 instance={instance}
                 userId={userId}
                />
          </TableCell>
          <TableCell align="right">
            <Box display='flex' width={1} alignItems='center' justifyContent='flex-end'>
                <Typography className="mr-3">
                    {(instance.status && instance.status !== QueryInstanceStatus.WAIT_VALIDATION) ?
                      <span className={clsx("badge", {
                        'badge-success' : instance.status === QueryInstanceStatus.VALIDATED,
                        'badge-danger' : instance.status === QueryInstanceStatus.REJECTED
                      })}>
                        { translate(`microgatewayApp.QueryInstanceStatus.${instance.status.toString()}`)}
                      </span>
                      : translate(`microgatewayApp.QueryInstanceStatus.${instance.status.toString()}`)
                    }
                </Typography>
                {(!instance.status || instance.status === QueryInstanceStatus.WAIT_VALIDATION)
                   && props.todoUserIsCurrentLogged &&
                    <Tooltip className="mr-3" onClick={handleValidate}
                       title={translate("entity.action.edit")} placement="left">
                        <IconButton color="primary" className="p-0">
                            <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                        </IconButton>
                    </Tooltip>
                }
                {props.handleOpenValidations &&
                  <Tooltip className="" title={translate("entity.action.view")} 
                    placement="left" onClick={() => props.handleOpenValidations(instance)}>
                      <IconButton color="primary" className="p-0"  >
                          <FontAwesomeIcon icon={faEye} size="sm" />
                      </IconButton>
                  </Tooltip>
                }
            </Box>
          </TableCell>
        </TableRow>
      </>}
    </React.Fragment>
  )
}

interface QueryInstanceTovalidateProps extends StateProps, DispatchProps{
  hideTitle?:boolean,
}

export const QueryInstanceTovalidate = (props: QueryInstanceTovalidateProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [instances, setInstances] = useState<IQueryInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInstance, setActiveInstance] = useState<IQueryInstance>(null);
  const [openValidationEditor, setOpenValidationEditor] = useState(false);
  const [openQuery, setOpenQuery] = useState(false);
  const [openValidations, setOpenValidations] = useState(false);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const [cats, setCats] = useState<IQCategory[]>([]);

  const [cat, setCat] = useState<IQCategory>(null);

  const [status, setStatus] = useState(QueryInstanceStatus.WAIT_VALIDATION);

  const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;

  const todoUserIsCurrentLogged = props.account && (props.account.id === props.todoUserId || !props.todoUserId);

  const getInstances = (p?: number, rows?: number) => {
    setInstances([]);
    setTotalItems(0);
    if(userId){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        const requestUri =`${API_URIS.queryInstanceApiUri}/getToValidate/${userId}/?page=${page}&size=${size}&sort=id,desc`;
        axios.get<IQueryInstance[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setInstances([...res.data])
            setLoading(false);
          }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
          });
    }
  };

  const getCategories = () =>{
    if(props.account){
      axios.get<IQCategory[]>(`${API_URIS.queryCategoryApiUri}`)
        .then(res => {
          setCats([...res.data])
        }).catch((e) =>{
          console.log(e);
        });
    }
  }
 
  useEffect(() =>{
    if(!props.account)
      props.getSession();
  }, [])

  useEffect(() =>{
    getInstances();
    getCategories();
  }, [props.account, props.todoUserId])

  const handleValidatedChange = (inst?: IQueryInstance) =>{
      if(inst){
          setActiveInstance(inst);
          setOpenValidationEditor(true);
      }
  }

  const handleShowQuery = (i?: IQueryInstance) =>{
    if(i){
      setActiveInstance(i);
      setOpenQuery(true);
    }
  }

  const handleOpenValidations = (i?: IQueryInstance) =>{
    if(i){
      setActiveInstance(i);
      setOpenValidations(true);
    }
  }
  
  const filterByValidate = (inst?: IQueryInstance) =>{
    if(inst){
      if(status)
        return inst.status === status;
      return true;
    }
    return false;
}


  const filterByCategory = (inst?: IQueryInstance) =>{
      if(inst){
        if(cat)
          return inst.query && inst.query.category && inst.query.category.id === cat.id;
        return true;
      }
      return false;
  }

  const filterBySearchTerm = (inst?: IQueryInstance) =>{
    if(inst){
      if(searchValue)
        return (inst.name && inst.name.toLowerCase().includes(searchValue.toLowerCase()));
      return true;
    }
    return false;
  }

  const items = [...instances]
  .filter(
    inst => filterByCategory(inst)
    && filterByValidate(inst) && filterBySearchTerm(inst)
  )
  .map((inst, index) =>(
       <ItemRow key={index} 
            instance={inst}
            userId={userId}
            onChangeValidated={handleValidatedChange}
            onShowQuery={handleShowQuery}
            todoUserIsCurrentLogged={todoUserIsCurrentLogged}
            handleOpenValidations={handleOpenValidations}
        />
    ))

  const handleSearchChange = (e) =>{
    setSearchValue(e.target.value);
  }

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getInstances(0, parseInt(event.target.value, 10))
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getInstances(newPage)
  }

  const createProcessInstance = (queryInstance?: IQueryInstance) =>{
    const inst = queryInstance || activeInstance;
    if(inst && inst.status === QueryInstanceStatus.VALIDATED && inst.name && inst.query && inst.query.processId && serviceIsOnline(SetupService.PROCESS)){
        setLoading(true);
        const entity: IProcess = {
            modelId: inst.query.processId,
            id: null,
            label: inst.name,
            // runnableProcessId: runnableProcess ? runnableProcess.id : null
            runnableProcessId: null,
            queryId: inst.id,
        }
        axios.post<IProcess>(API_URIS.processApiUri, cleanEntity(entity))
        .then(() =>{}).catch(e =>{
            /* eslint-disable no-console */
            console.log(e);
        }).finally(() => setLoading(false));
    }
  }

  const handleSave = (saved?: IQueryInstance) =>{
      if(saved){
        setInstances([...instances].map(i => i.id === saved.id ? saved : i))
        setActiveInstance(saved);
        setOpenValidationEditor(false);
        createProcessInstance(saved);
        // getInstances();
      }
  }

  const handleChangeCategory = (e) =>{
    const value = e.target.value;
    setCat([...cats].find(c => c.id === value));
  }

  const handleChangeValidate = (e) =>{
    const value = e.target.value;
    if(value === QueryInstanceStatus.VALIDATED.toString())
      setStatus(QueryInstanceStatus.VALIDATED)
    else if(value === QueryInstanceStatus.REJECTED.toString())
      setStatus(QueryInstanceStatus.REJECTED)
    else if(value === QueryInstanceStatus.WAIT_VALIDATION.toString())
      setStatus(QueryInstanceStatus.WAIT_VALIDATION)
    else
      setStatus(null);
  }

  const handleCloseOpenQuery = () =>{
    setOpenQuery(false);
    getInstances();
  }

  const handleCloseValidationEditor = () =>{
    setOpenValidationEditor(false);
    getInstances();
  }
  
  return (
    <React.Fragment>
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQueryInstance.home.title")}`}</title></Helmet>
        {activeInstance && <>
         <IQueryInstanceValidationUpdate
            open={openValidationEditor}
            instance={activeInstance}
            onSave={handleSave}
            onClose={handleCloseValidationEditor}
         />
         <QueryInstanceDetail 
           open={openQuery}
           instance={activeInstance}
           instanceId={activeInstance ? activeInstance.id : null}
           onClose={handleCloseOpenQuery}
         />
         <QueryInstanceValidation 
          open={openValidations}
          istance={activeInstance}
          onClose={() => setOpenValidations(false)}
         />
         </>}
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                   {!props.hideTitle && 
                    <Typography className="ml-3 mr-3" variant="h4">
                        <Translate contentKey="microgatewayApp.qmanagerQueryInstance.home.title">Queries</Translate>
                    </Typography>}
                    <CardSubHeaderInlineSearchBar
                     onChange = {handleSearchChange}
                     />
                </Box>}
                className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left">Instance</TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryInstance.startAt')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryInstance.userId')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.detail.title')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.category')}
                                    {cats && 
                                    <Select
                                       style={{fontSize: '12px',}}
                                        value={cat ? cat.id : 0}
                                        onChange={handleChangeCategory}
                                        MenuProps={{
                                            classes: {
                                                list: classes.catSelectMenuItemList,
                                            }
                                        }}
                                        classes={{
                                            icon: 'text-white'
                                        }}
                                        className={classes.catSelect}
                                         
                                    >
                                      <MenuItem selected={!cat || !cat.id} value="">{translate('_global.label.all')}</MenuItem>
                                      {[...cats].map((c,index) =>(
                                        <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                                      ))}
                                    </Select>
                                    }
                              </TableCell>
                              <TableCell align="center">
                                {translate('_global.label.chrono')}
                              </TableCell>
                              <TableCell align="right">
                                {translate('microgatewayApp.qmanagerQueryInstance.status')}
                                    {cats && 
                                    <Select
                                       style={{fontSize: '12px',}}
                                        value={status ? status.toString() : ""}
                                        onChange={handleChangeValidate}
                                        MenuProps={{
                                            classes: {
                                                list: classes.catSelectMenuItemList,
                                            }
                                        }}
                                        classes={{
                                            icon: 'text-white'
                                        }}
                                        className={classes.catSelect}
                                         
                                    >
                                      <MenuItem selected={!status} value="">{translate('_global.label.all')}</MenuItem>
                                      <MenuItem selected={status === QueryInstanceStatus.VALIDATED}
                                         value={QueryInstanceStatus.VALIDATED.toString()}>
                                            {translate('microgatewayApp.QueryInstanceStatus.VALIDATED')}
                                      </MenuItem>
                                      <MenuItem selected={status === QueryInstanceStatus.REJECTED} value={QueryInstanceStatus.REJECTED.toString()}>
                                          {translate('microgatewayApp.QueryInstanceStatus.REJECTED')}
                                      </MenuItem>
                                      <MenuItem selected={status === QueryInstanceStatus.WAIT_VALIDATION}
                                         value={QueryInstanceStatus.WAIT_VALIDATION.toString()}>
                                          {translate('microgatewayApp.QueryInstanceStatus.WAIT_VALIDATION')}
                                      </MenuItem>
                                    </Select>
                                    }
                              </TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {(loading || items.length <=0) && <TableRow>
                          <TableCell align="center" colSpan={20}>
                            {loading && 'loading...'}
                            {(!loading && items.length<=0) &&
                              <Typography variant="body1">
                                <Translate contentKey="microgatewayApp.qmanagerQuery.home.notFound">No Query client types found</Translate>
                              </Typography>
                            }
                          </TableCell>
                        </TableRow>}
                          {items}
                      </TableBody>
                  </Table>
                </CardContent>
               {totalItems > 0 &&
                <CardActions className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={totalItems}
                    page={activePage}
                    onPageChange={handleChangePage}
                    rowsPerPage={itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemsPerpage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelRowsPerPage={translate("_global.label.rowsPerPage")}
                    labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
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

const mapStateToProps = ({ authentication, appUtils }: IRootState) => ({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
});

const mapDispatchToProps = {
  getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceTovalidate);
