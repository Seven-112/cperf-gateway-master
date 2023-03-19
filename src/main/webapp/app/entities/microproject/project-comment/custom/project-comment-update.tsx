import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel, makeStyles, Modal, Tooltip, Typography } from '@material-ui/core';
import axios from "axios";
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getUserExtraEmail, getUserExtraFullName } from 'app/shared/util/helpers';
import { Close, Edit } from '@material-ui/icons';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { Alert } from '@material-ui/lab';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { IProjectComment } from 'app/shared/model/microproject/project-comment.model';
import FileManager from 'app/shared/component/file-manager';
import MyCustomRTEModal from 'app/shared/component/my-custom-rte-modal';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import { SaveButton } from 'app/shared/component/custom-button';
import { FileEntityTag } from 'app/shared/model/file-chunk.model';
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';

const useStyles = makeStyles(theme =>({
    modal:{
      display: 'flex',
      justifyContent: 'center',
      background: 'transparent',
      alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color:  theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
}))


export interface IProjectCommentUpdateProps extends StateProps, DispatchProps{
  comment: IProjectComment,
  open?: boolean,
  onClose: Function,
  onSave?: Function
  onFileDelete?: Function,
}

export const ProjectCommentUpdate = (props: IProjectCommentUpdateProps) => {
  const { open, account } = props;
  const [isNew, setIsNew] = useState(!props.comment || !props.comment.id);

  const [comment, setProjectComment] = useState<IProjectComment>(props.comment || {})
  const [files, setFiles] = useState<IMshzFile[]>([]);
  const [userExra, setUserExtra] = useState<IUserExtra>(null);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [editContent, setEditContent] = useState(false);

  const classes = useStyles()

  const formIsValid: boolean = comment && comment.projectId && (comment.content || [...files].length !== 0);

  const fileTag = FileEntityTag.projectComment;

  const getUserExtra = () =>{
    if(props.account && props.account.id){
        setLoading(true)
        const apiUri = `${API_URIS.userExtraApiUri}/${props.account.id}`;
        axios.get<IUserExtra>(apiUri)
            .then(res =>{
                setUserExtra(res.data);
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false);
            })
    }
  }

  const getFiles = () =>{
    if(props.comment && props.comment.id){
      setLoading(true)
      getMshzFileByEntityIdAndEntityTag(props.comment.id, fileTag)
          .then(res =>{
              setFiles([...res.data]);
          }).catch(e => console.log(e))
          .finally(() =>{
              setLoading(false);
          })
    }
  }

  const handleClose = () => props.onClose();

  useEffect(() =>{
    getUserExtra();
  }, [props.account])

  useEffect(() => {
    setIsNew(!props.comment || !props.comment.id);
    setProjectComment(props.comment || {})
    getFiles();
    setFormSubmitted(false);
    setSuccess(false);
    setShowMessage(false);
  }, [props.comment]);

  const handleSaveMshzeFile = (saved?: IMshzFile[]) =>{
      if(saved && saved.length !==0){
        setFiles([...files, ...saved]);
      }
  }

  const saveUnSavedFiles = (c: IProjectComment) =>{
      if(c){
        if(c.id && account && isNew){
          props.setFileUploadWillAssociateEntityId(c.id);
          props.associateFilesToEntity(c.id, fileTag.toString(), account.id);
        }
        
        setLoading(false);
        setSuccess(true);
        if(props.onSave)
          props.onSave(c, isNew);
      }
  }
  
  const onMshzFileDelete = (deleted) =>{
      if(deleted){
        setFiles([...files].filter(f => f.id !== deleted))
      }
  }

  const saveEntity = (event) => {
    event.preventDefault()
    setSuccess(false);
    setShowMessage(false)
    setFormSubmitted(false);
    if (formIsValid) {
      setLoading(true);
      const entity: IProjectComment = {
        ...comment,
        userId: comment.userId || account ? account.id : null,
        userEmail: comment.userEmail || getUserExtraEmail(userExra),
        userName: comment.userName || getUserExtraFullName(userExra),
      };
      
      const request = isNew ? axios.post<IProjectComment>(`${API_URIS.projectCommentApiUri}`, cleanEntity(entity))
                              : axios.put<IProjectComment>(`${API_URIS.projectCommentApiUri}`, cleanEntity(entity));
      request.then(res =>{
        if(res.data){
          saveUnSavedFiles(res.data)
        }
      }).catch(e => {
        console.log(e);
        setSuccess(false);
      }).finally(() =>{ 
        setFormSubmitted(true);
        setShowMessage(true)
      })
    }
  };

  const handleChange = (e) =>{
    const name = e.target.name
    const value = e.target.value
    setProjectComment({...comment, [name]: value})
  }
  
  return (
  <React.Fragment>
    {comment && <MyCustomRTEModal 
      content={comment.content}
      open={editContent}
      onClose={() => setEditContent(false)}
      onSave={(newContent) => {
        setProjectComment({...comment, content: newContent});
        setEditContent(false)
      }}
      label={translate('microgatewayApp.microprojectProjectComment.detail.title')}
    />}
    <Modal open={open} onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
      closeAfterTransition
      disableBackdropClick
      className={classes.modal}
    >
      <Card className={classes.card}>
          <CardHeader className={classes.cardheader}
          title={
              <Translate contentKey="microgatewayApp.microprojectProjectComment.home.createOrEditLabel">Create or edit a Project</Translate>
          }
          titleTypographyProps={{
            variant: 'h4',
          }}
          action={
            <IconButton
                aria-label="forwared"
                color="inherit" 
                onClick={handleClose} edge='start'>
                  <Close />
            </IconButton>
          } 
          />
          <CardContent className={classes.cardcontent}>
            <form onSubmit={saveEntity}>
                <Grid container spacing={3}>
                    {loading && <Grid item xs={12}>
                      <Box width={1} display="flex" justifyContent="center" justifyItems="center">
                          <CircularProgress color="primary" style={{ height:50, width:50}} />
                          <Typography color="primary" className="ml-3">Loading...</Typography>
                      </Box>
                    </Grid>}
                    {formSubmitted && <Grid item xs={12}>
                        <Collapse in={showMessage}>
                            <Alert severity={success? "success" : "error"} 
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                      setShowMessage(false);
                                    }}
                                  >
                                    <Close fontSize="inherit" />
                                  </IconButton>}
                              >
                                  {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                            </Alert>
                        </Collapse>
                    </Grid>}
                    <Grid item xs={12}>
                      <FormControl fullWidth variant='standard'>
                        <Box width={1} display="flex" alignItems={"center"} flexWrap="wrap">
                          <Tooltip title={translate('entity.action.edit')}
                            onClick={() => setEditContent(true)}>
                            <Button 
                              variant='text' 
                              color="primary"
                              endIcon={<Edit />}
                              className="text-capitalize p-0"
                              >
                                {translate('microgatewayApp.microprojectProjectComment.content')}
                            </Button>
                          </Tooltip>
                        </Box>
                        {comment.content &&
                          <MyCustomPureHtmlRender
                            body={comment.content}
                            boxProps={{
                              width: 1,
                              maxHeight: 100,
                              overflow: 'auto',
                            }}
                          />
                         }
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControl fullWidth>
                        <InputLabel>{translate('microgatewayApp.microprojectProjectCommentFile.home.title')}</InputLabel>
                        <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" overflow="auto">
                           <FileManager 
                            files={[...files]}
                            selectMultiple
                            withClearPreviewerItem
                            entityId={comment.id}
                            entityTagName={fileTag}
                            onRemove={onMshzFileDelete}
                            onSave={handleSaveMshzeFile}
                            notFound={translate('microgatewayApp.microprojectProjectCommentFile.home.notFound')}
                            deleteQuestion={translate('microgatewayApp.microprojectProjectCommentFile.delete.question', {id: ''})}
                           />
                        </Box>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <SaveButton 
                          disabled= {!formIsValid}
                          type="submit"
                          style={{ float: 'right'}}
                       />
                    </Grid>
                  </Grid>
              </form>
            </CardContent>
        </Card>
    </Modal>
  </React.Fragment>
  );
};

const mapStateToProps = ({authentication}: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
  associateFilesToEntity,
  setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCommentUpdate);
