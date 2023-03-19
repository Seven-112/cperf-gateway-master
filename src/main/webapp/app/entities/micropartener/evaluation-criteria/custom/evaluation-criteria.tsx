import { faAdjust } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Typography } from "@material-ui/core";
import { Delete, Edit, Refresh } from "@material-ui/icons";
import { IEvaluationCriteria } from "app/shared/model/micropartener/evaluation-criteria.model";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { cleanEntity } from "app/shared/util/entity-utils";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles(theme =>({
    card:{
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '95%',
        },
    },
}));

interface EvaluationCriteriaProps{
    category: IPartenerCategory
    open?: boolean,
    readonly?:boolean,
    onSave?: Function,
    onClose: Function,
}

export const EvaluationCriteria = (props: EvaluationCriteriaProps) =>{
    const { open, readonly,category } = props;
    const [evCriterias, setEvCriterias] = useState<IEvaluationCriteria[]>([]);
    const [loading, setLoading] = useState(false);
    const [criteria, setCriteria] = useState<IEvaluationCriteria>({ponderation:1});
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const classes = useStyles();

    const getEvCriterias = () =>{
        if(category){
            setLoading(false);
            axios.get<IEvaluationCriteria[]>(`${API_URIS.partenerCategoryEvaluationCriteriaApiUri}/?categoryId.equals=${category.id}`)
                .then(res =>{
                    setEvCriterias([...res.data])
                }).catch(e => console.log(e))
                  .finally(() => setLoading(false))
        }else{
            setEvCriterias([])
        }
    }

    useEffect(() =>{
        getEvCriterias();
    }, [props.category])

    const handleClose = () => props.onClose();

    const handleSave = (event) =>{
        event.preventDefault();
        if(criteria.name){
            setLoading(true)
            const entity: IEvaluationCriteria = {
                ...criteria,
                category,
            }
            const requestUri = !criteria.id ? axios.post<IEvaluationCriteria>(`${API_URIS.partenerCategoryEvaluationCriteriaApiUri}`, cleanEntity(entity))
                                          : axios.put<IEvaluationCriteria>(`${API_URIS.partenerCategoryEvaluationCriteriaApiUri}`, cleanEntity(entity))
            requestUri.then(res =>{
                if(res.data){
                    if(criteria.id){
                        setEvCriterias(evCriterias.map(c => c.id === res.data.id ? res.data : c ))
                    }else{
                        setEvCriterias([...evCriterias, res.data])
                        setCriteria({ponderation:1, name:''})
                    }
                }
            }).catch(e => console.log(e))
             .finally(() =>{ setLoading(false)})
        }
    }

    const handleDelete = (c: IEvaluationCriteria) =>{
        if(c && c.id){
            setCriteria(c);
            setOpenDeleteModal(true);
        }
    }

    const onDeleted = (deletedId: any) =>{
        if(deletedId){
            setCriteria({name:'', ponderation:1});
            setEvCriterias(evCriterias.filter(evc => evc.id !== deletedId));
            setOpenDeleteModal(false)
        }
    }

    return(
        <React.Fragment>
            <EntityDeleterModal 
                entityId={criteria.id}
                open={openDeleteModal}
                urlWithoutEntityId={API_URIS.partenerCategoryEvaluationCriteriaApiUri}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={onDeleted}
            />
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={translate("microgatewayApp.micropartenerEvaluationCriteria.home.title")}
                avatarIcon={<FontAwesomeIcon icon={faAdjust} />}
                rootCardClassName={classes.card}
            >
                <Grid container spacing={3}>
                    {/* ===== Form grid ====== */}
                    <Grid item xs={12}>
                        <form onSubmit={handleSave}>
                            <Box width={1}>
                                <Grid container spacing={1}>
                                    {!loading && <Grid item xs={12}>
                                            <Box width={1} textAlign="center">
                                                <Typography color="primary">Loading...</Typography>
                                            </Box>
                                        </Grid>}
                                    <Grid item xs={12} sm={7}>
                                        <TextField 
                                            fullWidth
                                            variant="outlined"
                                            label={translate("microgatewayApp.micropartenerEvaluationCriteria.name")}
                                            value={criteria.name}
                                            onChange={e => setCriteria({...criteria, name: e.target.value})}
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <TextField 
                                            fullWidth
                                            variant="outlined"
                                            label={translate("microgatewayApp.micropartenerEvaluationCriteria.ponderation")}
                                            value={criteria.ponderation}
                                            onChange={e => setCriteria({...criteria, ponderation: Number(e.target.value)})}
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true
                                            }} />
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <Button type="submit" color="primary" variant="text" 
                                            disabled={!criteria.name} className="text-capitalize">
                                            {translate(`entity.action.${criteria.id ? "edit":"save"}`)}
                                        </Button>
                                        {criteria.id && <IconButton onClick={() => setCriteria({ponderation:1, name:''})}><Refresh /></IconButton>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        <List>
                            {evCriterias.map(c =>(
                                <ListItem key={c.id} button>
                                    <ListItemText 
                                        primary={<Typography>{c.name}</Typography>}
                                        secondary={<Typography variant="caption">
                                            {`${translate("microgatewayApp.micropartenerEvaluationCriteria.ponderation")} : ${c.ponderation || 1}`}
                                        </Typography>}
                                    />
                                    {!readonly && <ListItemSecondaryAction>
                                        <Box display="flex" alignItems="center">
                                            <IconButton color="primary" onClick={() => setCriteria(c)}><Edit /></IconButton>
                                            <IconButton color="secondary" onClick={() => handleDelete(c)}><Delete /></IconButton>
                                        </Box>
                                    </ListItemSecondaryAction>}
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default EvaluationCriteria;
