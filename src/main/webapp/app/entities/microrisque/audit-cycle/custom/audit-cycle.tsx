import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { IRootState } from 'app/shared/reducers';
import { Box, Card, CardActions, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TablePagination, Tooltip, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { getSession } from 'app/shared/reducers/authentication';
import { IAuditCycle } from 'app/shared/model/microrisque/audit-cycle.model';
import axios from 'axios';
import theme from 'app/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { hasPrivileges } from 'app/shared/auth/helper';
import AuditCycleUpdate from './audit-cycle-update';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import clsx from 'clsx';
import { CheckCircle } from '@material-ui/icons';

const useStyles = makeStyles({
    card:{
        border: '1px solid '+ theme.palette.primary.main,
        boxShadow: '0 0 7px '+theme.palette.grey[900],
    },
    selectOnlyCard:{
        boxShadow: 'none',
        border: 'none',
    },
    cardHeader: {
      paddingTop:2,
      paddingBottom:2,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
    },
    avatar: {
    },
    cardContent:{
  
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      '& .ReactVirtualized__Table__headerRow': {
        flip: false,
        paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
      },
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
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
});

interface AuditCycleProps extends StateProps, DispatchProps{
    selectOnly?: boolean,
    onSelect?: Function,
}

export const AuditCycle = (props: AuditCycleProps) => {
    
    const { account, selectOnly } = props;
    
    const [cycles, setCycles] = useState<IAuditCycle[]>([]);

    const [cycle, setCycle] = useState<IAuditCycle>(null);
  
    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);

    const [loading, setLoading] = useState(false);

    const [openToUpdate, setOpenToUpdate] = useState(false);

    const [openToDelete, setOpenToDelete] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const canCreate = !selectOnly && account && hasPrivileges({ entities: ["Audit"], actions: [PrivilegeAction.CREATE]}, account.authorities);
    const canUpdate = !selectOnly && account && hasPrivileges({ entities: ["Audit"], actions: [PrivilegeAction.UPDATE]}, account.authorities);
    const canDelete = !selectOnly && account && hasPrivileges({ entities: ["Audit"], actions: [PrivilegeAction.DELETE]}, account.authorities);

    const classes = useStyles()

    const getCycles = (p?: number, rows?: number) =>{
        const page = p || p===0 ? p : activePage;
        const size = rows || itemsPerPage;
        const  apiUri = `${API_URIS.auditCycleApiUri}/?page=${page}&size=${size}&sort=id,desc`;
        setLoading(true);
        axios.get<IAuditCycle[]>(apiUri)
            .then(res =>{
                setCycles([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'],10))
            }).catch(e => console.log(e))
            .finally(() => setLoading(false));
    }

  useEffect(() => {
    if(!props.account)
      props.getSession();
    getCycles();
  }, []); 

    const handleUpdate = (entity?: IAuditCycle) =>{
        setCycle(entity || {});
        setOpenToUpdate(true)
    }

    const onSave = (saved?: IAuditCycle, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setCycles([saved, ...cycles])
            else
                setCycles(cycles.map(c => c.id === saved.id ? saved : c));
            setOpenToUpdate(false)
        }
    }

    const handleDelete = (entity?: IAuditCycle) =>{
          if(entity){
              setCycle(entity);
              setOpenToDelete(true);
          }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setCycles(cycles.filter(c => c.id !== deletedId));
            setOpenToDelete(false);
        }
    }
  

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
        getCycles(newPage);
    }

    const handleSearch = (e) =>setSearchTerm(e.target.value);

    const myFilter = (entity: IAuditCycle) =>{
        if(entity && entity.name && searchTerm)
            return entity.name.toLowerCase().includes(searchTerm.toLowerCase());
        return true;
    }

    const handleSelect = (c: IAuditCycle) =>{
        if(props.onSelect)
            props.onSelect(c);
    }

    const items = [...cycles].filter(c => myFilter(c)).map((c, index) =>(
        <>
        <ListItem key={index} role={undefined} dense button>
            <ListItemText style={{ padding:10 }}>
            <Typography variant="h6">{c.name}</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
            {props.onSelect && <Tooltip title="select" onClick={() =>props.onSelect(c)}>
                <IconButton edge="start" className='text-success'>
                    <CheckCircle />
                </IconButton>
            </Tooltip>}
            {canUpdate &&
                <IconButton edge="start" aria-label="Edit" onClick={() =>handleUpdate(c)}>
                    <EditIcon color="primary" titleAccess="Edit"/>
                </IconButton>
            }
            {canDelete &&
                <IconButton edge="end" aria-label="Delete" onClick={() =>handleDelete(c)}>
                <DeleteIcon color="error" titleAccess="Delete"/>
                </IconButton>
            }
            </ListItemSecondaryAction>
        </ListItem>
        {(index < [...cycles].length -1) && <Divider/> }
        </>
    ))


  return (
      <React.Fragment>
        <Helmet>
            <title>
                {`${translate("_global.appName")} | ${translate("microgatewayApp.microrisqueAuditCycle.home.title")}`}
            </title>
        </Helmet>
        {!selectOnly && <>
        <AuditCycleUpdate
            open={openToUpdate}
            cycle={cycle}
            onClose={() => setOpenToUpdate(false)}
            onSave={onSave}
         />
         {cycle && cycle.id && <EntityDeleterModal 
            open={openToDelete}
            entityId={cycle.id}
            urlWithoutEntityId={API_URIS.auditCycleApiUri}
            onClose={() => setOpenToDelete(false)}
            onDelete={onDelete}
            question={translate("microgatewayApp.microrisqueAuditCycle.delete.question", { id: cycle.name })}
         />}
         </>}
        <Card className={clsx(classes.card, { [classes.selectOnlyCard]: selectOnly })}>
          <CardHeader 
              action={
                <React.Fragment>
                  {canCreate && 
                    <IconButton aria-label="add"
                      color="inherit"
                     onClick={ () => handleUpdate(null)}>
                    <AddIcon style={{ fontSize: 30 }}/>
                  </IconButton>}
                </React.Fragment>
              }
              title={<Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    {!selectOnly &&  <Box display={"flex"} alignItems={"center"}>
                        <Box p={0} m={0} mr={3}><FontAwesomeIcon icon={faCircleNotch} /></Box>
                        {translate("microgatewayApp.microrisqueAuditCycle.home.title")}
                    </Box>}
                    <CardSubHeaderInlineSearchBar
                        onChange = {(e) => handleSearch(e)}
                    />
                </Box>}
            titleTypographyProps={{ variant: 'h4' }}
            className={classes.cardHeader}
        />
        <CardContent className={ classes.cardContent}>
          {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
              <Typography  color="primary">Loading...</Typography>
          </Box>}
          <List>
              {props.onSelect && 
                <ListItem  role={undefined} dense button>
                    <ListItemText style={{ padding:10 }}>
                    <Typography variant="h6">{translate("_global.label.noSelect")}</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                    <Tooltip title="select" onClick={() =>props.onSelect(null)}>
                        <IconButton edge="start" className='text-success'>
                            <CheckCircle />
                        </IconButton>
                    </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>}
              {items}
          </List>
            {!loading && !props.onSelect && [...items].length === 0 && 
                <div className="alert alert-warning">
                <Translate contentKey="microgatewayApp.microrisqueAuditCycle.home.notFound">No cycle found</Translate>
                </div>
            }
        </CardContent>
        {(totalItems > 0) &&
            <CardActions>
                <TablePagination className={cycles && cycles.length > 0 ? '' : 'd-none'}
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
      </React.Fragment>
  );
};

const mapStateToProps = ({authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
  getSession,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditCycle);
