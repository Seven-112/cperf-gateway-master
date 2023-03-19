
import React, { useEffect, useState } from "react"
import { Box, Button, colors, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Tooltip } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faUsers } from "@fortawesome/free-solid-svg-icons"
import { IUserExtra } from "app/shared/model/user-extra.model"
import axios from "axios"
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers"
import { translate } from "react-jhipster"
import CustomAvatar from "app/shared/component/custom-avatar"
import MyCustomModal from "app/shared/component/my-custom-modal"
import theme from "app/theme"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants"
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar"
import { IDepartment } from "app/shared/model/department.model"
import { Domain } from "@material-ui/icons"

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

interface DepartementFinderProps{
    btnLabelClassName?: string,
    open?: boolean,
    selected?: IDepartment,
    onFinded?: Function,
    onClose: Function,
}

export const DepartementFinder = (props: DepartementFinderProps) =>{

    const { selected, open } = props;

    const [loading, setLoading] = useState(false);

    const [departments, setDepartements] = useState<IDepartment[]>([]);

    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const [searchValue, setSeachValue] = useState('');

    const classes = useStyles();

    const getDepartments = (p?:number, rows?: number) =>{
        setDepartements([]);
        let apiUri = `${API_URIS.depatartmentApiUri}/`;
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        apiUri = `${apiUri}?page=${page}&size=${size}`;
        if(apiUri){
            setLoading(true);
            axios.get<IDepartment[]>(apiUri)
            .then(res => {
                setDepartements(res.data);
                setTotalItems(parseInt(res.headers['x-total-count'], 10))
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getDepartments();
    }, [])

    const handleDeptClick = (dept: IDepartment) =>{
        if(dept && props.onFinded){
            props.onFinded(dept);
        }
    }
    const handleChangeItemsPerpage = (event) =>{
          const value = parseInt(event.target.value, 10);
          setItemsPerPage(value);
          setActivePage(0);
          getDepartments(0,value);
    }
  
    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getDepartments(newPage);
    }

    const searchFilter = (dept: IDepartment) =>{
        if(dept){
            const term = searchValue || "";
            return !dept.name || dept.name.toLowerCase().includes(term.toLowerCase());
        }
        return false;
    }

    const deptListItems = [...departments]
        .filter(dept => searchFilter(dept))
        .map((dept, index) =>(
        <ListItem key={index} button
            className={classes.userListItem}
            onClick={() => handleDeptClick(dept)}>
            <ListItemText primary={dept.name} />
            <ListItemSecondaryAction>
                {(selected && selected.id === dept.id) && <FontAwesomeIcon  icon={faCheck} className="text-info" /> }
            </ListItemSecondaryAction>
        </ListItem>
    ));

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<Domain />}
                rootCardClassName={classes.card}
                title={translate("microgatewayApp.department.home.title")}
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
             <List>
                {loading && <ListItem>
                    <ListItemText secondary="loading" />
                </ListItem> }
                {deptListItems}
             </List>
             {(!loading && (!departments || [...departments].length === 0)) &&
                <Box width={1} textAlign="center" mt={7} mb={7} className="text-info">
                    {translate("microgatewayApp.department.home.notFound")}
                </Box>
             }
            </MyCustomModal>
        </React.Fragment>
    )
}


interface DepartementFinderButtonProps{
    btnLabelClassName?: string,
    selected?: IDepartment,
    onClick?: Function,
}
export const DepartementFinderButton = (props: DepartementFinderButtonProps) =>{
    
    const { selected } = props;

    const handleClick = () =>{
        if(props.onClick)
            props.onClick();
    }

    return (
        <Tooltip title={translate("microgatewayApp.department.home.title")} onClick={handleClick}>
            <Button color="primary"
                style={{ textTransform: 'none'}}
                endIcon={<Domain />}
                className={props.btnLabelClassName || ''}>
                {selected && selected.name ? selected.name : translate("microgatewayApp.department.home.title")}
            </Button>
        </Tooltip>
    )
}
