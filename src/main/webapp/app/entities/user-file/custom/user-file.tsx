import { Box, BoxProps, Breadcrumbs, CircularProgress, Divider, Grid, IconButton, Link, makeStyles, Menu, MenuItem, Tooltip, Typography } from "@material-ui/core";
import { IUserFile } from "app/shared/model/user-file.model";
import { IRootState } from "app/shared/reducers";
import { getSession } from "app/shared/reducers/authentication";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS, getFaIconByFileName, getMshzFileByEntityIdAndEntityTag, getUserExtraFullName, navigateToBlankTab } from "app/shared/util/helpers";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faFileMedical, faFolder, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import theme from "app/theme";
import EditFileModal from "app/shared/component/edit-file-modal";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { Delete, Edit, Home, Visibility } from "@material-ui/icons";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import UserFolderUpdate from "./user-folder-update";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

const useStyles = makeStyles({
    modal:{
        width: '40%',
        [theme.breakpoints.down('sm')]:{
            width: '85%',
        }
    },
    fileContainer:{
        minWidth: 20,
        maxWidth: 100,
        minHeight: 32,
        maxHeight: 70,
        margin:10,
        cursor: 'default',
        '&:hover':{
            maxHeight: 500,
            margin:5,
            
        }
    },
});


interface UserFileAndFolderWidgetProps{
    canDelete?: boolean,
    boxProps?: BoxProps,
    handleOpen?: Function,
    handleDelete?: Function,
}

interface UserFileWidgetProps extends UserFileAndFolderWidgetProps{
    file: IMshzFile,
}

export const UserFileWidget = (props:UserFileWidgetProps) =>{
    const { file, boxProps, canDelete } = props;

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = Boolean(anchorEl);
    
    const classes = useStyles();

    const isValidFile = file && file.name;
    
    const handleDelete = () =>{
        setAnchorEl(null);
        if(props.handleDelete && canDelete)
            props.handleDelete(file);
    }


    const handleOpen = () =>{
        setAnchorEl(null)
        if(props.handleOpen)
            props.handleOpen(file);
    }

    const handleOpenMenu = (e) => {
        if(canDelete)
            setAnchorEl(e.currentTarget)
        else
            handleOpen();
    }

    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>
            {isValidFile && <>
             <Box overflow="hidden" className={classes.fileContainer} {...boxProps} onClick={handleOpenMenu}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Box width={1} display={"flex"} justifyContent={"center"} alignItems={"center"} p={0} m={0}>
                            <FontAwesomeIcon icon={getFaIconByFileName(file.name)} color="#9e9e9e" size="3x"/>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display={"flex"} width={1} justifyContent={"center"} textAlign={"center"}>
                            <Typography variant="body2">{file.name}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Menu
                id="file-context-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'file-context-menu',
                variant: 'selectedMenu'
                }}
            >
                <MenuItem onClick={handleOpen}>
                    <Box width={1} p={0} m={0} display={"flex"}
                     flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                        <Visibility color="primary" fontSize="small"/>
                        <Typography className="ml-3">{translate("_global.label.open")}</Typography>
                    </Box>
                </MenuItem>
                {canDelete && 
                    <MenuItem onClick={handleDelete}>
                    <Box width={1} p={0} m={0} display={"flex"}
                     flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                        <Delete color="secondary" fontSize="small"/>
                        <Typography className="ml-3">{translate("entity.action.delete")}</Typography>
                    </Box>
                    </MenuItem>
                }
            </Menu>
            </>}
        </React.Fragment>
    )
}


interface UserFolderWidgetProps extends UserFileAndFolderWidgetProps{
    file: IUserFile,
    canUpdate?: boolean,
    handleUpdate?: Function,
}

export const UserFolderWidget = (props:UserFolderWidgetProps) =>{
    const { file, boxProps, canUpdate, canDelete } = props;

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = Boolean(anchorEl);
    
    const classes = useStyles();

    const isValidFile = file && file.fileName && (file.isFolder || file.fileId);

    const handleUpdate = () =>{
        setAnchorEl(null);
        if(props.handleUpdate && canUpdate)
            props.handleUpdate(file);
    }
    
    const handleDelete = () =>{
        setAnchorEl(null);
        if(props.handleDelete && canDelete)
            props.handleDelete(file);
    }


    const handleOpen = () =>{
        setAnchorEl(null)
        if(props.handleOpen)
            props.handleOpen(file);
    }

    const handleOpenMenu = (e) => {
        if(canDelete || canUpdate)
            setAnchorEl(e.currentTarget)
        else
            handleOpen();
    }

    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>
            {isValidFile && <>
             <Box overflow="hidden" className={classes.fileContainer} {...boxProps} onClick={handleOpenMenu}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Box width={1} display={"flex"} justifyContent={"center"} alignItems={"center"} p={0} m={0}>
                            {file.isFolder ?
                                <FontAwesomeIcon icon={faFolder} color="#ffcc80" size="3x"/>
                                :  <FontAwesomeIcon icon={getFaIconByFileName(file.fileName)} color="#9e9e9e" size="3x"/>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display={"flex"} width={1} justifyContent={"center"} textAlign={"center"}>
                            <Typography variant="body2">{file.fileName}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Menu
                id="file-context-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'file-context-menu',
                variant: 'selectedMenu'
                }}
            >
                <MenuItem onClick={handleOpen}>
                    <Box width={1} p={0} m={0} display={"flex"}
                     flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                        <Visibility color="primary" fontSize="small"/>
                        <Typography className="ml-3">{translate("_global.label.open")}</Typography>
                    </Box>
                </MenuItem>
                {canUpdate && 
                    <MenuItem onClick={handleUpdate}>
                        <Box width={1} p={0} m={0} display={"flex"}
                        flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                            <Edit color="primary" fontSize="small"/>
                            <Typography className="ml-3">{translate("entity.action.edit")}</Typography>
                        </Box>
                    </MenuItem>
                }
                {canDelete && 
                    <MenuItem onClick={handleDelete}>
                    <Box width={1} p={0} m={0} display={"flex"}
                     flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                        <Delete color="secondary" fontSize="small"/>
                        <Typography className="ml-3">{translate("entity.action.delete")}</Typography>
                    </Box>
                    </MenuItem>
                }
            </Menu>
            </>}
        </React.Fragment>
    )
}

