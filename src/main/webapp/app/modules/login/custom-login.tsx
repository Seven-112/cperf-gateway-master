import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';
import { Button, Card, CardContent, Checkbox, colors, FormControlLabel, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Send, Visibility, VisibilityOff } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import { getUpModules } from 'app/shared/reducers/app-util';

const useStyles = makeStyles(theme =>({
    card:{
        backgroundColor: theme.palette.primary.dark,
        borderRadius: 20,
    },
    cardContent:{
        paddingLeft: theme.spacing(10),
        paddingRight: theme.spacing(10),
    },
    formControl:{
    },
    input:{
        borderBottom: '1px solid white',
        paddingLeft:theme.spacing(2),
        color: theme.palette.background.paper,
        '& :focused':{
            color: 'red',
        }
    },
    inputIcon:{
        color:theme.palette.background.paper,
    },
    visibilityIcon:{
        position: 'relative',
        float: 'right',
        marginTop: -35,
        zIndex:3,
        color: theme.palette.background.paper,
    },
    logoContainer:{
        display: 'flex',
        justifyContent: 'center',
    },
    logo:{
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(3),
    }
}))

const MyInputLabel = (props) =>{
    return <>
      {props.icon && props.icon}
      <span style={{ marginLeft:5, color: 'white'}}>{(props.label && !props.hideTextLabel) && props.label}</span>
    </>
} 

interface ILoginForm{
    userName?: string,
    password?: string,
    rememberMe?: boolean,
}

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const CustomLogin = (props: ILoginProps) => {

  const handleLogin = (username, password, rememberMe = false) => props.login(username, password, rememberMe);

  const { location, isAuthenticated } = props;
  const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };
  const [formState, setFormState] = useState<ILoginForm>({rememberMe: false})
  const [hideUsernameTextLabel, setHideUserNameTextLabel] = useState(false)
  const [hidePasswordTextLabel, setHidePasswordTextLabel] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const classes = useStyles()

  useLayoutEffect(() =>{
    props.getUpModules();
  }, [])
  
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  const handleChange = (e) =>{
    const name = e.target.name
    const value = e.target.type==='checkbox' ? e.target.checked : e.target.value
    setFormState({...formState, [name]: value})
  }

  const handleBlur = (usernamefield: boolean) =>{
      if(usernamefield){
          setHideUserNameTextLabel(formState.userName ? true: false)
      }else{
          setHidePasswordTextLabel(formState.password? true: false)
      }
  }
  const handleFocus = (usernamefield: boolean) =>{
    if(usernamefield){
        setHideUserNameTextLabel(true)
    }else{
        setHidePasswordTextLabel(true)
    }
 }
 const onSubmit = (e) =>{
    e.preventDefault()
    if(formState.userName && formState.password){
        props.login(formState.userName, formState.password, formState.rememberMe)
    }
 }
  return(
      <React.Fragment>
        <Helmet><title>Cperf | Login </title></Helmet>
        <Row className="justify-content-center">
            <Col md="4">
                <Card classes={{ root:classes.card}}>
                    <CardContent className={classes.cardContent}>
                        <form onSubmit={onSubmit}>
                            <Grid container spacing={3} alignItems="baseline">
                                <Grid item xs={12} className={classes.logoContainer}>
                                    <img src="../../../content/images/logo.png" alt="" className={classes.logo}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField classes={{ root: classes.input}}
                                        variant="standard" fullWidth size="small"
                                        defaultValue={formState.userName}
                                        name="userName"
                                        label={
                                            <MyInputLabel icon={<AccountCircleIcon className={classes.inputIcon} />}
                                            label={translate('global.form.username.label')} 
                                            hideTextLabel={hideUsernameTextLabel}/>
                                        }
                                        placeholder={translate('global.form.username.placeholder')}
                                        inputProps={{
                                            className: classes.input,
                                        }}
                                        onBlur={() => handleBlur(true)}
                                        onFocus={() => handleFocus(true)}
                                        color="primary"
                                        onChange = {handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField classes={{ root: classes.input}}
                                        variant="standard" fullWidth size="small"
                                        defaultValue={formState.password}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        label={
                                            <MyInputLabel icon={<VpnKeyIcon className={classes.inputIcon} />}
                                            label={translate('login.form.password')} 
                                            hideTextLabel={hidePasswordTextLabel}/>
                                        }
                                        placeholder={translate('login.form.password.placeholder')}
                                        inputProps={{
                                            className: classes.input,
                                        }}
                                        onBlur={() => handleBlur(false)}
                                        onFocus={() => handleFocus(false)}
                                        color="primary"
                                        onChange = {handleChange}
                                    />
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end" className={classes.visibilityIcon}
                                    >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel style={{color: 'white'}}
                                        control={<Checkbox checked={formState.rememberMe} 
                                            onChange={handleChange} name="rememberMe" style={{ color:'white' }} />}
                                        label={ translate('login.form.rememberme')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Row className="justify-content-center">
                                        <Col md="4">
                                            <Button
                                            type="submit"
                                                variant="contained"
                                                color="primary"
                                                endIcon={<Send />}
                                            >
                                            <Translate contentKey="login.form.button">Sign in</Translate>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Grid>
                                <Grid xs={12} item>
                                    <Row className="justify-content-center">
                                        <Col md={7}>
                                            <Link to="/account/reset/request" style={{ color: colors.blueGrey[100]}} className="d-inline-block mt-3 mb-2">
                                                <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
                                            </Link>
                                        </Col>
                                        <Col md={5} className="align-center mt-3 pb-3">
                                            <Link to="/account/register" style={{ color: colors.blueGrey[100], float: 'right'}} className="d-inline-block mt-1">
                                                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Col>
        </Row>
      </React.Fragment>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  showModal: authentication.showModalLogin
});

const mapDispatchToProps = { login, getUpModules };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomLogin);