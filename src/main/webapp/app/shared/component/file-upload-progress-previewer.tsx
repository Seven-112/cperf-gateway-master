import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, colors, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Close, Visibility } from "@material-ui/icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import { IMshzFile } from "../model/microfilemanager/mshz-file.model";
import { API_URIS, navigateToBlankTab } from "../util/helpers";
import EntityDeleterModal from "./entity-deleter-modal";
import { getFileFaIcon } from "./file-previewer";

const useStyles = makeStyles({
    root:{
        backgroundColor: colors.grey[200],
        '&:hover':{
            backgroundColor: colors.grey[300],
        }
    }
});

interface UploadProgressPreviewerProps{
    onRemove?: Function,
    preventOnRemove?: boolean,
    boxProps?: BoxProps
}


interface MshzFileUploadProgressPreviewerProps extends UploadProgressPreviewerProps{
    file: IMshzFile
}

export const MshzFileUploadProgressPreviewer = (props: MshzFileUploadProgressPreviewerProps) =>{
    const { file, preventOnRemove } = props;
    const [openToRemove, setOpenToRemove] = useState(false);
    const classes = useStyles();

    const handleOpen = () =>{
        if(file && file.id)
            navigateToBlankTab(`/file-viewer/${file.id}`)
    }

    const onRemove = (deletedId) =>{
        setOpenToRemove(false);
        if(props.onRemove)
            props.onRemove(deletedId);
    }

    return (
        <React.Fragment>
            {file && <>
             {serviceIsOnline(SetupService.FILEMANAGER) &&
             <EntityDeleterModal 
                entityId={file.id}
                urlWithoutEntityId={API_URIS.mshzFileApiUri}
                open={openToRemove}
                onClose={() => setOpenToRemove(false)}
                onDelete={onRemove}
             />}
             <Box width={1}
                display="flex" 
                justifyContent="flex-start"
                alignItems="center" flexWrap="wrap"
                p={0.7}
                className={classes.root}
                {...props.boxProps}>
                 <Box flexGrow={1} display="flex" alignItems="center" flexWrap="wrap">
                    <FontAwesomeIcon icon={getFileFaIcon(file.name, file.fDataContentType)} 
                        style={{ fontSize: 18, marginRight: 1, paddingLeft: 2,}} />
                    <Typography variant="h4" color="primary">
                        <span className="badge badge-default">{file.name}</span>
                    </Typography>
                 </Box>
                 <Box display={"flex"} p={0}
                     justifyContent="flex-end" alignItems={"center"} flexWrap="wrap">
                    {(file && file.id) &&
                        <Tooltip title={translate("entity.action.view")}
                            onClick={handleOpen}>
                            <IconButton size="small"
                                className="p-0 mr-2" 
                                onClick={handleOpen}>
                                <Visibility style={{ fontSize: 20 }}/>
                        </IconButton>
                        </Tooltip>}
                    {(!preventOnRemove && props.onRemove) &&
                        <Tooltip title={translate("entity.action.delete")}
                            onClick={() => setOpenToRemove(true)}>
                            <IconButton size="small"
                                className="p-0" color="secondary">
                                <Close style={{ fontSize: 20 }}/>
                            </IconButton>
                        </Tooltip>
                    }
                 </Box>
              </Box>
              </>
            }
        </React.Fragment>
    )
}

interface FileUploadProgressPreviewerProps extends UploadProgressPreviewerProps{
    file: File,
    saveProgress?: number,
}

export const FileUploadProgressPreviewer = (props: FileUploadProgressPreviewerProps) =>{
    const { file, preventOnRemove } = props;
    const classes = useStyles();

    const getFileSizeWiUnity = () =>{
        if(file && file.size){
            if(file.size < 1000)
              return `${file.size.toFixed(2)} octets`;
            if(file.size < (1000  * 1000))
                return `${Math.round(file.size/(1000)).toFixed(2)} Ko`;
            if(file.size < (1000 * 1000 * 1000))
                return `${Math.round(file.size/(1000 * 1000)).toFixed(2)} Mo`;
            if(file.size < (1000 * 1000 * 1000 * 1000))
                return `${Math.round(file.size/(1000 * 1000 * 1000)).toFixed(2)} Go`;
            return `${Math.round(file.size/(1000 * 1000 * 1000 * 1000)).toFixed(2)} To`;
        }
        return "";
    }

    return (
        <React.Fragment>
            {file &&
             <Box width={1}
                display="flex" 
                justifyContent="flex-start"
                alignItems="center" flexWrap="wrap"
                p={0.7}
                className={classes.root}
                {...props.boxProps}>
                 <Box flexGrow={1} display="flex" alignItems="center" flexWrap="wrap">
                    <FontAwesomeIcon icon={getFileFaIcon(file.name, file.type)} 
                        style={{ fontSize: 18, marginRight: 1, paddingLeft: 2,}} />
                    <Typography variant="h4" color="primary">
                        <span className="badge badge-default">{file.name}</span>
                    </Typography>&nbsp;
                    <Typography variant="h4" className="mr-1"><span className="badge badge-default">{`( ${getFileSizeWiUnity()} )`}</span></Typography>
                 </Box>
                 {(!preventOnRemove && props.onRemove) &&
                    <IconButton size="small"
                         className="p-0" 
                         onClick={() => props.onRemove(file)}>
                        <Close style={{ fontSize: 20 }}/>
                </IconButton>}
              </Box>
            }
        </React.Fragment>
    )
}

FileUploadProgressPreviewer.defaultProps ={
    saveProgress: 0,
}

export default FileUploadProgressPreviewer;