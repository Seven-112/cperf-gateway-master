import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Row, Col, Button } from 'reactstrap';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { IRootState } from 'app/shared/reducers';
import { handleRegister, reset } from './register.reducer';
import { Box, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { STRENGH_PASSWORD_REGEX } from 'app/shared/util/constantes';

const useStyles = makeStyles(theme =>({
    tileContainer:{
        color: theme.palette.primary.light,
    },
    formContainer:{
        padding:theme.spacing(5),
        color: theme.palette.primary.light,
        borderRadius:20,
        border:'2px solid'
    },
    loginLinkContainer:{
        display:'flex',
        justifyContent:'center',
    }
}));

export interface IRegisterProps extends StateProps, DispatchProps {}

export const CustomRegisterPage = (props: IRegisterProps) => {
  const [password, setPassword] = useState('');
  const classes = useStyles()

  useEffect(
    () => () => {
      props.reset();
    },
    []
  );

  const handleValidSubmit = (event, values) => {
    props.handleRegister(values.username, values.email, values.firstPassword, props.currentLocale);
    event.preventDefault();
  };

  const updatePassword = event => setPassword(event.target.value);

  return (
    <React.Fragment>
      <Helmet><title>Cperf | Register</title></Helmet>
      <div>
        <Row className="justify-content-center">
          <Col md="6">
              <Box className={classes.formContainer} boxShadow={3} width={1}>
                  <Row>
                      <Col md="12">
                      <h3 id="register-title" className={classes.tileContainer}>
                          <Translate contentKey="register.title">Registration</Translate>
                      </h3>
                      </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md="12">
                      <AvForm id="register-form" onValidSubmit={handleValidSubmit}>
                          <AvField
                          name="username"
                          label={translate('global.form.username.label')}
                          placeholder={translate('global.form.username.placeholder')}
                          validate={{
                              required: { value: true, errorMessage: translate('register.messages.validate.login.required') },
                              pattern: {
                              value: '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$',
                              errorMessage: translate('register.messages.validate.login.pattern'),
                              },
                              minLength: { value: 1, errorMessage: translate('register.messages.validate.login.minlength') },
                              maxLength: { value: 50, errorMessage: translate('register.messages.validate.login.maxlength') },
                          }}
                          />
                          <AvField
                          name="email"
                          label={translate('global.form.email.label')}
                          placeholder={translate('global.form.email.placeholder')}
                          type="email"
                          validate={{
                              required: { value: true, errorMessage: translate('global.messages.validate.email.required') },
                              minLength: { value: 5, errorMessage: translate('global.messages.validate.email.minlength') },
                              maxLength: { value: 254, errorMessage: translate('global.messages.validate.email.maxlength') },
                          }}
                          />
                          <AvField
                          name="firstPassword"
                          label={translate('global.form.newpassword.label')}
                          placeholder={translate('global.form.newpassword.placeholder')}
                          type="password"
                          onChange={updatePassword}
                          validate={{
                              required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
                              pattern: { value: STRENGH_PASSWORD_REGEX, errorMessage: translate("_global.flash.message.passwordStrenghly") },
                              minLength: { value: 8, errorMessage: translate('global.messages.validate.newpassword.minlength') },
                              maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') }
                          }}
                          />
                          <PasswordStrengthBar password={password} />
                          <AvField
                          name="secondPassword"
                          label={translate('global.form.confirmpassword.label')}
                          placeholder={translate('global.form.confirmpassword.placeholder')}
                          type="password"
                          validate={{
                              required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
                              minLength: { value: 8, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
                              maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
                              match: { value: 'firstPassword', errorMessage: translate('global.messages.error.dontmatch') },
                          }}
                          />
                          <Button id="register-submit" color="primary" type="submit">
                              <Translate contentKey="register.form.button">Register</Translate>
                          </Button>
                          <Box className={classes.loginLinkContainer}>
                              <Link className="alert-link" to="/login">
                                  <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                                  <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                              </Link>
                          </Box>
                      </AvForm>
                      </Col>
                  </Row>
              </Box>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
});

const mapDispatchToProps = { handleRegister, reset };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomRegisterPage);
