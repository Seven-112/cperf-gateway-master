import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faImage, faMinus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, IconButton, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import React from "react"
import { useState } from "react";
import { translate } from "react-jhipster";
import { API_URIS, navigateToBlankTab } from "../util/helpers";
import EntityDeleterModal from "./entity-deleter-modal";

const useStyles = makeStyles(theme =>({
    icon:{
        cursor: 'pointer',
    },
    buttonBox:{
        
    },
    removeIcon:{
        color: theme.palette.secondary.main,
    },
    truncate:{
        maxWidth: '50%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },

      listItem:{
        width:'100%',
      },
}))

interface FileItemProps{
    id?:any,
    name:string,
    readonly?:boolean,
    mshzFileId?:any,
    className?:string,
    iconClassName?:string,
    iconSize?:SizeProp,
    rootBoxProps?:BoxProps,
    deleteQuestion?:string,
    removeIconProps?:FontAwesomeIconProps,
    onRemove?:Function
}

export const FileItem = (props: FileItemProps) =>{
    const {name, id, readonly, mshzFileId, iconClassName, iconSize, rootBoxProps, removeIconProps} = props;
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const viewFile = () => mshzFileId ? navigateToBlankTab(`file-viewer/${mshzFileId}`) : null;
    const ext = name ? name.substring(name .lastIndexOf('.')+1,name.length).toLowerCase() : '';

    const Illustartion = () =>{
        if(ext && ext.length !== 0){
            if(["jpg", "jpeg", "gif", "png","svg"].includes(ext.toLocaleLowerCase()))
                return <FontAwesomeIcon icon={faFileImage} className={classes.icon+' '+iconClassName} 
                 title={name} size={iconSize} onClick={viewFile}/>;
            if(ext.includes('pdf'))
                return <FontAwesomeIcon icon={faFilePdf} className={classes.icon+' '+iconClassName} 
                    title={name}   size={iconSize}  onClick={viewFile}/>;
            if(ext.includes('doc') || ext.includes('docx'))
                return <FontAwesomeIcon icon={faFileWord} className={classes.icon+' '+iconClassName}
                 title={name}   size={iconSize}  onClick={viewFile}/>;
            if(ext.includes('xls') || ext.includes('xls'))
                return <FontAwesomeIcon icon={faFileExcel} className={classes.icon+' '+iconClassName}
                     title={name}   size={iconSize}  onClick={viewFile}/>;
            return <FontAwesomeIcon icon={faFile} className={classes.icon+' '+iconClassName}
                 title={name}   size={iconSize} onClick={viewFile}/>;
        }
        return <FontAwesomeIcon icon={faFile} className={classes.icon+' '+iconClassName}
             title={name} size={iconSize}  onClick={viewFile}/>;
    }

    const handleDelete = (deletedId?: any) =>{
        if(deletedId){
            if(props.onRemove)
                props.onRemove(deletedId);
            setOpen(false);
        }
    }

    return (
        <React.Fragment>
            {(mshzFileId && serviceIsOnline(SetupService.FILEMANAGER)) &&
             <EntityDeleterModal
                 open={open}
                 entityId={mshzFileId}
                 urlWithoutEntityId={API_URIS.mshzFileApiUri}
                 onClose={() => (setOpen(false))}
                 onDelete={handleDelete}
                 question={props.deleteQuestion}
                 />
            }
            <ListItem className={classes.listItem} button onClick={viewFile}>
                <ListItemText 
                    primary={<Typography className="mr-3">{name}</Typography>}
                />
                <ListItemSecondaryAction>
                    {(!readonly && mshzFileId) && <IconButton title={translate("entity.action.delete")} onClick={() => setOpen(true)}>
                            <FontAwesomeIcon icon={faMinusCircle} size="1x" className={classes.removeIcon} {...removeIconProps}/>
                        </IconButton>}
                </ListItemSecondaryAction>
            </ListItem>
        </React.Fragment>
    )

}

FileItem.defaultProps={
    iconSize: "sm",
    deleteQuestion: translate("_global.fileManager.delete.question"),
}

export default FileItem;