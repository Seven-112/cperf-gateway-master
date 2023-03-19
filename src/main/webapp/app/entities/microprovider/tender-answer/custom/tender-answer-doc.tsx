import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, IconButton, List, ListItem, ListItemText, makeStyles, Modal, Typography } from "@material-ui/core";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { API_URIS, navigateToBlankTab } from "app/shared/util/helpers";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import { translate } from "react-jhipster";
import { Close } from "@material-ui/icons";
import { ITenderAnswerDoc } from "app/shared/model/microprovider/tender-answer-doc.model";
import { useHistory } from "react-router-dom";

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
        color: theme.palette.primary.dark,
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
    answer: ITender,
    open?: boolean,
    onClose:Function
}

export const TenderAnswerDoc = (props: TenderDocProps) =>{
    const { answer, open } = props;
    const [docs, setDocs] = useState<ITenderAnswerDoc[]>([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    const getDocs = () =>{
        if(answer){
            setLoading(false)
            axios.get<ITenderAnswerDoc[]>(`${API_URIS.tenderAnswerDocApiUir}/?tenderAnswerId.equals=${answer.id}`)
                .then(res =>{
                    if(res.data)
                        setDocs([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    
    useEffect(() =>{
        getDocs();
    }, [props.answer])

    const handleOpenDoc = (doc?: ITenderAnswerDoc) =>{
        if(doc && doc.fileId){
            navigateToBlankTab(`/file-viewer/${doc.fileId}`);
        }
    }

    const handleClose = () => props.onClose();

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
                        title={translate("_tender.responseDocs")}
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
                                    <ListItem key={doc.id} button onClick={() => handleOpenDoc(doc)}>
                                        <ListItemText
                                            primary={doc.name}
                                            secondary={
                                                <Typography variant="caption" color="primary" className="ml-3">
                                                    {doc.tenderDoc ? `( ${doc.tenderDoc.description || ''} )` : '' }
                                                </Typography>
                                            }
                                         />
                                    </ListItem>
                                ))
                            ): (
                                !loading ? (
                                <ListItem>
                                    <ListItemText primary={<Typography>
                                        {translate("microgatewayApp.microproviderTenderAnswerDoc.home.notFound")}
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

export default TenderAnswerDoc;
