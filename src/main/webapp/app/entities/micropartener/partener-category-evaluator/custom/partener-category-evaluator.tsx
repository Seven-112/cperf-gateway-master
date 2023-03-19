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
import { IUser } from "app/shared/model/user.model";
import { IPartenerCategoryValidator } from "app/shared/model/micropartener/partener-category-validator.model";
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
        color: theme.palette.primary.main,
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
     color: theme.palette.primary.dark,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
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
                        photoId={userExtra.employee ? userExtra.employee.photoId : null}
                        avatarProps={{ className: "mr-2"}}
                    />
                    <Typography className="mr-2">
                        {getUserExtraFullName(userExtra)}
                    </Typography>
                    {!readonly  && <Tooltip title={translate(`_global.label.${props.selected ? 'unselect': 'select'}`)}
                        onClick={toggleSelect}>
                        <IconButton color={selected ? 'secondary' : 'primary'}>
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

export const PartenerCategoryEvaluator = (props: PartenerCategoryEvaluatorProps) =>{
    const { open, readonly,category } = props;
    const [evaluatiors, setEvaluators] = useState<IUserExtra[]>([]);
    const [userExtras, setUserExtras] = useState<IUserExtra[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const classes = useStyles();

    const getEmployees = () =>{
        const userIds = [...evaluatiors].filter(ev => ev.id).map(ev => ev.id);
        userIds.push(0);
        setLoading(true)
        let requestUri = `${API_URIS.userExtraApiUri}/getByUserStatusAndIdNotIn/?status=${true}`;
        requestUri = `${requestUri}&ids=${userIds.join(',')}&page=${activePage}&size=${itemsPerPage}`;
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
                setEvaluators([...res.data])
            }).catch((e) =>{
                console.log(e);
            }).finally(() => setLoading(false))
        }else{
            setEvaluators([]);
        }
    }

    const getEvaluators = () =>{
        if(category && category.id){
            setLoading(true);
            const requestUri = `${API_URIS.partenerCategoryEvaluatorApiUri}/?categoryId.equals=${category.id}`;
            axios.get<IPartenerCategoryEvaluator[]>(requestUri)
                .then(res =>{
                    const userIds = res.data.map(pce => pce.userId)
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
    }, [evaluatiors])

    useEffect(() =>{
        getEvaluators();
    }, [props.category])

    const handleClose = () => {
        setActivePage(0);
        props.onClose()
    };

    const saveToValidator = (userId: any, login: string) =>{
        if(userId && login && category){
            let apiUri = `${API_URIS.partenerCategoryValidatorApiUri}`;
            apiUri = `${apiUri}/?userId.equals=${userId}&categoryId.equals=${category.id}`;
            axios.get<IPartenerCategoryValidator[]>(apiUri)
                .then(res =>{
                    if(!res.data || res.data.length <= 0){
                        const vEntity: IPartenerCategoryValidator ={
                            userId,
                            category
                        }
                        axios.post<IPartenerCategoryValidator>(`${API_URIS.partenerCategoryValidatorApiUri}`, cleanEntity(vEntity))
                            .then(result =>{
                                if(result.data && result.data.id)
                                    addAuthorityToUser(login, AUTHORITIES.PROVIDER_VALIDATOR);
                            }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
        }
    }

    const select = (ue: IUserExtra) =>{
        if(ue && ue.user && ue.user.id){
            setLoading(true);
            const entity: IPartenerCategoryEvaluator = {
                category,
                userId: ue.user.id,
            }
            axios.post<IPartenerCategoryEvaluator>(`${API_URIS.partenerCategoryEvaluatorApiUri}`, cleanEntity(entity))
                .then(result =>{
                    if(result.data){
                        setEvaluators([ue, ...evaluatiors]);
                        addAuthorityToUser(ue.user.login, AUTHORITIES.EVALUATOR);
                        saveToValidator(ue.user.id,ue.user.login)
                    }
                }).catch(err => console.log(err))
                .finally(() => setLoading(false))
            }
    }

    const unSelect = (ue: IUserExtra) =>{
        if(ue && ue.user && ue.user.id && category){
            setLoading(true)
            setEvaluators(evaluatiors.filter(ev => ev.user.id !== ue.user.id));
            const requestUri = `${API_URIS.partenerCategoryEvaluatorApiUri}/del-by-user-and-category/${ue.user.id}/${category.id}`
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
                        title={`${translate("microgatewayApp.micropartenerPartenerCategoryEvaluator.home.title")} ${translate("_global.label.of")} ${category.name || '...'}`}
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
                                    {(evaluatiors && evaluatiors.length !== 0) ? (
                                        [...evaluatiors].filter(ue => searchFilter(ue))
                                        .map(ue =><EmployeeItem key={ue.id} userExtra={ue}
                                                selected={ue && [...evaluatiors].some(ev => ev.id === ue.id)}
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
                                        .filter(ue => ![...evaluatiors].some(ev => ev.id === ue.id))
                                        .map(ue =><EmployeeItem key={ue.id} userExtra={ue}
                                                    selected={ue && [...evaluatiors].some(ev => ev.id === ue.id)}
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

export default PartenerCategoryEvaluator;
