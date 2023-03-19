import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom';
import {Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import './login.scss';
import { Warning } from '@material-ui/icons';

export interface ILoginModalProps {
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps> {

  handleSubmit = (event, errors, { username, password, rememberMe }) => {
    const { handleLogin } = this.props;
    handleLogin(username, password, rememberMe);
  };

  render() {
    const { loginError, handleClose } = this.props;

    return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={11} md={3} className="loginFormContainer">
              <Card className="loginCard">
                <CardHeader
                    title = "SignIn" className="white loginCardHeader"
                  />
                <CardContent className="white loginCardContent">
                  <AvForm onSubmit={this.handleSubmit}>
                      <Row>
                        <Col md="12">
                          {loginError ? (
                            <Alert severity="error" variant="filled"
                              icon={<Warning fontSize="inherit"/>} className="loginErrorAlert">
                              <Translate contentKey="login.messages.error.authentication">
                                <strong>Failed to sign in!</strong> Please check your credentials and try again.
                              </Translate>
                            </Alert>
                          ) : <div className="loginErrorContainer"></div>}
                        </Col>
                        <Col md="12">
                          <AvField
                            name="username"
                            label={translate('global.form.username.label')}
                            placeholder={translate('global.form.username.placeholder')}
                            required
                            errorMessage="Username cannot be empty!"
                            autoFocus
                          />
                          <AvField
                            name="password"
                            type="password"
                            label={translate('login.form.password')}
                            placeholder={translate('login.form.password.placeholder')}
                            required
                            errorMessage="Password cannot be empty!"
                          />
                          <AvGroup check inline>
                            <Label className="form-check-label">
                              <AvInput type="checkbox" name="rememberMe" /> <Translate contentKey="login.form.rememberme">Remember me</Translate>
                            </Label>
                          </AvGroup>
                        </Col>
                        <Col md={12}  m={1} className="align-center">
                          <Button color="success" type="submit" className="btnSubmitLogin">
                            <Translate contentKey="login.form.button">Sign in</Translate>
                          </Button>
                        </Col>
                        <Col md={12} >
                          <Link to="/account/reset/request" color="primary" className="d-inline-block mt-1 mb-2">
                            <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
                          </Link>
                        </Col>
                        <Col md={12} className="align-center mt-1 pb-3">
                          <Link to="/account/register" className="d-inline-block mt-1">
                            <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                          </Link>
                        </Col>
                      </Row>
                  </AvForm>
                </CardContent>
              </Card>
            </Grid>
        </Grid>
    );
  }
}

export default LoginModal
