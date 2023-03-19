import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

import { Badge, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Visibility } from '@material-ui/icons';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import TextContentManager from 'app/shared/component/text-content-manager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import QueryFile from '../../query-file/custom/query-file';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import QueryInstanceUpdate from '../../query-instance/custom/query-instance-update';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { useHistory } from 'react-router';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import MyCustomPureHtmlRender, { MyCustomPureHtmlRenderModal } from 'app/shared/component/my-custom-pure-html-render';
import NotifAutoCleaner from 'app/entities/notification/custom/notif-auto-cleaner';
import { NotifTag } from 'app/shared/model/enumerations/notif-tag-modal';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow:  'none', // '-1px -1px 10px',
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
      height:theme.spacing(3),
      fontSize:15,
      color: theme.palette.primary.dark,
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
      // borderBottom: '1px solid white',
  },
  badge:{
    right: -7,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

const ItemRow = (props: {
        query: IQuery, userId: any, 
        todoUserIsCurrentLogged: boolean, 
        onOpenQueryFiles?: Function}) =>{
  const { query } = props

  const enum ShowableText{description = 'description', name='name', processLabel = 'processLabel'}
  
  const [qProcess, setQProcess] = useState<IProcess>(null);

  const [loadingProcess, setLoadingProcess] = useState(false);
  const [showText, setShowText] = useState(false);
  const [textToShow, setTextToShow] = useState<ShowableText>(ShowableText.name);
  const [openIsntanceUpdate, setOpenInstanceUpdate] = useState(false);
  const [instancesSize, setInstancesSize] = useState(0);
  const [countingInstances, setCountingInstances] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);

  const history = useHistory();

  const classes = useStyles()

  const countInstances = () =>{
    if(props.query && props.userId){
        setCountingInstances(true)
        axios.get<IQueryInstance>(`${API_URIS.queryInstanceApiUri}/?queryId.equals=${props.query.id}&userId.equals=${props.userId}&page=${0}&size=${1}`)
            .then(res =>{
                setInstancesSize(parseInt(res.headers["x-total-count"], 10));
            }).catch(e => console.log(e))
            .finally(() =>{
              setCountingInstances(false)
            })
    }
  }

  const getProcess = () =>{
    if(props.query && props.query.processId && serviceIsOnline(SetupService.PROCESS)){
        setLoadingProcess(true);
        axios.get<IProcess>(`${API_URIS.processApiUri}/${props.query.processId}`)
            .then(res =>{
                setQProcess(res.data);
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoadingProcess(false)
            })
    }
  }

  useEffect(() =>{
    getProcess();
    countInstances();
  }, [])

  const handleShowText = (tag: ShowableText) =>{
    if(tag){
      setTextToShow(tag)
      setShowText(true);
    }
  }


  const handleOpenFiles = () =>{
    if(props.onOpenQueryFiles)
      props.onOpenQueryFiles(query);
  }

  const handleUpdateInstance = () =>{
    setOpenInstanceUpdate(true);
  }
  
  const handleSave = (saved?: IQueryInstance, isNew?:boolean) =>{
      if(saved && isNew)
        setInstancesSize(instancesSize + 1);
      setOpenInstanceUpdate(false);
  }

  const viewInstances = () =>{
    history.push(`/query/${query.id}/instances`)
  }

  const clientType = query && query.clientType ? query.clientType.name : '...';

  const  queryProcess = qProcess ? qProcess.label + `${qProcess.category ? ' ('+ qProcess.category.name +' )' : ''}` : '';
  const textManagerTitle = textToShow === ShowableText.description ? 'description' : textToShow === ShowableText.processLabel ? 'processId' : 'name';

  return (
    <React.Fragment>
     {query && <>
          <QueryInstanceUpdate
            open={openIsntanceUpdate}
            instance={{query}}
            onSave={handleSave}
            onClose={() => setOpenInstanceUpdate(false)}
          />
          <TextContentManager
              title={translate('microgatewayApp.qmanagerQuery.'+textManagerTitle)} 
              value={textToShow === ShowableText.description ? query.description : textToShow === ShowableText.processLabel ? queryProcess : query.name}
              readonly
              open={showText}
              onClose={() => setShowText(false)}
          />
          <MyCustomPureHtmlRenderModal 
            open={openDesc}
            onClose={() => setOpenDesc(false)}
            body={query.description}
            title={translate('microgatewayApp.qmanagerQuery.description')}
          />
        <TableRow hover>
          <TableCell align="left">
            <Box display="flex" alignItems="center">
                <Typography className={''}>{query.name}</Typography>
               {/*  <IconButton color="primary" className="p-0 ml-3" onClick={() => handleShowText(ShowableText.name)}>
                    <Visibility />
                </IconButton> */}
            </Box>
          </TableCell>
          <TableCell align="center">
              {query.description ?
              <Box display="flex" justifyContent="center" alignItems="center">
                  <IconButton color="primary" className="p-0 ml-3" onClick={() => setOpenDesc(true)}>
                      <Visibility />
                  </IconButton>
              </Box> : '...'}
          </TableCell>
          <TableCell align="center">
              <IconButton color="primary" className="p-0 ml-3" onClick={handleOpenFiles}>
                  <Visibility />
              </IconButton>
          </TableCell>
          <TableCell align="center">{query.category ? query.category.name : '...'}</TableCell>
          <TableCell align="center">{clientType}</TableCell>
          <TableCell align="center">
              {loadingProcess ? 'loading...' : (
                  queryProcess.length !==0 && queryProcess !== '' ?
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <MyCustomPureHtmlRender body={queryProcess} renderInSpan />
                    </Box>
                  : '...'
              )}</TableCell>
          {props.todoUserIsCurrentLogged && <>
          <TableCell align="center">
            <Box display='flex' width={1} alignItems='center' justifyContent='flex-end'>
                {countingInstances && <CircularProgress color="primary" style={{ width: 15, height: 15, marginRight: 5}} />}
                  <Tooltip title={translate("entity.action.view")} placement="left">
                      <IconButton color="primary" className="p-0" onClick={viewInstances}>
                          <Badge badgeContent={instancesSize} color="secondary"
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            classes={{
                              badge: classes.badge,
                            }}>
                            <Visibility />
                          </Badge>
                      </IconButton>
                  </Tooltip>
                  <Tooltip className="ml-4" title={translate("_global.label.add")} placement="left">
                      <IconButton color="primary" className="p-0" onClick={handleUpdateInstance}>
                          <FontAwesomeIcon icon={faPlus} size="sm" />
                      </IconButton>
                  </Tooltip> 
            </Box>
          </TableCell>
          </>}
        </TableRow>
      </>}
    </React.Fragment>
  )
}

