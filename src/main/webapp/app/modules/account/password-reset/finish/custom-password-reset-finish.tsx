import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, getUrlParameter } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { Box, Button, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { IRootState } from 'app/shared/reducers';
import { STRENGH_PASSWORD_REGEX } from 'app/shared/util/constantes';

const useStyles = makeStyles(theme =>({
    card:{
      width: '95%',
      background: 'transparent',
      border: 'none',
      [theme.breakpoints.up('sm')]:{
        width: '37%',
      }
    },
    cardHeader:{
      background: theme.palette.primary.dark,
      color: 'white',
      borderRadius: '7px 7px 0 0',
    },
    cardContent:{
      background: theme.palette.primary.dark,
    },
    formBox:{
      backgroundColor: theme.palette.grey[100],
    }
}))

export interface IPasswordResetFinishProps extends StateProps, DispatchProps, RouteComponentProps<{ key: string }> {}

export const CustomPasswordResetFinishPage = (props: IPasswordResetFinishProps) => {
  const [password, setPassword] = useState('');
  const [key] = useState(getUrlParameter('key', props.location.search));

  const classes = useStyles();

  useEffect(
    () => () => {
      props.reset();
    },
    []
  );

  useEffect(() =>{
      if(props.restPasswordSuccess){
        props.reset();
        props.history.push('/login');
      }
  }, [props.restPasswordSuccess])

  const handleValidSubmit = (event, values) => props.handlePasswordResetFinish(key, values.newPassword);

  const updatePassword = event => setPassword(event.target.value);

  const getResetForm = () => {
    return (
          <Box boxShadow={2} padding={5} className={classes.formBox}>
            <AvForm onValidSubmit={handleValidSubmit}>
              <AvField
                name="newPassword"
                label={translate('global.form.newpassword.label')}
                placeholder={translate('global.form.newpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
                  pattern: { value: STRENGH_PASSWORD_REGEX, errorMessage: translate("_global.flash.message.passwordStrenghly") },
                  minLength: { value: 4, errorMessage: translate('global.messages.validate.newpassword.minlength') },
                  maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') },
                }}
                onChange={updatePassword}
              />
              <PasswordStrengthBar password={password} />
              <AvField
                name="confirmPassword"
                label={translate('global.form.confirmpassword.label')}
                placeholder={translate('global.form.confirmpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
                  minLength: { value: 4, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
                  maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
                  match: { value: 'newPassword', errorMessage: translate('global.messages.error.dontmatch') },
                }}
              />
              <Box width={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" flexWrap="wrap">
                    <Button 
                       variant="contained"
                       color="primary" type="submit" 
                      className="mb-5 mt-5 text-white text-normal">
                      <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
                    </Button>
                    <Link className="alert-link" to="/login">
                        <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                        <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                    </Link>
                </Box>
            </AvForm>
          </Box>
        );
  };

  return (
    <React.Fragment>
      <Helmet><title>Cperf | Rest-password</title></Helmet>
      <Box display="flex" width={1} justifyContent="center" alignItems="center" height="70vh">
            <Card className={classes.card}>
                <CardHeader 
                    title={<Box display="flex" alignItems="center" flexWrap="wrap">
                        <Typography>
                            <Translate contentKey="reset.finish.title">Reset password</Translate>
                        </Typography>
                    </Box>}
                    className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Box>
                      {key ? getResetForm() : null}
                  </Box>
                </CardContent>
            </Card>
      </Box>
    </React.Fragment>
  );
};

const mapStateToProps = ({ passwordReset }: IRootState) =>({
  restPasswordSuccess: passwordReset.resetPasswordSuccess,
})

const mapDispatchToProps = { handlePasswordResetFinish, reset };

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomPasswordResetFinishPage);
