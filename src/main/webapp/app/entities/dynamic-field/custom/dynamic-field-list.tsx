import { makeStyles } from "@material-ui/styles";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Box, Button, Fab, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { Add, Delete, Edit } from "@material-ui/icons";
import DynamicFieldUpdate from "./dynamic-field-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model";
import FieldNameVisualizer from "./fields/field-name-visualizer";

const useStyles = makeStyles(theme =>({

}))

interface DynamicFieldListProps{
    readonly?:boolean,
    entityId: any,
    tag:DynamicFieldTag,
    onSave?:Function,
    onDelete?: Function,
}

export const DynamicFieldList = (props: DynamicFieldListProps) =>{
    const { readonly, entityId, tag } = props;
    const [fields, setFields] = useState<IDynamicField[]>([]);
    const [loading, setLoading] = useState(false)
    const [field, setField] = useState<IDynamicField>(null);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState<IDynamicField>(null)

    const getFields = () =>{
        if(entityId && tag){
            setLoading(false)
            axios.get<IDynamicField[]>(`${API_URIS.dynamicFieldApiUri}/?entityId.equals=${entityId}&tag.equals=${tag}`)
                .then(res =>{
                    if(res.data)
                        setFields([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))

        }
    }

    useEffect(() =>{
        getFields();
    }, [])

    const handleDelete = (fToDelete: IDynamicField) =>{
        if(fToDelete && props.onDelete && !readonly){
            setOpenDelete(true)
            setFieldToDelete(fToDelete);
        }
    }

    const handleUpdate = (f?: IDynamicField) =>{
        setField(f || {entityId, tag});
        setOpen(true);
    }

    const handleSave = (saved?: IDynamicField, isNew?: boolean) =>{
        if(saved){
            if(isNew){
                setFields([saved, ...fields]);
            }else{
                setFields(fields.map(f => f.id === saved.id ? saved : f))
            }
            if(props.onSave)
                props.onSave(saved, isNew);
           setOpen(false);
        }
    }

    const onDelete = (deletedId?: number) =>{
        if(deletedId){
            setFields(fields.filter(f => f.id !== deletedId))
            setOpenDelete(false);
            setFieldToDelete(null);
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    return (
        <React.Fragment>
            {!readonly && <>
            <DynamicFieldUpdate
                open={open}
                onSave={handleSave}
                onClose={() => setOpen(false)}
                field={field}
             />
             {(props.onDelete && fieldToDelete) && <EntityDeleterModal
                entityId={fieldToDelete.id}
                open={openDelete}
                urlWithoutEntityId={API_URIS.dynamicFieldApiUri}
                onClose={() => setOpenDelete(false)}
                onDelete={onDelete}
              />}
            <Box width={1} overflow="auto" display="flex" justifyContent="center">
                <Button onClick={() => handleUpdate()} variant="contained" color="primary">
                    {translate("_global.label.add")}&nbsp;&nbsp;<Add />
                </Button>
            </Box>
            </>}
            <Box width={1} overflow="auto">
                <List>
                    {[...fields].map((f, index) => (
                        <ListItem key={index} button>
                            <ListItemText 
                                primary={<Typography><FieldNameVisualizer field={f} /></Typography>}
                                secondary={<Box display="flex" alignItems="center">
                                    (<Typography variant="caption">
                                        {translate("microgatewayApp.DynamicFieldType."+f.type.toString())}
                                    </Typography>
                                    {f.required &&
                                        <Typography color="secondary" variant="caption">&nbsp;:&nbsp;{translate("microgatewayApp.dynamicField.required")}</Typography>
                                    })
                                </Box>}
                            />
                            <ListItemSecondaryAction>
                                {!readonly && 
                                    <Box display="flex" alignItems="center">
                                        <Tooltip title={translate("entity.action.edit")} placement="left">
                                            <IconButton color="primary" onClick={() =>{
                                                setField(f)
                                                setOpen(true)
                                            }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        {!readonly}
                                        <Tooltip title={translate("entity.action.delete")} placement="right">
                                            <IconButton color="secondary" onClick={() => handleDelete(f)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                }
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    {(!loading && [...fields].length )=== 0 && <ListItem>
                            <Box width={1} textAlign="center">
                                <Typography>
                                    {translate("microgatewayApp.dynamicField.home.notFound")}
                                </Typography>
                            </Box>
                    </ListItem>}
                </List>
            </Box>
        </React.Fragment>
    )
}

export default DynamicFieldList;