interface UserFileProps extends StateProps, DispatchProps{
    userExtra?: IUserExtra,
    isEmployee?: boolean,
    open?: boolean,
    onClose: Function,
}

export const UserFile = (props: UserFileProps) =>{
    const { open, account, isEmployee, userExtra } = props;
    const [folder, setFolder] = useState<IUserFile>(null);
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState<IUserFile[]>([]);
    const [openFileEditor, setOpenFileEditor] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [fileToManager, setFileToManage] = useState<IUserFile | IMshzFile>(null);
    const [fileToManageIsFolder, setFileToManagerIsFolder] = useState(false);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [breadCrumbFiles, setBreadCrumbsFiles] = useState<IUserFile[]>([]);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    
    const classes = useStyles();

    const userId = userExtra ? isEmployee ? userExtra.employee ? userExtra.employee.id : null : userExtra.id : null;


    const canUpdate = account && (
        hasPrivileges({entities: ["Employee"], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }, account.authorities) 
        || (userExtra && userExtra.id === account.id)
    );

    const canDelete = account && (
        hasPrivileges({entities: ["Employee"], actions: [PrivilegeAction.DELETE] }, account.authorities) 
        || (userExtra && userExtra.id === account.id)
    );


    const getFolders = (folderId?: any) =>{
        if(userExtra){
            let apiUri = `${API_URIS.userFileApiUri}/getAllByUser/${userId}`;
            apiUri = `${apiUri}/?folderId=${folderId || ""}&isEmploye=${isEmployee ? 'true' : 'false'}`;
            setLoading(true);
            axios.get<IUserFile[]>(apiUri).then(res =>{
                setFolders(res.data);
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    const getFiles = (folderId?: number) =>{
        const tag = folderId ? FileEntityTag.userFolderFile : FileEntityTag.userFile;
        const idEntity = folderId ? folderId : userId;
        if(tag && idEntity){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(idEntity, tag)
                .then(res =>setFiles(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }
    
    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        getFolders();
        getFiles();
    }, [props.userExtra])

    const onSaveMshzFiles = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0)
            setFiles([...files, ...saved])
        setOpenFileEditor(false);
    }

    const handleClose = () =>{
        setBreadCrumbsFiles([]);
        props.onClose()
    };

    const handleOpenFile = (f: IMshzFile) =>{
        if(f && f.id)
            navigateToBlankTab(`/file-viewer/${f.id}`)
    }

    const handleOpen = (uf?: IUserFile) =>{
        if(uf && uf.id){
            if(uf.isFolder){
                setFolder(uf);
                getFolders(uf.id);
                getFiles(uf.id);
                if(![...breadCrumbFiles].some(bf => bf.id === uf.id))
                    setBreadCrumbsFiles([...breadCrumbFiles, uf]);
            }else{
                if(uf.fileId)
                    navigateToBlankTab(`/file-viewer/${uf.fileId}`)
            }
        }
    }

    const handleDeleteFile = (f: IMshzFile) =>{
        setFileToManage(f);
        setFileToManagerIsFolder(false);
        if(f)
            setOpenToDelete(true);
    }

    const handleDelete = (uf?: IUserFile) =>{
        setFileToManage(uf);
        setFileToManagerIsFolder(true)
        if(uf)
            setOpenToDelete(true);
    }

    const handleUpdate = (uf?: IUserFile) =>{
        if(uf){
            setFileToManage(uf);
            setOpenToUpdate(true)
        }else{
            const newUf: IUserFile = {
                userId,
                isEmploye: isEmployee,
                isFolder: true,
                parentId: folder ? folder.id : null,
            }
            setFileToManage(newUf);
            setOpenToUpdate(true)
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setOpenToDelete(false);
            if(fileToManageIsFolder)
                setFolders(folders.filter(f => f.id !== deletedId && f.parentId !== deletedId))
            else
                setFiles(files.filter(f => f.id !== deletedId))
        }
    }

    const onSaveFolder = (saved?: IUserFile, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setFolders([saved, ...folders])
            else
                setFolders(folders.map(f => f.id === saved.id ? saved : f));
            setOpenToUpdate(false);
        }
    }
    
    const foldersItems = [...folders].filter(f => f.fileName && f.isFolder)
    .sort((a,b) => b.id-a.id).map((f, index) =>(
        <UserFolderWidget key={index} file={f} canUpdate={canUpdate} canDelete={canDelete}
            handleOpen={handleOpen} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
    ));

    const filesItems = [...files].sort((a,b) => b.id-a.id).map((f, index) =>(
        <UserFileWidget key={index} file={f} canDelete={canDelete}
            handleOpen={handleOpenFile} handleDelete={handleDeleteFile} />
    ));

    const handleBreadCrumbClick = (uf?: IUserFile, indexOffset?: number) =>{
        if((uf && folder && uf.id !== folder.id) || (!uf && folder) || (uf && !folder)){
            setFolder(uf);
            getFolders(uf && uf.id ? uf.id : null);
            getFiles(uf && uf.id ? uf.id : null);
            if(!indexOffset){
                setBreadCrumbsFiles([]);
            }else{
                const breadcrumbs = [];
                for(let i=0; i<indexOffset; i++){
                    breadcrumbs.push(breadCrumbFiles[i]);
                }
                setBreadCrumbsFiles([...breadcrumbs]);
            }
        }
    }

    const CustomBreadCrumb = () =>{
        const breadcrumbs = [...breadCrumbFiles].map((bf, index) =>(
            <Link  key={index} underline="hover" color="textPrimary"
                onClick={() =>handleBreadCrumbClick(bf, index +1)}>
                <Typography variant="caption">{bf.fileName}</Typography>
            </Link>
        ))

        return (
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link   underline="hover" color="textPrimary" 
                    onClick={() =>handleBreadCrumbClick(null, 0)}>
                    <Home fontSize="small" />
                </Link>
                {breadcrumbs}
            </Breadcrumbs>
        )

    }

    return (
        <React.Fragment>
            <EditFileModal 
                selectMultiple withClearPreviewerItem
                entityId={folder && folder.id ? folder.id : userId}
                entityTagName={folder && folder.id ? FileEntityTag.userFolderFile : FileEntityTag.userFile}
                open={openFileEditor} onSaved={onSaveMshzFiles} 
                onCloseNoCancelSaving={() => setOpenFileEditor(false)}
            />
            {fileToManager && <>
                <EntityDeleterModal 
                    open={openToDelete}
                    entityId={fileToManager.id}
                    urlWithoutEntityId={fileToManageIsFolder ? API_URIS.userFileApiUri : API_URIS.mshzFileApiUri}
                    onClose={() => setOpenToDelete(false)}
                    onDelete={onDelete}
                    question={translate("microgatewayApp.userFile.delete.question", { id: ""})}
                />
                <UserFolderUpdate
                    open={openToUpdate}
                    folder={fileToManager}
                    onClose={() => setOpenToUpdate(false)}
                    onSave={onSaveFolder}
                 />
            </>
            }
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={`${translate(`microgatewayApp.userFile.home.title`)} ${userExtra ? `${translate(`_global.label.of`)} ${getUserExtraFullName(userExtra)}` : ''}`}
                avatarIcon={<FontAwesomeIcon icon={faCopy} style={{ fontSize: 25, }}/>}
                rootCardClassName={classes.modal}
                customActionButtons={canUpdate ?<>
                <Tooltip title={translate("_global.label.addFiles")} placement="bottom">
                    <IconButton color="default" onClick={() => setOpenFileEditor(true)}>
                        <FontAwesomeIcon icon={faFileMedical} size="sm" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={translate("_global.label.createFolder")} 
                    placement="bottom" onClick={() =>handleUpdate(null)}>
                    <IconButton color="default">
                        <FontAwesomeIcon icon={faFolderPlus} size="sm" color="#ffa726"/>
                    </IconButton>
                </Tooltip>
                </> : ''}
            >   {[...breadCrumbFiles].length !== 0 && <>
                    <Box width={1} display={"flex"} flexWrap={"wrap"} 
                        justifyContent={"center"} alignItems={"center"}>
                        <CustomBreadCrumb />
                    </Box>
                    <Divider style={{ width: '100%'}}/>
                </>}
                <Box width={1} height={1} display={"flex"} justifyContent={"center"}
                    alignItems={"center"} flexWrap={"wrap"} overflow={"auto"}>
                        {loading && <Box width={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <CircularProgress style={{ width:20, height:20}} /> <Typography className="ml-3">Loading...</Typography>
                        </Box>}
                        {(!loading && (!folders || folders.length === 0) && (!files || files.length === 0)) && 
                            <Typography> {translate("microgatewayApp.userFile.home.notFound")}</Typography>
                        }
                        {foldersItems}
                        {filesItems}
                </Box>
            </MyCustomModal>
        </React.Fragment>
    );
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
});

const mapDispatchToProps = {
    getSession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserFile);