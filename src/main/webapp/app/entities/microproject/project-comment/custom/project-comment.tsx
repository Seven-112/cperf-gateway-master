import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Modal, Slide, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@material-ui/core";
import { Add, Close, Delete, Edit, Visibility } from "@material-ui/icons";
import { IProject } from "app/shared/model/microproject/project.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { translate, Translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { IProjectComment } from "app/shared/model/microproject/project-comment.model";
import ProjectCommentUpdate from "./project-comment-update";
import ModalFileManager from "app/shared/component/modal-file-manager";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";

const useStyles = makeStyles(theme =>({
    modal:{
      display: 'flex',
      justifyContent: 'center',
      background: 'transparent',
      alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '37%',
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
    truncate:{
        width: 70,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}))

const CommentRowItem = (props: {comment: IProjectComment, realodFile?: boolean,
        readonly?: boolean, handleUpdate?: Function, handleDelete?: Function}) =>{
    const { comment, readonly } = props;
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false)
    const [openFiles, setOpenFiles] = useState(false);
    const [openContent,setOpenContent] = useState(false);
    const getFiles = () =>{
        if(props.comment && props.comment.id){
            setLoading(true)
            getMshzFileByEntityIdAndEntityTag(props.comment.id, FileEntityTag.projectComment)
                .then(res =>{
                    setFiles([...res.data]);
                }).catch(e => console.log(e))
                .finally(() =>{
                    setLoading(false);
                })
        }
    }

    useEffect(() =>{
        getFiles();
    }, [])

    useEffect(() =>{
        if(props.realodFile)
            getFiles();
    }, [props.realodFile])

    const classes = useStyles();

    return(
        <React.Fragment>
            {comment && <>
                <ModalFileManager 
                    open={openFiles}
                    entityId={comment.id}
                    entityTagName={FileEntityTag.projectComment}
                    readonly
                    files={[...files]}
                    onClose={() => setOpenFiles(false)}
                />
                <MyCustomPureHtmlRenderModal 
                    title={translate("microgatewayApp.microprojectProjectComment.content")}
                    open={openContent}
                    body={comment.content}
                    onClose={() => setOpenContent(false)}
                />
                <TableRow>
                    <TableCell>
                        {comment.content ?
                            <Tooltip title={translate("entity.action.view")}>
                                <Button color="primary"
                                    endIcon={ <Visibility />}
                                    className="text-capitalize"
                                    onClick={() => setOpenContent(true)}>
                                    {translate("microgatewayApp.microprojectProjectComment.content")}
                                </Button>
                            </Tooltip> 
                        : '...'}
                    </TableCell>
                    <TableCell align="center">
                        {loading && 'loading...'}
                        {[...files].length !== 0 ? (
                         <IconButton color="primary" onClick={() => setOpenFiles(true)}>
                            <Visibility />
                        </IconButton>):(
                            !loading && '....'
                        )}
                    </TableCell>
                    <TableCell align="center">
                        {comment.userName}
                    </TableCell>
                    {!readonly && 
                    <TableCell align="center">
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}
                            flexWrap={"wrap"} overflow={"auto"}> 
                            {props.handleUpdate &&
                            <IconButton edge="start" aria-label="Edit" onClick={() => props.handleUpdate(comment)}>
                                <Edit color="primary" titleAccess="Edit"/>
                            </IconButton>}
                            {props.handleDelete &&  
                            <IconButton edge="start" aria-label="Delete" onClick={() =>props.handleDelete(comment)}>
                                <Delete color="secondary" titleAccess={translate("entity.action.delete")}/>
                            </IconButton>}
                        </Box>
                    </TableCell>
                    }
                </TableRow>
            </>}
        </React.Fragment>
    )
}


export interface IProjectCommentProps extends StateProps{
  project: IProject,
  open?: boolean,
  readonly?: boolean,
  onClose: Function,
  onSave?: Function,
  onDelete?: Function,
}

