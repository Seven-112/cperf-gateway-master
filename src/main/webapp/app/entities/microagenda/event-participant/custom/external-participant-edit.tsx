import { Backdrop, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, makeStyles, Modal, Slide, TextField } from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import { IEventParticipant } from "app/shared/model/microagenda/event-participant.model";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '23%',
        [theme.breakpoints.down("sm")]:{
            width: '65%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[300],
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 0,
        paddingBottom:0,
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',
      borderRadius: '0 0 15px 15px',  
    },
}))

interface ExternalParticipantEditProps{
    open?: boolean,
    onClose: Function,
    onSave: Function
}

export const ExternalParticipantEdit = (props: ExternalParticipantEditProps) =>{
    const { open } = props

    const [form, setForm] = useState<IEventParticipant>({name: '', email: ''});

    const classes = useStyles();

    const handleClose = () => props.onClose();

    const validateEmail = (email) => {
        if(email){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        return false;
    }
    
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setForm({...form, [name]: value})
    }

    const onSave = () =>{
        props.onSave(form);
    }

    useEffect(()=>{
        setForm({name: '', email: ''})
    }, [props.open])
    
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
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={translate("microgatewayApp.microagendaEventParticipant.detail.title")}
                            titleTypographyProps={{
                                variant: 'h4'
                            }}
                            action={
                                props.onClose ?(
                                    <IconButton 
                                        color="inherit"
                                        onClick={handleClose}>
                                        <Close />
                                    </IconButton>
                                ): ''
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        value={form.name}
                                        fullWidth
                                        label={form.name ? translate("microgatewayApp.microagendaEventParticipant.name") : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder={translate("microgatewayApp.microagendaEventParticipant.name")}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="email"
                                        value={form.email}
                                        fullWidth
                                        label={form.email ? translate("microgatewayApp.microagendaEventParticipant.email") : ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder={translate("microgatewayApp.microagendaEventParticipant.email")}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box width={1} textAlign="right">
                                        <Button color="primary" variant="text"
                                             disabled={!validateEmail(form.email)}
                                             className="text-capitalize"
                                             onClick={onSave}>
                                            {translate("entity.action.save")}&nbsp;&nbsp;<Save />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default ExternalParticipantEdit;
