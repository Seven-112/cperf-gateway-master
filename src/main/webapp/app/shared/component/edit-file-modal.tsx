import { Box, Checkbox, CircularProgress, CircularProgressProps, FormControlLabel, Grid, IconButton, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { translate } from 'react-jhipster';
import { IMshzFile } from '../model/microfilemanager/mshz-file.model';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DescriptionIcon from '@material-ui/icons/Description';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URIS } from '../util/helpers';
import { ACCEPTED_FILE_FORMAT } from '../util/file-format-accepted';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastOptions } from 'react-toastify';
import { FileUploadProgressPreviewer } from './file-upload-progress-previewer';
import { IRootState } from '../reducers';
import { setFileUploadSaving, associateFilesToEntity,
         setFileUploadWillAssociateEntityTagName,
         setFileUploadSavingWillTakeAMoment
       } from '../reducers/file-upload-reducer';
import { connect } from 'react-redux';
import { SaveButton } from './custom-button';
import { LargeFileUploadingAlterInfo, UploadingFilesOrSavingShortsFilesProgress } from './edit-file-progresses';
import { FileEntityTag, IFileChunkMetadata } from '../model/file-chunk.model';
import MyCustomModal from './my-custom-modal';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import { ServiceUnavailable } from './service-unavalaible';

const useStyles = makeStyles((theme) =>({
    card:{
        maxWidth: '35%',
        [theme.breakpoints.down('sm')] : {
            maxWidth: '90%',
        },
    },
    formContent:{
        padding:10,
        [theme.breakpoints.down('sm')] : {
            padding:2,
        },
    },
    previewer:{
        overflow:'auto',
        minHeight: '3%',
        maxHeight: '30%',
    },
}));

interface CircularProgressWithLabelProps{
    value?: number,
    hidePercentagePrefix?: boolean,
    progressProps?: CircularProgressProps
}

// this component is used out
export function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={props.value} {...props.progressProps} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">
              {`${Math.round(props.value)}${props.hidePercentagePrefix ? '' : '%'}`}</Typography>
        </Box>
      </Box>
    );
  }


export interface IEditFileModalRouteProps{
    id?: any,
    fileUri?: string,
    onCloseUri?: string,
    selectMultiple?: boolean,
    withClearPreviewerItem?: boolean,
    accept?: string,
    locationState?: any;
}

export interface IEditModalFileProps extends StateProps, DispatchProps{
    open?: boolean,
    selectMultiple?: boolean,
    withClearPreviewerItem?: boolean,
    accept?: string,
    entityId?: number,
    entityTagName: FileEntityTag,
    onSaved?: Function,
    onCloseNoCancelSaving?: Function
}

