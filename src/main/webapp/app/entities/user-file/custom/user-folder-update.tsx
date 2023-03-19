import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, CircularProgress, Grid, makeStyles, TextField } from "@material-ui/core";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { IUserFile } from "app/shared/model/user-file.model";
import theme from "app/theme";
import React from "react";
import { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Save } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles({
    modal:{
        width: '30%',
        [theme.breakpoints.down('sm')]:{
            width: '70%',
        }
    },
});

interface UserFolderUpdateProps{
    folder: IUserFile,
    open?: boolean,
    onClose: Function,
    onSave?: Function,
}

export const UserFolderUpdate = (props: UserFolderUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.folder || !props.folder.id);
    const [folder, setFolder] = useState(props.folder || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setIsNew(!props.folder || !props.folder.id);
        setFolder(props.folder || {});
    }, [props.folder])

    const onSave = (event) =>{
        event.preventDefault();
        setError(false);
        if(folder.fileName && folder.userId){
            setLoading(true);
            const req = isNew ? axios.post<IUserFile>(API_URIS.userFileApiUri, cleanEntity(folder))
                                : axios.put<IUserFile>(API_URIS.userFileApiUri, cleanEntity(folder));
            req.then(res =>{
                if(res.data){
                    if(props.onSave)
                        props.onSave(res.data, isNew);
                }else{
                    setError(true); 
                }
            }).catch(e =>{
                console.log(e);
                setError(true);
            }).finally(() =>{
                setLoading(false);
            })
        }
    }

    const handleClose = () => props.onClose();

    return (
        <MyCustomModal
            open={open}
            onClose={handleClose}
            title={translate(`microgatewayApp.userFile.home.createOrEditLabel`)}
            avatarIcon={<FontAwesomeIcon icon={faFolderPlus} style={{ fontSize: 25, }}/>}
            rootCardClassName={classes.modal}
        >   
            <Box width={1} height={1} display={"flex"} justifyContent={"center"}
                alignItems={"center"} flexWrap={"wrap"} overflow={"auto"}>
                <form onSubmit={onSave}>
                    <Grid container spacing={3}>
                        {loading && 
                            <Grid item xs={12}>
                                <Box width={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <CircularProgress style={{ width:15, height:15, marginRight:3, }}/> Loading...
                                </Box>
                            </Grid>
                        }
                        {!loading && error &&
                            <Grid item xs={12}>
                                <Box width={1}>
                                    <Alert severity="error" onClose={() => setError(false)}>
                                        {translate("_global.flash.message.failed")}
                                    </Alert>
                                </Box>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={folder.fileName}
                                label={translate("_global.instance.folder")}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setFolder({...folder, fileName: e.target.value})}
                             />
                        </Grid>
                          <Grid item xs={12}>
                            <SaveButton
                                type='submit'
                                disabled={!folder || !folder.fileName || !folder.userId}
                                className={'text-capitalize float-right'} />
                          </Grid>
                    </Grid>
                </form>
            </Box>
        </MyCustomModal>
    );
}

export default UserFolderUpdate;