import { Box, IconButton, Typography, TypographyProps } from "@material-ui/core";
import { Attachment, InsertDriveFile } from "@material-ui/icons";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { navigateToBlankTab } from "app/shared/util/helpers";
import React from "react";
import { translate } from "react-jhipster";

export interface FieldNameVisualizerProps{
    field: IDynamicField,
    typographyProps?: TypographyProps
}

export const FieldNameVisualizer = (props: FieldNameVisualizerProps) =>{
    const {field, typographyProps} = props;
    
    const handleOpenFile = () =>{
        if(field && field.docId)
            navigateToBlankTab(`file-viewer/${field.docId}`)
    }

    return (
        <React.Fragment>
            {field && <Box display="flex" flexWrap="wrap" overflow="auto" alignItems="ceter">
                    {field.name && <Typography className="mr-2" {...typographyProps} >
                        {`${field.name} ${field.required ? '*' : ''}`}
                    </Typography>}
                    {field.docId && 
                    <IconButton
                        size="small"
                        className="p-0 m-0"
                        title={translate("_global.label.descriptionFile")}
                        onClick={handleOpenFile}>
                            <InsertDriveFile />
                    </IconButton>}
            </Box>}
        </React.Fragment>
    )
}

export default FieldNameVisualizer;