import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '25vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    catBox:{
        borderColor: theme.palette.info.dark,
    },
    criteriaBox:{
        borderColor: theme.palette.success.dark,
    },
    ponderationBox:{
        borderColor: theme.palette.primary.dark,
    },
}))

interface EvaluationUpdateProps{
    category?: IProcessCategory,
    open?:boolean,
    onClose:Function,
    onSave?:Function,
}

export const ProcessCategoryUpdate = (props: EvaluationUpdateProps) =>{
    const { open } = props;
    const [isNew, setIsNew] = useState(!props.category || !props.category.id);
    const [category, setCategory] = useState(props.category || {});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setIsNew(!props.category || !props.category.id);
        setCategory(props.category || {});
    }, [props.category])

    const handleClose = () => {
        props.onClose();
    }


    const handleSave = (event) =>{
        event.preventDefault();
        setShowMessage(false);
        setLoading(true)
        if(category && category.name){
            const request = isNew ? axios.post<IProcessCategory>(`${API_URIS.processCategoryApiUri}`, cleanEntity(category))
                    : axios.put<IProcessCategory>(`${API_URIS.processCategoryApiUri}`, cleanEntity(category))
            request.then(res =>{
                if(res.data){
                    setSuccess(true)
                    if(props.onSave){
                        props.onSave(res.data, isNew);
                    }
                    if(!isNew)
                        setShowMessage(true)
                }else{
                    setSuccess(false);
                }
            }).catch(e =>{
                setSuccess(false);
                setShowMessage(true);
            }).finally(() => setLoading(false))
        }
    }

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setCategory({...category, [name]: value});
    }

    return (
        <React.Fragment>  
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                                <Typography variant="h4" className="mr-5">
                                    {translate("microgatewayApp.microprocessProcessCategory.home.createOrEditLabel")}
                                </Typography>
                        </Box>}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <form onSubmit={handleSave}>
                        {showMessage && <Grid item xs={12}>
                                <Alert severity={success? "success" : "error"} 
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setShowMessage(false);
                                        }}
                                        >
                                        <Close fontSize="inherit" />
                                        </IconButton>}
                                    >
                                        {success ? translate("_global.flash.message.success"): translate("_global.flash.message.failed")}
                                </Alert>
                            </Grid>
                            }
                            <Grid container spacing={2}>
                                {loading && 
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center"
                                        boxShadow={1} className={classes.catBox} borderLeft={10} borderRadius={3} p={1}>
                                        <CircularProgress />
                                        <Typography className="ml-3">Loading</Typography>
                                    </Box>
                                </Grid>
                                }
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth
                                        name="name"
                                        size="small"
                                        label={translate("microgatewayApp.microprocessProcessCategory.name")}
                                        InputLabelProps={{ shrink: true}}
                                        value={category.name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth
                                        name="description"
                                        size="small"
                                        label={translate("microgatewayApp.microprocessProcessCategory.description")}
                                        InputLabelProps={{ shrink: true}}
                                        value={category.description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                                        <SaveButton type="submit" disabled={!category || !category.name} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default ProcessCategoryUpdate;