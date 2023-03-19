import { Button, Grid, LinearProgress, makeStyles, TextField, Typography } from '@material-ui/core';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import theme from 'app/theme';
import MyCustomRTE from 'app/shared/component/my-custom-rte';

export interface IInstanceCreateModalProps{
    process: IProcess,
    open?: boolean,
    onClose?: Function,
    onCreated?: Function,
}

const useStyles = makeStyles({
      card:{
          width: `35%`,
          [theme.breakpoints.down('sm')] :{
            width: `85%`,
          },
      },

})

const apiUrl = 'services/microprocess/api/processes';

export const InstanceCreateModal = (props: IInstanceCreateModalProps) =>{
    const process = props.process;
    const [dossier, setDossier] = useState(null);
    const [instance, setInstance] = useState<IProcess>(props.process);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState('');

    const [runnableProcess, setRunnableProcess] = useState<IProcess>(null);

    const [openProcessSelector, setOpenProcessSelector] = useState(false);

    const classes = useStyles();
    
    useEffect(() =>{
        setInstance(props.process)
    }, [])

    const handleClose = () =>{
        if(props.onClose)
            props.onClose(instance);
    }

    const saveInstance = () =>{
        if(dossier && process && process.id){
            setLoading(true);
            const entity: IProcess = {
                ...process,
                modelId: process.id,
                id: null,
                label: dossier,
                // runnableProcessId: runnableProcess ? runnableProcess.id : null
                runnableProcessId: null
            }
            axios.post<IProcess>(apiUrl, cleanEntity(entity)).then(response =>{
                if(response.data){
                    setSuccessMessage(null);
                    if(props.onCreated)
                        props.onCreated(response.data);
                  setDossier('');
                  setRunnableProcess(null);
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
                setError("error")
            }).finally(() => setLoading(false));
        }
    }

    const onSelect = (selected: IProcess) => {
        setRunnableProcess(selected);
        setOpenProcessSelector(false);
    };

    return(
        <React.Fragment>
            <MyCustomModal open={props.open} 
                onClose={handleClose}
                rootCardClassName={classes.card}
                title={translate('_global.instance.create')}
                >
                    {loading && <LinearProgress /> }
                    <Grid container spacing={1} style={{marginTop:5,}}>
                        <Grid item sm={12}>
                            <Typography>
                                <Translate contentKey="microgatewayApp.microprocessProcess.detail.title">Process</Translate>
                                &nbsp;:&nbsp;{<MyCustomPureHtmlRender body={process.label} renderInSpan />}
                            </Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <MyCustomRTE 
                                content={dossier}
                                onSave={value => setDossier(value)}
                                editorMinHeight={150}
                                editorMaxHeight={200}
                                label={translate('_global.instance.folder')}
                            />
                            {/* <TextField value={dossier} onChange={(e) =>setDossier(e.target.value)} fullWidth
                                label={translate('_global.instance.folder')}/> */}
                        </Grid>{/* 
                        <Grid item sm={12}>
                            <TextField value={runnableProcess ? runnableProcess.label : ""} fullWidth
                                label={translate('microgatewayApp.microprocessProcess.runnableProcessId') }
                                InputProps={{
                                    endAdornment:(
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setOpenProcessSelector(true)}>
                                                <AttachFile />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                onClick={() => setOpenProcessSelector(true)}
                                />
                        </Grid> */}
                        <Grid item sm={12}>
                            <Button color="primary" variant="text" size="medium" 
                                style={{float: 'right'}} disabled={!dossier} onClick={saveInstance}
                                className="text-capitalize">
                                <Translate contentKey="entity.action.save">Save</Translate>
                                <CheckCircleIcon />
                            </Button>
                        </Grid>
                        <Grid item sm={12} style={{marginTop:20}}>
                            {(error || successMessage) && 
                                <Alert severity={error ? 'error': 'success'} 
                                onClose={() => {setError(null), setSuccessMessage(null)}}>
                                    {error ? error : successMessage}
                                </Alert>
                            }
                        </Grid>
                    </Grid>
            </MyCustomModal>
        </React.Fragment>
    )
}