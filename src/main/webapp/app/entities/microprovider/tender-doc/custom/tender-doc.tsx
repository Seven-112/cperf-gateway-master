import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, FormControlLabel, Icon, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles, Modal, Typography } from "@material-ui/core";
import { ITenderDoc } from "app/shared/model/microprovider/tender-doc.model";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { API_URIS } from "app/shared/util/helpers";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import { translate } from "react-jhipster";
import { Close, Delete, Edit, FiberManualRecord } from "@material-ui/icons";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

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
        background: theme.palette.primary.main,
        color: 'white',
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

interface TenderDocProps{
    tender: ITender,
    open?: boolean,
    onClose?:Function
}

export const TenderDoc = (props: TenderDocProps) =>{
    const { tender, open } = props;
    const [docs, setDocs] = useState<ITenderDoc[]>([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    const getDocs = () =>{
        if(tender && tender.id){
            setLoading(false)
            axios.get<ITenderDoc[]>(`${API_URIS.tenderDocApiUri}/?tenderId.equals=${tender.id}`)
                .then(res =>{
                    if(res.data)
                        setDocs([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    
    useEffect(() =>{
        if(open){
            getDocs();
        }
    }, [props.tender, props.open])

    const handleClose = () => props.onClose(docs ? docs.length : 0);

    return (
        <React.Fragment>
            <Modal
                open={open}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout:300}}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
             >
                 <Card className={classes.card}>
                     <CardHeader 
                        title={translate("_global.label.requestedDocs")}
                        titleTypographyProps={{ variant: 'h4' }}
                        action={<IconButton color="inherit" onClick={handleClose}><Close /></IconButton>}
                        className={classes.cardheader}
                     />
                     <CardContent className={classes.cardcontent}>
                         {loading && 
                         <Box width={1} justifyContent="center" alignItems="center">
                             <CircularProgress /><Typography className="ml-2">Loading</Typography>
                         </Box>
                         }
                         <List>
                            {docs && docs.length !== 0 ? (
                                docs.map(doc => (
                                    <ListItem key={doc.id} button>
                                        <ListItemIcon>
                                            <FiberManualRecord  fontSize="large"/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={doc.description}
                                            secondary={
                                                <Typography variant="caption" color="primary" className="ml-3">
                                                    (
                                                    {doc.optional ? translate("microgatewayApp.microproviderTenderDoc.optional")
                                                                  : translate("_global.label.required")
                                                    })
                                                </Typography>
                                            }
                                         />
                                         <ListItemSecondaryAction>
                                             <FontAwesomeIcon icon={faLock} />
                                         </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ): (
                                !loading ? (
                                <ListItem>
                                    <ListItemText primary={<Typography>
                                        {translate("microgatewayApp.microproviderTenderDoc.home.notFound")}
                                    </Typography>}/>
                                </ListItem>
                                ):(
                                    ''
                                )
                            )}
                         </List>
                     </CardContent>
                 </Card>
            </Modal>
        </React.Fragment>
    )
}

export default TenderDoc;
