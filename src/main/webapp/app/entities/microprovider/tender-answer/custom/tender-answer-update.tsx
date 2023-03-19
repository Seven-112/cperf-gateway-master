import React from "react"
import { useState } from "react"
import { Box, Card, CardContent, CardHeader, CircularProgress, Collapse, Fab, FormControl, FormHelperText, Grid, IconButton, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, MenuItem, Select, TextField, Tooltip, Typography } from "@material-ui/core"
import { translate } from "react-jhipster"
import { AttachFile, Close, KeyboardArrowLeft, KeyboardArrowRight, Save } from "@material-ui/icons"
import { useEffect } from "react"
import { ITenderDoc } from "app/shared/model/microprovider/tender-doc.model"
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers"
import { Alert } from "@material-ui/lab"
import { cleanEntity } from "app/shared/util/entity-utils"
import { convertDateTimeToServer } from "app/shared/util/date-utils"
import EditFileModal from "app/shared/component/edit-file-modal"
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model"
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model"
import { ITenderAnswerDoc } from "app/shared/model/microprovider/tender-answer-doc.model"
import FileItem from "app/shared/component/file-item"
import { DeleyUnit } from "app/shared/model/enumerations/deley-unit.model"
import { DeleyUnity } from "app/shared/model/enumerations/deley-unity.model"
import { FileEntityTag } from "app/shared/model/file-chunk.model"
import MyCustomRTE from "app/shared/component/my-custom-rte"

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
        background: theme.palette.grey[100],
        color: theme.palette.primary.dark,
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

interface TenderAnswerUpdateProps{
    account:any,
    answer:ITenderAnswer,
    locked?:boolean,
    onSave?:Function,
    onClose?: Function,
    onNext?: Function,
    onPreview?: Function,
}