export const EditFileModal = (props: IEditModalFileProps) =>{
    const { open, saving, account, entityTagName, entityId, savingWillTakeAMoment } = props;
    const classes = useStyles();
    const [files, setFiles] = useState<File[]>([]);
    const [multiple, setMultiple] = useState(props.selectMultiple);
    const [uploadProgressValue, setUploadProgressValue] = useState(0);
    const [savingProgress, setSavingProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [accept, setAccept] = useState("*");
    const [withClearPreviewerItem] = useState(props.withClearPreviewerItem);
    const inputFileRef = useRef(null);
    const [names, setNames] = useState("");

    const serviceIsAvalailble = serviceIsOnline(SetupService.FILEMANAGER)

    const chunkSize = 1000 * 1000 * 10; // 10MB;

    const initializeIndicators = () =>{
        setUploading(false)
        setUploadProgressValue(0);
    }
    
    useEffect(() =>{
        setMultiple(props.selectMultiple);
        setAccept(props.accept ? props.accept : "*")
        props.setFileUploadWillAssociateEntityTagName(props.entityTagName);
    },[]);

    const calculUplodedFileSize = () =>{
        const uploadedSize = [...files].map(f => f.size)
                        .reduce((accumulateur,size) => accumulateur + size, 0);
        const uploadSizeIsLarge = uploadedSize && uploadedSize >= (1000 * 1000 * 3); // >= 3MB
        props.setFileUploadSavingWillTakeAMoment(uploadSizeIsLarge);

    }

    useEffect(() =>{
        calculUplodedFileSize();
    }, [files])

    const handleClose = (saved: IMshzFile[]) =>{
        setFiles([]);
        props.setFileUploadSaving(false);
        if(inputFileRef.current)
            inputFileRef.current.value=null;
        initializeIndicators();
        if(props.onSaved)
            props.onSaved(saved);
    }

    const handleCloseNoCancelSaving = () =>{
        if(props.onCloseNoCancelSaving)
            props.onCloseNoCancelSaving();
    }

    const handleClear = () => {
        setFiles([]);
        if(inputFileRef.current)
            inputFileRef.current.value=null;
        initializeIndicators();
    }

    const toggleSelectMutiple = () => setMultiple(!multiple);

    const triggerInputFileClickEvent = () =>{
        if(inputFileRef.current)
            inputFileRef.current.click();
    }

    const onChoosingFiles = e =>{
        setUploadProgressValue(0)
        setUploading(true);
        const uploadedFiles: File[] = e.target.files;
        setFiles([...uploadedFiles]);
        setNames([...uploadedFiles].map(f => f.name).join(";"))
        setUploading(false);
    } 

    const associateUploadedFilesToEntity = (saved: IMshzFile[]) =>{
        if(saved && saved.length && !entityId && account){
            const tag = entityTagName ? entityTagName.toString() : props.entityToAssociateTag;
            props.associateFilesToEntity(props.entityToAssociateId, tag, account.id);
        }
    }

    const finishSave = (saved: IMshzFile[]) =>{
        associateUploadedFilesToEntity(saved);
        const progress = (files && files.length !== 0) ? (((saved.length * 100) / files.length)) : 0;
        setSavingProgress(progress);
        props.setFileUploadSaving(false)
        const toastOptions: ToastOptions = {
            autoClose: false,
        }
        if(progress === 0){
           toast.error(`${translate("_global.flash.message.failed")}`, toastOptions)
        }else if(progress >= 100){
            toast.success(`${translate("_global.label.fileSaveCompleted")}`, toastOptions)
        }else{
            const n = `${saved.length}/${files.length}`;
            toast.warn(`${translate("_global.label.nFilesSaved", {n})}`, toastOptions)
        }

        handleClose(saved);
            
    }

    const postChunk = async (fChunk: IFileChunkMetadata, f: Blob) => {
        if(fChunk && serviceIsAvalailble){
            try {
                const formData = new FormData();
                formData.append('file', f, fChunk.name);
                Object.keys(fChunk).forEach(key => {
                    if(fChunk[key] || fChunk[key] === 0)
                        formData.append(key, fChunk[key].toString())
                });
                const res = await axios.post<IMshzFile>(`${API_URIS.mshzFileApiUri}/uploadChunk`, formData);
                return res.data;
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        return;
    }

    const upload = async (blob: File) =>{
        if(blob){
            const chunks = (blob.size > chunkSize) ? Math.ceil(blob.size/chunkSize) : 1;
            let chunk = 0;
            while (chunk <= chunks) {
                const offset = chunk*chunkSize;
                console.log('current chunk..', chunk, chunks, blob.name);
                try {
                    const blobChunk = blob.slice(offset,offset+chunkSize, blob.type);
                    if(blobChunk){
                            const entity: IFileChunkMetadata = {
                                name: blob.name,
                                chunk, chunks,
                                entityTagName: entityTagName.toString(),
                                userId: account ? account.id : null,
                                entityId,
                            }
                            const res = await postChunk(entity, blobChunk);
                            if(chunk === chunks)
                              return res && res.id ? res : null;
                    }
                } catch (err) {
                    return;
                }
                chunk++;
            }
        }
        return;
    }

    const onSave = () =>{
        setUploadProgressValue(0);
        const promises = [];
        const saved = [];
        if(files.length>0){
            props.setFileUploadSaving(true);
            files.map((f, index) =>{
                   promises.push(
                    upload(f)
                    .then(data => {
                        if(data)
                            saved.push(data)
                    }).catch(err => {
                        console.log(err)
                    })
                    .finally(() =>{
                        const progress = (((index+1) * 100) / files.length);
                        setSavingProgress(progress);
                    })
                   );
            }) // end map
            Promise.all(promises).then(() => finishSave(saved))
        } // end if
    }

    const clearPreviewItem = (fileIndex) =>{
        if(!saving){
            const _files = [...files].filter((f, index) => index !== fileIndex);
            setFiles(_files);
            if(_files.length ===0){
                props.setFileUploadSaving(false);
                setUploading(false)
            }
        }
    }

    const handleModalCloseCtrl = () =>{
        if(props.saving)
            handleCloseNoCancelSaving();
        else
            handleClose([]);
    }

    const defaultFileAccept = ACCEPTED_FILE_FORMAT.join(",");

    return (
        <MyCustomModal
            open={open} 
            onClose={handleModalCloseCtrl}
            avatarIcon={<DescriptionIcon />}
            title={translate("_global.editFile.title")}
            footer={<Box width={1} display={"flex"} justifyContent="flex-end">
                    <SaveButton 
                        hidden={files.length <=0 || saving}
                        disabled={files.length<=0}
                        onClick={onSave}
                    />
            </Box>}
            rootCardClassName={classes.card}
            >
              {serviceIsAvalailble ? <>
                <Grid container spacing={1} alignItems="flex-start">
                    <Box width={1} flexWrap="wrap" justifyContent="center" alignItems="center">
                        <input type="file" hidden name="fdata" ref={inputFileRef}
                            accept={accept || defaultFileAccept}
                            multiple={multiple} onChange={(e)=>onChoosingFiles(e)}/>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="space-around"
                                    alignItems="center"  flexWrap="wrap">
                                {(props.selectMultiple && !saving) &&
                                    <FormControlLabel
                                        control={<Checkbox checked={multiple} onChange={toggleSelectMutiple} />}
                                        label={translate('_global.editFile.selectMultiple')} />}
                                {multiple && <small>{translate('_global.editFile.selectedSize', { size: files.length})}</small>}
                                {!saving &&
                                    <IconButton aria-label="Atach file" 
                                        title="attach file"
                                        className="ml-3"
                                        onClick={triggerInputFileClickEvent} edge="end">
                                        {<AttachFileIcon />}
                                    </IconButton>
                                }
                            </Box>
                        </Grid>
                        {(uploading || saving) && <Grid item xs={12}>
                            {savingWillTakeAMoment && !uploading ? (
                                <LargeFileUploadingAlterInfo />
                            ) : (
                                <UploadingFilesOrSavingShortsFilesProgress 
                                    progress={uploading ? uploadProgressValue : savingProgress}
                                    saving={saving}
                                />
                            )
                            }
                        </Grid>}
                        {(names && uploadProgressValue !== 0 && !saving)&&
                        <Grid item xs={12}>
                            <TextField
                                value={names || ''}
                                label={translate("microgatewayApp.microfilemanagerMshzFile.name")}
                                fullWidth
                                InputLabelProps={{
                                    shrink:true,
                                }}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    endAdornment: names ? <></> :
                                        <InputAdornment position="end">
                                            {names &&
                                                <IconButton aria-label="clear" 
                                                    color="secondary"
                                                    edge="end"
                                                    onClick={handleClear}>
                                                    <ClearIcon/>
                                                </IconButton>
                                            }
                                        </InputAdornment>,
                                }}
                            />
                        </Grid>}
                            <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="space-between"
                                alignItems="center">
                                    {savingWillTakeAMoment ? (
                                        <Box display="flex" alignItems="center" className='maBox'>
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning mr-2"/>
                                            <Typography variant="caption" className="text-warning">{translate("_global.label.executionWillTakeAMoment")}</Typography>
                                        </Box>
                                      ) : ""
                                    }
                            </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    {/** previwer section */}
                    <Grid item xs={12}>
                        <Box width={1} display="flex" justifyContent="center" 
                            alignItems="center" flexWrap="wrap" overflow="auto"
                            minHeight={1} maxHeight={250} pr={1}>
                                {[...files].map((currentFile, index) => (
                                    <FileUploadProgressPreviewer
                                        key={index}
                                        file={currentFile}
                                        onRemove={() => clearPreviewItem(index)}
                                        preventOnRemove={saving}
                                        boxProps={{ mb: 1 }}
                                    />
                                ))}
                        </Box>
                    </Grid>
                    {/** end previwer section */}
                </Grid>
            </> : <ServiceUnavailable />}
        </MyCustomModal>
    );
}

const mapStateToProps = ({ fileUpload, authentication }: IRootState) => ({
    saving: fileUpload.saving,
    savingWillTakeAMoment: fileUpload.savingFileWillTakeAMoment,
    entityToAssociateId: fileUpload.entityToAssociateId,
    entityToAssociateTag: fileUpload.entityToAssicateTagName,
    account: authentication.account,
});
  
const mapDispatchToProps = {
    setFileUploadSaving,
    associateFilesToEntity,
    setFileUploadWillAssociateEntityTagName,
    setFileUploadSavingWillTakeAMoment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EditFileModal);