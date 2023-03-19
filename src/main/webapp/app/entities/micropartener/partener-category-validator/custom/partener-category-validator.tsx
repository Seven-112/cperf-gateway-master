import { faCubes, faHandPointer, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, Hidden, IconButton, makeStyles, Modal, TablePagination, Tooltip, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { addAuthorityToUser, API_URIS, DEFAULT_USER_AVATAR_URI, formateBase64Src, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { IPartenerCategoryEvaluator } from "app/shared/model/micropartener/partener-category-evaluator.model";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { SimpleInlineSearchBar } from "app/shared/layout/search-forms/inline-seach-bar";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { AUTHORITIES } from "app/config/constants";
import { IPartenerCategoryValidator } from "app/shared/model/micropartener/partener-category-validator.model";
import clsx from "clsx";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    modal:{
        display:'flex',
        justifyContent: 'center',
    },
    card:{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        width: '45%',
        marginTop: theme.spacing(15),
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '95%',
        },
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.success.dark,
        paddingTop:2,
        paddingBottom:2,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
        background: theme.palette.background.paper,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(5),
        overflow: 'auto',
    },
    cardActions:{
        background: theme.palette.background.paper,
        overflow: 'auto',
        borderRadius: '0 0 15px 15px',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    pagination:{
     padding:0,
     color: theme.palette.success.dark,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.success.dark,
       display: 'none',
   },

   selectedBtn:{
       color: theme.palette.secondary.main,
   },
   unselectedBtn:{
       color: theme.palette.success.main,
   }

}));


const EmployeeItem = (props: {userExtra:IUserExtra,selected?:boolean, readonly?:boolean, onToggleSelect?: Function}) =>{
    const {userExtra, readonly, selected} = props;

    const classes = useStyles();

    const toggleSelect = () =>{
        if(props.onToggleSelect)
            props.onToggleSelect(userExtra, !selected);
    }

    return (
        <React.Fragment>
            {userExtra &&
                <Box display="flex" flexWrap="wrap" overflow="auto" alignItems="center"
                    border={1} borderRadius={3} m={1} boxShadow={3} pl={2} pr={2}>
                        <CustomAvatar 
                            alt=''
                            photoId={userExtra.employee ? userExtra.employee.photoId : null}
                            avatarProps={{ className: 'mr-2'}} 
                        />
                    <Typography className="mr-2">
                        {getUserExtraFullName(userExtra)}
                    </Typography>
                    {!readonly  && <Tooltip title={translate(`_global.label.${props.selected ? 'unselect': 'select'}`)}
                        onClick={toggleSelect}>
                        <IconButton className={clsx({
                            [classes.selectedBtn]: selected,
                            [classes.unselectedBtn]: !selected
                        })}>
                            <FontAwesomeIcon icon={selected ? faMinusCircle : faHandPointer} />
                        </IconButton>
                    </Tooltip>}
                </Box>
            }
        </React.Fragment>
    )
}

interface PartenerCategoryEvaluatorProps{
    category: IPartenerCategory
    open?: boolean,
    readonly?:boolean,
    onSave?: Function,
    onClose: Function,
}

