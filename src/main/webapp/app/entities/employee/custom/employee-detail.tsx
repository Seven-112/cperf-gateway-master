import { Avatar, Box, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { IEmployee } from "app/shared/model/employee.model";
import { API_URIS, DEFAULT_USER_AVATAR_URI, deleteUserExtraPhoto, formateBase64Src } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import MyCustomModal from "app/shared/component/my-custom-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEnvelope, faMobileAlt, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { TextFormat, translate } from "react-jhipster";
import { convertDateToServer } from "app/shared/util/date-utils";
import { APP_DATE_FORMAT } from "app/config/constants";
import UserFile from "app/entities/user-file/custom/user-file";
import CustomAvatar from "app/shared/component/custom-avatar";

const useStyles = makeStyles(theme =>({
    modal:{
        width: `35%`,
        [theme.breakpoints.down['sm']] : {
            width: `85%`,
        }
    },
    avatar:{
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    managerAvatar:{
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}))

interface EmployeeDetailProps{
    employee: IEmployee,
    open?: boolean,
    onClose?: Function
}

export const EmployeeDetail = (props: EmployeeDetailProps) =>{
    const { employee, open } = props;
    
    const [manager, setManager] = useState<IEmployee>(null);
    const [loading, setLoading] = useState(false);
    const [openFiles, setOpenFiles] = useState(false);
    const classes = useStyles();

    const getManager = () =>{
        if(props.employee && props.employee.managerId){
            setLoading(true)
            axios.get<IEmployee>(`${API_URIS.employeeApiUri}/${props.employee.managerId}`)
                .then(res => setManager(res.data))
                .catch((e) => console.log(e))
                .finally(() => setLoading(false))
        }else{
            setManager(null);
        }
    }

    useEffect(() =>{
        getManager();
    }, [props.employee])

    const handleClose = () => props.onClose();

    const handleOpenFiles = () =>{
        if(employee)
            setOpenFiles(true);
    }

    return (
        <React.Fragment>
            {employee && <UserFile 
                open={openFiles} 
                isEmployee={true}
                userExtra={{employee}}
                onClose={() => setOpenFiles(false)}
            />}
            <MyCustomModal open={open} onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faUserTie} />}
                rootCardClassName={classes.modal}
                title={translate("microgatewayApp.micropeopleEmployee.detail.title")}
                customActionButtons={
                    <Tooltip title={`${translate("microgatewayApp.userFile.home.title")}`}>
                        <IconButton onClick={handleOpenFiles} className="text-success">
                            <FontAwesomeIcon icon={faCopy} />
                        </IconButton>
                    </Tooltip>
                }
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box display={"flex"} 
                        justifyContent={"center"}
                        alignItems={"center"} flexWrap={"wrap"} 
                        overflow={"auto"} flexDirection={"column"}>
                            <CustomAvatar 
                                alt={employee.photoName} photoId={employee.photoId}
                                avatarProps={{ className: classes.avatar }}
                                loadingSize={100}
                            />
                            <Typography variant="h4">{`${employee.firstName} ${employee.lastName}`}</Typography>
                            {employee.email &&
                                <Box mt={2} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                                    <Typography className="ml-2">{employee.email}</Typography>
                                </Box>
                            }
                            {employee.phoneNumber &&
                                <Box  mt={2} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <FontAwesomeIcon icon={faMobileAlt} className="text-success" />
                                    <Typography className="ml-2">{employee.phoneNumber}</Typography>
                                </Box>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display={"flex"} 
                        justifyContent={"center"}
                        alignItems={"center"} flexWrap={"wrap"} 
                        overflow={"auto"} flexDirection={"column"}>
                            <List>
                                {employee.hireDate &&
                                    <ListItem>
                                        <ListItemText 
                                            primary={translate("microgatewayApp.employee.hireDate")}
                                            secondary={<TextFormat type="date" format={APP_DATE_FORMAT}
                                                value={convertDateToServer(employee.hireDate)} 
                                            />}
                                        />
                                    </ListItem>
                                }
                                <ListItem>
                                    <ListItemText 
                                        primary={translate("microgatewayApp.micropeopleEmployee.department")}
                                        secondary={employee.department ? employee.department.name : ''}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={translate("microgatewayApp.fonction.detail.title")}
                                        secondary={employee.fonction ? employee.fonction.name : ''}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary={translate("microgatewayApp.micropeopleEmployee.managerId")}
                                        secondary={manager ? <Box display={"flex"} alignItems={"center"}>
                                            <CustomAvatar 
                                                alt={manager.photoName} photoId={manager.photoId}
                                                avatarProps={{ className: classes.managerAvatar }}
                                            />
                                            <Typography variant="caption" className="ml-2">{`${manager.firstName} ${manager.lastName}`}</Typography>
                                        </Box> : ''}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </MyCustomModal>
        </React.Fragment>
    )
}

export default EmployeeDetail;