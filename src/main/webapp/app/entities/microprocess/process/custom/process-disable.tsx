import { useState } from "react";
import axios from 'axios';
import { Avatar, Backdrop, Card, CardContent, CardHeader, colors, makeStyles, Modal, Box, Typography, CardActions, Button, IconButton } from "@material-ui/core";
import React from "react";
import { translate } from "react-jhipster";
import { Cancel, Close, Error, Help, Warning } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IProcess } from "app/shared/model/microprocess/process.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
    },
    card:{
        width: '30%',
        [theme.breakpoints.down('sm')]:{
            width: '85%',
        },
        background: 'transparent',
        marginTop: theme.spacing(15),
        boxShadow: 'none',
    },
    cardheader:{
        background: theme.palette.secondary.main,
        color: theme.palette.background.paper,
        paddingBottom: 3,
        paddingTop: 3,
        borderRadius: '30px 30px 0 0',
    },
    avatar:{
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.background.default,
    },
    cardContent:{
        background: theme.palette.background.paper,
        minHeight: '10%',
        maxHeight: '50%',
        overflow: 'auto',
    },
    questionIcon:{
        fontSize: 50,
    },
    cardActions:{
        background: theme.palette.background.paper,
        borderTop: `2px solid ${colors.grey[800]}`,
        textAlign: 'center',
        borderRadius: '0 0 30px 30px',
    },
}))

interface ProcessDisableProps{
    entity:IProcess,
    open?:boolean,
    question?:any,
    onSave?:Function,
    onClose:Function,
}



export const ProcessDisable = (props: ProcessDisableProps) =>{
    const {entity, open, question} = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const classes = useStyles();
    
    const handleClose = () => props.onClose();

    const handleDisable = () =>{
        if(entity && entity.id){
            setLoading(true);
            setError(false);
            const p: IProcess = {
                ...entity,
                valid: false,
            }
            axios.put(`${API_URIS.processApiUri}/changeValidValue/${entity.id}/?valid=${false}`)
                .then((res) =>{
                    if(res.data && props.onSave)
                        props.onSave(res.data);
                    else
                        setError(true);
                })
                .catch(e =>{
                    console.log(e);
                    setError(true);
                }).finally(() => setLoading(false));
        }
    }

    return (
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout:300,
                }}
                disableBackdropClick
                closeAfterTransition
                onClose={handleClose}
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        avatar={
                            <Avatar className={classes.avatar}><Error /></Avatar>
                        }
                        title={"Confirmation"}
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        className={classes.cardheader}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                    />
                    <CardContent className={classes.cardContent}>
                        {loading && 
                        <Box width={1} display="flex" justifyContent="center" flexWrap="auto">
                            <Typography variant="h4">Deleting...</Typography>
                        </Box>}
                        {!loading && !error &&
                        <Box width={1} mt={3} mb={3} display="flex" alignItems="flex-start" flexWrap="auto">
                            <Help className={classes.questionIcon} color="secondary" />
                            <Typography variant="h4">{question ? question : translate('_global.flash.message.confirmDelete')}</Typography>
                        </Box>}
                        {error && !loading && <Box width={1} display="flex" justifyContent="center" flexWrap="auto">
                            <Typography color="secondary">{translate('_global.flash.message.failed')}</Typography>
                        </Box>}
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Box width={1} display="flex" justifyContent="center" flexWrap="wrap">
                            <Button
                                color="secondary"
                                variant="contained"
                                size="small"
                                onClick={handleDisable}
                                className="mr-3"
                            >
                                {translate('entity.action.delete')}&nbsp;<Delete />
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                onClick={handleClose}
                                className="mr-3"
                            >
                                {translate('entity.action.cancel')}&nbsp;<Cancel />
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default ProcessDisable;