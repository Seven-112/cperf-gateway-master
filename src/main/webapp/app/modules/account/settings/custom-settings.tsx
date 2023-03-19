import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { AvForm, AvField } from 'availity-reactstrap-validation';

import { locales, languages } from 'app/config/translation';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { saveAccountSettings, reset } from './settings.reducer';
import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios'
import { getEntity as getUserExtra } from 'app/entities/user-extra/user-extra.reducer'
import { API_URIS } from 'app/shared/util/helpers';
import { SaveButton } from 'app/shared/component/custom-button';
import theme from 'app/theme';
import CustomAvatar from 'app/shared/component/custom-avatar';
import { Edit, Photo } from '@material-ui/icons';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import { FileUploaderButton } from 'app/shared/component/file-uploder-button';
import { IEmployee } from 'app/shared/model/employee.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const useStyles = makeStyles({
   box:{
      width: '60%',
      [theme.breakpoints.down('sm')]:{
        width: '95%',
      },
   },
   card:{
     backgroundColor:'transparent',
     paddingBottom:theme.spacing(5),
   },
   cardHeader:{
     background: `white`,
     borderBottom: `3px solid ${theme.palette.primary.main}`,
   },
   formGridColum:{
     borderLeft: `3px solid ${theme.palette.primary.main}`,
     [theme.breakpoints.down('sm')]:{
      borderLeft: `none`,
     },
   },
   avatar:{
      width: theme.spacing(20),
      height: theme.spacing(20),
   }
})

export interface IUserSettingsProps extends StateProps, DispatchProps {}

