import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URIS, getTotalPages, getUserExtraFullName } from 'app/shared/util/helpers';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { Add, Delete, Edit, Visibility } from '@material-ui/icons';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import QueryUpdate from './query-update';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import TextContentManager from 'app/shared/component/text-content-manager';
import QueryUser from '../../query-user/cutom/query-user';
import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faEyeSlash, faListAlt, faShare } from '@fortawesome/free-solid-svg-icons';
import QueryFieldForm from '../../query-field/cutom/query-field-form';
import { cleanEntity } from 'app/shared/util/entity-utils';
import QueryFile from '../../query-file/custom/query-file';
import MyCustomPureHtmlRender, { MyCustomPureHtmlRenderModal } from 'app/shared/component/my-custom-pure-html-render';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

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

const ItemRow = (props: {query: IQuery, onUpdate?: Function,
   onDelete?: Function, onShowUser?: Function, onOpenForm?: Function,
  onToggleShare?: Function, onOpenQueryFiles?: Function, handleOpenDescription: Function}) =>{
  const { query } = props

  const enum ShowableText{description = 'description', name='name', processLabel = 'processLabel'}
  
  const [qProcess, setQProcess] = useState<IProcess>(null);

  const [userExtra, setUserExtra] = useState<IUserExtra>(null);

  const [loadingProcess, setLoadingProcess] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showText, setShowText] = useState(false);
  const [textToShow, setTextToShow] = useState<ShowableText>(ShowableText.name);

  const classes = useStyles()

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

  const getUserExra = () =>{
    if(props.query && props.query.editorId){
        setLoadingUser(true);
        axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.equals=${props.query.editorId}`)
            .then(res =>{
                if(res.data && res.data.length !== 0)
                    setUserExtra(res.data[0]);
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoadingUser(false)
            })
    }
  }

  useEffect(() =>{
    getProcess();
    getUserExra();
  }, [props.query])

  const handleDelete = () =>{
    if(props.onDelete)
      props.onDelete(query);
  }

  const handleUpdate = () =>{
    if(props.onUpdate)
      props.onUpdate(query);
  }

  const handleShowUser = () =>{
      if(props.onShowUser)
        props.onShowUser(query);
  }

  const handleOpenForm = () =>{
    if(props.onOpenForm)
      props.onOpenForm(query);
  }

  const handleShowText = (tag: ShowableText) =>{
    if(tag){
      setTextToShow(tag)
      setShowText(true);
    }
  }

  const handleToggleShare = () =>{
    if(props.onToggleShare)
      props.onToggleShare(query);
  }

  const handleOpenFiles = () =>{
    if(props.onOpenQueryFiles)
      props.onOpenQueryFiles(query);
  }

  const  queryProcess = qProcess ? qProcess.label + `${qProcess.category ? ' ('+ qProcess.category.name +' )' : ''}` : '';
  const textManagerTitle = textToShow === ShowableText.description ? 'description' : textToShow === ShowableText.processLabel ? 'processId' : 'name';

  return (
    <React.Fragment>
     {query && <>
        {queryProcess.length !==0 && queryProcess !== '' && 
            <TextContentManager
                title={translate('microgatewayApp.qmanagerQuery.'+textManagerTitle)} 
                value={textToShow === ShowableText.description ? query.description : textToShow === ShowableText.processLabel ? queryProcess : query.name}
                readonly
                open={showText}
                onClose={() => setShowText(false)}
            />
        }
        <TableRow hover>
          <TableCell align="left">
            <Box display="flex" alignItems="center">
               {/*  <IconButton color="primary" className="p-0 mr-3" onClick={() => handleShowText(ShowableText.name)}>
                    <Visibility />
                </IconButton> */}
                <Typography className={''}>{query.name}</Typography>
            </Box>
          </TableCell>
          <TableCell align="center">
              {query.description ?
              <Box display="flex" justifyContent="center" alignItems="center">
                  <IconButton color="primary" className="p-0 mr-3" onClick={() => props.handleOpenDescription(query)}>
                      <Visibility />
                  </IconButton>
              </Box> : '...'}
          </TableCell>
          <TableCell align="center">{translate(`_global.label.${query.ponctual ? 'yes' : 'no'}`)}</TableCell>
          <TableCell align="center">
              <IconButton color="primary" className="p-0 ml-3" onClick={handleOpenFiles}>
                  <Visibility />
              </IconButton>
          </TableCell>
          <TableCell align="center">{query.category ? query.category.name : '...'}</TableCell>
          <TableCell align="center">{query.clientType ? query.clientType.name : '...'}</TableCell>
          <TableCell align="center">
              {loadingProcess ? 'loading...' : (
                  queryProcess.length !==0 && queryProcess !== '' ?
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <MyCustomPureHtmlRender body={queryProcess} renderInSpan />
                    </Box>
                  : '...'
              )}</TableCell>
          <TableCell align="center">
              <IconButton color="primary" onClick={handleShowUser} className="p-0">
                  <Visibility />
              </IconButton>
          </TableCell>
          <TableCell align="center">
              <IconButton color="primary" className="p-0" onClick={handleOpenForm}>
                  <FontAwesomeIcon icon={faListAlt} size="sm" />
              </IconButton>
          </TableCell>
          <TableCell align="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography className={classes.truncate}>
                    {translate(`_global.label.${query.shared ? 'published' : 'inEdition'}`)}
                  </Typography>
                  <IconButton 
                  color="primary" 
                  className="p-0 ml-3" 
                  title={translate(`_global.label.${query.shared ? 'hide' : 'publish'}`)}
                  onClick={handleToggleShare}>
                      <FontAwesomeIcon icon={query.shared ? faEyeSlash : faShare} size="sm"/>
                  </IconButton>
              </Box>
          </TableCell>
          <TableCell align="center">{loadingUser ? 'loading...' : getUserExtraFullName(userExtra)}</TableCell>
          <TableCell align="center">
            <Box display='flex' width={1} alignItems='center' justifyContent='flex-end'>
            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.UPDATE]}) && props.onUpdate && 
              <IconButton edge="start" aria-label="Edit" onClick={handleUpdate}
                size="small" className="mr-2">
                <Edit color="primary" titleAccess="Edit"/>
              </IconButton>
            }
            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.DELETE]}) &&
            <IconButton edge="end" aria-label="Delete" onClick={handleDelete} size="small">
              <Delete color="error" titleAccess="Delete"/>
            </IconButton>}
          </Box>
          </TableCell>
        </TableRow>
      </>}
    </React.Fragment>
  )
}

type QueryProps = RouteComponentProps<{ categoryId: string }>

export const Query = (props: QueryProps) => {
  
  const [searchValue, setSearchValue] = useState('')
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [queryToDelete, setQueryToDelete] = useState<IQuery>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryToUpdate, setQueryToUpdate] = useState<IQuery>(null);
  const [activeQuery, setActiveQuery] = useState<IQuery>(null);
  const [showQueryUser, setShowQueryUser] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openQueryFiles, setOpenQueryFiles] = useState(false);

  const [openDescription, setOpenDescription] = useState(false);
  
  const classes = useStyles();

  const [totalItems, setTotalItems] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [activePage, setActivePage] = useState(0);

  const [categoryId, setCategoryId] = useState(props.match.params.categoryId || null);

  const [category, setCategory] = useState<IQCategory>(null);

  const [catLoading, setCatLoading] = useState(false);
  

  const getQueries = (p?: number, rows?: number) => {
    setLoading(true);
    const page = p || p === 0 ? p : activePage;
    const size = rows || itemsPerPage;
    let requestUri =`${API_URIS.queryApiUri}/?page=${page}&size=${size}&sort=id,desc`;
    if(categoryId)
        requestUri = `${requestUri}&categoryId.equals=${categoryId}`;
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
  };

  const getCategory = () =>{
    if(categoryId){
      setCatLoading(true)
      axios.get<IQCategory>(`${API_URIS.queryCategoryApiUri}/${categoryId}`)
        .then(res => {
          setCategory(res.data);
        }).catch(e => console.log(e))
        .finally(() =>{
          setCatLoading(false);
        })
    }
  }

  useEffect(() =>{
      setCategoryId(props.match.params.categoryId || null)
      getCategory();
      getQueries();
  }, [])


  const handleUpdate = (c?: IQuery) =>{
    setQueryToUpdate(c);
    setOpen(true);
  }

  const onUpdate = (updated: IQuery, isNew?: boolean) =>{
     if(updated){
       if(isNew){
        setQueries([updated, ...queries]);
        setOpen(false);
       }else{
         setQueries([...queries].map(q => q.id === updated.id ? updated : q));
       }
     }
  }

  const handleDelete = (q?: IQuery) =>{
    if(q){
      setQueryToDelete(q);
      setOpenDelete(true);
    }
  }

  const onDelete = (deleted?: number) =>{
    if(deleted){
      setQueries([...queries].filter(q => q.id !==deleted));
      setOpenDelete(false)
      setQueryToDelete(null);
    }
  }

  const handleShowQueryUser = (selected?: IQuery) =>{
      if(selected){
          setActiveQuery(selected);
          setShowQueryUser(true);
      }
  }

  const handleOpenForm = (q?: IQuery) =>{
    if(q){
      setQueryToUpdate(q);
      setOpenForm(true);
    }
  }

  const toggleShareValue = (q?: IQuery) =>{
    if(q){
      const entity: IQuery = {
        ...q,
        shared: q.shared ? false : true,
      }
      setLoading(true);
      axios.put<IQuery>(`${API_URIS.queryApiUri}`, cleanEntity(entity))
      .then(res =>{
          if(res.data)
            setQueries([...queries].map(item => item.id === res.data.id ? res.data : item))
      }).catch(err => console.log(err))
      .finally(() => setLoading(false))
    }
  }

  const handleOpenQueryFiles = (q?: IQuery) =>{
    if(q){
      setActiveQuery(q);
      setOpenQueryFiles(true);
    }
  }

  const handleOpenDescription = (q?: IQuery) =>{
    if(q && q.description){
      setActiveQuery(q);
      setOpenDescription(true);
    }
  }

  const items = [...queries].sort((a,b) =>b.id-a.id).filter(q =>
        (q.name && q.name.toLowerCase().includes(searchValue.toLowerCase()))
     ).map((query, index) =>(
       <ItemRow key={index} 
        query={query}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onShowUser={handleShowQueryUser}
        onOpenForm={handleOpenForm}
        onToggleShare={toggleShareValue}
        onOpenQueryFiles={handleOpenQueryFiles}
        handleOpenDescription={handleOpenDescription} />
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
        {queryToDelete && <EntityDeleterModal
            open={openDelete}
            entityId={queryToDelete.id}
            urlWithoutEntityId={API_URIS.queryApiUri}
            onDelete={onDelete} onClose={() => setOpenDelete(false)}
            question={translate("microgatewayApp.qmanagerQuery.delete.question", { id: queryToDelete.name})}
            />}
        <QueryUpdate 
          open={open}
          query={queryToUpdate}
          onSave={onUpdate}
          onClose={() => setOpen(false)}
        />
        {queryToUpdate &&
         <QueryFieldForm 
            open={openForm}
            query={queryToUpdate}
            onClose={() => setOpenForm(false)}
        />}
        <QueryUser 
            query={activeQuery}
            open={showQueryUser}
            onClose={() => setShowQueryUser(false)}
        />
        {activeQuery && <>
           <QueryFile
            query={activeQuery}
            open={openQueryFiles}
            onClose={() => setOpenQueryFiles(false)}
          />
          <MyCustomPureHtmlRenderModal 
            title={translate("microgatewayApp.qmanagerQuery.description")}
            body={activeQuery.description}  
            open={openDescription}
            onClose={() => setOpenDescription(false)}
          />
        </>}
        <Card className={classes.card}>
          <CardHeader
                title={<Box display="flex" justifyContent="space-between" alignItems="center">
                <IconButton 
                aria-label="back" 
                color="inherit"
                onClick={() =>{ props.history.push('/q-category')}} 
                title="process" style={{ padding: 0}}>
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                </IconButton>
                    <Typography className="ml-3 mr-3" variant="h4">
                        <Translate contentKey="microgatewayApp.qmanagerQuery.home.title">Queries</Translate>
                    </Typography>
                    <CardSubHeaderInlineSearchBar
                      onChange = {handleSearchChange}
                     />
                     {catLoading && <CircularProgress color="primary" style={{ width:15, height:15 }} /> }
                     {category && 
                       <Typography>
                            {`${translate("microgatewayApp.qmanagerQCategory.detail.title")} : ${category.name}`}
                       </Typography>
                    }
                     {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                       <IconButton aria-label="add" 
                        onClick={() => handleUpdate({id: null, name: '', category})}
                        color="primary" className="ml-3">
                         <Add style={{ fontSize: 30 }} />
                       </IconButton>
                     }
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
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.ponctual')}
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
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQueryUser.home.title')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('_global.label.form')}
                              </TableCell>
                              <TableCell align="center" className="text-capitalize">
                                {translate('_global.label.state')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.editorId')}
                              </TableCell>
                              <TableCell align="right">{'Actions'}</TableCell>
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

export default Query;
