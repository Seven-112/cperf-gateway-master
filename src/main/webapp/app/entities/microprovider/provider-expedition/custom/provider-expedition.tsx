import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { TextFormat, Translate, translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { Helmet } from 'react-helmet';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Delete, Edit, Visibility, VisibilityOff } from '@material-ui/icons';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import { API_URIS, getChronoText, getTotalPages } from 'app/shared/util/helpers';
import axios from 'axios';
import { IProviderExpedition } from 'app/shared/model/microprovider/provider-expedition.model';
import { getSession } from 'app/shared/reducers/authentication';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDolly } from '@fortawesome/free-solid-svg-icons';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import ProviderExpeditionUpdate from './provider-expedition-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import PartenerVisualizer from 'app/entities/micropartener/partener/custom/partener-visualizer';
import TextContentManager from 'app/shared/component/text-content-manager';
import { IChrono, defaultValue as DefaultChronoData } from 'app/shared/util/chrono.model';
import clsx from 'clsx';

const useStyles = makeStyles(theme =>({
    card:{
     border: '1px solid '+ theme.palette.primary.main,
     boxShadow: '0 0 7px '+theme.palette.grey[900],
   },
   container: {
     maxHeight: 650,
     padding:0,
   },
   cardHeader: {
     color: theme.palette.primary.dark,
     backgroundColor: theme.palette.background.paper,
   },
   subheader:{
     marginLeft: theme.spacing(45),
     marginTop: '-25px',
     width:400,
     [theme.breakpoints.down('sm')]: {
       width:200,
       marginLeft: theme.spacing(20),
     },
     backgroundColor: theme.palette.secondary.dark,
     padding:2,
     borderRadius:5,
   },
   theadRow:{
     backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
     color: 'white',
     '&>th':{
       color: 'white',
     }
   },
   fileIllustation:{
     width: theme.spacing(4),
     height: theme.spacing(4),
     fontSize: theme.spacing(10),
     marginRight: theme.spacing(1),
     cursor: 'pointer',
     '&:hover':{
     }
   },
   pagination:{
    padding:0,
    color: theme.palette.primary.dark,
  },
  input:{
      width: theme.spacing(10),
      display: 'none',
  },
  selectIcon:{
      color: theme.palette.primary.dark,
      display: 'none',
  },
  truncate:{
      maxWidth: 200,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
  },
}))

