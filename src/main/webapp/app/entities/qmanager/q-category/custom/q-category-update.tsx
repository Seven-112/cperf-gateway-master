import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Backdrop, Button, Card, CardContent, CardHeader, Collapse, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { Alert } from "@material-ui/lab";
import { IQCategory } from "app/shared/model/qmanager/q-category.model";
import { SaveButton } from "app/shared/component/custom-button";

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

interface QCategoryUpdateProps{
    category?: IQCategory
    open?: boolean,
    onSave?: Function,
    onClose: Function,
}

export const QCategoryUpdate = (props: QCategoryUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.category || !props.category.id);
    const [category, setCategory] = useState(props.category || {});
    const [loading, setLoading] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [error, setError] = useState(null);
    const classes = useStyles();

    const formIsValid = category && category.name;

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
             const request = isNew ? axios.post<IQCategory>(`${API_URIS.queryCategoryApiUri}`, cleanEntity(category))
                                  : axios.put<IQCategory>(`${API_URIS.queryCategoryApiUri}`, cleanEntity(category))
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
                        title={translate("microgatewayApp.qmanagerQCategory.home.createOrEditLabel")}
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
                                    {error && submited && <Grid item xs={12}>
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
                                    {category && category.parent && 
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth
                                                value={category.parent.name}
                                                variant="outlined"
                                                size="small"
                                                label={translate("microgatewayApp.qmanagerQCategory.parent")}
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth
                                            name="name"
                                            value={category.name}
                                            variant="outlined"
                                            size="small"
                                            label={translate("microgatewayApp.qmanagerQCategory.name")}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth
                                            name="description"
                                            value={category.description}
                                            variant="outlined"
                                            size="small"
                                            label={translate("microgatewayApp.qmanagerQCategory.description")}
                                            multiline
                                            rows={3}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SaveButton
                                            disabled={!formIsValid}
                                            type="submit"
                                         />
                                    </Grid>
                                </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default QCategoryUpdate;