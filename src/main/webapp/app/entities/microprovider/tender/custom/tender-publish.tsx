import { Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, CircularProgress, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Modal, Slide, TablePagination, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { ITender } from "app/shared/model/microprovider/tender.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { Alert } from "@material-ui/lab";
import { ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { ITenderProvider } from "app/shared/model/microprovider/tender-provider.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
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

interface TenderPublishProps{
    tender?:ITender,
    open?: boolean,
    onSave?:Function,
    onClose:Function,
}
export const TenderPublish = (props:TenderPublishProps) =>{
    const {tender, open} = props;
    const [parteners, setParteners] = useState<IPartener[]>([]);
    const [unselected, setUnselected] = useState<IPartener[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalIems] = useState(0);
    
    const classes = useStyles();

    const handleClose = () =>{
        setSubmitted(false);
        setError(false);
            props.onClose();
    }

    const getParteners = (p?: number, size?: number) =>{
        if(tender && tender.targetCategoryId){
            const page = p || p===0 ? p : activePage;
            const rows = size || itemsPerPage;
            setLoading(true)
            let requestUri = `${API_URIS.partenerApiUri}/?categoryId.equals=${tender.targetCategoryId}`;
            requestUri = `${requestUri}&page=${activePage}&size=${itemsPerPage}`;
            axios.get<IPartener[]>(requestUri)
                .then(res =>{
                    if(res.data)
                        setParteners([...res.data]);
                    setTotalIems(parseInt(res.headers['x-total-count'], 10));
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    useEffect(() =>{
        getParteners();
    }, [])

    const sendPublishEmails = (_tender: ITender)=>{
        console.log("seending")
        if(_tender){
            const emails = [...parteners]
                .filter(p => p.email && ![...unselected].some(u => u.id === p.id)).map(p => p.email)
            if(emails && emails.length !==0){
                setLoading(false);
                axios.get(`api/send-providers-tender-lunched-emails/${emails.join(',')}`)
                    .then((res) =>{
                        if(res.data)
                            handleClose();
                    })
                    .catch(err => console.log(err))
                    .finally(() =>{
                        setLoading(false);
                        if(props.onSave)
                            props.onSave(_tender);
                    })
            }
        }
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setSubmitted(true);
        setError(false)
        setLoading(true)
        if(tender && tender.id){
            const selectedProviders = [...parteners]
                                        .filter(p => p.id && ![...unselected].some(up => up.id === p.id));
            let success = false;
            if(selectedProviders && selectedProviders.length !==0){
                selectedProviders.map((p,index) =>{
                    const entity: ITenderProvider={
                        tenderId: tender.id,
                        providerId: p.id,
                        providerEmail: p.email,
                        providerName: p.name,
                    }                          
                    axios.post<ITenderProvider>(`${API_URIS.tenderProviderApiUri}`, cleanEntity(entity))
                    .then((res) => {
                        if(res.data)
                            success = true;
                    })
                    .catch(e => {
                        console.log(e)
                    }).finally(() =>{
                        if(index === selectedProviders.length -1){
                            if(selectedProviders.length === 1 || success){
                                setLoading(true);
                                axios.put<ITender>(`${API_URIS.tenderApiUri}/publish/${tender.id}`)
                                .then(res =>{
                                    if(res.data)
                                        sendPublishEmails(res.data)
                                }).catch(err =>{
                                    console.log(err)
                                    setError(err)
                                }).finally(() =>{ setLoading(false)})
                            }else{
                                setLoading(false);
                            }
                        }
                    })
                })
            } else{
                setLoading(false);
            }
        }
    }

    const toggleSelect = (partener: IPartener) =>{
        if(partener){
            if([...unselected].some(p => p.id === partener.id))
                setUnselected(unselected.filter(p => p.id !==partener.id))
            else
                setUnselected([...unselected, partener]);
        }
    }

    const handleChangePage = (event, newPage) => {
      setActivePage(newPage);
      getParteners(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        getParteners(activePage, parseInt(event.target.value, 10));
    };

    return (
        <React.Fragment>
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 300,
            }}
            disableBackdropClick
            closeAfterTransition
            className={classes.modal}
        >
        <Slide
                in={open}
                direction="down"
                timeout={300}
            >
            <Card className={classes.card}>
                <CardHeader 
                    title={translate("_tender.publishing")}
                    titleTypographyProps={{
                        variant: 'h4',
                    }}
                    action={
                    props.onClose ? 
                    <IconButton color="inherit" onClick={handleClose}>
                        <Close />
                    </IconButton>: ''}
                    className={classes.cardheader}
                />
                <CardContent className={classes.cardcontent}>
                    {loading && 
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                            <CircularProgress style={{ height: 50, width: 50}} color="primary" />
                            <Typography className="ml-3" color="primary">Loading...</Typography>
                        </Box>
                    }
                    {(!loading && submitted && error) && 
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                            <Alert severity="error"
                                onClick={() => { setSubmitted(false); setError(false)}}>
                                <Typography variant="caption">{translate("_global.flash.message.failedAndTryAgain")}</Typography>
                            </Alert>
                        </Box>
                    }
                    {[...unselected].length !== 0 &&
                     <Box width={1} display="flex" justifyContent="center" alignItems="center"
                         flexWrap="wrap" overflow="auto" borderRadius={15} boxShadow={1}>
                             <Box width={1} p={2} mb={2}><Typography variant="caption" color="primary">{translate("_tender.unselectedProvider")}</Typography></Box>
                            {[...unselected].map((p, index) =>(
                                <Box key={index} display="flex" alignItems="center" mt={1}>
                                    <FormControlLabel 
                                        label={<Typography variant="caption">{p.name || ''}</Typography>}
                                        control={<Checkbox checked={false} onClick={() => toggleSelect(p)}/>}
                                    />
                                </Box>
                            ))}
                        </Box>
                    }
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" overflow="auto">
                        <List className="w-100">
                            {[...parteners].map(p =>(
                                <ListItem key={p.id} button>
                                    <ListItemText primary={p.name} />
                                    <ListItemSecondaryAction>
                                        <Checkbox checked={![...unselected].some(u => u.id ===p.id)} onChange={() => toggleSelect(p)}/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box width={1} display="flex" justifyContent="center" mt={2}>
                         <Button color="primary" variant="text" className="text-capitalize"
                             disabled={!tender || tender.published || [...unselected].length === [...parteners].length}
                             onClick={handleSave}>
                             {translate("entity.action.save")}&nbsp;&nbsp;
                             <Save />
                         </Button>
                    </Box>
                </CardContent>
                {totalItems && 
                  <CardActions className="pt-0 pb-0 bg-white border-top"
                     style={{ borderRadius: '0 0 15px 15px', }}>
                      <TablePagination 
                      component="div"
                      count={totalItems}
                      page={activePage}
                      onPageChange={handleChangePage}
                      rowsPerPage={itemsPerPage}
                      labelRowsPerPage={translate("_global.label.rowsPerPage")}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                      labelDisplayedRows={({count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                      classes={{ 
                          root: classes.pagination,
                          input: classes.paginationInput,
                          selectIcon: classes.paginationSelectIcon,
                    }}/>
                  </CardActions>}
            </Card>
            </Slide>
        </Modal>
        </React.Fragment>
    )
}

export default TenderPublish;