export const CustomSettingsPage = (props: IUserSettingsProps) => {

  const classes = useStyles();

  const [photo, setPhoto] = useState<IMshzFile>(null);
  const [newPhoto, setNewPhoto] = useState<IMshzFile>(null);

  const [loadingPhtoto, setLoadingPhoto] = useState(false);

  const [loading, setLoading] = useState(false);


  const getPhoto = () =>{
    const photoId = props.uExtra ? props.uExtra.employee
                        ? props.uExtra.employee.photoId || props.uExtra.photoId 
                        : props.uExtra.photoId 
                    : null;
    if(photoId && serviceIsOnline(SetupService.FILEMANAGER)){
      setLoadingPhoto(true)
      axios.get<IMshzFile>(`${API_URIS.mshzFileApiUri}/${photoId}`)
          .then(res => setPhoto(res.data)).catch(e => console.log(e))
          .finally(() => setLoadingPhoto(false))
    }
  }

  useEffect(() => {
    if(!props.account)
      props.getSession();
    return () => {
      props.reset();
    };
  }, []);

  useEffect(() =>{
      if(props.account && props.account.id)
         props.getUserExtra(props.account.id);
  }, [props.account])

  useEffect(() =>{
      getPhoto();
  }, [props.uExtra])


  const attachPhotoToUserExtra = (photoId) =>{
     if(props.uExtra && photoId){
      const entity: IUserExtra = {
        ...props.uExtra,
        photoId
      }
       return axios.put<IUserExtra>(`${API_URIS.userExtraApiUri}`, entity)
                  .then(() => console.log("uextra photo update ok"))
                  .catch(e => console.log("uextra photo update error ", e))
     }
     return Promise.resolve();
  }

  const attachePhotoToEmployee = (photoId) =>{
     if(props.uExtra && photoId && props.uExtra.employee){
          const entity: IEmployee = {
              ...props.uExtra.employee,
              photoId
          }
        return axios.put<IEmployee>(`${API_URIS.employeeApiUri}`, entity)
                  .then(() => console.log("emp photo update ok "))
                  .catch(e => console.log("emp photo update error ", e))
     }
     return Promise.resolve();
     
  }

  const removePhoto = (id) =>{
    if(id && serviceIsOnline(SetupService.FILEMANAGER)){
      return axios.delete(`${API_URIS.mshzFileApiUri}/${id}`)
          .then(() => console.log("deleting last file ok"))
          .catch(() => console.log("deleting last file error"))
    }
    return Promise.resolve();
  }

  const saveNewPhoto = () =>{
    if(newPhoto && serviceIsOnline(SetupService.FILEMANAGER)){
      return axios.post<IMshzFile>(`${API_URIS.mshzFileApiUri}`, newPhoto)
        .then((res) => {
          return res.data;
        })
        .then(f =>{
            const promises = [];
            if(f && f.id){
              const ueLastPhoroId = props.uExtra ? props.uExtra.photoId : null;
              const empLastPhotoId = props.uExtra && props.uExtra.employee ? props.uExtra.employee.photoId : null;
              if(ueLastPhoroId)
                promises.push(removePhoto(ueLastPhoroId));
              if(empLastPhotoId && empLastPhotoId !== ueLastPhoroId)
                promises.push(removePhoto(empLastPhotoId));
              promises.push(attachePhotoToEmployee(f.id))
              promises.push(attachPhotoToUserExtra(f.id))
            }
            return Promise.all(promises)
              .finally(() =>{
                if(f){
                  setPhoto(f);
                  setNewPhoto(null);
                }
            })
        }).catch(e => console.log(e))
    }else{
      return Promise.resolve();
    }
  }

  const handleValidSubmit = (event, values) => {
    const account = {
      ...props.account,
      ...values,
    };
    setLoading(true);
    saveNewPhoto()
     .finally(() =>{
      props.saveAccountSettings(account);
      event.persist();
      setLoading(false);
    })
  };

  const handleUploadPhoto = (uploaded?: IMshzFile) => {
    setNewPhoto(uploaded);
  }

  const formData =  props.account;

  return (
    <Box width={1} minHeight={"70vh"} display="flex"
     justifyContent={"center"} alignItems="center" 
     justifyItems={"center"} overflow={"auto"} flexWrap="wrap">
      <Box boxShadow={2} className={classes.box}>
        <Card classes={{root: classes.card}}>
          <CardHeader
            title={<Box width={1} display="flex" justifyContent={"center"} 
              flexDirection="column" alignItems="center" textAlign="center">
                <Typography variant='h4' color='primary'>
                  {translate("settings.title",{username: props.account.firstName+ ' '+props.account.lastName })}
                </Typography>
                {(loading || props.savingAccount) && 
                <Typography color='secondary' className='mt-2'>
                  loading...
                </Typography>
                }
            </Box>} 
            className={classes.cardHeader}/>
              <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box width={1} display="flex" justifyContent={"center"}>
                            {loadingPhtoto ? (
                              <CircularProgress color='primary' 
                                style={{ 
                                  height:60, 
                                  width:60,
                                  marginTop: 7, 
                                }} />
                            ): (
                              <CustomAvatar 
                                  alt=''
                                  photo={newPhoto || photo}
                                  avatarProps={{
                                    className: classes.avatar,
                                  }}
                                  loadingSize={100}
                              />
                            )}
                           </Box>
                           {!loadingPhtoto && 
                            <Box width={1} display="flex" justifyContent={"center"}>
                               <FileUploaderButton 
                                  canClear shwoUploadedFileName
                                  tooltip={translate("entity.action.edit")} 
                                  clearTootip={translate("entity.action.edit")} 
                                  onUploaded={handleUploadPhoto}
                                />
                            </Box>
                          }
                    </Grid>
                    <Grid item xs={12} md={8} className={classes.formGridColum}>
                      <Box width={1}>
                        <AvForm id="settings-form" onValidSubmit={handleValidSubmit}>
                          {/* First name */}
                          <AvField
                            className="form-control"
                            name="firstName"
                            label={translate('settings.form.firstname')}
                            id="firstName"
                            placeholder={translate('settings.form.firstname.placeholder')}
                            validate={{
                              required: { value: true, errorMessage: translate('settings.messages.validate.firstname.required') },
                              minLength: { value: 1, errorMessage: translate('settings.messages.validate.firstname.minlength') },
                              maxLength: { value: 50, errorMessage: translate('settings.messages.validate.firstname.maxlength') },
                            }}
                            value={formData.firstName}
                          />
                          {/* Last name */}
                          <AvField
                            className="form-control"
                            name="lastName"
                            label={translate('settings.form.lastname')}
                            id="lastName"
                            placeholder={translate('settings.form.lastname.placeholder')}
                            validate={{
                              required: { value: true, errorMessage: translate('settings.messages.validate.lastname.required') },
                              minLength: { value: 1, errorMessage: translate('settings.messages.validate.lastname.minlength') },
                              maxLength: { value: 50, errorMessage: translate('settings.messages.validate.lastname.maxlength') },
                            }}
                            value={formData.lastName}
                          />
                          {/* Email */}
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
                            value={formData.email}
                          />
                          {/* Language key */}
                          <AvField
                            type="select"
                            id="langKey"
                            name="langKey"
                            className="form-control"
                            label={translate('settings.form.language')}
                            value={props.account.langKey}
                          >
                            {locales.map(locale => (
                              <option value={locale} key={locale}>
                                {languages[locale].name}
                              </option>
                            ))}
                          </AvField>
                          <SaveButton color="primary" type="submit" style={ { float:'right'}} />
                        </AvForm>
                      </Box>
                    </Grid>
                </Grid>
              </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ authentication, userExtra }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated,
  uExtra: userExtra.entity,
  loadingUserExtra: userExtra.loading,
  savingAccount: authentication.loading,
});

const mapDispatchToProps = { 
  getSession,
  saveAccountSettings,
  reset, 
  getUserExtra 
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomSettingsPage);
