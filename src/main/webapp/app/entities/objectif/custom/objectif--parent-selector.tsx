import { IObjectif } from "app/shared/model/objectif.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import React from "react";
import { Box, Card, CardActions, CardContent, CardHeader, Checkbox, Divider, IconButton, InputBase, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Modal, TablePagination } from "@material-ui/core";
import { convertDateFromServer, convertDateTimeToServer, formateDate } from "app/shared/util/date-utils";
import { Translate } from "react-jhipster";
import { Close } from "@material-ui/icons";
import { ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { APP_DATETIME_FORMAT } from "app/config/constants";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        width: '40%',
        [theme.breakpoints.down('sm')]:{
            width: '85%',
        },
        maxHeight: theme.spacing(60),
        background: 'transparent',
        boxShadow: 'none',
        marginTop: theme.spacing(10),
    },
    cardheader:{
        background: theme.palette.background.paper,
        borderRadius: '20px 20px 0 0',
        borderBottom: '1px solid',
        borderColor: theme.palette.primary.dark,
    },
    searchField:{

    },
    subheader:{
        fontSize: '12px',
        textAlign: "center",
        color: theme.palette.primary.dark,
    },
    cardContent:{
        background: theme.palette.background.paper,
        height: theme.spacing(40),
        overflow: 'auto',
        padding:0,
        margin:0,
    },
    cardActions:{
        paddingTop: 0,
        paddingBottom:0,
        background: theme.palette.background.paper,
        borderTop: '1px solid',
        borderColor: theme.palette.primary.dark,
        borderRadius: '0 0 20px 20px',
        minHeight: theme.spacing(6),
        overflow: 'hidden',
    },
    pagination:{
        padding: 0,
        color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(5),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    }, 
}));
interface IObjectifParentSelectProps{
    objectif: IObjectif,
    open: boolean,
    multiple: boolean,
    onClose: Function,
}

export const ObjectifParentSelector = (props: IObjectifParentSelectProps) =>{

    const {objectif, open}= props;

     const [activePage, setActivePage] = useState(0);

     const [itemsPerPage, setItemsPerPage] = useState(10);

     const [totalItems, setTotalItems] = useState(0);

     const [searchValue, setSeachValue] = useState('');

     const [loading, setLoading] = useState(false);

     const [objectifs, setObjectifs] = useState<IObjectif[]>([]);

     const [selectedObjectifs, setSelectedObjectifs] =  useState<IObjectif[]>([]);

     const classes = useStyles();


     const getObjectifs = () =>{
         let requestUri = `${API_URIS.objectifApiUri}/?page=${activePage}&size${itemsPerPage}&sort=id,desc`;
         if(objectif && objectif.categorie)
            requestUri = `${requestUri}&categorie.equals=${objectif.categorie}`;
        setLoading(true);
        axios.get<IObjectif[]>(requestUri).then(res =>{
            if(res.data && res.data.length){
                const els = (objectif && objectif.id) ? 
                    res.data.filter(o => (o.id !== objectif.id && (!o.parent || o.parent.id !== objectif.id )))
                    : res.data;
                    
                setObjectifs([...els]);
            }
            setTotalItems(parseInt(res.headers['x-total-count'],10));
        }).catch(e =>{
            /* eslint-disable no-console */
            console.log(e);
        }).finally(() => setLoading(false));
     }

     useEffect(() =>{
        getObjectifs();
     }, [props.objectif, activePage, itemsPerPage]);

     const handleToggle = (event, value: IObjectif) => {
         const checked = event.target.checked;
         if(checked){
             if(props.multiple){
                setSelectedObjectifs([...selectedObjectifs, value]);
             }
             else{
                setSelectedObjectifs([value]);
             }
         }else{
             const els = selectedObjectifs.filter(o => o.id !== value.id);
             setSelectedObjectifs([...els]);
         }
      };

      const handleClose = () =>{
          props.onClose(selectedObjectifs);
      }

     const items = objectifs.filter(o => o.name.toLowerCase().includes(searchValue.toLowerCase())).map(o =>(
        <React.Fragment key={o.id}>
            <ListItem button>
                <ListItemText primary={o.name}
                secondary={o.createdAt ? formateDate(convertDateTimeToServer(o.createdAt), APP_DATETIME_FORMAT) : ''} />
                <ListItemSecondaryAction>
                    <Checkbox
                        edge="end"
                        onChange={(e) =>handleToggle(e, o)}
                        checked={selectedObjectifs.find(obj => obj.id === o.id) ? true : false}
                        inputProps={{ 'aria-labelledby': 'choose objectif' }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </React.Fragment>
     ));


     return (
        <React.Fragment>
          <Modal
              aria-labelledby="select-parent-objectif-modal-title"
              aria-describedby="select-parent-objectif-modal-description"
              className={classes.modal}
              open={props.open}
              onClose={handleClose}
              closeAfterTransition
              disableBackdropClick
              BackdropProps={{
                  timeout: 500,
              }}>
                  <Card className={classes.card}>
                      <CardHeader classes={{ root: classes.cardheader, subheader: classes.subheader }}
                        title={
                            <React.Fragment>
                                <InputBase placeholder="search..." type="search" fullWidth
                                value={searchValue} onChange={(e) => setSeachValue(e.target.value)}
                                className={classes.searchField} />
                            </React.Fragment>
                        }
                        subheader={<React.Fragment>
                            <span>selected {selectedObjectifs.length}</span>
                        </React.Fragment>}
                        action={
                            <IconButton onClick={handleClose} color="primary">
                                <Close />
                            </IconButton>
                        }
                      />
                      <CardContent className={classes.cardContent}>
                        <React.Fragment>
                            {loading && 'loading'}
                            {!loading && (!objectifs || objectifs.length <= 0) && 
                            <Translate contentKey="microgatewayApp.objectif.home.notFound">No Objectifs found</Translate>}
                            {!loading && objectifs && objectifs.length > 0 &&
                                <List component="nav">
                                    {items}
                                </List>
                            }
                        </React.Fragment>
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                          {totalItems > 0 && <TablePagination 
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={(e, newPage) => setActivePage(newPage)}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={(e) =>setItemsPerPage(parseInt(e.target.value, 10))}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                            }}/>
                          }
                      </CardActions>
                  </Card>
              </Modal>
       </React.Fragment>
    );

}

export default ObjectifParentSelector;