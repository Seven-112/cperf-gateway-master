import { Backdrop, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import { API_URIS } from "app/shared/util/helpers";
import { IField } from "app/shared/model/micropartener/field.model";
import PartenerFieldUpdate from "app/entities/micropartener/partener-field/custom/partener-field-update";
import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IUser } from "app/shared/model/user.model";
import { AUTHORITIES } from "app/config/constants";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    card:{
        width: '45%',
        marginTop: theme.spacing(15),
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '95%',
        },
    },
    catSelect:{
        height:theme.spacing(5.3),
    },
    formControl: {
      margin: theme.spacing(1),
    },
}));

interface PartenerUpdateProps extends StateProps{
    open?:boolean,
    partener?:IPartener,
    disableCategoryChange?:boolean 
    onSave: Function,
    onClose:Function,
}

export const PartenerUpdate = (props: PartenerUpdateProps) =>{
    const { open, account, currentLocal } = props;
    const [partener, setPartener] = useState(props.partener || {});
    const [isNew, setIsNew] = useState(!props.partener || !props.partener.id)
    const [saveSuccessed, setSaveSuccessed] = useState(false);
    const [savePending, setSavePending] = useState(false);

    const classes = useStyles();

    const [categories, setCategories] = useState<IPartenerCategory[]>([]);

    const [fields, setFields] = useState<IField[]>([]);
    const [pFields, setPFields] = useState<IPartenerField[]>([]);
    const [invalidFields, setInvalidFields] = useState<IField[]>([]);

    const [loading, setLoading] = useState(false);

    const getCategories = () =>{
            setLoading(true)
            axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}`)
                .then(res =>{
                    setCategories(res.data)
                }).catch(e => console.log(e)).finally(() => setLoading(false))
    }

    const getFileds = () =>{
        if(partener && partener.category){
            setLoading(true)
            axios.get<IField[]>(`${API_URIS.partenerFieldModelApiUri}/?categoryId.equals=${partener.category.id}`)
                .then(res =>{
                    setFields(res.data);
                }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getCategories();
    }, [])

    useEffect(() =>{
        setPartener(props.partener || {});
        setIsNew(!props.partener || !props.partener.id)
    }, [props.partener])

    useEffect(() =>{
        getFileds();
    }, [partener.category])

    const categoriesMenuItems = categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>);
    
    const handleClose = () => props.onClose();

    const handleChange = (e) =>{
        const {name, value} = e.target;
        if(name === "category"){
            if(props.disableCategoryChange)
                setPartener({...partener})
            else
                setPartener({...partener, [name]: categories.find(c => c.id === value)})
        }
        else{
            setPartener({...partener, [name]: value});
        }
    }

    const handleDynamicFieldChange = (dField?: IPartenerField, error?: boolean) =>{
        if(dField && dField.field){
            setSavePending(false)
            if(pFields.some(pf => pf.field && pf.field.id === dField.field.id))
                setPFields(pFields.map(pf => pf.field && pf.field.id === dField.field.id ? dField : pf));
            else
                setPFields([...pFields, dField]);
            if(error && ![...invalidFields].find(er => er.id === dField.id))
                setInvalidFields([...invalidFields, dField.field])
            else
                setInvalidFields([...invalidFields].filter(f => f.id !== dField.field.id));

        }
        
    }


    const enablePartenerAccount = (login: string, p: IPartener) =>{
        setLoading(true)
        console.log("account_enabling")
        axios.get<IUser>(`${API_URIS.userApiUri}/toogle-activated-by-login/${true}/${login}`)
            .then((res) =>{ 
            }).catch(e => console.log(e))
            .finally(() => {
                setLoading(true)
                if(props.onSave)
                    props.onSave(p, isNew);
            } );
    }
   
    const associateAccountToPartener = (p: IPartener, user: IUser) =>{
        if(p && p.id && user){
            setLoading(true)
            axios.put<IPartener>(`${API_URIS.partenerApiUri}/associateAccount/${p.id}/${user.id}`)
                .then((res) =>{
                    console.log("assoiated account partener")
                    console.log(res.data);
                    enablePartenerAccount(user.login, p);
                }).catch(e => console.log(e))
                .finally(() => {
                    setLoading(false);
                })
        }
    }

    const createAccount = (p: IPartener) =>{
        if(p){
          if(p.id && !p.userId){
                setLoading(true);
                const user: IUser = {
                    id: null,
                    activated:true,
                    authorities: [AUTHORITIES.USER,partener.category.role],
                    email: partener.email.trim(),
                    login: partener.email,
                    firstName: partener.name,
                    lastName: partener.category.name || '',
                    langKey: currentLocal,
                    createdDate: new Date(),
                    lastModifiedBy: `${account ? account.firstName ? account.firstName : account.lastName ? account.lastName : '' : ''}`,
                    lastModifiedDate: new Date(),
                }
                // creating user 
                axios.post<IUser>(`${API_URIS.userApiUri}`, cleanEntity(user))
                .then(res =>{
                    associateAccountToPartener(p, res.data); 
                }).catch(error =>{
                    console.log(error)
                    setLoading(false)
                })
            }else{
                props.onSave(p, isNew)
            }
        }else{
            props.onSave(partener, isNew);
        }
      }

    const handleSave = (event) =>{
        event.preventDefault();
        setSavePending(true)
        setSaveSuccessed(false);
        if(partener && partener.name && partener.email && (!invalidFields || invalidFields.length <=0)){
            setLoading(true);
            const request = isNew ? axios.post<IPartener>(`${API_URIS.partenerApiUri}`, cleanEntity(partener))
                                  : axios.put<IPartener>(`${API_URIS.partenerApiUri}`, cleanEntity(partener))
            request.then(res =>{
                if(res.data){
                    setPartener(res.data);
                    if(isNew)
                        createAccount(res.data);
                    if(pFields && pFields.length !== 0){
                        setSaveSuccessed(true);
                    }
                }
            }).catch(e => console.log(e))
            .finally(() => {
                setLoading(false);
                setSavePending(false);
            })
        }
    }

    const handleFieldSave = (saved?: IPartenerField, fieldIsNew?: boolean) =>{
        if(saved && props.onSave)
            props.onSave(partener, isNew)
    }

    
    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                rootCardClassName={classes.card}
                avatarIcon={<FontAwesomeIcon icon={faHandshake} />}
                title={translate("microgatewayApp.micropartenerPartener.home.createOrEditLabel")}
            >
                <form onSubmit={handleSave}>
                        <Grid container spacing={3} justify="center" alignItems="center">
                            {loading && <Grid item xs={12} className="text-center">
                                <Typography variant="h4" color="primary">Loading...</Typography>
                            </Grid>}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={(savePending && (!partener || !partener.name))}>
                                    <TextField 
                                        name="name"
                                        value={partener.name}
                                        variant="outlined"
                                        size="small"
                                        error={(savePending && (!partener || !partener.name))}
                                        label={translate("microgatewayApp.micropartenerPartener.name")}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {(savePending && (!partener || !partener.name)) && <FormHelperText>
                                        {translate("_global.form.helpersTexts.required")}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={(savePending && (!partener || !partener.email))}>
                                    <TextField 
                                        name="email"
                                        value={partener.email}
                                        variant="outlined"
                                        size="small"
                                        error={(savePending && (!partener || !partener.email))}
                                        label={translate("microgatewayApp.micropartenerPartener.email")}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {(savePending && (!partener || !partener.email)) && <FormHelperText>
                                        {translate("_global.form.helpersTexts.required")}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={savePending && (!partener || !partener.category)}>
                                    <Select name="category" onChange={handleChange} 
                                        variant="outlined" className={classes.catSelect}
                                        displayEmpty
                                        fullWidth error={savePending && (!partener || !partener.category)}
                                        value={partener ? partener.category ? partener.category.id : 0 : 0}>
                                        <MenuItem value={0}>
                                            <em>{`Select ${translate("microgatewayApp.micropartenerPartener.category")}`}</em>
                                        </MenuItem>
                                        {categoriesMenuItems}
                                    </Select>
                                    {savePending && (!partener || !partener.category) && <FormHelperText>
                                        {translate("_global.form.helpersTexts.required")}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            {partener && fields && <>
                                {fields.map(f => <PartenerFieldUpdate 
                                    key={f.id} 
                                    partener={partener} 
                                    field={f} 
                                    partenerSaveEventSuccessed={saveSuccessed}
                                    partenerSaveEventPending={savePending}
                                    onChange={handleDynamicFieldChange} 
                                    onSave={handleFieldSave} />
                                )}
                            </>}
                            <Grid item xs={12}>
                                <SaveButton 
                                 type="submit"
                                 className="float-right text-capitalize" />
                            </Grid>
                        </Grid>
                </form>
            </MyCustomModal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ locale, authentication }: IRootState) =>({
    currentLocal: locale.currentLocale,
    account: authentication.account,
})

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PartenerUpdate);