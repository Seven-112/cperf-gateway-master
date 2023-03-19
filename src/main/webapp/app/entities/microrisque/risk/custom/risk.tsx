import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, colors, Grid,IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS, getTotalPages, showSwalAlert, showSwalConfirm } from "app/shared/util/helpers";
import { Add, BugReport, Delete, Edit, Visibility } from "@material-ui/icons";
import { translate } from "react-jhipster";
import {Helmet} from 'react-helmet';
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import RiskUpdateModal from "./risk-update-modal";
import { IControl } from "app/shared/model/microrisque/control.model";
import Control from "../../control/custom/control";

const useStyles = makeStyles(theme =>({
     card:{
      background: 'transparent',
    },
    cardHeader: {
      paddingTop:2,
      paddingBottom:2,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    cardcontent:{
        background: theme.palette.background.paper,
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

const RiskRowItem = (props:{risk: IRisk, handleShowOrUpdate?:Function, handleDelete?:Function}) =>{
    const {risk} = props;
    const probability = risk.probability || 0;
    const gravity = risk.gravity || 0;

    const [controls, setControls] = useState<IControl[]>([]);

    const [loadingCtrls, setLoadingCtrls] = useState(false);

    const [open, setOpen] = useState(false);

    const handleUpdate = () => props.handleShowOrUpdate ? props.handleShowOrUpdate(risk, true) : null;
    const handleShow = () => props.handleShowOrUpdate ? props.handleShowOrUpdate(risk, false) : null;


    const handleDeleteConfirm = () => props.handleDelete ? props.handleDelete(risk) : {};
    
    const handleDelete = () => {
        showSwalConfirm({
            title:translate('_global.flash.status.warning'),
            text:translate('microgatewayApp.microrisqueRisk.delete.question', {id: ""}),
            icon: "warning",
            onConfirm: handleDeleteConfirm
        });
    }

    const getControls = () =>{
        if(risk){
            setLoadingCtrls(true)
            axios.get<IControl[]>(`${API_URIS.controlApiUri}/?riskId.equals=${risk.id}`)
                .then(res =>{
                    if(res)
                        setControls([...res.data])
                }).catch(e => console.log(e))
                .finally(() => setLoadingCtrls(true))
        }
    }

    useEffect(() =>{
        getControls();
    }, [])

    const handleClose = () => setOpen(false);

    const handleSave = (saved?: IControl, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setControls([saved, ...controls]);
            else
                setControls([...controls.map(c => c.id === saved.id ? saved : c)]);
        }
    }

    const onControlDeleted = (deleted: IControl) =>{
        if(deleted)
            setControls([...controls.filter(c => c.id !== deleted.id)]);
    }

    return(
        <React.Fragment>
            {risk &&
            <>
                <Control risk={risk} open={open} onSave={handleSave} onClose={handleClose} onDeleted={onControlDeleted}/>
                <TableRow>
                    <TableCell>{risk.label}</TableCell>
                    <TableCell align="center">{risk.type ? risk.type.name :''}</TableCell>
                    <TableCell align="center">{probability}</TableCell>
                    <TableCell align="center">{gravity}</TableCell>
                    <TableCell align="center">{gravity * probability}</TableCell>
                    <TableCell align="center">
                        {controls.length > 0 ? controls.length : ''}&nbsp;
                        <IconButton color="primary" onClick={() => setOpen(true)}>
                            <Visibility />
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">{risk.cause}</TableCell>
                    <TableCell align="center">
                        <IconButton color="default" onClick={handleShow}><Visibility /></IconButton>&nbsp;
                        <IconButton color="primary" onClick={handleUpdate}><Edit /></IconButton>&nbsp;
                        <IconButton color="secondary" onClick={handleDelete}><Delete /></IconButton>
                    </TableCell>
                </TableRow>
            </>
            }
        </React.Fragment>
    )
}

export const Risk = (props) =>{
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [risks, setRisks] = useState<IRisk[]>([]);
    const [riskToUpdate, setRiskToUpdate] = useState<IRisk>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enableEdit, setEnableEdit] = useState(true);

    const classes = useStyles();

    const getRisks = () =>{
        setLoading(true);
        axios.get<IRisk[]>(`${API_URIS.riskApiUri}/?page=${activePage}&size=${itemsPerPage}&order:id,desc`)
            .then(res =>{
              setRisks([...res.data]);
              setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() => setLoading(false));
    }

    useEffect(() =>{
        getRisks();
    }, [activePage])
    
    const handleChangePage = (event, newPage) => {
      setActivePage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setActivePage(0);
    };

    const handleSearch = (e) =>{
       setSearchValue(e.target.value);
    }

    const handleClose = () => setOpen(false);

    const handleSaved = (saved?: IRisk, isNew?:boolean) =>{
        if(saved){
            if(isNew)
                setRisks([saved, ...risks]);
            else
                setRisks([...risks.map(r => r.id === saved.id ? saved : r)]);
            setRiskToUpdate(saved);
            setOpen(false);
            showSwalAlert(translate('_global.flash.status.success'), translate('_global.flash.message.success'), "success");
        }
    }

    const handleAdd = () =>{
        setRiskToUpdate(null);
        setOpen(true);
    }

    const handleShowOrUpdate = (risk: IRisk, edit?:boolean) =>{
        if(risk){
            setRiskToUpdate(risk);
            setEnableEdit(edit);
            setOpen(true);
        }
    }
    
    const handleDelete = (element?: IRisk) =>{
        if(element){
            setLoading(true)
            axios.delete(`${API_URIS.riskApiUri}/${element.id}`)
            .then(res =>{
                setRisks([...risks.filter(r => r.id !== element.id)]);
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            }).finally(() =>{setLoading(false)})
        }
    }
    const items = risks.filter(r => r.label  && searchValue ?  r.label.toLowerCase().includes(searchValue.toLowerCase()) : true)
                        .map(risk =>(
                            <RiskRowItem key={risk.id} risk={risk} handleShowOrUpdate={handleShowOrUpdate} handleDelete={handleDelete} />
                        ));
    
    return (
        <React.Fragment>
            <Helmet>
                <title>{`Cperf | ${translate('global.menu.entities.microrisqueRisk')}`}</title>
            </Helmet>
            <RiskUpdateModal risk={riskToUpdate} open={open} 
               enableEdit={enableEdit} onSave={handleSaved} onClose={handleClose} />
            <Box width={1}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <Box width={1} overflow="auto" boxShadow={3} m={0.5} p={0}>
                            <Card className={classes.card}>
                                <CardHeader 
                                    avatar={<Avatar><BugReport /></Avatar>}
                                    title={<Box display="flex" justifyContent="space-between">
                                    <Typography variant="h3">{translate('global.menu.entities.microrisqueRisk')}</Typography>
                                    <CardSubHeaderInlineSearchBar 
                                        onChange = {handleSearch}
                                    />
                                </Box>
                                    }
                                    action={<IconButton color="inherit" onClick={handleAdd}><Add /></IconButton>}
                                    classes={{ root: classes.cardHeader}}
                                />
                                <CardContent>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate("microgatewayApp.microrisqueRisk.label")}</TableCell>
                                                <TableCell align="center">{translate("microgatewayApp.microrisqueRisk.type")}</TableCell>
                                                <TableCell align="center">{translate("microgatewayApp.microrisqueRisk.probability")}</TableCell>
                                                <TableCell align="center">{translate("microgatewayApp.microrisqueRisk.gravity")}</TableCell>
                                                <TableCell align="center">{translate("_global.label.criticity")}</TableCell>
                                                <TableCell align="center">{translate("microgatewayApp.microrisqueControl.home.title")}</TableCell>
                                                <TableCell align="center">{translate("microgatewayApp.microrisqueRisk.cause")}</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading &&
                                            <TableRow>
                                                <TableCell align="center" colSpan={10}>
                                                    <CircularProgress />
                                                    <Typography color="primary">Loading...</Typography>
                                                </TableCell>
                                            </TableRow>}
                                            {items && items.length > 0 ? (
                                                items
                                            ): (
                                                <TableRow>
                                                    <TableCell align="center" colSpan={10}>
                                                        <Typography variant="h4">
                                                            {translate("microgatewayApp.microrisqueRisk.home.notFound")}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                {totalItems > 0 &&
                                <CardActions className="pt-0 pb-0">
                                    <TablePagination 
                                    component="div"
                                    count={totalItems}
                                    page={activePage}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={itemsPerPage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                    labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                    classes={{ 
                                        root: classes.pagination,
                                        input: classes.paginationInput,
                                        selectIcon: classes.paginationSelectIcon,
                                    }}/>
                                </CardActions>
                                }
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default Risk;