interface UserQueryProps extends StateProps, DispatchProps{}

export const UserQuery = (props: UserQueryProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<IQuery>(null);
  const [openQueryFiles, setOpenQueryFiles] = useState(false);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;

  const todoUserIsCurrentLogged = props.account && (props.account.id === props.todoUserId || !props.todoUserId)

  const getQueries = (p?: number, rows?: number) => {
    setTotalItems(0);
    setQueries([]);
    if(userId){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        const requestUri =`${API_URIS.queryApiUri}/byUser/${userId}?shared=true&page=${page}&size=${size}&sort=id,desc`;
        axios.get<IQuery[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setQueries(res.data)
            setLoading(false);
          }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
          });
    }
  };

  useEffect(() =>{
    if(!props.account)
      props.getSession();
  }, [])

  useEffect(() =>{
    getQueries();
  }, [props.todoUserId, props.account])

  const handleOpenQueryFiles = (q?: IQuery) =>{
    if(q){
      setActiveQuery(q);
      setOpenQueryFiles(true);
    }
  }

  const items = [...queries].sort((a,b) =>b.id-a.id).filter(q =>
        (q.name && q.name.toLowerCase().includes(searchValue.toLowerCase()))
     ).map((query, index) =>(
       <ItemRow key={index} 
        query={query}
        userId={userId}
        todoUserIsCurrentLogged={todoUserIsCurrentLogged}
        onOpenQueryFiles={handleOpenQueryFiles}
        />
    ))

  const handleSearchChange = (e) =>{
    setSearchValue(e.target.value);
  }

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getQueries(0, parseInt(event.target.value, 10))
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getQueries(newPage)
  }
  
  return (
    <React.Fragment>
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQuery.home.title")}`}</title></Helmet>
          <QueryFile
            query={activeQuery}
            open={openQueryFiles}
            readonly
            onClose={() => setOpenQueryFiles(false)}
          />
        <NotifAutoCleaner tags={[NotifTag.Q_CREATED, NotifTag.Q_INSANCE_CREATED,
                  NotifTag.Q_INSTANCE_REJECTED, NotifTag.Q_INSTANCE_VALIDATED]} />
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="ml-3 mr-3" variant="h4">
                        <Translate contentKey="microgatewayApp.qmanagerQuery.home.title">Queries</Translate>
                    </Typography>
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
                              <TableCell align="left">
                                {translate('microgatewayApp.qmanagerQuery.detail.title')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.description')}
                              </TableCell>
                              <TableCell align="center">Documents</TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.category')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.clientType')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.processId')}
                              </TableCell>
                              {todoUserIsCurrentLogged && <TableCell align="right">Instances</TableCell> }
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

export default connect(mapStateToProps, mapDispatchToProps)(UserQuery);
