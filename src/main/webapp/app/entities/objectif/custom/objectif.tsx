import { ObjectifCategorie } from "app/shared/model/enumerations/objectif-categorie.model";
import { IObjectif } from "app/shared/model/objectif.model"
import { API_URIS, expiredObjectif, getTotalPages } from "app/shared/util/helpers";
import { useEffect, useState } from "react"
import axios from 'axios';
import { Helmet } from 'react-helmet';
import React from "react";
import { Box, Card, CardActions, CardContent, CardHeader, Collapse, colors, IconButton, InputBase, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { translate, Translate } from "react-jhipster";
import { Add, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, Visibility } from "@material-ui/icons";
import { IIndicator } from "app/shared/model/indicator.model";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import ObjectifUpdate from "./objectif-update";
import ObjectifDeleteDialog from "./objectif-delete-dialog";
import IndicatorUpdateModal from "app/entities/indicator/custom/indicator-update-modal";
import IndicatorModal from "app/entities/indicator/custom/indicator-modal";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";

const useStyles = makeStyles(theme =>({
    card:{
        border: '1px solid '+ theme.palette.primary.main,
        boxShadow: '0 0 7px '+theme.palette.grey[900],
    },
    cardHeader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
        paddingTop:theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    cardContent:{

    },
    cardActions:{
        paddingTop:0,
        paddingBottom:0,
        background: colors.lightBlue[50],
    },
    categorieSelect:{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        color: theme.palette.background.paper,
        '&:before': {
            borderColor: theme.palette.primary.dark,
        },
        '&:after': {
            borderColor: theme.palette.primary.dark,
        }
    },
    categorieSelectIcon:{
        fill: theme.palette.background.paper,
    },
    searchField:{
        flex:1,
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
        boxShadow: '0 0 5px '+colors.lightBlue[600],
        borderRadius: '10px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '& ::placeholder':{
            color: colors.lightBlue[50],
        },
        color: colors.lightBlue[100],
    },
    underline:{
        borderColor: theme.palette.background.paper,
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
}))

const ItemRow = (props: {objectif: IObjectif, handleUpdate: Function, handleDelete: Function}) =>{

    const {objectif} = props;

    const [indicatorsCount, setIndicatorsCount] = useState(0);

    const [indicator, setIndicator] = useState<IIndicator>(null);
    
    const [loading, setLoading] = useState(false);

    const [showIndicators, setShowIndicators] = useState(null);

    const [open, setOpen] = useState(false);

    const countIndicators = () =>{
        setLoading(true);
        axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?page=${0}&size=${1}&objectifId.equals=${objectif.id}`)
        .then(res =>{
            setIndicatorsCount(parseInt(res.headers['x-total-count'], 10));
        }).catch((e) =>{
            /* eslint-disable no-console */
            console.log(e)
        }).finally(() => setLoading(false))
    }

    useEffect(() =>{
        countIndicators();
    }, [props.objectif])

    const handleDelete = () =>{
        props.handleDelete(objectif);
    }

    const onSavedIndicator = (savedIndicator?: IIndicator, isNew?: boolean) =>{
        if(savedIndicator && isNew){
            setIndicatorsCount(indicatorsCount + 1);
        }
    }

    return (
        <React.Fragment>
            {indicator && <IndicatorUpdateModal open={true} indicator={indicator}
                     onClose={() => setIndicator(null)} onSaved={onSavedIndicator}  />}
            <IndicatorModal objectif={objectif} open={showIndicators} onClose={() => setShowIndicators(false)}
                 onDelete={() => setIndicatorsCount(indicatorsCount -1)} onAdd={() => setIndicatorsCount(indicatorsCount +1)} />
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{objectif.name}</TableCell>
                <TableCell align="center">{objectif.typeObjectif ? objectif.typeObjectif.name : '...'}</TableCell>
                <TableCell align="center">
                    {objectif.delay ? objectif.delay : 0 }&nbsp;
                    {objectif.typeObjectif && objectif.typeObjectif.evalutationUnity && 
                    <Translate contentKey={"microgatewayApp.ObjectifTypeEvaluationUnity."+objectif.typeObjectif.evalutationUnity.toString()}>Unity</Translate> }
                </TableCell>
                {/* <TableCell align="center">{objectif.categorie}</TableCell> */}
                {objectif.categorie === ObjectifCategorie.FONCTIONAL && 
                <TableCell align="center">
                    {objectif.fonction ? objectif.fonction.name : ''}
                </TableCell> }
                {objectif.categorie === ObjectifCategorie.INDIVIDUAL && 
                <TableCell align="center">
                    {objectif.employee ? objectif.employee.firstName + ' '+objectif.employee.lastName : ''}
                </TableCell> }
                {objectif.categorie === ObjectifCategorie.COLLECTIVE && 
                <TableCell align="center">
                    {objectif.department ? objectif.department.name : ''}
                </TableCell> }
                <TableCell align="center">
                 {!loading && <React.Fragment>
                        {indicatorsCount > 0 && <IconButton size="small" className="ml-2" title="view indicators"
                            onClick={() => setShowIndicators(true)}>
                                <Visibility />
                            </IconButton>}
                        {indicatorsCount}
                        {!expiredObjectif(objectif) && hasPrivileges({ entities: ['Objectif'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }) &&
                            <IconButton color="secondary" className="ml-2" title="add indicator"
                                 onClick={() => setIndicator({...indicator,label: 'R'+(indicatorsCount+1), objectif})}>
                                <Add />
                            </IconButton>
                        } 
                  </React.Fragment>}
                  {loading && 'loading'}
                </TableCell>
                <TableCell align="center">
                    {hasPrivileges({ entities: ['Objectif'], actions: [PrivilegeAction.UPDATE] }) &&
                    <IconButton title="Edit" color="primary" className="mr-2" onClick={() => props.handleUpdate(objectif)}>
                        <Edit />
                    </IconButton>}
                    {hasPrivileges({ entities: ['Objectif'], actions: [PrivilegeAction.DELETE] }) &&
                    <IconButton title="Delete" color="secondary" className="mr-2" onClick={handleDelete}>
                        <Delete />
                    </IconButton>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={20} style={{ padding:0, }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box width={1} display="flex" justifyContent="space-around"
                         boxShadow={1} p={1} m={1}>
                            <Typography display="inline" variant="body2">
                                <Translate contentKey="microgatewayApp.objectif.parent">Parent</Translate>&nbsp;:&nbsp;
                                {objectif.parent ? objectif.parent.name : ''}
                            </Typography>
                            <Typography  display="inline" variant="body2">
                                <Translate contentKey="microgatewayApp.objectif.averagePercentage">averagePercentage</Translate>&nbsp;:&nbsp;
                                {objectif.averagePercentage ? objectif.averagePercentage +'%' : '100%'}
                            </Typography>
                            <Typography display="inline" variant="body2">
                                <Translate contentKey="microgatewayApp.objectif.ponderation">ponderation</Translate>&nbsp;:&nbsp;
                                {objectif.ponderation ? objectif.ponderation : 1}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
   
}

export const Objectif = (props) =>{
    
    const [objectifs, setObjectifs] = useState<IObjectif[]>([]);
    
    const [categorie, setCategorie] = useState<ObjectifCategorie>(ObjectifCategorie.INDIVIDUAL);
    
    const [activePage, setActivePage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [totalItems, setTotalItems] = useState(0);

    const [loading, setLoading] = useState(false);

    const [seacrhValue, setSearchValue] = useState(null);

    const [objectifToUpdate, setObjectifToUpdate] = useState({});

    const [open, setOpen] = useState(false);

    const [objectifToDelete, setObjectifToDelete] = useState<IObjectif>(null);

    const classes = useStyles();

    const getObjectifs = () =>{
        const requestUri = `${API_URIS.objectifApiUri}?page=${activePage}&size=${itemsPerPage}&categorie.equals=${categorie}`;
        setLoading(true);
        axios.get<IObjectif[]>(requestUri).then(res =>{
            if(res.data){
                setObjectifs([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }
        }).catch(e =>{
            /* eslint-disable no-console */
            console.log(e)
        }).finally(() => setLoading(false))
    }

    useEffect(() =>{
        getObjectifs();
    }, [activePage, itemsPerPage, categorie])

    const handleChangePage = (e, newPage) => setActivePage(newPage);

    const handleChangeItemsPerPage = (e) => setItemsPerPage(parseInt(e.target.value, 10));

    const handleChangeCategorie = (e) => {
        setCategorie(e.target.value);
        setActivePage(0);
    };

    const myFilter = (obj: IObjectif) =>{
        if(seacrhValue && categorie){
            if(categorie === ObjectifCategorie.FONCTIONAL){
                if(obj.fonction && obj.fonction.name && obj.fonction.name.toLocaleLowerCase().includes(seacrhValue.toLocaleLowerCase()))
                    return true;
                else  
                    return false;
            }
            if(categorie === ObjectifCategorie.COLLECTIVE){
                if(obj.department && obj.department.name && obj.department.name.toLocaleLowerCase().includes(seacrhValue.toLocaleLowerCase()))
                    return true;
                else  
                    return false;
            }

            if(categorie === ObjectifCategorie.INDIVIDUAL){
                if((obj.employee && obj.employee.firstName && obj.employee.firstName.toLocaleLowerCase().includes(seacrhValue.toLocaleLowerCase()))
                    || (obj.employee && obj.employee.lastName && obj.employee.lastName.toLocaleLowerCase().includes(seacrhValue.toLocaleLowerCase())))
                    return true;
                else  
                    return false;
            }
        }
        return true;
    }

    const handleUpdate = (obj: IObjectif) =>{
        if(obj){
            setObjectifToUpdate(obj)
            setOpen(true);
        }
    }
    const handleDelete = (obj: IObjectif) =>{
        if(obj){
            setObjectifToDelete(obj);
        }
    }
    
    const items = objectifs.filter(o =>myFilter(o)).map(o =>(
        <ItemRow key={o.id} objectif={o} handleUpdate={handleUpdate} handleDelete={handleDelete}/>
    ))

    const handleAdd = () =>{
        setObjectifToUpdate({...objectifToUpdate, categorie});
        setOpen(true)
    }

    const onClose = () =>{
        setOpen(false);
        setObjectifToUpdate({});
    }

    const onSaved = (objSaved: IObjectif, isNew: boolean) =>{
        if(objSaved){
            if(isNew){
                const els = [...objectifs];
                els.unshift(objSaved);
                setObjectifs([...els]);
            }else{
                const els = objectifs.map(o => o.id === objSaved.id ? objSaved : o);
                setSearchValue(null);
                setObjectifs([...els]);
            }
        }
    }

    const onCloseDeleteDialog = (deleted: boolean) =>{
        if(deleted && objectifToDelete){
            const els = objectifs.filter(obj => obj.id !== objectifToDelete.id);
            setObjectifs([...els]);
        }
        setObjectifToDelete(null);
    }
    
    return(
        <React.Fragment>
            <Helmet><title>Cperf | Objectifs</title></Helmet>
            {objectifToUpdate && <ObjectifUpdate objectif={objectifToUpdate} open={open} onClose={onClose} onSaved={onSaved} /> }
            {objectifToDelete && <ObjectifDeleteDialog objectif={objectifToDelete} onClose={onCloseDeleteDialog} /> }
            <Card className={classes.card}>
                <CardHeader classes={{ root: classes.cardHeader}}
                title={
                    <Box display="flex" justifyContent="space-between" alignItems="center" className="pr-2">
                        <FontAwesomeIcon icon={faBullseye} className="mr-3"/>
                        <Typography display="inline" variant="h4">
                            <Translate contentKey="microgatewayApp.objectif.home.title">Objectifs</Translate>
                        </Typography>
                        <CardSubHeaderInlineSearchBar onChange={(e) =>setSearchValue(e.target.value)}/>
                        {/* <div className="d-inline-block">
                            <span>{<Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate>}&nbsp;:&nbsp;</span>
                            <Select value={categorie} className={classes.categorieSelect}
                                onChange={handleChangeCategorie}
                                inputProps={{
                                    classes:{
                                        icon:classes.categorieSelectIcon
                                    }
                                }}>
                                <MenuItem value={ObjectifCategorie.FONCTIONAL}>
                                    <Translate contentKey="microgatewayApp.ObjectifCategorie.FONCTIONAL">FONCTIONAL</Translate>
                                </MenuItem>
                                <MenuItem value={ObjectifCategorie.COLLECTIVE}>
                                    <Translate contentKey="microgatewayApp.ObjectifCategorie.COLLECTIVE">Collective</Translate>
                                </MenuItem>
                                <MenuItem value={ObjectifCategorie.INDIVIDUAL}>
                                    <Translate contentKey="microgatewayApp.ObjectifCategorie.INDIVIDUAL">INDIVIDUAL</Translate>
                                </MenuItem>
                            </Select>
                        </div> */}
                    </Box>
                } 
                action={
                    <React.Fragment>
                        {hasPrivileges({ entities: ['Objectif'], actions: [PrivilegeAction.CREATE] }) &&
                            <IconButton title="add" color="inherit" onClick={handleAdd}>
                                <Add />
                            </IconButton>}
                    </React.Fragment>
                }
                />
                <CardContent className={classes.cardContent}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.theadRow}>
                                <TableCell align='center'></TableCell>
                                <TableCell align="left">
                                    <Translate contentKey="microgatewayApp.objectif.name">Name</Translate>
                                </TableCell>
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.typeObjectif.detail.title">Type</Translate>
                                </TableCell>
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.objectif.delay">Deley</Translate>
                                </TableCell>
                                {/* <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate>
                                </TableCell> */}
                                {categorie && categorie === ObjectifCategorie.FONCTIONAL &&
                                    <TableCell align="center">
                                        <Translate contentKey="microgatewayApp.fonction.detail.title">fonction</Translate>
                                    </TableCell>
                                }
                                {categorie && categorie === ObjectifCategorie.COLLECTIVE &&
                                    <TableCell align="center">
                                        <Translate contentKey="microgatewayApp.department.detail.title">Departement</Translate>
                                    </TableCell>
                                }
                                {categorie && categorie === ObjectifCategorie.INDIVIDUAL &&
                                    <TableCell align="center">
                                        <Translate contentKey="microgatewayApp.employee.detail.title">Employee</Translate>
                                    </TableCell>
                                }
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.indicator.home.title">Indicators</Translate>
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && <TableRow><TableCell align="center" colSpan={10}>loading..</TableCell></TableRow>}
                            {!loading && objectifs && objectifs.length >0 && items}
                            {!loading && (!objectifs || !objectifs.length) && <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Typography className="text-info" variant="h5">
                                        <Translate contentKey="microgatewayApp.objectif.home.notFound">No Objectifs found</Translate>
                                    </Typography>
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
               {totalItems > 0 &&
                <CardActions color="primary" className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={totalItems}
                    page={activePage}
                    onPageChange={handleChangePage}
                    rowsPerPage={itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemsPerPage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
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
}

export default Objectif;