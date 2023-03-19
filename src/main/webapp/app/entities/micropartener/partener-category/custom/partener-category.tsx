import { Box, Card, CardContent, CardHeader, Collapse, colors, Grid, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { translate } from "react-jhipster";
import { Add, AddBox, IndeterminateCheckBox } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCubes, faEdit, faHandshake, faMinusCircle, faPlusCircle, faUserCheck, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { TreeItem, TreeView } from "@material-ui/lab";
import clsx from "clsx";
import {useSpring, animated}  from '@react-spring/web';
import { IPartener } from "app/shared/model/micropartener/partener.model";
import PartenerCategoryUpdate from "app/entities/micropartener/partener-category/custom/partener-category-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import Field from "../../field/custom/field";
import { Helmet } from 'react-helmet';
import { useHistory } from "react-router-dom";
import PartenerCategoryEvaluator from "app/entities/micropartener/partener-category-evaluator/custom/partener-category-evaluator";
import EvaluationCriteria from "../../evaluation-criteria/custom/evaluation-criteria";
import PartenerCategoryValidator from "../../partener-category-validator/custom/partener-category-validator";
import { AUTHORITIES } from "app/config/constants";


const useStyles = makeStyles(theme =>({
    root:{
        display: 'transparent',
        borderRadius: '15px',
        boxShadow: '-1px -1px 7px',
    },
    card:{
    },
    cardheader:{
        background: theme.palette.background.paper,
        paddingTop:3,
        paddingBottom:3,
        color: theme.palette.primary.dark,
    },
    cardContent:{

    },
    treeveiw: {
        width: '100%',
    },
    treeItem:{
        marginLeft: 7,
    },
    parentTreeItem:{
    },
    noPrentTreeItem:{
    },
    treeGroup:{
        borderLeft: '1px dashed',
    },
    treeLabel:{
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: '0 35px 35px 0',
        marginBottom: theme.spacing(1),
        background: 'blue',
    },
    treeLabelParent:{
        background: colors.lightBlue[100],
    },
    treeLabelChild:{
        background: colors.cyan[100],
    },
    treeSelected:{
    },
    catergoryListItem:{
        width: '100%',
    },
}))

const TransitionComponent = (props) =>{
    const style = useSpring({
      from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
      to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });
  
    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  }

const CategoryTreeItem = (props: {category: IPartenerCategory,
         onOpenEvaluators: Function, 
        openEvaluationCriteria: Function, 
        onDelete?: Function,
        onOpenValidators?: Function
    }) =>{
    const [category, setCategory] = useState(props.category);
    const [children, setChildren] = useState<IPartenerCategory[]>([]);
    const [categoryToUpdate, setCategoryToUpdate] = useState<IPartenerCategory>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [partenersSize, setPartenerSize] = useState(0);
    const [openFields, setOpenFields] = useState(false);
    const classes = useStyles();

    const history = useHistory();

    const getChildren = () =>{
        if(parent){
            setLoading(true);
            axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}/?parentId.equals=${category.id}`)
                .then(res =>{
                    if(res.data)
                        setChildren([...res.data]);
                }).catch(e => console.log(e))
                .finally(() =>setLoading(false))
        }
    }

    const countParteners = () =>{
        setLoading(true)
        axios.get<IPartener>(`${API_URIS.partenerApiUri}/?categoryId.equals=${category.id}&page=${0}&size=${0}`)
            .then(res =>{
                if(res.data)
                    setPartenerSize(parseInt(res.headers['x-total-count'],10));
            }).catch(e => console.log(e)).finally(() => setLoading(false))
    }

    useEffect(() =>{
        setCategory(props.category);
        getChildren();
        countParteners();
    }, [props.category])

    const handleUpdate = (cat: IPartenerCategory) =>{
        setCategoryToUpdate({...cat,
             parent: cat.id !== category.id ? category: cat.parent,
             role: cat.id !== category.id ? category.role : cat.role
        });
        setOpen(true);
    }
    

    const handleSave = (saved?: IPartenerCategory, isNew?: boolean) =>{
         if(saved){
            if(isNew){
                setChildren([...children, saved]);
            }
            else{
                setCategory(saved);
                setCategoryToUpdate(saved);
            }
         }
         setOpen(false);
    }

    const handleClose = () => setOpen(false);

    const handleDelete = (deletedId?: number) =>{
        if(deletedId){
            setChildren(children.filter(c => c.id !== deletedId));
        }
    }

    const handleOpenEvaluators = (cat?:IPartenerCategory) => {
        if(props.onOpenEvaluators)
            props.onOpenEvaluators(cat || category);
    }

    const handleOpenValidators = (cat?:IPartenerCategory) => {
        if(props.onOpenValidators)
            props.onOpenValidators(cat || category);
    }
    
    const handleOpenEvaluationCriteria = (cat?:IPartenerCategory) => {
        if(props.openEvaluationCriteria)
            props.openEvaluationCriteria(cat || category);
    }

    const TreeItemLabel = () =>{
        return (
        <React.Fragment>
            <Helmet>
                <title>{`C'perf | ${translate("microgatewayApp.micropartenerPartener.home.title")}`}</title>
            </Helmet>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Typography variant="h4" className="">{category.name}</Typography>
                </Grid>
                {loading && <Grid item xs>
                    <Typography variant="h5" className="text-capitalize">Loading...</Typography>
                </Grid>}
                <Grid item xs>
                    <Box width={1} m={0} p={0} display="flex" justifyContent="flex-end" flexWrap="wrap">
                            <Tooltip title={translate("entity.action.edit")} placement="left">
                                <IconButton color="primary" onClick={() => handleUpdate(category)}>
                                        <FontAwesomeIcon icon={faEdit} size="sm"/>
                                    </IconButton>
                            </Tooltip>
                            <Tooltip title={translate("_global.label.add")} placement="left">
                                <IconButton 
                                    style={{ color: colors.lightGreen[700],}}
                                    onClick={() => handleUpdate({})}
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} size="sm"/>
                                </IconButton>
                            </Tooltip>
                            {category && category.role === AUTHORITIES.PROVIDER && <>
                                <Tooltip title={translate("_global.label.evaluator")+'s'} placement="left">
                                    <IconButton 
                                        style={{ color: colors.cyan[700],}}
                                        onClick={() =>handleOpenEvaluators()}
                                    >
                                        <FontAwesomeIcon icon={faUserCheck} size="sm"/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={translate("_global.label.validator")+'s'} placement="left">
                                    <IconButton 
                                        style={{ color: colors.teal[700],}}
                                        onClick={() =>handleOpenValidators()}
                                    >
                                        <FontAwesomeIcon icon={faUserShield} size="sm"/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={translate("microgatewayApp.micropartenerEvaluationCriteria.home.title")} placement="left">
                                    <IconButton 
                                        style={{ color: colors.deepPurple[700],}}
                                        onClick={() =>handleOpenEvaluationCriteria()}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} size="sm"/>
                                    </IconButton>
                                </Tooltip>
                            </>}
                            {!children || children.length <= 0  &&
                                <>
                                <Tooltip title={translate("microgatewayApp.micropartenerField.home.title")}
                                    placement="left">
                                    <IconButton 
                                         style={{ color: colors.purple.A100}}
                                         onClick={() => setOpenFields(true)}
                                    >
                                        <FontAwesomeIcon icon={faCubes} size="sm" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={translate("microgatewayApp.micropartenerPartener.home.title")}
                                    placement="bottom">
                                    <IconButton 
                                        onClick={() =>history.push(`/partener/category/${category.id}`)}
                                         style={{ color: colors.blueGrey[900]}}
                                    >
                                        <FontAwesomeIcon icon={faHandshake} size="sm" />
                                    </IconButton>
                                </Tooltip>
                                {partenersSize <=0 &&
                                    <Tooltip title={translate("entity.action.delete")} placement="left">
                                        <IconButton color="secondary" onClick={()=>{
                                            setCategoryToUpdate(category);
                                            setOpenDeleteModal(true);
                                        }}>
                                            <FontAwesomeIcon icon={faMinusCircle} size="sm"/>
                                        </IconButton>
                                    </Tooltip>
                                }
                                </>
                            }
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {category && 
            <EntityDeleterModal
                entityId={category.id}
                open={openDeleteModal}
                urlWithoutEntityId={API_URIS.partenerCategoryApiUri}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={(deletedId) =>{
                    setOpenDeleteModal(false);
                    if(props.onDelete)
                        props.onDelete(deletedId);
                }}
                question={translate("microgatewayApp.micropartenerPartenerCategory.delete.question", {id: ""})}
             />
            }
            <PartenerCategoryUpdate 
                open={open}
                category={categoryToUpdate}
                onClose={handleClose}
                onSave={handleSave}
            />
            <Field 
                open={openFields}
                category={category}
                onClose={() => setOpenFields(false)}
            />
            <TreeItem 
                nodeId={`${category.id}`}
                label={<TreeItemLabel />}
                className={clsx(classes.treeItem, {
                    [classes.parentTreeItem] : children && children.length !== 0,
                    [classes.noPrentTreeItem] : !children || children.length <= 0
                })}
                classes={{ 
                    group: classes.treeGroup, 
                    label: clsx(classes.treeLabel, {
                        [classes.treeLabelParent] : children && children.length !== 0,
                        [classes.treeLabelChild] : !children || children.length <= 0
                    }), 
                 }}
                 TransitionComponent={TransitionComponent}
                 onLabelClick={(e) => e.preventDefault()}
                >
                {children && children.map(c => <CategoryTreeItem  key={c.id} category={c}
                                            onDelete={handleDelete} 
                                            onOpenEvaluators={handleOpenEvaluators}
                                            openEvaluationCriteria={handleOpenEvaluationCriteria}
                                            onOpenValidators={handleOpenValidators}/>
                                        )}
            </TreeItem>
        </React.Fragment>
    )
}


