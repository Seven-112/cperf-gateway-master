import { Box, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { IField } from "app/shared/model/micropartener/field.model";
import { API_URIS } from "app/shared/util/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useEffect } from "react";
import FieldUpdate from "./field-update";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { FieldType } from "app/shared/model/enumerations/field-type.model";
import MyCustomModal from "app/shared/component/my-custom-modal";

const useStyles = makeStyles(theme =>({
    card:{
        width: '55%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '98%',
        },
    },
}));

interface FieldProps{
    category: IPartener
    open?:boolean,
    onClose: Function,
}

const StaticFields = (props: {label: string, type: FieldType, optional?: boolean, category?: string}) =>{
    const {label, type, optional, category} = props;
    return (
        <React.Fragment>
            {(label && type) && 
                <TableRow>
                <TableCell>{label}</TableCell>
                <TableCell align="center">
                    {translate("microgatewayApp.FieldType."+type.toString())}
                </TableCell>
               {/*  <TableCell align="center">
                    {translate("_global.label.no")}
                </TableCell> */}
                <TableCell align="center">
                    {optional ? translate("_global.label.yes") : translate("_global.label.no")}
                </TableCell>
                <TableCell align="center">
                    {category || '...'}
                </TableCell>
                <TableCell align="center">
                </TableCell>
                </TableRow>
            }
        </React.Fragment>
    )
}

export const Field = (props: FieldProps) =>{
    const {category, open} = props;

    const [fields, setFields] = useState<IField[]>([])
    const [loading, setLoading] = useState(false);

    const [field, setField] = useState<IField>({...category});

    const [openUpdate, setOpenUpdate] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const classes = useStyles();

    const getFields = () =>{
        if(category){
            setLoading(true);
            axios.get<IField[]>(`${API_URIS.partenerFieldModelApiUri}/?categoryId.equals=${category.id}`)
                .then(res =>{
                    if(res.data)
                        setFields([...res.data])
                }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getFields();
    }, [])

    const handleSave = (saved?: IField, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setFields([saved, ...fields])
            else
                setFields(fields.map(f => f.id === saved.id ? saved : f))
        }
        setOpenUpdate(false);
    }

    const handleDelete = (id?: number) =>{
        if(id){
            setFields(fields.filter(f => f.id !== id));
        }
        setOpenDeleteModal(false)
    }

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <FieldUpdate
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
                field={field}
                onSave={handleSave}
            />
            {field && 
            <EntityDeleterModal
                open={openDeleteModal}
                entityId={field.id}
                urlWithoutEntityId={API_URIS.partenerFieldModelApiUri}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={handleDelete}
                question={translate("microgatewayApp.micropartenerField.delete.question", {id: ""})}
             />
            }
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faCubes} />}
                title={`${translate("microgatewayApp.micropartenerPartenerCategory.home.title")}-${translate("microgatewayApp.micropartenerField.home.title")}`}
                customActionButtons={<>
                    <IconButton onClick={() =>{
                        setField({category})
                        setOpenUpdate(true)
                    }} color="inherit"><Add /></IconButton>
                    </>
                }
                rootCardClassName={classes.card}
            >
                <Box width={1} overflow="auto">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {translate("microgatewayApp.micropartenerField.label")}
                                </TableCell>
                                <TableCell align="center">
                                    {translate("microgatewayApp.micropartenerField.type")}
                                </TableCell>
                                {/*  <TableCell align="center">
                                    {translate("microgatewayApp.micropartenerField.requestFiles")}
                                </TableCell> */}
                                <TableCell align="center">
                                    {translate("microgatewayApp.micropartenerField.optinal")}
                                </TableCell>
                                <TableCell align="center">
                                    {translate("microgatewayApp.micropartenerField.category")}
                                </TableCell>
                                <TableCell align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {/* loading || (fields && fields.length <= 0) && 
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            {loading && <Typography variant="h5">Loading...</Typography>}
                                            <Typography>
                                                {translate("microgatewayApp.micropartenerField.home.notFound")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                */}
                                {<StaticFields 
                                    label={`${translate("microgatewayApp.micropartenerPartener.name")}`}
                                    type={FieldType.STRING} optional={false} />}
                                {<StaticFields
                                label={`${translate("microgatewayApp.micropartenerPartener.email")}`}
                                type={FieldType.STRING} optional={false} />}
                                {fields && fields.map(f =>(
                                    <TableRow key={f.id}>
                                    <TableCell>{f.label}</TableCell>
                                    <TableCell align="center">
                                        {translate("microgatewayApp.FieldType."+f.type.toString())}
                                    </TableCell>
                                    {/* <TableCell align="center">
                                        {f.requestFiles ? translate("_global.label.yes") : translate("_global.label.no")}
                                    </TableCell> */}
                                    <TableCell align="center">
                                        {f.optinal ? translate("_global.label.yes") : translate("_global.label.no")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {f.category ? f.category.name : "..."}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={translate("entity.action.edit")} placement="left">
                                            <IconButton color="primary" onClick={() =>{
                                                setField(f)
                                                setOpenUpdate(true)
                                            }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate("entity.action.delete")} placement="right">
                                            <IconButton color="secondary"
                                            onClick={ () =>{
                                                setField(f);
                                                setOpenDeleteModal(true);
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default Field;