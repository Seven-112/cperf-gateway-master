import { Backdrop, Box, Button, Card, CardContent, CardHeader, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, Switch, TextField, Typography } from "@material-ui/core";
import { IField } from "app/shared/model/micropartener/field.model";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { translate } from "react-jhipster";
import { Close, Save } from "@material-ui/icons";
import { FieldType } from "app/shared/model/enumerations/field-type.model";
import { API_URIS } from "app/shared/util/helpers";
import { cleanEntity } from "app/shared/util/entity-utils";
import MyCustomModal from "app/shared/component/my-custom-modal";
import { SaveButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '80%',
        },
        [theme.breakpoints.down("xs")]:{
            width: '98%',
        },
    },
}));

interface FieldUpdateProps{
    field?: IField,
    open?: boolean,
    onSave: Function,
    onClose: Function,
}

export const FieldUpdate = (props: FieldUpdateProps) =>{
    const { open } = props;

    const [field, setField] = useState(props.field || {});
    
    const [isNew, setIsNew] = useState(!props.field || !props.field.id);

    const [loading, setLoading] = useState(false)

    const classes = useStyles();

    useEffect(() =>{
        setField(props.field || {})
        setIsNew(!props.field || !props.field.id)
    }, [props.field])

    const handleClose = () => props.onClose();

    const handleChange  = (e) =>{
        const { name, value } = e.target;
        setField({...field, [name]: value});
    }
    
    const handleSave = (event) =>{
        event.preventDefault();
        console.log(field);
        if(field && field.type && field.category && field.label){
            setLoading(true)
            const request = isNew ? axios.post<IField>(`${API_URIS.partenerFieldModelApiUri}`, cleanEntity(field))
                                  : axios.put<IField>(`${API_URIS.partenerFieldModelApiUri}`, cleanEntity(field));
            request.then(res =>{
                if(res.data)
                    props.onSave(res.data, isNew);
            }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    return (
        <React.Fragment>
        <MyCustomModal
            open={open}
            onClose={handleClose}
            avatarIcon={<FontAwesomeIcon icon={faCubes} />}
            title={translate("microgatewayApp.micropartenerField.home.createOrEditLabel")}
            rootCardClassName={classes.card}
        >
            <form onSubmit={handleSave}>
                <Grid container spacing={3}>
                    {loading && <Grid item xs={12}>
                        <Box width={1} textAlign="center">
                            <Typography variant="h5" color="primary">Loading...</Typography>
                        </Box>
                    </Grid>}
                    <Grid item xs={12}>
                        <Box width={1} display="flex" 
                            justifyContent="flex-start" 
                            alignItems="center" boxShadow={1} p={1}>
                                <FontAwesomeIcon icon={faExclamation} size="2x" className="text-primary"/>
                                <Typography className="ml-3 text-primary">
                                    {translate("_global.label.nameAndEmailAutoGenereted")}
                                </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField 
                                value={field.label}
                                required
                                label={translate("microgatewayApp.micropartenerField.label")}
                                name="label"
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {translate("microgatewayApp.micropartenerField.type")}
                            </InputLabel>
                            <Select name="type" value={field.type} onChange={handleChange}>
                                <MenuItem value="">...</MenuItem>
                                <MenuItem value={FieldType.STRING}>
                                    {translate("microgatewayApp.FieldType."+FieldType.STRING.toString())}
                                </MenuItem>
                                <MenuItem value={FieldType.DATE}>
                                    {translate("microgatewayApp.FieldType."+FieldType.DATE.toString())}
                                </MenuItem>
                                <MenuItem value={FieldType.BOOLEAN}>
                                    {translate("microgatewayApp.FieldType."+FieldType.BOOLEAN.toString())}
                                </MenuItem>
                                <MenuItem value={FieldType.DATETIME}>
                                    {translate("microgatewayApp.FieldType."+FieldType.DATETIME.toString())}
                                </MenuItem>
                                <MenuItem value={FieldType.NUMBER}>
                                    {translate("microgatewayApp.FieldType."+FieldType.NUMBER.toString())}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Box width={1} display="flex" alignItems="center">
                            <Typography className="mr-1">
                                {translate("microgatewayApp.micropartenerField.optinal")}
                            </Typography>
                            <FormControlLabel
                                label={field.optinal ? translate("_global.label.yes") : translate("_global.label.no")}
                                control={<Switch checked={!field.optinal}
                                    onChange={() => setField({...field, optinal: !field.optinal})} />}
                                className="mt-1"
                                />
                        </Box>
                    </Grid>
                    {/* <Grid item xs={12} sm={8}>
                        <Box width={1} display="flex" justifyContent="flex-end" alignItems="center">
                            <Typography className="mr-1">
                                {translate("microgatewayApp.micropartenerField.requestFiles")}
                            </Typography>
                            <FormControlLabel
                                label={field.requestFiles ? translate("_global.label.yes") : translate("_global.label.no")}
                                control={<Switch checked={field.requestFiles}
                                    onChange={() => setField({...field, requestFiles: !field.requestFiles})} />}
                                className="mt-1"
                                />
                        </Box>
                    </Grid> */}
                    <Grid item xs={12}>
                        <SaveButton 
                            type="submit"
                            disabled={!field || !field.type || !field.label}
                            className="float-right text-capitalize"
                        />
                    </Grid>
                </Grid>
            </form>
        </MyCustomModal>
        </React.Fragment>
    )
}

export default FieldUpdate;

