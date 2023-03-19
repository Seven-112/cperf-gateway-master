import { Backdrop, Box, makeStyles, Modal, Slide } from "@material-ui/core";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import React from "react"
import  TenderAnswerQuestionnaire from "./tender-answer-quetionnaire";

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
        background: theme.palette.grey[100],
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


interface TenderQnswerQuestionnaireValuesPisualizerProps{
    open?:boolean,
    answer:ITenderAnswer,
    onClose: Function,
}

export const TenderQnswerQuestionnaireValuesPisualizer = (props:TenderQnswerQuestionnaireValuesPisualizerProps) =>{
    const { open, answer } = props;
    const classes = useStyles();
    
    const handleClose = () => props.onClose();
    
    return (
        <React.Fragment> 
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            > 
                <Slide
                    in={open}
                    direction='down'
                    timeout={300}
                    >
                    <Box width={1} p={0} m={0} display="flex" justifyContent="center">
                        <TenderAnswerQuestionnaire 
                            answer={answer}
                            locked={true}
                            onClose={handleClose}
                        />
                    </Box>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}

export default TenderQnswerQuestionnaireValuesPisualizer;