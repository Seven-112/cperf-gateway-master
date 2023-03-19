import { Backdrop, Box, Button, Card, CardContent, CardHeader, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Slide, Switch, TextField, Typography } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { IDynamicField } from "app/shared/model/dynamic-field.model";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { cleanEntity } from "app/shared/util/entity-utils";
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model";
import MyCustomRte from "./my-custom-rte";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '25%',
        [theme.breakpoints.down("sm")]:{
            width: '90%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
        color: theme.palette.grey[800],
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '5vh',
      maxHeight: '70vh',
      overflow: 'auto',  
    },
}))

interface TextContentManagerProps{
    open?:boolean,
    readonly?: boolean,
    title?: string,
    value?: string,
    onSave?:Function,
    onChange?: Function,
    onClose:Function,
}

export const TextContentManager = (props: TextContentManagerProps) =>{
    const { open, readonly, title } = props;
    const [value, setValue] = useState(props.value);
    const [isChanged, setIsChanged] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setValue(props.value)
    }, [props.value])

    const handleClose = () => props.onClose();

    const handleChange  = (e) =>{
        setValue(e.target.value);
        setIsChanged(true);
        if(props.onChange)
            props.onChange(e.target.value);
    }

    const handleSave = () =>{
        if(props.onSave)
            props.onSave(value);
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
            <Slide in={open} timeout={300} unmountOnExit>
                <Card className={classes.card}>
                    <CardHeader 
                        title={title ? title : ''}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={
                        props.onClose ? 
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>: ''}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <MyCustomRte content={value} readonly={readonly} editorMinHeight={150} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                    </CardContent>
                </Card>
            </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default TextContentManager;