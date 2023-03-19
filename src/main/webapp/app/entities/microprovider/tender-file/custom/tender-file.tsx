import { makeStyles } from "@material-ui/core";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { translate } from "react-jhipster";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

const useStyles = makeStyles(theme =>({
}))

interface TenderFileProps{
    tender: ITender,
    open?: boolean,
    readonly?:boolean,
    onClose?:Function
}

export const TenderFile = (props: TenderFileProps) =>{
    const { tender, open } = props;
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const fileTag = FileEntityTag.tender;

    const getFiles = () =>{
        if(tender && tender.id){
            setLoading(false)
            getMshzFileByEntityIdAndEntityTag(tender.id, fileTag)
                .then(res =>{
                    if(res.data)
                        setFiles([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    
    useEffect(() =>{
        if(open){
            getFiles();
        }
    }, [props.tender, props.open])

    const handleDelete = (deletedId?:any) =>{
        if(deletedId){
            setFiles(files.filter(f => f.id !== deletedId));
        }
    }

    const handleSave = (saved?:IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            setFiles([...files, ...saved])
        }
    }

    const handleClose = () => props.onClose(files ? files.length : 0);

    return (
        <React.Fragment>
                <ModalFileManager
                    files={[...files]}
                    open={open} 
                    onClose={handleClose}
                    loading={loading} 
                    title={translate("_tender.files")}
                    selectMultiple
                    withClearPreviewerItem
                    readonly={props.readonly}
                    entityId={tender ? tender.id : null}
                    entityTagName={fileTag}
                    onRemove={handleDelete}
                    onSave={handleSave}
                />
        </React.Fragment>
    )
}

export default TenderFile;
