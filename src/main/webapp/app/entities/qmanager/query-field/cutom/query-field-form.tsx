import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, FormControl, Grid, IconButton, makeStyles, Modal, Slide, Typography } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { IQuery } from "app/shared/model/qmanager/query.model";
import { translate } from "react-jhipster";
import axios from 'axios';
import { IQueryField } from "app/shared/model/qmanager/query-field.model";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { API_URIS, navigateToBlankTab } from "app/shared/util/helpers";
import DynamicFieldUpdate from "app/entities/dynamic-field/custom/dynamic-field-update";
import { cleanEntity } from "app/shared/util/entity-utils";
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model";
import DynamicFieldModalWrapper from "app/entities/dynamic-field/custom/fields/dynamic-field-model-wrapper";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { FieldType } from "app/shared/model/enumerations/field-type.model";
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '30%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
    cardActions:{
        background: 'white',
        margin: 0,
    },
}))

interface QueryFieldFormProps{
    open?:boolean,
    query:IQuery,
    readonly?:boolean,
    onClose: Function,
}

export const QueryFieldForm = (props:QueryFieldFormProps) =>{
    const { open, query, readonly } = props;

    const [fields, setFields] = useState<IDynamicField[]>([]);

    const [openFieldEditor, setOpenFieldEditor] = useState(false);

    const [selectedField, setSelectedField] = useState<IDynamicField>(null);

    const [openEntityDeleter, setOpenEntityDeleter] = useState(false);
    
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getFields = () =>{
        if(props.query && props.query.id){
            setLoading(true);
            axios.get<IDynamicField[]>(`${API_URIS.dynamicFieldApiUri}/?entityId.equals=${props.query.id}&tag.equals=${DynamicFieldTag.QUERY}`)
                .then(res =>{
                    setFields([...res.data]);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getFields();
    }, [props.query])
    
    const handleClose = () => props.onClose();

    const onSave = (field?: IDynamicField, isNew?: boolean) =>{
        if(field && !readonly){
            if(isNew){
                const entity: IQueryField={
                    fieldId: field.id,
                    queryId: query.id
                }
                setLoading(true)
                axios.post<IQueryField>(`${API_URIS.queryFieldApiUri}`, cleanEntity(entity))
                    .then(res =>{
                        if(res.data){
                            setFields([...fields, field])
                        }
                    }).catch(e => console.log(e))
                     .finally(() => {
                        setLoading(false)
                        setOpenFieldEditor(false);
                     })
            }else{
                setFields([...fields].map(f => f.id === field.id ? field : f))
                setOpenFieldEditor(false);
            }
        }
    }

    const handleUpdate = (f?: IDynamicField) =>{
        if(!readonly){
            setSelectedField(f || {entityId: query.id, tag: DynamicFieldTag.QUERY})
            setOpenFieldEditor(true);
        }
    }

    const handleDelete = (f?: IDynamicField) =>{
        if(f && !readonly){
            setSelectedField(f);
            setOpenEntityDeleter(true);
        }
    }

    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            setFields([...fields].filter(f => f.id !== deletedId))
            setOpenEntityDeleter(false);
        }
    }

    const viewDescriptionFile = (f?: IDynamicField) =>{
        if(f && f.docId)
            navigateToBlankTab(`file-viewer/${f.docId}`)
    }

    const nameField: IDynamicField = {
        entityId: query.id,
        name: translate("microgatewayApp.qmanagerQuery.name"),
        type: DynamicFieldType.TEXT,
        tag: DynamicFieldTag.QUERY,
        required: true,
    }
    
    return (
        <React.Fragment> 
            {query && <>
                <DynamicFieldUpdate 
                    field={selectedField}
                    open={openFieldEditor}
                    onSave={onSave}
                    onClose={() => setOpenFieldEditor(false)}
                />
                {selectedField && <EntityDeleterModal 
                    open={openEntityDeleter}
                    entityId={selectedField.id}
                    urlWithoutEntityId={API_URIS.dynamicFieldApiUri}
                    onDelete={onDelete}
                    onClose={() => setOpenEntityDeleter(false)}
                    question={translate("microgatewayApp.dynamicField.delete.question", {id: selectedField.name})}
                />}
              </>
            }
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            > 
                <Slide
                    in={open}
                    direction='down'
                    timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={translate("_global.label.form")}
                            titleTypographyProps={{
                                variant: 'h4',
                            }}
                            action={
                                <Box display="flex" alignItems="center" flexWrap="wrap">
                                    {!readonly && <IconButton 
                                        color="inherit"
                                        onClick={() => handleUpdate(null)}>
                                        <Add />
                                    </IconButton>}
                                    <IconButton 
                                        color="inherit"
                                        onClick={handleClose}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width="flex" 
                                 display="flex" justifyContent="center"
                                 alignItems="center" flexWrap="wrap" mb={3}>
                                    <CircularProgress color="primary" style={{ width: 30, height: 30 }}/>
                                    <Typography color="primary" className="ml-3">Loading</Typography>
                            </Box>}
                             <Grid container spacing={3} alignContent="center" alignItems="center" justify="center">
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <DynamicFieldModalWrapper 
                                            dynamicField={nameField}
                                        />
                                    </FormControl>
                                </Grid>
                                {[...fields].map((f, index) =>(
                                    <Grid key={index} item xs={12} sm={12}>
                                        <FormControl fullWidth>
                                            <DynamicFieldModalWrapper 
                                                dynamicField={f}
                                                readonly={readonly}
                                                onOpenFile={viewDescriptionFile}
                                                onUpdate={handleUpdate}
                                                onDelete={handleDelete}
                                             />
                                        </FormControl>
                                    </Grid>
                                ))}
                            </Grid>
                            {(!loading && (!fields || fields.length === 0)) && <Box width="flex" 
                                 display="flex" justifyContent="center"
                                 alignItems="center" flexWrap="wrap" mt={1}>
                                    <Typography color="primary">
                                        {translate("microgatewayApp.dynamicField.home.notFound")}
                                    </Typography>
                            </Box>}
                        </CardContent>
                        </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default QueryFieldForm;