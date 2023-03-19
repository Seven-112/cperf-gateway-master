import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from '../reducers';
import { getEntity } from '../../entities/microfilemanager/mshz-file/mshz-file.reducer';
import { connect } from 'react-redux';
import { downLoadFile, fileIsAnImage, fileIsReadableOnBrowser, formateBase64Src, getMshzFileUri } from '../util/helpers';
import MyPdfPreviewer from './my-pdf-previewer';
import { Fab, makeStyles } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme =>({
  fileWrapper:{
    display:'flex',
    alignItems: 'center',
    justifyContent:'center',
    overflow: 'auto',
  },
  downloadBtn:{
    position: 'fixed',
    width: theme.spacing(20),
    right:theme.spacing(3),
    bottom:theme.spacing(30),
    opacity:0.7,
    '&:hover':{
      opacity:1,
    }

  },
}))

export interface IMshzFileViewerProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const MshzFileViewer = (props: IMshzFileViewerProps) =>{
  const {file, loading} = props;

  const classes = useStyles();

    useEffect(() =>{
      props.getEntity(props.match.params.id);
      document.body.style.backgroundImage = 'none';
    }, [])

    useEffect(() =>{
        if(file && file.fDataContentType){
          if(!fileIsReadableOnBrowser(file)){
            downLoadFile(file);
            window.close();
          }
        }
    }, [props.file])
    
    

    return(
        <React.Fragment>
            {loading && <p>loading ...</p>}
            {(file && file.fDataContentType && file.fDataContentType.toLowerCase().includes('pdf')) && <MyPdfPreviewer file={file}/>}
            {(file && fileIsAnImage(file.fDataContentType)) &&
              <div className={classes.fileWrapper}>
                 <img src={formateBase64Src(file.fDataContentType, file.fData)} />
              <Fab variant="extended" color="primary" size="medium"
                 className={classes.downloadBtn} onClick={() => downLoadFile(file)}>
                  <GetAppIcon />
                  Donwload
              </Fab>
              </div>
            }
        </React.Fragment>
    );
}



const mapStateToProps = (storeState: IRootState) => ({
  file: storeState.mshzFile.entity,
  loading: storeState.mshzFile.loading,
});

const mapDispatchToProps = {
  getEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(MshzFileViewer);