import { IIndicator } from "app/shared/model/indicator.model";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";

import {updateEntity, reset } from 'app/entities/indicator/indicator.reducer';
import React, { useEffect, useState } from "react";import { Box, Card, CardContent, CardHeader, colors, Fab, Grid, IconButton, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { Add, CheckCircle, Close, GraphicEq, Remove, SyncAlt } from "@material-ui/icons";
import { Translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
    },
    card:{
        width: '30%',
        [theme.breakpoints.down('md')]:{
            width: '35%',
        },
        [theme.breakpoints.down('sm')]:{
            width: '50%',
        },
        marginTop: theme.spacing(3),
        overflow: 'auto',
        background: 'transparent',
        boxShadow: 'none',
    },
    cardheader:{
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
        borderRadius: '15px 15px 0 0',
    },
    subheader:{
        color: colors.grey[50],
        textAlign: 'center',
    },
    cardContent:{
        height: theme.spacing(37),
        overflow: 'auto',
        background: theme.palette.background.paper,
        borderRadius: '0 0 15px 15px',
    },
    calBox:{
        borderRadius: '20px',
    },
}))

export interface IndicatorDataEditorProps extends StateProps, DispatchProps{
    indicator: IIndicator,
    open: boolean,
    onClose: Function,
}

export const IndicatorDataEditor = (props: IndicatorDataEditorProps) =>{
    const {open} = props;

    const [indicator, setIndicator] = useState<IIndicator>(props.indicator);

    const [value, setValue] = useState(null);

    const [dataEdited, setDataEdited] = useState(false);

    const classes = useStyles();

    const handleClose = () =>{
        props.onClose();
    }

    useEffect(() =>{
        setIndicator(props.indicator);
        props.reset();
    }, [props.indicator])

    useEffect(() =>{
        if(props.updateSuccess){
            props.onClose(props.updatedEntity);
            setDataEdited(false);
        }
    }, [props.updateSuccess])

    const calculeNewResult = (mode: "remove" | "add" | "exact") =>{
        if(value && indicator && indicator.typeindicator){
            let result = indicator.typeindicator.measurable ? indicator.numberResult : indicator.percentResult;
            if(!result)
                result = 0;
            if(mode === "remove")
                result = result - value;
            else if(mode === "add")
                result = result + value;
            else
                result = value;
            if(result < 0)
                result = 0;
            if(indicator.typeindicator.measurable)
                setIndicator({...indicator, numberResult: result});
            else
                setIndicator({...indicator, percentResult: result});
            setDataEdited(true);
        }
    }

    const saveEntity = () =>{
      props.updateEntity(indicator);
    }
   
    const getIndicatorResult = () =>{
        if(indicator && indicator.typeindicator){
            if(indicator.typeindicator.measurable){
                let result = indicator.numberResult ? indicator.numberResult+'' : '0';
                if(indicator.resultUnity)
                    result = result + ' '+indicator.resultUnity;
                return result;
            }else{
                return indicator.percentResult ? indicator.percentResult +'%' : '0%';
            }
        }
        return '';
    }

    return (<React.Fragment>
        <Modal
            aria-labelledby="edit-indicator-data-modal-title"
            aria-describedby="edit-indicator-data-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}>
            <Card className={classes.card}>
                <CardHeader 
                    title={indicator.label}
                    subheader={indicator.objectif ? indicator.objectif.name : ''}
                    classes={{ root: classes.cardheader, subheader: classes.subheader }}
                    action={
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>
                    } />
                <CardContent className={classes.cardContent}>
                        <Box boxShadow={3} display="flex" justifyContent="center" textAlign="center" className={classes.calBox}>
                            <Grid container spacing={0}>
                                <Grid item xs={12} className="mb-3 mt-3">
                                    <Typography> {getIndicatorResult()} </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Fab onClick={() => calculeNewResult("remove")} disabled={!value} size="small" title="Remove">
                                        <Remove />
                                    </Fab>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField type="number" value={value} fullWidth variant="outlined"
                                         onChange={(e) => { setValue(Number(e.target.value)); setDataEdited(false)}}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Fab onClick={() => calculeNewResult("add")} disabled={!value} size="small" title="Add">
                                        <Add />
                                    </Fab>
                                </Grid>
                                <Grid item xs={12} className="mt-3 mb-3">
                                    <Fab onClick={() => calculeNewResult("exact")}
                                                disabled={!value} size="small" title="Replace">
                                        <SyncAlt />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box textAlign="center">
                            <Fab color="primary" className="mt-3" variant="extended" disabled={!dataEdited} onClick={saveEntity}>
                                <Translate contentKey="entity.action.save">Save</Translate>&nbsp;&nbsp;
                                <CheckCircle />
                            </Fab>
                        </Box>
                </CardContent>
            </Card>
        </Modal>
    </React.Fragment>)
}

const mapStateToProps = ({indicator}: IRootState) => ({
    updatedEntity: indicator.entity,
    updating: indicator.updating,
    updateSuccess: indicator.updateSuccess,
  });
  
  const mapDispatchToProps = {
    updateEntity,
    reset,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(IndicatorDataEditor);