import React, { useEffect } from "react";
import { useState } from "react";
import { IMshzFile } from "../model/microfilemanager/mshz-file.model";
import axios from 'axios';
import { API_URIS, DEFAULT_USER_AVATAR_URI, fileIsAnImage, formateBase64Src, getMshzFileUri } from 'app/shared/util/helpers';
import { Avatar, AvatarProps, Box, CircularProgress, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Skeleton, SkeletonProps } from "@material-ui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import EntityDeleterModal from "./entity-deleter-modal";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles({
    avatarImgContainer:{
        opacity:1,
        '&:hover':{
            opacity: 0.8,
            '&> .deleteBtn':{
                opacity: 1,
            }
        }
    },
    deleteBtn:{
        position: 'absolute',
        zIndex: 1000,
        opacity: 0,
        '&:hover':{
            opacity: 1,
        }
    }
})

interface CustomAvatarProps{
    photoId?: number,
    photo?: IMshzFile,
    alt?: string,
    loadingSize?: number,
    defaultImgUri?: string,
    avatarProps?: AvatarProps,
    loadingProps?: SkeletonProps,
    onDelete?: Function,
}
export const CustomAvatar = (props:CustomAvatarProps) =>{
    const { avatarProps, defaultImgUri, loadingProps, loadingSize } = props;
    const [photo, setPhoto] = useState<IMshzFile>(props.photo);
    const [loading, setLoading] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const classes = useStyles();

    const getPhoto = () =>{
        if(props.photoId && !props.photo && serviceIsOnline(SetupService.FILEMANAGER)){
            setLoading(true)
            axios.get<IMshzFile>(`${API_URIS.mshzFileApiUri}/${props.photoId}`)
                .then(res => {
                    setPhoto(res.data)
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }else{
            setPhoto(props.photo)
        }
    }

    useEffect(() =>{
        setPhoto(props.photo)
        getPhoto();
    }, [props.photo, props.photoId])

    const isValidPhoto = (photo && photo.fData && photo.fDataContentType && fileIsAnImage(photo.fDataContentType));
    
    const defaultImgSrc = defaultImgUri || DEFAULT_USER_AVATAR_URI

    const progressSize = loadingSize || 50;

    const canDelete = photo && photo.id && props.onDelete && serviceIsOnline(SetupService.FILEMANAGER);

    const handleDelete = () =>{
        if(canDelete)
            setOpenToDelete(true);
    }

    const onDelete = (deleteId) =>{
        if(deleteId){
            setPhoto(null);
            setOpenToDelete(false);
            if(props.onDelete)
                props.onDelete(deleteId);
        }
    }

    return (
        <React.Fragment>
            {canDelete && <EntityDeleterModal 
                open={openToDelete}
                onClose={() => setOpenToDelete(false)}
                entityId={photo.id}
                urlWithoutEntityId={API_URIS.mshzFileApiUri}
                onDelete={onDelete}
            />}
            {loading ? (
                <>
                <Box position="relative" display="inline-flex">
                    <CircularProgress size={progressSize} thickness={0.8} />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                    <Skeleton variant="circle" 
                        animation="wave"
                        width={progressSize} height={progressSize} {...loadingProps} /> 
                    </Box>
                </Box>
                </>
            ): (
                <Box display="flex" justifyContent="center"
                     alignItems="center" className={classes.avatarImgContainer}>
                    {canDelete &&
                        <Tooltip title={translate("entity.action.delete")}
                            className={classes.deleteBtn + ' deleteBtn'} onClick={handleDelete}>
                            <IconButton color="secondary" size="small" className="p-0">
                                <FontAwesomeIcon icon={faTrashAlt} size="1x"/>
                            </IconButton>
                        </Tooltip>
                    }
                    <Avatar 
                        alt={props.alt || ''} 
                        src={isValidPhoto ? photo.id ? formateBase64Src(photo.fDataContentType, photo.fData) : getMshzFileUri(photo) : defaultImgSrc} 
                        {...avatarProps} 
                    />
                </Box> 
            ) 
           }
        </React.Fragment>
    )
}

CustomAvatar.defaultProps={
    loadingSize: 40,
}

export default CustomAvatar;
