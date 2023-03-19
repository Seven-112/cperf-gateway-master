import React, { useState, useEffect } from 'react';
import { translate, Translate } from 'react-jhipster';

import { Badge, Box, Button, Card, CardContent, CardHeader, CircularProgress, Collapse, FormControl, Grid, IconButton, makeStyles, Modal, Slide, Tooltip, Typography } from '@material-ui/core';
import { Close, List, Visibility } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from 'app/shared/util/helpers';
import { Alert } from '@material-ui/lab';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { IQueryInstanceValidation } from 'app/shared/model/qmanager/query-instance-validation.model';
import ModalFileManager from 'app/shared/component/modal-file-manager';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { QueryValidationStatus } from 'app/shared/model/enumerations/query-validation-status.model';
import SelectableButtonGroup, { IOption } from 'app/shared/component/selectable-button-group';
import MyCustomRTEModal from 'app/shared/component/my-custom-rte-modal';
import { SaveButton } from 'app/shared/component/custom-button';
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer'
import { FileEntityTag } from 'app/shared/model/file-chunk.model';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '10px 10px 0 0',
    },
    cardContent:{
        background: 'white',
        minHeight: '10vh',
        maxHeight: '80vh',
        overflow: 'auto',
        borderRadius: '0 0 15px 15px', 
    },
    badge:{
      right: -7,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
    justifModal:{
        width: '33%',
        [theme.breakpoints.down("sm")]:{
            width: '93%',
        },
    },
}))

export interface IQueryInstanceValidationUpdateProps extends StatePorps, DispatchProps{
    instance: IQueryInstance,
    open?: boolean,
    onSave?: Function,
    onClose: Function
}

