
import React, { useEffect, useState } from "react"
import { IRootState } from "app/shared/reducers"
import { getSession } from "app/shared/reducers/authentication"
import { changeTodoUserId } from 'app/shared/reducers/app-util'
import { connect } from "react-redux"
import { Box, Button, colors, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Tooltip } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faUserCircle, faUsers } from "@fortawesome/free-solid-svg-icons"
import { IUserExtra } from "app/shared/model/user-extra.model"
import axios from "axios"
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers"
import { translate } from "react-jhipster"
import CustomAvatar from "app/shared/component/custom-avatar"
import MyCustomModal from "app/shared/component/my-custom-modal"
import theme from "app/theme"
import { HorizontalTabLinkWrapper, TabLinkProps } from "app/shared/component/tab-link"
import { hasAnyAuthority } from "app/shared/auth/private-route"
import { AUTHORITIES } from "app/config/constants"
import { hasPrivileges } from "app/shared/auth/helper"
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants"
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar"
import clsx from "clsx"

const useStyles = makeStyles({
    card: {
        width: '35%',
        [theme.breakpoints.down('sm')] :{
            width: '95%',
        }
    },
    currentUserSwicherBtn:{
        color: theme.palette.success.main,
        marginRight: 15,
    },
    userListItem:{
        boxShadow: `0.5px 0.5px 0.5px`,
        border: `0.5px solid ${theme.palette.primary.dark}`,
        marginTop: 7,
        marginBottom: 15,
        borderRadius: 15,
        background: colors.grey[50],
        '&:hover':{
            background: theme.palette.primary.main,
            color: 'white',
            borderColor: 'white',
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
})

const CustomButton = (props: { 
        userExtra: IUserExtra, isLogged?: boolean
        loading?: boolean, onClick?: Function,
        btnLabelClassName?: string,
    }) =>{
    const { loading, isLogged, userExtra } = props;

    const handleClick = () => props.onClick ? props.onClick() : null;
    
    const userFullName = isLogged ? translate('_global.label.you') : getUserExtraFullName(userExtra);

    const classes = useStyles();

    return (
        <React.Fragment>
            <Box display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap">
                <Tooltip title={translate("entity.action.edit")} onClick={handleClick}>
                    <Button color="primary"
                        style={{ textTransform: 'none'}}
                        endIcon={<CustomAvatar alt="" loadingSize={5} 
                            avatarProps={{ style: { width: 30, height: 30 } }}
                            photoId={userExtra ? userExtra.photoId : null} />}
                        className={props.btnLabelClassName || ''}>
                        {loading ? 'loading...' : userFullName}
                    </Button>
                </Tooltip>
            </Box>
        </React.Fragment>
    )
}

const enum TabNames{
    ALL_USERS = 'ALL_USER',
    N_MINUS_ONE = 'N_MINUS_ONE',
}

interface TodoUserFinderButtonProps extends StateProps, DispatchProps{
    btnLabelClassName?: string,
}

export const TodoUserFinderButton = (props: TodoUserFinderButtonProps) =>{
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [tabs, setTabs] = useState<TabLinkProps[]>([]);
    
    const [activeTab, setActiveTab] = useState(TabNames.N_MINUS_ONE);

    const [users, setUsers] = useState<IUserExtra[]>([]);

    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const [searchValue, setSeachValue] = useState('');

    const classes = useStyles();
    
    const userIsCurrentLogged = props.account ? props.account.id === props.todoUserId || !props.todoUserId : false;

    const userIsAdmin = props.account && ( hasAnyAuthority([AUTHORITIES.ADMIN], props.account.authorities)
            || hasPrivileges({ entities: ['Application'], actions: [PrivilegeAction.ALL] }, props.account.authorities))

    const userIsColaborator = props.account && hasAnyAuthority([AUTHORITIES.EMPLOYEE], props.account.authorities)

    const initTabLinks = () =>{
        const items: TabLinkProps[] = [];
        if(userIsColaborator){
            items.push({
                label: `N-1`,
                value: TabNames.N_MINUS_ONE.toString(),
            });
        }else{
            setActiveTab(TabNames.ALL_USERS)
        }

        if(userIsAdmin){
            items.push({
                label: `${translate("_global.label.all")}`,
                value: TabNames.ALL_USERS.toString(),
            })
        }
        
        setTabs(items);
    }

    const getOrgUsersByManager = (p?:number, rows?: number) =>{
        setUsers([]);
        if(props.account && props.account.id){
            let apiUri = null;
            const page = p || p === 0 ? p : activePage;
            const size = rows || itemsPerPage;
            if(activeTab === TabNames.N_MINUS_ONE){
                if(userIsColaborator){
                    apiUri = API_URIS.userExtraApiUri;
                    apiUri = `${apiUri}/getOrgUsersByManager/${props.account.id}/`;
                    apiUri = `${apiUri}?page=${page}&size=${size}`;
                }
            }else{
                if(userIsAdmin){
                    apiUri = API_URIS.userExtraApiUri;
                    apiUri =`${apiUri}/id-not-in/?ids=${[props.account.id]}`
                    apiUri = `${apiUri}&page=${page}&size=${size}`;
                }
            }
            if(apiUri){
                setLoading(true);
                axios.get<IUserExtra[]>(apiUri)
                .then(res => {
                    setUsers(res.data);
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
            }
        }
    }

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        initTabLinks();
    }, [props.account])

    useEffect(() =>{
        getOrgUsersByManager();
    }, [activeTab])

    const handleOpen = () => setOpen(true);

    const handleLinkClick = (value) =>{
        if((value && value === TabNames.ALL_USERS.toString()))
            setActiveTab(TabNames.ALL_USERS)
        else
          setActiveTab(TabNames.N_MINUS_ONE)
    }

    const handleUserClick = (ue: IUserExtra) =>{
        if(ue){
            props.changeTodoUserId(ue.id);
            setOpen(false);
        }
    }

    const handleClickToDisplayLoggedUserTodo = () =>{
        props.changeTodoUserId(props.account.id)
        setOpen(false);
    }

    const handleChangeItemsPerpage = (event) =>{
          const value = parseInt(event.target.value, 10);
          setItemsPerPage(value);
          setActivePage(0);
          getOrgUsersByManager(0,value);
    }
  
    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getOrgUsersByManager(newPage);
    }

    const searchFilter = (u: IUserExtra) =>{
        if(u){
            const fullName = getUserExtraFullName(u);
            const term = searchValue || "";
            return !fullName || fullName.toLowerCase().includes(term.toLowerCase());
        }
        return false;
    }

    const usersListItems = [...users].filter(u => searchFilter(u)).map((u, index) =>(
        <ListItem key={index} button
            className={classes.userListItem}
            onClick={() => handleUserClick(u)}>
            <ListItemAvatar>
                <CustomAvatar photoId={u.photoId} />
            </ListItemAvatar>
            <ListItemText primary={getUserExtraFullName(u)} />
            <ListItemSecondaryAction>
                {u.id === props.todoUserId && <FontAwesomeIcon  icon={faCheck} className="text-info" /> }
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={() => setOpen(false)}
                avatarIcon={<FontAwesomeIcon icon={faUsers} size="1x" />}
                rootCardClassName={classes.card}
                title={translate("userManagement.home.title")}
                subheader={
                    <Box width={1} display='flex' justifyContent='center'>
                        <CardSubHeaderInlineSearchBar
                            rootBoxProps={{
                                width: '80%',
                                ml: 7,
                                mt:3,
                                borderColor: theme.palette.primary.main,
                                border:1,
                                borderRadius: 15,
                            }}
                            onChange={(e) => {
                                setSeachValue(e.target.value)
                            }} 
                        />
                    </Box>}
                footer={
                    <TablePagination 
                        component="div"
                        count={totalItems}
                        page={activePage || 0}
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
            >
             <HorizontalTabLinkWrapper 
                linkBtns={tabs}
                loading={false}
                getUserNotifications={() =>{}}
                notifs={[]}
                activePath={activeTab ? activeTab.toString() : TabNames.N_MINUS_ONE.toString()}
                onLinkClick={handleLinkClick}
                action={!userIsCurrentLogged ? 
                    <Tooltip 
                        title={translate("_global.label.clickToDisplayYourOwnTodo")} 
                        onClick={handleClickToDisplayLoggedUserTodo}>
                        <Button
                            style={{ textTransform: 'none'}}
                            color="primary"
                            endIcon={<FontAwesomeIcon icon={faUserCircle} />}>
                            {translate("_global.label.me")}
                        </Button>
                    </Tooltip> : <></>
                }
             />
             <List>
                {loading && <ListItem>
                    <ListItemText secondary="loading" />
                </ListItem> }
                {usersListItems}
             </List>
             {(!loading && (!users || [...users].length === 0)) &&
                <Box width={1} textAlign="center" mt={7} mb={7} className="text-info">
                    {translate("microgatewayApp.userExtra.home.notFound")}
                </Box>
             }
            </MyCustomModal>
            {/* displayer button */}
            <CustomButton
                userExtra={[...users].find(u => u.id === props.todoUserId)}
                isLogged={userIsCurrentLogged}
                loading={loading}
                onClick={handleOpen}
                btnLabelClassName={props.btnLabelClassName}
             />
        </React.Fragment>
    )
}


const mapStateToProps = ({ authentication, appUtils} : IRootState) =>({
    account: authentication.account,
    todoUserId: appUtils.todoUserId,
})

const mapDispatchToProps = {
    getSession,
    changeTodoUserId,
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(TodoUserFinderButton)
