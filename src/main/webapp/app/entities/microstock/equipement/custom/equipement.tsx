import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { Box, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, makeStyles, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import { Add, Delete, Edit, ExpandLess, ExpandMore } from '@material-ui/icons';
import { API_URIS, getTotalPages } from 'app/shared/util/helpers';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import EquipementUpdate from './equipement-update';
import axios from 'axios';
import EquipementChildren from './equipement-children';
import { IEquipement } from 'app/shared/model/microstock/equipement.model';

const useStyles = makeStyles(theme =>({
  card:{
    boxShadow:'-1px -1px 7px',
  },
  cardHeader:{
    background: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  cardTitle:{
    color: theme.palette.primary.dark
  },
  cardActions:{
    paddingTop:0,
    paddingBottom:0,
  },
  theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
    }
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


const ItemRow = (props: {equipement: IEquipement, onChangeValid: Function, handleUpdate: Function, handleDelete: Function}) =>{
    const equipement = props.equipement;

    const handleChangeValid = () => props.onChangeValid(equipement);
    
  const [equipements, setEquipements] = useState<IEquipement[]>([]);
  const [displayChildren, setDisplayChildren] = useState(false);
  const [showDescription, setShowdescription] = useState(false);

  const [loading, setLoading] = useState(false);
    
    const handleUpdate = () => props.handleUpdate(equipement);

    const handleDelete = () => props.handleDelete(equipement);

    const getEquipements = () => {
     if(equipement){
      setLoading(true);
      const requestUri =`${API_URIS.equipementApi}/?composantDeId.equals=${equipement.id}&sort=id,desc`;
      axios.get<IEquipement[]>(requestUri)
        .then(res => {
          setEquipements([...res.data])
        }).catch((e) =>{
          console.log(e);
        }).finally(() =>{
            setLoading(false);
        });
    }
  }

useEffect(() => {
    getEquipements();
  }, [props.equipement]);


  const onChildDelete = (deletedId?: any) =>{
    console.log("chdeid", deletedId)
    if(deletedId){
        setEquipements([...equipements].filter(c => c.id !== deletedId));
    }
}

const onChildSave = (saved?: IEquipement, isNew?: boolean) =>{
    if(saved){
        if(isNew)
            setEquipements([...equipements, saved])
        else
            setEquipements([...equipements].map(c => c.id === saved.id ? saved : c));
            setDisplayChildren(false);
    }
}

    return (
    <React.Fragment>
        <TableRow>
           <TableCell align="left">{ equipement.nom}
           </TableCell>
            <TableCell align="center">{ equipement.description  }</TableCell>
            <TableCell align="center">{ equipement.dateAjout}</TableCell>
            <TableCell align="center">{ equipement.dateRemplacement}</TableCell>
            <TableCell align="center">{ equipement.composantDe ? equipement.composantDe.nom:''}</TableCell> 
            <TableCell align="center">
            {/* {changement && <>
            {changement.map((item, i) => (
                <TextContentManager
                title="Historique des changements"
                value={
                    <>
                        <span>{"Nom :"} {item.equipement.nom}</span>
                        <span>{"FileName :"} {item.fileName}</span>
                        <span>{"Motif :"} {item.motif}</span>
                        <span>{"Date :"} {item.date}</span>
                    </>
                }
                key={i}
                readonly
                open={showDescription}
                onClose={() => setShowdescription(false)} 

            />
                
                 ))}
                            
              <Button color="primary" variant="text"
                                             className="text-capitalize p-0 ml-4"
                                             onClick={() => setShowdescription(true)}
                                             size="small">
                                            <FontAwesomeIcon icon={faEye} size="lg" className="text-primary" />
                                        </Button>

                           
        }
         */}
           <IconButton
                        className="p-0"
                        color="primary"
                        size="small"
                        disabled={(!equipements || equipements.length ===0 )}
                        onClick={() => setDisplayChildren(!displayChildren)}>
                        {displayChildren ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>

                <IconButton onClick={handleUpdate} color="primary" className="mr-2" >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDelete} color="secondary" >
                    <Delete fontSize="small" />
                </IconButton>

            </TableCell>
        </TableRow>
        <TableRow>
          </TableRow>
        {equipement && equipements && equipements.length !== 0 && <TableRow>
                <TableCell colSpan={20} className="p-0 m-0 border-0">
                    <Collapse 
                        in={displayChildren}
                        timeout={300}
                        unmountOnExit
                        >
                        <EquipementChildren 
                            equipement={equipement} 
                            level={1} 
                            equipements={[...equipements]}
                            onUpdate={onChildSave}
                            onDelete={onChildDelete} />
                    </Collapse>
                </TableCell>
            </TableRow>}
    </React.Fragment>
    );
}


export const Equipement = (props) => {
  
  const [activePage, setActivePage] = useState(0);

  const [equipements, setEquipements] = useState<IEquipement[]>([]);

  const [equipementToUpdate, setEquipementToUpdate] = useState<IEquipement>(null);
  const [loading, setLoading] = useState(false);
  
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const classes = useStyles();

  const getEquipements = (p?: number, rows?: number) => {
    setLoading(true);
    const page = p || p === 0 ? p : activePage;
    const size = rows || itemsPerPage; 
    const requestUri =`${API_URIS.equipementApi}/?composantDeId.specified=false&page=${page}&size=${size}&sort=id,desc`;
    axios.get<IEquipement[]>(requestUri)
      .then(res => {
        setTotalItems(parseInt(res.headers['x-total-count'], 10));
        setEquipements([...res.data])
      }).catch((e) =>{
        console.log(e);
      }).finally(() =>{
          setLoading(false);
      });
  };




  useEffect(() => {
    getEquipements();
  }, []);

  

  const handleChangeItemsPerpage = (event) =>{
    setItemsPerPage(parseInt(event.target.value, 10));
    getEquipements(0, parseInt(event.target.value, 10))
  }

  const handleChangePage = (event, newPage) =>{
    setActivePage(newPage);
    getEquipements(newPage)
  }

  const handleUpdateEquipements = (entity?:IEquipement) =>{
        setEquipementToUpdate(entity);
        setOpen(true);
  }
  const handleDeleteEquipement
 = (entity: IEquipement) =>{  
    if(entity){
      setEquipementToUpdate(entity);
      setOpenDelete(true);
    }
      
  }

 /* const handleChangeValid = (entity: IEquipement) =>{
      if(entity){
        entity.valid = !entity.valid
        const els = typeObjectis.map(to => {
            if(to.id === entity.id)
              return entity
            return to;
        })
        setTypeObjectifs([...els].sort(() => -1));
        axios.put<IEquipement>(API_URIS.typeObjectifApiUri, cleanEntity(entity)).then(() =>{ }).catch(() =>{})
      }
  } */

  const items = equipements.sort(() =>-1).map(co =>(
      <ItemRow key={co.id} equipement={co} handleUpdate={handleUpdateEquipements}
             handleDelete={handleDeleteEquipement} onChangeValid={()=>{}} />
  ))

  
 const onSave = (entity: IEquipement, isNew: boolean) =>{
      if(entity){
        if(isNew){
         setEquipements([entity,...equipements])

        }else{
          setEquipements([...equipements].map(co =>co.id ===entity.id ? entity:co ))

       }
       setOpen(false);
      }
  } 

  const onDelete = (deletedId) =>{
    if(deletedId){
        setEquipements([...equipements].filter(co =>co.id !==deletedId))
        setOpenDelete(false);
    }
}


   const onClose = () => setOpen(false); 

  return (
      <React.Fragment>
          <Helmet><title>Equipement</title></Helmet>
          <EquipementUpdate open={open} equipement={equipementToUpdate} onSave={onSave} onClose={onClose} />
            {equipementToUpdate && 
                <EntityDeleterModal 
                  open={openDelete}
                  entityId={equipementToUpdate.id}
                  urlWithoutEntityId={API_URIS.equipementApi}
                  onDelete={onDelete}
                  onClose={()=>{setOpenDelete(false)}}

                />
            }
          <Card className={classes.card}>
              <CardHeader classes={{ root: classes.cardHeader, title: classes.cardTitle }}
                title={
                  <Box display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faBullseye} size="1x"/>
                    <Typography className="ml-2" variant="h4">
                        <Translate contentKey="microgatewayApp.microstockEquipement.home.title">equipement</Translate>
                    </Typography>
                  </Box>
                }
                titleTypographyProps={{
                  variant: 'h4'
                }}
                action={
                  <IconButton title="Add" color="primary" onClick={() => handleUpdateEquipements(null)}>
                      <Add />
                  </IconButton>
                }/>
              <CardContent>
               <Table>
                   <TableHead>
                       <TableRow className={classes.theadRow}>
                       <TableCell align="left">
                                <Translate contentKey="microgatewayApp.microstockEquipement.nom">Nom</Translate>
                            </TableCell>
                           
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockEquipement.description">Descripition</Translate>
                            </TableCell>
                           
                          
                           <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockEquipement.dateAjout">dateAjout</Translate>
                            </TableCell>

                            <TableCell align="center">
                                <Translate contentKey="microgatewayApp.microstockEquipement.dateRemplacement">dateRemplacement</Translate>
                            </TableCell>

                            <TableCell align="center">
                            </TableCell>
                           
                           <TableCell align="center">Actions</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                    {equipements && equipements.length > 0 ? (
                        items
                     ) : (
                        !loading && (
                            <TableRow>
                                <TableCell align="center" colSpan={10}>
                                    <Translate contentKey="microgatewayApp.microstockEquipement.home.notFound">No equipement found</Translate>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                   </TableBody>
               </Table>
              </CardContent>
              {totalItems > 0 &&
                <CardActions className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={totalItems}
                    page={activePage}
                    onPageChange={handleChangePage}
                    rowsPerPage={itemsPerPage}
                    onChangeRowsPerPage={handleChangeItemsPerpage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelRowsPerPage={translate("_global.label.rowsPerPage")}
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
  )
};

export default Equipement;
