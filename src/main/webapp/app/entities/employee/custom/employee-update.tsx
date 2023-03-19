import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';

import { IEmployee, defaultValue as DefaultEmployee } from 'app/shared/model/employee.model';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { Avatar, Box, Card, CardContent, CardHeader, Checkbox, FormControl,
        FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment,
        InputLabel, makeStyles, MenuItem, OutlinedInput, Select, TextField, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { AUTHORITIES, EMAIL_REGEX_PATTERN, PHONE_REGEX_PATTERN } from 'app/config/constants';
import { IUser } from 'app/shared/model/user.model';
import { Add, Visibility, VisibilityOff } from '@material-ui/icons';
import { getAllEntities as getDepartments } from 'app/entities/department/department.reducer';
import 'date-fns';
import CameraIcon from '@material-ui/icons/Camera';
import { API_URIS, convertArrayBufferToByTeArray, deleteUserExtraPhoto, getMshzFileUri } from 'app/shared/util/helpers';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import axios from 'axios'
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { getAllEntities as getFonctions } from 'app/entities/fonction/fonction.reducer';
import { IFonction } from 'app/shared/model/fonction.model';
import FonctionUpdate from 'app/entities/fonction/custom/fonction-update';
import CustomAvatar from 'app/shared/component/custom-avatar';
import EmployeeFinder from './employee-finder';
import { toast } from 'react-toastify';
import { SaveButton } from 'app/shared/component/custom-button';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const useStyles = makeStyles(theme =>({
    card:{
      border: '1px solid '+ theme.palette.primary.main,
      boxShadow: '0 0 7px '+theme.palette.grey[900],
    },
    cardHeader:{
      height:50,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
    },
    button: {
      marginTop: theme.spacing(2),
    },
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      width: '25ch',
    },
    avatar:{
        width: theme.spacing(14),
        height: theme.spacing(14),
    },
}));

export interface IField extends IEmployee, IUser{
  id?: any,
}


export function FormRow({name, md, value, onChange, type='text', error=false, helpText= '', children}){
  return <Grid item xs={12} md={md}>
        <FormControl fullWidth error={error}>
          <TextField type={type} name={name} error={error}
            label={children} value={value} variant="outlined" size='small'
            onChange={onChange} InputLabelProps={{ shrink: true }}/>
          <FormHelperText id={name}>{helpText}</FormHelperText>
        </FormControl>
      </Grid>;
}

export function FormRowSelect({dataOptions,name, value=null, onChange, md, error=false,
  withNullOption=true,nullOptionLabel='...', nulOptionValue=0, helpText='', children}){
  return(
    <Grid item xs={12} md={md}>
      <FormControl fullWidth size='small' error={error}>
      <InputLabel htmlFor={children}>{children}</InputLabel>
      <Select name={name}  value={value ? value: nulOptionValue} id={children} error={error} variant='outlined' onChange={onChange}>
          {withNullOption && <MenuItem value={nulOptionValue}>{nullOptionLabel}</MenuItem>}
          { dataOptions.map((data, key) => (
            <MenuItem key={key} value={data.value ? data.value : ''}>{data.option}</MenuItem>
          ))}
      </Select>
      <FormHelperText id={name}>{helpText}</FormHelperText>
      </FormControl>
    </Grid>
  );
}

export function FormRowPassword({name,value, onChange,md,error=false, helpText= '', children}){
  const [showPassword, setShowPassword] = useState(false);
  return <Grid item xs={12} md={md}>
        <FormControl fullWidth size="small" variant="outlined" error={error}>
        <InputLabel htmlFor={name}>{children}</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          id={name}
          name={name}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }/>
          <FormHelperText id={name}>{helpText}</FormHelperText>
        </FormControl>
      </Grid>;
}

export interface IEmployeeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EmployeeUpdate = (props: IEmployeeUpdateProps) => {
  const { departments, fonctions } = props;
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const [withAccount, setWithAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeState, setEmployeState] = useState<IEmployee>({});
  const [errors, setErrors] = useState<IField>({});
  const [userState, setUserState] = useState<IUser>({});

