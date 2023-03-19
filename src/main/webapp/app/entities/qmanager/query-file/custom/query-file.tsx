import { makeStyles } from "@material-ui/core";
import { getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { translate } from "react-jhipster";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IQuery } from "app/shared/model/qmanager/query.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

const useStyles = makeStyles(theme =>({
}))

interface QueryFileProps{
    query: IQuery,
    open?: boolean,
    readonly?:boolean,
    onClose?:Function
}

export const QueryFile = (props: QueryFileProps) =>{
    const { open } = props;
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const getFiles = () =>{
        if(props.query && props.query.id){
            setLoading(false)
            getMshzFileByEntityIdAndEntityTag(props.query.id, FileEntityTag.query)
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
    }, [props.query])

    const handleDelete = (deletedId?:any) =>{
        if(deletedId){
            setFiles(files.filter(f => f.id !== deletedId));
        }
    }

    const handleSave = (saved?:IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            setFiles([...files, ...saved]);
        }
    }

    const handleClose = () => props.onClose(files ? files.length : 0);

    return (
        <React.Fragment>
                <ModalFileManager
                    files={[...files]}
                    entityId={props.query ? props.query.id : null}
                    entityTagName={FileEntityTag.query}
                    open={open} 
                    onClose={handleClose}
                    loading={loading} 
                    title={translate("_tender.files")}
                    selectMultiple
                    withClearPreviewerItem
                    readonly={props.readonly}
                    onRemove={handleDelete}
                    onSave={handleSave}
                />
        </React.Fragment>
    )
}

export default QueryFile;
