import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Modal, Slide, TablePagination, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, deleteUserExtraPhoto, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { Close } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { IUserExtra } from "app/shared/model/user-extra.model";
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

interface UserExtraFinder2Props{
    open?: boolean,
    unSelectableIds: any[],
    multiple?:boolean,
    departmentId?: any,
    onSelectChange: Function,
    onClose: Function,
}

const UserListItem = (props: {userExtra?: IUserExtra, disable?: boolean, selected: boolean, onToggleSelect?: Function}) =>{
    const { userExtra, disable, selected }= props;

    const toogleSelect = () =>{
        if(props.onToggleSelect && !disable)
            props.onToggleSelect(userExtra);
    }

    return (
        <React.Fragment>
            {userExtra && 
            <ListItem button onClick={toogleSelect} disabled={userExtra.user && !userExtra.user.activated}>
                <ListItemAvatar>
                    <CustomAvatar
                        photoId={userExtra.employee ? userExtra.employee.photoId : null}
                     />
                </ListItemAvatar>
                <ListItemText
                    primary={getUserExtraFullName(userExtra)}
                />
                <ListItemSecondaryAction onClick={toogleSelect}>
                    <Checkbox color="primary"
                        checked={selected} 
                        disabled={(userExtra.user && !userExtra.user.activated) || disable}/>
                </ListItemSecondaryAction>
            </ListItem>}
        </React.Fragment>
    )
}

export const UserExtraFinder2 = (props: UserExtraFinder2Props) =>{
    const { open, multiple } = props;
    
    const [searchValue, setSearchValue] = useState('')

    const [users, setusers] = useState<IUserExtra[]>([]);

    const [unSelectableIds, setUnselectableIds] = useState([...props.unSelectableIds]);

    const [selected, setSelected] = useState<IUserExtra[]>([]);

    const [loading, setLoading] = useState(false);

    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();

    const getAllEntities = (p?: number, rows?: number) => {
      setLoading(true);
      const page = p || p === 0 ? p : activePage;
      const size = rows || itemsPerPage;
      let requestUri =`${API_URIS.userExtraApiUri}/getByStatusAndDepartement/?page=${page}&size=${size}`;
      if(props.departmentId)
        requestUri = `${requestUri}&departmentId=${props.departmentId}`
      axios.get<IUserExtra[]>(requestUri)
        .then(res => {
          setTotalItems(parseInt(res.headers['x-total-count'], 10));
          setusers([...res.data])
          setLoading(false);
        }).catch((e) =>{
          setLoading(false);
          /* eslint-disable no-console */
          console.log(e);
        });
    };

  useEffect(() =>{
    getAllEntities();
  }, [props.departmentId])

  useEffect(() =>{
      setUnselectableIds([...props.unSelectableIds])
  }, [props.unSelectableIds])


  const handleClose = () => {
      setSelected([])
      props.onClose();
  };

  const select = (user?: IUserExtra) =>{
       if(user){
           if(multiple)
               setSelected([...selected, user])
            else
                setSelected([user]);
          props.onSelectChange(user, true); // true fo selecting operation
       }
  }

  const unSelect = (user?: IUserExtra) =>{
      if(user){
        setSelected([...selected].filter(item => item.id !== user.id))
        props.onSelectChange(user, false); // false for unselection operation
      }
  }

  const toogleSelect = (user?: IUserExtra) =>{
      if(user){
          if([...selected].some(s => s.id === user.id))
            unSelect(user);
        else
            select(user)
      }
  }

  const getListItems = (items: IUserExtra[]) => (
    [...items].sort((a,b) =>b.id-a.id).filter(user =>(
            user.user && user.user.firstName && user.user.firstName.toLowerCase().includes(searchValue.toLowerCase())
            || user.user && user.user.lastName && user.user.lastName.toLowerCase().includes(searchValue.toLowerCase())
            || user.employee && user.employee.lastName && user.employee.lastName.toLowerCase().includes(searchValue.toLowerCase())
            || user.employee && user.employee.firstName && user.employee.firstName.toLowerCase().includes(searchValue.toLowerCase())
        )
       ).map((user, index) =>(
           <UserListItem
                key={index}
                userExtra={user}
                onToggleSelect={toogleSelect}
                selected={[...selected].some(s => s.id === user.id)}
                disable={[...unSelectableIds].some(id =>  id=== user.id)}
            />
       ))
  )

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
         <Slide
                 in={open}
                 direction="down"
                 timeout={300}
             >
                <Card className={classes.card}>
                    <CardHeader
                            title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                <Typography variant="h4">
                                    <Translate contentKey="userManagement.home.title">users</Translate>
                                </Typography>
                                <CardSubHeaderInlineSearchBar
                                onChange = {handleSearchChange}
                                placeHolder={`${translate("_global.label.search")}...`}
                                />
                                <IconButton color="inherit" onClick={handleClose} className="ml-3"><Close /></IconButton>
                            </Box>}
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                        <Typography className="ml-2">loading...</Typography>
                            </Box>}
                            <List>
                                {
                                    // selected processs
                                    getListItems([...selected])
                                }
                                {
                                    // Unselected users
                                    getListItems([...users].filter(p => ![...selected].some(s => s.id === p.id)))
                                }
                                {(!loading && [...users].length ===0 && [...selected].length ===0) && <ListItem>
                                    <Box width={1} textAlign="center">
                                        <Typography variant="body1">
                                            <Translate contentKey="_global.label.user.notFound">No users found</Translate>
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
            </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default UserExtraFinder2;