export const ProjectComment = (props: IProjectCommentProps) => {
  const { open, account, project } = props;

  const [comments, setComments] = useState<IProjectComment[]>([]);
  const [userExra, setUserExtra] = useState<IUserExtra>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<IProjectComment>(null);
  const [openToUpdate, setOpenToUpdate] = useState(false);
  const [openToDelete, setOpenToDelete] = useState(false);
  const [realodFile, setReloadFile] = useState(false);

  const classes = useStyles()

  const getFiles = () =>{
    if(props.project && props.project.id){
        setLoading(true)
        const apiUri = `${API_URIS.projectCommentApiUri}/?projectId.equals=${props.project.id}`;
        axios.get<IProjectComment[]>(apiUri)
            .then(res =>{
                setComments([...res.data]);
            }).catch(e => console.log(e))
            .finally(() =>{
                setLoading(false);
            })
    }
  }

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

  useEffect(() =>{
        getUserExtra();
  }, [props.account])

  useEffect(() =>{
        getFiles();
  }, [props.project])

  const handleUpdate = (c?: IProjectComment) =>{
    if(c){
        setComment(c);
    }else{
        setComment({
            projectId: project.id,
            userId: userExra ? userExra.id : null,
            userName: getUserExtraFullName(userExra),
            userEmail: getUserExtraEmail(userExra)
        })
    }
    setOpenToUpdate(true);
    setReloadFile(false)
  }

  const onSave = (saved?: IProjectComment, isNew?: boolean) =>{
      if(saved){
          if(isNew)
            setComments([...comments, saved])
          else
            setComments(comments.map(f => f.id === saved.id ? saved : f))
         setOpenToUpdate(false);
         setReloadFile(true)
         if(props.onSave)
            props.onSave(saved, isNew);
      }
  }

  const handleDelete = (f?: IProjectComment) =>{
        if(f){
            setComment(f);
            setOpenToDelete(true);
        }
  }

  const onDelete = (deletedId) =>{
      if(deletedId){
          setComments(comments.filter(c => c.id !== deletedId));
          setOpenToDelete(false);
          if(props.onDelete)
            props.onDelete(deletedId);
      }
  }

  const handleClose = () => props.onClose();

  const items = [...comments].sort((a,b) => a.id -b.id)
        .map((c,index) =>(
            <CommentRowItem key={index} comment={c} readonly={props.readonly}
            realodFile={realodFile && comment && comment.id === c.id}
            handleUpdate={handleUpdate} handleDelete={handleDelete}/>
        ))

  return (
      <React.Fragment>
        <ProjectCommentUpdate open={openToUpdate} comment={comment} 
            onSave={onSave} onClose={() => setOpenToUpdate(false)}
        />
        {comment && <EntityDeleterModal 
            open={openToDelete}
            entityId={comment.id}
            urlWithoutEntityId={API_URIS.projectCommentApiUri}
            onClose={() => setOpenToDelete(false)}
            onDelete={onDelete}
            question={translate("microgatewayApp.microprojectProjectComment.delete.question", {id: ""})}
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
            <Slide in={open}>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardheader}
                    title={
                        <Translate contentKey="microgatewayApp.microprojectProjectComment.home.title">Comment</Translate>
                    }
                    titleTypographyProps={{
                    variant: 'h4',
                    }}
                    action={
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <IconButton
                                aria-label="add new"
                                color="inherit" 
                                onClick={() =>handleUpdate(null)} edge='start'>
                                    <Add />
                            </IconButton>
                            <IconButton
                                aria-label="forwared"
                                color="inherit" 
                                className="ml-3"
                                onClick={handleClose} edge='start'>
                                    <Close />
                            </IconButton>
                        </Box>
                    } 
                    />
                    <CardContent className={classes.cardcontent}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {translate("microgatewayApp.microprojectProjectComment.detail.title")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {translate("_global.label.files")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {translate("microgatewayApp.microprojectProjectComment.userName")}
                                    </TableCell>
                                    {!props.readonly && <TableCell align="center">Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && <TableRow>
                                    <TableCell colSpan={10}>
                                        <Box width={1} display="flex" justifyContent="center" justifyItems="center">
                                            <CircularProgress color="primary" style={{ height:50, width:50}} />
                                            <Typography color="primary" className="ml-3">Loading...</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                }
                                {items}
                                {!loading && [...comments].length === 0 && <TableRow>
                                        <TableCell colSpan={10}>
                                            <Box width={1} height={1} display="flex" justifyContent="center" alignItems="center">
                                                <Typography variant="h5" color="primary">
                                                    {translate("microgatewayApp.microprojectProjectComment.home.notFound")}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Slide>
        </Modal>
      </React.Fragment>
  )
}

const mapStateToProps = ({authentication}: IRootState) => ({
  account: authentication.account,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(ProjectComment);