export const TenderAnswerUpdate = (props: TenderAnswerUpdateProps) =>{
    const { account, locked } = props;
    const [isNew, setIsNew] = useState(!props.answer || !props.answer.id);
    const [answer, setAnswer] = useState<ITenderAnswer>(props.answer);
    const [loading, setLoading] = useState(false); 
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [openFilesEditor, setOpenFileEditor] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<ITenderDoc>(null);
    const [answersDocs, setAnswerDocs] = useState<ITenderAnswerDoc[]>([]);
    const [updated, setUpdated] = useState(false);
    const [docLoading, setDocLoading] = useState(false);
    const [answerContent, setContent] = useState(null);

    const isExpired = (answer && answer.tender )? (answer.tender.expireAt && (new Date()) > convertDateTimeToServer(answer.tender.expireAt)) : true;

    const isInValidForm = (!answer || !answer.tender || (answer.tender && answer.tender.executionDeleyRequired && !answer.executionDeley))

    const classes = useStyles();

    const getAnswerDocs = () =>{
        if(answer && answer.id){
            setDocLoading(true)
            axios.get<ITenderAnswerDoc[]>(`${API_URIS.tenderAnswerDocApiUir}/?tenderAnswerId.equals=${answer.id}`)
                .then(res =>{
                    if(res.data)
                    setAnswerDocs([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setDocLoading(false))
        }
    }

    useEffect(() =>{
        setIsNew(!props.answer || !props.answer.id)
        setAnswer(props.answer)
        setSubmited(false);
        setSuccess(false)
        getAnswerDocs();
    }, [])


    const handleRemove = (deletedId?: any) =>{
        if(deletedId){
            const docsToDelete = answersDocs.filter(d => d.fileId === deletedId);
            [...docsToDelete].map(item =>{
                if(item && item.id){
                    axios.delete<ITenderAnswerDoc[]>(`${API_URIS.tenderAnswerDocApiUir}/${item.id}`)
                        .then(() =>{}).catch((e) => console.log(e)).finally(() =>{})
                }
            })
        }
        setUpdated(true)
        setAnswerDocs([...answersDocs.filter(ad => ad.fileId !== deletedId)]);
    }

    const handleFilesSaved = (savedFiles?: IMshzFile[]) =>{
        if(savedFiles && savedFiles.length !== 0){
            const newFiles = savedFiles.map(sf => {
                const aDoc: ITenderAnswerDoc = {
                    fileId: sf.id,
                    name: sf.name,
                    tenderDoc: selectedDoc,
                }
                return aDoc;
            })
            setUpdated(true)
            setAnswerDocs([...answersDocs, ...newFiles]);
        }
        setOpenFileEditor(false);
    }

    const saveAnswerDocs = (ta: ITenderAnswer) =>{
        if(ta && answersDocs){
            answersDocs.filter(item => !item.tenderAnswer).map(item =>{
                const entity: ITenderAnswerDoc = {
                    ...item,
                    tenderAnswer: ta,
                };
                const request = entity.id ? axios.put<ITenderAnswer>(`${API_URIS.tenderAnswerDocApiUir}`, cleanEntity(entity))
                                        : axios.post<ITenderAnswer>(`${API_URIS.tenderAnswerDocApiUir}`, cleanEntity(entity))
                request.then(() =>{
                    setUpdated(true)
                }).catch(e => console.log(e));
            })
        }
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setSubmited(true);
        setSuccess(false)
        setShowMessage(false)
        if(updated){
            setUpdated(false);
            if(answer && answer.tender && answer.providerId && !isInValidForm){
                if(!answer.tender.executionDeleyRequired || (answer.tender.executionDeleyRequired && answer.executionDeley)){
                    setLoading(true)
                    const entity :ITenderAnswer = {
                        ...answer,
                        storeAt: isNew ? new Date().toISOString() : answer.storeAt,
                        executionDeleyUnity: answer.executionDeleyUnity || DeleyUnity.DAY,
                        content: answerContent || answer.content,
                    }
                    const request = isNew ? axios.post<ITenderAnswer>(`${API_URIS.tenderAnswerApiUir}`, cleanEntity(entity))
                                          :  axios.put<ITenderAnswer>(`${API_URIS.tenderAnswerApiUir}`, cleanEntity(entity))
                    request.then(res =>{
                        if(res.data && res.data.id){
                            setSuccess(true);
                            saveAnswerDocs(res.data);
                            if(props.onSave)
                                props.onSave(res.data, isNew);
                            if(props.onNext)
                                props.onNext();
                        }
                    }).catch(e => {
                        setSuccess(false);
                        console.log(e)
                    }).finally(() =>{
                        setLoading(false);
                        setShowMessage(true)
                    })           
                }
            }
        }else{
            if(props.onNext)
                props.onNext();
        }
    }

    const handleOpenFileEditor = (doc?: ITenderDoc) =>{
        setSelectedDoc(doc);
        setOpenFileEditor(true);
    }

    const handleChangeDeleyUnity = (e) =>{
        const value = e.target.value;
        setUpdated(true)
        if(value === DeleyUnity.DAY.toString())
            setAnswer({...answer, executionDeleyUnity: DeleyUnity.DAY})
        else if(value === DeleyUnity.MONTH.toString())
            setAnswer({...answer, executionDeleyUnity: DeleyUnity.MONTH})
        else if(value === DeleyUnit.YEAR.toString())
            setAnswer({...answer, executionDeleyUnity: DeleyUnity.YEAR})
        else
            setAnswer({...answer, executionDeleyUnity: DeleyUnity.DAY})
    }

    return (
        <React.Fragment> 
                <EditFileModal 
                    open={openFilesEditor} 
                    selectMultiple 
                    withClearPreviewerItem
                    onSaved={handleFilesSaved} 
                    onCloseNoCancelSaving={() => setOpenFileEditor(false)}
                    entityTagName={FileEntityTag.tenderAnswerDoc}
                    entityId={selectedDoc && selectedDoc.id}
                />
                <Card className={classes.card}>
                    <CardHeader 
                        title={translate("microgatewayApp.microproviderTenderAnswer.home.createOrEditLabel")}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={
                            props.onClose ?(
                                <IconButton 
                                    color="inherit"
                                    onClick={() => props.onClose()}>
                                    <Close />
                                </IconButton>
                            ): ''
                        }
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
                                {(answer.tender && answer.tender.executionDeleyRequired )&& 
                                <Grid item xs={12}>
                                    <Grid container spacing={1} justify="center" alignItems="flex-start">
                                        <Grid item xs={7} sm={8}>
                                            <FormControl fullWidth error={submited && !answer.executionDeley} margin="dense">
                                                <TextField
                                                    variant="outlined"
                                                    value={answer.executionDeley}
                                                    error={submited && !answer.executionDeley}
                                                    label={translate("microgatewayApp.microproviderTenderAnswer.executionDeley")}
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={(e) => {
                                                        setAnswer({...answer, executionDeley: parseInt(e.target.value, 10)})
                                                        setUpdated(true)
                                                    }}
                                                />
                                            {(submited && !answer.executionDeley) && <FormHelperText>{translate("_global.form.helpersTexts.required")}</FormHelperText>}
                                            {(!submited || answer.executionDeley) && <FormHelperText>* {translate("_global.label.deleyEwexutionHelper")}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} sm={4}>
                                            <FormControl fullWidth>
                                                <InputLabel id="executionDeleyUnity-label" shrink>
                                                    {translate("microgatewayApp.microproviderTenderAnswer.executionDeleyUnity")}
                                                </InputLabel>
                                                <Select
                                                    value={answer.executionDeleyUnity ? answer.executionDeleyUnity.toString(): answer.executionDeleyUnity}
                                                    onChange={handleChangeDeleyUnity}
                                                    labelId="executionDeleyUnity-label"
                                                    label={translate("microgatewayApp.microproviderTenderAnswer.executionDeleyUnity")}
                                                    >
                                                    <MenuItem>---Select---</MenuItem>
                                                    <MenuItem value={DeleyUnity.DAY.toString()} className="text-normal">{translate("_global.deleyUnit.DAY")}</MenuItem>
                                                    <MenuItem value={DeleyUnity.MONTH.toString()}>{translate("_global.deleyUnit.MONTH")}</MenuItem>
                                                    <MenuItem value={DeleyUnity.YEAR.toString()}>{translate("_global.deleyUnit.YEAR")}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>}
                                <Grid item xs={12}>
                                    <MyCustomRTE 
                                        content={answerContent || answer.content}
                                        label={translate("microgatewayApp.microproviderTender.content")}
                                        onSave={value => {
                                            setContent(value)
                                            setUpdated(true)
                                        }}
                                        editorMinHeight={70}
                                        editorMaxHeight={300}
                                        labelProps={{
                                            color: 'primary'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <List>
                                        <ListItem>
                                            <ListItemText 
                                                primary={translate("_tender.additionalDocs")}
                                            />
                                            {!isExpired && <ListItemSecondaryAction>
                                                <Tooltip
                                                        title={translate("_global.label.add")}
                                                        onClick={() => handleOpenFileEditor(null)}>
                                                        <IconButton color="primary">
                                                            <AttachFile />
                                                        </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>}
                                        </ListItem>
                                        <ListItem> 
                                            <ListItemText 
                                                primary={
                                                <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                                    flexWrap="wrap" overflow="auto">
                                                { answersDocs.filter(ad => !ad.tenderDoc)
                                                    .map((item, i) => (
                                                        <FileItem key={i} name={item.name} iconSize="2x"
                                                            mshzFileId={item.fileId} iconClassName="m-2" 
                                                            readonly={isExpired}
                                                            onRemove={handleRemove}
                                                            rootBoxProps={{
                                                                m:1,
                                                                width:100,
                                                            }}/>
                                                    )) }
                                                </Box>
                                            } />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="medium">
                                        <Box width={1} mt={1} display="flex" justifyContent="space-between">
                                            <Box p={0} m={0}>
                                                {props.onPreview && 
                                                    <IconButton color="primary"  onClick={() => props.onPreview()} size="small">
                                                        <KeyboardArrowLeft />
                                                        <Typography className="ml-2">{translate("_global.label.back")}</Typography>
                                                    </IconButton>
                                                }
                                            </Box>
                                            {!isExpired && <>
                                                {!props.onNext ? (
                                                    <Fab color="primary" type="submit" variant="extended" disabled={isInValidForm}>
                                                        <Typography className="mr-2">{translate("entity.action.save")}</Typography><Save />
                                                    </Fab>
                                                ):(
                                                    <IconButton color="primary" type="submit" size="small"
                                                        disabled={isInValidForm}>
                                                        <Typography className="mr-2">{translate("_global.label.next")}</Typography>
                                                        <KeyboardArrowRight />
                                                    </IconButton>
                                                )}
                                            </>}
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

export default TenderAnswerUpdate;