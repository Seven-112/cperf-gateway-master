import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBan, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Grid, IconButton, IconButtonProps, IconButtonTypeMap, Tooltip, Typography } from "@material-ui/core";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import React from "react";
import { useRef, useState } from "react";
import { IMshzFile } from "../model/microfilemanager/mshz-file.model";
import { convertArrayBufferToByTeArray } from "../util/helpers";

interface FileUploderButtonProps{
    multiple?: boolean,
    iconProps?: FontAwesomeIconProps,
    icon?: IconDefinition,
    buttonProps?: IconButtonProps,
    extensions?: string[],
    tooltip?: string,
    clearTootip?: string,
    shwoUploadedFileName?: boolean,
    canClear?: boolean,
    onUploaded?: Function,
}

export const FileUploaderButton = (props: FileUploderButtonProps) =>{
    
    const { multiple, buttonProps, iconProps, extensions, tooltip } = props;

    const [loading, setLoading] = useState(false);

    const [uploadedFileName, setUploadedFileName] = useState(null);

    const inputRef = useRef(null);

    const defaultExtensions = "image/*";

    const exts = extensions && extensions.length !== 0 ? extensions.join(" ") : defaultExtensions;

    const serviceIsAvailable = serviceIsOnline(SetupService.FILEMANAGER);

    const handleChooseFile = (e) =>{
        e.preventDefault();
        if(inputRef && inputRef.current)
            inputRef.current.click();
    }

    const handleChange = (e) =>{
        setUploadedFileName(null);
        if(props.onUploaded){
            setLoading(true);
            const files: File[] = e.target.files;
            const _files: IMshzFile[] = [];
            const promises = [];
            
            [...files].map((fStream, i) =>{
                promises.push(
                    fStream.arrayBuffer()
                    .then(arrayBuffer =>{
                        const byteArray =  convertArrayBufferToByTeArray(arrayBuffer) ;
                        const mshzFile: IMshzFile = {
                            name: fStream.name,
                            fData: byteArray,
                            fDataContentType: fStream.type
                        }
                        _files.push(mshzFile);
                    }).catch(err => {
                        console.log(err);
                    }).finally(() =>{ })
                )
            })

            Promise.all(promises).then(() =>{
                if(multiple){
                    props.onUploaded([..._files])
                }else{
                    const file = (_files && _files.length !== 0) ? _files[0] : null;
                    props.onUploaded(file);
                }
                setUploadedFileName([..._files].map(f => f.name).join("; "));
                setLoading(false);
            })
        }
    }

    const handleClear = () =>{
        setUploadedFileName(null);
        if(props.onUploaded){
            props.onUploaded(multiple ? [] : null);
        }
    }

    return (
        <React.Fragment>
            <input ref={inputRef} type="file" 
                multiple={multiple} accept={exts}
                hidden
                onChange={(e) => handleChange(e)}
              />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box width={1} display="flex" 
                    justifyContent={"center"} alignItems="center" flexWrap={"wrap"}>
                    {!loading ? (
                        <>
                        {serviceIsAvailable &&
                        <Tooltip title={tooltip || ''} onClick={handleChooseFile}>
                            <IconButton
                                color="primary"
                                className="p-0"
                                size="small" {...buttonProps}>
                                <FontAwesomeIcon
                                    icon={props.icon || faCamera}
                                    {...iconProps}
                                />
                            </IconButton>
                        </Tooltip>}
                        {uploadedFileName && props.canClear &&
                            <Tooltip title={props.clearTootip || ''} onClick={handleClear}>
                                <IconButton
                                    color="secondary"
                                    className="p-0 ml-2"
                                    size="small" {...buttonProps}>
                                    <FontAwesomeIcon
                                        icon={faBan}
                                        {...iconProps}
                                        color="secondary"
                                    />
                                </IconButton>
                            </Tooltip>
                        }
                        </>
                    ) :(
                        <CircularProgress color="primary" style={{ width: 25, height: 25 }} />
                    )}
                </Box>
              </Grid>
            <Grid item xs={12}>
              {props.shwoUploadedFileName && uploadedFileName && 
                <Box width={1} display="flex" justifyContent={"center"}
                    alignItems="center" flexWrap={"wrap"} overflow="auto" textOverflow={"wrap"}>
                        <Typography variant="caption">{uploadedFileName}</Typography>
                </Box>}
              </Grid>
            </Grid>
        </React.Fragment>
    )
}