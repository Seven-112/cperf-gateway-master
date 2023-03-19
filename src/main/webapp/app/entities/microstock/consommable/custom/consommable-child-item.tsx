import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Collapse, IconButton, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { API_URIS } from "app/shared/util/helpers";
import React from "react";
import TextContentManager from "app/shared/component/text-content-manager";
import { translate } from "react-jhipster";
import { Delete, Edit, ExpandLess, ExpandMore } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { IConsommable, defaultValue as defaultConsommable } from "app/shared/model/microstock/consommable.model";
import ConsommableUpdate from "./consommable-update";
import ConsommableChildren from "./consommable-children";

const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },
}))

interface ConsommableChildItemProps{
    consommable: IConsommable,
    parent: IConsommable,
    level:number, 
    onUpdate?: Function,
    onDelete?: Function 
}
export const ConsommableChildItem = (props:ConsommableChildItemProps) =>{
    const {level, parent} = props
    const [consommable, setConsommable] = useState({...props.consommable});
    const [showDescription, setShowdescription] = useState(false);

    const [subConsommables, setSubConsommables] = useState<IConsommable[]>([]);
    const [loadingChidldren, setLoadingChirlden] = useState(false);
    const [consommableToUpdate, setConsommableToUpdateToUpdate] = useState<IConsommable>(defaultConsommable);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    
    const [openDelete, setOpenDelete] = useState(false);

    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const getSubsConsommables = () =>{
        if(consommable){
            setLoadingChirlden(true);
            axios.get<IConsommable[]>(`${API_URIS.consommableApi}/?composantDeId.equals=${consommable.id}`)
            .then(res => {
                setSubConsommables([...res.data]);
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingChirlden(false);
            });
        }else{
            setSubConsommables([])
        }
    }

    useEffect(() =>{
        setConsommable({...props.consommable});
        getSubsConsommables();
    }, [props.consommable])


    const handlechildUpdate = (c?: IConsommable) =>{
        setConsommableToUpdateToUpdate(c || {...defaultConsommable, composantDe: consommable});
        setOpenToUpdate(true);
    }

    const onChildSave = (saved?: IConsommable, isNew?: boolean) =>{
        console.log(saved);
        if(saved){
            if(isNew){
                setSubConsommables([...subConsommables, saved])
            }else{
                if(saved.id === consommable.id)
                    setConsommable(saved);
                else
                setSubConsommables([...subConsommables].map(c => c.id === saved.id ? saved : c));
            }
            setOpenToUpdate(false);
        }
    }


    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            if(deletedId === consommable.id){
                if(props.onDelete)
                    props.onDelete(deletedId);
            }else{
                setSubConsommables([...subConsommables].filter(c => c.id !== deletedId));
            }
           setOpenDelete(false);
        }
    }

    const onChildDelete = (deletedId) =>{
        if(deletedId){
            setSubConsommables([...subConsommables].filter(c => c.id !== deletedId));
        }
    }

    const handleDelete = () =>{
        setOpenDelete(true);
    }

 
    return (
    <React.Fragment>
        {consommable && <>
            {consommable.dateAjout && 
            <TextContentManager
                title={translate('microgatewayApp.microstockConsommable.dateAjout')} 
                value={consommable.dateAjout}
                readonly
                open={showDescription}
                onClose={() => setShowdescription(false)}
            />}
            <ConsommableUpdate 
                consommable={consommableToUpdate}
                open={openToUpdate}
                onSave={onChildSave}
                onClose={() => setOpenToUpdate(false)}
            />
            {openDelete && 
                <EntityDeleterModal
                    open={openDelete}
                    entityId={consommable.id}
                    urlWithoutEntityId={API_URIS.consommableApi}
                    onDelete={onDelete}
                    onClose={() => setOpenDelete(false)}
                    question={translate("microgatewayApp.microstockConsommable.delete.question", {id: consommable.nom})}
                />
            }
            <ListItem style={{ width: '100%'}}>
                <Box width={1} overflow="auto" boxShadow={2 + level}>
                    <Box width={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            {(subConsommables && subConsommables.length !==0) &&
                                <IconButton
                                    className="p-0"
                                    color="primary"
                                    size="small"
                                    onClick={() => setOpen(!open)}>
                                    {open ? <ExpandLess /> : <ExpandMore /> }
                                </IconButton>
                            }
                            {/* <ListItemText
                                primary={<Typography variant="h5" className="ml-3">{consommable.nom}</Typography>}
                                secondary={
                                    <>
                                        {consommable.dateAjout &&
                                        <Button color="primary" variant="text"
                                             className="text-capitalize p-0 ml-4"
                                             onClick={() => setShowdescription(true)}
                                             size="small">
                                                
                                            <label>Infos</label><FontAwesomeIcon icon={faEye} size="sm" className="text-primary" />
                                        </Button>}
                                    </>
                                }
                             /> */}
                             <ListItemText
                                primary={<Typography variant="h6" className="ml-3" color="primary"> {translate('microgatewayApp.microstockConsommable.nom')}</Typography>}
                                secondary={<Typography variant="h6" className="ml-3" color="secondary">{consommable.nom}</Typography>}
                           />
                            <ListItemText
                                primary={<Typography variant="h6" className="ml-3" color="primary"> {translate('microgatewayApp.microstockConsommable.quantite')}</Typography>}
                                secondary={<Typography variant="h6" className="ml-3" color="secondary">{consommable.quantite}</Typography>}
                           />
                                
                            <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.microstockConsommable.description')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{consommable.description}</Typography>}
                             />
                             <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.microstockConsommable.dateAjout')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{consommable.dateAjout}</Typography>}
                             />
                             <ListItemText
                                 primary={<Typography variant="h6" className="ml-3" color="primary">{translate('microgatewayApp.microstockConsommable.dateRemplacement')}</Typography>}
                                 secondary={<Typography variant="h6" className="ml-3" color="secondary">{consommable.dateRemplacement}</Typography>}
                             />
                            
                        </Box>
                        <Box display="flex" alignItems="center" flexWrap="wrap" className="ml-3">
                        
                            {/* {hasPrivileges({ entities: ['Consommable'] , actions: [PrivilegeAction.CREATE]}) && 
                            <IconButton aria-label="add" 
                                onClick={() => {handlechildUpdate(null)}}
                                color="primary" className="ml-3">
                                <Add style={{ fontSize: 30 }} />
                            </IconButton>
                            } */}
                            {hasPrivileges({ entities: ['Consommable'] , actions: [PrivilegeAction.UPDATE]}) && 
                                <IconButton color="primary" onClick={() => handlechildUpdate(consommable)}>
                                    <Edit />
                                </IconButton>
                            }
                            {(hasPrivileges({ entities: ['Consommable'] , actions: [PrivilegeAction.DELETE]}) 
                                && (!loadingChidldren && (!subConsommables || subConsommables.length ===0)))&&
                                <IconButton color="secondary" className="ml-2" onClick={handleDelete}>
                                    <Delete />
                                </IconButton>
                            }
                        </Box>
                    </Box>
                    {subConsommables && subConsommables.length  !== 0 &&
                        <Collapse 
                            in={open}
                            timeout={300}
                            unmountOnExit
                            >
                                <ConsommableChildren 
                                    level={level + 1}
                                    consommable={consommable}
                                    consommables={[...subConsommables]}
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

export default ConsommableChildItem;