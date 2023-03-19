import { makeStyles } from "@material-ui/styles";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { Box, Button, Fab, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { Add, Delete, Edit } from "@material-ui/icons";
import DynamicFieldUpdate from "./dynamic-field-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model";
import FieldNameVisualizer from "./fields/field-name-visualizer";

const useStyles = makeStyles(theme =>({

}))

interface DynamicFieldProps{
    readonly?:boolean,
    onSave?:Function,
    entityId:any,
    tag?:DynamicFieldTag,
    onDelete?: Function,
}

export const DynamicField = (props: DynamicFieldProps) =>{
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
            if(isNew)
                setFields([...fields, saved])
            else
                setFields(fields.map(f => f.id === saved.id ? saved : f))
            if(props.onSave)
                props.onSave(saved, isNew);
           setOpen(false);
        }
    }

    const onDelete = (deletedId?: number) =>{
        if(deletedId){
            setOpenDelete(false);
            props.onDelete(fieldToDelete);
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
                <Button onClick={() => handleUpdate({entityId, tag})}
                     variant="text" color="primary" className="text-capitalize">
                    {translate("_global.label.add")}&nbsp;&nbsp;<Add />
                </Button>
            </Box>
            </>}
            <Box width={1} overflow="auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {translate("microgatewayApp.dynamicField.name")}
                            </TableCell>
                            <TableCell align="center">
                                {translate("microgatewayApp.dynamicField.type")}
                            </TableCell>
                            <TableCell align="center">
                                {translate("microgatewayApp.dynamicField.required")}
                            </TableCell>
                            {!readonly && 
                                <TableCell align="center">
                                    Actions
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading || (fields && fields.length === 0) && 
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    {loading ?
                                        <Typography variant="h5">Loading...</Typography>
                                        :
                                        <Typography>
                                            {translate("microgatewayApp.dynamicField.home.notFound")}
                                        </Typography>
                                    }
                                </TableCell>
                            </TableRow>
                        }
                        {fields && fields.map(f =>(
                            <TableRow key={f.id}>
                                <TableCell><FieldNameVisualizer field={f} /></TableCell>
                                <TableCell align="center">
                                    {translate("microgatewayApp.DynamicFieldType."+f.type.toString())}
                                </TableCell>
                                <TableCell align="center">
                                    {f.required ? translate("_global.label.yes") : translate("_global.label.no")}
                                </TableCell>
                                {!readonly && 
                                <TableCell align="center">
                                    <Tooltip title={translate("entity.action.edit")} placement="left">
                                        <IconButton color="primary" onClick={() =>{
                                            setField(f)
                                            setOpen(true)
                                        }}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    {!readonly && props.onDelete}
                                    <Tooltip title={translate("entity.action.delete")} placement="right">
                                        <IconButton color="secondary" onClick={() => handleDelete(f)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </React.Fragment>
    )
}

export default DynamicField;