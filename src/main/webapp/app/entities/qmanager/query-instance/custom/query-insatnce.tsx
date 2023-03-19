import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';

import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages, getUserExtraFullName } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Update, Visibility } from '@material-ui/icons';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import TextContentManager from 'app/shared/component/text-content-manager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faEdit, faEye, faStopwatch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import QueryInstanceUpdate from '../../query-instance/custom/query-instance-update';
import { RouteComponentProps, useHistory } from 'react-router';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import QueryDetail from '../../query/custom/query-detail';
import QueryInstanceDetail from './query-instance-detail';
import QPonctualTaskExecTime from '../../q-ponctual-task-info/custom/q-ponctual-task-exec-times';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import { LogigramModal } from 'app/entities/microprocess/process/custom/logigram-modal';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow: '-1px -1px 10px',
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
}))

const ItemRow = (props: {insatnce: IQueryInstance,
   onUpdateInstance?: Function,
   onDelete?: Function,
   onOpenQuery?: Function, 
   onOpenPonctualTaskExecTime?: Function,
   handleOpenDetail?: Function,
   handleOpenLogigram?: Function}) =>{
  const { insatnce } = props

  const enum ShowableText{name='name'}

  const [luncher, setLuncher] = useState<IUserExtra>(null);
  const [loadingLuncher, setLondingLuncher] = useState(false);

  const [showText, setShowText] = useState(false);
  const [textToShow, setTextToShow] = useState<ShowableText>(ShowableText.name);
  const [pInstance, setPInstance] = useState<IProcess>(null);
  const [pInstanceLoading, setPInstanceLoading] = useState(false);

  const classes = useStyles()

  const getLuncher = () =>{
      if(props.insatnce && props.insatnce.userId){
          setLondingLuncher(true);
          axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${props.insatnce.userId}`)
            .then(res => setLuncher(res.data))
            .catch(e => console.log(e))
            .finally(() => setLondingLuncher(false))
      }
  }

  const getProcessInstance = () =>{
    if(props.insatnce && props.insatnce.id && serviceIsOnline(SetupService.PROCESS)){
      setPInstanceLoading(true);
      let apiUri = `${API_URIS.processApiUri}/?queryId.equals=${props.insatnce.id}`;
      apiUri = `${apiUri}&page=0&size=1&sort=id,desc`;
      axios.get<IProcess[]>(apiUri)
        .then(res => {
          if(res.data && res.data.length !== 0)
            setPInstance(res.data[0]);
          else
            setPInstance(null);
        })
        .catch(e => console.log(e))
        .finally(() => setPInstanceLoading(false))
    }
  }

  useEffect(() =>{
    getLuncher();
    getProcessInstance();
  }, [])

  const handleShowText = (tag: ShowableText) =>{
    if(tag){
      setTextToShow(tag)
      setShowText(true);
    }
  }
  
  const handleUpdateInstance = () =>{
      if(props.onUpdateInstance)
        props.onUpdateInstance(insatnce);
  }

  const handleDelete = () =>{
      if(props.onDelete)
        props.onDelete(insatnce);
  }

  const handleOpenQuery = () =>{
     if(props.onOpenQuery)
        props.onOpenQuery(insatnce);
  }

  const handleOpenDetail = () =>{
    if(props.handleOpenDetail)
       props.handleOpenDetail(insatnce);
  }

  const handleOpenPonctualTaskExecTime = () =>{
    if(insatnce && props.onOpenPonctualTaskExecTime)
        props.onOpenPonctualTaskExecTime(insatnce);
  }

  const textManagerTitle = textToShow === ShowableText.name ? 'name' : 'name';

  const handleOpenLogigram = () =>{
     if(pInstance && props.handleOpenLogigram)
      props.handleOpenLogigram(pInstance);
  }

  return (
    <React.Fragment>
     {insatnce && <>
        <TextContentManager
            title={translate('microgatewayApp.qmanagerQuery.'+textManagerTitle)} 
            value={textToShow === ShowableText.name ? insatnce.name : insatnce.name}
            readonly
            open={showText}
            onClose={() => setShowText(false)}
        />
        <TableRow hover>
          <TableCell align="left">
            <Box display="flex" alignItems="center">
                {/* <IconButton color="primary" className="p-0 ml-r" onClick={() => handleShowText(ShowableText.name)}>
                    <Visibility />
                </IconButton> */}
                <MyCustomPureHtmlRender body={insatnce.name} renderInSpan /> 
            </Box>
          </TableCell>
          <TableCell align="center">
              {insatnce.query ? insatnce.query.name : '...'}
          </TableCell>
          <TableCell align="center">
                {insatnce.startAt ?
                 <TextFormat type="date" value={convertDateTimeToServer(insatnce.startAt)} format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`}  /> 
                 : '...'}
          </TableCell>
          <TableCell align="center">
              {pInstanceLoading ? 'loading...' : (
                pInstance ? <Tooltip title={pInstance.label} onClick={handleOpenLogigram}>
                    <IconButton size='small' className='p-0'><Visibility /></IconButton>
                </Tooltip> : '...'
              )}
          </TableCell>
          <TableCell align="center">
              {loadingLuncher ? 'loading...' : getUserExtraFullName(luncher)}
          </TableCell>
          <TableCell align="center">
              {insatnce.ponctual ? 'N/A' : translate(`microgatewayApp.QueryInstanceStatus.${insatnce.status.toString()}`)}
          </TableCell>
          <TableCell align="center">
            <Box display='flex' width={1} alignItems='center' justifyContent='flex-end'>
                <Tooltip className="" title={translate("entity.action.view")} placement="left">
                    <IconButton color="primary" className="p-0" onClick={handleOpenDetail}>
                        <FontAwesomeIcon icon={faEye} size="sm" />
                    </IconButton>
                </Tooltip>
                <Tooltip className="ml-3" title={translate("entity.action.edit")} placement="left">
                    <IconButton color="primary" className="p-0" onClick={handleUpdateInstance}>
                        <FontAwesomeIcon icon={faEdit} size="sm" />
                    </IconButton>
                </Tooltip>
                {insatnce && insatnce.ponctual && 
                  <Tooltip className="ml-3" title={translate("_global.label.executionTime")} placement="left">
                      <IconButton color="primary" className="p-0" onClick={handleOpenPonctualTaskExecTime}>
                          <FontAwesomeIcon icon={faStopwatch} size="sm" />
                      </IconButton>
                  </Tooltip>
                }
                <Tooltip className="ml-3" title={translate("entity.action.delete")} placement="left">
                    <IconButton color="secondary" className="p-0" onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                    </IconButton>
                </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      </>}
    </React.Fragment>
  )
}

