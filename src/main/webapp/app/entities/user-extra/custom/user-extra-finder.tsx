import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, InputAdornment, InputBase, Modal, TablePagination, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { IUserExtra } from "app/shared/model/user-extra.model";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { Close, Search } from "@material-ui/icons";
import { translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
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
      minHeight: '35vh',
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
       width: 0,
       borderColor:theme.palette.primary.dark,
   },
   selectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
}))

interface UserExtraFinderProps{
    onFinded?: Function,
    open?: boolean,
    onClose: Function,
}

export const UserExtraFinder = (props: UserExtraFinderProps) =>{
    const { open } = props;
    const classes = useStyles();

    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IUserExtra[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);

    const getUsers = (p?: number) =>{
        console.log(p);
        const page = (p || p === 0 ) ? p : activePage;
        setLoading(true);
        let requestUri = `${API_URIS.userExtraApiUri}`;
        if(searchValue && searchValue.length !==0)
            requestUri = `${requestUri}/search/?term=${searchValue}&page=${page}&size=${itemsPerPage}`;
        else
            requestUri = `${requestUri}/?page=${page}&size=${itemsPerPage}`;
        console.log(requestUri);

        axios.get<IUserExtra[]>(requestUri)
            .then(res =>{
                if(res.data){
                    setUsers([...res.data]);
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                }
            }).catch(e =>{
                console.log(e);
            }).finally(() =>{
                setLoading(false);
            })
    }

    useEffect(() =>{
        getUsers();
    }, [])

    const handleSubmit = (e) =>{
        e.preventDefault();
        getUsers();
    }

    const handleSelect = (user?: IUserExtra) =>{
        if(user)
            setSearchValue(getUserExtraFullName(user));
        if(props.onFinded)
            props.onFinded(user);
    }

    const handlePagination =( event, newPage) => {
        setActivePage(newPage);
        getUsers(newPage);
    }
  
    const handleChangeItemPerPage = (e) =>{
        setItemsPerPage(parseInt(e.target.value, 10));
    }

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
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
                        title={
                            <Box width={1}> 
                                <form onSubmit={handleSubmit}>
                                    <InputBase fullWidth
                                            className={classes.input}
                                            placeholder={translate('_global.label.searchAndChooseEmp')}
                                            inputProps={{ 'aria-label': 'search...' }}
                                            value={searchValue}
                                            onChange= {e => setSearchValue(e.target.value)}
                                            endAdornment={<InputAdornment position="end">
                                                <IconButton color="inherit" onClick={handleSubmit}><Search /></IconButton>
                                            </InputAdornment>}
                                        />
                                </form>
                            </Box>
                        }
                        action={<IconButton color="inherit" onClick={handleClose}><Close /></IconButton>}
                        className={classes.cardheader}
                     />
                     <CardContent className={classes.cardcontent}>
                         {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                    <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                    <Typography className="ml-2">Searching...</Typography>
                            </Box>}
                        <Box width={1} display="flex" justifyContent="center" flexWrap="wrap" overflow="auto">
                            {[...users].map(user => (
                                <Box key={user.id} display="flex"
                                    alignItems="center" flexDirection="column"
                                    p={1} boxShadow={10} margin={2}
                                    borderRadius={15}
                                    className={classes.fileIllustattionBox}
                                    onClick={() => handleSelect(user)}>
                                   <CustomAvatar 
                                        alt='' 
                                        photoId={user.employee ? user.employee.photoId : null}
                                        avatarProps={{
                                            className: classes.fileIllustattionAvatar
                                        }}
                                    />
                                    <Typography>{getUserExtraFullName(user)}</Typography>
                                </Box>
                            ))}
                        </Box>
                         {(!loading && [...users].length === 0) && 
                         <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                <Typography>{translate("microgatewayApp.userExtra.home.notFound")}</Typography>
                            </Box>}
                     </CardContent>
                    <CardActions className={classes.cardActions}>
                        {totalItems > 0 &&
                            <TablePagination className={(users && users.length !== 0)? '' : 'd-none'}
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handlePagination}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={handleChangeItemPerPage}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage=""
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    select: 'd-none',
                                    selectIcon: classes.selectIcon,
                                }}
                            />
                        }
                    </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default UserExtraFinder;