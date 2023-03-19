import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Button, Card, CardContent, CardHeader, Collapse, FormControl, FormHelperText, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { AUTHORITIES } from "app/config/constants";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme =>({
    modal:{
        display:'flex',
        justifyContent: 'center',
    },
    card:{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        width: '30%',
        marginTop: theme.spacing(15),
        [theme.breakpoints.down("sm")]:{
            width: '75%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '95%',
        },
    },
    cardheader:{
        background: "white",
        color: theme.palette.primary.dark,
        paddingTop:2,
        paddingBottom:2,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
        background: theme.palette.background.paper,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        overflow: 'auto',
        borderRadius: '0 0 15px 15px',
    },
}));

interface PartenerCategoryUpdateProps{
    category?: IPartenerCategory
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const PartenerCategoryUpdate = (props: PartenerCategoryUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.category || !props.category.id);
    const [category, setCategory] = useState(props.category || {});
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [error, setError] = useState(null);
    const classes = useStyles();

    const formIsValid = category && category.name && category.role;

    useEffect(() =>{
        setCategory(props.category || {});
        setIsNew(!props.category || !props.category.id);
    }, [props.category])

    const handleClose = () => props.onClose();

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setCategory({...category, [name]:value});
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setSubmited(true)
        if(formIsValid){
            setLoading(true);
            axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}/?role.equals=${category.role}`)
                .then(result =>{
                    if((result.data && result.data.length <= 0) || !result.data || !isNew || category.parent){
                        const request = isNew ? axios.post<IPartenerCategory>(`${API_URIS.partenerCategoryApiUri}`, cleanEntity(category))
                                            : axios.put<IPartenerCategory>(`${API_URIS.partenerCategoryApiUri}`, cleanEntity(category))
                        request.then(res => {
                            if(res.data){
                                setCategory(res.data);
                                if(props.onSave)
                                    props.onSave(res.data, isNew);
                            }
                        }).catch(e => {
                            console.log(e)
                            setError(translate("_global.flash.message.failed"))
                        }).finally(() => setLoading(false));
                    }else{
                        setLoading(false);
                        setError(translate("_global.label.roleUsed"))
                    }
                }).catch(err => {
                    console.log(err)
                    setLoading(false);
                    setError(translate("_global.flash.message.failed"))
                })
        }
    }
    
    return(
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500}}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        avatar={<FontAwesomeIcon icon={faCubes} />}
                        title={translate("microgatewayApp.micropartenerPartenerCategory.home.createOrEditLabel")}
                        titleTypographyProps={{ variant: 'h4' }}
                        action={<IconButton onClick={handleClose} color="inherit"><Close /></IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSave}>
                                <Grid container spacing={3}>
                                    {loading && <Grid item xs justify="center">
                                        <Typography variant="h4" color="primary">Loading...</Typography>
                                    </Grid>}
                                    {error && <Grid item xs={12}>
                                        <Collapse in={true}>
                                            <Alert 
                                                severity="error"
                                                action={<IconButton 
                                                        color="inherit"
                                                        size="small"
                                                        onClick={() => setError(null)}
                                                    >
                                                    <Close/>
                                                </IconButton>}
                                            >
                                                {error}
                                            </Alert>
                                        </Collapse>
                                    </Grid>}
                                    {((isNew && !category.parent) || !category.role) && <Grid item xs={12}>
                                        <FormControl fullWidth error={submited && !formIsValid}>
                                            <InputLabel shrink>{translate("role.detail.title")}</InputLabel>
                                            <Select
                                               variant="outlined"
                                               margin="dense"
                                               name="role"
                                               value={category.role} 
                                                error={submited && !formIsValid}
                                                onChange={handleChange}>
                                                <MenuItem value={AUTHORITIES.PROVIDER}>
                                                    {translate("role."+AUTHORITIES.PROVIDER.toString())}
                                                </MenuItem>
                                                <MenuItem value={AUTHORITIES.CLIENT}>
                                                    {translate("role."+AUTHORITIES.CLIENT.toString())}
                                                </MenuItem>
                                            </Select>
                                            {submited && !formIsValid && <FormHelperText>{translate("_global.form.helpersTexts.required")}</FormHelperText>}
                                        </FormControl>
                                    </Grid>}
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth
                                            name="name"
                                            value={category.name}
                                            variant="outlined"
                                            size="small"
                                            label={translate("microgatewayApp.micropartenerPartenerCategory.name")}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {category && category.parent && 
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth
                                            value={category.parent.name}
                                            variant="outlined"
                                            size="small"
                                            label={translate("microgatewayApp.micropartenerPartenerCategory.parent")}
                                        />
                                    </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="text" 
                                            disabled={!formIsValid}
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

export default PartenerCategoryUpdate;