import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Modal, TablePagination, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { Add, CheckCircle, Close, Delete } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { IQuery } from "app/shared/model/qmanager/query.model";
import { IQueryUser } from "app/shared/model/qmanager/query-user.model";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IQueryUserValidator } from "app/shared/model/qmanager/query-user-validator.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import QueryUserValidator from "../../query-user-validator/custom/query-user-validator";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '38%',
        [theme.breakpoints.down("sm")]:{
            width: '98%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    cardActions:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 15px 15px',
    },
    input: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 0,
      color: theme.palette.primary.dark,
      border: 'none',
      borderRadius: 15,
      '&:hover':{
        border: `1px solid ${theme.palette.primary.dark}`,
      }
    },
    fileIllustattionAvatar:{
        width: 50,
        height: 50,
        fontSize: theme.spacing(6),
    },
    fileIllustattionBox:{
        cursor: 'pointer',
        '&:hover':{
            border: `1px solid ${theme.palette.secondary.dark}`,
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

interface QueryUserProps{
    query: IQuery,
    onSave?: Function,
    open?: boolean,
    onClose: Function,
}

const QueryUserListItem = (props: {queryUser: IQueryUser, userExtra: IUserExtra, onDelete?: Function}) =>{
    const { userExtra, queryUser } = props;
    
    const [nbValidators, setNbValidators] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const countValidators = () =>{
        if(props.queryUser && props.queryUser.userId && props.queryUser.query){
            const { userId, query } = props.queryUser
            setLoading(true);
            axios.get<IQueryUserValidator[]>(`${API_URIS.queryUserValidatorsApiUri}/?userId.equals=${userId}&queryId.equals=${query.id}&page=${0}&size=${1}`)
                .then(res =>{
                    setNbValidators(parseInt(res.headers['x-total-count'], 10))
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        countValidators();
    }, [props.queryUser])

    const handleDelete = () =>{
        if(props.onDelete)
            props.onDelete(queryUser);
    }

    const handleShowValidator = () => {
        setOpen(true);
    }
    
    const handleValidatorDeletes = (deletedI) =>{
        if(deletedI){
            setNbValidators(nbValidators -1);
        }
    }

    const handleValidatorSave = (saved?: IQueryUserValidator, isNew?: boolean) =>{
        if(saved && isNew)
            setNbValidators(nbValidators +1);
    }

    return (
        <React.Fragment>
            {queryUser && queryUser.query && <>
                <QueryUserValidator
                    open={open}
                    userId={queryUser.userId}
                    queryId={queryUser.query.id}
                    onDeleted={handleValidatorDeletes}
                    onSaved={handleValidatorSave}
                    onClose={() => setOpen(false)}
                />
            {userExtra && <ListItem button>
                <ListItemText
                    primary={getUserExtraFullName(userExtra)}
                />
                <ListItemSecondaryAction>
                    {(!queryUser.query || !queryUser.query.ponctual) &&
                    <IconButton 
                        color="primary"
                        onClick={handleShowValidator}
                        title={translate("microgatewayApp.qmanagerQueryUserValidator.home.title")}>
                        <CheckCircle />
                    </IconButton>}
                    {nbValidators ===0 && 
                    <IconButton color="secondary" onClick={handleDelete}>
                            <Delete />
                    </IconButton>
                    }
                </ListItemSecondaryAction>
            </ListItem>
            }
            </> }
        </React.Fragment>
    )
}

export const QueryUser = (props: QueryUserProps) =>{
    const { open, query } = props;
    
    const [searchValue, setSearchValue] = useState('')

    const [qUsers, setQUsers] = useState<IQueryUser[]>([]);

    const [qUserToDelete, setQuserToDelete] = useState<IQueryUser>(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [userExtras, setUserExtras] = useState<IUserExtra[]>([]);
    
    const [openUserFinder, setOpenUserFinder] = useState(false);

    const [loading, setLoading] = useState(false);

    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();


    const getUserExtras = (userIds: any[]) =>{
        setUserExtras([]);
        if(userIds && userIds.length !== 0){
          setLoading(true);
          axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/getByIdIn/?ids=${userIds.join(',')}`)
            .then(res => {
              setUserExtras([...res.data])
            }).catch((e) =>{
              /* eslint-disable no-console */
              console.log(e);
            }).finally(() => setLoading(false));
        }
    }

    const getAllEntities = (p?: number, rows?: number) => {
      if(props.query){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        const requestUri =`${API_URIS.queryUserApiUri}/?queryId.equals=${props.query.id}&page=${page}&size=${size}`;
        axios.get<IQueryUser[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setQUsers(res.data)
            getUserExtras([...res.data].map(u => u.userId));
          }).catch((e) =>{
            console.log(e);
          }).finally(() => setLoading(false));
      }
    }

  useEffect(() =>{
    getAllEntities();
  }, [props.query])

  const handleClose = () => props.onClose();

  const onSelecteChange = (ue?: IUserExtra, isSelecting?: boolean) => {
      if(ue){
        setLoading(false)
            if(isSelecting){
                const entity: IQueryUser = {
                    query,
                    userId: ue.id,
                }
                axios.post<IQueryUser>(API_URIS.queryUserApiUri, cleanEntity(entity))
                    .then(res =>{
                        if(res.data){
                            setUserExtras([ue, ...userExtras]);
                            setQUsers([res.data, ...qUsers]);
                        }
                    }).catch(e => console.log(e))
                    .finally(() => {
                        setLoading(false);
                    })
            }else{
                const querUserToDetach = [...qUsers].find(qu => qu.id && qu.userId === ue.id);
                if(querUserToDetach){
                    axios.delete(`${API_URIS.queryUserApiUri}/${querUserToDetach.id}`)
                        .then(res =>{
                            if(res.data){
                                setUserExtras([...userExtras].filter(u => u.id !== ue.id));
                                setQUsers([...qUsers].filter(qu => qu.userId !== ue.id))
                            }
                        }).catch(e => console.log(e))
                        .finally(() => {
                            setLoading(false);
                        })
                }else{
                    setUserExtras([...userExtras].filter(u => u.id !== ue.id));
                    setQUsers([...qUsers].filter(qu => qu.userId !== ue.id))
                    setLoading(false);
                }
            }
        }
  };

   const handleSearchChange = (e) =>{
     setSearchValue(e.target.value);
   }
 
   const handleChangeItemsPerpage = (event) =>{
     setItemsPerPage(parseInt(event.target.value, 10));
     getAllEntities(0, parseInt(event.target.value, 10));
   }
 
   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getAllEntities(newPage);
   }

   const onDelete = (deletdId?: any) =>{
        if(deletdId){
            setQUsers([...qUsers].filter(qu => qu.id !== deletdId));
            if(qUserToDelete)
                setUserExtras([...userExtras].filter(ue => ue.id !== qUserToDelete.userId))
            setOpenDelete(false);
        }
   }

   const handleDelete = (qu?: IQueryUser) =>{
       if(qu){
           setQuserToDelete(qu);
           setOpenDelete(true);
       }
   }

   const items = [...userExtras]
   .filter(ue => (
        (ue.user && ue.user.firstName && ue.user.firstName.toLowerCase().includes(searchValue.toLowerCase()))
        || (ue.user && ue.user.lastName && ue.user.lastName.toLowerCase().includes(searchValue.toLowerCase()))
        || (ue.employee && ue.employee.firstName && ue.employee.firstName.toLowerCase().includes(searchValue.toLowerCase()))
        || (ue.employee && ue.employee.firstName && ue.employee.firstName.toLowerCase().includes(searchValue.toLowerCase()))
   ))
   .map((ue, index) => (
    <QueryUserListItem key={index} 
        queryUser={[...qUsers].find(qu => qu.userId === ue.id)}
        userExtra={ue} onDelete={handleDelete}/>
   ))

    return (
        <React.Fragment>
        {qUserToDelete && <EntityDeleterModal 
            open={openDelete}
            entityId={qUserToDelete.id}
            urlWithoutEntityId={API_URIS.queryUserApiUri}
            onDelete={onDelete}
            onClose={() => setOpenDelete(false)}
            question={translate("microgatewayApp.qmanagerQueryUser.delete.question", {id: ''})}
        />}
        {query && <UserExtraFinder2
            unSelectableIds={[...userExtras].map(ue => ue.id)}
            multiple
            open={openUserFinder}
            onClose={() => setOpenUserFinder(false)}
            onSelectChange={onSelecteChange}
         />}
        <Modal open={open} onClose={handleClose}
             closeAfterTransition
             BackdropComponent={Backdrop}
             BackdropProps={{
             timeout: 500,
         }}
         disableBackdropClick
         className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="h4">
                                <Translate contentKey="microgatewayApp.qmanagerQueryUser.home.title">qUsers</Translate>
                            </Typography>
                            <CardSubHeaderInlineSearchBar
                                onChange = {handleSearchChange}
                            />
                            <IconButton color="primary" onClick={() => setOpenUserFinder(true)}>
                                <Add />
                            </IconButton>
                            <IconButton color="inherit" onClick={handleClose} className="ml-2"><Close /></IconButton>
                        </Box>}
                        className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                        <Typography className="ml-2">loading...</Typography>
                            </Box>}
                            {query && <Box width={1} display="flex" flexWrap="wrap" 
                                justifyContent="center" alignItems="center">
                                <Typography variant="caption" color="primary" className="mr-2">
                                    {`${translate("microgatewayApp.qmanagerQuery.detail.title")} : ${query.name}`}
                                </Typography>
                            </Box>
                            }
                            <List>
                                {items}
                                {(!loading && [...qUsers].length ===0 ) && <ListItem>
                                    <Box width={1} textAlign="center">
                                        <Typography variant="body1">
                                            <Translate contentKey="microgatewayApp.qmanagerQueryUser.home.notFound">No qUsers found</Translate>
                                        </Typography>
                                    </Box>
                                </ListItem>}
                            </List>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        {totalItems > 0 &&
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
                        }
                    </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default QueryUser;