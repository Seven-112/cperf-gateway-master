import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, colors, Divider, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Modal, Select, Switch, TablePagination, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add, Delete, Edit, Policy, Save } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { CircularProgressWithLabel } from "app/shared/component/edit-file-modal";
import { IControlMaturity } from "app/shared/model/microrisque/control-maturity.model";
import { IControlType } from "app/shared/model/microrisque/control-type.model";
import { IControl } from "app/shared/model/microrisque/control.model";
import { IRisk } from "app/shared/model/microrisque/risk.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getTotalPages, showSwalAlert } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { ControlUpdate } from "./control-update";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '45%',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
        background: 'transparent',
        marginTop: theme.spacing(7),
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        paddingBottom:2,
        paddingTop:2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        borderRadius: '7px 7px 0 0',
    },
    cardAvatar:{
        background: theme.palette.primary.light,
        color: theme.palette.background.paper,
    },
    cardcontent:{
        minHeight: '10%',
        maxHeight: '80%',
        background: theme.palette.background.paper,
    },
    cardactions:{
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '0 0 7px 7px',
        padding: 2,
        textAlign: 'center',
        background: theme.palette.primary.main,
        color: theme.palette.background.paper,
    },
    listItem:{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '15px',
        marginBottom:theme.spacing(1),
        boxShadow: '0 0 5px grey',
    },
    pagination:{
     padding:0,
     color: theme.palette.background.paper,
   },
   paginationInput:{
       width: theme.spacing(10),
       display: 'none',
   },
   paginationSelectIcon:{
       color: theme.palette.background.paper,
       display: 'none',
   },
}))
interface ControlProps{
    risk: IRisk,
    open?:boolean,
    onSave: Function,
    onClose: Function,
    onDeleted?: Function,
}

