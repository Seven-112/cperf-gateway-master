import { Backdrop, Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, Collapse, FormControlLabel, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Translate, translate } from "react-jhipster";
import { IUser } from "app/shared/model/user.model";
import { AUTHORITIES } from "app/config/constants";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Alert } from "@material-ui/lab";

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
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
}))

interface UserUpdateProps{
    account:any,
    user?: IUser,
    open?:boolean,
    onClose: Function,
    onSave?: Function
}
export const UserUpdate = (props:UserUpdateProps) =>{
    const {account, open } = props;
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(props.user || {});
    const [loaginOrEmailInvalid, setLoginOrEmailInvalid] = useState(false)
    const [error, setError] = useState(false);
    const [showMsg, setShowMsg] = useState(false)
    
    const classes = useStyles();

    useEffect(() =>{
       setUser(props.user || {});
    }, [props.user])

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const handleClose = () => props.onClose();

    const hasRole = (role) =>{
        if(role && user && user.authorities){
           return user.authorities.includes(role);
        }
        return false;
    }
    
    const handleChangeRole = (role) =>{
        if(role){
            if(hasRole(role)){
                const roles = [...user.authorities].filter(r => r.toString() !== role.toString());
                setUser({...user, authorities: roles});
            }else{
                const roles = user.authorities ? [...user.authorities, role] : [role];
                setUser({...user, authorities: roles});
            }
        }
    }

    const saveUser = () =>{
        setLoading(true);
        setError(false);
        axios.put<IUser>(`${API_URIS.userApiUri}`, cleanEntity(user))
            .then(res =>{
                if(res.data){
                    if(props.onSave){
                        props.onSave(res.data);
                        setShowMsg(false)
                    }else{
                        setShowMsg(false)
                    }
                }else{
                    setError(true);
                    setShowMsg(true);
                }
            }).catch(e =>{
                console.log(e)
                setError(true);
                setShowMsg(true)
            }).finally(() =>{ setLoading(false)})
    }

    const validEmailAndLogin = () =>{
      setLoginOrEmailInvalid(false);
      setError(false);
      setShowMsg(false);
      if(user && user.email && user.login){
        setLoading(true)
        axios.get<IUser[]>(`${API_URIS.userApiUri}/getByEmailOrLogin/?email=${user.email}&login=${user.login}`)
            .then(res =>{
                if(res.data){
                    if(res.data.some(u => u.id !== user.id)){
                        setLoginOrEmailInvalid(true);
                        setShowMsg(true)
                    }else{
                        saveUser();
                    }
                }else{
                    saveUser();
                }
            }).catch(e =>{
                console.log(e)
                setShowMsg(true)
                setError(true)
            }).finally(() =>{ setLoading(false)})
      }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        validEmailAndLogin();
    }

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={translate("userManagement.home.createOrEditLabel")}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={
                        props.onClose ? 
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>: ''}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {loading && <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                            <CircularProgress color="secondary"/>
                                            <Typography variant="h4" color="secondary" className="ml-2">Loading...</Typography>
                                    </Box>
                                </Grid>}
                                {showMsg && <Grid item xs={12}>
                                    <Collapse in={showMsg}>
                                        <Alert severity={(!error && !loaginOrEmailInvalid) ? "success" : "error"} 
                                            action={
                                                <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                  setShowMsg(false);
                                                }}
                                              >
                                                <Close fontSize="inherit" />
                                              </IconButton>}
                                         >
                                             {(!error && !loaginOrEmailInvalid) ? translate("_global.flash.message.success") 
                                              : loaginOrEmailInvalid ? translate("_global.label.emailOrLoginUsed") : translate("_global.flash.message.failed")}
                                        </Alert>
                                    </Collapse>
                                </Grid>}
                                <Grid item xs={6}>
                                    <TextField 
                                        name="firstName"
                                        value={user.firstName} 
                                        fullWidth
                                        size="small"
                                        label={<Translate contentKey="userManagement.firstName">firstName</Translate>}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        name="lastName"
                                        value={user.lastName} 
                                        fullWidth
                                        size="small"
                                        label={<Translate contentKey="userManagement.lastName">lastName</Translate>}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        name="login"
                                        value={user.login} 
                                        fullWidth
                                        size="small"
                                        label={<Translate contentKey="userManagement.login">login</Translate>}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        name="email"
                                        value={user.email} 
                                        fullWidth
                                        size="small"
                                        label={<Translate contentKey="userManagement.email">email</Translate>}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} boxShadow={2} borderRadius={7} p={1}>
                                            <Typography variant="h4">
                                                <Translate contentKey="userManagement.profiles">Profiles</Translate>
                                            </Typography>
                                            <Box width={1} display="flex"justifyContent="center"
                                                alignItems="center" flexWrap="wrap" overflow="auto">
                                                    {/* ADMIN AUTHORITY */}
                                                        <FormControlLabel 
                                                            control={<Checkbox checked={hasRole(AUTHORITIES.ADMIN.toString())} />}
                                                            label={AUTHORITIES.ADMIN}
                                                            onChange={() =>handleChangeRole(AUTHORITIES.ADMIN)}
                                                            className="m-1"
                                                        />

                                                    {/* USER AUTHORITY */}
                                                        <FormControlLabel 
                                                            control={<Checkbox checked={hasRole(AUTHORITIES.USER.toString())} />}
                                                            label={AUTHORITIES.USER}
                                                            onChange={() =>handleChangeRole(AUTHORITIES.USER)}
                                                            className="m-1"
                                                        />
                                                    {/* EMPLOYEE AUTHORITY */}
                                                        <FormControlLabel 
                                                            control={<Checkbox checked={hasRole(AUTHORITIES.EMPLOYEE.toString())} />}
                                                            label={AUTHORITIES.EMPLOYEE}
                                                            onChange={() =>handleChangeRole(AUTHORITIES.EMPLOYEE)}
                                                            className="m-1"
                                                        />
                                                    {/* DEVELOPER AUTHORITY */}
                                                        <FormControlLabel 
                                                            control={<Checkbox checked={hasRole(AUTHORITIES.DEVELOPER.toString())} />}
                                                            label={AUTHORITIES.DEVELOPER}
                                                            onChange={() =>handleChangeRole(AUTHORITIES.DEVELOPER)}
                                                            className="m-1"
                                                        />
                                            </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="text" 
                                        disabled={!user || !user.login || !user.email}
                                        className="float-right text-capitalize" color="primary">
                                        {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default UserUpdate;