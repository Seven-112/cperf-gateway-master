import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, Fab, List, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import React, { useState } from "react";
import { translate } from "react-jhipster";
import { FileEntityTag } from "../model/file-chunk.model";
import { IMshzFile } from "../model/microfilemanager/mshz-file.model";
import EditFileModal from "./edit-file-modal";
import FileItem from "./file-item";

export interface FileManagerProps{
    files:IMshzFile[],
    entityId: any,
    entityTagName: FileEntityTag,
    readonly?:boolean,
    className?:string,
    fileItemClassName?:string,
    iconClassName?:string,
    iconSize?:SizeProp,
    rootBoxProps?:BoxProps,
    fileItemBoxProps?:BoxProps,
    removeIconProps?:FontAwesomeIconProps,
    selectMultiple?:boolean,
    withClearPreviewerItem?:boolean,
    deleteQuestion?:string,
    notFound?:any,
    loading?:boolean,
    onRemove?:Function
    onSave?: Function,
}

const FileManager = (props: FileManagerProps) =>{
    const { files, className, rootBoxProps, readonly, selectMultiple, withClearPreviewerItem } = props;
    const [open, setOpen] = useState(false);

    const serviceIsAvalailble = serviceIsOnline(SetupService.FILEMANAGER);

    const handleSave = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0 && props.onSave)
            props.onSave(saved);
        setOpen(false);
    }

    const handleRemove = (deletedId?:any) =>{
        if(props.onRemove)
            props.onRemove(deletedId);
    }

    return (
        <React.Fragment>
            {!readonly && <EditFileModal
                open={open}
                selectMultiple={selectMultiple}
                withClearPreviewerItem={withClearPreviewerItem}
                entityTagName={props.entityTagName}
                entityId={props.entityId}
                onSaved={handleSave}
                onCloseNoCancelSaving={() => setOpen(false)}
             />}
             {props.loading && <Box width={1} textAlign="center" m={2}>
                <Typography variant="h5" color="primary">Loading....</Typography>     
            </Box>}
            <Box width={1} display="flex" justifyContent="center" flexDirection="column" alignItems="center" flexWrap="wrap" overflow="auto">
                    {!readonly && <Fab color="primary" onClick={() => setOpen(true)}><Add /></Fab>}
                    {(files && files.length !== 0) &&
                        <List>
                            {files.map((f, index) =><FileItem key={index}
                                name={f.name} id={f.id} mshzFileId={f.id}
                                className={props.fileItemClassName} iconClassName={props.iconClassName}
                                iconSize={props.iconSize} readonly={readonly} onRemove={handleRemove}
                                removeIconProps={props.removeIconProps} rootBoxProps={props.fileItemBoxProps}
                                deleteQuestion={props.deleteQuestion}
                             />)}
                        </List>
                    }
                    {(!files || files.length === 0) && <Box width={1} textAlign="center" mt={3}>
                        <Typography>{props.notFound}</Typography>
                    </Box>}
            </Box>
        </React.Fragment>
    )
}

FileManager.defaultProps={
    deleteQuestion: translate("_global.fileManager.delete.question"),
    loading:false,
    notFound:translate("_global.fileManager.home.notFound"),
}

export default FileManager;