export const IQueryInstanceValidationUpdate = (props: IQueryInstanceValidationUpdateProps) => {
    const { open, account, instance } = props;
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validation, setValidation] = useState<IQueryInstanceValidation>({});
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [openFiles, setOpenFiles] = useState(false);
    const [loaginFiles, setLoadingFiles] = useState(false);
    const [openJustification, setOpenJustification] = useState(false);
    const [canValidate, setCanValide] = useState(false);
    const [canValidateChecking, setCanValdateCheckig] = useState(true);

    const classes = useStyles();

    const fileTag = FileEntityTag.queryInstanceValidation;

    const checkIfCanValidate = () =>{
        if(props.account && props.account.id && props.instance && props.instance.id){
            setCanValdateCheckig(true)
            let requestUri = `${API_URIS.queryInstanceValidationApiUri}/canValidate/`;
            requestUri = `${requestUri}?validatorId=${props.account.id}`;
            requestUri = `${requestUri}&instanceId=${props.instance.id}`;
            axios.get(requestUri)
                .then(res => setCanValide(res.data))
                .catch(e => console.log(e))
                .finally(() => setCanValdateCheckig(false))
        }
    }

    const getValidationFiles = (validationId) =>{
        if(validationId){
            setLoadingFiles(true)
            getMshzFileByEntityIdAndEntityTag(validationId, fileTag)
                .then(res =>{
                    setFiles([...res.data])
                }).catch(e => {
                    console.log(e)
                }).finally(() =>{
                    setLoadingFiles(false);
                })
        }
    }

    const getValidation = () =>{
        if(props.account && props.instance){
            setLoading(true)
            let requestUri = `${API_URIS.queryInstanceValidationApiUri}/?instanceId.equals=${props.instance.id}`;
            requestUri = `${requestUri}&validatorId.equals=${props.account.id}&page=0&size=1`
            axios.get<IQueryInstanceValidation[]>(requestUri)
                .then(res =>{
                    if(res.data && res.data.length !== 0){
                        setValidation(res.data[0]);
                        getValidationFiles(res.data[0].id);
                    }else{
                        setValidation({});
                    }
                }).catch(e => {
                    console.log(e)
                }).finally(() =>{
                    setLoading(false);
                })
        }
        setLoading(false);
    }


    useEffect(() =>{
        if(!props.account)
          props.getSession();
    }, [])

    useEffect(() =>{
        checkIfCanValidate();
        getValidation();
    }, [props.instance, props.account])

    const handleRemoveFile = (deletedId) =>{
        setFiles([...files].filter(f => f.id !== deletedId))
    }

    const handleSaveFiles = (saved?: IMshzFile[]) =>{
        if(saved && saved.length !== 0){
            setFiles([...saved, ...files])
        }
    }

    const handleClose = () => props.onClose();

    const reloadQueryInstance = (savedValidation?: IQueryInstanceValidation) =>{
        if(savedValidation && savedValidation.id && instance && instance.id){
            axios.get<IQueryInstance>(`${API_URIS.queryInstanceApiUri}/${instance.id}`)
            .then(res =>{
                if(res.data && props.onSave)
                    props.onSave(res.data);
            }).catch(e =>console.log(e))
            .finally(() => setLoading(false))
        }else{
            setLoading(false);
            handleClose();
        }
    }

    const persistNewFiles = (v?:IQueryInstanceValidation) =>{
        setLoading(true);
        if(v && v.id){
            props.setFileUploadWillAssociateEntityId(v.id);
            if(account)
                props.associateFilesToEntity(v.id,fileTag.toString(), account.id);
        }
        reloadQueryInstance(v);
    }

    const handleSave = (event) =>{
        event.preventDefault();
        console.log(validation)
        if(canValidate && validation){
            setLoading(true);
            const entity: IQueryInstanceValidation = {
                ...validation,
                instance: props.instance,
                validatorId: account.id,
            }
            
            const req = !entity.id ? axios.post<IQueryInstanceValidation>(`${API_URIS.queryInstanceValidationApiUri}`, cleanEntity(entity))
                                 : axios.put<IQueryInstanceValidation>(`${API_URIS.queryInstanceValidationApiUri}`, cleanEntity(entity));
            req.then(res =>{
                if(res.data){
                    setValidation(res.data);
                    persistNewFiles(res.data);
                }
            }).catch(e => {
                setSuccess(false);
                console.log(e);
                setLoading(false);
            }).finally(() => {})

        }
    }

    const handleChangeStatus = (option?: IOption) =>{
        if(option)
            setValidation({...validation, status: option.value})
    }

   
    const statusOptions: IOption[] = [
        { 
          label: translate(`microgatewayApp.QueryValidationStatus.${QueryValidationStatus.INITIAL.toString()}`),
          value: QueryValidationStatus.INITIAL,
          selected: !validation || (validation && (!validation.status || validation.status === QueryValidationStatus.INITIAL)),
          disabled: validation && validation.status && validation.status !== QueryValidationStatus.INITIAL
        },
        { 
          label: translate(`microgatewayApp.QueryValidationStatus.${QueryValidationStatus.APPROVED.toString()}`),
          value: QueryValidationStatus.APPROVED,
          selected: validation &&  validation.status === QueryValidationStatus.APPROVED,
          disabled: false
        },
        { 
          label: translate(`microgatewayApp.QueryValidationStatus.${QueryValidationStatus.REJECTED.toString()}`),
          value: QueryValidationStatus.REJECTED,
          selected: validation &&  validation.status === QueryValidationStatus.REJECTED,
          disabled: false
        },
    ];

  return (
    <React.Fragment>
    {(validation) && <>
        <ModalFileManager 
            open={openFiles}
            title="Documents"
            files={[...files]}
            entityId={validation ? validation.id : null}
            entityTagName={fileTag}
            selectMultiple
            onRemove={handleRemoveFile}
            readonly={!canValidate}
            onSave={handleSaveFiles}
            onClose={() => setOpenFiles(false)}
        />

        <MyCustomRTEModal
            open={openJustification}
            onClose={() => setOpenJustification(false)}
            content={validation.justification} editorMaxHeight={250}
            cardClassName={classes.justifModal}
            label={translate("microgatewayApp.qmanagerQueryInstanceValidation.justification")}
            onSave={value => { setValidation({...validation, justification: value}); setOpenJustification(false)}}
        />
     </>
    }
    <Modal
        aria-labelledby="edit-type-objectif-modal-title"
        aria-describedby="edit-type-objectif-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableBackdropClick
        BackdropProps={{
            timeout: 500,
        }}>
        <Slide in={open} timeout={300} unmountOnExit>
            <Card className={classes.card}>
                <CardHeader classes={{root: classes.cardHeader}} 
                    title={
                        <Translate contentKey="microgatewayApp.qmanagerQueryInstanceValidation.home.createOrEditLabel">Create or edit</Translate>
                    }
                    titleTypographyProps={{ variant: 'h4'}}
                    action={
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>
                    }/>
                <CardContent className={classes.cardContent}>
                    <form>
                        <Grid container spacing={3}>
                            {loading && <Grid item xs={12}>
                                <Box width={1} display="flex" justifyContent="center" justifyItems="center">
                                    <CircularProgress color="primary" style={{ height:25, width:25}} />
                                    <Typography color="primary" className="ml-3">Loading...</Typography>
                                </Box>
                            </Grid>}
                            {submited && <Grid item xs={12}>
                                <Collapse in={true}>
                                    <Alert severity={success? "success" : "error"} 
                                        action={
                                            <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {setSubmited(false); }}
                                        >
                                            <Close fontSize="inherit" />
                                        </IconButton>}
                                    >
                                        {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                    </Alert>
                                </Collapse>
                            </Grid>}
                            {validation && <>
                            {canValidateChecking &&  <Grid item xs={12}>
                                <Box width={1} textAlign="center">loading...</Box>
                            </Grid>}
                            {(!canValidateChecking && !canValidate) && <Grid item xs={12}>
                                <Alert severity="info">{translate("_global.label.queryValidationLocked")}</Alert>
                            </Grid>}
                            <Grid item xs={12} sm={4}>
                                <Box width={1} display="flex" justifyContent="center"alignItems="center" flexWrap="wrap">
                                        <Typography className="mr-3">
                                            {translate("microgatewayApp.qmanagerQueryInstanceValidation.status")}
                                        </Typography>
                                        <FormControl>
                                            <SelectableButtonGroup
                                                options={[...statusOptions]}
                                                onChange={handleChangeStatus}
                                                buttonGroupProps={{
                                                    size: 'small',
                                                    variant: 'outlined',
                                                    color: validation ?
                                                         validation.status === QueryValidationStatus.APPROVED ? 'primary' :
                                                         validation.status === QueryValidationStatus.REJECTED ? 'secondary' :
                                                         'default' : 'default',
                                                }}
                                                buttonProps={{
                                                    style: {
                                                        textTransform: 'none',
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box width={1} display="flex" justifyContent="center"alignItems="center" flexWrap="wrap">
                                    <Tooltip title={translate("entity.action.view")} placement="bottom-end">
                                        <Button color="primary" variant="text" 
                                            className="p-0 text-capitalize" onClick={() => setOpenFiles(true)}>
                                            <Typography className="mr-1">Documents</Typography>
                                            <Badge badgeContent={[...files].length} color="secondary"
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                classes={{
                                                    badge: classes.badge,
                                                }}>
                                                <Visibility />
                                            </Badge>
                                        </Button>
                                    </Tooltip>
                                    {loaginFiles && <CircularProgress color="primary" className="ml-3" style={{width: 20, height:20}} />}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box width={1} display="flex" justifyContent="center"alignItems="center" flexWrap="wrap">
                                    <Tooltip title={translate("entity.action.view")} placement="bottom-end">
                                        <Button color="primary" variant="text" 
                                            className="p-0 text-capitalize" onClick={() => setOpenJustification(true)}>
                                            <Typography className="mr-1">{translate("microgatewayApp.qmanagerQueryInstanceValidation.justification")}</Typography>
                                            <Badge badgeContent={0} color="secondary"
                                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                classes={{
                                                    badge: classes.badge,
                                                }}>
                                                <List />
                                            </Badge>
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className="text-right mt-3">
                                <SaveButton 
                                    disabled={!canValidate || !validation.status || canValidateChecking
                                                || validation.status === QueryValidationStatus.INITIAL} 
                                     onClick={handleSave}
                                />
                            </Grid>
                            </>}
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Slide>
    </Modal>
    </React.Fragment>
  );
};

const mapStateProps = ({ authentication }: IRootState) =>({
    account: authentication.account,
})

const mapDispatchProps = {
    getSession,
    associateFilesToEntity, 
    setFileUploadWillAssociateEntityId 
}

type StatePorps = ReturnType<typeof mapStateProps>;

type DispatchProps = typeof mapDispatchProps;

export default connect(mapStateProps, mapDispatchProps)(IQueryInstanceValidationUpdate);
