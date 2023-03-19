import { Backdrop, Card, CardContent, CardHeader, IconButton, makeStyles, Modal, Slide } from "@material-ui/core";
import React from "react";
import { translate } from "react-jhipster";
import { Close } from "@material-ui/icons";
import FileManager, { FileManagerProps } from "app/shared/component/file-manager";
import { IMshzFile } from "../model/microfilemanager/mshz-file.model";
import { FileEntityTag } from "../model/file-chunk.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '30%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
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
      borderRadius: '0 0 15px 15px',  
    },
}))

interface ModalFileManagerProps extends FileManagerProps{
    open?: boolean,
    title?:any,
    entityId: any,
    entityTagName: FileEntityTag,
    onClose:Function,
}

export const ModalFileManager = (props: ModalFileManagerProps) =>{
    const { open, files, title } = props;
    const classes = useStyles();

    const handleClose = () => props.onClose();

    const handleRemove = (deletedId?:any) =>{
        if(props.onRemove)
            props.onRemove(deletedId);
    }
    
    const handleSave = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0 && props.onSave)
            props.onSave(saved);
    }

    return (
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout:300}}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
             >
                <Slide in={open} timeout={300} unmountOnExit>
                 <Card className={classes.card}>
                     <CardHeader 
                        title={title}
                        titleTypographyProps={{ variant: 'h4' }}
                        action={<IconButton color="inherit" onClick={handleClose}><Close /></IconButton>}
                        className={classes.cardheader}
                     />
                     <CardContent className={classes.cardcontent}>
                         <FileManager 
                            files={files}
                            entityId={props.entityId}
                            entityTagName={props.entityTagName}
                            className={props.className}
                            fileItemBoxProps={props.fileItemBoxProps}
                            fileItemClassName={props.fileItemClassName}
                            iconClassName={props.iconClassName}
                            readonly={props.readonly}
                            removeIconProps={props.removeIconProps}
                            rootBoxProps={props.rootBoxProps}
                            selectMultiple={props.selectMultiple}
                            withClearPreviewerItem={props.withClearPreviewerItem}
                            onRemove={handleRemove}
                            onSave={handleSave}
                            iconSize={props.iconSize}
                            loading={props.loading}
                            notFound={props.notFound}
                         />
                     </CardContent>
                 </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

ModalFileManager.defaultProps={
    title: translate("_global.fileManager.home.title"),
    iconSize:"3x",
    iconClassName:"text-primary",
    fileItemBoxProps:{
        width: 100,
        p:1,
        m:1.5,
    },
    deleteQuestion: translate("_global.fileManager.delete.question"),
    loading:false,
}

export default ModalFileManager;