  const [openFonctionEditor, setOpenFonctionEditor] = useState(false);
  const [photo, setPhoto] = useState<IMshzFile>(null);

  const [openEmpSelector, setOpenEmpSelector] = useState(false);

  const [manager, setManager] = useState<IEmployee>(null);

  // using to preview employee photo
  const [imageUri, setImageUri] = useState(null)

  const history = useHistory();

  const classes = useStyles();
  const photoInput = useRef(null);

  const DefaultPassword = "User@user12345";
  
  const getEmploye = (id, isManager: boolean) =>{
    if(id){
      axios.get<IEmployee>(`${API_URIS.employeeApiUri}/${id}`)
        .then(res => {
          if(!isManager)
            setEmployeState(res.data)
          else
            setManager(res.data);

          if(!isManager && res.data && res.data.managerId)
              getEmploye(res.data.managerId, true);
        })
        .catch(e => console.log(e))
    }
  }

  const displayResultMessage = (success: boolean,message: string) => {
      if(isNew && success){
        setEmployeState({...DefaultEmployee});
        setManager(null);
      }

      if(message){
        if(success)
          toast.success(message);
        else
          toast.error(message);
      }
  };


  const saveEmployeeAccount = (employe: IEmployee) =>{
    if(withAccount && employe && employe.id){
      setLoading(false);
      const user: IUser = {
        ...userState,
        password: DefaultPassword,
        activated:true,
        authorities: [AUTHORITIES.USER, AUTHORITIES.EMPLOYEE],
        email: employe.email,
        firstName: employe.firstName,
        lastName: employe.lastName,
        langKey: props.currentLocale,
        createdDate: new Date,
      }
      // creating user 
      axios.post<IUser>(`${API_URIS.userApiUri}`, cleanEntity(user)).then(response =>{
        if(response.data){
          const userExtra: IUserExtra = {
            id: response.data.id,
            user: {...response.data},
            employee: {...employe}
          }
          axios.put(`${API_URIS.userExtraApiUri}`, cleanEntity(userExtra))
            .then(() =>{})
            .catch(e =>console.log(e))
            .finally(() =>{
              setLoading(false);
              displayResultMessage(true, `${translate("_global.flash.message.success")}`);
            })
        }
      }).catch(error =>{
        /* eslint-disable no-console */
        console.log(error)
        setLoading(false);
        displayResultMessage(true, `${translate("_global.flash.message.success")}`);
      })
    }else{
      displayResultMessage(true, `${translate("_global.flash.message.success")}`);
    }
  }

 const saveEmploye = (employee: IEmployee) =>{
      if(!employee.hireDate)
        employee.hireDate = new Date().toISOString();
      setLoading(true)
      const req = isNew ? axios.post<IEmployee>(`${API_URIS.employeeApiUri}`, cleanEntity(employee))
                    : axios.put<IEmployee>(`${API_URIS.employeeApiUri}`, cleanEntity(employee));
      req.then(res =>{
         if(res.data){
            if(withAccount)
              saveEmployeeAccount(res.data);
            else
              displayResultMessage(true, `${translate("_global.flash.message.success")}`);
          }
      }).catch(e => {
        console.log(e)
        displayResultMessage(false, `${translate("_global.flash.message.failed")}`);
      })
      .finally(() => setLoading(false))
  }
  const savePhoto =  (employee: IEmployee) =>{
    if(employee){
      if(photo && !photo.id && photo.fData && photo.fDataContentType 
          && photo.name && serviceIsOnline(SetupService.FILEMANAGER)){
        console.log("photo saving")
        axios.post<IMshzFile>(`${API_URIS.mshzFileApiUri}`, cleanEntity(photo))
          .then(res =>{
            if(res.data){
              employee.photoId = res.data.id;
              employee.photoName = res.data.name;
            }
            saveEmploye(employee);
          }).catch(() =>{
            saveEmploye(employee)
          })
      }else{
        saveEmploye(employee)
      }
    }
  }


