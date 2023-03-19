import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Button, ListItem, ListItemText } from "@material-ui/core";
import { API_URIS } from "app/shared/util/helpers";
import React from "react";
import TextContentManager from "app/shared/component/text-content-manager";
import { translate } from "react-jhipster";
import { Delete, Edit, ExpandLess, ExpandMore } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { IEquipement, defaultValue as defaultEquipement } from "app/shared/model/microstock/equipement.model";
import EquipementUpdate from "./equipement-update";
import EquipementChildren from "./equipement-children";
import { Table } from 'reactstrap';
import {  Collapse, IconButton, makeStyles, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { IChangement } from "app/shared/model/microstock/changement.model";

// const useStyles = makeStyles(theme =>({
//     card:{
//       boxShadow:'-1px -1px 7px',
//     },
//     cardHeader:{
//       background: theme.palette.background.paper,
//       color: theme.palette.primary.dark,
//     },
//     cardTitle:{
//       color: theme.palette.primary.dark
//     },
//     cardActions:{
//       paddingTop:0,
//       paddingBottom:0,
//     },
//     theadRow:{
//       backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
//       color: 'white',
//       '&>th':{
//         color: 'white',
//       }
//     },
//     pagination:{
//       padding:0,
//       color: theme.palette.primary.dark,
//     },
//     paginationInput:{
//         color: theme.palette.primary.dark,
//         width: theme.spacing(10),
//         borderColor:theme.palette.primary.dark,
//     },
//     paginationSelectIcon:{
//         color:theme.palette.primary.dark,
//     },
//   }))
  
const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },

   theadRow:{
    backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
    color: 'white',
    '&>th':{
      color: 'white',
    }
  },
}))