export const Control = (props: ControlProps) =>{
    const {open, risk} = props;

    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage,setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [controls, setControls] = useState<IControl[]>([])
    const [searchValue, setSearchValue] = useState('');
    const [controlToUpdate, setControlToUpdate] = useState<IControl>({});
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [controlToDelete, setControlToDelete] = useState<IControl>(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const classes = useStyles();
    
    const getControls = () =>{
        if(risk){
            setLoading(true);
            axios.get<IControl[]>(`${API_URIS.controlApiUri}/?riskId.equals=${risk.id}&page=${activePage}&size=${itemsPerPage}`)
                .then(res => {
                    setControls([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() =>setLoading(false));
        }
    }

    useEffect(() =>{
        getControls();
    }, [props.risk, activePage])

    const handleClose = () => props.onClose();

    const handleAdd = () =>{
        setControlToUpdate({});
        setOpenUpdateModal(true);
    }

    const handleUpdate = (ctrl: IControl) =>{
        setControlToUpdate(ctrl);
        setOpenUpdateModal(true);
    }

    const handleSave = (saved:IControl, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setControls([saved, ...controls]);
            else
                setControls([...controls.map(c => c.id === saved.id ? saved : c)]);
            props.onSave(saved, isNew);
            setOpenUpdateModal(false);
            // showSwalAlert(translate('_global.flash.status.success'), translate('_global.flash.message.success'), "success");
        }
    }

    const handleChangePage = (event, newPage) =>{
      setActivePage(newPage);
    }
   
    const handleChangeSearchValue = (e) => setSearchValue(e.target.value || '');

    const handleDelete = (c:IControl) =>{
        if(c){
            setControlToDelete(c);
            setOpenDeleteConfirm(true);
        }
    }

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
        setControlToDelete(null);
    }

    const onDeleted = (deletedEntityId: number) =>{
        if(deletedEntityId){
            setControls([...controls.filter(c => c.id !== deletedEntityId)])
            setOpenDeleteConfirm(false);
            if(props.onDeleted)
                props.onDeleted(controlToDelete)
        }
    }

    const items = [...controls.filter(c => c.description.toLowerCase().includes(searchValue.toLowerCase()))];

    return(
        <React.Fragment>
            {risk &&
             <>
                {controlToDelete && <EntityDeleterModal 
                    open={openDeleteConfirm} entityId={controlToDelete.id}
                    question={translate('microgatewayApp.microrisqueControl.delete.question',{ id: "" })}
                    urlWithoutEntityId={API_URIS.controlApiUri} onClose={handleCloseDeleteConfirm} onDelete={onDeleted} />}
                <ControlUpdate open={openUpdateModal} risk={risk} control={controlToUpdate}
                    onSave={handleSave} onClose={() => setOpenUpdateModal(false)}  />
                <Modal
                    open={open}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout:200
                    }}
                    onClose={handleClose}
                    disableBackdropClick
                    closeAfterTransition
                    className={classes.modal}
                >
                    <Card className={classes.card}>
                        <CardHeader
                            title={
                                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                    <Avatar className={classes.cardAvatar}> <Policy /></Avatar>
                                    <Typography variant="h4" className="mr-2 ml-2">{translate('microgatewayApp.microrisqueControl.home.title')}</Typography>
                                    <Box flexGrow={1} m={0} p={0} textAlign="center">
                                        <Typography variant="caption">{translate("microgatewayApp.microrisqueRisk.detail.title")}</Typography>
                                        &nbsp;:&nbsp;<Typography variant="caption">{risk.label}</Typography>
                                    </Box>
                                </Box>
                            }
                            subheader={<Box width={1} display="flex" justifyContent="center" m={0} mb={0.5}>
                                    <CardSubHeaderInlineSearchBar
                                     onChange={handleChangeSearchValue}/>
                            </Box>}
                            action={
                                <IconButton color="inherit" onClick={handleClose}>
                                    <Close />
                                </IconButton>
                            }
                            className={classes.cardheader}
                         />
                         <CardContent className={classes.cardcontent}>
                            {risk &&
                                <>
                                     <Box width={1} textAlign="center">
                                         {loading && <Box mb={3}>
                                            <CircularProgress />
                                            <Typography color="primary">Loading...</Typography>
                                            </Box>
                                         }
                                     </Box>
                                     <Box width={1}>
                                         <Grid container spacing={2}>
                                             <Grid item xs={12}>
                                                 <Box width={1} textAlign="center">
                                                    <Button color="primary" variant="contained" size="small" onClick={handleAdd}>
                                                        {translate('_global.label.add')}&nbsp;<Add />
                                                    </Button>
                                                 </Box>
                                             </Grid>
                                            {!loading && items.length <= 0 &&
                                             <Grid item xs={12}>
                                                 <Box width={1} textAlign="center">
                                                    <Typography color="primary">
                                                        {translate('microgatewayApp.microrisqueControl.home.notFound')}
                                                    </Typography>
                                                 </Box>
                                             </Grid>
                                             }
                                             <Grid item xs={12}>
                                                 <List dense component="nav">
                                                     {items.map(c =>(
                                                         <React.Fragment key={c.id}>
                                                         <ListItem button className={classes.listItem}>
                                                             <ListItemText
                                                                    primary={<Typography>{c.description}</Typography>}
                                                                    secondary={<Box width={1} display="flex" flexWrap="wrap"
                                                                        justifyContent="space-around" alignItems="center">
                                                                        {c.type && 
                                                                        <Box component="span">
                                                                            <Typography variant="caption" display="inline">{translate('microgatewayApp.microrisqueControl.type')}</Typography>
                                                                            <Typography variant="caption" color="primary" className="font-weight-bold" display="inline">&nbsp;:&nbsp;{c.type.type}</Typography>
                                                                        </Box>
                                                                        }
                                                                        {c.maturity && 
                                                                        <Box component="span">
                                                                            <Typography variant="caption" display="inline">{translate('microgatewayApp.microrisqueControl.maturity')}</Typography>
                                                                            <Typography variant="caption" color="primary" className="font-weight-bold" display="inline">&nbsp;:&nbsp;{c.maturity.label}</Typography>
                                                                        </Box>
                                                                        }
                                                                        <Box component="span">
                                                                            <Typography variant="caption" display="inline">{translate('microgatewayApp.microrisqueControl.validationRequired')}</Typography>
                                                                            <Typography variant="caption" color="primary" className="font-weight-bold" display="inline">&nbsp;:&nbsp;{translate(`_global.label.${c.validationRequired ? 'yes': 'no'}`)}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                                 />
                                                                 <ListItemSecondaryAction>
                                                                        <Tooltip title="edit..">
                                                                            <IconButton size="small" color="primary"
                                                                             style={{padding:0}} onClick={() => handleUpdate(c)}>
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>&nbsp;&nbsp;
                                                                        <Tooltip title="Delete..">
                                                                            <IconButton size="small"
                                                                                 color="secondary"
                                                                                 style={{padding:0}}
                                                                                 onClick={() => handleDelete(c)}
                                                                                 >
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                 </ListItemSecondaryAction>
                                                         </ListItem>
                                                         </React.Fragment>
                                                     ))}
                                                 </List>
                                             </Grid>
                                         </Grid>
                                     </Box>
                                </>
                            }
                         </CardContent>
                        {(risk && totalItems > 0 ) &&
                            <CardActions className={classes.cardactions}>
                                <TablePagination className={controls && controls.length > 0 ? '' : 'd-none'}
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={() =>{}}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage=""
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                                }}/>
                            </CardActions>}
                    </Card>
                </Modal>
            </>
           }
        </React.Fragment>
    )
}

export default Control;