import { IQCategory,defaultValue as defaultQCategory} from "app/shared/model/qmanager/q-category.model";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Button, Collapse, IconButton, ListItem, ListItemText, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { API_URIS } from "app/shared/util/helpers";
import { IQuery } from "app/shared/model/qmanager/query.model";
import React from "react";
import TextContentManager from "app/shared/component/text-content-manager";
import { translate } from "react-jhipster";
import { Add, Delete, Edit, ExpandLess, ExpandMore, QueryBuilder, Visibility } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import QCategoryUpdate from "../q-category-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import QCategoryChildren from "./q-category-children";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },
}))

interface QCategoryChildItemProps{
    category: IQCategory,
    level:number, 
    onUpdate?: Function,
    onDelete?: Function 
}
export const QCategoryChildItem = (props:QCategoryChildItemProps) =>{
    const {level } = props
    const [category, setCategory] = useState({...props.category});
    const [showDescription, setShowdescription] = useState(false);

    const [subCats, setSubCats] = useState<IQCategory[]>([]);
    const [loadingChidldren, setLoadingChirlden] = useState(false);

    const [queriesSize, setQueriesSize] = useState(0);
    const [loadingQueries, setLoadingQueries] = useState(false);

    const [catToUpdate, setCatToUpdate] = useState<IQCategory>(defaultQCategory);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    
    const [openDelete, setOpenDelete] = useState(false);

    const [open, setOpen] = useState(false);

    const history = useHistory();

    const classes = useStyles();

    const getSubsCats = () =>{
        if(category){
            setLoadingChirlden(true);
            axios.get<IQCategory[]>(`${API_URIS.queryCategoryApiUri}/?parentId.equals=${category.id}`)
            .then(res => {
              setSubCats([...res.data]);
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingChirlden(false);
            });
        }else{
            setSubCats([])
        }
    }
    
    const countQueries = () =>{
        if(category){
            setLoadingQueries(true);
            axios.get<IQuery[]>(`${API_URIS.queryApiUri}/?categoryId.equals=${category.id}&page=${0}&size=${1}`)
            .then(res => {
              setQueriesSize(parseInt(res.headers['x-total-count'], 10));
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingQueries(false);
            });
        }
    }

    useEffect(() =>{
        setCategory({...props.category});
        getSubsCats();
        countQueries();
    }, [props.category])


    const handlechildUpdate = (c?: IQCategory) =>{
        setCatToUpdate(c || {...defaultQCategory, parent: category});
        setOpenToUpdate(true);
    }

    const onChildSave = (saved?: IQCategory, isNew?: boolean) =>{
        console.log(saved);
        if(saved){
            if(isNew){
                setSubCats([...subCats, saved])
            }else{
                if(saved.id === category.id)
                    setCategory(saved);
                else
                setSubCats([...subCats].map(c => c.id === saved.id ? saved : c));
            }
            setOpenToUpdate(false);
        }
    }


    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            if(deletedId === category.id){
                if(props.onDelete)
                    props.onDelete(deletedId);
            }else{
                setSubCats([...subCats].filter(c => c.id !== deletedId));
            }
           setOpenDelete(false);
        }
    }

    const onChildDelete = (deletedId) =>{
        if(deletedId){
            setSubCats([...subCats].filter(c => c.id !== deletedId));
        }
    }

    const handleDelete = () =>{
        setOpenDelete(true);
    }

    const viewQueries = () =>{
        if(category)
            history.push(`/query/category/${category.id}`)
    }


    return (
    <React.Fragment>
        {category && <>
            {category.description && 
            <TextContentManager
                title={translate('microgatewayApp.qmanagerQCategory.description')} 
                value={category.description}
                readonly
                open={showDescription}
                onClose={() => setShowdescription(false)}
            />}
            <QCategoryUpdate 
                category={catToUpdate}
                open={openToUpdate}
                onSave={onChildSave}
                onClose={() => setOpenToUpdate(false)}
            />
            {openDelete && 
                <EntityDeleterModal
                    open={openDelete}
                    entityId={category.id}
                    urlWithoutEntityId={API_URIS.queryCategoryApiUri}
                    onDelete={onDelete}
                    onClose={() => setOpenDelete(false)}
                    question={translate("microgatewayApp.qmanagerQCategory.delete.question", {id: category.name})}
                />
            }
            <ListItem style={{ width: '100%'}}>
                <Box width={1} overflow="auto" boxShadow={2 + level}>
                    <Box width={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            {(subCats && subCats.length !==0) &&
                                <IconButton
                                    className="p-0"
                                    color="primary"
                                    size="small"
                                    onClick={() => setOpen(!open)}>
                                    {open ? <ExpandLess /> : <ExpandMore /> }
                                </IconButton>
                            }
                            <ListItemText
                                primary={<Typography variant="h5" className="ml-3">{category.name}</Typography>}
                                secondary={
                                    <>
                                        {category.description &&
                                        <Button color="primary" variant="text"
                                             className="text-capitalize p-0 ml-4"
                                             onClick={() => setShowdescription(true)}
                                             size="small">
                                            {translate('microgatewayApp.qmanagerQCategory.description')}&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faEye} size="xs" className="text-primary" />
                                        </Button>}
                                    </>
                                }
                             />
                            
                        </Box>
                        <Box display="flex" alignItems="center" flexWrap="wrap" className="ml-3">
                            <Tooltip 
                                color="primary"
                                title={translate('microgatewayApp.qmanagerQuery.home.title')}>
                                <IconButton onClick={viewQueries}>
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                            <IconButton aria-label="add" 
                                onClick={() => {handlechildUpdate(null)}}
                                color="primary" className="ml-3">
                                <Add style={{ fontSize: 30 }} />
                            </IconButton>
                            }
                            {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.UPDATE]}) && 
                                <IconButton color="primary" onClick={() => handlechildUpdate(category)}>
                                    <Edit />
                                </IconButton>
                            }
                            {(hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.DELETE]}) 
                                && (!loadingChidldren && (!subCats || subCats.length ===0)) && (!loadingQueries && !queriesSize)) &&
                                <IconButton color="secondary" className="ml-2" onClick={handleDelete}>
                                    <Delete />
                                </IconButton>
                            }
                        </Box>
                    </Box>
                    {subCats && subCats.length  !== 0 &&
                        <Collapse 
                            in={open}
                            timeout={300}
                            unmountOnExit
                            >
                                <QCategoryChildren 
                                    level={level + 1}
                                    parent={category}
                                    subCats={[...subCats]}
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

export default QCategoryChildItem;