import { faFile, faFileExcel, faFilePdf, faFileWord, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, BoxProps, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, makeStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { IMshzFile } from '../model/microfilemanager/mshz-file.model';
import { downLoadFile, fileIsAnImage, fileIsReadableOnBrowser, getMshzFileUri } from '../util/helpers';

const useStyles = makeStyles((theme) =>({
    media:{
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    iconSize:{
        fontSize: theme.spacing(12),
    },
    cardContent:{
        cursor:"pointer",
    },
    cardTitle:{
        width: theme.spacing(13),
        fontSize:10,
        overflow: 'hidden',
        [theme.breakpoints.down('sm')]:{
            width: theme.spacing(5),
        }
    },
}))

export interface IFilePreviewer{
    file: IMshzFile,
    width?: number | string,
    height?: number | string,
    classes?: any,
    className?: any,
    rootBoxProps?: BoxProps,
    withClear?: boolean,
    onClear?: Function,
}

export const getFileFaIcon = (name: string, contentType: string) => {
    if(name || contentType){
        if(fileIsAnImage(contentType)){
            return faImages;
        }else{
            const extWithType = contentType ? 
                    contentType.substring(contentType.lastIndexOf('/')+1, contentType.length)
                    .toLowerCase() : '';

            const extWithName = name ? 
                                 name.substring(name.lastIndexOf('.')+1,name.length)
                                .toLowerCase() : ' ';


           if(extWithType.includes('pdf') || extWithName.includes('pdf')){
               return faFilePdf;
           }
           if(extWithType.includes('doc')){
               if(extWithName.includes('xls'))
                    return faFileExcel;
                return faFileWord;
           }
           if(extWithType.includes('xls') || extWithName.includes('xls')){
                return faFileExcel;
           }
        }
    }
    return faFile;
}

export const FileIllustration = (props: { file: IMshzFile, className?: any, onClick?: Function, title?: string}) =>{
    const {file, className, title} = props;

    const handleClick = () =>{
        if(props.onClick)
            props.onClick();
    }

    if(file.fDataContentType){
        if(fileIsAnImage(file.fDataContentType))
            return <img src={getMshzFileUri(file)} className={className} onClick={handleClick} title={title}/>
        }else{
          return <FontAwesomeIcon icon={getFileFaIcon(file.name, file.fDataContentType)} 
                    className={className} onClick={handleClick}  title={title}/>;
        }
    return <React.Fragment></React.Fragment>;
}

export const FilePreviewer = (props: IFilePreviewer) =>{
    const {file, width, height, withClear, rootBoxProps} = props;
    const classes = useStyles();

    const [objectUri, setObjectUri] = useState<string>(getMshzFileUri(file));
    
    useEffect(() =>{
      setObjectUri(getMshzFileUri(file));
    }, [props.file]);

    const openFileInNewWindow = () =>{
        if(file.id){
            if(fileIsReadableOnBrowser(file)){
                const win = window.open('/file-viewer/'+file.id, '_blank');
                if (win != null) {
                    win.focus();
                }
            }else{
                downLoadFile(file);
            }
        }else{
            window.open(objectUri);
        }
    }

    const handleClear = () =>{
        if(props.onClear)
            props.onClear();
    }
    return (
        <Box boxShadow={1} {...rootBoxProps}>
           <Card>
            <CardHeader 
             title={props.file.name}
             titleTypographyProps={{ className: classes.cardTitle}}
             action={
                withClear && <IconButton color="secondary" onClick={handleClear}>
                     <Clear/>
                 </IconButton>
             }/>
             {fileIsAnImage(file.fDataContentType) && 
                <CardMedia image={objectUri} className={classes.media} onClick={openFileInNewWindow}/>}
             <CardContent className={classes.cardContent} onClick={openFileInNewWindow}>
                 <Grid container alignItems='center' direction="row" style={{ textAlign:'center'}}>
                     {!fileIsAnImage(file.fDataContentType) &&
                     <Grid item xs={12}><FileIllustration file={file} className={classes.iconSize}/></Grid>}
                 </Grid>
             </CardContent>
            </Card>
        </Box>
    );
}