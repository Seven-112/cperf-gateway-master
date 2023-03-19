import React, { useState, useEffect } from 'react';

import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { Helmet } from 'react-helmet';
import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { translate, Translate } from 'react-jhipster';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import { SaveButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down('sm')]:{
            width: '95%',
        },
    },
}))

export interface IProcedureUpdateProps{
    procedure: IProcedure,
    open: boolean,
    onSaved?: Function,
    onClose?: Function,
}

export const ProcedureBindProcess = (props: IProcedureUpdateProps) => {

  const [processes, setProcesses] = useState<IProcess[]>([]);

  const [processId, setProcessId] = useState(null);

  const [open, setOpen] = useState(props.open);

  const [loading, setLoading] = useState(false);

  const [updating, setUpdating] = useState(false);

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };
  
  useEffect(() => {
    // loading process
    setLoading(true)
    axios.get<IProcess[]>(`${API_URIS.processApiUri}/?procedureId.specified=false&modelId.specified=false`).then(resp =>{
        if(resp.data && resp.data.length)
            setProcesses([...resp.data]);
    }).catch(() =>{})
    .finally(() => setLoading(false));
  }, []);

  useEffect(() =>{
    setOpen(props.open);
  }, [props.open])

  const saveEntity = (event) => {
      event.preventDefault();
    if (processId && props.procedure && props.procedure.id) {
        setUpdating(false);
        axios.get<IProcess[]>(`${API_URIS.processApiUri}/${processId}/bind-or-detach-precedure/?procedureId=${props.procedure.id}`)
            .then(res => {
                if(res.data){
                    const pParent = res.data.find(p => p.modelId === null);
                    setOpen(false);
                    props.onSaved(pParent);
                }
            }).catch(() =>{}).finally(() => setUpdating(false))
    }
  };

  return (
      <React.Fragment>
          <Helmet><title>Cperf | Procedure | Process Binding</title></Helmet>
          <MyCustomModal open={open} onClose={handleClose}
                title={translate("_global.label.bindProcessToPrecedure")}
                rootCardClassName={classes.card}>
                <Grid container spacing={2}>
                    {loading && <Grid item xs={12}>laoding..</Grid> }
                    {updating && <Grid item xs={12}>updating..</Grid> }
                    {processes && processes.length && <form onSubmit={saveEntity} className="w-100">
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="process-select-label">
                                <Translate contentKey="microgatewayApp.microprocessProcess.detail.title">Process</Translate>
                            </InputLabel>
                            <Select required
                                labelId="process-select-label"
                                id="process-select"
                                value={processId}
                                onChange={(e) => setProcessId(e.target.value)}
                            >
                                {processes.map((p) => (
                                    <MenuItem key={p.id} value={p.id}> {p.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} className="text-right mt-3">
                        <SaveButton type="submit" disabled={!processId} />
                    </Grid>
                </form>}
                {!loading && !updating && (!processes || !processes.length) && <Grid item xs={12} className="text-center text-info h5">
                    <Translate contentKey="_global.label.noProcessBindable">No avalable process</Translate>
                </Grid>}
            </Grid>
          </MyCustomModal>
      </React.Fragment>
  );
};
export default ProcedureBindProcess;
