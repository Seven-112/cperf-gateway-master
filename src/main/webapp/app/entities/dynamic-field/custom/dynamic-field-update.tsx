import { Box, Button, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, Switch, TextField, Typography } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { API_URIS, navigateToBlankTab } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { cleanEntity } from "app/shared/util/entity-utils";
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditFileModal from "app/shared/component/edit-file-modal";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { connect } from "react-redux";
import { IRootState } from "app/shared/reducers";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from "app/shared/reducers/file-upload-reducer";
import { getSession } from "app/shared/reducers/authentication";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles(theme =>({
    card:{
        width: '40%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
    },
}))

interface DynamicFieldUpdateProps extends StateProps, DispatchProps{
    field?:IDynamicField,
    open?:boolean,
    onSave?:Function,
    onClose:Function,
}

export const DynamicFieldUpdate = (props: DynamicFieldUpdateProps) =>{
    const { open, account } = props;
    const [field, setField] = useState(props.field || {});
    const [isNew, setIsNew] = useState(!props.field || !props.field.id);
    const [loading, setLoading] = useState(false);
    const [openFileEditor, setOpenFileEditor] = useState(false);
    const [openDeleter, setOpenDeleter] = useState(false)

    const classes = useStyles();

    useEffect(() =>{
        setField(props.field || {});
        setIsNew(!props.field || !props.field.id);
        if(!props.account)
            props.getSession();
    }, [props.field])

    const handleClose = () => props.onClose();

    const handleChange  = (e) =>{
        const { name, value } = e.target;
        setField({...field, [name]: value});
    }

    const assiateUploadedFileToField = (id) =>{
        if(id){
            props.setFileUploadWillAssociateEntityId(id);
            if(account && isNew){
                props.associateFilesToEntity(id, FileEntityTag.dynamicFiledDescFile.toString(), props.account.id)
            }
        }
    }

    const handleSave = (event) =>{
        event.preventDefault();
        if(field && field.type && field.name){
            setLoading(true)
            if(field.type === DynamicFieldType.FILE && field.required)
                field.required = false;
            const request = isNew ? axios.post<IDynamicField>(`${API_URIS.dynamicFieldApiUri}`, cleanEntity(field))
                                  : axios.put<IDynamicField>(`${API_URIS.dynamicFieldApiUri}`, cleanEntity(field));
            request.then(res =>{
                if(res.data){
                    assiateUploadedFileToField(res.data.id);
                    props.onSave(res.data, isNew);
                }
            }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    const handleSaveFile = (saved?: IMshzFile[]) =>{
        setOpenFileEditor(false)
        if(saved && saved.length !== 0)
            setField({...field, docId: saved[0].id})
    }

    const handleDeleteFile = (deletedId?: any) =>{
        if(deletedId && field && field.docId === deletedId){
            const entity: IDynamicField = {
                ...field,
                docId: null
            }
            setField(entity)
            if(entity.id)
                axios.put<IDynamicField>(`${API_URIS.dynamicFieldApiUri}`, cleanEntity(entity))
                    .then(() =>{}).catch(e => console.log(e))
        }
        
    }

    const handleOpenFile = () =>{
        if(field && field.docId)
            navigateToBlankTab(`file-viewer/${field.docId}`)
    }

    return (
        <React.Fragment> 
            <EditFileModal
                open={openFileEditor}
                entityId={field ? field.id : null}
                entityTagName={FileEntityTag.dynamicFiledDescFile}
                onSaved={handleSaveFile}
                onCloseNoCancelSaving={() => setOpenFileEditor(false)}
            />
            {(field && field.docId && serviceIsOnline(SetupService.FILEMANAGER)) &&
             <EntityDeleterModal 
                open={openDeleter}
                entityId={field.docId}
                urlWithoutEntityId={API_URIS.mshzFileApiUri}
                onClose={() => setOpenDeleter(false)}
                onDelete={handleDeleteFile}
            />} 
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={translate("microgatewayApp.dynamicField.home.createOrEditLabel")}
                rootCardClassName={classes.card}
            >
                <form onSubmit={handleSave}>
                    <Grid container spacing={3}>
                        {loading && <Grid item xs={12}>
                            <Box width={1} textAlign="center">
                                <Typography variant="h5" color="primary">Loading...</Typography>
                            </Box>
                        </Grid>}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField 
                                    value={field.name}
                                    required
                                    label={translate("microgatewayApp.dynamicField.name")}
                                    name="name"
                                    InputLabelProps={{ shrink: true}}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel shrink>
                                    {translate("microgatewayApp.dynamicField.type")}
                                </InputLabel>
                                <Select name="type" value={field.type} onChange={handleChange}>
                                    <MenuItem value="">...</MenuItem>
                                    <MenuItem value={DynamicFieldType.TEXT} className="text-lowercase">
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.TEXT.toString())}
                                    </MenuItem>
                                    <MenuItem value={DynamicFieldType.DATE} className="text-lowercase">
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.DATE.toString())}
                                    </MenuItem>
                                    <MenuItem value={DynamicFieldType.BOOLEAN}>
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.BOOLEAN.toString())}
                                    </MenuItem>
                                    <MenuItem value={DynamicFieldType.DATETIME} className="text-lowercase">
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.DATETIME.toString())}
                                    </MenuItem>
                                    <MenuItem value={DynamicFieldType.NUMBER} className="text-lowercase">
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.NUMBER.toString())}
                                    </MenuItem>
                                    <MenuItem value={DynamicFieldType.FILE} className="text-lowercase">
                                        {translate("microgatewayApp.DynamicFieldType."+DynamicFieldType.FILE.toString())+'(s)'}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {(field.type !== DynamicFieldType.FILE && field.type !== DynamicFieldType.BOOLEAN) &&
                        <Grid item xs={12} sm={12}>
                            <Box width={1} display="flex" justifyContent="flex-start" alignItems="center">
                                <Typography className="mr-3">
                                    {translate("microgatewayApp.dynamicField.required")}
                                </Typography>
                                <FormControlLabel
                                    label={field.required ? translate("_global.label.yes") : translate("_global.label.no")}
                                    control={<Switch checked={field.required}
                                    onChange={() => setField({...field, required: !field.required})} />}
                                    className="mt-1"
                                />
                            </Box>
                        </Grid>}
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                <Typography>
                                    {translate("_global.label.descriptionFile")}
                                </Typography>
                                {(field && field.docId) && <>
                                        <IconButton 
                                            color="primary" 
                                            className="mr-3"
                                            onClick={handleOpenFile}>
                                            <FontAwesomeIcon icon={faFileAlt} />
                                        </IconButton>
                                        <IconButton 
                                            color="secondary"
                                            className="mr-3"
                                            onClick={() => setOpenDeleter(true)}
                                            >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </IconButton>
                                    </>
                                }
                                <IconButton color="primary" onClick={() => setOpenFileEditor(true)}>
                                    <FontAwesomeIcon icon={(field && field.docId) ? faEdit : faPlus} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="text" color="primary" 
                                disabled={!field || !field.type || !field.name}
                                className="float-right text-capitalize">
                                {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication, fileUpload }: IRootState) => ({
    account: authentication.account,
    associatedFileSize: fileUpload.updatedFileSize,
});
  
const mapDispatchToProps = {
    associateFilesToEntity,
    setFileUploadWillAssociateEntityId,
    getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;


export default connect(mapStateToProps, mapDispatchToProps)(DynamicFieldUpdate);