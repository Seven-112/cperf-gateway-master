import { Backdrop, Button, Card, CardContent, CardHeader, Fab, Grid, IconButton, LinearProgress, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import theme from 'app/theme';

export interface ICopyProcessModalProps{
    process: IProcess,
    open?: boolean,
    onClose: Function,
}

const useStyles = makeStyles({
    modal:{
        display: 'flex',
        justifyContent: 'center',
      },
      card:{
          width: theme.spacing(70),
          marginTop: theme.spacing(5),
          minHeight:theme.spacing(20),
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border:0,
      },
    suheader:{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.dark,
      padding: theme.spacing(1),
      paddingLeft:3,
      fontWeight: 'bold',
    },
    cardContent:{
        backgroundColor: theme.palette.background.paper,
        minHeight:theme.spacing(35),
        width: '100%',
    }

})

const apiUrl = 'services/microprocess/api/processes';

export const CopyProcessModal = (props: ICopyProcessModalProps) =>{
    const process = props.process;
    const [label, setLabel] = useState(null);
    const [saved, setSaved] = useState<IProcess>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState('');

    const classes = useStyles();

    const handleClose = () =>{
        if(props.onClose)
            props.onClose(saved);
    }

    useEffect(()=>{
        setSaved(null);
    }, [])

    const saveInstance = () =>{
        if(label && process && process.id){
            axios.get<IProcess>(`${API_URIS.processApiUri}/copy/${process.id}/?label=${label}`).then(response =>{
                if(response.data){
                    setSuccessMessage('Success !');
                    setSaved(response.data);
                    props.onClose(response.data);
                }else{
                    setError('Error !');
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
                setError('Error !');
            }).finally(() => setLoading(false));
        }
    }

    return(
        <React.Fragment>
            <Modal open={props.open} onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                }}
                className={classes.modal}>
                    <Card className={classes.card}>
                        <CardHeader className={classes.suheader}
                            title={
                                <Typography className="ml-2" variant="h4">
                                    <Translate contentKey="_global.label.processCoping">Process Coping</Translate>
                                </Typography>
                            }
                            titleTypographyProps={{
                            variant: 'h4',
                            }}
                            action={
                                <IconButton onClick={handleClose} color="inherit">
                                    <CloseIcon />
                                </IconButton>
                            }/>
                        <CardContent className={classes.cardContent}>
                             {loading && <LinearProgress /> }
                            <Grid container spacing={1} style={{marginTop:5,}}>
                                <Grid item sm={12}>
                                    <Typography>
                                        <Translate contentKey="microgatewayApp.microprocessProcess.detail.title">Process</Translate>
                                        &nbsp;:&nbsp;{process.label}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField value={label} onChange={(e) =>setLabel(e.target.value)} fullWidth
                                        label={translate('microgatewayApp.microprocessProcess.label')}/>
                                </Grid>
                                <Grid item sm={12}>
                                    <Button color="primary" variant="text" className="text-capitalize"
                                      style={{float: 'right'}} disabled={!label} onClick={saveInstance}>
                                        <Translate contentKey="entity.action.save">Save</Translate>
                                        <CheckCircleIcon className="ml-2"/>
                                    </Button>
                                </Grid>
                                <Grid item sm={12} style={{marginTop:20}}>
                                    {(error || successMessage) && 
                                     <Alert severity={error ? 'error': 'success'} 
                                        onClose={() => {setError(null); setSuccessMessage(null)}}>
                                         {error ? error : successMessage}
                                     </Alert>
                                    }
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
            </Modal>
        </React.Fragment>
    )
}

export default CopyProcessModal;