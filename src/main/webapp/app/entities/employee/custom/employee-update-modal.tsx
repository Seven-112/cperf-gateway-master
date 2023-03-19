import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, LinearProgress, makeStyles, TextField } from "@material-ui/core";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { IEmployee } from "app/shared/model/employee.model";
import { IFonction } from "app/shared/model/fonction.model";
import { IUser } from "app/shared/model/user.model";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { FormRow, FormRowPassword, FormRowSelect, IField } from "./employee-update";
import axios from 'axios';
import { API_URIS, convertArrayBufferToByTeArray, DEFAULT_USER_AVATAR_URI, deleteUserExtraPhoto, formateBase64Src, getMshzFileUri } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { AUTHORITIES, EMAIL_REGEX_PATTERN, PHONE_REGEX_PATTERN } from "app/config/constants";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { Translate, translate } from "react-jhipster";
import FonctionUpdate from "app/entities/fonction/custom/fonction-update";
import { convertDateFromServer } from "app/shared/util/date-utils";
import { Add, Camera, Save } from "@material-ui/icons";
import { IDepartment } from "app/shared/model/department.model";
import CustomAvatar from "app/shared/component/custom-avatar";
import { SaveButton } from "app/shared/component/custom-button";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles(theme =>({
    modal:{
        width: `35%`,
        [theme.breakpoints.down['sm']] : {
            width: `85%`,
        }
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
}))

interface EmployeeUpdateModalProps extends StateProps, DispatchProps{
    employee: IEmployee,
    open?: boolean,
    onClose: Function,
    onSave?: Function,
}

export const EmployeeUpdateModal = (props: EmployeeUpdateModalProps) =>{
    
    const { open } = props;

    const [isNew, setIsNew] = useState(!props.employee || !props.employee.id);
    const [withAccount, setWithAccount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [manager, setManager] = useState<IEmployee>(null);
  
    const [employeState, setEmployeState] = useState<IEmployee>(props.employee || {});
    const [errors, setErrors] = useState<IField>({});
    const [userState, setUserState] = useState<IUser>({});
    const [fonctions, setFonctions] = useState<IFonction[]>([]);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
  
    const [openFonctionEditor, setOpenFonctionEditor] = useState(false);
  
    // using to preview employee photo
    const [imageUri, setImageUri] = useState(null)

    const [photo, setPhoto] = useState<IMshzFile>(null);
  
    const classes = useStyles();
    const photoInput = useRef(null)

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

    const getFonctions = () =>{
        setLoading(true)
        axios.get<IFonction[]>(`${API_URIS.fonctionApiUri}`)
            .then(res => setFonctions(res.data))
            .catch((e) => console.log(e))
            .finally(() => setLoading(false))
    }
    
    const getDepartments = () =>{
      setLoading(true)
      axios.get<IDepartment[]>(`${API_URIS.depatartmentApiUri}`)
          .then(res => setDepartments(res.data))
          .catch((e) => console.log(e))
          .finally(() => setLoading(false))
    }
  
    const saveEmployeeAccount = (savedEmp: IEmployee) =>{
      if(withAccount && savedEmp && savedEmp.id){
        const user: IUser = {
          ...userState,
          activated:true,
          authorities: [AUTHORITIES.USER, AUTHORITIES.EMPLOYEE],
          email: savedEmp.email,
          firstName: savedEmp.firstName,
          lastName: savedEmp.lastName,
          langKey: props.currentLocale,
          createdDate: new Date,
        }
        setLoading(true)
        // creating user 
        axios.post<IUser>(`${API_URIS.userApiUri}`, cleanEntity(user)).then(response =>{
          if(response.data){
            const userExtra: IUserExtra = {
              id: response.data.id,
              user: response.data,
              employee: savedEmp
            }
            axios.put(`${API_URIS.userExtraApiUri}`, cleanEntity(userExtra))
            .then(() =>{}).
             catch(e =>{
              /* eslint-disable no-console */
              console.log(e);
            }).finally(() =>{
                 setLoading(false)
                 if(props.onSave)
                   props.onSave(savedEmp, isNew);
            })
          }
        }).catch(error =>{
          /* eslint-disable no-console */
          console.log(error)
          if(props.onSave)
            props.onSave(savedEmp, isNew);
        }).finally(() =>{
            setLoading(false)
        })
      }
    }
  
   const saveEmploye = (employee: IEmployee) =>{
        if(!employee.hireDate)
          employee.hireDate = new Date().toISOString();
        setLoading(true);
        const request = isNew ? axios.post<IEmployee>(`${API_URIS.employeeApiUri}`, cleanEntity(employee))
                            : axios.put<IEmployee>(`${API_URIS.employeeApiUri}`, cleanEntity(employee));
        request.then(res =>{
            if(res.data){
                if(withAccount && isNew){
                    saveEmployeeAccount(res.data);
                }else{
                    if(props.onSave)
                        props.onSave(res.data, isNew);
                }
            }
        }).catch(e => console.log(e))
        .finally(() => setLoading(false))
    }

    const savePhoto =  (employee: IEmployee) =>{
      if(employee && serviceIsOnline(SetupService.FILEMANAGER)){
        if(photo && !photo.id && photo.fData && photo.fDataContentType && photo.name){
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
      if(withAccount && !userState.password){
        _errors.password = "Le mot de passe est obligaoite";
        cptError++;
      }
      setErrors(_errors);
      return cptError <=0;
    }
  
    useEffect(() => {
      getFonctions();
      getDepartments();
    }, []);
  
  
    useEffect(() =>{
      setEmployeState(props.employee || {});
      setIsNew(!props.employee || !props.employee.id)
      getManager();
    }, [props.employee]);
  
    const handleChange = (e) =>{
      const name = e.target.name;
      const value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
       setErrors({...errors, [name]:null});
      if(name === 'department')
        setEmployeState({...employeState, [name]: value===0 ? null : departments.find(dept => dept.id===value)});
      else if(name === 'manager')
        setEmployeState({...employeState, managerId:  manager ? manager.id : null});
      else if(name === "fonction")
        setEmployeState({...employeState, [name]: [...fonctions].find(fc => fc.id.toString() === value)});
      else if(name === 'login' || name === 'password')
        setUserState({...userState, [name]: value});
      else
        setEmployeState({...employeState, [name]: value});
    }
  
    const saveEntity = (e) =>{
      e.preventDefault();
      if(FormIsValid()){
          savePhoto(employeState);
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
          setPhoto(mshzFile)
          setImageUri(getMshzFileUri(mshzFile))
        }).catch(eFile => {
          /* eslint-disable no-console */
          console.log(eFile)
        })
      }
  
    }
  
    const onSavedFonction = (fonction: IFonction, isNewOp: boolean) =>{
      if(fonction){
        setEmployeState({...employeState, fonction})
        setFonctions([fonction, ...fonctions])
        setOpenFonctionEditor(false);
      }
    }
  
    const onCloseFonctionEditor = () => setOpenFonctionEditor(false);
  
    const handleOpenFonctionEditor = () =>{
      setOpenFonctionEditor(true);
    }
    const handleClose = () => {
        setEmployeState({});
        props.onClose()
    };
    return (
        <React.Fragment>
            <FonctionUpdate fonction={{}} open={openFonctionEditor}
                onClose={onCloseFonctionEditor} onSaved={onSavedFonction}/>
            <MyCustomModal open={open} onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faUserTie} />}
                rootCardClassName={classes.modal}
                title={translate("microgatewayApp.micropeopleEmployee.home.createOrEditLabel")}>
                    <Box>
                        <form onSubmit={saveEntity}>
                            <Grid container spacing={2}>
                                {/* photo content section ***/}
                                <Grid item xs={12}>
                                    <input type="file" hidden accept="image/*" ref={photoInput} onChange={(e) =>handlePhotoChange(e)}/>
                                    <Box display={"flex"} justifyContent={"center"}>
                                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
                                            {!imageUri ? 
                                            <CustomAvatar
                                              alt="" loadingSize={100}
                                              photoId={employeState ? employeState.photoId : null}
                                              onDelete={() => deleteUserExtraPhoto({employee: employeState})}
                                              avatarProps={{
                                                className: classes.avatar
                                              }}
                                             />
                                            :
                                            <Avatar className={classes.avatar}>
                                                <img alt="" src={imageUri ? imageUri : DEFAULT_USER_AVATAR_URI} width="100%" height="100%"/>
                                            </Avatar>
                                            }
                                            <IconButton aria-label="photo" 
                                                color="primary"
                                                edge="end"
                                                onClick={handleChoosePhoto}>
                                                <Camera/>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Grid>
                                {/* end photo content section ***/}
                                {loading && 
                                <Grid item xs={12}>
                                    <Box width={1}>
                                        <LinearProgress variant="indeterminate" color="primary"/>
                                    </Box>
                                </Grid>}
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
                                        InputLabelProps={{ shrink: true }}
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
                                <FormRowSelect name="department" md={12} value={employeState.department ? employeState.department.id : 0}
                                    dataOptions={departments.map(dept => JSON.parse('{"value":'+dept.id+', "option":"'+dept.name+'"}'))} 
                                    onChange={handleChange} nullOptionLabel="......">
                                    <Translate contentKey="microgatewayApp.micropeopleEmployee.department">Department</Translate>
                                </FormRowSelect>
                                <Grid item xs={12} md={12}>
                                    <TextField variant="outlined" size="small" fullWidth
                                        label={<Translate contentKey="microgatewayApp.micropeopleEmployee.managerId">Manager</Translate>}
                                        value={manager ? `${manager.firstName} ${manager.lastName}` : '...'}
                                        InputLabelProps={{ shrink : true }}
                                    />
                                </Grid>
                            </Grid>
                            {isNew && 
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
                                    {withAccount && <FormRowPassword name="password" md={6}
                                    value={null} error={errors.password ? true: false}
                                    helpText={errors.password ? errors.password : null} onChange={handleChange}>
                                    <Translate contentKey="global.menu.account.password">password</Translate>
                                    </FormRowPassword>}
                            </Grid>
                            }
                            <Grid container alignItems='flex-end' direction='column'>
                                <Grid item xs={12}>
                                    <SaveButton type="submit" className={classes.button + ' text-capitalize'} />
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
  currentLocale: storeState.locale.currentLocale,
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeUpdateModal);