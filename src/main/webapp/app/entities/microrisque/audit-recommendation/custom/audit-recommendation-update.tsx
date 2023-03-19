import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Box, Button, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, TableCellProps, TextField, Typography } from "@material-ui/core";
import { Close, Edit, Save } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import MyCustomModal from "app/shared/component/my-custom-modal";
import theme from "app/theme";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IAuditRecommendation } from "app/shared/model/microrisque/audit-recommendation.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import ModalFileManager from "app/shared/component/modal-file-manager";
import MyCustomRTE from "app/shared/component/my-custom-rte";
import { IDepartment } from "app/shared/model/department.model";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { associateFilesToEntity, setFileUploadWillAssociateEntityId } from 'app/shared/reducers/file-upload-reducer';
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { FileEntityTag } from "app/shared/model/file-chunk.model";

const useStyles = makeStyles({
    modal:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            with: '95%',
        }
    }
    
})

interface AuditRecommendationUpdateProps extends StateProps, DispatchProps{
    recommendation: IAuditRecommendation,
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const AuditRecommendationUpdate = (props: AuditRecommendationUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.recommendation || !props.recommendation.id);
    const [entity, setEntity] = useState(props.recommendation || {});
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [openFileManager, setOpenFileManager] = useState(false);
    const [departments, setDepartements] = useState<IDepartment[]>([]);
    const [openUserFinder, setOpenUserFinder] = useState(false);
    const [description, setDescription] = useState(props.recommendation ? props.recommendation.content : null);

    const [files, setFiles] = useState<IMshzFile[]>([]);

    const classes = useStyles();

    const formIsValid = entity && (entity.content || description || [...files].length !== 0);

    const dateLimit = entity && entity.dateLimit ? new Date(entity.dateLimit) : null;

    const fileTag = FileEntityTag.auditRecom;

    const getExistsFIles = () =>{
        if(props.recommendation && props.recommendation.id){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(props.recommendation.id, fileTag)
                .then(res => setFiles(res.data))
                .catch(e =>{
                   console.log(e)
                }).finally(() => setLoading(false))
        }else{
            setFiles([]);
        }
    } 
    
    const getDepertements = () =>{
        setLoading(true);
        axios.get<IDepartment[]>(`${API_URIS.depatartmentApiUri}`)
            .then(res => setDepartements(res.data))
            .catch(e =>{
                console.log(e)
            }).finally(() => setLoading(false))
    }

    useEffect(() =>{
        getDepertements();
    }, [])

    useEffect(() =>{
        setIsNew(!props.recommendation || !props.recommendation.id);
        setEntity(props.recommendation || {});
        setSubmited(false);
        setSuccess(false);
        getExistsFIles();
        setDescription(props.recommendation ? props.recommendation.content : null);
    }, [props.recommendation])

    const handleChange = (e) =>{
        const { name, value } = e.target;
        if(name==="entityId"){
            const dept = [...departments].find(d => d.id === value);
            setEntity({...entity, entityId: dept ? dept.id : null, entiyName: dept ? dept.name : null})
        }else{
            setEntity({...entity, [name] : value})
        }
    }

    const handleUserSelected = (selected?: IUserExtra) =>{
        setEntity({
            ...entity,
            responsableId: selected ? selected.id : null,
            responsableEmail: getUserExtraEmail(selected),
            responsableName: getUserExtraFullName(selected),
        })
    }

    const handleUploadedFiles = (uploaded?: IMshzFile[]) =>{
        if(uploaded && uploaded.length !==0){
            setFiles([...files, ...uploaded]);
        }
    }

    const saveFiles = (rec?: IAuditRecommendation) =>{
        if(rec && rec.id){
            props.setFileUploadWillAssociateEntityId(rec.id);
            if(props.account)
                props.associateFilesToEntity(rec.id, fileTag.toString(), props.account.id)
            if(props.onSave)
                props.onSave(rec, isNew);
            setSuccess(true);
        }
    }