export const PartenerCategoryValidator = (props: PartenerCategoryEvaluatorProps) =>{
    const { open, readonly,category } = props;
    const [validators, setValidators] = useState<IUserExtra[]>([]);
    const [userExtras, setUserExtras] = useState<IUserExtra[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();

    const getEmployees = () =>{
        const empIds = [...validators].filter(ev => ev.id).map(ev => ev.id);
        empIds.push(0);
        setLoading(true)
        let requestUri = `${API_URIS.userExtraApiUri}/getByUserStatusAndIdNotIn/?status=${true}`;
        requestUri = `${requestUri}&ids=${empIds.join(',')}&page=${activePage}&size=${itemsPerPage}`;
        axios.get<IUserExtra[]>(requestUri)
        .then(res =>{
            setUserExtras([...res.data])
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
        }).catch((e) =>{
            console.log(e);
        }).finally(() => setLoading(false))
    } 

    const getSelectedUserExtra = (userIds: number[]) =>{
        if(userIds && userIds.length !== 0){
            setLoading(true)
            const requestUri = `${API_URIS.userExtraApiUri}/?userId.in=${userIds.join(',')}`;
            axios.get<IUserExtra[]>(requestUri)
            .then(res =>{
                setValidators([...res.data])
            }).catch((e) =>{
                console.log(e);
            }).finally(() => setLoading(false))
        }else{
            setValidators([]);
        }
    }

    const getValidators = () =>{
        if(category && category.id){
            setLoading(true);
            const requestUri = `${API_URIS.partenerCategoryValidatorApiUri}/?categoryId.equals=${category.id}`;
            axios.get<IPartenerCategoryValidator[]>(requestUri)
                .then(res =>{
                    const userIds = res.data.map(pcv => pcv.userId)
                    getSelectedUserExtra(userIds);
                }).catch((e) =>{
                    console.log(e);
                }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getEmployees();
    }, [activePage])

    useEffect(() =>{
        getEmployees();
    }, [validators])

    useEffect(() =>{
        getValidators();
    }, [props.category])

    const handleClose = () => {
        setActivePage(0);
        props.onClose()
    };

    const select = (ue: IUserExtra) =>{
        if(ue && ue.user && ue.user.id){
            setLoading(true);
            const entity: IPartenerCategoryEvaluator = {
                category,
                userId: ue.user.id,
            }
            axios.post<IPartenerCategoryEvaluator>(`${API_URIS.partenerCategoryValidatorApiUri}`, cleanEntity(entity))
                .then(result =>{
                    if(result.data){
                        setValidators([ue, ...validators]);
                        addAuthorityToUser(ue.user.login, AUTHORITIES.EVALUATOR);
                    }
                }).catch(err => console.log(err))
                .finally(() => setLoading(false))
            }
    }

    const unSelect = (ue: IUserExtra) =>{
        if(ue && ue.user && ue.user.id && category){
            setLoading(true)
            setValidators(validators.filter(v => v.user.id !== ue.user.id));
            const requestUri = `${API_URIS.partenerCategoryValidatorApiUri}/del-by-user-and-category/${ue.user.id}/${category.id}`
            axios.delete<IPartenerCategoryEvaluator>(requestUri)
                .then((res) =>{
                    console.log(res.data)
                }).catch(err => console.log(err))
                .finally(() => setLoading(false))
            }
    }

    const toggleSelect = (ue: IUserExtra, selecting?:boolean) =>{
        if(ue){
            if(selecting)
                select(ue)
            else
                unSelect(ue);
        }
    }

    const handleChangePage = (event, newPage) =>{
      setActivePage(newPage);
    }

    const searchFilter = (ue: IUserExtra) =>{
        if(ue){
            if(searchValue && searchValue.length !== 0){
                const { user, employee} = ue;
                let handle = `${employee && employee.firstName ? employee.firstName : ''}`;
                handle = `${handle}${employee && employee.lastName ? employee.lastName : ''}`;
                handle = `${handle}${user && user.lastName ? user.lastName : ''}`;
                handle = `${user && user.firstName ? user.firstName : ''}`;
                return handle.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
            }
            return true;
        }
        return false;
    }

    return(
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500}}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        avatar={<FontAwesomeIcon icon={faCubes} />}
                        title={`${translate("microgatewayApp.micropartenerPartenerCategoryValidator.home.title")} ${translate("_global.label.of")} ${category.name || '...'}`}
                        titleTypographyProps={{ variant: 'h4' }}
                        action={<IconButton onClick={handleClose} color="inherit"><Close /></IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Grid container spacing={2}>
                            <Hidden xsDown><Grid item sm={3} /></Hidden>
                            <Grid item xs={12} sm={6}>
                                <SimpleInlineSearchBar value={searchValue}
                                    paperClassName="border"
                                    onChange={(e) => setSearchValue(e.target.value)} />
                            </Grid>
                            {loading && <Grid item xs={12}>
                                <Box width={1} display="flex" flexWrap="wrap" justifyContent="center" alignItems="center">
                                        <CircularProgress />
                                        <Typography className="ml-3">Loading...</Typography>
                                </Box>
                            </Grid>}
                            <Hidden xsDown><Grid item sm={3} /></Hidden>
                            {/* evaluators sectio */}
                            <Grid item xs={12} sm={12}>
                                <Box width={1} display="flex" justifyContent="center" flexWrap="wrap" overflow="auto">
                                    {(validators && validators.length !== 0) ? (
                                        [...validators].filter(ue => searchFilter(ue))
                                        .map(ue =><EmployeeItem key={ue.id} userExtra={ue}
                                                selected={ue && [...validators].some(v => v.id === ue.id)}
                                            onToggleSelect={toggleSelect}/>)
                                    ):(
                                        ''
                                    )}
                                </Box>
                            </Grid>
                            {/* employee section */}
                            <Grid item xs={12} sm={12}>
                                <Box width={1} display="flex" justifyContent="center" flexWrap="wrap" overflow="auto">
                                    {(userExtras && userExtras.length !== 0) ? (
                                        [...userExtras].filter(ue => searchFilter(ue))
                                        .filter(ue => ![...validators].some(v => v.id === ue.id))
                                        .map(ue =><EmployeeItem key={ue.id} userExtra={ue}
                                                    selected={ue && [...validators].some(v => v.id === ue.id)}
                                                onToggleSelect={toggleSelect}/>)
                                        ):(
                                            ''
                                        )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                        <CardActions className={classes.cardActions}>
                            {(totalItems > 0) &&
                              <TablePagination
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={() =>{}}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage=""
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                                }}/>}
                        </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default PartenerCategoryValidator;
