import { IField } from "app/shared/model/micropartener/field.model";
import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import { FieldType } from "app/shared/model/enumerations/field-type.model";
import { Badge, Box, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, makeStyles, Switch, TextField, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { AttachFile } from "@material-ui/icons";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

const useStyles = makeStyles(theme =>({
    formControl: {
      margin: theme.spacing(1),
    },
}))

interface PartenerFieldUpdateProps{
    partener: IPartener,
    field: IField,
    partenerSaveEventPending?:boolean,
    partenerSaveEventSuccessed?:boolean,
    onSave?:Function,
    onChange: Function,
}

export const PartenerFieldUpdate = (props: PartenerFieldUpdateProps) =>{
    const { partener, field } = props;
    const [partenerField, setPartenerField] = useState<IPartenerField>(null);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [showError, setShowError] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const error = !field.optinal && field.type !== FieldType.BOOLEAN && (!partenerField || !partenerField.val || (field.requestFiles && files.length <= 0));

    const getFiles = (pFieldId:any) =>{
        if(pFieldId){
            getMshzFileByEntityIdAndEntityTag(pFieldId, FileEntityTag.tenderPartenerField)
                .then(res =>{
                    if(res.data)
                        setFiles([...res.data])
                }).catch(e => console.log(e))
        }
    }
    
    const initPartenerField = () =>{
        if(partener && field){
            const partenerId = partener.id || 0;
            axios.get<IPartenerField[]>(`${API_URIS.partenerFiledApiUri}/?partenerId.equals=${partenerId}&fieldId.equals=${field.id}`)
                .then(res =>{
                    if(res.data && res.data.length !==0){
                        setPartenerField(res.data[0]);
                        getFiles(res.data[0].id)
                    }else{
                        setPartenerField({partener, field})
                    }
                }).catch(e => console.log(e))
        }
    }
    
    /* const saveFiles = (pField:IPartenerField) =>{
        if(pField){
            [...files].filter(f => !f.id).map(f =>{
                const entity: IPartenerFieldFile = {...f, partenerField}
                setLoading(true)
                axios.post<IPartenerFieldFile>(`${API_URIS.partenerFieldFileApiUri}`, cleanEntity(entity))
                    .then(() =>{}).catch(e => console.log(e)).finally(() => setLoading(false))
            })
        }
    } */

    const save = () =>{
        if(partenerField && props.partenerSaveEventSuccessed && props.partener && props.partener.id && !error){
            setLoading(true)
            const entity: IPartenerField = {
                ...partenerField,
                val: field.type === FieldType.BOOLEAN ? partenerField.val ? "true" : "false" :  partenerField.val,
                partener: props.partener
            }
            const req = partenerField.id ? axios.put<IPartenerField>(`${API_URIS.partenerFiledApiUri}`, cleanEntity(entity))
                                        : axios.post<IPartenerField>(`${API_URIS.partenerFiledApiUri}`, cleanEntity(entity))
            req.then(res =>{
                if(res.data){
                    // saveFiles(res.data);
                    if(props.onSave)
                        props.onSave(res.data, !partenerField.id ? true : false)
                    setPartenerField(res.data);
                }
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }


    useEffect(() =>{
        initPartenerField();
    }, []) // props.partener, props.field


    useEffect(() =>{
        props.onChange(partenerField, error)
    }, [partenerField])

    useEffect(() =>{
        props.onChange(partenerField, error)
    }, [files])

    useEffect(() =>{
        save();
    }, [props.partenerSaveEventSuccessed])

    useEffect(() =>{
        if(props.partenerSaveEventPending)
            setShowError(true)
    }, [props.partenerSaveEventPending])

    const handleSwitch = (e) =>{
        if(partenerField.val && ( partenerField.val === "true" || partenerField.val === "1"))
            setPartenerField({...partenerField, val: 'false'})
        else
            setPartenerField({...partenerField, val: 'true'})
    }

    const handleChange = (e) =>{
        const value = e.target.value
        setShowError(true);
        setPartenerField({...partenerField, val: value});
    }

    const handleSaveFiles = (saved: IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            setShowError(true);
            setFiles([...files, ...saved])
        }
    }

    const handleDeleteFile = (deleteId) =>{
        if(deleteId){
            setShowError(true);
            setFiles(files.filter(f => f.id === deleteId))
        }
    }

    return (
        <React.Fragment>
            {partenerField && <>
                <ModalFileManager 
                     open={open}
                     entityId={partenerField.id}
                     entityTagName={FileEntityTag.tenderPartenerField}
                     files={[...files]}
                     onSave={handleSaveFiles}
                     onRemove={handleDeleteFile}
                     onClose={() => {
                         setShowError(true)
                        setOpen(false)
                     }}
                     title={translate("_global.label.files")}
                      />
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={0} alignItems="center">
                        <Grid item xs={field.requestFiles ? 11 : 12}>
                            <FormControl fullWidth error={(error && showError)}>
                                {field.type === FieldType.STRING &&
                                    <TextField
                                        label={field.label}
                                        value={partenerField.val}
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={(error && showError)}
                                        onChange={handleChange}
                                    />}
                                {field.type === FieldType.NUMBER &&
                                    <TextField
                                        label={field.label}
                                        value={partenerField.val}
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={(error && showError)}
                                        onChange={handleChange}
                                    />}
                                {field.type === FieldType.BOOLEAN && <>
                                    <Box width={1} display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" m={0} p={0}>
                                        <Typography className="text-capitalize mr-5">{field.label}</Typography>
                                        <FormControlLabel 
                                            label={partenerField.val &&( partenerField.val === "true" || partenerField.val === "1") 
                                                    ? translate("_global.label.yes") : translate("_global.label.no")}
                                            control={<Switch checked={partenerField.val && ( partenerField.val === "true" || partenerField.val === "1")} 
                                            onChange={handleSwitch}/>}
                                        />
                                    </Box>
                                </>}
                                {field.type === FieldType.DATE &&
                                    <TextField
                                        label={field.label}
                                        value={partenerField.val}
                                        variant="outlined"
                                        size="small"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={(error && showError)}
                                        onChange={handleChange}
                                    />}
                                {field.type === FieldType.DATETIME &&
                                    <TextField
                                        label={field.label}
                                        value={partenerField.val}
                                        variant="outlined"
                                        size="small"
                                        type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={(error && showError)}
                                        onChange={handleChange}
                                    />}
                                    {((error && showError) || loading) && 
                                        <FormHelperText>
                                            {`${(error && showError) ? translate("_global.form.helpersTexts.required") : ''} ${loading ? 'Loading...' : ''}`}
                                        </FormHelperText>
                                    }
                            </FormControl>
                        </Grid>
                        {field.requestFiles && <Grid item xs={1}>
                            <IconButton 
                                title={translate("_global.label.files")}
                                color="primary" onClick={() => {
                                    setShowError(false)
                                    setOpen(true)
                                }}>
                                <Badge color={(!field.optinal && [...files].length) <= 0 ? 'secondary' : 'primary'}
                                    badgeContent={[...files].length}
                                    showZero
                                    >
                                    <AttachFile />
                                </Badge>
                            </IconButton>
                        </Grid>}
                    </Grid>
                </Grid>
            </>
            }
        </React.Fragment>
    )
}

export default PartenerFieldUpdate;