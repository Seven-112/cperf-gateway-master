import { AppBar, BottomNavigation, BottomNavigationAction, colors, Fab, IconButton, InputAdornment, makeStyles, MenuItem, Select, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { IMshzFile } from '../model/microfilemanager/mshz-file.model';
import { downLoadFile, formateBase64Src } from '../util/helpers';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Autocomplete } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme =>({
  appBar:{
    backgroundColor: theme.palette.primary.dark,
    color: 'inherit',
    opacity: 0.7,
    '&:hover':{
      opacity:1,
    }
  },
  pdfWrapper:{
    display:'flex',
    alignItems: 'center',
    justifyContent:'center',
    overflow: 'auto',
    marginTop: theme.spacing(10),
  },
  autocomplete:{
    color: 'white',
    width: theme.spacing(20),
    marginLeft:theme.spacing(1),
    marginRight:theme.spacing(1),
  },
  pageTextFiled:{
    width: theme.spacing(10),
    borderColor: 'white',
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline':{
      borderColor: 'white',
    }
  },
  zoomField:{
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    width: theme.spacing(15),
    textAlign:'center',
    color:'white',
    borderColor: 'white',
    '& .MuiOutlinedInput-notchedOutline':{
      borderColor: 'white',
    }
  },
  zoomFieldAdornment:{
    color:colors.grey[400],
  },
  rightPalette:{
    position: 'fixed',
    width: theme.spacing(20),
    minHeight: theme.spacing(22),
    right:theme.spacing(3),
    bottom:theme.spacing(30),
    display:'flex',
    flexDirection:'column',
    justifyItems:'center',
    justifyContent: 'space-between',
    overflow: 'auto',
    opacity:0.7,
    '&:hover':{
      opacity:1,
    }
  },
}))

export const MyPdfPreviewer = (props:{file: IMshzFile}) =>{
  const file = props.file;
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [options, setOptions] = useState([]);

  const classes = useStyles();

  function onDocumentLoadSuccess({ numPages }) {
    const opts = [];
    for(let i=1; i<=pages; i++){
      opts.push(i.toString());
    }
    setOptions(opts);
    setPages(numPages);
  }

  const handleChangePage = (e, p) =>{
    const newPage = parseInt(p, 10);
    if(!isNaN(newPage) && newPage<=pages)
      setPage(newPage);
  }

  const handleChangeScale = (e) =>{
    const strValue = e.target.value;
    if(strValue){
      const value = parseInt(strValue, 10);
      if(!isNaN(value))
        setScale(scale + value);
    }
  }

  return(
    <div>
      <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
              <Typography>{file.name}&nbsp;&nbsp;</Typography>
              <Autocomplete
                options={options}
                onChange = {(event, newPage) =>handleChangePage(event, newPage)}
                onInputChange = {(event, newPage) =>handleChangePage(event, newPage)}
                getOptionLabel={(option) => option.p}
                classes={{ input: classes.pageTextFiled, root: classes.autocomplete }}
                renderInput={(params) => <TextField placeholder={'Page: '+page+"/"+pages} {...params} variant="standard" />}
              />
              <Typography>zoom</Typography>
              <TextField className={classes.zoomField}
                placeholder={scale.toString()}
                onChange = {handleChangeScale}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <IconButton onClick={() => setScale(scale-0.5)} className={classes.zoomFieldAdornment}>
                      <RemoveIcon  color="inherit"/></IconButton>
                    </InputAdornment>,
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setScale(scale+0.5)} className={classes.zoomFieldAdornment}>
                      <AddIcon  color="inherit"/></IconButton>
                    </InputAdornment>,
                }}
                classes={{root:classes.zoomField}}
              />
          </Toolbar>
      </AppBar>
      <div className={classes.pdfWrapper}>
        <Document
          file={formateBase64Src(file.fDataContentType, file.fData)}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={page} scale={scale}/>
        </Document>
      </div>
      <div className={classes.rightPalette}>
            <Fab variant="extended" color="primary" size="medium"
              disabled={page ===1} onClick={() => setPage(page -1)}>
                <SkipPreviousIcon />
                Prev Page
            </Fab>
            <Fab variant="extended" color="primary" size="medium"
              disabled={page===pages} onClick={() => setPage(page +1)}>
                <SkipNextIcon />
                Next Page
            </Fab>
            <Fab variant="extended" color="primary" size="medium" onClick={() =>downLoadFile(file)}>
                <GetAppIcon />
                Donwload
            </Fab>
      </div>
    </div>
  )
}

export default MyPdfPreviewer;