interface EquipementChildItemProps{
    equipement: IEquipement,
    parent: IEquipement,
    level:number, 
    onUpdate?: Function,
    onDelete?: Function 
}
export const EquipementChildItem = (props:EquipementChildItemProps) =>{
    const {level, parent} = props
    const [equipement, setEquipement] = useState({...props.equipement});
    const [showDescription, setShowdescription] = useState(false);

    const [subEquipements, setSubEquipements] = useState<IEquipement[]>([]);
    const [changement, setChangements] = useState<IChangement[]>([]);
    const [loadingChidldren, setLoadingChirlden] = useState(false);
    const [equipementToUpdate, setEquipementToUpdate] = useState<IEquipement>(defaultEquipement);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    
    const [openDelete, setOpenDelete] = useState(false);

    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const getSubsEquipements = () =>{
        if(equipement){
            setLoadingChirlden(true);
            axios.get<IEquipement[]>(`${API_URIS.equipementApi}/?composantDeId.equals=${equipement.id}`)
            .then(res => {
                setSubEquipements([...res.data]);
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingChirlden(false);
            });
        }else{
            setSubEquipements([])
        }
    }
    const getChangements = () =>{
        if(changement){
            setLoadingChirlden(true);
            axios.get<IChangement[]>(`${API_URIS.changementApi}/?equipementId.equals=${equipement.id}`)
            .then(res => {
                setChangements([...res.data]);
                console.log(res.data);  
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingChirlden(false);
            });
        }else{
            setChangements([])
        }
    }

    useEffect(() =>{
        setEquipement({...props.equipement});
        getSubsEquipements();
        getChangements();
    }, [props.equipement])


    const handlechildUpdate = (c?: IEquipement) =>{
        setEquipementToUpdate(c || {...defaultEquipement, composantDe: equipement});
        setOpenToUpdate(true);
    }

    const onChildSave = (saved?: IEquipement, isNew?: boolean) =>{
        console.log(saved);
        if(saved){
            if(isNew){
                setSubEquipements([...subEquipements, saved])
            }else{
                if(saved.id === equipement.id)
                    setEquipement(saved);
                else
                setSubEquipements([...subEquipements].map(c => c.id === saved.id ? saved : c));
            }
            setOpenToUpdate(false);
        }
    }


    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            if(deletedId === equipement.id){
                if(props.onDelete)
                    props.onDelete(deletedId);
            }else{
                setSubEquipements([...subEquipements].filter(c => c.id !== deletedId));
            }
           setOpenDelete(false);
        }
    }

    const onChildDelete = (deletedId) =>{
        if(deletedId){
            setSubEquipements([...subEquipements].filter(c => c.id !== deletedId));
        }
    }

    const handleDelete = () =>{
        setOpenDelete(true);
    }

 
    return (
    <React.Fragment>
        {changement && <>
            <EquipementUpdate 
                equipement={equipementToUpdate}
                open={openToUpdate}
                onSave={onChildSave}
                onClose={() => setOpenToUpdate(false)}
            />
            {openDelete && 
                <EntityDeleterModal
                    open={openDelete}
                    entityId={equipement.id}
                    urlWithoutEntityId={API_URIS.equipementApi}
                    onDelete={onDelete}
                    onClose={() => setOpenDelete(false)}
                    question={translate("microgatewayApp.equipement.delete.question", {id: equipement.nom})}
                />
            }
            <ListItem style={{ width: '100%'}}>
                <Box width={1} overflow="auto" boxShadow={2 + level}>
                    <Box width={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            {(subEquipements && subEquipements.length !==0) &&
                                <IconButton
                                    className="p-0"
                                    color="primary"
                                    size="small"
                                    onClick={() => setOpen(!open)}>
                                    {open ? <ExpandLess /> : <ExpandMore /> }
                                </IconButton>
                            }
                            <ListItemText
                                primary={<Typography variant="h6" className="ml-3" color="primary"> {translate('microgatewayApp.equipement.nom')}</Typography>}
                                secondary={<Typography variant="h6" className="ml-3" color="secondary">{equipement.nom}</Typography>}
                                // primary={
                                //     <>
                                //         {equipement.description &&
                                //         <Button color="primary" variant="text"
                                //              className="text-capitalize p-0 ml-4"
                                //              onClick={() => setShowdescription(true)}
                                //              size="small">
                                            
                                //             {translate('microgatewayApp.equipement.description')}&nbsp;&nbsp;
                                //             {/* <FontAwesomeIcon icon={faEye} size="xs" className="text-primary" /> */}
                                //         </Button>}
                                //     </>
                                // }
                             />
                        
                               
                             <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.equipement.description')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{equipement.description}</Typography>}
                             />
                             <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.equipement.dateAjout')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{equipement.dateAjout}</Typography>}
                             />
                             <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.equipement.dateRemplacement')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{equipement.dateRemplacement}</Typography>}
                             />
                            
                        </Box>
                        <Box display="flex" alignItems="center" flexWrap="wrap" className="ml-3">
                        
                            {/* {hasPrivileges({ entities: ['Equipement'] , actions: [PrivilegeAction.CREATE]}) && 
                            <IconButton aria-label="add" 
                                onClick={() => {handlechildUpdate(null)}}
                                color="primary" className="ml-3">
                                <Add style={{ fontSize: 30 }} />
                            </IconButton>
                            } */}
                            
                            <Button color="primary" variant="text"
                                             className="text-capitalize p-0 ml-4"
                                             onClick={() => setShowdescription(true)}
                                             size="small">
                                            <FontAwesomeIcon icon={faEye} size="lg" className="text-primary" />
                                        </Button>

                            {hasPrivileges({ entities: ['Equipement'] , actions: [PrivilegeAction.UPDATE]}) && 
                                <IconButton color="primary" onClick={() => handlechildUpdate(equipement)}>
                                    <Edit />
                                </IconButton>
                            }
                            {(hasPrivileges({ entities: ['Equipement'] , actions: [PrivilegeAction.DELETE]}) 
                                && (!loadingChidldren && (!subEquipements || subEquipements.length ===0)))&&
                                <IconButton color="secondary" className="ml-2" onClick={handleDelete}>
                                    <Delete />
                                </IconButton>
                            }
                        </Box>
                    </Box>
                    {subEquipements && subEquipements.length  !== 0 &&
                        <Collapse 
                            in={open}
                            timeout={300}
                            unmountOnExit
                            >
                                <EquipementChildren 
                                    level={level + 1}
                                    equipement={equipement}
                                    equipements={[...subEquipements]}
                                    onDelete={onChildDelete}
                                    onUpdate={handlechildUpdate}
                                />
                        </Collapse>
                    }
                </Box>
            </ListItem>
            </>
        }
    </React.Fragment>
    )
}

export default EquipementChildItem;