const ProviderExeditionRowItem = (props: {
        expedition: IProviderExpedition,
        canUpdate?:boolean,
        canDelete?:boolean,
        onDelete?:Function,
        onUpdate?:Function,
    }) =>{
    const { expedition,canUpdate, canDelete } = props;

    const [openObject, setOpenBject] = useState(false);

    const classes = useStyles();

    const formateDate = (dateStr) =>{
        if(dateStr){
            // ${translate("_global.label.to")} HH:mm
          return <TextFormat type="date" value={convertDateTimeToServer(dateStr)} format={`DD/MM/YYYY`}/>
        }
        return '..'
    }

    const handleUpdate = () =>{
        if(props.onUpdate)
            props.onUpdate(expedition)
    }

    const handleDelete = () =>{
        if(props.onDelete)
            props.onDelete(expedition)
    }

    const getChrono = (startDate: Date, endDate: Date): IChrono =>{
        const chrono: IChrono = (startDate && endDate) ? {...DefaultChronoData} : null;
        if(chrono){
            const diff = (startDate && endDate) ? (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) : 0;
            chrono.nbDays = Math.abs(diff);
            chrono.exceeced = diff < 0;
        }
        return chrono;
    }

    const object = (expedition.answer && expedition.answer.tender) ? expedition.answer.tender.object || '' : '';
    const departureDate = (expedition && expedition.departureDate) ? new Date(expedition.departureDate) : null;
    const  portArivalDate = (expedition && expedition.portArivalDate) ? new Date(expedition.portArivalDate) : null;
    const siteDeliveryDate = (expedition && expedition.siteDeliveryDate) ? new Date(expedition.siteDeliveryDate) : null;
    const previewDepatureDate = (expedition && expedition.previewDepatureDate) ? new Date(expedition.previewDepatureDate) : null;
    const previewSiteDeliveryDate = (expedition && expedition.previewSiteDeliveryDate) ? new Date(expedition.previewSiteDeliveryDate) : null;
    const previewPortArivalDate = (expedition && expedition.previewPortArivalDate) ? new Date(expedition.previewPortArivalDate) : null;

    const departureChrono = getChrono(departureDate, previewDepatureDate);
    const portChrono = getChrono(portArivalDate, previewPortArivalDate);
    const siteChrono = getChrono(siteDeliveryDate, previewSiteDeliveryDate);

    const DisplayChrono = (chrono: IChrono) =>{
        return (
            <React.Fragment>
                {
                    chrono ? 
                        <span className={clsx('badge badge-pill',{
                                'badge-success': !chrono.exceeced,
                                'badge-danger': chrono.exceeced,
                            })}>
                            {chrono.nbDays !== 0 ? getChronoText(chrono) : '0J'}&nbsp;
                            {chrono.nbDays !== 0 && translate('_global.label.'+(chrono.exceeced ? 'lost': 'gained'))}
                        </span>
                    : '...'
                }
            </React.Fragment>
        )
    }
   
    
    return (
        <React.Fragment>
            <TextContentManager 
                title={translate("microgatewayApp.microproviderTender.detail.title")}
                value={object} readonly 
                open={openObject} 
                onClose={() => setOpenBject(false)} />
            <TableRow>
                <TableCell align="left">
                    <PartenerVisualizer rootBoxProps={{ alignItems:"flex-start" }}
                        id={(expedition && expedition.answer) ? expedition.answer.providerId : null }/>
                    </TableCell>
                <TableCell align="center">
                    <Box display="flex" justifyContent="center" alignItems="flex-start">
                        <Typography className={classes.truncate}>{object}</Typography>
                        <IconButton onClick={() => setOpenBject(!openObject)} className="ml-3 p-0">
                            {openObject ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                </TableCell>
                <TableCell align="center">{expedition.countryOrigin}</TableCell>
                <TableCell align="center">{expedition.transporter}</TableCell>
                <TableCell align="center">{formateDate(expedition.previewDepatureDate)}</TableCell>
                <TableCell align="center">{formateDate(expedition.departureDate)}</TableCell>
                <TableCell align="center">
                    {departureChrono ? <DisplayChrono exceeced={departureChrono.exceeced} nbDays={departureChrono.nbDays}/>: "..."}
                </TableCell>
                <TableCell align="center">{formateDate(expedition.previewPortArivalDate)}</TableCell>
                <TableCell align="center">{formateDate(expedition.portArivalDate)}</TableCell>
                <TableCell align="center">
                    {portChrono ? <DisplayChrono exceeced={portChrono.exceeced} nbDays={portChrono.nbDays}/> : "..." }
                </TableCell>
                <TableCell align="center">{formateDate(expedition.previewSiteDeliveryDate)}</TableCell>
                <TableCell align="center">{formateDate(expedition.siteDeliveryDate)}</TableCell>
                <TableCell align="center">
                    {siteChrono ? <DisplayChrono exceeced={siteChrono.exceeced} nbDays={siteChrono.nbDays}/> : '...' }
                </TableCell>
                {(canUpdate || canDelete) &&
                <TableCell align="center">
                    {canUpdate && 
                    <IconButton color="primary" className="mr-3 p-0"
                        onClick={handleUpdate}>
                        <Edit />
                    </IconButton>
                    }
                    {canDelete && 
                    <IconButton color="secondary" className="p-0"
                    onClick={handleDelete}>
                        <Delete />
                    </IconButton>
                    }
                </TableCell>
                }
            </TableRow>
        </React.Fragment>
    )
}

export interface ProviderExpeditionProps extends StateProps, DispatchProps {}

export const ProviderExpedition = (props: ProviderExpeditionProps) => {
  const { account } = props

  const [activePage, setActivePage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0);
  const [expeditions, setExpedtions] = useState<IProviderExpedition[]>([]);
  const [open, setOpen] = useState(false);
  const [expeditionToUpdate, setExpeditionToUpdate] = useState<IProviderExpedition>(null);
  const [expeditionToDelete, setExpeditionToDelete] = useState<IProviderExpedition>(null);
  const [loading, setLoading] = useState(false)

  const classes = useStyles();

  const getAllEntities = () => {
      setLoading(true)
      const apiUri = `${API_URIS.providerExpeditionApiUri}/?page=${activePage}&size=${itemsPerPage}&sort=id,desc`;
      axios.get<IProviderExpedition[]>(apiUri)
        .then(res =>{
            if(res.data){
                setExpedtions([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'], 10))
            }

        }).catch(e => console.log(e)).finally(() => setLoading(false))

  };

  useEffect(() =>{
    if(!props.account)
        props.getSession();
  }, [])

  useEffect(() => {
    getAllEntities();
  }, [activePage]);

  const handlePagination =( event, newPage) => setActivePage(newPage);

  const handleChangeItemPerPage = (e) =>{
      setItemsPerPage(parseInt(e.target.value, 10));
  }

  const handleSearchOnChange = (e) => setSearchValue(e.target.value);
  // microgatewayApp.fonction.home.title

  const canUpdate = (account && hasPrivileges({ actions: [PrivilegeAction.UPDATE], entities: ['ProviderExpedition']}, account.authorities));
  const canDelete = (account && hasPrivileges({ actions: [PrivilegeAction.DELETE], entities: ['ProviderExpedition']}, account.authorities));

  const handleUpdate = (exp?: IProviderExpedition) =>{
      setExpeditionToUpdate(exp);
      setOpen(true);
  }

  const handleClose = () => setOpen(false);

  const handleSave = (saved?: IProviderExpedition, isNew?: boolean) =>{
      if(saved){
          if(isNew){
              setExpedtions([saved, ...expeditions]);
              setOpen(false);
          }else{
              setExpedtions(expeditions.map(exp => exp.id === saved.id ? saved : exp))
          }
      }
  }

  const handleDeleted = (deletedId?: any) =>{
    if(deletedId){
        setExpeditionToDelete(null)
        setExpedtions(expeditions.filter(exp => exp.id !== deletedId))
    }
  }

  const seachFilter = (exp?: IProviderExpedition) =>{
      if(exp){
          const ref = (exp.answer && exp.answer.tender) ? exp.answer.tender.object || '' : '';
          const country = exp.countryOrigin || '';
          const sVal = searchValue || '';
          return (ref.toLowerCase().includes(sVal.toLowerCase()) || country.toLowerCase().includes(sVal.toLowerCase()))
      }
      return false;
  }

  return (
      <React.Fragment>
          <Helmet><title>Cperf | {`${translate("microgatewayApp.microproviderProviderExpedition.home.title")}`}</title></Helmet>
           <ProviderExpeditionUpdate
            open={open} account={account}
            expedition={expeditionToUpdate} onSave={handleSave} onClose={handleClose} />
           {expeditionToDelete && <EntityDeleterModal
                entityId={expeditionToDelete.id}
                open={true}
                urlWithoutEntityId={API_URIS.providerExpeditionApiUri}
                question={translate("microgatewayApp.microproviderProviderExpedition.delete.question", {id: ''})}
                onClose={() => setExpeditionToDelete(null)}
                onDelete={handleDeleted}
            />
            }
            <Card className={classes.card}>
                <CardHeader
                    title={<Box display="flex" justifyContent="space-between" alignItems="center">
                      <FontAwesomeIcon icon={faDolly} className="mr-3"/>
                      <Typography variant="h4" color="inherit">
                        <Translate contentKey="microgatewayApp.microproviderProviderExpedition.home.title">Expédition</Translate>
                      </Typography>
                      <CardSubHeaderInlineSearchBar
                       onChange = {handleSearchOnChange}
                       />
                    </Box>}
                    titleTypographyProps={{ variant: 'h4' }}
                    classes={{ root: classes.cardHeader }}/>
                <CardContent style={ { padding:0}}>
                    <Table stickyHeader aria-label="procdures table">
                        <TableHead>
                        <TableRow className={classes.theadRow}>
                            <TableCell align='left'>
                                <Translate contentKey="_global.label.provider">Provider</Translate>
                            </TableCell>
                            <TableCell align='left'>
                                <Translate contentKey="microgatewayApp.microproviderTender.detail.title">Appel doffre</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.countryOrigin">countryOrigin</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.transporter">transporter</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewDepatureDate">previewDepatureDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.departureDate">departureDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="_global.label.diff">Différence</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewPortArivalDate">previewPortArivalDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.portArivalDate">portArivalDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="_global.label.diff">Différence</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.previewSiteDeliveryDate">previewSiteDeliveryDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="microgatewayApp.microproviderProviderExpedition.siteDeliveryDate">siteDeliveryDate</Translate>
                            </TableCell>
                            <TableCell align='center'>
                                <Translate contentKey="_global.label.diff">Différence</Translate>
                            </TableCell>
                            {(canUpdate || canDelete) &&
                                <TableCell align='center'>Actions</TableCell>
                            }
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {(!loading && expeditions && expeditions.length !==0) &&
                                [...expeditions].filter(exp => seachFilter(exp))
                                  .sort(() => -1).map(exp =>(
                                    <ProviderExeditionRowItem
                                         key={exp.id} 
                                         expedition={exp}
                                         canDelete={canDelete}
                                         canUpdate={canUpdate}
                                         onDelete={(expedition) => setExpeditionToDelete(expedition)}
                                         onUpdate={handleUpdate}
                                          />
                                ))
                             }
                            {(!expeditions || !expeditions.length )&& 
                                <TableRow>
                                    <TableCell colSpan={20} align="center">
                                        {!loading && <Translate contentKey="microgatewayApp.microproviderProviderExpedition..home.notFound">No Expedition found</Translate>}
                                        {loading && 'laoding'}
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardActions>
                {totalItems > 0 &&
                    <TablePagination className={(expeditions && expeditions.length !== 0)? '' : 'd-none'}
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
                        input: classes.input,
                        selectIcon: classes.selectIcon,
                    }}/>}
                </CardActions>
            </Card>
      </React.Fragment>
  )
};

const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account
  });
  
  const mapDispatchToProps = {
    getSession
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProviderExpedition);
