import { IDynamicField } from "app/shared/model/dynamic-field.model";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, makeStyles } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { translate } from "react-jhipster";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";

const useStyles = makeStyles(theme =>({
    truncate:{
        maxWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
}))

interface DynamicFileFieldProps extends StateProps{
    field: IDynamicField,
    fileEntityId?: any,
    readonly?: boolean,
    onSave?: Function,
}

export const DynamicFileField = (props: DynamicFileFieldProps) =>{
    const { readonly, field } = props;
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const fileTag = FileEntityTag.dynamicFiled;

    const getFiles = () =>{
        if(props.fileEntityId && props.fileEntityId){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(props.fileEntityId, fileTag)
            .then(res => setFiles(res.data))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getFiles();
    }, [])

    const handleSave = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            setFiles([...saved, ...files])
            if(props.onSave)
                props.onSave(saved, field)
        }
    }

    const handleDelete = (deletedId?: any) =>{
        if(deletedId && !readonly){
            setFiles(files.filter(f => f.id !== deletedId));
        }
    }

    return (
        <React.Fragment>
          {field && <> 
            <ModalFileManager 
                open={open}
                files={[...files]}
                entityId={props.fileEntityId || field.id}
                entityTagName={FileEntityTag.dynamicFiled}
                notFound={"no content"}
                onRemove={handleDelete}
                onSave={handleSave}
                onClose={() =>  setOpen(false)}
                readonly={readonly}
                selectMultiple
                title={`${field.name} : ${translate("_global.label.files")}`}
            />
            <Box width={1} display="flex" 
                justifyContent="center" alignItems="center" flexWrap="wrap">
                {(loading || props.saving) ? (
                    <CircularProgress style={{ width: 25, height: 25 }} />
                ) : (
                    <IconButton 
                        color="primary"
                        className="ml-3"
                        size="small"
                        onClick={() => setOpen(!open)}>
                            {open ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                )}
            </Box>
            </>}
        </React.Fragment>
    )
}

const mapStateProps = ({ fileUpload }: IRootState) =>({
    saving: fileUpload.saving,
})

type StateProps = ReturnType<typeof mapStateProps>;

export default connect(mapStateProps, null)(DynamicFileField);