import React from "react"
import { useState } from "react"
import { Box, Card, CardContent, CardHeader, CircularProgress, Collapse, Fab, FormControl, Grid, IconButton, makeStyles, Typography } from "@material-ui/core"
import { translate } from "react-jhipster"
import { Close, KeyboardArrowLeft } from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import { IDynamicField } from "app/shared/model/dynamic-field.model"
import DynamicField from "app/entities/dynamic-field/custom/dynamic-field"
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model"

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color:  theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
}))

interface TenderFieldUpdateProps{
    tenderId?:any,
    locked?:boolean,
    onSave?:Function,
    onDelete?:Function,
    onPreview?:Function,
    onClose?:Function,
}

export const TenderFieldUpdate = (props: TenderFieldUpdateProps) =>{
    const { locked, tenderId } = props;
    const [loading, setLoading] = useState(false); 
    const [success, setSuccess] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [open, setOpen] = useState(false);

    const classes = useStyles();

    const handleClose = () =>{
        if(props.onClose){
            props.onClose();
        }
    }

    const handlePreview = () =>{
        if(props.onPreview)
            props.onPreview();
    }

    const handleSaveField = (saved?: IDynamicField, isNewOp?:boolean) =>{
        if(saved && props.onSave)
            props.onSave(saved, isNewOp);
    }

    const handleDelete = (deletedId?: any) =>{
        if(props.onDelete && deletedId)
            props.onDelete(deletedId)
    }

    return (
        <React.Fragment>
                <Card className={classes.card}>
                    <CardHeader 
                        title="Questionnaire"
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
                            <Grid container spacing={2} alignItems="center">
                                {loading && <Grid item xs={12}>
                                    <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                            <CircularProgress color="secondary"/>
                                            <Typography variant="h4" color="secondary" className="ml-2">Loading...</Typography>
                                    </Box>
                                </Grid>}
                                {<Grid item xs={12}>
                                    <Collapse in={showMessage}>
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
                                    </Collapse>
                                </Grid>}
                                <Grid item xs={12}>
                                    <DynamicField 
                                        entityId={tenderId}
                                        readonly={locked}
                                        tag={DynamicFieldTag.TENDER}
                                        onSave={handleSaveField}
                                        onDelete={handleDelete}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="medium">
                                        <Box width={1} mt={1} display="flex" justifyContent="space-between" alignItems="center">
                                            {props.onPreview && 
                                                <IconButton color="primary" onClick={handlePreview} size="small">
                                                    <KeyboardArrowLeft />
                                                    <Typography className="ml-2">{translate("_global.label.back")}</Typography>
                                                </IconButton>
                                            }
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </Grid>
                    </CardContent>
                </Card>
        </React.Fragment>
    )
}

export default TenderFieldUpdate;