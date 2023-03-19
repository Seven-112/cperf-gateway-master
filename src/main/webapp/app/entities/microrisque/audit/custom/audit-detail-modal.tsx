import { IAudit } from "app/shared/model/microrisque/audit.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { makeStyles } from "@material-ui/styles";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import { TextFormat, translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import theme from "app/theme";
import { Box, Button, CircularProgress, Grid, Tooltip, Typography } from "@material-ui/core";
import AuditChrono from "./audit-chrono";
import { convertDateTimeToServer } from "app/shared/util/date-utils";
import AuditUser from "../../audit-user/custom/audit-user";
import { Visibility } from "@material-ui/icons";

const useStyles = makeStyles({
    card:{
        width: '45%',
        [theme.breakpoints.down("sm")] : {
            width: '90%',
        }
    }
})

interface AuditDetailModalProps{
    auditId?: any,
    audit?: IAudit,
    open?: boolean,
    onClose: Function
}
export const AuditDetailModal = (props: AuditDetailModalProps) =>{
    const { open } = props;
    const [audit, setAudit] = useState(props.audit);
    const [loading, setLoading] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);

    const classes = useStyles();

    const getAudit = () =>{
        if(props.auditId && !props.audit){
            setLoading(false);
            axios.get<IAudit>(`${API_URIS.auditApiUri}/${props.auditId}`)
                .then(res => setAudit(res.data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        setAudit(props.audit);
        getAudit();
    }, [props.audit, props.auditId])

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
            {audit && <>
                <AuditUser 
                    open={openUsers}
                    audit={audit}
                    onClose={() => setOpenUsers(false)}
                />
            </>}
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faGlasses} />}
                title={translate("microgatewayApp.microrisqueAudit.detail.title")}
                rootCardClassName={classes.card}
            >
                {loading && <Box width={1} display="flex" 
                    justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                        <CircularProgress style={{ width: 25, height:25, marginRight: 7}} />
                        <Typography>Loading...</Typography>
                </Box>}
                {audit &&
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} className="text-center">
                            <Box width={1} textAlign="center">
                                <Typography variant="h5">{audit.title}</Typography>
                            </Box>
                            <Box width={1} display="flex" mt={2} mb={2} 
                                justifyContent={"center"} alignItems="start" flexWrap={"wrap"} overflow="auto">
                                {/* chrono box */} 
                                <Box display="flex" pt={0.5} mr={2}
                                    flexDirection={"column"} justifyContent={"center"}
                                     alignItems="center" flexWrap={"wrap"} overflow="auto">
                                    <AuditChrono audit={audit} />
                                    <Typography className="ml-2" variant="caption">
                                        {audit.status ? translate(`microgatewayApp.AuditStatus.${audit.status.toString()}`) : '...'}
                                    </Typography>
                                </Box>
                                {/* end chrono box */}
                                <Tooltip title={translate("entity.action.view")}
                                    onClick={() => setOpenUsers(true)}>
                                    <Button color="primary" endIcon={<Visibility  />} className="text-capitalize p-0">
                                        {translate("userManagement.home.title")}
                                    </Button>
                                </Tooltip>
                             </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1} display="flex" 
                                 flexDirection={"column"} boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microrisqueAudit.startDate")}
                                 </Typography>
                                {audit.startDate ? <TextFormat type="date"
                                     value={convertDateTimeToServer(audit.startDate)}
                                     format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                                    : '...'}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1} display="flex" 
                                 flexDirection={"column"} boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {`${translate("microgatewayApp.microrisqueAudit.endDate")}`}
                                </Typography>
                                {audit.endDate ? <TextFormat type="date"
                                     value={convertDateTimeToServer(audit.endDate)}
                                     format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} />
                                    : '...'}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex" 
                                 flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microrisqueAudit.cycle")}
                                </Typography>
                                <Typography variant="caption">{audit.cycle ? audit.cycle.name : '...'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex" 
                                flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microrisqueAudit.type")}
                                </Typography>
                                <Typography variant="caption">{audit.type ? translate(`microgatewayApp.AuditType.${audit.type.toString()}`) : '...'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex"
                                 flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microrisqueAudit.riskName")}
                                </Typography>
                                <Typography variant="caption">{audit.riskName || '...'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex" 
                                 flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microrisqueAudit.riskLevel")}
                                </Typography>
                                <Typography variant="caption">{audit.riskLevel ? translate(`microgatewayApp.AuditRiskLevel.${audit.riskLevel.toString()}`) : '...'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex" 
                                 flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microprocessProcess.detail.title")}
                                </Typography>
                                <Typography variant="caption">{audit.processName || '...'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="text-center">
                            <Box width={1}  display="flex" 
                                 flexDirection="column" boxShadow={1} borderRadius={7}
                                 justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                                <Typography variant="caption" color="primary" className="mb-2">
                                    {translate("microgatewayApp.microprocessProcessCategory.detail.title")}
                                </Typography>
                                <Typography variant="caption">{audit.processCategoryName || '...'}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                }
                {(!audit && !loading) && <Box width={1} display="flex" 
                    justifyContent={"center"} alignItems="center" flexWrap={"wrap"} overflow="auto">
                        <Typography>{translate("microgatewayApp.microrisqueAudit.home.notFound")}</Typography>
                </Box>}
            </MyCustomModal>
        </React.Fragment>
    )
}

export default AuditDetailModal;