export const PartenerCategory = (props) =>{
    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const [cats,setCats] = useState<IPartenerCategory[]>([]);

    const [category, setCategory] = useState<IPartenerCategory>(null);

    const [open, setOpen] = useState(false);

    const [openEvaluators, setOpenEvaluators] = useState(false);

    const [openValidators, setOpenValidators] = useState(false);

    const [openEvaluationCriteria, setOpenEvaluationCriteria] = useState(false);

    const getCategories = () =>{
        setLoading(true)
        axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}/?parentId.specified=false`)
            .then(res =>{
                if(res.data)
                setCats([...res.data])
            }).catch(e => console.log(e)).finally(() =>setLoading(false))
    }

    useEffect(() =>{
        getCategories();
    }, [])

    const handleUpdate = (cat: IPartenerCategory) =>{
        setCategory(cat);
        setOpen(true);
    }

    const handleOpenEvaluators = (cat: IPartenerCategory) =>{
        if(cat && cat.id){
            setCategory(cat);
            setOpenEvaluators(true);
        }
    } 
    
    const handleOpenValidators = (cat: IPartenerCategory) =>{
        if(cat && cat.id){
            setCategory(cat);
            setOpenValidators(true);
        }
    }

    const handleOpenEvaluationCriterias = (cat: IPartenerCategory) =>{
        if(cat && cat.id){
            setCategory(cat);
            setOpenEvaluationCriteria(true);
        }
    }

    const handleSave = (saved?: IPartenerCategory, isNew?: boolean) =>{
         if(saved){
            setCategory(saved);
            if(isNew)
                setCats([...cats, saved]);
            else
                setCats(cats.map(c => c.id === saved.id ? saved : c));
         }
         setOpen(false);
    }

    const handleClose = () => setOpen(false);

    const handleDelete = (deletedId?: number) =>{
        if(deletedId)
            setCats(cats.filter(c => c.id !== deletedId))
    }

    return (
        <React.Fragment>
            <PartenerCategoryUpdate 
                open={open}
                category={category}
                onClose={handleClose}
                onSave={handleSave}
            />
            {category && <>
                <PartenerCategoryEvaluator open={openEvaluators} category={category} onClose={() => setOpenEvaluators(false)}/>
                <EvaluationCriteria open={openEvaluationCriteria} category={category} onClose={() => setOpenEvaluationCriteria(false)}/> 
                <PartenerCategoryValidator open={openValidators} category={category} onClose={() => setOpenValidators(false)}/>
            </>  }
            <Box width={1} overflow="auto" className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <FontAwesomeIcon icon={faCubes} size="2x"/>
                        }
                        title={translate("microgatewayApp.micropartenerPartenerCategory.home.title")}
                        titleTypographyProps={{
                            variant: 'h4'
                        }}
                        action={<IconButton color="inherit"
                            title={translate("_global.label.add")}
                            onClick={() => handleUpdate({})}>
                            <Add fontSize="large"/>
                        </IconButton>}
                        className={classes.cardheader}
                     />
                     <CardContent className={classes.cardContent}>
                            <Box width={1} display="flex" justifyContent="center" flexWrap="wrap" overflow="auto">
                                {loading ? (
                                    <Typography variant="h4" color="secondary">Loading...</Typography>
                                ):(
                                    cats && cats.length !== 0 ? (
                                    <Box width={1} display="flex" flexWrap="wrap" flexGrow={1} overflow="hidden">
                                        <Grid container spacing={3} justify="center" alignItems="flex-start">
                                            {
                                                cats.map(c => <Grid key={c.id} item xs={12}>
                                                        <TreeView
                                                            className={classes.treeveiw}
                                                            defaultCollapseIcon={<IndeterminateCheckBox />}
                                                            defaultExpandIcon={<AddBox />}
                                                            multiSelect
                                                            >
                                                            <CategoryTreeItem 
                                                                category={c} onDelete={handleDelete} 
                                                                onOpenEvaluators={handleOpenEvaluators}
                                                                openEvaluationCriteria={handleOpenEvaluationCriterias}
                                                                onOpenValidators={handleOpenValidators}
                                                                />
                                                        </TreeView>
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                     </Box>
                                    ):(
                                        <Typography variant="h4" color="primary">
                                            {translate("microgatewayApp.micropartenerPartenerCategory.home.notFound")}
                                        </Typography>
                                    )
                                )}
                            </Box>
                     </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default PartenerCategory;