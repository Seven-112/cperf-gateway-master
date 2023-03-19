import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Collapse, colors, Grid, IconButton, List, ListItem, ListItemText, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from "@material-ui/core";
import { IObjectif } from "app/shared/model/objectif.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { IIndicator } from "app/shared/model/indicator.model";
import { API_URIS, expiredObjectif, getTotalPages, isIndicatorDataEditable } from "app/shared/util/helpers";
import React from "react";
import { Translate } from "react-jhipster";
import { Close, ConfirmationNumber, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, SettingsInputAntenna } from "@material-ui/icons";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import IndicatorUpdateModal from "./indicator-update-modal";
import IndicatorDeleteDialog from "./indicator-delete-dialog";
import IndicatorDataEditor from "./indicator-data-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        [theme.breakpoints.down('md')]:{
            width: '80%',
        },
        [theme.breakpoints.down('sm')]:{
            width: '98%',
        },
        height: theme.spacing(66),
        marginTop: theme.spacing(3),
        overflow: 'auto',
        background: 'transparent',
    },
    cardheader:{
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
        borderRadius: '15px 15px 0 0',
    },
    subheader:{
        color: colors.grey[50],
        textAlign: 'center',
    },
    cardContent:{
        height: theme.spacing(50),
        overflow: 'auto',
        background: theme.palette.background.paper,
    },
    cardActions:{
        background: colors.red[300],
        color: 'white',
        paddingTop:0,
        paddingBottom:0,
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

const ItemDetail = (props: { indicator: IIndicator }) =>{
    const indicator = props.indicator;
    return (
        <React.Fragment>
            <Box boxShadow={1} width={1}>
                {indicator.typeindicator && 
                <Card>
                    <CardHeader title="Details"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <React.Fragment>
                                {indicator.typeindicator.measurable && <React.Fragment>
                                    <Grid item xs={12} sm={4}>
                                        <List aria-label="Details of indicator">
                                            <ListItem>
                                                <ListItemText 
                                                    primary={<Translate contentKey="microgatewayApp.indicator.expectedResultNumber">expectedResultNumber</Translate>}
                                                    secondary={`${indicator.expectedResultNumber} ${indicator.resultUnity ? indicator.resultUnity : ''}`} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <List aria-label="Details of indicator">
                                            <ListItem>
                                                <ListItemText 
                                                    primary={<Translate contentKey="microgatewayApp.indicator.resultEditableByActor">resultEditableByActor</Translate>}
                                                    secondary={indicator.resultEditableByActor ?
                                                        <Translate contentKey="_global.label.yes">Oui</Translate> :
                                                        <Translate contentKey="_global.label.no">No</Translate>} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <List aria-label="Details of indicator">
                                            <ListItem>
                                                <ListItemText 
                                                    primary={<Translate contentKey="microgatewayApp.indicator.numberResult">numberResult</Translate>}
                                                    secondary={`${indicator.numberResult ? indicator.numberResult : 0 }
                                                        ${indicator.resultUnity ? indicator.resultUnity : ''}`} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </React.Fragment>}
                                {!indicator.typeindicator.measurable &&
                                    <Grid item xs={12}>
                                        <List aria-label="Details of indicator">
                                            <ListItem className="text-center">
                                                <ListItemText 
                                                    primary={<Translate contentKey="microgatewayApp.indicator.percentResult">percentResult</Translate>}
                                                    secondary={`${indicator.percentResult ? indicator.percentResult + '%': ''} ${indicator.resultAppreciation ? indicator.resultAppreciation : ' '}`} />
                                            </ListItem>
                                        </List>
                                    </Grid>}
                                    {/* <Grid item xs={12} sm={12}>
                                        <List aria-label="Details of indicator">
                                            <ListItem>
                                                <ListItemText 
                                                    primary={<Translate contentKey="microgatewayApp.indicator.question">question</Translate>}
                                                    secondary={indicator.question ? indicator.question : '...' } />
                                            </ListItem>
                                        </List>
                                    </Grid> */}
                            </React.Fragment>
                        </Grid>
                    </CardContent>
                </Card>
              }
            </Box>
        </React.Fragment>
    );
}

interface IIndicatorModalProps{
    objectif: IObjectif,
    open: boolean,
    onClose: Function,
    onDelete: Function,
    onAdd: Function,
}

export const IndicatorModal = (props: IIndicatorModalProps) =>{
    const {objectif, open} = props;

    const classes = useStyles();

    const [activePage, setActivePage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [totalItems, setTotalItems] = useState(0);

    const [indicators, setIndicators] = useState<IIndicator[]>([]);
    
    const [loading, setLoading] = useState(false);

    const [collaspseEl, setCollapseEl] = useState('');

    const [indiCatorToUpdate, setIndicatorToUpdate] = useState<IIndicator>(null);
    
    const [indicatorToDelete, setIndicatorToDelete] = useState<IIndicator>(null);

    const [indicatorToEditData, setIndicatorToEditData] = useState<IIndicator>(null);
    

    const getIndicators = () =>{
        if(objectif){
            setLoading(true);
            axios.get<IIndicator[]>(`${API_URIS.indicatorApiUri}/?page=${activePage}&size=${itemsPerPage}&objectifId.equals=${objectif.id}`)
            .then(res =>{
                setIndicators(res.data)
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch((e) =>{
                /* eslint-disable no-console */
                console.log(e)
            }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getIndicators();
    }, [props.objectif, activePage, itemsPerPage]);

    useEffect(() =>{
       if(props.open)
        getIndicators();
    }, [props.open]);
    
    const handleClose = () => props.onClose();

    const handleChangeItemsPerPage = (e) =>{
        setItemsPerPage(parseInt(e.target.value, 10));
         setActivePage(0);
    }

    const onSavedIndicator = (saved: IIndicator, isNew: boolean) =>{
        if(saved){
            if(isNew){
                const els = [...indicators];
                els.unshift(saved);
                setIndicators([...els]);
                props.onAdd();
            }else{
                const els = indicators.map(i => i.id === saved.id ? saved : i);
                setIndicators([...els]);
            }
        }
    }

    const onCloseIndicatorDeleteDialog = (deleted?: IIndicator) =>{
        if(deleted){
            const els = indicators.filter(i => i.id !== deleted.id);
            setIndicators([...els]);
            props.onDelete();
            setIndicatorToDelete(null);
        }
        setIndicatorToDelete(null);
    }

    const onCloseDataEditor = (edited?: IIndicator) =>{
        if(edited){
            const els = indicators.map(i => i.id === edited.id ? edited : i);
            setIndicators([...els]);
        }else{
            setIndicatorToEditData(null);
        }
    }
   
    return (
    <React.Fragment>
    {indiCatorToUpdate && <IndicatorUpdateModal open={true} indicator={indiCatorToUpdate}
             onClose={() => setIndicatorToUpdate(null)} onSaved={onSavedIndicator}  />}
    {indicatorToDelete && <IndicatorDeleteDialog indicator={indicatorToDelete} onClose={onCloseIndicatorDeleteDialog} />}
    {indicatorToEditData && <IndicatorDataEditor indicator={indicatorToEditData} open={true} onClose={onCloseDataEditor} />}
    <Modal
        aria-labelledby="objectif-indicators-modal-title"
        aria-describedby="objectif-indicators-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableBackdropClick
        BackdropProps={{
            timeout: 500,
        }}>
            <Card className={classes.card}>
                <CardHeader classes={{ root: classes.cardheader, subheader: classes.subheader }}
                title={<Translate contentKey="microgatewayApp.indicator.home.title">Indicators</Translate>}
                titleTypographyProps={{ variant: 'h4' }}
                avatar={<Avatar><SettingsInputAntenna color="secondary"/></Avatar>}
                subheader={
                    <React.Fragment>
                        <Translate contentKey="microgatewayApp.objectif.detail.title">Objectif</Translate>&nbsp;:&nbsp;
                        {objectif ? objectif.name : ' '}
                    </React.Fragment>
                }
                action={<IconButton color="inherit" onClick={handleClose}><Close /></IconButton>}
                />
                <CardContent className={classes.cardContent}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ width: '5px;'}}></TableCell>
                                <TableCell align="left">
                                    <Translate contentKey="microgatewayApp.indicator.label">Label</Translate>
                                </TableCell>
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.typeindicator.detail.title">Type</Translate>
                                </TableCell>
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.indicator.ponderation">Ponderation</Translate>
                                </TableCell>
                                <TableCell align="center">
                                    <Translate contentKey="microgatewayApp.indicator.parent">parent</Translate>
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!objectif && 
                                <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        <Translate contentKey="microgatewayApp.objectif.home.notFound">No Objectifs found</Translate>
                                    </TableCell>
                                </TableRow>
                            }
                            {loading &&
                                <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        loading...
                                    </TableCell>
                                </TableRow>
                            }
                            {!loading && indicators.length <=0 &&
                                <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                        <Translate contentKey="microgatewayApp.indicator.home.notFound">No Indicator found</Translate>
                                    </TableCell>
                                </TableRow>
                            }
                            {!loading && indicators.length > 0 && (
                                indicators.map(ind =>(
                                    <React.Fragment key={ind.id}>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: '5px;'}}>
                                                <IconButton size="small" aria-label="expand row"
                                                    onClick={() => { collaspseEl === 'collapseEl'+ind.id ? setCollapseEl('') : setCollapseEl('collapseEl'+ind.id) }}>
                                                    {collaspseEl === 'collapseEl'+ind.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="left">
                                                {ind.label}
                                            </TableCell>
                                            <TableCell align="center">
                                                {ind.typeindicator && <React.Fragment>
                                                    {ind.typeindicator.name}
                                                    {ind.typeindicator.measurable && <React.Fragment>
                                                         &nbsp;(&nbsp;
                                                         <Translate contentKey="microgatewayApp.typeindicator.measurable">Measurable</Translate>&nbsp;)
                                                        </React.Fragment>}
                                                </React.Fragment>}
                                            </TableCell>
                                            <TableCell align="center">
                                                {ind.ponderation}
                                            </TableCell>
                                            <TableCell align="center">
                                                {ind.parent ? ind.parent.label : '...' }
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" className="mr-3" size="small" onClick={() => setIndicatorToUpdate(ind)}>
                                                    <Edit />
                                                </IconButton>
                                                {ind.objectif && !expiredObjectif(ind.objectif) && isIndicatorDataEditable(ind, indicators) &&
                                                <IconButton className="mr-3 text-success" size="small"
                                                    title="Edit data " onClick={() => setIndicatorToEditData(ind)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </IconButton> }
                                                <IconButton color="secondary" className="mr-3" size="small" onClick={() => setIndicatorToDelete(ind)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    {/* collapse row */}
                                        <TableRow>
                                            <TableCell colSpan={10} className="p-2">
                                                <Collapse in={collaspseEl==='collapseEl'+ind.id} timeout="auto" unmountOnExit>
                                                        <ItemDetail indicator={ind} />
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    {/* end collapse row */}
                                </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {totalItems > 0 && <CardActions className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={totalItems}
                    page={activePage}
                    onPageChange={(e, newPage) => setActivePage(newPage)}
                    rowsPerPage={itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemsPerPage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                    classes={{ 
                        root: classes.pagination,
                        input: classes.paginationInput,
                        selectIcon: classes.paginationSelectIcon,
                  }}/>
                </CardActions>}
            </Card>
        </Modal>
    </React.Fragment>
    )
}

export default IndicatorModal;