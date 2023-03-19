import { Badge, Box, Card, CardContent, CardHeader, CircularProgress, Collapse, Fab, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, Slide, Switch, TextField, Typography } from "@material-ui/core";
import { AttachFile, Close, KeyboardArrowRight, Save, Visibility } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import { ITenderFile } from "app/shared/model/microprovider/tender-file.model";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { convertDateTimeFromServer, convertDateTimeToServer } from "app/shared/util/date-utils";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import { AUTHORITIES } from "app/config/constants";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import EditFileModal from "app/shared/component/edit-file-modal";
import MyCustomRTE from "app/shared/component/my-custom-rte";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId, upldateEntityId } from "app/shared/reducers/file-upload-reducer";
import { connect } from "react-redux";

const useStyles = makeStyles(theme =>({
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color:  theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
}))

interface TenderUpdateFormProps extends DispatchProps{
    account:any,
    tender?:ITender,
    locked?:boolean,
    onSave?:Function,
    onNext?:Function,
    onClose:Function,
    onChange?: Function,
    onCallFiles?: Function,
}
export const TenderUpdateForm = (props:TenderUpdateFormProps) =>{
    const {account, locked } = props;
    const [isNew, setIsNew] = useState(!props.tender || !props.tender.id);
    const [tender, setTender] = useState<ITender>(props.tender || {});
    const [partenerCats, setPartenerCats] = useState<IPartenerCategory[]>([]);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false); 
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [openFilesEditor, setOpenFileEditor] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [tenderContent, setContent] = useState(null);
    
    const classes = useStyles();

    const handleClose = () =>{
        if(props.onClose)
            props.onClose();
    }

    const getPartenerCats = () =>{
        setLoading(true)
        axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}/?role.equals=${AUTHORITIES.PROVIDER.toString()}`)
            .then(res =>{
                if(res.data)
                    setPartenerCats([...res.data]);
            }).catch((e) => console.log(e)).finally(() =>setLoading(false))
    }

    const getFiles = () =>{
        if(tender && tender.id){
            getMshzFileByEntityIdAndEntityTag(tender.id, FileEntityTag.tender)
                .then(res =>{
                    if(res.data)
                        setFiles([...res.data]);
                }).catch(e => console.log(e));
        }
    }

    useEffect(() =>{
        setTender(props.tender || {});
        setIsNew(!props.tender || !props.tender.id)
        getPartenerCats();
        getFiles();
    }, [])

    useEffect(() =>{
        setSubmited(false);
        setSuccess(false)
        if(props.onChange)
            props.onChange(tender)
    }, [tender])

    useEffect(() =>{
        if(props.onCallFiles)
            props.onCallFiles(files);
    }, [files])

    const handleChangeExpireDate = (e) =>{
        const value = e.target.value;
        const date = value ? new Date(value) : new Date();
        setTender({...tender, expireAt: date.toISOString()})
        setUpdated(true)
    }

/* 
    const saveTenderFiles = (td: ITender) =>{
        if(td && td.id){
            files.filter(tf => !tf.id).map(tf => {
                const entity: ITenderFile = {
                    ...tf,
                    tender: td
                }
                setLoading(true)
                axios.post<ITenderFile>(`${API_URIS.tenderFileApiUri}`, cleanEntity(entity))
                    .then(res =>{
                        if(res.data)
                            setFiles([...files.map(item => item.fileId === res.data.fileId ? res.data : item)])
                    }).catch(e => console.log(e)).finally(() => setLoading(false))
            })
        }
    } */
    const handleFilesSaved = (savedFiles?: IMshzFile[]) =>{
        if(savedFiles && savedFiles.length !== 0){
            const newFiles = savedFiles.map(sf => {
                const tf: ITenderFile = {
                    fileId: sf.id,
                    name: sf.name,
                }
                return tf;
            })
            setFiles([...files, ...newFiles]);
            setUpdated(true)
        }
        setOpenFileEditor(false);
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setSubmited(true);
        setSuccess(false)
        setShowMessage(false)
        if(tender && tender.object && tender.expireAt && tender.targetCategoryId){
            if(updated){
                setLoading(true)
                const entity :ITender = {
                    ...tender,
                    userId: isNew ? account.id :tender.userId,
                    createdAt: isNew ? new Date().toISOString() : tender.createdAt,
                    content: tenderContent || tender.content
                }
                const request = isNew ? axios.post<ITender>(`${API_URIS.tenderApiUri}`, cleanEntity(entity))
                                    :  axios.put<ITender>(`${API_URIS.tenderApiUri}`, cleanEntity(entity))
                request.then(res =>{
                    if(res.data && res.data.id){
                        setSuccess(true);
                        // saveTenderFiles(res.data);
                        if(props.onSave)
                            props.onSave(res.data, isNew);
                        props.setFileUploadWillAssociateEntityId(res.data.id);
                        props.associateFilesToEntity(res.data.id, FileEntityTag.tender, props.account.id);
                    }
                }).catch(e => {
                    setSuccess(false);
                }).finally(() =>{
                    setLoading(false);
                    setShowMessage(true)
                    setUpdated(false)
                })
            }else{
                setUpdated(false)
                if(props.onSave)
                    props.onSave(tender, isNew);
            }
        }
    }

    const handleNext = () =>{
        if(props.onNext)
            props.onNext();
    }

    return (
        <React.Fragment>
            <EditFileModal 
                    open={openFilesEditor} 
                    selectMultiple 
                    withClearPreviewerItem
                    onSaved={handleFilesSaved} 
                    onCloseNoCancelSaving={() => setOpenFileEditor(false)}
                    entityTagName={FileEntityTag.tender}
                    entityId={tender.id}
                />
                <Card className={classes.card}>
                    <CardHeader 
                        title={translate("microgatewayApp.microproviderTender.home.createOrEditLabel")}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={
                        props.onClose ? 
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>: ''}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSave}>
                            <Grid container spacing={2} alignItems="center">
                                {loading && <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                            <CircularProgress color="secondary"/>
                                            <Typography variant="h4" color="secondary" className="ml-2">Loading...</Typography>
                                    </Box>
                                </Grid>}
                                {submited && <Grid item xs={12}>
                                    <Collapse in={showMessage}>
                                        <Alert severity={success? "success" : "error"} 
                                            action={
                                                <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                  setShowMessage(false);
                                                }}
                                              >
                                                <Close fontSize="inherit" />
                                              </IconButton>}
                                         >
                                             {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                        </Alert>
                                    </Collapse>
                                </Grid>}
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={submited && !tender.object} size="medium">
                                        <TextField error={submited && !tender.object}
                                            multiline
                                            name="object"
                                            margin="dense"
                                            variant="outlined"
                                            label={translate("microgatewayApp.microproviderTender.object")}
                                            InputLabelProps={{ shrink: true}}
                                            value={tender.object}
                                            onChange={(e) => {
                                                setTender({...tender, object: e.target.value})
                                                setUpdated(true)
                                            }}
                                        />
                                        {submited && !tender.object && <FormHelperText error={true}>
                                            {translate("_global.form.helpersTexts.required")}
                                        </FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <MyCustomRTE 
                                        content={tenderContent || tender.content}
                                        onSave={value => {
                                            setUpdated(true)
                                            setContent(value)
                                        }}
                                        label={translate("microgatewayApp.microproviderTender.content")}
                                        editorMinHeight={80}
                                        editorMaxHeight={250}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={submited && !tender.expireAt} size="medium">
                                        <TextField error={submited && !tender.expireAt}
                                            name="expireAt"
                                            margin="dense"
                                            variant="outlined"
                                            type="datetime-local"
                                            label={translate("microgatewayApp.microproviderTender.expireAt")}
                                            InputLabelProps={{ shrink: true}}
                                            value={tender.expireAt ? convertDateTimeFromServer(convertDateTimeToServer(tender.expireAt)) : ''}
                                            onChange={handleChangeExpireDate}
                                        />
                                        {submited && !tender.expireAt && <FormHelperText error={true}>
                                            {translate("_global.form.helpersTexts.required")}
                                        </FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={submited && !tender.targetCategoryId} size="medium">
                                        <InputLabel shrink>{translate("microgatewayApp.micropartenerPartenerCategory.detail.title")}</InputLabel>
                                        <Select value={tender.targetCategoryId} margin="dense" variant="outlined"
                                            onChange={(e) => {
                                                setTender({...tender, targetCategoryId: Number(e.target.value)})
                                                setUpdated(true)
                                                }}>
                                            {partenerCats.map(c =>(
                                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {submited && !tender.targetCategoryId && <FormHelperText error={true}>
                                            {translate("_global.form.helpersTexts.required")}
                                        </FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box width={1} display="flex" justifyContent="center"  alignItems="center" flexWrap="wrap" overflow="auto">
                                        <Typography className="mr-3">
                                            {translate('_tender.responseWithExecutionTime')}
                                        </Typography>
                                        <FormControlLabel
                                                className="mt-1"
                                                label={<Typography>
                                                    {translate(`_global.label.${tender.executionDeleyRequired ? 'yes' :'no'}`)}
                                                </Typography>} 
                                                control={<Switch checked={tender.executionDeleyRequired}
                                                onChange={() => {
                                                    setTender({...tender, executionDeleyRequired: !tender.executionDeleyRequired ? true:false})
                                                    setUpdated(true)
                                                }}
                                            />}
                                        />
                                    </Box>
                                </Grid>
                                {(tender && !tender.id) &&
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="medium">
                                        <Box width={1} p={1} display="flex" 
                                            justifyContent="center" flexWrap="wrap" alignItems="center">
                                                <Typography>{translate("_tender.files")}</Typography>
                                                <Fab size="small" color="primary" 
                                                    onClick={() => setOpenFileEditor(true)} className="ml-3 mr-5 p-0">
                                                    <Badge badgeContent={files ? files.length : 0} color="secondary">
                                                        <AttachFile />
                                                    </Badge>
                                                </Fab>
                                        </Box>
                                    </FormControl>
                                </Grid>}
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="medium">
                                        <Box width={1} mt={1} display="flex" justifyContent="flex-end">
                                            {!props.onNext ? (
                                                <Fab color="primary" type="submit" variant="extended">
                                                    <Typography className="mr-2">{translate("entity.action.save")}</Typography>
                                                </Fab>
                                              ):(
                                                <IconButton color="primary" type="submit"  size="small"
                                                    disabled={!tender || !tender.expireAt || !tender.object || !tender.targetCategoryId}>
                                                    <Typography className="mr-2 text-lowercase">{translate("_global.label.next")}</Typography>
                                                    <KeyboardArrowRight />
                                                </IconButton>
                                              )
                                            }
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
        </React.Fragment>
    )
}

const mapDispatchToProps={
    setFileUploadWillAssociateEntityId,
    associateFilesToEntity,
}

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(TenderUpdateForm);