import { faBan, faCheckCircle, faFile, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Box, Button, CircularProgress, Collapse, Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { IRootState } from "app/shared/reducers"
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag } from "app/shared/util/helpers";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Alert } from "@material-ui/lab";
import MyCustomRTEModal from "app/shared/component/my-custom-rte-modal";
import { IAuditStatusTraking } from "app/shared/model/microrisque/audit-status-traking.model";
import { AuditStatus } from "app/shared/model/enumerations/audit-status.model";
import { IAudit } from "app/shared/model/microrisque/audit.model";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer'

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '85%',
        }
    },
    taskItemBox:{
        cursor: 'pointer',
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover':{
            border: `1px solid ${theme.palette.secondary.main}`,
        }
    },
    justificationCard:{
        width: '44%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
    }
}))


interface AuditStatusTrakingUpdateProps extends StateProps, DispatchProps{
    open?:boolean,
    title?: string,
    cancelText?: string,
    okText?:string,
    auditOrRecommendation:IAudit | IAuditRecommendation,
    isRecomendation?: boolean,
    traking?:IAuditStatusTraking,
    newStatus: AuditStatus,
    onChangeStatus?:Function,
    onSavedTraking?: Function,
    onClose:Function,
}

export const AuditStatusTrakingUpdate = (props: AuditStatusTrakingUpdateProps) =>{
    const { open, account, newStatus, auditOrRecommendation, title, cancelText, okText, isRecomendation } = props;
    const [entity, setEntity] = useState(props.traking || {auditId: auditOrRecommendation.id});
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [openFileManager, setOpenFileManager] = useState(false);
    const [openJustif, setOpenJustif] = useState(false);
    const [success, setSuccess] = useState(false);

    const isDynamicTrack = auditOrRecommendation && auditOrRecommendation.status && newStatus && auditOrRecommendation.status !== newStatus;

    const getFiles = () =>{
        if(entity && entity.id){
            getMshzFileByEntityIdAndEntityTag(entity.id, FileEntityTag.auditStatusTraking)
                .then(res =>{
                    if(res.data){
                        setFiles([...files, ...res.data]);
                    }
                }).catch(e => console.log(e))
        }else{
            setFiles([]);
        }
    }


    useEffect(() =>{
        setEntity(props.traking || {auditId: auditOrRecommendation.id});
        getFiles();
    }, [props.auditOrRecommendation, props.newStatus])

    const classes = useStyles();

    const handleClose = () => {
        setSuccess(false);
        setFiles([]);
        props.onClose();
    }

    const handleUploadedFiles = (uploaded?: IMshzFile[]) =>{
        if(uploaded && uploaded.length !==0){
            setFiles([...files, ...uploaded]);
        }
    }

    const saveHistoryFiles = (traking?: IAuditStatusTraking) =>{
        if(traking && traking.id){
            props.setFileUploadWillAssociateEntityId(traking.id);
            if(account)
                props.associateFilesToEntity(traking.id, FileEntityTag.auditStatusTraking.toString(), account.id);

            setLoading(false)
            
            if(props.onSavedTraking)
                props.onSavedTraking(traking, true);
            handleClose();
        }
    }

    const saveHistory = () =>{
        const history: IAuditStatusTraking = {
            ...entity, 
            auditId: auditOrRecommendation.id,
            status: newStatus,
            userId: account ? account.id : null,
            tracingAt: (new Date()).toISOString(),
            editable: isDynamicTrack ? null : true,
            recom: isRecomendation,
        }
        setLoading(true)
        axios.post<IAuditStatusTraking>(API_URIS.auditStatusTrackingApiUri, cleanEntity(history))
            .then(res =>{
                if(res && res.data){
                    saveHistoryFiles(res.data);
                }
            }).catch(e => {
                console.log(e)
            }).finally(() => {
                setLoading(false)
            })
    }

    const onConfirm = (event) =>{
        event.preventDefault();
        if(auditOrRecommendation){
            if(isDynamicTrack){
                auditOrRecommendation.status = newStatus;
                setLoading(true)
                const apiUri = isRecomendation ? API_URIS.auditRecommendationApiUri : API_URIS.auditApiUri;
                axios.put<IAudit | IAuditRecommendation>(apiUri, cleanEntity(auditOrRecommendation))
                    .then(res =>{
                        if(res.data){
                            setSuccess(true);
                            if(props.onChangeStatus){
                                props.onChangeStatus(res.data);
                            }
                            saveHistory();
                        }
                    }).catch(e => console.log(e))
                    .finally(() => setLoading(false))
            }else{
                saveHistory();
            }
        }
    }


    return (
        <React.Fragment>
            <ModalFileManager
                open={openFileManager}
                files={[...files]}
                entityId={entity ? entity.id : null}
                entityTagName={FileEntityTag.auditStatusTraking}
                onClose={() => setOpenFileManager(false)}
                onSave={handleUploadedFiles}
                selectMultiple
                title={`${translate("_global.label.files")} ${translate("_global.label.of")} ${translate("microgatewayApp.microprocessTaskStatusTraking.justification")}`}
             /> 
              {entity && 
                <MyCustomRTEModal 
                    open={openJustif}
                    cardClassName={classes.justificationCard}
                    title={translate("microgatewayApp.microprocessTaskStatusTraking.justification")}
                    content={entity.justification}
                    onClose={() =>{setOpenJustif(false)}}
                    editorMinHeight={350}
                    onSave={value =>{ 
                        setOpenJustif(false); 
                        setEntity({...entity, justification: value}) 
                    }}
                />
             }
             <MyCustomModal
                open={open}
                onClose={handleClose}
                title={title || "Confirmation"}
                rootCardClassName={classes.card}
             >
             {auditOrRecommendation && <>
                {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center"
                    flexWrap="wrap" overflow="auto" p={2}>
                        <CircularProgress style={{ width:50, height:50 }}/> <Typography className="ml-3">Loading...</Typography>
                    </Box>}
                {(!loading && success) && <Box width={1}>
                    <Collapse in={open}>
                        <Alert severity="success"
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setSuccess(false);
                                }}
                                >
                                <Close fontSize="inherit" />
                                </IconButton>}
                            >
                                {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                        </Alert>
                    </Collapse>
                </Box>}
                <Box width={1} textAlign="center" 
                    overflow="auto" flexWrap="wrap"
                    textOverflow="text-wrap" boxShadow={1} p={1}>
                        <Typography variant="h4">
                            {isDynamicTrack ? <>
                                {newStatus === AuditStatus.CANCELED && translate(`_global.label.cancelling.${isRecomendation ? 'recom' : 'audit'}`)}
                                {newStatus === AuditStatus.EXECUTED && translate(`_global.label.executing.${isRecomendation ? 'recom' : 'audit'}`)}
                                {newStatus === AuditStatus.SUBMITTED && translate(`_global.label.submitting.${isRecomendation ? 'recom' : 'audit'}`)}
                                {(newStatus === AuditStatus.STARTED) && translate(`_global.label.starting.${isRecomendation ? 'recom' : 'audit'}`)}
                                {newStatus === AuditStatus.COMPLETED && translate(`_global.label.completing.${isRecomendation ? 'recom' : 'audit'}`)}
                            </>: translate("microgatewayApp.microprocessTaskStatusTraking.home.createOrEditLabel")}
                        </Typography>
                </Box>
                <Box width={1} mt={2} mb={2} boxShadow={2} p={2} pt={1}>
                    <Typography variant="h4" className="text-primary mb-3">
                        {translate("microgatewayApp.microprocessTaskStatusTraking.justification")}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box width={1} display="flex" 
                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                    <Button
                                        color="primary" 
                                        className="text-capitalize mr-3"
                                        endIcon={<FontAwesomeIcon icon={faPen} />}
                                        onClick={() => setOpenJustif(true)}>
                                        Text
                                    </Button>
                                    <Button
                                        color="inherit"
                                        className="text-capitalize"
                                        endIcon={
                                        <Badge badgeContent={[...files].length} 
                                                color="secondary"
                                                showZero={true}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                            > 
                                                <FontAwesomeIcon icon={faFile} />
                                            </Badge>
                                        }
                                        onClick={() => setOpenFileManager(true)}>
                                        {translate("_global.label.files")}
                                    </Button>
                                </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box display="flex" flexWrap="wrap"
                     overflow="auto" justifyContent="center" alignItems="center" mt={5}>
                    <Button 
                        color="default"
                        variant="text"
                        className="text-capitalize"
                        onClick={handleClose}>
                            <Typography className="mr-2">{cancelText || translate("_global.label.cancel")}</Typography>
                            <FontAwesomeIcon icon={faBan} />
                    </Button>
                    <Button 
                        color="primary"
                        variant="text"
                        disabled={success}
                        onClick={onConfirm}
                        className="ml-5 text-capitalize">
                            <Typography className="mr-2">{okText || translate("_global.label.confirm")}</Typography>
                            <FontAwesomeIcon icon={faCheckCircle} />
                    </Button>
                </Box>
                </>}
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }:IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    associateFilesToEntity, 
    setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatusTrakingUpdate);