  const FormIsValid = () : boolean =>{
    // setErrors({});
    let cptError = 0;
    const _errors : IField = {};
    if(!employeState.firstName || employeState.firstName.length <= 0){
      _errors.firstName = "Le prenom est Obligatoire";
      cptError++;
    }
     if(!employeState.lastName || employeState.lastName.length <= 0){
      _errors.lastName="Le nom est obligatoire !";
      cptError++;
    }
    if(!employeState.email || employeState.email.length <=0){
      _errors.email="L'email est obligatoire !";
      cptError++;
    }
    if(employeState.email && employeState.email.length >0 && !(new RegExp(EMAIL_REGEX_PATTERN).test(employeState.email))){
      _errors.email="L'email n'est pas valid !";
      cptError++;
    }
    if(employeState.phoneNumber && employeState.phoneNumber.length>0  && !(new RegExp(PHONE_REGEX_PATTERN).test(employeState.phoneNumber))){
      _errors.phoneNumber= "Le numéro de téléphone n'est pas valid !";
      cptError++;
    } 
    if(withAccount && !userState.login ){
      _errors.login = "Le nom d'utilisateur est obligaoite";
      cptError++;
    }
    /* if(withAccount && !userState.password){
      _errors.password = "Le mot de passe est obligaoite";
      cptError++;
    } */
    setErrors(_errors);
    return cptError <=0;
  }

  useEffect(() => {
    if (!isNew)
      getEmploye(props.match.params.id, false);
    props.getDepartments();
    props.getFonctions();
  }, []);

  const handleChange = (e) =>{
    const name = e.target.name;
    const value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
     setErrors({...errors, [name]:null});
    if(name === 'department')
      setEmployeState({...employeState, [name]: value===0 ? null : departments.find(dept => dept.id===value)});
    else if(name === "fonction")
      setEmployeState({...employeState, [name]: props.fonctions.find(fc => fc.id.toString() === value)});
    else if(name === 'login' || name === 'password')
      setUserState({...userState, [name]: value});
    else
      setEmployeState({...employeState, [name]: value});
  }

  const saveEntity = (e) =>{
    e.preventDefault();
    if(FormIsValid()){
        savePhoto(employeState);
    }else{
      console.log("form is not valid")
    }
  };

  const handleChoosePhoto = () =>{
    if(photoInput && photoInput.current){
      photoInput.current.click()
    }
  }

  const handlePhotoChange = (e) =>{
    const file: File = e.target.files[0]
    if(file){
      file.arrayBuffer().then(arrayBuffer =>{
        const byteArray =  convertArrayBufferToByTeArray(arrayBuffer)
          const mshzFile: IMshzFile = {
            name: file.name,
            fData: byteArray,
            fDataContentType: file.type
          }
          setPhoto(mshzFile);
        setImageUri(getMshzFileUri(mshzFile))
      }).catch(eFile => {
        /* eslint-disable no-console */
        console.log(eFile)
      })
    }

  }

  const onSavedFonction = (fonction: IFonction, isNewOp?: boolean) =>{
    if(fonction){
      setEmployeState({...employeState, fonction})
      setOpenFonctionEditor(false);
    }
  }

  const onCloseFonctionEditor = () => setOpenFonctionEditor(false);

  const handleOpenFonctionEditor = () =>{
    setOpenFonctionEditor(true);
  }

  const handleManagerChange = (newManager: IEmployee, select?: boolean) =>{
      if(select){
        setEmployeState({...employeState, managerId: newManager ? newManager.id : null});
        setManager(newManager);
        if(newManager)
          setOpenEmpSelector(false);
      }else{
        setEmployeState({...employeState, managerId: null});
        setManager(null);
      }
  }

