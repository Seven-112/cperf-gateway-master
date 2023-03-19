import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IMshzFile } from '../model/microfilemanager/mshz-file.model';
import { formateBase64Src } from 'app/shared/util/helpers';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const apiUrl = 'services/microfilemanager/api/mshz-files';

export const SecuredImage = (props: {id: number, src: string, defaultSrc: string, alt: string,height, width, classes, style?}) =>{
    const { id, src, alt, height, width, classes, style } = props;
    const [imgSrc, setImgSrc] = useState(null);
    
    useEffect(() =>{
        if(serviceIsOnline(SetupService.FILEMANAGER)){
            const requestUrl = id?  `${apiUrl}/${id}` : src;
            axios.get<IMshzFile>(requestUrl).then(response =>{
                if(response.data)
                    setImgSrc(formateBase64Src(response.data.fDataContentType, response.data.fData));
                else
                    setImgSrc(props.defaultSrc);
            }).catch(e =>{
                setImgSrc(props.defaultSrc);
                /* eslint-disable no-console */
                console.warn(e);
            });
        }
    }, [props.src]);
    return <img src={imgSrc} alt={alt} height={height} width={width} className={classes} style={style}/>;
}

SecuredImage.defaultProps = {
    id: null,
    src:"",
    alt:"",
    height: null,
    width: null,
    classes: null,
    defaultSrc: '/content/images/user.png',
}

export default SecuredImage;