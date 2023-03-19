import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Alert, Col, Row } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { Box } from '@material-ui/core';
import theme from 'app/theme';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export type IPasswordResetInitProps =DispatchProps;

export class CustomPasswordResetInit extends React.Component<IPasswordResetInitProps> {
  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetInit(values.email);
    event.preventDefault();
  };

  render() {
    return (
      <React.Fragment>
        <Helmet><title>Cperf | Reset-password</title></Helmet>
        <div>
          <Row className="justify-content-center">
            <Col md="8">
              <Box boxShadow={2} padding={2} style={{ borderRadius:10, backgroundColor: theme.palette.primary.dark}}>
                <h1>
                  <Translate contentKey="reset.request.title">Reset your password</Translate>
                </h1>
                <Alert color="warning">
                  <p>
                    <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
                  </p>
                </Alert>
                <AvForm onValidSubmit={this.handleValidSubmit}>
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
                  <Button color="primary" type="submit">
                    <Translate contentKey="reset.request.form.button">Reset password</Translate>
                  </Button>
                  <Box style={{ display: 'flex', justifyContent: 'center' }}>
                      <Link className="alert-link" to="/login">
                          <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                          <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                      </Link>
                  </Box>
                </AvForm>
              </Box>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}



const mapDispatchToProps = { handlePasswordResetInit, reset };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(CustomPasswordResetInit);