  return (
    <React.Fragment>
      <EmployeeFinder 
          open={openEmpSelector}
          departmentId={employeState.department ? employeState.department.id : null}
          unSelectableIds={(employeState && employeState.id) ? [employeState.id] : []}
          onSelectChange={handleManagerChange}
          onClose={() => setOpenEmpSelector(false)}
      />
      <div>
        <FonctionUpdate fonction={{}} open={openFonctionEditor}
          onClose={onCloseFonctionEditor} onSaved={onSavedFonction}/>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Box boxShadow="-1px -1px 7px" mt={2}>
                <Card>
                  <CardHeader
                    title={
                      <Box>
                        <IconButton aria-label="add" color="inherit"
                        onClick={() =>{ history.push('/employee')}} edge='start'>
                          <ArrowBackIcon style={{ fontSize: 30}}/>
                        </IconButton>
                        <Typography variant='h4' style={{ display:'inline-block', marginLeft:10,}} >
                          <Translate contentKey="microgatewayApp.micropeopleEmployee.home.createOrEditLabel">Create or edit a Employee</Translate>
                        </Typography>
                      </Box>
                    }
                  classes={{ root: classes.cardHeader }}/>
                  <CardContent>
                      <form onSubmit={saveEntity}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Grid container spacing={2}>
                                <FormRow name="firstName" type="text" md={12} value={employeState.firstName}
                                  helpText={errors.firstName ? errors.firstName : null} 
                                  onChange={handleChange} error={errors.firstName ? true : false}>
                                    <Translate contentKey="microgatewayApp.micropeopleEmployee.firstName">First Name</Translate>
                                </FormRow>
                                <FormRow name="lastName" type="text" md={12} value={employeState.lastName} 
                                    helpText={errors.lastName ? errors.lastName : null} onChange={handleChange}
                                    error={errors.lastName ? true: false}>
                                    <Translate contentKey="microgatewayApp.employee.lastName">Last Name</Translate>
                                </FormRow>
                                <FormRow name="email"  type="email" md={12} value={employeState.email}
                                  helpText={errors.email ? errors.email : null} onChange={handleChange}
                                  error={errors.email ? true: false}>
                                    <Translate contentKey="microgatewayApp.employee.email">Email</Translate>
                                </FormRow>
                                <FormRow name="phoneNumber" type="text" md={12} value={employeState.phoneNumber}
                                  helpText={errors.phoneNumber ? errors.phoneNumber : null} onChange={handleChange}
                                  error={errors.phoneNumber ? true : false}>
                                    <Translate contentKey="microgatewayApp.employee.phoneNumber">PhoneNumber</Translate>
                                </FormRow>
                                <FormRow name="hireDate" type="date" md={12}  helpText={null} onChange={handleChange}
                                    value={employeState.hireDate ? convertDateFromServer(employeState.hireDate) : convertDateFromServer(new Date())}>
                                    <Translate contentKey="microgatewayApp.employee.hireDate">Hire Date</Translate>
                                </FormRow>
                                  <Grid item xs={12}>
                                      <TextField name="fonction" value={employeState.fonction ? employeState.fonction.id : null}
                                      label={<Translate contentKey="microgatewayApp.fonction.detail.title">Fonction</Translate>}
                                      select 
                                      onChange={handleChange}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start" style={{marginLeft: '-15px'}}>
                                          <IconButton size="small" color="primary" onClick={handleOpenFonctionEditor}><Add /></IconButton>
                                          </InputAdornment>
                                      }}
                                      SelectProps={{
                                        native: true,
                                      }}
                                      fullWidth variant="outlined" size="small">
                                          <option>...</option>
                                          {[...fonctions].sort(() => -1).map(fc =><option key={fc.id} value={fc.id}>{fc.name}</option>)}
                                      </TextField>
                                  </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Grid container spacing={2}>
                                  {/* <FormRow name="salary" type="number" md={12} value={employeState.salary}
                                    helpText={null} onChange={handleChange}>
                                      <Translate contentKey="microgatewayApp.micropeopleEmployee.salary">Salary</Translate>
                                  </FormRow> */}
                                  <FormRowSelect name="department" md={12} value={employeState.department ? employeState.department.id : 0}
                                    dataOptions={departments.map(dept => JSON.parse('{"value":'+dept.id+', "option":"'+dept.name+'"}'))} 
                                      onChange={handleChange} nullOptionLabel="......">
                                      <Translate contentKey="microgatewayApp.micropeopleEmployee.department">Department</Translate>
                                  </FormRowSelect>
                                  <Grid item xs={12}>
                                      <TextField fullWidth size='small' variant='outlined'
                                        label={translate("microgatewayApp.micropeopleEmployee.managerId")} 
                                        value={manager ? `${manager.lastName} ${manager.firstName}` : '....'}
                                        onClick={() => setOpenEmpSelector(true)}
                                        InputLabelProps={{
                                          shrink: true,
                                        }} />
                                  </Grid>
                                  {/* photo content section ***/}
                                  <Grid item xs={12}>
                                      <input type="file" hidden accept="image/*" ref={photoInput} onChange={(e) =>handlePhotoChange(e)}/>
                                        <FormControl fullWidth size="small" variant="outlined">
                                        <InputLabel shrink>{translate("microgatewayApp.micropeopleEmployee.photo")}</InputLabel>
                                          <OutlinedInput
                                              type='text'
                                              value={employeState.photoName}
                                              endAdornment={
                                                  <InputAdornment position="end">
                                                    <IconButton aria-label="photo" 
                                                            color="primary"
                                                            edge="end"
                                                            onClick={handleChoosePhoto}>
                                                            <CameraIcon/>
                                                        </IconButton>
                                                  </InputAdornment>
                                          }/>
                                        </FormControl>
                                  </Grid>
                                  <Grid xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
                                      {!imageUri ?
                                        <CustomAvatar
                                            photoId={employeState ? employeState.photoId : null}
                                            onDelete={() => deleteUserExtraPhoto({employee: employeState})}
                                            avatarProps={{ className: classes.avatar}}
                                            loadingSize={100}
                                      /> 
                                      :
                                        <Avatar className={classes.avatar}>
                                          <img alt="" src={imageUri} width="100%" height="100%"/>
                                        </Avatar>
                                      }
                                  </Grid>
                                  {/* end photo content section ***/}
                              </Grid>
                            </Grid>
                          </Grid>
                          {(isNew) && 
                          <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <FormControlLabel value="end" labelPlacement="end"
                                  label={<Translate contentKey="global.withAccount">With account</Translate>}
                                    control={<Checkbox color="primary" value={withAccount} 
                                    onChange={(e) => {setWithAccount(e.target.checked)}}/>}
                                  />
                                </Grid>
                                {withAccount && <FormRow name="login" type="text" md={6} 
                                  value={null} error={errors.login ? true: false}
                                  helpText={errors.login ? errors.login : null} onChange={handleChange}>
                                  <Translate contentKey="global.form.username.label">username</Translate>
                                  </FormRow> }
                              {/* withAccount && <FormRowPassword name="password" md={6}
                                  value={null} error={errors.password ? true: false}
                                  helpText={errors.password ? errors.password : null} onChange={handleChange}>
                                  <Translate contentKey="global.menu.account.password">password</Translate>
                          </FormRowPassword> */}
                          </Grid>
                          }
                          <Grid container alignItems='flex-end' direction='column'>
                            <Grid item xs={12}>
                              <SaveButton type='submit' className={classes.button + ' text-capitalize'} />
                            </Grid>
                          </Grid>
                      </form>
                  </CardContent>
                </Card>
                </Box>
            )}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  departments: storeState.department.entities,
  currentLocale: storeState.locale.currentLocale,
  fonctions: storeState.fonction.entities,
});

const mapDispatchToProps = {
  getDepartments,
  getFonctions,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeUpdate);
