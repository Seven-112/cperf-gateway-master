import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Checkbox, colors, FormControlLabel, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Remove } from "@material-ui/icons";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { ITenderDoc } from "app/shared/model/microprovider/tender-doc.model";
import { API_URIS } from "app/shared/util/helpers";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles((theme) =>({
    root:{
        '&:hover':{
            background: colors.grey[100],
        }
    }
}))

interface TenderDocInlineFieldProps{
    tenderDoc:ITenderDoc,
    identifiant:any,
    locked?:boolean,
    onRemove?:Function,
    onChange?:Function,
}

export const TenderDocInlineField = (props: TenderDocInlineFieldProps) =>{
    const { locked } = props;
    const [doc, setDoc] = useState(props.tenderDoc);
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    useEffect(() =>{
        setDoc(props.tenderDoc)
    }, [props.tenderDoc])

    useEffect(() =>{
        if(props.onChange){
            props.onChange(doc, props.identifiant);
        }
    }, [doc])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDoc({...doc, [name]: value})
    }

    const handleRemove = () =>{
        if(doc.id){
            setOpen(true);
        }else{
            if(props.onRemove)
                props.onRemove(props.identifiant);
        }
    }

    const handleDelete = (deletedId?: any) =>{
        setOpen(false);
        if(props.onRemove)
            props.onRemove(props.identifiant);
    }

    return (
        <React.Fragment>
            {doc && <>
                {doc.id && <EntityDeleterModal 
                    open={open}
                    entityId={doc.id}
                    urlWithoutEntityId={API_URIS.tenderDocApiUri}
                    onClose={() => setOpen(false)}
                    onDelete={handleDelete}
                    question={translate("microgatewayApp.microproviderTenderDoc.delete.question", {id: ""})}
                />}
            <Box width={1} display="flex" justifyContent="space-between"
                alignItems="center" flexWrap="wrap" overflow={1} className={classes.root}>
                <Box flexGrow={1}>
                    <TextField  fullWidth
                        variant="outlined"
                        margin="dense"
                        name="description"
                        value={doc.description}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                        label={translate("microgatewayApp.microproviderTenderDoc.description")}
                    />
                </Box>
                <FormControlLabel className="ml-2" labelPlacement="start"
                    label={translate("microgatewayApp.microproviderTenderDoc.optional")}
                    control={<Checkbox checked={doc.optional} color="primary"
                         onChange={() => setDoc({...doc, optional: !doc.optional})}/>}
                />
                {!locked && 
                <IconButton onClick={handleRemove}
                 color="secondary" className="ml-2"
                 title={translate("entity.action.delete")}>
                    <FontAwesomeIcon icon={faMinusCircle} />
                </IconButton>}
            </Box>
            </>
            }
        </React.Fragment>
    )
}

export default TenderDocInlineField;