interface QueryInstanceProps extends StateProps, DispatchProps, RouteComponentProps<{id: string}>{}

export const QueryInstance = (props: QueryInstanceProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [instances, setInstances] = useState<IQueryInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInstance, setactiveInstance] = useState<IQueryInstance>(null);
  const [openInstanceUpdate, setOpenInstanceUpdate] = useState(false);
  const [openInstanceDeleter, setOpenInstanceDeleter] = useState(false);
  const [query, setQuery] = useState<IQuery>(null);
  const [openQuery, setOpenQuery] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [openExecTime, setOpenExecTime] = useState(false);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const [pIstance, setPInstance] = useState<IProcess>(null);

  const [openLogigram, setOpenLogigram] = useState(false);

  const history = useHistory();

  const getInstances = (p?: number, rows?: number) => {
    if(props.account && props.account.id){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        const queryId = props.match.params.id;
        let requestUri =`${API_URIS.queryInstanceApiUri}/${queryId ? `?queryId.equals=${queryId}&` : '?'}`;
        requestUri= `${requestUri}userId.equals=${props.account.id}&page=${page}&size=${size}&sort=id,desc`;
        axios.get<IQueryInstance[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setInstances(res.data)
            setLoading(false);
          }).catch((e) =>{
            setLoading(false);
            /* eslint-disable no-console */
            console.log(e);
          });
    }
  };

  const getQuery = () =>{
    if(props.match.params.id){
        axios.get<IQuery>(`${API_URIS.queryApiUri}/${props.match.params.id}`)
          .then(res => {
                setQuery(res.data);
          }).catch((e) =>{
            console.log(e);
          });
    }
  }

  useEffect(() =>{
     if(!props.account)
        props.getSession();
      getQuery();
  }, [])

  useEffect(() =>{
    getInstances();
  }, [props.account])


  const handleOpenInstanceUpdate = (inst?: IQueryInstance) =>{
        if(inst){
            setactiveInstance(inst);
            setOpenInstanceUpdate(true);
        }
  }

  const onSave = (saved?: IQueryInstance, isNew?:boolean) =>{
      if(saved){
          if(isNew)
            setInstances([saved, ...instances])
          else
            setInstances(instances.map(i => i.id === saved.id ? saved : i));
        setOpenInstanceUpdate(false)
      }
  }


  const handleDelete = (inst?: IQueryInstance) =>{
    if(inst){
        setactiveInstance(inst);
        setOpenInstanceDeleter(true);
    }
}

  const onDelete = (deletedId) =>{
      if(deletedId){
        setInstances([...instances].filter(i => i.id !== deletedId))
        setOpenInstanceDeleter(false);
      }
  }

  const handleOpenQuery = (inst?: IQueryInstance) => {
      if(inst){
        setactiveInstance(inst)
        setOpenQuery(true);
      }
  }

  const handleOpenDetail = (inst?: IQueryInstance) => {
      if(inst){
        setactiveInstance(inst)
        setOpenDetail(true);
      }
  }

  const handleOpenPonctualTaskExecTime = (inst?: IQueryInstance) =>{
    if(inst){
      setactiveInstance(inst);
      setOpenExecTime(true);
    }
  }

  const handleOpenLogigram = (pi: IProcess) =>{
    if(pi){
      setPInstance(pi);
      setOpenLogigram(true);
    }
  }

  const items = [...instances].sort((a,b) =>b.id-a.id).filter(inst =>
        (inst.name && inst.name.toLowerCase().includes(searchValue.toLowerCase()))
     ).map((inst, index) =>(
       <ItemRow key={index} 
        insatnce={inst}
        onUpdateInstance={handleOpenInstanceUpdate}
        onDelete={handleDelete}
        onOpenQuery={handleOpenQuery}
        handleOpenDetail={handleOpenDetail}
        onOpenPonctualTaskExecTime={handleOpenPonctualTaskExecTime}
        handleOpenLogigram={handleOpenLogigram}
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
  
  return (
    <React.Fragment>
        <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQueryInstance.home.title")}`}</title></Helmet>
        {activeInstance && <>
        <EntityDeleterModal 
            open={openInstanceDeleter}
            entityId={activeInstance.id}
            urlWithoutEntityId={API_URIS.queryInstanceApiUri}
            onDelete={onDelete}
            onClose={() => setOpenInstanceDeleter(false)}
            question={translate("microgatewayApp.qmanagerQueryInstance.delete.question", {id: activeInstance.name})}
        />
        <QPonctualTaskExecTime
            open={openExecTime}
            account={props.account}
            instance={activeInstance}
            onClose={() => setOpenExecTime(false)}
         />
         <QueryInstanceDetail 
           open={openDetail}
           instance={activeInstance}
           instanceId={activeInstance ? activeInstance.id : null}
           onClose={() => setOpenDetail(false)}
         />
        </> }
        {((activeInstance && activeInstance.query) || query) && <> 
          <QueryInstanceUpdate
            open={openInstanceUpdate}
            instance={activeInstance || {query}}
            onClose={() => setOpenInstanceUpdate(false)}
            onSave={onSave}
          />
          <QueryDetail 
            open={openQuery}
            query={query || activeInstance.query}
            onClose={() => setOpenQuery(false)}
          />
        </>}
        {pIstance && 
          <LogigramModal
            open={openLogigram}
            process={pIstance}
            onClose={() => setOpenLogigram(false)}
          />
        }
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display={"flex"} alignItems="center">
                      {props.match.params.id ? <>
                      <IconButton 
                        aria-label="back" 
                        color="inherit"
                        onClick={() =>{ history.goBack()}} 
                        title="prev" style={{ padding: 0}}>
                          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                        </IconButton>
                      </>
                      : <Update color='primary' />
                    }
                    <Typography className="ml-3 mr-3" variant="h4">
                        {translate(`${props.match.params.id ? 'microgatewayApp.qmanagerQueryInstance.home.title' : '_global.label.queriesHistory'}`)}
                    </Typography>
                    </Box>
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
                                {translate('microgatewayApp.qmanagerQueryInstance.name')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.category')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryInstance.startAt')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.microprocessProcess.detail.title')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryInstance.userId')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryInstance.validated')}
                              </TableCell>
                              <TableCell align="right">actions</TableCell>
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

const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account
});

const mapDispatchToProps = {
    getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(QueryInstance);
