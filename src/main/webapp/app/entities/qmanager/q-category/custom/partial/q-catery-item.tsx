import { Box, CircularProgress, Collapse, IconButton, makeStyles, TableCell, TableRow, Typography } from "@material-ui/core";
import { Add, Delete, Edit, ExpandLess, ExpandMore, QueryBuilder, Visibility } from "@material-ui/icons";
import { hasPrivileges } from "app/shared/auth/helper";
import TextContentManager from "app/shared/component/text-content-manager";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { IQCategory,defaultValue as defaultQCategory } from "app/shared/model/qmanager/q-category.model";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { IQuery } from "app/shared/model/qmanager/query.model";
import QCategoryUpdate from "../q-category-update";
import QCategoryChildren from "./q-category-children";
import { useHistory } from "react-router";

const useStyles = makeStyles(theme =>({
  truncate:{
    maxWidth: 100,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: 'ellipsis',
 },
}))

export interface QCategoryItemProps{
    category: IQCategory,
    onUpdate?: Function,
    onDelete?: Function,
}

export const QCategoryItem = (props: QCategoryItemProps) =>{
    const { category } = props;

    const [openDescription, setOpenDescription] = useState(false);

    const [children, setChildren] = useState<IQCategory[]>([]);
    const [loadingChidldren, setLoadingChirlden] = useState(false);

    const [queriesSize, setQueriesSize] = useState(0);
    const [laoadingQueries, setLoadingQueriels] = useState(false);

    const [openAddSubCat, setOpenAddSubCat] = useState(false);
    const [displayChildren, setDisplayChidlren] = useState(false);

    const history = useHistory();
    
    const classes = useStyles();

    const getChildren = () =>{
        if(category){
            setLoadingChirlden(true);
            axios.get<IQCategory[]>(`${API_URIS.queryCategoryApiUri}/?parentId.equals=${category.id}`)
            .then(res => {
                setChildren([...res.data])
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingChirlden(false);
            });
        }else{
            setChildren([]);
        }
    }

    const countQueries = () =>{
        if(category){
            setLoadingQueriels(true);
            axios.get<IQuery[]>(`${API_URIS.queryApiUri}/?categoryId.equals=${category.id}&page=${0}&size=${1}`)
            .then(res => {
              setQueriesSize(parseInt(res.headers['x-total-count'], 10));
            }).catch((e) =>{
              console.log(e);
            }).finally(() =>{
                setLoadingQueriels(false);
            });
        }
    }

    useEffect(() =>{
        getChildren();
        countQueries();
    }, [props.category])

    const handleUpdate = () =>{
        if(props.onUpdate)
            props.onUpdate(category);
    }

    const handleDelete = () =>{
        if(props.onDelete)
            props.onDelete(category);
    }
    
    const onSave = (saved?: IQCategory, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setChildren([...children, saved])
            else
                setChildren([...children].map(c => c.id === saved.id ? saved : c));
            setOpenAddSubCat(false);
        }
    }

    const onChildDelete = (deletedId?: any) =>{
        console.log("chdeid", deletedId)
        if(deletedId){
            setChildren([...children].filter(c => c.id !== deletedId));
        }
    }
    
    const onChildSave = (saved?: IQCategory, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setChildren([...children, saved])
            else
                setChildren([...children].map(c => c.id === saved.id ? saved : c));
            setOpenAddSubCat(false);
        }
    }

    const viewQueries = () =>{
        if(category)
            history.push(`/query/category/${category.id}`)
    }

    return (
    <React.Fragment>
        {category && <>
            <QCategoryUpdate 
                category={{...defaultQCategory, parent: category}}
                open={openAddSubCat}
                onSave={onSave}
                onClose={() => setOpenAddSubCat(false)}
            />
            {category.description && 
            <TextContentManager
                title={translate('microgatewayApp.qmanagerQCategory.description')} 
                value={category.description}
                readonly
                open={openDescription}
                onClose={() => setOpenDescription(false)}
            />}
            <TableRow>
                <TableCell align="left" style={{ width:30 }}>
                    <IconButton
                        className="p-0"
                        color="primary"
                        size="small"
                        disabled={(!children || children.length ===0 )}
                        onClick={() => setDisplayChidlren(!displayChildren)}>
                        {displayChildren ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>
                </TableCell>
                <TableCell align="left">{category.name}</TableCell>
                <TableCell align="center">
                    {category.description && 
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                            <Typography className={classes.truncate}>
                                {category.description}
                            </Typography>
                            <IconButton
                             className="p-0 ml-1"
                             color="primary"
                             onClick={() => setOpenDescription(true)}>
                                <Visibility />
                            </IconButton>
                        </Box>
                    }
                </TableCell>
                <TableCell align="center">
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                            {laoadingQueries && 
                                <CircularProgress 
                                    color="primary" 
                                    style={{ width: 15, height:15}}
                                    className="mr-3" />}
                            {queriesSize !==0 && <Typography className="ml-3 mr-3">{queriesSize}</Typography> }
                            <IconButton
                             className="p-0"
                             color="primary"
                             onClick={viewQueries}>
                                <Visibility />
                            </IconButton>
                        </Box>
                </TableCell>
                <TableCell align="center">
                    <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                        {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                        <IconButton aria-label="add" 
                            onClick={() => setOpenAddSubCat(true)}
                            color="primary">
                            <Add style={{ fontSize: 30 }} />
                        </IconButton>
                        }
                        {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.UPDATE]}) && 
                            <IconButton color="primary" onClick={handleUpdate}>
                                <Edit />
                            </IconButton>
                        }
                        {(hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.DELETE]}) 
                            && (!loadingChidldren && (!children || children.length ===0)) && (!laoadingQueries && !queriesSize)) &&
                            <IconButton color="secondary" onClick={handleDelete}>
                                <Delete />
                            </IconButton>
                        }
                    </Box>
                </TableCell>
            </TableRow>
            {category && children && children.length !== 0 && <TableRow>
                <TableCell colSpan={20} className="p-0 m-0 border-0">
                    <Collapse 
                        in={displayChildren}
                        timeout={300}
                        unmountOnExit
                        >
                        <QCategoryChildren 
                            parent={category} 
                            level={1} 
                            subCats={[...children]}
                            onUpdate={onChildSave}
                            onDelete={onChildDelete} />
                    </Collapse>
                </TableCell>
            </TableRow>}
        </>}
    </React.Fragment>
    );
}