    const onSave = (event) =>{
        event.preventDefault();
        setSubmited(true);
        setSuccess(false)
        setShowMessage(false)
        if(formIsValid){
            setLoading(true);
            const dbEntify: IAuditRecommendation ={
                ...entity,
                content: description || entity.content,
            }
            const req = isNew ? axios.post<IAuditRecommendation>(API_URIS.auditRecommendationApiUri, cleanEntity(dbEntify))
                            : axios.put<IAuditRecommendation>(API_URIS.auditRecommendationApiUri, cleanEntity(dbEntify));
            req.then(res =>{
                if(res.data){
                    saveFiles(res.data);
                    setEntity(res.data);
                }else{
                    setSuccess(false)
                    setShowMessage(true);
                }
            }).catch(e =>{
                setSuccess(false)
                setShowMessage(true);
                console.log(e)

            }).finally(() =>{
                setLoading(false)
            })
        }
    }

    const onRemoveMshzeFile = (removedId?: any) =>{
        setFiles(files.filter(f => f.id !== removedId))
    }

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            <ModalFileManager 
                open={openFileManager}
                files={[...files]}
                title={translate("_global.label.files")}
                selectMultiple
                entityId={entity ? entity.id : null}
                entityTagName={fileTag}
                onClose={() => setOpenFileManager(false)}
                onSave={handleUploadedFiles}
                onRemove={onRemoveMshzeFile}
            />
            {entity && 
                <UserExtraFinder2 
                    open={openUserFinder}
                    departmentId={entity.entityId}
                    onClose={() => setOpenUserFinder(false)}
                    unSelectableIds={[entity.responsableId]}
                    onSelectChange={handleUserSelected}
                />
            }
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={translate("microgatewayApp.microrisqueAuditRecommendation.home.createOrEditLabel")}
                rootCardClassName={classes.modal}
            >
                <form onSubmit={onSave}>
                    <Grid container spacing={2} alignItems="center">
                        {loading && <Grid item xs={12}>
                            <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress color="secondary"/>
                                <Typography variant="h4" color="secondary" className="ml-2">Loading...</Typography>
                            </Box>
                        </Grid>}
                        {submited && <Grid item xs={12}>
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
                        <Grid item xs={12} sm={3}>
                            <Button
                                className="text-capitalize"
                                endIcon={<Badge badgeContent={[...files].length}
                                    color="primary"><Edit /></Badge>}
                                variant="outlined"
                                onClick={() => setOpenFileManager(true)}
                            >
                                {translate("_global.label.files")}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <FormControl fullWidth size="medium">
                                <KeyboardDateTimePicker
                                    variant="inline"
                                    ampm={false}
                                    label={translate("microgatewayApp.microrisqueAuditRecommendation.dateLimit")}
                                    value={dateLimit}
                                    onChange={newDate => setEntity({...entity, dateLimit: newDate.toISOString()})}
                                    onError={console.log}
                                    format="dd/MM/yyyy HH:mm"
                                    InputLabelProps={{ shrink: true }}
                                    inputVariant="outlined"
                                    size="small"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <MyCustomRTE 
                                content={description}
                                label={translate("microgatewayApp.microrisqueAuditRecommendation.content")}
                                onSave={newContent => setDescription(newContent)}
                                editorMinHeight={250}
                                readonly={false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink={true}>{translate("microgatewayApp.microrisqueAuditRecommendation.entiyName")}</InputLabel>
                                <Select value={entity.entityId} name="entityId" 
                                    displayEmpty variant="outlined" onChange={handleChange}>
                                    {[...departments].map((dept, index) =>(
                                        <MenuItem key={index} value={dept.id}>{dept.name}</MenuItem>
                                    ))}
                                    <MenuItem>{translate(`_global.label.noSelect`)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                type="text"
                                label={translate("microgatewayApp.microrisqueAuditRecommendation.responsableName")}
                                InputLabelProps={{ shrink: true}}
                                value={entity.responsableName}
                                onClick={() => setOpenUserFinder(true)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box width={1} mt={1} display="flex" justifyContent="flex-end">
                                <Button color="primary" type="submit"  size="small"
                                    endIcon={<Save />} className="text-capitalize"
                                    disabled={!formIsValid}>
                                    {translate("entity.action.save")}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } : IRootState) => ({
    account: authentication.account,
})

const mapDispatchToProps = {
    associateFilesToEntity, 
    setFileUploadWillAssociateEntityId
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditRecommendationUpdate);